import Museum from "../models/Museum.js";
import { logError } from "../util/logging.js";

export const getMuseums = async (req, res) => {
  try {
    const museums = await Museum.find();
    res.status(200).json({ success: true, result: museums });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Unable to get museums, please try again later",
    });
  }
};

export const getMuseumNamePlace = async (req, res) => {
  const { key } = req.params;
  try {
    const museumNamePlaceResult = await Museum.find({
      $or: [
        { name: { $regex: key, $options: "i" } },
        { "address.city": { $regex: key, $options: "i" } },
      ],
    }).exec();
    res.status(200).json({ success: true, result: museumNamePlaceResult });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: `Museum with the name ${key} was not found`,
    });
  }
};

export const getMuseumById = async (req, res) => {
  const id = req.params.museumId;
  Museum.findOne({ _id: id })
    .populate({
      path: "comments",
      populate: {
        path: "userId",
        select: { firstName: 1, lastName: 1, profilePicture: 1 },
      },
    })
    .exec((err, museum) => {
      if (err) {
        res.status(400).json({
          success: false,
          msg: `unable to get museum with id: ${id}`,
        });
      }
      res.status(200).json({ success: true, result: museum });
    });
};

// Gokhan: I have used this inside the comment controller so that as soon as I created a comment to push the comment Id into the museum comments array
export const addCommentIdToMuseum = async (
  museumId,
  commentId,
  newCommentRate
) => {
  const avarageRate = await updateAvarageRate(museumId, newCommentRate);
  try {
    await Museum.findByIdAndUpdate(
      museumId,
      { $push: { comments: commentId }, rating: avarageRate },
      { new: true }
    );
  } catch (error) {
    logError(error);
  }
};

// Gokhan: this method updated the avarage rating of the museum's total comment rate and return it inside the addCommentIdToMuseum method that is above and adds that avaragaRate to that museum's rating field in the database
export const updateAvarageRate = async (museumId, newCommentRate) => {
  let avarageRate = 0;

  const ratesOfMuseum = await Museum.findOne(
    { _id: museumId },
    { projection: { comments: true } }
  ).populate({
    path: "comments",
    select: { rate: 1 },
  });
  // length +1 because I didnt fetch the last comment's rate I got last comment's rate above "newCommentRate" manually so I added +1;
  let length = ratesOfMuseum.comments.length + 1;
  avarageRate = ratesOfMuseum.comments.reduce(
    (acc, current) => acc + Number(current.rate),
    Number(newCommentRate)
  );
  avarageRate = Math.round(avarageRate / length);
  return avarageRate;
};
