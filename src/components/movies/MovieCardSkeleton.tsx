import React from 'react';

const MovieCardSkeleton: React.FC = () => {
  return (
    <div className="card animate-pulse">
      <div className="bg-gray-700 aspect-[2/3]"></div>
      <div className="p-4">
        <div className="h-5 bg-gray-700 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-700 rounded w-1/2"></div>
      </div>
    </div>
  );
};

export default MovieCardSkeleton;