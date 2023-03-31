import express from "express";
import { getOffers, updateOffer } from "../controllers/offer.js";

const offerRouter = express.Router();

offerRouter.put("/:id", updateOffer);
offerRouter.get("/", getOffers);

export default offerRouter;
