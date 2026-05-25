import { getCategoryColor } from '../utils/categoryColors';

function ConditionCard({ condition }) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-200 cursor-pointer h-full border border-gray-100 flex flex-col">
      <div className="p-6 flex-1">
        <h3 className="text-lg font-semibold text-gray-900 leading-tight">{condition.name}</h3>
        <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full mt-3 ${getCategoryColor(condition.category)}`}>
          {condition.category}
        </span>
        <p className="text-gray-600 text-sm mt-3 line-clamp-3 leading-relaxed">{condition.description}</p>
        {condition.symptoms && (
          <p className="text-gray-400 text-xs mt-3 line-clamp-1">
            <span className="font-medium text-gray-500">Symptoms:</span> {condition.symptoms}
          </p>
        )}
      </div>
      <div className="px-6 pb-4">
        <p className="text-xs text-emerald-500 font-medium">View treatments →</p>
      </div>
    </div>
  );
}

export default ConditionCard;
