import { useReducer } from 'react';

import { 
    ADD_TO_MOVIES,
    UPDATE_MOVIES,
    UPDATE_CURRENT_USER,
    UPDATE_MOVIE_PREFERENCES
 }
from '../utils/actions';

export const reducer = (state, action) => {
    switch (action.type) {
        case ADD_TO_MOVIES:
            return {
                ...state,
                movies: [...state.movies, action.movie]
            }
        case UPDATE_MOVIES:
            return {
                ...state,
                movies: action.movies
            }
        case UPDATE_CURRENT_USER:
            return {
                ...state,
                currentUser: action.userId
            }
        case UPDATE_MOVIE_PREFERENCES:
            return {
                ...state,
                dislikedMovies: action.dislikedMovies,
                likedMovies: action.likedMovies
            }
        default:
            return state ? state : '';
    }
};

export function useMovieReducer(initialState) {
    return useReducer(reducer, initialState);
}