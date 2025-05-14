export const SkeletonLoader = ({ type }) => {
  const skeletonTypes = {
    card: (
      <div className="animate-pulse bg-gray-100 rounded-lg p-4">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
      </div>
    ),
    list: (
      <div className="animate-pulse space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-12 bg-gray-100 rounded-lg"></div>
        ))}
      </div>
    )
  };

  return skeletonTypes[type] || null;
};