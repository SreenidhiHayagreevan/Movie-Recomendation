import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getPaginatedMovies, searchMovies } from '../types/movieService';
import MovieGrid from '../components/movies/MovieGrid';
import MovieFilter from '../components/movies/MovieFilter';
import { Movie, MovieFilter as FilterType } from '../types/movie';
import Pagination from '../components/common/Pagination';

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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalMovies, setTotalMovies] = useState(0);
  const moviesPerPage = 30;

  // Fetch movies with pagination
  const fetchMovies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let data;
      if (searchQuery) {
        data = await searchMovies(searchQuery);
        setMovies(data);
        setFilteredMovies(data);
        setTotalPages(1);
        setTotalMovies(data.length);
      } else {
        const response = await getPaginatedMovies(currentPage, moviesPerPage);
        setMovies(response.movies);
        setFilteredMovies(response.movies);
        setTotalPages(Math.ceil(response.total / moviesPerPage));
        setTotalMovies(response.total);
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
      setError('Failed to load movies. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, currentPage]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

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
      result = result.filter(movie => 
        movie.title.toLowerCase().includes(query) ||
        (Array.isArray(movie.genre) && 
         movie.genre.some(g => g.toLowerCase().includes(query)))
      );
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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
        {!error && !searchQuery && (
          <p className="text-gray-400">
            Showing {movies.length} of {totalMovies} movies
          </p>
        )}
        {!error && searchQuery && (
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
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          <MovieGrid 
            movies={filteredMovies} 
            loading={loading}
            error={error}
          />
          {!searchQuery && totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MoviesPage;
