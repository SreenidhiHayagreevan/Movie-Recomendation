import React, { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { MovieFilter as FilterType } from '../../types/movie';

interface MovieFilterProps {
  onFilterChange: (filters: FilterType) => void;
  initialFilters?: FilterType;
}

const GENRES = [
  'All',
  'Action',
  'Adventure',
  'Animation',
  'Comedy',
  'Crime',
  'Documentary',
  'Drama',
  'Family',
  'Fantasy',
  'History',
  'Horror',
  'Music',
  'Mystery',
  'Romance',
  'Science Fiction',
  'Thriller',
  'War',
  'Western',
];

const MovieFilter: React.FC<MovieFilterProps> = ({ onFilterChange, initialFilters = {} }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterType>(initialFilters);

  const handleGenreChange = (genre: string) => {
    const newFilters = {
      ...filters,
      genre: genre === 'All' ? undefined : genre,
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleRatingChange = (rating: number) => {
    const newFilters = {
      ...filters,
      rating: rating === 0 ? undefined : rating,
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
    onFilterChange({});
  };

  const toggleFilters = () => setIsOpen(!isOpen);

  const hasActiveFilters = !!filters.genre || !!filters.rating;

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Filters</h2>
        <button
          onClick={toggleFilters}
          className="flex items-center text-gray-300 hover:text-white"
        >
          <Filter size={18} className="mr-1" />
          <span className="md:inline">{isOpen ? 'Hide Filters' : 'Show Filters'}</span>
        </button>
      </div>

      {isOpen && (
        <div className="bg-secondary-light p-4 rounded-lg mb-6 animate-fade-in">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">Filter Options</h3>
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="flex items-center text-gray-300 hover:text-white text-sm"
              >
                <X size={14} className="mr-1" />
                Clear All
              </button>
            )}
          </div>

          {/* Genre Filter */}
          <div className="mb-4">
            <h4 className="text-sm text-gray-400 mb-2">Genre</h4>
            <div className="flex flex-wrap gap-2">
              {GENRES.slice(0, 8).map((genre) => (
                <button
                  key={genre}
                  onClick={() => handleGenreChange(genre)}
                  className={`px-3 py-1 text-sm rounded-full ${
                    (genre === 'All' && !filters.genre) || filters.genre === genre
                      ? 'bg-primary text-white'
                      : 'bg-secondary-dark text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {genre}
                </button>
              ))}
              <div className="relative group">
                <button className="px-3 py-1 text-sm rounded-full bg-secondary-dark text-gray-300 hover:bg-gray-700">
                  More...
                </button>
                <div className="absolute z-10 left-0 mt-1 bg-secondary-dark rounded-lg shadow-xl p-3 w-60 hidden group-hover:block">
                  <div className="grid grid-cols-2 gap-2">
                    {GENRES.slice(8).map((genre) => (
                      <button
                        key={genre}
                        onClick={() => handleGenreChange(genre)}
                        className={`px-3 py-1 text-sm rounded-full text-left ${
                          filters.genre === genre
                            ? 'bg-primary text-white'
                            : 'bg-secondary text-gray-300 hover:bg-gray-700'
                        }`}
                      >
                        {genre}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Rating Filter */}
          <div>
            <h4 className="text-sm text-gray-400 mb-2">Minimum Rating</h4>
            <div className="flex flex-wrap gap-2">
              {[0, 1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => handleRatingChange(rating)}
                  className={`px-3 py-1 text-sm rounded-full ${
                    (rating === 0 && !filters.rating) || filters.rating === rating
                      ? 'bg-primary text-white'
                      : 'bg-secondary-dark text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {rating === 0 ? 'Any' : `${rating}★ & Up`}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieFilter;