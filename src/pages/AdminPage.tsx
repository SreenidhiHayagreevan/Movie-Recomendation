import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Film, LogOut, Upload, PlusCircle, RefreshCw, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getMovies, uploadMovieDataset } from '../services/movieService';
import { Movie } from '../types/movie';

const AdminPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadMode, setUploadMode] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<{
    loading: boolean;
    error: string | null;
    success: boolean;
  }>({
    loading: false,
    error: null,
    success: false,
  });

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await getMovies();
        setMovies(data);
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === 'text/csv') {
        setFile(selectedFile);
        setUploadStatus({ loading: false, error: null, success: false });
      } else {
        setUploadStatus({
          loading: false,
          error: 'Please select a valid CSV file',
          success: false,
        });
      }
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploadStatus({ loading: true, error: null, success: false });

    try {
      await uploadMovieDataset(file);
      setUploadStatus({
        loading: false,
        error: null,
        success: true,
      });
      
      // Refresh movie list
      const updatedMovies = await getMovies();
      setMovies(updatedMovies);
      
      // Reset form after successful upload
      setTimeout(() => {
        setUploadMode(false);
        setFile(null);
        setUploadStatus({ loading: false, error: null, success: false });
      }, 2000);
    } catch (error) {
      setUploadStatus({
        loading: false,
        error: 'Failed to upload dataset. Please try again.',
        success: false,
      });
    }
  };

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button 
          onClick={handleLogout}
          className="btn btn-secondary flex items-center"
        >
          <LogOut size={18} className="mr-2" />
          Logout
        </button>
      </div>

      <div className="bg-secondary-light rounded-lg p-6 mb-8">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mr-4">
            <Film size={24} className="text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Welcome, {user?.username}!</h2>
            <p className="text-gray-400">Manage your movie recommendation system</p>
          </div>
        </div>
      </div>

      {/* Dataset Upload */}
      <div className="bg-secondary-light rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Movie Dataset</h2>
        
        {uploadMode ? (
          <form onSubmit={handleUpload} className="animate-fade-in">
            <div className="mb-4">
              <label htmlFor="csv" className="block text-gray-300 mb-2">
                CSV File
              </label>
              <input
                id="csv"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="w-full bg-secondary border border-gray-700 rounded-md p-2"
                disabled={uploadStatus.loading}
              />
              <p className="mt-1 text-sm text-gray-400">
                Please upload the movie dataset CSV file.
              </p>
            </div>
            
            {uploadStatus.error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-md flex items-center text-red-400">
                <AlertCircle size={18} className="mr-2" />
                {uploadStatus.error}
              </div>
            )}
            
            {uploadStatus.success && (
              <div className="mb-4 p-3 bg-green-500/10 border border-green-500 rounded-md flex items-center text-green-400">
                <AlertCircle size={18} className="mr-2" />
                Dataset uploaded successfully!
              </div>
            )}
            
            <div className="flex space-x-3 mt-6">
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={!file || uploadStatus.loading}
              >
                {uploadStatus.loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload size={18} className="mr-2" />
                    Upload Dataset
                  </>
                )}
              </button>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => {
                  setUploadMode(false);
                  setFile(null);
                  setUploadStatus({ loading: false, error: null, success: false });
                }}
                disabled={uploadStatus.loading}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="flex items-center justify-between">
            <p className="text-gray-300">
              {movies.length > 0 
                ? `Database has ${movies.length} movies.` 
                : 'No movies in the database yet.'}
            </p>
            <button 
              className="btn btn-primary"
              onClick={() => setUploadMode(true)}
            >
              <Upload size={18} className="mr-2" />
              Upload Dataset
            </button>
          </div>
        )}
      </div>

      {/* Movie Management */}
      <div className="bg-secondary-light rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Movie Management</h2>
          <div className="flex space-x-3">
            <button className="btn btn-secondary">
              <RefreshCw size={18} className="mr-2" />
              Refresh
            </button>
            <button className="btn btn-primary">
              <PlusCircle size={18} className="mr-2" />
              Add Movie
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {movies.slice(0, 5).map((movie) => (
                  <tr key={movie.id}>
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
                      {movie.vote_average.toFixed(1)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      <div className="flex space-x-2">
                        <button className="text-blue-400 hover:text-blue-300">
                          Edit
                        </button>
                        <button className="text-red-400 hover:text-red-300">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {movies.length > 5 && (
              <div className="mt-4 text-center">
                <button className="text-primary hover:text-primary-light">
                  View All Movies
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;