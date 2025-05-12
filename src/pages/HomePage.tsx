import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold mb-6">Discover Movies You'll Love</h1>
        <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
          Your personal movie recommendation system that understands your taste
        </p>
        <div className="flex justify-center gap-4">
          <button 
            onClick={() => navigate('/movies')}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition duration-200"
          >
            Browse Movies
          </button>
          <button 
            onClick={() => navigate('/recommendations')}
            className="px-8 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition duration-200"
          >
            Get Recommendations
          </button>
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
            {/* Step 1 */}
            <div className="bg-gray-700 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Rate Movies</h3>
              <p className="text-gray-300">
                Rate movies you've watched to help our system understand your preferences.
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="bg-gray-700 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Smart Algorithm</h3>
              <p className="text-gray-300">
                Our algorithm analyzes your ratings to find patterns in your movie taste.
              </p>
            </div>
            
            {/* Step 3 */}
            <div className="bg-gray-700 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Discover</h3>
              <p className="text-gray-300">
                Get personalized movie recommendations tailored just for you.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
