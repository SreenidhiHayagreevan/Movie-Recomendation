// src/pages/movies/index.tsx
import MovieGrid from '../../components/MovieGrid';

const MoviesPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Movie Recommendations</h1>
      <MovieGrid />
    </div>
  );
};

export default MoviesPage;