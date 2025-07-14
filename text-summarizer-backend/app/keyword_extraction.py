from sklearn.feature_extraction.text import TfidfVectorizer
import math

def extract(text):

    vectorizer = TfidfVectorizer(stop_words='english')

    tfidf_matrix = vectorizer.fit_transform([text])

    feature_names = vectorizer.get_feature_names_out()

    tfidf_scores = tfidf_matrix.toarray().flatten()

    word_scores = [{"keyword": feature_names[i], "score": tfidf_scores[i]} for i in range(len(feature_names)) if tfidf_scores[i] > 0]

    sorted_keywords = sorted(word_scores, key=lambda x: x['score'], reverse=True)

    num_keywords = max(1, math.ceil(len(text.split()) * 0.1))

    return sorted_keywords[:num_keywords]
















