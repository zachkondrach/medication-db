function MedicationCard({ medication }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition cursor-pointer h-full">
      <h3 className="text-xl font-semibold text-blue-600">{medication.name}</h3>
      {medication.genericName && <p className="text-gray-600 text-sm mt-1">Generic: {medication.genericName}</p>}
      <p className="text-xs bg-blue-100 text-blue-800 inline-block px-2 py-1 rounded mt-3">{medication.category}</p>
      <p className="text-gray-700 mt-4 line-clamp-3">{medication.description}</p>
      <p className="text-sm text-gray-500 mt-4">Click to view details and related conditions</p>
    </div>
  );
}

export default MedicationCard;
