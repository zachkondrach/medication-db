function ConditionCard({ condition }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition cursor-pointer h-full">
      <h3 className="text-xl font-semibold text-green-600">{condition.name}</h3>
      <p className="text-xs bg-green-100 text-green-800 inline-block px-2 py-1 rounded mt-3">{condition.category}</p>
      <p className="text-gray-700 mt-4 line-clamp-3">{condition.description}</p>
      {condition.symptoms && <p className="text-gray-600 text-sm mt-3">Symptoms: {condition.symptoms.substring(0, 50)}...</p>}
      <p className="text-sm text-gray-500 mt-4">Click to view treatment options</p>
    </div>
  );
}

export default ConditionCard;
