import {Express} from "express";
import checkLimit from "./middleware/checklimit";
import authenticateUser from "./middleware/authenticateUser";
import {getAllMovies, createMovie, showLoginView} from "./controllers/movies.controller";

export default (app: Express):any => {
    //GET movies
    app.get('/movies', authenticateUser, getAllMovies);

    //POST movies
    app.post('/movies', authenticateUser, checkLimit, createMovie);

    //POST movies
    app.get('/login', showLoginView);
} 
