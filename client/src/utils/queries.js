import gql from 'graphql-tag';

export const GET_USER = gql`
  {
    me {
      _id
      username
      email
      friends {
        _id
      }
      likedMovies{
        _id
        externalMovieId
        rating
        voteCount
        title
        overview
        releaseDate
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
        rating
        voteCount
        title
        overview
        releaseDate
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