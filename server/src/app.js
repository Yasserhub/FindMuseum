import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import userRouter from "./routes/user.js";
import museumRouter from "./routes/museum.js";
import commentRouter from "./routes/comment.js";
import offerRouter from "./routes/offer.js";

// Create an express server
const app = express();
app.use(bodyParser.json({ limit: "5mb" }));
app.use(bodyParser.urlencoded({ limit: "5mb", extended: true }));
// Tell express to use the json middleware
app.use(express.json());
// Allow everyone to access our API. In a real application, we would need to restrict this!
app.use(cors());

/****** Attach routes ******/
/**
 * We use /api/ at the start of every route!
 * As we also host our client code on heroku we want to separate the API endpoints.
 */

app.use("/api/user", userRouter);
app.use("/api/museum", museumRouter);
app.use("/api/comment", commentRouter);
app.use("/api/offer", offerRouter);

export default app;
