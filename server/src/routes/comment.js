import express from "express";
import {
  createComment,
  updateComment,
  deleteComment,
} from "../controllers/comment.js";

const commentRouter = express.Router();

commentRouter.post("/create", createComment);
commentRouter.put("/edit", updateComment);
commentRouter.delete("/delete", deleteComment);

export default commentRouter;
