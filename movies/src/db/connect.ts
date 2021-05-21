import mongoose from "mongoose";
import config from "config";

export default async function connect ():Promise<any> {
    const dbURI:string = config.get('dbURI');

    const connectOptions = {
        useNewUrlParser: true, 
        useUnifiedTopology: true
    };    
    
    try {
        await mongoose.connect(dbURI, connectOptions);
        console.log("MongoDB connection up and running!");
    } catch (err) {
        console.log("Error while connecting to DB: " + err);
        process.exit(1);
    }    
}