import mongoose from "mongoose";
import config from "config";

export default async function connect () {  
    const connectOptions = {
        useNewUrlParser: true, 
        useUnifiedTopology: true
    };    
    const dbURI:string = config.get('dbURI');
    
    try {
        await mongoose.connect(dbURI, connectOptions);
        console.log("MongoDB connection up and running!");
    } catch (err) {
        console.log("Error while connecting to DB: " + err);
    }    
}