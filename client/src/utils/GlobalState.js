import React, { createContext, useContext } from "react";
import { useMovieReducer } from "./reducers";

const MoveeContext = createContext();
const { Provider } = MoveeContext;

const MooveeGlobal = ({ value = [], ...props }) => {
  const [state, dispatch] = useMovieReducer({
    likedMovies: [], // array of movies that were liked
    dislikedMovies: [], // array of movies that were disliked
    movies: [], // array of all movies
    currentUser: "", // current user's username
  });
  // console.log({state}); // comment this in to test!
  return <Provider value={[state, dispatch]} {...props} />;
};

const useMoveeContext = () => {
  return useContext(MoveeContext);
};

export { MooveeGlobal, useMoveeContext };
