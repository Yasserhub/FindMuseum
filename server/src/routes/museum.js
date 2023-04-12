import express from "express";
import {
  getMuseumById,
  getMuseums,
  getMuseumNamePlace,
} from "../controllers/museum.js";

const museumRouter = express.Router();

museumRouter.get("/", getMuseums);
museumRouter.get("/search/:key", getMuseumNamePlace);
museumRouter.get("/:museumId", getMuseumById);

export default museumRouter;
