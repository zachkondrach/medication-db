import { getCategoryColor } from '../utils/categoryColors';

function MedicationCard({ medication }) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-200 cursor-pointer h-full border border-gray-100 flex flex-col">
      <div className="p-6 flex-1">
        <h3 className="text-lg font-semibold text-gray-900 leading-tight">{medication.name}</h3>
        {medication.genericName && (
          <p className="text-gray-400 text-xs mt-1">{medication.genericName}</p>
        )}
        <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full mt-3 ${getCategoryColor(medication.category)}`}>
          {medication.category}
        </span>
        <p className="text-gray-600 text-sm mt-3 line-clamp-3 leading-relaxed">{medication.description}</p>
      </div>
      <div className="px-6 pb-4">
        <p className="text-xs text-blue-500 font-medium">View details →</p>
      </div>
    </div>
  );
}

export default MedicationCard;
