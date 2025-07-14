from transformers import pipeline, DistilBertTokenizer

sentiment_analyzer = pipeline('sentiment-analysis', model='distilbert/distilbert-base-uncased-finetuned-sst-2-english')
tokenizer = DistilBertTokenizer.from_pretrained('distilbert/distilbert-base-uncased-finetuned-sst-2-english')

def analyze(text, max_length=512):

    tokens = tokenizer.encode(text, truncation=True, max_length=max_length, return_tensors='pt').squeeze().tolist()

    chunks = [tokens[i:i + max_length] for i in range(0, len(tokens), max_length)]

    sentiments = []

    for chunk in chunks:

        chunk_text = tokenizer.decode(chunk, skip_special_tokens=True)

        result = sentiment_analyzer(chunk_text)
        sentiments.append({
            'label': result[0]['label'],
            'score': result[0]['score']
        })

    overall_sentiment = {
        'positive': sum(1 for s in sentiments if s['label'] == 'POSITIVE'),
        'negative': sum(1 for s in sentiments if s['label'] == 'NEGATIVE'),
        'score': sum(s['score'] for s in sentiments) / len(sentiments)
    }

    return overall_sentiment

