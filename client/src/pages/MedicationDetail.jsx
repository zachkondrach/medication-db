import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ResearchLinks from '../components/ResearchLinks';
import { getCategoryColor } from '../utils/categoryColors';

function EffectivenessBar({ rating }) {
  return (
    <div className="flex items-center gap-1 mt-2">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className={`h-1.5 flex-1 rounded-full ${i < rating ? 'bg-blue-500' : 'bg-gray-200'}`} />
      ))}
      <span className="text-xs text-gray-400 ml-1 shrink-0">{rating}/10</span>
    </div>
  );
}

function MedicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [medication, setMedication] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/medications/${id}`)
      .then(r => r.json())
      .then(data => { setMedication(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-center py-24 text-gray-400">Loading...</div>;
  if (!medication) return <div className="text-center py-24 text-gray-400">Medication not found</div>;

  return (
    <div>
      <div className="sticky top-[72px] z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 text-sm font-medium transition"
          >
            ← Back to search
          </button>
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getCategoryColor(medication.category)}`}>
            {medication.category}
          </span>
        </div>
      </div>

      <div className="px-4 py-8">
        <div className="bg-white rounded-xl shadow-md p-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{medication.name}</h1>
          {medication.genericName && (
            <p className="text-gray-400 mt-1 text-sm">Generic: <span className="italic">{medication.genericName}</span></p>
          )}
          <p className="text-gray-700 mt-5 leading-relaxed">{medication.description}</p>
        </div>

        {medication.conditions?.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-8 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-5">Conditions Treated</h2>
            <div className="space-y-3">
              {medication.conditions.map(cond => (
                <div
                  key={cond.id}
                  className="border border-gray-100 rounded-lg p-4 cursor-pointer hover:bg-blue-50 hover:border-blue-200 transition"
                  onClick={() => navigate(`/condition/${cond.id}`)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-blue-600">{cond.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${getCategoryColor(cond.category)}`}>
                      {cond.category}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mt-2">{cond.reason}</p>
                  {cond.effectivenessRating && <EffectivenessBar rating={cond.effectivenessRating} />}
                </div>
              ))}
            </div>
          </div>
        )}

        {medication.research?.length > 0 && <ResearchLinks links={medication.research} />}
      </div>
    </div>
  );
}

export default MedicationDetail;
