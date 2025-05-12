import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, Calendar, Star, ArrowLeft } from 'lucide-react';
import { getMovieById, rateMovie } from '../services/movieService';
import StarRating from '../components/movies/StarRating';
import { MovieDetail } from '../types/movie';

const MovieDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRating, setUserRating] = useState<number>(0);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
const [externalError, setExternalError] = useState(false);
const [localError, setLocalError] = useState(false);

const movieTitleWithoutYear = movie?.title
  ? movie.title.replace(/\s+/g, '').toLowerCase().trim()
  : '';
const localPosterPath = movieTitleWithoutYear ? `/media/${movieTitleWithoutYear}.jpg` : '';

//const movieTitleWithoutYear = movie.title.replace(/\s+/g, '').toLowerCase().trim();
//const localPosterPath = `/media/${movieTitleWithoutYear}.jpg`;

  useEffect(() => {
    const fetchMovie = async () => {
      setLoading(true);
      try {
        if (!id) {
          throw new Error('Movie ID is required');
        }
        const data = await getMovieById(parseInt(id));
        setMovie(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching movie:', err);
        setError('Failed to load movie details.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  const handleRateMovie = async (rating: number) => {
    if (!movie) return;
    
    try {
      await rateMovie(movie.id, rating);
      setUserRating(rating);
      setRatingSubmitted(true);
      
      // Reset after 3 seconds
      setTimeout(() => {
        setRatingSubmitted(false);
      }, 3000);
    } catch (err) {
      console.error('Error rating movie:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
        <p className="text-gray-400">Loading movie details...</p>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="bg-secondary-light rounded-lg p-8 text-center">
        <h2 className="text-2xl font-semibold mb-4">Error</h2>
        <p className="text-gray-300 mb-6">{error || 'Movie not found'}</p>
        <Link to="/movies" className="btn btn-primary">
          Back to Movies
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Back button */}
      <Link to="/movies" className="flex items-center text-gray-400 hover:text-white mb-6">
        <ArrowLeft size={18} className="mr-1" />
        Back to Movies
      </Link>

<div className="bg-secondary-light rounded-lg overflow-hidden shadow-xl mb-8">
  <div className="flex flex-col md:flex-row">
    {/* Movie Poster */}
    <div className="md:w-1/3 aspect-[2/3] md:aspect-auto">
      {!externalError ? (
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={`Poster for ${movie.title}`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          onError={() => setExternalError(true)}
        />
      ) : !localError ? (
        <img
          src={localPosterPath}
          alt={`Local poster for ${movie.title}`}
          className="w-full h-full object-cover"
          onError={() => setLocalError(true)}
        />      
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center rounded-xl">
          <span className="text-3xl font-extrabold text-white text-center px-4 drop-shadow-lg tracking-wide">
            {movie.title}
          </span>
        </div>
      )}
    </div>





   {/* Movie Info */}
          <div className="md:w-2/3 p-6 md:p-8">
            <h1 className="text-3xl font-bold mb-2">{movie.title}</h1>
            
            <div className="flex flex-wrap items-center text-sm text-gray-400 mb-4 gap-x-4 gap-y-2">
              <div className="flex items-center">
                <Calendar size={16} className="mr-1" />
                {movie.release_date}
              </div>
              <div className="flex items-center">
                <Clock size={16} className="mr-1" />
                {movie.runtime} min
              </div>
              <div className="flex items-center">
                <Star size={16} className="mr-1 text-accent" />
                {movie.vote_average.toFixed(1)} ({movie.ratings} ratings)
              </div>
              <span className="bg-secondary-dark text-gray-300 px-2 py-1 rounded">
                {movie.genre}
              </span>
            </div>
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Overview</h2>
              <p className="text-gray-300 leading-relaxed">
                {movie.overview}
              </p>
            </div>
            
            <div className="border-t border-gray-700 pt-6">
              <h2 className="text-xl font-semibold mb-3">Rate This Movie</h2>
              {ratingSubmitted ? (
                <div className="flex items-center text-green-500 mb-2 animate-fade-in">
                  <Star size={18} className="mr-2" fill="currentColor" />
                  Thank you for rating!
                </div>
              ) : (
                <p className="text-gray-400 mb-2">
                  Share your opinion with other movie fans
                </p>
              )}
              <StarRating
                initialRating={userRating}
                onRatingChange={handleRateMovie}
              />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default MovieDetailPage;
