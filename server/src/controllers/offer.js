import Offer from "../models/Offer.js";
import Museum from "../models/Museum.js";
import User from "../models/User.js";
import { sendMail } from "../util/mailer.js";
import { logError } from "../util/logging.js";

export const getOffers = async (req, res) => {
  const currentDate = new Date().toISOString();
  try {
    const offers = await Offer.find({
      numberOfTickets: { $gt: 0 },
      expireDate: { $gte: currentDate },
    })
      .populate({ path: "museumId", model: Museum })
      .exec();
    res.status(200).json({ success: true, result: offers });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Unable to get offers, please try again later",
    });
  }
};

export const updateOffer = async (req, res) => {
  const { buyer, numberOfTickets } = req.body;
  const { id } = req.params;
  try {
    const offerExist = await Offer.findOne({
      $and: [{ _id: id }, { _id: id, buyers: buyer }],
    });
    if (!offerExist) {
      await Offer.findOneAndUpdate(
        { _id: id },
        {
          $set: {
            numberOfTickets: numberOfTickets,
          },
          $push: {
            buyers: [buyer],
          },
        },
        { new: true }
      );
      sendEmail(id);
      res.status(200).json({
        success: true,
        result: "Congratulations! Your offer is in your email-box now!",
      });
    } else {
      res
        .status(208)
        .json({ success: true, result: "You have already got the offer!" });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Unable to update offer, please try again later",
    });
  }
};

const sendEmail = async (offerId) => {
  try {
    const populatedOffer = await Offer.findById(offerId)
      .populate({ path: "buyers", model: User })
      .exec();
    const buyers = populatedOffer.buyers;
    let lastBayerEmailName;
    if (buyers.length === 1) {
      lastBayerEmailName = buyers[0];
    } else {
      lastBayerEmailName = buyers[buyers.length - 1];
    }
    const { firstName, email } = lastBayerEmailName;
    sendMail(firstName, email);
  } catch (error) {
    logError(error.message);
  }
};
