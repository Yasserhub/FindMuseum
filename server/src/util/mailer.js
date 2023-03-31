import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
import { logError, logInfo } from "./logging.js";

export const sendMail = async (firstName, email) => {
  const randomCode = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_PASSWORD,
      },
    });
    const info = await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Offer winner",
      html: `<!DOCTYPE html>
      <html lang="en" >
      <head>
        <meta charset="UTF-8">
        <title>Offer Winner</title>
        
      </head>
      <body>
      
      <div style="font-family: Helvetica,Arial,sans-serif;max-width:600px;overflow:auto;line-height:2">
        <div style="margin:50px auto;padding:20px 0">
          <div style="border-bottom:1px solid #eee">
            <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Find Museum</a>
          </div>
          <p style="font-size:1.1em">Hello dear ${firstName},</p>
          <p>Congratulations! Your offer code is <b>${randomCode}</b>!</p>
          <p>Have a nice time and do not forget to share your impressions with us.</p>
          <p style="font-size:0.9em;">Sincerely, Find Museum team</p>
          <hr style="border:none;border-top:1px solid #eee" />
          <div style="float:left;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
            <p>If you wish to cancel our special offer, please contact us via e-mail or phone.</p>
          </div>
        </div>
      </div>
      <!-- partial -->
        
      </body>
      </html>`,
    });
    logInfo(info.messageId);
  } catch (error) {
    logError(error.message);
  }
};
