from gensim import corpora
from gensim.models import LdaModel
from nltk.corpus import stopwords
import string

def identify_topics(text, num_topics=5):
    stop_words = set(stopwords.words('english'))
    tokens = [word for word in text.lower().split() if word not in stop_words and word not in string.punctuation]

    if len(tokens) < 10:
        return "Insufficient data for topic modeling."

    dictionary = corpora.Dictionary([tokens])
    corpus = [dictionary.doc2bow(tokens)]

    lda_model = LdaModel(corpus, num_topics=num_topics, id2word=dictionary, passes=15, random_state=42)

    topics = lda_model.print_topics(num_words=5)
    return topics














