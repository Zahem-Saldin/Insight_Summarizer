from transformers import pipeline, BartTokenizer

tokenizer = BartTokenizer.from_pretrained("facebook/bart-large-cnn", clean_up_tokenization_spaces=False)
summarizer_pipeline = pipeline("summarization", model="facebook/bart-large-cnn", tokenizer=tokenizer)

def summarize(text, chunk_size=512, summary_length=None):

    tokens = summarizer_pipeline.tokenizer.encode(text)
    chunks = [tokens[i:i + chunk_size] for i in range(0, len(tokens), chunk_size)]
    summaries = []

    for token_chunk in chunks:
        try:
            chunk = summarizer_pipeline.tokenizer.decode(token_chunk, skip_special_tokens=True)

            if len(token_chunk) > 1024:
                raise ValueError("Chunk exceeds maximum token length")

            # Ensure summary_length is passed and greater than 0
            if summary_length is None or summary_length <= 0:
                raise ValueError("Invalid summary length")

            # Set min_length and max_length based on token_chunk length and summary_length
            min_length = max(1, len(token_chunk) // summary_length)
            max_length = min(512, len(token_chunk))  # Cap max_length at 512 tokens

            summary_output = summarizer_pipeline(chunk, min_length=min_length, max_length=max_length, do_sample=False)
            if summary_output and isinstance(summary_output, list) and 'summary_text' in summary_output[0]:
                summaries.append(summary_output[0]['summary_text'])
            else:
                summaries.append("Summary could not be generated for this chunk.")
        except Exception as e:
            summaries.append(f"An error occurred: {e}")

    return ' '.join(summaries)
