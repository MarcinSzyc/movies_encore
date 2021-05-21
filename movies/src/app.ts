import config from "config";
import express from "express";
import connect from "./db/connect";
import routes from "./routes";

const port:number = config.get("port");

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.listen(port, () => {
    connect();
    routes(app);
});

export default app;