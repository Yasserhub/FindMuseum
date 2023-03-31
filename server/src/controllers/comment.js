import Comment, { validateComment } from "../models/Comment.js";
import Museum from "../models/Museum.js";
import User from "../models/User.js";
import { logError } from "../util/logging.js";
import validationErrorMessage from "../util/validationErrorMessage.js";
import { addCommentIdToUser } from "../controllers/user.js";
import {
  addCommentIdToMuseum,
  updateAvarageRate,
} from "../controllers/museum.js";

export const createComment = async (req, res) => {
  try {
    const { userId, museumId, rate, review } = req.body.comment;
    const newCommentToCreate = {
      userId,
      museumId,
      rate,
      review,
    };
    if (typeof newCommentToCreate !== "object") {
      res.status(400).json({
        success: false,
        msg: `You need to provide a 'newCommentToCreate' object. Received: ${JSON.stringify(
          newCommentToCreate
        )}`,
      });

      return;
    }

    const errorList = validateComment(newCommentToCreate);

    if (errorList.length > 0) {
      res
        .status(400)
        .json({ success: false, msg: validationErrorMessage(errorList) });
    } else {
      const newComment = await Comment.create(newCommentToCreate);
      //Gokhan: after created a new comment we are setting the comment Id to the user's comments array;
      addCommentIdToUser(newComment.userId, newComment._id);
      //Gokhan: after created a new comment we are setting the comment Id to the museum's comments array;
      addCommentIdToMuseum(
        newComment.museumId,
        newComment._id,
        newComment.rate
      );
      res.status(201).json({ success: true, comment: newComment });
    }
  } catch (error) {
    logError(error);
    res.status(500).json({
      success: false,
      msg: "Unable to create comment, try again later",
    });
  }
};

export const updateComment = async (req, res) => {
  // 1) PART ONE IS "UPDATING THE MUSEUM'S AVARAGE RATING"
  //Gokhan: the rate below updated rate for that specific museum
  const { commentId, rate, review, museumId } = req.body.comment;
  //Gokhan: we get that rate above and send it to the updateAvarageRate method this methods will call that museums all comment ratings and will evaluate the last avarage rate of that museum and return it.
  const avarageRate = await updateAvarageRate(museumId, rate);
  //Gokhan: and here we will set the new avarage rating to that museum
  try {
    await Museum.findByIdAndUpdate(
      museumId,
      { rating: avarageRate },
      { new: true }
    );
  } catch (error) {
    logError(error);
  }
  // 2) PART TWO IS "UPDATING THE EXISTING COMMENT"
  //Gokhan: as of here, we started to update comment all of the above code is related the updating The museum's avarage rate according to updated comment and rating.
  try {
    const commentToUpdate = {
      rate,
      review,
    };
    if (typeof commentToUpdate !== "object") {
      return res.status(400).json({
        success: false,
        msg: `You need to provide a 'commentToUpdate' object. Received: ${JSON.stringify(
          commentToUpdate
        )}`,
      });
    }

    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      { $set: commentToUpdate },
      { new: true }
    );
    res
      .status(200)
      .json({ success: true, type: "update", comment: updatedComment });
  } catch (err) {
    logError(err);
    res
      .status(500)
      .json({ success: false, msg: "You can update only your review" });
  }
};

export const deleteComment = async (req, res) => {
  const { commentId } = req.body.comment;
  try {
    //1)  Gokhan: first user is deleting his/her comment from comments in the profile
    const deletedComment = await Comment.findByIdAndRemove(commentId);
    res.status(200).json({ success: true, deletedComment: deletedComment });
    //2)  Gokhan: after deleting comment from profile so comments collection then we are deleting
    // that comment inside from the museum collection's comments array/field
    await Museum.updateOne(
      { _id: deletedComment.museumId },
      { $pull: { comments: commentId } }
    );
    //3)  Gokhan: after deleting comment from profile so from the comment collection then we are deleting
    // that comment inside from the user collection's comments array/field
    await User.updateOne(
      { _id: deletedComment.userId },
      { $pull: { comments: commentId } }
    );
  } catch (error) {
    logError(error);
    res.status(500).json({
      success: false,
      msg: `Encountered a error while deleting comment with id: ${commentId}`,
    });
  }
};
