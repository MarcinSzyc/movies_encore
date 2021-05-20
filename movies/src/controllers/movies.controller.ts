import {Request, Response} from "express";
import {returnAllMovies, createNewMovie} from "../utils/movies.util";

export async function getAllMovies (req: Request, res: Response) {
    try {
        const allMovies = await returnAllMovies();
        return res.status(200).json(allMovies);
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}

export async function createMovie (req: Request, res: Response) {
    try {
        const movieTitle:string = req.body.movieName;
        const userName:string = res.locals.userName.name;
        const createdMovie = await createNewMovie(movieTitle, userName);
        return res.status(200).json({createdMovie});
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}