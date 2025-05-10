import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Calendar } from 'lucide-react';
import { Movie } from '../../types/movie';
import { getGenreColor } from '../../utils/helpers';

interface MovieCardProps {
  movie: Movie;
  showDetails?: boolean;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, showDetails = false }) => {
  // Default poster image
  const defaultPoster = 'https://images.pexels.com/photos/1117132/pexels-photo-1117132.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
  
  // Format runtime if available
  const formatRuntime = (minutes: number | undefined) => {
    if (!minutes) return null;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <Link 
      to={`/movies/${movie.id}`} 
      className="movie-card card group block rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-800"
      aria-label={`View details for ${movie.title}`}
    >
      <div className="relative aspect-[2/3] overflow-hidden">
        {/* Image with lazy loading and error fallback */}
        <img
          src={movie.poster_path || defaultPoster}
          alt={`Poster for ${movie.title}`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = defaultPoster;
          }}
        />
        
        {/* Overlay with movie details */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Star size={16} fill="#ffc107" className="text-yellow-400" />
            <span className="text-white font-medium text-sm">
              {movie.vote_average?.toFixed(1) || 'N/A'}
            </span>
            
            {'runtime' in movie && movie.runtime && (
              <>
                <span className="text-white/50">•</span>
                <Clock size={16} className="text-white/80" />
                <span className="text-white text-sm">
                  {formatRuntime(movie.runtime)}
                </span>
              </>
            )}
          </div>
          
          {'release_date' in movie && movie.release_date && (
            <div className="flex items-center space-x-1 mb-2">
              <Calendar size={14} className="text-white/80" />
              <span className="text-white text-sm">
                {new Date(movie.release_date).getFullYear()}
              </span>
            </div>
          )}
          
          {showDetails && 'overview' in movie && (
            <p className="text-white/80 text-xs line-clamp-3">
              {movie.overview}
            </p>
          )}
        </div>
      </div>
      
      <div className="p-4">
        <h3 
          className="font-semibold text-lg mb-1 line-clamp-1 dark:text-white"
          title={movie.title}
        >
          {movie.title}
        </h3>
        
        <div className="flex flex-wrap gap-1">
          {Array.isArray(movie.genre) ? (
            movie.genre.slice(0, 3).map((genre) => (
              <span 
                key={genre} 
                className={`text-xs px-2 py-1 rounded-full ${getGenreColor(genre)}`}
              >
                {genre}
              </span>
            ))
          ) : (
            <span className="text-gray-400 text-sm">{movie.genre}</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;