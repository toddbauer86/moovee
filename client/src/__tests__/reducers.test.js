// import our actions
import {
    ADD_TO_MOVIES,
    UPDATE_MOVIES,
    UPDATE_CURRENT_USER,
    UPDATE_MOVIE_PREFERENCES
} from '../utils/actions';

// import reducer
import { reducer } from '../utils/reducers';

// create a sample of what our global state will look like
const initialState = {
    currentUser: 111,
    likedMovies: [
        {
            "externalMovieId": 1,
            "overview": "This is Grumpy Cat's movie",
            "title": "Grumpy Cat"
        }
    ],
    dislikedMovies: [
        {
            "externalMovieId": 2,
            "title": "The Trial of the Chicago 7",
            "overview": "What was intended to be a peaceful protest at the 1968"

        }
    ],
    movies: [
        {
            "externalMovieId": 3,
            "title": "Love and Monsters",
            "overview": "Seven years after the Monsterpocalypse"
        }
    ]
};

test('ADD_TO_MOVIES', () => {
    let newState = reducer(initialState, {
        type: ADD_TO_MOVIES,
        movie: {
            "externalMovieId": 4
        }
    });

    // check movies
    expect(newState.movies.length).toBe(2);
    expect(newState.movies[1].externalMovieId).toBe(4);
    expect(initialState.movies.length).toBe(1);
});

test('UPDATE_MOVIES', () => {
    let newState = reducer(initialState, {
        type: UPDATE_MOVIES,
        movies: [{
            "externalMovieId": 5
        }]
    });

    // check movies
    expect(newState.movies.length).toBe(1);
    expect(newState.movies[0].externalMovieId).toBe(5);
    expect(initialState.movies.length).toBe(1);
});

test('UPDATE_CURRENT_USER', () => {
    let newState = reducer(initialState, {
        type: UPDATE_CURRENT_USER,
        userId: 123
    });

    expect(newState.currentUser).toBe(123);
    expect(initialState.currentUser).toBe(111);
});

test('UPDATE_MOVIE_PREFERENCES', () => {
    let newState = reducer(initialState, {
        type: UPDATE_MOVIE_PREFERENCES,
        likedMovies: [{
            "externalMovieId": 6
        }],
        dislikedMovies: [{
            "externalMovieId": 7
        }]
    });

    // check liked movies
    expect(newState.likedMovies.length).toBe(1);
    expect(newState.likedMovies[0].externalMovieId).toBe(6);
    expect(initialState.likedMovies.length).toBe(1);
    // check disliked movies
    expect(newState.dislikedMovies.length).toBe(1);
    expect(newState.dislikedMovies[0].externalMovieId).toBe(7);
    expect(initialState.dislikedMovies.length).toBe(1);
});
