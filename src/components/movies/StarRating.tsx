import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  initialRating?: number;
  totalStars?: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: number;
}

const StarRating: React.FC<StarRatingProps> = ({
  initialRating = 0,
  totalStars = 5,
  onRatingChange,
  readonly = false,
  size = 24,
}) => {
  const [rating, setRating] = useState(initialRating);
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleRatingChange = (newRating: number) => {
    if (readonly) return;
    
    // If clicking the same star twice, remove the rating
    const finalRating = rating === newRating ? 0 : newRating;
    
    setRating(finalRating);
    if (onRatingChange) {
      onRatingChange(finalRating);
    }
  };

  return (
    <div className="star-rating">
      {[...Array(totalStars)].map((_, index) => {
        const starValue = index + 1;
        const isFilled = readonly
          ? starValue <= rating
          : starValue <= (hoveredRating || rating);

        return (
          <span
            key={index}
            className={`star ${isFilled ? 'star-filled' : 'star-empty'}`}
            onClick={() => handleRatingChange(starValue)}
            onMouseEnter={() => !readonly && setHoveredRating(starValue)}
            onMouseLeave={() => !readonly && setHoveredRating(0)}
          >
            <Star
              size={size}
              fill={isFilled ? 'currentColor' : 'none'}
              strokeWidth={1.5}
            />
          </span>
        );
      })}
      {!readonly && (
        <span className="ml-2 text-gray-400">
          {rating > 0 ? `${rating} of ${totalStars}` : ''}
        </span>
      )}
    </div>
  );
};

export default StarRating;