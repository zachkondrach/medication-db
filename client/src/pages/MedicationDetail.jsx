import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ResearchLinks from '../components/ResearchLinks';

function MedicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [medication, setMedication] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/medications/${id}`)
      .then(r => r.json())
      .then(data => {
        setMedication(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="text-center py-12"><p>Loading...</p></div>;
  if (!medication) return <div className="text-center py-12"><p>Medication not found</p></div>;

  return (
    <div className="px-4 py-8">
      <button
        onClick={() => navigate('/')}
        className="mb-6 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
      >
        ← Back
      </button>

      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h1 className="text-4xl font-bold mb-2">{medication.name}</h1>
        {medication.genericName && <p className="text-gray-600 text-lg">Generic: {medication.genericName}</p>}
        <p className="text-sm bg-blue-100 text-blue-800 inline-block px-3 py-1 rounded-lg mt-3">{medication.category}</p>
        <p className="text-gray-700 mt-6 leading-relaxed">{medication.description}</p>
      </div>

      {medication.conditions && medication.conditions.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Conditions Treated</h2>
          <div className="space-y-4">
            {medication.conditions.map(cond => (
              <div key={cond.id} className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition" onClick={() => navigate(`/condition/${cond.id}`)}>
                <h3 className="font-semibold text-lg text-blue-600">{cond.name}</h3>
                <p className="text-gray-600 text-sm mt-1">Category: {cond.category}</p>
                <p className="text-gray-700 mt-2"><strong>Reason:</strong> {cond.reason}</p>
                {cond.effectivenessRating && (
                  <p className="text-gray-700 mt-2">
                    <strong>Effectiveness:</strong> {Array(cond.effectivenessRating).fill('★').join('')}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {medication.research && medication.research.length > 0 && (
        <ResearchLinks links={medication.research} />
      )}
    </div>
  );
}

export default MedicationDetail;
