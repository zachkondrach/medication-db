import { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import MedicationDetail from './pages/MedicationDetail';
import ConditionDetail from './pages/ConditionDetail';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">Medication Database</h1>
          <p className="text-blue-100 mt-2">Search medications and conditions with research links</p>
        </div>
      </header>
      <main className="max-w-7xl mx-auto">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/medication/:id" element={<MedicationDetail />} />
          <Route path="/condition/:id" element={<ConditionDetail />} />
        </Routes>
      </main>
      <footer className="bg-gray-800 text-gray-100 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center">
          <p>Educational purposes only. Not a substitute for professional medical advice.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
