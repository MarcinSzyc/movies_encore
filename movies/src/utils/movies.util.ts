import Movie from "../models/movies.model";
import config from "config";
import axios from "axios";

export async function returnAllMovies() {
    try {
        return await Movie.find();
    } catch (error) {
        throw new Error("Return All Movies: error while trying to return Movies: " + error.message);
    }
}

export async function createNewMovie (movieTitle: string, username: string) {
    var movieDetails;

    if (!movieTitle || !username) {
        throw new Error("Create Movie: missing input parameters to create new movie.");
    }


    const movies:any = await findMovie(movieTitle);
    const isMovieAlreadyInDB = movies.length > 0;
    if (isMovieAlreadyInDB) {
        throw new Error("Create Movie: movie with this name already present in database.");
    }

    try {
        movieDetails = await fetchMovieDetails(movieTitle);
        const newMovie = new Movie({
            title: movieDetails.data.Title,
            released: movieDetails.data.Released,
            genre: movieDetails.data.Genre,
            directory: movieDetails.data.Director,
            createdBy: username
        })
        return await newMovie.save();
    } catch (error) {
        throw new Error("Create Movie: error while saving data to DB: " + error.message);
    }
}

const fetchMovieDetails = async (movieTitle:string) => {
    if (!movieTitle) {
        throw new Error("Movie Fetch: no movie title provided");
    }

    try {
        const omdbURI = config.get('omdbURI');
        const omdbKey = config.get('omdbKey');
        const url = omdbURI + 'apikey=' + omdbKey + '=';
        const movieDetails = await axios({
            method: 'get',
            url: url + movieTitle
        })
        return movieDetails;
    } catch (error) {
        throw new Error("Movie Fetch: error while reaching omdb: " + error.message);
    }
}

const findMovie = async (movieTitle:string) => {
    if (!movieTitle) {
        throw new Error("Movie Find: no movie title provided");
    }

    var data;

    try {
        let querryObj = { 
            title : movieTitle
        }
        data = await Movie.find(querryObj);
    } catch (error) {
        throw new Error("Movie Find: error while searching for movie in database: " + error.message);
    }
    return data;
}