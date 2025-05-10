import { Movie } from '../types/movie';

export const validateMovies = (data: unknown): Movie[] => {
  if (!Array.isArray(data)) {
    throw new Error('Expected an array of movies');
  }

  return data.map(item => ({
    id: Number(item.id) || 0,
    title: String(item.title || 'Unknown Movie'),
    genre: Array.isArray(item.genre) 
      ? item.genre.map(g => String(g))
      : ['Unknown'],
    poster_path: String(item.poster_path || ''),
    vote_average: Number(item.vote_average) || 0,
    overview: String(item.overview || ''),
    release_date: String(item.release_date || ''),
    runtime: Number(item.runtime) || 0
  }));
};