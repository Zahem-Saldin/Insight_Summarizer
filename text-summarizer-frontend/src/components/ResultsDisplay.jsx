const ResultsDisplay = ({ result }) => {
  console.log(result); // Check the structure of result

  const sentimentLabel = result.sentiment.positive > result.sentiment.negative
    ? 'Positive'
    : 'Negative';

  return (
    <div className="result-container">

      <h3>Summarization</h3>
      <p className="gen-summary">{result.summary}</p>
      <br></br>
      <h3>Sentiment Analysis</h3>
      <p>Label: {sentimentLabel}</p>
      <p>Score: {result.sentiment.score.toFixed(4)}</p>
      <br></br>
      <h3>Keywords</h3>
      <div className="keyword-section">
        <ul>
          {result.keywords.map((keywordObj, index) => (
            <li key={index}>
              <span>{keywordObj.keyword}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
              <span>{keywordObj.score.toFixed(4)}</span>
            </li>
          ))}
        </ul>
      </div>
      <br></br>
      <h3>Topics</h3>
      <ul className="topic-list">
        {result.topics.map((topic, index) => (
          <li key={index}>{topic}</li>
        ))}
      </ul>
      <br></br>
    </div>
  );
};

export default ResultsDisplay;
