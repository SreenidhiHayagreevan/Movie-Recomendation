// src/services/movieService.ts
import axios from 'axios';
import { csvParse } from 'd3-dsv';
import { Movie, MovieDetail, Rating } from '../types/movie';

// Import CSV as raw text
import rawMoviesData from '../data/merged_movie_data.csv?raw';

// Default poster image
const defaultPosterUrl = 'https://images.pexels.com/photos/1117132/pexels-photo-1117132.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';

// Parse CSV data and transform into Movie array
const parseMoviesData = (csvString: string): Movie[] => {
  const parsed = csvParse(csvString);
  
  return parsed.map((row: any) => ({
    id: Number(row.id) || 0,
    title: row.title || 'Unknown Movie',
    genre: row.genres_x 
      ? JSON.parse(row.genres_x.replace(/'/g, '"')).map((g: any) => g.name)
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
    } catch (apiError) {
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
  } catch (apiError) {
    console.log('Using local movie data');
    const localDataset = localStorage.getItem('movieDataset');
    if (localDataset) {
      return JSON.parse(localDataset);
    }
    return MOVIES_DATA;
  }
};

// Get movie details by ID
export const getMovieById = async (id: number): Promise<MovieDetail> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/movies/${id}/`);
    return response.data;
  } catch (apiError) {
    const movie = MOVIES_DATA.find(m => m.id === id);
    if (!movie) throw new Error('Movie not found');
    
    return {
      ...movie,
      overview: movie.overview || 'No overview available',
      release_date: movie.release_date || 'Unknown',
      runtime: movie.runtime || 0,
      ratings: Math.floor(Math.random() * 1000) + 100,
    };
  }
};

// Rate a movie
export const rateMovie = async (movieId: number, rating: number): Promise<void> => {
  try {
    await axios.post(`${API_BASE_URL}/movies/${movieId}/rate/`, { rating });
  } catch (apiError) {
    console.log('Storing rating locally');
    const ratings = JSON.parse(localStorage.getItem('movieRatings') || '{}');
    ratings[movieId] = rating;
    localStorage.setItem('movieRatings', JSON.stringify(ratings));
  }
};

// Get movie recommendations
export const getRecommendations = async (): Promise<Movie[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/recommendations/`);
    return response.data;
  } catch (apiError) {
    return [...MOVIES_DATA]
      .sort((a, b) => b.vote_average - a.vote_average)
      .slice(0, 10);
  }
};

// Search movies
export const searchMovies = async (query: string): Promise<Movie[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/movies/search/?q=${query}`);
    return response.data;
  } catch (apiError) {
    return MOVIES_DATA.filter(movie => 
      movie.title.toLowerCase().includes(query.toLowerCase()) ||
      movie.genre.some(g => g.toLowerCase().includes(query.toLowerCase()))
    );
  }
};

// Get user ratings
export const getUserRatings = async (): Promise<Rating[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/ratings/`);
    return response.data;
  } catch (apiError) {
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