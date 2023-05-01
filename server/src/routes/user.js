import express from "express";
import {
  createUser,
  getAllComments,
  loginUser,
  updateUser,
  forgotPassword,
  updateFavorite,
  getFavNum,
  profilePictureUpload,
  resetPassword,
} from "../controllers/user.js";

const userRouter = express.Router();
userRouter.post("/upload", profilePictureUpload);
userRouter.post("/register", createUser);
userRouter.post("/login", loginUser);
userRouter.put("/:id", updateUser);
userRouter.put("/update/:id", updateFavorite);
userRouter.get("/", getFavNum);
userRouter.get("/comments/:userId", getAllComments);
userRouter.post("/forgotPassword", forgotPassword);
userRouter.put("/resetPassword/:userId", resetPassword);

export default userRouter;
