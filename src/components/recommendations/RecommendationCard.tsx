import React from 'react';
import { Link } from 'react-router-dom';
import { ThumbsUp } from 'lucide-react';
import { Movie } from '../../types/movie';
import StarRating from '../movies/StarRating';
import MoviePoster from './MoviePoster';


interface RecommendationCardProps {
  movie: Movie;
  matchScore: number; // A percentage value from 0-100
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ movie, matchScore }) => {
  return (
    <div className="bg-secondary-light rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="flex flex-col md:flex-row">
        {/* Movie Poster */}
        <div className="md:w-1/3 aspect-[2/3] md:aspect-auto">
  		<MoviePoster title={movie.title} posterPath={movie.poster_path} className="rounded-xl" />
          {/* Match Score */}
          <div className="absolute top-2 right-2 bg-primary rounded-full w-12 h-12 flex items-center justify-center">
            <span className="text-white font-bold">{matchScore}%</span>
          </div>
        </div>
        
        {/* Movie Info */}
        <div className="md:w-2/3 p-5">
          <h3 className="text-xl font-semibold mb-2">{movie.title}</h3>
          
          <div className="mb-3">
            <StarRating initialRating={Math.round(movie.vote_average / 2)} readonly size={18} />
          </div>
          
          <p className="text-gray-400 mb-4">
            <span className="bg-secondary-dark text-gray-300 px-2 py-1 rounded text-xs mr-2">
              {movie.genre}
            </span>
          </p>
          
          <p className="text-gray-300 mb-4">
            Because you liked movies in the {movie.genre} genre with similar ratings.
          </p>
          
          <div className="flex space-x-3">
            <Link to={`/movies/${movie.id}`} className="btn btn-primary">
              View Details
            </Link>
            <button className="btn btn-secondary">
              <ThumbsUp size={18} className="mr-2" />
              Like This
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationCard;
