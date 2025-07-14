import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../index.css';
import { useNavigate } from 'react-router-dom';

function History() {
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSummaries();
  }, []);

  const fetchSummaries = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/summaries');
      setSummaries(response.data.summaries);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch summaries');
      setLoading(false);
    }
  };

  const deleteSummary = async (summaryId) => {
    try {
      await axios.delete(`http://localhost:8000/api/summaries/${summaryId}`);
      fetchSummaries();
    } catch (err) {
      console.error('Failed to delete summary:', err);
    }
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.slice(0, maxLength) + '...';
  };

  const handleCardClick = (summaryId) => {
    navigate(`/summary/${summaryId}`);
  };

  const homepage = () => {
    navigate('/');
  };


  if (loading) return <p>Loading History...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1 className="title-history">History</h1>
      <button className="back-button" onClick={homepage}>Back</button>
      <div className="summaries-container">
        {summaries.map((summary) => (
          <div key={summary.id} className="summary-card">
            <h3>{summary.title}</h3>
            <p onClick={() => handleCardClick(summary._id)}>{truncateText(summary.content, 150)}</p>
            <button onClick={() => deleteSummary(summary._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default History;
