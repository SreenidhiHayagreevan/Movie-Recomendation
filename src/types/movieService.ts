// src/services/movieService.ts
import axios from 'axios';
import { csvParse } from 'd3-dsv';
import { Movie, MovieDetail, Rating } from './movie';

// Import CSV as raw text
import rawMoviesData from '../data/merged_movie_data.csv?raw';

// Default poster image
const defaultPosterUrl = 'https://images.pexels.com/photos/1117132/pexels-photo-1117132.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';

// Parse CSV data and transform into Movie array
const parseMoviesData = (csvString: string): Movie[] => {
  const parsed = csvParse(csvString);
  
  return parsed.map((row) => ({
    id: Number(row.id) || 0,
    title: row.title || 'Unknown Movie',
    genre: row.genres_x 
      ? JSON.parse(row.genres_x.replace(/'/g, '"')).map((g: { name: string }) => g.name)
      : ['Unknown'],
    poster_path: row.poster_path || defaultPosterUrl,
    vote_average: Number(row.vote_average) || 0,
    overview: row.overview || '',
    release_date: row.release_date || '',
    runtime: Number(row.runtime) || 0
  }));
};

// Initialize movies data
let MOVIES_DATA: Movie[] = parseMoviesData(rawMoviesData);

const API_BASE_URL = '/api';

// Upload movie dataset
export const uploadMovieDataset = async (file: File): Promise<void> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      await axios.post(`${API_BASE_URL}/movies/upload-dataset/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Dataset uploaded successfully to API');
    } catch {
      console.log('API unavailable, storing dataset locally');
      const fileContent = await file.text();
      const movies = parseMoviesData(fileContent);
      localStorage.setItem('movieDataset', JSON.stringify(movies));
      MOVIES_DATA = movies;
    }
  } catch (error) {
    console.error('Error uploading dataset:', error);
    throw error;
  }
};

// Get all movies
export const getMovies = async (): Promise<Movie[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/movies/`);
    return response.data;
  } catch {
    console.log('Using local movie data');
    const localDataset = localStorage.getItem('movieDataset');
    if (localDataset) {
      return JSON.parse(localDataset);
    }
    return MOVIES_DATA;
  }
};

// Get paginated movies
export const getPaginatedMovies = async (page: number = 1, limit: number = 30): Promise<{ movies: Movie[], total: number }> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/movies/paginated?page=${page}&limit=${limit}`);
    return response.data;
  } catch {
    console.log('Using local paginated movie data');
    const localDataset = localStorage.getItem('movieDataset');
    const allMovies = localDataset ? JSON.parse(localDataset) : MOVIES_DATA;
    
    const startIndex = (page - 1) * limit;
    const paginatedMovies = allMovies.slice(startIndex, startIndex + limit);
    
    return {
      movies: paginatedMovies,
      total: allMovies.length
    };
  }
};

// Get movie details by ID
export const getMovieById = async (id: number): Promise<MovieDetail> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/movies/${id}/`);
    return response.data;
  } catch {
    const movie = MOVIES_DATA.find(m => m.id === id);
    if (!movie) throw new Error('Movie not found');
    
    // Cast to MovieDetail since Movie type doesn't explicitly have all needed fields
    return {
      ...movie,
      // These are added to the Movie type when creating MovieDetail
      overview: movie.overview || 'No overview available',
      release_date: movie.release_date || 'Unknown',
      runtime: movie.runtime || 0,
      ratings: Math.floor(Math.random() * 1000) + 100,
    } as MovieDetail;
  }
};

// Rate a movie
export const rateMovie = async (movieId: number, rating: number): Promise<void> => {
  try {
    await axios.post(`${API_BASE_URL}/movies/${movieId}/rate/`, { rating });
  } catch {
    console.log('Storing rating locally');
    const ratings = JSON.parse(localStorage.getItem('movieRatings') || '{}');
    ratings[movieId] = rating;
    localStorage.setItem('movieRatings', JSON.stringify(ratings));
  }
};

// Get movie recommendations
export const getRecommendations = async (): Promise<Movie[]> => {
  try {
    const token = localStorage.getItem('token');
    
    // If no token, return empty recommendations
    if (!token) {
      return [];
    }
    
    const response = await axios.get(`${API_BASE_URL}/recommendations/`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch {
    console.log('Using local recommendation data');
    
    // Get the user ID to filter recommendations
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.id;
    
    // If no user, return empty recommendations
    if (!userId) {
      return [];
    }
    
    // Get user's ratings to base recommendations on
    const ratings = JSON.parse(localStorage.getItem('movieRatings') || '{}');
    
    // If no ratings, return popular movies
    if (Object.keys(ratings).length === 0) {
      return [...MOVIES_DATA]
        .sort((a, b) => b.vote_average - a.vote_average)
        .slice(0, 10);
    }
    
    // Simple recommendation algorithm based on genres the user has rated highly
    const highlyRatedMovies = Object.entries(ratings)
      .filter(([, rating]) => Number(rating) >= 4)
      .map(([movieId]) => MOVIES_DATA.find(m => m.id === Number(movieId)))
      .filter(Boolean) as Movie[];
    
    // Extract genres from highly rated movies
    const preferredGenres = new Set(highlyRatedMovies.flatMap(movie => movie.genre));
    
    // Find movies with similar genres that user hasn't rated yet
    const ratedMovieIds = new Set(Object.keys(ratings).map(Number));
    const recommendations = MOVIES_DATA
      .filter(movie => !ratedMovieIds.has(movie.id))
      .filter(movie => movie.genre.some((genre: string) => preferredGenres.has(genre)))
      .sort((a, b) => b.vote_average - a.vote_average)
      .slice(0, 10);
    
    return recommendations;
  }
};

// Search movies
export const searchMovies = async (query: string): Promise<Movie[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/movies/search/?q=${query}`);
    return response.data;
  } catch {
    return MOVIES_DATA.filter(movie => 
      movie.title.toLowerCase().includes(query.toLowerCase()) ||
      movie.genre.some((g: string) => g.toLowerCase().includes(query.toLowerCase()))
    );
  }
};

// Get user ratings
export const getUserRatings = async (): Promise<Rating[]> => {
  try {
    const token = localStorage.getItem('token');
    
    // If no token, return empty ratings
    if (!token) {
      return [];
    }
    
    const response = await axios.get(`${API_BASE_URL}/ratings/`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch {
    console.log('Using local rating data');
    
    // Get the user to filter ratings
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.id;
    
    // If no user, return empty ratings
    if (!userId) {
      return [];
    }
    
    const ratings = JSON.parse(localStorage.getItem('movieRatings') || '{}');
    return Object.entries(ratings).map(([movieId, rating]) => {
      const movie = MOVIES_DATA.find(m => m.id === Number(movieId));
      return {
        id: Number(movieId),
        movie_id: Number(movieId),
        title: movie?.title || 'Unknown Movie',
        poster_path: movie?.poster_path || defaultPosterUrl,
        rating: Number(rating),
        rated_at: new Date().toISOString(),
      };
    });
  }
};

// Get available genres
export const getAvailableGenres = (): string[] => {
  const allGenres = MOVIES_DATA.flatMap(movie => movie.genre);
  return [...new Set(allGenres)];
};
