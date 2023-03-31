import User, { validateUser } from "../models/User.js";
import { logError } from "../util/logging.js";
import sendEmail from "../util/sendEmail.js";
import validationErrorMessage from "../util/validationErrorMessage.js";

export const createUser = async (req, res) => {
  try {
    const { user } = req.body;
    if (typeof user !== "object") {
      res.status(400).json({
        success: false,
        msg: `You need to provide a 'user' object. Received: ${JSON.stringify(
          user
        )}`,
      });

      return;
    }

    const errorList = validateUser(user);

    if (errorList.length > 0) {
      res
        .status(400)
        .json({ success: false, msg: validationErrorMessage(errorList) });
    } else {
      const newUser = await User.create(user);

      res.status(201).json({ success: true, user: newUser });
    }
  } catch (error) {
    logError(error);
    if (error.name === "MongoServerError" && error.code === 11000) {
      res.status(400).json({ success: false, msg: "Email already exists" });
    } else {
      res.status(500).json({
        success: false,
        msg: "Unable to create user, try again later",
      });
    }
  }
};

export const loginUser = async (req, res) => {
  try {
    const { user } = req.body;
    const userData = await User.findOne({ email: user.email });

    if (!userData) {
      res.status(404).json({ success: false, msg: "Wrong Credentials!" });
      return;
    }

    if (user.password === userData.password) {
      res.status(201).json({ success: true, user: userData });
    } else {
      res.status(400).json({ success: false, msg: "Wrong Credentials!" });
      return;
    }
  } catch (error) {
    logError(error);
    res
      .status(500)
      .json({ success: false, msg: "Unable to login user, try again later" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { authUser } = req.body;
    //console.log(req.body);
    //console.log(authUser);
    //console.log(authUser.profilePicture);
    if (typeof authUser !== "object") {
      return res.status(400).json({
        success: false,
        msg: `You need to provide a 'user' object. Received: ${JSON.stringify(
          authUser
        )}`,
      });
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: authUser,
      },
      { new: true }
    );
    res.status(200).json({ success: true, user: updatedUser });
  } catch (err) {
    logError(err);
    res
      .status(500)
      .json({ success: false, msg: "You can update only your account" });
  }
};

// Gokhan: I have used this inside the comment controller so that as soon as I created a comment to push the comment Id into the user comments array
export const addCommentIdToUser = async (userId, commentId) => {
  try {
    await User.findByIdAndUpdate(
      userId,
      { $push: { comments: commentId } },
      { new: true }
    );
  } catch (error) {
    logError(error);
  }
};

export const getAllComments = async (req, res) => {
  const userId = req.params.userId;
  User.findOne({ _id: userId }, { comments: 1 })
    .populate({
      path: "comments",
      populate: [
        { path: "museumId", select: { name: 1 } },
        {
          path: "userId",
          select: { firstName: 1, lastName: 1, profilePicture: 1 },
        },
      ],
      // populate: { path: "userId", select: { firstName: 1, lastName: 1 } },
    })
    .exec((err, comments) => {
      if (err) {
        res.status(400).json({
          success: false,
          msg: `unable to get user comments with user id: ${userId}`,
        });
      }
      res.status(200).json({ success: true, result: comments });
    });
};

// update the favorite list
export const updateFavorite = async (req, res) => {
  try {
    const { userFavorite } = req.body;

    if (typeof userFavorite !== "object") {
      return res.status(400).json({
        success: false,
        msg: `You need to provide a 'favorite' array. Received: ${JSON.stringify(
          userFavorite
        )}`,
      });
    }

    const updatedFavorite = await User.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $set: { favoriteMuseums: userFavorite },
      },
      { new: true }
    );
    res.status(200).json({ success: true, userFavorite: updatedFavorite });
  } catch (err) {
    logError(err);
    res
      .status(500)
      .json({ success: false, msg: "Your favorite list is Not updated" });
  }
};

export const profilePictureUpload = async (req, res) => {
  const { base64 } = req.body;
  try {
    User.create({ profilePicture: base64 });
    res.send({ Status: "ok" });
  } catch (error) {
    res.send({ Status: "error", data: error });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const userData = await User.findOne({ email });

    if (!userData) {
      res.status(404).json({ success: false, msg: "User Not Exist!" });
      return;
    } else {
      const random = Math.floor(100000 + Math.random() * 900000);
      sendEmail(email, random)
        .then(
          res.status(200).json({
            success: true,
            reset: { random: random, userId: userData._id },
          })
        )
        .catch((error) => res.status(500).send(error.message));
      return;
    }
  } catch (error) {
    logError(error);
    res.status(500).json({
      success: false,
      msg: "Unable to reset password, try again later",
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;

    await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: { password: password },
      },
      { new: true }
    );
    res.status(200).json({ success: true });
  } catch (err) {
    logError(err);
    res
      .status(500)
      .json({ success: false, msg: "Your password is not updated" });
  }
};
