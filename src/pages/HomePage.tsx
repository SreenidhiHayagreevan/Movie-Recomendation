import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Film, ThumbsUp, Star, TrendingUp, Volume2, VolumeX } from 'lucide-react';
import MovieGrid from '../components/movies/MovieGrid';
import { getMovies } from '../types/movieService';
import { Movie } from '../types/movie';

const HomePage: React.FC = () => {
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await getMovies();
        const sorted = [...data].sort((a, b) => b.vote_average - a.vote_average);
        setTrendingMovies(sorted.slice(0, 5));
      } catch (error) {
        console.error('Error fetching trending movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section with Video Background */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Video Background */}
        <video 
          ref={videoRef}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          className="absolute z-0 w-auto min-w-full min-h-full max-w-none object-cover"
        >
          <source src="/videos/videoplayback.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Dark overlay for better text contrast */}
        <div className="absolute inset-0 bg-black/50 z-1"></div>
        
        {/* Mute/Unmute Toggle Button */}
        <button
          onClick={toggleMute}
          className="absolute z-20 bottom-4 right-4 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors duration-200"
          aria-label={isMuted ? "Unmute video" : "Mute video"}
        >
          {isMuted ? (
            <VolumeX size={24} className="text-white" />
          ) : (
            <Volume2 size={24} className="text-white" />
          )}
        </button>
        
        {/* Content */}
        <div className="relative z-10 text-center px-4 container mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Discover Movies <span className="text-blue-500">You'll Love</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Your personal movie recommendation system that understands your taste
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/movies" 
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition duration-200 flex items-center justify-center"
            >
              <Film size={18} className="mr-2" />
              Browse Movies
            </Link>
            <Link 
              to="/recommendations" 
              className="px-8 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition duration-200 flex items-center justify-center"
            >
              <ThumbsUp size={18} className="mr-2" />
              Get Recommendations
            </Link>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-gray-800 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">How It Works</h2>
          <p className="text-gray-300 text-center max-w-3xl mx-auto mb-16">
            Our personalized recommendation system learns from your ratings to suggest movies you'll love.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-700 p-6 rounded-lg text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 mb-4 bg-blue-500/20 rounded-full mx-auto">
                <Star size={24} className="text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Rate Movies</h3>
              <p className="text-gray-300">
                Rate movies you've watched to help our system understand your preferences.
              </p>
            </div>
            <div className="bg-gray-700 p-6 rounded-lg text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 mb-4 bg-blue-500/20 rounded-full mx-auto">
                <TrendingUp size={24} className="text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Smart Algorithm</h3>
              <p className="text-gray-300">
                Our algorithm analyzes your ratings to find patterns in your movie taste.
              </p>
            </div>
            <div className="bg-gray-700 p-6 rounded-lg text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 mb-4 bg-blue-500/20 rounded-full mx-auto">
                <ThumbsUp size={24} className="text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Discover</h3>
              <p className="text-gray-300">
                Get personalized movie recommendations tailored just for you.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Trending Movies Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Trending Movies</h2>
          <Link to="/movies" className="text-blue-400 hover:text-blue-300 transition-colors">
            View All
          </Link>
        </div>
        
        <MovieGrid movies={trendingMovies} loading={loading} />
      </div>

      {/* CTA Section */}
      <div className="bg-gray-800 rounded-lg p-8 mb-12 text-center max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Ready to find your next favorite movie?
        </h2>
        <p className="text-gray-300 mb-6">
          Join thousands of movie enthusiasts who have discovered hidden gems through our recommendation system.
        </p>
        <Link 
          to="/recommendations" 
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition duration-200 inline-block"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
};

export default HomePage;