📝 NLP Insight Engine: Text Summarization & Analysis

A powerful full-stack application designed to process large text documents or PDFs. This tool leverages state-of-the-art Transformer models (BART, DistilBERT) to provide automated summarization, sentiment analysis, keyword extraction, and topic modeling, all backed by a robust FastAPI backend and a React-based frontend.
✨ Key Features

  📄 Smart Summarization: Uses the BART-large-cnn model to generate concise summaries from long-form text or uploaded PDF files.
  📊 Sentiment Analysis: Analyzes emotional tone using DistilBERT, providing a breakdown of positive vs. negative sentiment.
  🏷️ Keyword Extraction: Automatically identifies the most significant terms in a document using TF-IDF vectorization.
  🗂️ Topic Modeling: Discovers underlying themes within the text using Latent Dirichlet Allocation (LDA).
  🧪 Evaluation Metrics: Integrated ROUGE scoring (ROUGE-1, ROUGE-L) to compare generated summaries against reference texts.
  🗄️ Persistence: All processed documents and results are stored in MongoDB for historical tracking and management.


🛠️ Tech Stack

Backend:

  FastAPI: High-performance Python web framework.
  Hugging Face Transformers: BART and DistilBERT models.
  Gensim & NLTK: For topic modeling and text processing.
  MongoDB: NoSQL database for document storage via motor (async driver).

Frontend:

  React: Modern UI development.
  Axios: For seamless API communication.

🚀 Getting Started
Prerequisites

  Python 3.9+
  Node.js & npm
  MongoDB Instance (Local or Atlas)

1. Backend Setup

  Navigate to the backend directory:
    
    cd text-summarizer-backend

Install dependencies:

    pip install -r requirements.txt

Create a .env file in the root backend folder:

    MONGO_URI=your_mongodb_connection_string
    MONGO_DB=IRWA

Run the application:

    python run.py

  The API will be available at http://localhost:8000

2. Frontend Setup

  Navigate to the frontend directory:

    cd frontend

Install dependencies:

    npm install

Start the development server:

    npm start

  The dashboard will be available at http://localhost:3000

🛰️ API Endpoints

  Method	Endpoint	                  Description
  POST	  /api/process-text	Process   PDF/Text for summary, sentiment, and topics.
  GET	    /api/summaries	            Retrieve all historical processing results.
  GET	    /api/evaluate-summary/{id}	Calculate ROUGE scores against a reference summary.
  DELETE	/api/summaries/{id}	        Remove a stored summary from the database.

🧪 Evaluation System

The system evaluates text quality using standard NLP metrics:

  ROUGE-1: Overlap of individual words (unigrams).
  ROUGE-L: Longest Common Subsequence (captures sentence structure).
  Precision/Recall/F1: For keyword and sentiment accuracy.

🤝 Contributing

  Fork the Project
  Create your Feature Branch (git checkout -b feature/NewFeature)
  Commit your Changes (git commit -m 'Add some NewFeature')
  Push to the Branch (git push origin feature/NewFeature)
  Open a Pull Request
