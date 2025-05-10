import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getMovies, searchMovies } from '../services/movieService';
import MovieGrid from '../components/movies/MovieGrid';
import MovieFilter from '../components/movies/MovieFilter';
import { Movie, MovieFilter as FilterType } from '../types/movie';

const MoviesPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const searchQuery = searchParams.get('search') || '';
  
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterType>({
    searchQuery: searchQuery || undefined,
  });

  // Fetch movies
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = searchQuery 
          ? await searchMovies(searchQuery)
          : await getMovies();

        if (!Array.isArray(data)) {
          throw new Error('Invalid data format received from server');
        }

        setMovies(data);
        setFilteredMovies(data);
      } catch (error) {
        console.error('Error fetching movies:', error);
        setError(`Failed to load movies. ${error instanceof Error ? error.message : 'Please try again later.'}`);
        setMovies([]);
        setFilteredMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [searchQuery]);

  // Apply filters
  useEffect(() => {
    let result = [...movies];

    if (filters.genre) {
      result = result.filter(movie => 
        Array.isArray(movie.genre) && 
        movie.genre.includes(filters.genre!)
      );
    }

    if (filters.rating) {
      result = result.filter(movie => movie.vote_average >= filters.rating! * 2);
    }

    if (filters.searchQuery && !searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(movie => (
        movie.title.toLowerCase().includes(query) ||
        (Array.isArray(movie.genre) && 
         movie.genre.some(g => g.toLowerCase().includes(query)))
      ));
    }

    setFilteredMovies(result);
  }, [filters, movies, searchQuery]);

  const handleFilterChange = (newFilters: FilterType) => {
    setFilters({
      ...newFilters,
      searchQuery: searchQuery || newFilters.searchQuery,
    });

    if (newFilters.searchQuery && !searchQuery) {
      navigate(`/movies?search=${encodeURIComponent(newFilters.searchQuery)}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {searchQuery 
            ? `Search Results: "${searchQuery}"` 
            : filters.genre
              ? `${filters.genre} Movies`
              : 'Explore Movies'
          }
        </h1>
        {!error && (
          <p className="text-gray-400">
            {filteredMovies.length} {filteredMovies.length === 1 ? 'movie' : 'movies'} found
          </p>
        )}
      </div>

      <MovieFilter 
        onFilterChange={handleFilterChange} 
        initialFilters={{ searchQuery }}
      />
      
      {error ? (
        <div className="flex flex-col items-center justify-center py-16">
          <h3 className="text-xl font-semibold mb-2 text-red-500">Error</h3>
          <p className="text-gray-400">{error}</p>
          <div className="mt-4 space-y-2">
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Retry
            </button>
            <button 
              onClick={() => console.log({ movies, filteredMovies, filters })}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition ml-4"
            >
              Debug Data
            </button>
          </div>
        </div>
      ) : (
        <MovieGrid 
          movies={filteredMovies} 
          loading={loading}
          error={error}
        />
      )}
    </div>
  );
};

export default MoviesPage;