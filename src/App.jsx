import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import CreatorPage from './components/CreatorPage';
import ProposalPage from './components/ProposalPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-pink-100 text-gray-800 font-sans">
        <Routes>
          <Route path="/" element={<CreatorPage />} />
          <Route path="/valentine" element={<ProposalPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
