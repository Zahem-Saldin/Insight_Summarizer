
from fastapi import FastAPI, File, Form, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from pymongo.errors import PyMongoError
from . import sentiment_analysis
from . import keyword_extraction
from . import topic_modeling
from . import evaluation
from . import summarizer
import fitz
import httpx

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = AsyncIOMotorClient('mongodb+srv://Raptor:Raptor26@cluster0.7bkfx.mongodb.net/')
db = client['IRWA']

async def check_mongo_connection():
    try:
        await db.command("ping")
        print("MongoDB connected successfully")
    except PyMongoError as e:
        print("MongoDB connection error:", e)
        raise HTTPException(status_code=500, detail="Failed to connect to MongoDB")

@app.on_event("startup")
async def startup_db_client():
    await check_mongo_connection()

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

@app.get("/api/mongo-status")
async def mongo_status():
    try:
        await check_mongo_connection()
        return {"status": "MongoDB connection is healthy."}
    except HTTPException:
        return {"status": "MongoDB connection failed."}

@app.post("/api/process-text")
async def process_text(
    file: UploadFile = File(None),
    text: str = Form(...),
    reference_summary: str = Form(None),
    summary_length: int = Form(3)
):
    await check_mongo_connection()

    if file:

        if file.content_type == 'application/pdf':
            pdf_document = fitz.open(stream=await file.read(), filetype="pdf")
            content = ""
            for page in pdf_document:
                content += page.get_text()
            pdf_document.close()
        else:
            content = await file.read()
            content = content.decode('utf-8', errors='ignore')  # Handle potential decoding errors
    else:
        content = text

    if not content:
        raise HTTPException(status_code=400, detail="No content provided for summarization.")

    print("Reference Summary Received:", reference_summary)
    print("Summary Length:", summary_length)

    generated_summary = summarizer.summarize(content, summary_length=summary_length)
    print("Generated Summary:", generated_summary)

    sentiment = sentiment_analysis.analyze(content)
    print(sentiment)
    keywords = keyword_extraction.extract(content)
    print(keywords)
    topics = topic_modeling.identify_topics(content)

    document = {
        "content": content,
        "generated_summary": generated_summary,
        "reference_summary": reference_summary if reference_summary else None,
        "sentiment": sentiment,
        "keywords": keywords,
        "topics": topics
    }

    insert_result = await db.summaries.insert_one(document)
    document_id = str(insert_result.inserted_id)

    print("Inserted Document:", document)

    return {
        "summary": generated_summary,
        "sentiment": sentiment,
        "keywords": keywords,
        "topics": topics,
        "document_id": document_id
    }


@app.get("/api/summaries")
async def get_all_summaries():
    await check_mongo_connection()

    summaries = []
    cursor = db.summaries.find({})

    async for document in cursor:
        document["_id"] = str(document["_id"])
        summaries.append(document)

    return {"summaries": summaries}


@app.delete("/api/summaries/{summary_id}")
async def delete_summary(summary_id: str):

    await check_mongo_connection()

    try:
        # Attempt to delete the summary with the given ID
        result = await db.summaries.delete_one({"_id": ObjectId(summary_id)})

        # Check if a document was deleted
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Summary not found")
        return {"message": f"Summary with ID {summary_id} has been deleted."}

    except Exception as e:
        raise HTTPException(status_code=500, detail="Error deleting the summary")


@app.get("/api/summary/{summary_id}")
async def get_summary_by_id(summary_id: str):
    await check_mongo_connection()

    try:
        document = await db.summaries.find_one({"_id": ObjectId(summary_id)})
        if document:
            document["_id"] = str(document["_id"])
            return {"summary": document}
        else:
            raise HTTPException(status_code=404, detail="Summary not found")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/api/evaluate-summary/{document_id}")
async def evaluate_summary(
    document_id: str,
    reference_summary: str
):
    await check_mongo_connection()

    stored_document = await db.summaries.find_one({"_id": ObjectId(document_id)})


    if not stored_document:
        raise HTTPException(status_code=404, detail="Document not found")


    stored_generated_summary = stored_document.get("generated_summary")


    print("Stored Generated Summary:", stored_generated_summary)
    print("Reference Summary Provided:", reference_summary)


    if stored_generated_summary and reference_summary:
        summarization_scores = evaluation.evaluate_summarization(stored_generated_summary, reference_summary)
        print("Summarization Scores:", summarization_scores)
        return {
            "summarization_scores": summarization_scores,
            "generated_summary": stored_generated_summary,
            "reference_summary": reference_summary
        }
    else:
        raise HTTPException(status_code=400, detail="Summaries for evaluation are missing.")
