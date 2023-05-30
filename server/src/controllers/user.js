import User, { validateUser } from "../models/User.js";
import { logError } from "../util/logging.js";
import sendEmail from "../util/sendEmail.js";
import validationErrorMessage from "../util/validationErrorMessage.js";

import JWT from "jsonwebtoken";
import Token from "../models/Token.js";
import bcrypt from "bcrypt";

const bcryptSalt = process.env.BCRYPT_SALT;

/**
 * @desc  Creating a new User with doing validation registration
 * @route /api/user/register
 * @method post
 * @access public
 */
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
      const JWTSecret = process.env.JWT_SECRET;
      const salt = await bcrypt.genSalt(bcryptSalt);
      user.password = await bcrypt.hash(user.password, salt);

      const newUser = await User.create(user);

      const token = JWT.sign({ id: newUser._id }, JWTSecret);

      const { password, ...other } = newUser._doc; // to avoid  sending password back to user
      newUser.password = password; // to solve problem of declare password as a variable without assigning it.

      res.status(201).json({ success: true, user: { ...other, token } });
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

/**
 * @desc  Getting the numbers of users who liked this museum (showed when user clicked for details of museum)
 * @route /api/user
 * @method get
 * @access public
 */
export const getFavNum = async (req, res) => {
  try {
    const museumFav = await User.find();
    res.status(200).json({ success: true, result: museumFav });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Unable to get the number of museum favorite",
    });
  }
};

/**
 * @desc  login user
 * @route /api/user/login
 * @method post
 * @access public
 */
export const loginUser = async (req, res) => {
  try {
    const { user } = req.body;
    const userData = await User.findOne({ email: user.email });

    if (!userData) {
      return res
        .status(404)
        .json({ success: false, msg: "invalid email or password!" });
    }

    const isPasswordMatch = await bcrypt.compare(
      user.password,
      userData.password
    );

    if (isPasswordMatch) {
      const isToken = await Token.findOne({ userId: userData._id });
      if (isToken) await isToken.deleteOne();

      const JWTSecret = process.env.JWT_SECRET;
      const token = JWT.sign({ id: userData._id }, JWTSecret);
      const newToken = await Token({
        userId: userData._id,
        token: token,
        createdAt: Date.now(),
      }).save();

      const { password, ...other } = userData._doc; // to avoid  sending password back to user
      userData.password = password; // to solve problem of declare password as a variable without assigning it.
      res.status(201).json({ success: true, user: { ...other, newToken } });
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

/**
 * @desc  Update data of user
 * @route /api/update/:id
 * @method put
 * @access private
 */
export const updateUser = async (req, res) => {
  try {
    const { authUser } = req.body;
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

// We have used this inside the comment controller so that as soon as we created a comment to push the comment Id into the user comments array
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

//
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
