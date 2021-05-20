import {Request, Response, NextFunction} from "express";
import Movie from "../models/movies.model";

const checkLimit = (req:Request, res:Response, next: NextFunction) => {
    var userName, userRole;
    try {
        userName = res.locals.userName;
        userRole = userName.role;
    } catch (error) {
        return res.status(500).json({ error: "Check Limit: error while creating movie. UserName object missing: " + error.message});
    }

    const searchObj = {
        createdBy: userName.name
    }

    const isBasic = userRole === 'basic';

    if (isBasic) {
        Movie.find(searchObj, (err, data) => {

            if (err) {
                return res.status(500).json({ error: "Check Limit: error while checking DB limits: " + err.message });
            }

            const month = new Date().getMonth();
            const dataLength = data.filter((element) => {
                const tempMovie:any = element;
                return tempMovie.createdAt.getMonth() === month;
            })

            if (dataLength.length >= 5) {
                return res.status(500).json({ error: "Check Limit: user reached monthly limit of requests." })
            } else {
                next();
            }
        })  
    }
}

export default checkLimit;