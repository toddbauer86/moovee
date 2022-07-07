import React, { useEffect, useState } from "react";
// Components
import {
  Form,
  Button,
  CardColumns,
  Container,
  Jumbotron,
} from "react-bootstrap";
import MovieCard from "../components/MovieCard";
import { cleanMovieData } from "../utils/movieData";
// TMDB API
import { searchTMDB } from "../utils/API";
// GraphQL
import { ADD_MOVIE, DISLIKE_MOVIE, LIKE_MOVIE } from "../utils/mutations";
import { GET_USER } from "../utils/queries";
import { useMutation, useQuery } from "@apollo/react-hooks";
// Global State
import { useMoveeContext } from "../utils/GlobalState";
import {
  ADD_TO_MOVIES,
  UPDATE_CURRENT_USER,
  UPDATE_MOVIE_PREFERENCES,
} from "../utils/actions";
// IndexedDB
import { idbPromise } from "../utils/helpers";
import { findIndexByAttr } from "../utils/helpers";

const SearchMovies = () => {
  // State
  const [state, dispatch] = useMoveeContext();
  const { likedMovies, dislikedMovies } = state;
  const [resultsFound, setResultsFound] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [searchedMovies, setSearchedMovies] = useState([]);
  const [searching, setSearching] = useState(false);
  // GraphQL
  const [addMovie, { addMovieError }] = useMutation(ADD_MOVIE);
  const [dislikeMovie] = useMutation(DISLIKE_MOVIE);
  const [likeMovie] = useMutation(LIKE_MOVIE);
  const { loading, data } = useQuery(GET_USER);

  // hook for updating movie preferences
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

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    setSearchedMovies([]);
    setSearching(true);

    if (!searchInput) {
      return false;
    }

    const response = await searchTMDB(searchInput);

    if (!response.ok) {
      throw new Error("Couldn't search for movies");
    }

    const { results } = await response.json();

    // return early if no results found
    if (results.length === 0) {
      setResultsFound(false);
      setSearching(false);
      return;
    }

    const cleanedMovies = await cleanMovieData(results);

    const updatedSearchedMovies = [];
    for (let i = 0; i < cleanedMovies.length; i++) {
      // add the movie to the DB
      const result = await addMovie({
        variables: { input: cleanedMovies[i] },
      });

      const { data: newMovieData } = await result;
      const { addMovie: newMovie } = await newMovieData;

      // add the movie to the global store
      dispatch({
        type: ADD_TO_MOVIES,
        movie: newMovie,
      });

      // add to idb
      idbPromise("movies", "put", newMovie);

      // update searchedMovies state
      if (!addMovieError) {
        updatedSearchedMovies.push(newMovie);
      }
    }

    setSearchedMovies(updatedSearchedMovies);
    setSearching(false);
    setResultsFound(true);
  };

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
          <Form onSubmit={(event) => handleFormSubmit(event, searchInput)}>
            <Form.Label className="h3">
              Search for your favorite movies!
            </Form.Label>
            <Form.Control
              name="searchInput"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              type="text"
              placeholder="The Bridge on the River Kwai"
            />
            <Button type="submit" className="mt-2 btn-info">
              Search
            </Button>
          </Form>
        </Container>
      </Jumbotron>
      <Container>
        {!searching && !resultsFound ? (
          <h2 className="results-heading">
            No movies found! Please try another search.
          </h2>
        ) : (
          <>
            <h2 className="results-heading">
              {searchedMovies.length > 0 &&
                `Viewing ${searchedMovies.length} results:`}
            </h2>
            <CardColumns>
              {searchedMovies?.map((movie) => {
                return (
                  <MovieCard
                    key={movie._id}
                    movie={movie}
                    // displayTrailer
                    likeMovieHandler={handleLikeMovie}
                    dislikeMovieHandler={handleDislikeMovie}
                  />
                );
              })}
            </CardColumns>
          </>
        )}
      </Container>
    </>
  );
};

export default SearchMovies;
