import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import MedicationDetail from './pages/MedicationDetail';
import ConditionDetail from './pages/ConditionDetail';

function PillIcon() {
  return (
    <svg width="48" height="24" viewBox="0 0 48 24" fill="none">
      <rect x="1" y="1" width="46" height="22" rx="11" stroke="white" strokeWidth="2" />
      <path d="M24 2H13C7.477 2 3 6.477 3 12C3 17.523 7.477 22 13 22H24V2Z" fill="white" />
      <line x1="24" y1="2" x2="24" y2="22" stroke="white" strokeWidth="1.5" strokeOpacity="0.5" />
    </svg>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-blue-700 to-blue-500 text-white shadow-lg sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-3">
          <PillIcon />
          <div>
            <h1 className="text-2xl font-bold tracking-tight leading-none">MedBase</h1>
            <p className="text-blue-100 text-xs mt-0.5">Medication &amp; Condition Reference</p>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/medication/:id" element={<MedicationDetail />} />
          <Route path="/condition/:id" element={<ConditionDetail />} />
        </Routes>
      </main>
      <footer className="bg-gray-800 text-gray-400 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-5 text-center text-sm">
          <p>For educational purposes only. Not a substitute for professional medical advice.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
