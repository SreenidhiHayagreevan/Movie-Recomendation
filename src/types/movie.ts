export interface Movie {
  id: number;
  title: string;
  genre: string;
  poster_path: string;
  vote_average: number;
}

export interface MovieDetail extends Movie {
  overview: string;
  release_date: string;
  runtime: number;
  ratings: number;
}

export interface Rating {
  id: number;
  movie_id: number;
  title: string;
  poster_path: string;
  rating: number;
  rated_at: string;
}

export interface MovieFilter {
  genre?: string;
  rating?: number;
  searchQuery?: string;
}