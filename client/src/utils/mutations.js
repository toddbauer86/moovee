import gql from 'graphql-tag';

export const ADD_USER = gql`
    mutation addUser($username: String!, $email: String!, $password: String!) {
        addUser(username: $username, email: $email, password: $password) {
            token
            user {
                _id
                username
                email
            }
        }
    }
`;

export const LOGIN_USER = gql`
    mutation login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            token
            user {
                _id
                username
                email
                likedMovies {
                    _id
                    externalMovieId
                    title
                    overview
                    releaseDate
                    rating
                    voteCount
                    poster
                    trailer
                    likedUsers {
                        _id
                        username
                        email
                    }
                }
                dislikedMovies{
                    _id
                    externalMovieId
                    title
                    overview
                    releaseDate
                    rating
                    voteCount
                    poster
                    trailer
                    likedUsers {
                        _id
                        username
                        email
                    }
                }
            }
        }
    }
`;

export const ADD_MOVIE = gql`
    mutation addMovie($input: MovieInput!) {
        addMovie(input:$input) {
            _id
            externalMovieId
            title
            overview
            releaseDate
            rating
            voteCount
            poster
            trailer
            likedUsers {
                _id
                username
                email
            }
        }
    }
`

export const LIKE_MOVIE = gql`
    mutation likeMovie($movieId: ID!) {
        likeMovie(movieId: $movieId) {
            likedMovies {
                _id
                externalMovieId
                title
                overview
                releaseDate
                rating
                voteCount
                poster
                trailer
                likedUsers {
                    _id
                    username
                    email
                }
            }
            dislikedMovies{
                _id
                externalMovieId
                title
                overview
                releaseDate
                rating
                voteCount
                poster
                trailer
                likedUsers {
                    _id
                    username
                    email
                }
            }
        }
    }
`;

export const DISLIKE_MOVIE = gql`
    mutation dislikeMovie($movieId: ID!) {
        dislikeMovie(movieId: $movieId) {
            likedMovies {
                _id
                externalMovieId
                title
                overview
                releaseDate
                rating
                voteCount
                poster
                trailer
                likedUsers {
                    _id
                    username
                }
            }
            dislikedMovies{
                _id
                externalMovieId
                title
                overview
                releaseDate
                rating
                voteCount
                poster
                trailer
                likedUsers {
                    _id
                    username
                }
            }
        }
    }
`;