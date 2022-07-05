const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type Auth {
        token: ID!
        user: User
    }

    type Movie {
        _id: ID
        externalMovieId: Int
        rating: Float
        voteCount: Int
        title: String
        overview: String
        releaseDate: String
        poster: String
        trailer: String
        likedUsers: [User]
        dislikedUsers: [User]
    }

    type User {
        _id: ID
        username: String
        email: String
        friendCount: Int
        friends: [User]
        likedMovies: [Movie]
        dislikedMovies: [Movie]
    }

    type Query {
        me: User
        movies: [Movie]
        movie(movieId: ID!): Movie
        users: [User]
        user(username: String!): User
    }

    input MovieInput {
        externalMovieId: Int
        rating: Float
        voteCount: Int
        title: String
        overview: String
        releaseDate: String
        poster: String
        trailer: String
    }

    type Mutation {
        login(email: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth
        addFriend(friendId: ID!): User
        addMovie(input: MovieInput!): Movie
        likeMovie(movieId: ID!): User
        dislikeMovie(movieId: ID!): User
    }
`;

module.exports = typeDefs; 