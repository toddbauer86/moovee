import React, { useEffect, useState } from "react";
// Components
import { Container, Jumbotron } from "react-bootstrap";

// GraphQL
import { ADD_MOVIE, DISLIKE_MOVIE, LIKE_MOVIE } from "../utils/mutations";
import { GET_USER } from "../utils/queries";
import { useMutation, useQuery } from "@apollo/react-hooks";
// Global State
import { useMoveeContext } from "../utils/GlobalState";
import {
  UPDATE_CURRENT_USER,
  UPDATE_MOVIE_PREFERENCES,
} from "../utils/actions";
// IndexedDB
import { dbProm } from "../utils/helpers";

// Other Utils
import Auth from "../utils/auth";
import { findIndexAt } from "../utils/helpers";

const Homepage = () => {
  const [state, dispatch] = useMoveeContext();
  const { movies, likedMovies, dislikedMovies } = state;
  const [movieIndex, setMovieIndex] = useState("");
  const [moviesToDisplay, setMoviesToDisplay] = useState(true);
  const [lastSwipe, setLastSwipe] = useState("");
  // GraphQL
  const [addMovie, { addMovieError }] = useMutation(ADD_MOVIE);
  const [dislikeMovie] = useMutation(DISLIKE_MOVIE);
  const [likeMovie] = useMutation(LIKE_MOVIE);
  const { loading, data } = useQuery(GET_USER);

  // hook for updating movie preferences
  useEffect(() => {
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
    }
  }, [data, loading, likedMovies, dislikedMovies, dispatch]);

  // hook for displaying a movie
  useEffect(() => {
    if (movies.length && movieIndex === "") {
      if (Auth.loggedIn()) {
        for (let i = 0; i < movies.length; i++) {
          const isLiked = likedMovies.some(
            (likedMovies) => likedMovies._id === movies[i]._id
          );
          const isDisliked = dislikedMovies.some(
            (dislikedMovie) => dislikedMovie._id === movies[i]._id
          );

          if (!isLiked && !isDisliked && movies[i].trailer) {
            setMovieIndex(i);
            setMoviesToDisplay(true);
            return;
          }
        }
        setMoviesToDisplay(false);
      } else {
        setMovieIndex(0);
      }
    }
  }, [setMovieIndex, dislikedMovies, likedMovies, movies, movieIndex]);

  const handleLikeMovie = (likedMovies) => {
    // update the db
    likeMovie({
      variables: { movieId: likedMovies._id },
    })
      .then(({ data }) => {
        if (data) {
          // update global state
          dispatch({
            type: UPDATE_MOVIE_PREFERENCES,
            likedMovies: data.likeMovie.likedMovies,
            dislikedMovies: data.likeMovie.dislikedMovies,
          });

          // find the updated movie
          const likedMovieIndex = findIndexAt(
            data.likeMovie.likedMovies,
            "_id",
            likedMovies._id
          );
          const updatedLikedMovie = data.likeMovie.likedMovies[likedMovieIndex];

          // update idb
          dbProm("likedMovies", "put", updatedLikedMovie);
          dbProm("dislikedMovies", "delete", updatedLikedMovie);

          // skip to the next movie
          handleNextMovie();
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
          const dislikedMovieIndex = await findIndexAt(
            data.dislikeMovie.dislikedMovies,
            "_id",
            dislikedMovie._id
          );
          const updatedDislikedMovie =
            data.dislikeMovie.dislikedMovies[dislikedMovieIndex];

          // update idb
          dbProm("likedMovies", "delete", updatedDislikedMovie);
          dbProm("dislikedMovies", "put", updatedDislikedMovie);

          // skip to the next movie
          handleNextMovie();
        }
      })
      .catch((err) => console.error(err));
  };

  const handlePrevMovie = async () => {
    setLastSwipe("");
    if (movies.length) {
      movieIndex === 0
        ? setMovieIndex(movies.length - 1)
        : setMovieIndex(movieIndex - 1);
    }
  };

  const handleNextMovie = async () => {
    setLastSwipe("");
    // put the current movie at the end of the array if it's not the only movie
    if (movies.length) {
      if (Auth.loggedIn()) {
        for (let i = movieIndex + 1; i < movies.length; i++) {
          const isLiked = likedMovies.some(
            (likedMovies) => likedMovies._id === movies[i]._id
          );
          const isDisliked = dislikedMovies.some(
            (dislikedMovie) => dislikedMovie._id === movies[i]._id
          );

          if (!isLiked && !isDisliked && movies[i].trailer) {
            setMovieIndex(i);
            return;
          }
        }
        setMoviesToDisplay(false);
      } else {
        movieIndex === movies.length
          ? setMovieIndex(0)
          : setMovieIndex(movieIndex + 1);
      }
    }
  };

  return (
    <>
      <Jumbotron fluid className="text-dark bg-light">
        <Container>
          <h1>Welcome to MooVee</h1>
          {Auth.loggedIn() ? (
            <h4>Search your favorite movies.</h4>
          ) : (
            <h4>
              Search your favorite movies - create an account to save your
              favorites to your profile!
            </h4>
          )}
        </Container>
      </Jumbotron>
    </>
  );
};

export default Homepage;
