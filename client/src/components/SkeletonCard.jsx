function SkeletonCard() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 h-52 animate-pulse border border-gray-100">
      <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-3 bg-gray-200 rounded w-1/2 mb-4" />
      <div className="h-5 bg-gray-200 rounded-full w-1/4 mb-4" />
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded" />
        <div className="h-3 bg-gray-200 rounded w-5/6" />
        <div className="h-3 bg-gray-200 rounded w-4/6" />
      </div>
    </div>
  );
}

export default SkeletonCard;
