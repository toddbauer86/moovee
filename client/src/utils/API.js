// Using https://www.themoviedb.org/ for movies api
export const searchTMDB = (query) => {
  return fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=d64da0474db9594724886e71c0d202f1&query=${query}`
  );
};

export const getVideos = (movie_id) => {
  return fetch(
    `https://api.themoviedb.org/3/movie/${movie_id}/videos?api_key=d64da0474db9594724886e71c0d202f1&language=en-US`
  );
};

// time_window can be by day or week
export const getTrendingMovies = (time_window) => {
  return fetch(
    `https://api.themoviedb.org/3/trending/movie/${time_window}?api_key=d64da0474db9594724886e71c0d202f1`
  );
};

// category can be top_rated, latest, popular
export const getMovies = (category) => {
  return fetch(
    `https://api.themoviedb.org/3/movie/${category}?api_key=d64da0474db9594724886e71c0d202f1&language=en-US`
  );
};
