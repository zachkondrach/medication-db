import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ResearchLinks from '../components/ResearchLinks';
import { getCategoryColor } from '../utils/categoryColors';

function EffectivenessBar({ rating }) {
  return (
    <div className="flex items-center gap-1 mt-2">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className={`h-1.5 flex-1 rounded-full ${i < rating ? 'bg-emerald-500' : 'bg-gray-200'}`} />
      ))}
      <span className="text-xs text-gray-400 ml-1 shrink-0">{rating}/10</span>
    </div>
  );
}

function ConditionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [condition, setCondition] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/conditions/${id}`)
      .then(r => r.json())
      .then(data => { setCondition(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-center py-24 text-gray-400">Loading...</div>;
  if (!condition) return <div className="text-center py-24 text-gray-400">Condition not found</div>;

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
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getCategoryColor(condition.category)}`}>
            {condition.category}
          </span>
        </div>
      </div>

      <div className="px-4 py-8">
        <div className="bg-white rounded-xl shadow-md p-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{condition.name}</h1>
          <p className="text-gray-700 mt-5 leading-relaxed">{condition.description}</p>
          {condition.symptoms && (
            <div className="mt-5 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-sm text-gray-700"><span className="font-semibold">Common Symptoms:</span> {condition.symptoms}</p>
            </div>
          )}
        </div>

        {condition.medications?.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-8 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-5">Treatment Options</h2>
            <div className="space-y-3">
              {condition.medications.map(med => (
                <div
                  key={med.id}
                  className="border border-gray-100 rounded-lg p-4 cursor-pointer hover:bg-emerald-50 hover:border-emerald-200 transition"
                  onClick={() => navigate(`/medication/${med.id}`)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-emerald-700">{med.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${getCategoryColor(med.category)}`}>
                      {med.category}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mt-2">{med.reason}</p>
                  {med.effectivenessRating && <EffectivenessBar rating={med.effectivenessRating} />}
                </div>
              ))}
            </div>
          </div>
        )}

        {condition.research?.length > 0 && <ResearchLinks links={condition.research} />}
      </div>
    </div>
  );
}

export default ConditionDetail;
