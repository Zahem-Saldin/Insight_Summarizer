import React, { useState, useRef } from 'react';
import axios from 'axios';
import ResultsDisplay from './ResultsDisplay';
import { useNavigate } from 'react-router-dom';
import '../index.css';

const TextUploader = () => {
  const [file, setFile] = useState(null);
  const [text, setText] = useState('');
   const [fileName, setFileName] = useState('');
  const [result, setResult] = useState(null);
  const [referenceSummary, setReferenceSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const [summaryLength, setSummaryLength] = useState(3);

  const handleSummaryLengthChange = (event) => {
    setSummaryLength(event.target.value);
  };

  const goToSummaries = () => {
    navigate('/history');
  };

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
    setFileName(uploadedFile ? uploadedFile.name : '');
  };

  const handleClear = () => {
    setText('');
    setFile(null);
    setFileName('');
    setResult(null);
    setReferenceSummary('');
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleReferenceSummaryChange = (e) => {
    setReferenceSummary(e.target.value);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    if (file) formData.append('file', file);
    formData.append('text', text);
    formData.append('summary_length', summaryLength);

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:8000/api/process-text', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(response.data);
    } catch (error) {
      console.error('Error uploading the data:', error);
      setError('Upload Failed. Please Try Again!');
    } finally {
      setLoading(false);
    }
  };

  const handleEvaluate = async () => {
    if (!referenceSummary || !result?.document_id) {
      setError('Please provide a reference summary and ensure that a document has been processed.');
      return;
    }

    try {
      const evaluationResponse = await axios.get(`http://localhost:8000/api/evaluate-summary/${result.document_id}`, {
        params: { reference_summary: referenceSummary },
      });
      setResult((prev) => ({
        ...prev,
        summarization_scores: evaluationResponse.data.summarization_scores,
      }));
    } catch (error) {
      console.error('Error during evaluation:', error);
      setError('Failed to evaluate the summarization. Please try again.');
    }
  };

  return (
    <div className="container">
      <h1 className="text">TEXT</h1>
      <h1 className="summarizer">SUMMARIZER</h1>
      <br></br><br></br>
      <hr></hr>
      <br></br><br></br>
      <button onClick={goToSummaries} className="history">History</button>
      <br></br><br></br>
      <div className="text-section">
        <h4 className="title">Summarize {fileName && <span>{fileName}</span>}</h4>
        <div className="slider-container">
          <label>Summary Length &nbsp;&nbsp;</label>
          <input
            type="range"
            min="1"
            max="10"
            value={summaryLength}
            onChange={handleSummaryLengthChange}
            className="slider"
            style={{
              background: `linear-gradient(to right, #FF9100 ${((summaryLength - 1) / 9) * 100}%, #ddd ${((summaryLength - 1) / 9) * 100}%)`,
            }}
          />
          &nbsp;&nbsp;
          <label>{summaryLength}</label>
        </div>
        <textarea
          placeholder="Paste your text here"
          value={text}
          onChange={handleTextChange}
          className="input-text"
        />

        <br></br><br></br>
        <div class="button-container">
          <label class="file-upload">
            Browse
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="file-input" />
          </label>

          <button onClick={handleClear} className="clear-btn">Clear</button>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <button onClick={handleUpload} className="summarize-btn" disabled={loading}>
            {loading ? 'Summarizing...' : 'Summarize'}
          </button>
        </div>
      </div>

      {error && <div style={{ color: 'red' }}>{error}</div>}

      {result && (
        <div className="summary-output">
          <ResultsDisplay result={result} />
          <h3>Enter Reference Summary for Evaluation</h3>
          <textarea
            placeholder="Paste reference summary here"
            value={referenceSummary}
            onChange={handleReferenceSummaryChange}
            className="input-text"
          />
          <br></br><br></br>
          <button onClick={handleEvaluate} className="evaluation-btn">Get Evaluation Scores</button>
          <br></br><br></br>
          {result.summarization_scores ? (
            <div>
              <h3 className="summ-scores">Summarization Scores</h3>
              <div className="score-container">
                <div className="score-box">
                  <h4 className="score-type">ROUGE&nbsp;-&nbsp;1&nbsp;</h4>
                  <p>
                    <strong>F1 Score&nbsp;:&nbsp;</strong> {result.summarization_scores.rouge1.f1.toFixed(4)}
                  </p>
                  <p>
                    <strong>Recall&nbsp;:&nbsp;</strong> {result.summarization_scores.rouge1.recall.toFixed(4)}
                  </p>
                  <p>
                    <strong>Precision&nbsp;:&nbsp;</strong> {result.summarization_scores.rouge1.precision.toFixed(4)}
                  </p>
                </div>
                <div className="score-box">
                  <h4 className="score-type">ROUGE&nbsp;-&nbsp;L&nbsp;</h4>
                  <p>
                    <strong>F1 Score&nbsp;:&nbsp;</strong> {result.summarization_scores.rougeL.f1.toFixed(4)}
                  </p>
                  <p>
                    <strong>Recall&nbsp;:&nbsp;</strong> {result.summarization_scores.rougeL.recall.toFixed(4)}
                  </p>
                  <p>
                    <strong>Precision&nbsp;:&nbsp;</strong> {result.summarization_scores.rougeL.precision.toFixed(4)}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <p>No summarization scores available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default TextUploader;
