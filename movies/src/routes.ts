import {Express} from "express";
import checkLimit from "./middleware/checklimit";
import authenticateUser from "./middleware/authenticateUser";
import {getAllMovies, createMovie} from "./controllers/movies.controller";

export default (app: Express):any => {
    //GET movies
    app.get('/movies', getAllMovies);

    //POST movies
    app.post('/movies', authenticateUser, checkLimit, createMovie);
} 
