export const findMovie = (query) => {
  return fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=d64da0474db9594724886e71c0d202f1&query=${query}`
  );
};

export const getTrend = (time_window) => {
  return fetch(
    `https://api.themoviedb.org/3/trending/movie/${time_window}?api_key=d64da0474db9594724886e71c0d202f1`
  );
};
