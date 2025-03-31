import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN
}));

// this means that all the data requested from other should be taken in json format only.
app.use(express.json({
    limit: "16kb" // limits the amount of data taken from source
}));

// we sometimes request data from urls whic has %20, + signs between the words, to ignore such we use url encoder in express.js
app.use(express.urlencoded({
    extended: true, // this is written if we want to take objects into object
    limit: "16kb" // limit to amount of data requested
}));

app.use(express.static("public"));

app.use(cookieParser());


//Routers
import userRouter from "./routes/user.route.js";

app.use("/api/v1/users", userRouter);

export { app };