import mongoose from "mongoose";

export interface Movie extends mongoose.Document {
    title: string,
    released: Date,
    genre: string,
    directory: string,
    createdBy: string
}

const Schema = mongoose.Schema;

const movieSchema = new Schema({
    title: {
        type: String,
        requires: true
    },
    released: {
        type: Date,
        requires: true
    },
    genre: {
        type: String,
        requires: true
    },
    directory: {
        type: String,
        requires: true
    },
    createdBy: {
        type: String,
        requires: true
    }
}, {timestamps: true});

const Movie = mongoose.model<Movie>('Movie', movieSchema);

export default Movie;