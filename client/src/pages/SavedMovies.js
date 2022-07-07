import React, { useEffect } from "react";
// Components
import { Jumbotron, CardColumns, Container } from "react-bootstrap";
import MovieCard from "../components/MovieCard";
// GraphQL
import { DISLIKE_MOVIE, LIKE_MOVIE } from "../utils/mutations";
import { GET_USER } from "../utils/queries";
import { useMutation, useQuery } from "@apollo/react-hooks";
// Global State
import { useMoveeContext } from "../utils/GlobalState";
import {
  UPDATE_CURRENT_USER,
  UPDATE_MOVIE_PREFERENCES,
} from "../utils/actions";
// IDB
import { idbPromise } from "../utils/helpers";
import { findIndexByAttr } from "../utils/helpers";

const SavedMovies = () => {
  // State
  const [state, dispatch] = useMoveeContext();
  const { likedMovies, dislikedMovies } = state;
  // GraphQL
  const [dislikeMovie] = useMutation(DISLIKE_MOVIE);
  const [likeMovie] = useMutation(LIKE_MOVIE);
  const { loading, data } = useQuery(GET_USER);

  useEffect(() => {
    // if we're online, use server to update movie preferences
    if (!likedMovies.length && !dislikedMovies.length) {
      if (data && data.me) {
        dispatch({
          type: UPDATE_CURRENT_USER,
          userId: data.me._id,
        });
        if (data.me.likedMovies.length || !data.me.dislikedMovies.length) {
          console.log(
            "Online, using data from server to update movie preferences"
          );
          dispatch({
            type: UPDATE_MOVIE_PREFERENCES,
            likedMovies: data.me.likedMovies,
            dislikedMovies: data.me.dislikedMovies,
          });
        }
      }
      // if we're offline, use idb to update movie preferences
      else if (!loading) {
        idbPromise("likedMovies", "get").then((likedMovies) => {
          idbPromise("dislikedMovies", "get").then((dislikedMovies) => {
            if (dislikedMovies.length || likedMovies.length) {
              console.log(
                "Offline, using data from idb to update movie preferences"
              );
              dispatch({
                type: UPDATE_MOVIE_PREFERENCES,
                likedMovies,
                dislikedMovies,
              });
            }
          });
        });
      }
    }
  }, [data, loading, likedMovies, dislikedMovies, dispatch]);

  const handleLikeMovie = (likedMovie) => {
    // update the db
    likeMovie({
      variables: { movieId: likedMovie._id },
    })
      .then(({ data }) => {
        console.log(data.likeMovie);
        if (data) {
          // update global state
          dispatch({
            type: UPDATE_MOVIE_PREFERENCES,
            likedMovies: data.likeMovie.likedMovies,
            dislikedMovies: data.likeMovie.dislikedMovies,
          });

          // find the updated movie
          const likedMovieIndex = findIndexByAttr(
            data.likeMovie.likedMovies,
            "_id",
            likedMovie._id
          );
          const updatedLikedMovie = data.likeMovie.likedMovies[likedMovieIndex];

          // update idb
          idbPromise("likedMovies", "put", updatedLikedMovie);
          idbPromise("dislikedMovies", "delete", updatedLikedMovie);
        } else {
          console.error("Couldn't like the movie!");
        }
      })
      .catch((err) => console.error(err));
  };

  const handleDislikeMovie = (dislikedMovie) => {
    // update the db
    dislikeMovie({
      variables: { movieId: dislikedMovie._id },
    })
      .then(async ({ data }) => {
        if (data) {
          // update global state
          dispatch({
            type: UPDATE_MOVIE_PREFERENCES,
            likedMovies: data.dislikeMovie.likedMovies,
            dislikedMovies: data.dislikeMovie.dislikedMovies,
          });

          // find the updated movie
          const dislikedMovieIndex = await findIndexByAttr(
            data.dislikeMovie.dislikedMovies,
            "_id",
            dislikedMovie._id
          );
          const updatedDislikedMovie =
            data.dislikeMovie.dislikedMovies[dislikedMovieIndex];

          // update idb
          idbPromise("likedMovies", "delete", updatedDislikedMovie);
          idbPromise("dislikedMovies", "put", updatedDislikedMovie);
        } else {
          console.error("Couldn't dislike the movie!");
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <>
      <Jumbotron fluid className="text-dark bg-light">
        <Container>
          <h1>My Movies</h1>
        </Container>
      </Jumbotron>
      <Container className="bg-light">
        <h2 className="pb-5">
          {likedMovies.length
            ? `Displaying ${likedMovies.length} saved ${
                likedMovies.length === 1 ? "movie" : "movies"
              }:`
            : "You have no saved movies."}
        </h2>
        <CardColumns>
          {likedMovies?.length && likedMovies.length > 0
            ? likedMovies.map((movie) => {
                return (
                  <MovieCard
                    key={movie._id}
                    movie={movie}
                    displayTrailer
                    likeMovieHandler={handleLikeMovie}
                    dislikeMovieHandler={handleDislikeMovie}
                  />
                );
              })
            : null}
        </CardColumns>
      </Container>
    </>
  );
};

export default SavedMovies;
