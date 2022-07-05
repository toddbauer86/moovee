import { getVideos } from '../utils/API';
import moment from 'moment';

export const cleanMovieData = async (movieData) => {
    // filter out entries that won't display well
    const movies = movieData.filter((movie) => movie.poster_path && movie.overview);
    
    // clean up the data
    for (let i=0; i < movies.length; i++) {
        const movie = await movies[i]

        let cleanedData = {
            externalMovieId: movie.id,
            rating: movie.vote_average,
            voteCount: movie.vote_count,
            title: movie.title,
            overview: movie.overview,
            releaseDate: moment(movie.release).format('LL'),
            poster: 'https://image.tmdb.org/t/p/w500' + movie.poster_path
        }

        // try to get the trailer
        try {
            const videoResponse = await getVideos(movie.id);

            // if the response was ok, handle the trailer info
            if (videoResponse.ok) {
                const {results: videoResults} = await videoResponse.json();

                // return first video that's a trailer
                for (let j=0; j < videoResults.length; j++) {
                    if (videoResults[j].type === 'Trailer') {
                        const trailerKey = videoResults[j].key;
                        cleanedData.trailer = `https://www.youtube.com/embed/${trailerKey}`;
                        break
                    }
                }
            }
        } catch(err) {
            console.log(err);
        }

        // save the cleaned data
        movies[i] = cleanedData;
    }

    return movies;
}