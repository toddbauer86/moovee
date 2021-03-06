import moment from "moment";

export const finalMovieData = async (movieData) => {
  const movies = movieData.filter(
    (movie) => movie.poster_path && movie.overview
  );

  for (let i = 0; i < movies.length; i++) {
    const movie = await movies[i];

    let cleanedData = {
      externalMovieId: movie.id,
      rating: movie.vote_average,
      voteCount: movie.vote_count,
      title: movie.title,
      overview: movie.overview,
      releaseDate: moment(movie.release).format("LL"),
      poster: "https://image.tmdb.org/t/p/w500" + movie.poster_path,
    };

    // save the cleaned data
    movies[i] = cleanedData;
  }

  return movies;
};
