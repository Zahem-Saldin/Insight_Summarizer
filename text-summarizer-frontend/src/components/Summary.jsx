import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Summary = () => {
  const { id: summaryId } = useParams();
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [referenceSummary, setReferenceSummary] = useState('');
  const [result, setResult] = useState({});
  const navigate = useNavigate();

  const handleReferenceSummaryChange = (event) => {
    setReferenceSummary(event.target.value);
  };

  const handleEvaluate = async () => {
  if (!referenceSummary || !summaryId) {
    setError('Please provide a reference summary and ensure that a document has been processed.');
    return;
  }



  try {
    const evaluationResponse = await axios.get(`http://localhost:8000/api/evaluate-summary/${summaryId}`, {
      params: { reference_summary: referenceSummary },
    });
    console.log('Evaluation Response:', evaluationResponse.data);

    setResult((prev) => ({
      ...prev,
      [summaryId]: evaluationResponse.data.summarization_scores,
    }));
  } catch (error) {
    console.error('Error during evaluation:', error);
    setError('Failed to evaluate the summarization. Please try again.');
  }
};


  useEffect(() => {
    const fetchSummaryData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/summary/${summaryId}`);
        setSummaryData(response.data.summary);
      } catch (err) {
        setError('Failed to fetch summary data');
      } finally {
        setLoading(false);
      }
    };

    fetchSummaryData();
  }, [summaryId]);

  const history = () => {
    navigate('/history');
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const sentimentLabel = summaryData?.sentiment?.positive > summaryData?.sentiment?.negative ? 'Positive' : 'Negative';

  return (
    <div className="container">
      <div className="summary-output">
        <button className="summary-back-button" onClick={history}>Back</button>
        <div className="result-container">
          <h3>Summarization</h3>
          <p className="gen-summary">{summaryData?.generated_summary}</p>
          <br />
          <h3>Sentiment Analysis</h3>
          <p>Score: {summaryData?.sentiment?.score?.toFixed(4)}</p>
          <p>Label: {sentimentLabel}</p>
          <br />

          <h3>Keywords</h3>
          <div className="keyword-section">
            <ul>
              {summaryData?.keywords?.map((keywordObj, index) => (
                <li key={index}>
                  <span>{keywordObj.keyword}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                  <span>{keywordObj.score.toFixed(4)}</span>
                </li>
              ))}
            </ul>
          </div>
          <br />
          <h3>Topics</h3>
          <ul className="topic-list">
            {summaryData?.topics?.map((topic, index) => (
              <li key={index}>{topic}</li>
            ))}
          </ul>
          <br />
        </div>
        <h3>Enter Reference Summary for Evaluation</h3>
        <textarea
          placeholder="Paste reference summary here"
          value={referenceSummary}
          onChange={handleReferenceSummaryChange}
          className="input-text"
        />
        <br /><br />
        <button onClick={handleEvaluate} className="evaluation-btn">Get Evaluation Scores</button>
        <br /><br />

        {result[summaryId]?.rouge1 ? (
  <div>
    <h3 className="summ-scores">Summarization Scores</h3>
    <div className="score-container">
      <div className="score-box">
        <h4 className="score-type">ROUGE&nbsp;-&nbsp;1&nbsp;</h4>
        <p>
          <strong>F1 Score&nbsp;:&nbsp;</strong> {result[summaryId]?.rouge1?.f1?.toFixed(4)}
        </p>
        <p>
          <strong>Recall&nbsp;:&nbsp;</strong> {result[summaryId]?.rouge1?.recall?.toFixed(4)}
        </p>
        <p>
          <strong>Precision&nbsp;:&nbsp;</strong> {result[summaryId]?.rouge1?.precision?.toFixed(4)}
        </p>
      </div>
      <div className="score-box">
        <h4 className="score-type">ROUGE&nbsp;-&nbsp;L&nbsp;</h4>
        <p>
          <strong>F1 Score&nbsp;:&nbsp;</strong> {result[summaryId]?.rougeL?.f1?.toFixed(4)}
        </p>
        <p>
          <strong>Recall&nbsp;:&nbsp;</strong> {result[summaryId]?.rougeL?.recall?.toFixed(4)}
        </p>
        <p>
          <strong>Precision&nbsp;:&nbsp;</strong> {result[summaryId]?.rougeL?.precision?.toFixed(4)}
        </p>
      </div>
    </div>
  </div>
) : (
  <p>No summarization scores available.</p>
)}



      </div>
    </div>
  );
};

export default Summary;
