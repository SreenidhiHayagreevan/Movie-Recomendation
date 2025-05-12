import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getMovies } from '../services/movieService';
import { Movie } from '../types/movie';
import { ArrowLeft } from 'lucide-react';

const AllMoviesPage: React.FC = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllMovies = async () => {
      try {
        setLoading(true);
        const data = await getMovies();
        setMovies(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching movies:', err);
        setError('Failed to load movies. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllMovies();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-secondary-light rounded-lg p-8 max-w-md text-center">
          <h2 className="text-xl font-semibold mb-4">Error</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button 
            onClick={() => navigate('/admin')}
            className="btn btn-primary"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center mb-6">
        <Link 
          to="/admin" 
          className="flex items-center text-gray-400 hover:text-white mr-4"
        >
          <ArrowLeft size={20} className="mr-1" />
          Back
        </Link>
        <h1 className="text-2xl font-bold">All Movies ({movies.length})</h1>
      </div>
      
      <div className="bg-secondary-light rounded-lg overflow-hidden shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-secondary">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Genre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Rating
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {movies.map((movie) => (
                <tr key={movie.id} className="hover:bg-secondary-light">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {movie.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {movie.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {movie.genre}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {movie.vote_average?.toFixed(1) || 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllMoviesPage;