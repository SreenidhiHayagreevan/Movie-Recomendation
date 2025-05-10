import React from 'react';
import MovieCard from './MovieCard';
import { Movie } from '../../types/movie';
import MovieCardSkeleton from './MovieCardSkeleton';

interface MovieGridProps {
  movies: Movie[];
  loading?: boolean;
  error?: string | null;
}

const MovieGrid: React.FC<MovieGridProps> = ({ 
  movies = [], 
  loading = false, 
  error = null 
}) => {
  // Show error state if exists
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <h3 className="text-xl font-semibold mb-2 text-red-500">Error</h3>
        <p className="text-gray-400">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  // Show loading skeletons when loading
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {Array.from({ length: 10 }).map((_, index) => (
          <MovieCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  // Show empty state if no movies
  if (!movies.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <h3 className="text-xl font-semibold mb-2">No movies found</h3>
        <p className="text-gray-400">Try adjusting your filters or search query</p>
      </div>
    );
  }

  // Render the actual movie grid
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
};

export default MovieGrid;