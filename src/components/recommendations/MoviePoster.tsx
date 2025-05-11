// src/components/common/MoviePoster.tsx
import React, { useState } from 'react';

interface MoviePosterProps {
  title: string;
  posterPath?: string;
  className?: string;
}

const MoviePoster: React.FC<MoviePosterProps> = ({ title, posterPath, className = '' }) => {
  const [externalError, setExternalError] = useState(false);
  const [localError, setLocalError] = useState(false);

  const movieTitleWithoutYear = title.replace(/\s+/g, '').toLowerCase().trim();
  const localPosterPath = `/media/${movieTitleWithoutYear}.jpg`;

  if (!externalError && posterPath) {
    return (
      <img
        src={`https://image.tmdb.org/t/p/w500${posterPath}`}
        alt={`Poster for ${title}`}
        className={`w-full h-full object-cover ${className}`}
        loading="lazy"
        onError={() => setExternalError(true)}
      />
    );
  }

  if (!localError) {
    return (
      <img
        src={localPosterPath}
        alt={`Local poster for ${title}`}
        className={`w-full h-full object-cover ${className}`}
        onError={() => setLocalError(true)}
      />
    );
  }

  return (
    <div className={`w-full h-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center rounded-xl ${className}`}>
      <span className="text-3xl font-extrabold text-white text-center px-4 drop-shadow-lg tracking-wide">
        {title}
      </span>
    </div>
  );
};

export default MoviePoster;

