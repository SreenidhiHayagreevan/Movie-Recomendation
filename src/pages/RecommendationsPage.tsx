import React, { useEffect, useState } from 'react';
import { getRecommendations, getUserRatings } from '../types/movieService';
import { Movie, Rating } from '../types/movie';
import RecommendationCard from '../components/recommendations/RecommendationCard';
import { Link } from 'react-router-dom';

const RecommendationsPage: React.FC = () => {
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [userRatings, setUserRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    setIsAuthenticated(!!token && !!user);

    const fetchData = async () => {
      setLoading(true);
      try {
        // Only fetch data if user is authenticated
        if (token && user) {
          const [recsData, ratingsData] = await Promise.all([
            getRecommendations(),
            getUserRatings(),
          ]);
          
          setRecommendations(recsData);
          setUserRatings(ratingsData);
        }
      } catch (error) {
        console.error('Error fetching recommendations data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
        <p className="text-gray-400">Generating your personalized recommendations...</p>
      </div>
    );
  }

  // If user is not authenticated
  if (!isAuthenticated) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-8">Movie Recommendations</h1>
        
        <div className="bg-secondary-light rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">
            Please Log In to See Recommendations
          </h2>
          <p className="text-gray-300 mb-6">
            Create an account or log in to get personalized movie recommendations based on your ratings and preferences.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/login" className="btn btn-primary">
              Log In
            </Link>
            <Link to="/register" className="btn btn-outline">
              Register
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // If no ratings yet
  if (userRatings.length === 0) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-8">Your Movie Recommendations</h1>
        
        <div className="bg-secondary-light rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">
            No Recommendations Yet
          </h2>
          <p className="text-gray-300 mb-6">
            Rate some movies to get personalized recommendations. The more movies you rate, the better our recommendations will be!
          </p>
          <Link to="/movies" className="btn btn-primary">
            Browse Movies to Rate
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Your Movie Recommendations</h1>
      <p className="text-gray-400 mb-8">
        Based on your ratings and preferences, we think you'll enjoy these movies.
      </p>
      
      {/* Your Ratings Section */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Based on Your Ratings</h2>
        <div className="flex overflow-x-auto gap-4 pb-4">
          {userRatings.map((rating) => (
            <div 
              key={rating.id} 
              className="flex-shrink-0 w-32 bg-secondary-light rounded overflow-hidden"
            >
              <img
                src={`/media/${rating.title.replace(/\s+/g, '').toLowerCase().trim()}.jpg`}
                onError={(e) => {
                  e.currentTarget.onerror = null; // prevent infinite loop
                  e.currentTarget.src = rating.poster_path ? `https://image.tmdb.org/t/p/w500${rating.poster_path}` : 'https://images.pexels.com/photos/1117132/pexels-photo-1117132.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
                }}
                alt={rating.title}
                className="w-full aspect-[2/3] object-cover"
              />
              
              <div className="p-2">
                <p className="text-sm font-medium truncate">{rating.title}</p>
                <div className="flex items-center mt-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i}
                      fill={i < rating.rating ? "#ffc107" : "none"}
                      className={i < rating.rating ? "text-accent" : "text-gray-600"}
                      size={12}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Recommendations */}
      {recommendations.length > 0 ? (
        <div className="space-y-6">
          {recommendations.map((movie) => (
            <RecommendationCard
              key={movie.id}
              movie={movie}
              matchScore={Math.floor(Math.random() * 20) + 80} // Random match score between 80-99
            />
          ))}
        </div>
      ) : (
        <div className="bg-secondary-light rounded-lg p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">No Recommendations Available</h2>
          <p className="text-gray-300">
            We couldn't generate recommendations based on your current ratings. Try rating more movies with different genres.
          </p>
        </div>
      )}
    </div>
  );
};

// Star component for the ratings
const Star = ({ fill, className, size }: { fill: string; className: string; size: number }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill={fill}
    className={className}
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

export default RecommendationsPage;
