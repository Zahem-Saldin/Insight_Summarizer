import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TextUploader from './components/TextUploader';
import Summaries from './components/Summary';
import History from './components/History';
import Summary from './components/Summary';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<TextUploader />} />
          <Route path="/summaries" element={<Summaries />} />
          <Route path="/history" element={<History />} />
          <Route path="/summary/:id" element={<Summary />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

