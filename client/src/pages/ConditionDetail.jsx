import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ResearchLinks from '../components/ResearchLinks';

function ConditionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [condition, setCondition] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/conditions/${id}`)
      .then(r => r.json())
      .then(data => {
        setCondition(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="text-center py-12"><p>Loading...</p></div>;
  if (!condition) return <div className="text-center py-12"><p>Condition not found</p></div>;

  return (
    <div className="px-4 py-8">
      <button
        onClick={() => navigate('/')}
        className="mb-6 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
      >
        ← Back
      </button>

      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h1 className="text-4xl font-bold mb-2">{condition.name}</h1>
        <p className="text-sm bg-green-100 text-green-800 inline-block px-3 py-1 rounded-lg mt-3">{condition.category}</p>
        <p className="text-gray-700 mt-6 leading-relaxed">{condition.description}</p>
        {condition.symptoms && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-gray-700"><strong>Common Symptoms:</strong> {condition.symptoms}</p>
          </div>
        )}
      </div>

      {condition.medications && condition.medications.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Treatment Options</h2>
          <div className="space-y-4">
            {condition.medications.map(med => (
              <div key={med.id} className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition" onClick={() => navigate(`/medication/${med.id}`)}>
                <h3 className="font-semibold text-lg text-blue-600">{med.name}</h3>
                <p className="text-gray-600 text-sm mt-1">Category: {med.category}</p>
                <p className="text-gray-700 mt-2"><strong>Why used:</strong> {med.reason}</p>
                {med.effectivenessRating && (
                  <p className="text-gray-700 mt-2">
                    <strong>Effectiveness:</strong> {Array(med.effectivenessRating).fill('★').join('')}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {condition.research && condition.research.length > 0 && (
        <ResearchLinks links={condition.research} />
      )}
    </div>
  );
}

export default ConditionDetail;
