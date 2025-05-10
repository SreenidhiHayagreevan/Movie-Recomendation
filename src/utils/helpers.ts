export const getGenreColor = (genre: string) => {
  const genreColors: Record<string, string> = {
    'action': 'bg-red-100 text-red-800',
    'adventure': 'bg-blue-100 text-blue-800',
    'comedy': 'bg-yellow-100 text-yellow-800',
    'drama': 'bg-purple-100 text-purple-800',
    'horror': 'bg-gray-800 text-white',
    'sci-fi': 'bg-green-100 text-green-800',
    'thriller': 'bg-orange-100 text-orange-800',
    'romance': 'bg-pink-100 text-pink-800',
    'fantasy': 'bg-indigo-100 text-indigo-800',
    'animation': 'bg-cyan-100 text-cyan-800',
  };
  
  return genreColors[genre.toLowerCase()] || 'bg-gray-100 text-gray-800';
};