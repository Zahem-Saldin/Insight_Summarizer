from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
from rouge_score import rouge_scorer

def evaluate_summarization(generated_summary, reference_summary):

    scorer = rouge_scorer.RougeScorer(['rouge1', 'rougeL'], use_stemmer=True)

    scores = scorer.score(reference_summary, generated_summary)

    return {
        "rouge1": {
            "precision": scores["rouge1"].precision,
            "recall": scores["rouge1"].recall,
            "f1": scores["rouge1"].fmeasure
        },
        "rougeL": {
            "precision": scores["rougeL"].precision,
            "recall": scores["rougeL"].recall,
            "f1": scores["rougeL"].fmeasure
        }
    }

def evaluate_sentiment(true_labels, predicted_labels):
    precision = precision_score(true_labels, predicted_labels, average='weighted')
    recall = recall_score(true_labels, predicted_labels, average='weighted')
    f1 = f1_score(true_labels, predicted_labels, average='weighted')
    accuracy = accuracy_score(true_labels, predicted_labels)
    return {
        "precision": precision,
        "recall": recall,
        "f1_score": f1,
        "accuracy": accuracy
    }

def evaluate_keywords(reference_keywords, extracted_keywords):
    tp = len(set(reference_keywords) & set(extracted_keywords))  
    fp = len(set(extracted_keywords) - set(reference_keywords)) 
    fn = len(set(reference_keywords) - set(extracted_keywords))  
    
    precision = tp / (tp + fp) if tp + fp > 0 else 0
    recall = tp / (tp + fn) if tp + fn > 0 else 0
    f1 = 2 * (precision * recall) / (precision + recall) if precision + recall > 0 else 0
    
    return {
        "precision": precision,
        "recall": recall,
        "f1_score": f1
    }

def evaluate_topic_model(model, texts, dictionary):
    from gensim.models.coherencemodel import CoherenceModel
    coherence_model = CoherenceModel(model=model, texts=texts, dictionary=dictionary, coherence='c_v')
    coherence_score = coherence_model.get_coherence()
    return coherence_score
