import nodemailer from "nodemailer";

const sendEmail = (recipient_email, random) => {
  const myEmail = process.env.SENDER_EMAIL;
  const myPassword = process.env.SENDER_PASSWORD;

  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: myEmail,
        pass: myPassword,
      },
    });

    const mail_configs = {
      from: myEmail,
      to: recipient_email,
      subject: "Reset Password",
      html: `<!DOCTYPE html>
      <html lang="en" >
      <head>
        <meta charset="UTF-8">
        <title>Reset Password</title>
        
      </head>
      <body>
      
      <div style="font-family: Helvetica,Arial,sans-serif;max-width:600px;overflow:auto;line-height:2">
        <div style="margin:50px auto;padding:20px 0">
          <div style="border-bottom:1px solid #eee">
            <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Find Museum</a>
          </div>
          <p style="font-size:1.1em">Hello,</p>
          <p>We received a request to reset your password.<br />Let's get you a new one with this verification code <b>${random}</b> !</p>
          <p style="font-size:0.9em;">Regards,<br />Find Museum</p>
          <hr style="border:none;border-top:1px solid #eee" />
          <div style="float:left;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
            <p>Please ignore this email if you did not request a password change.</p>
          </div>
        </div>
      </div>
      <!-- partial -->
        
      </body>
      </html>`,
    };
    transporter.sendMail(mail_configs, function (error) {
      if (error) {
        return reject({ message: "An error has occurred" });
      }
      return resolve({ message: "Email sent successfully" });
    });
  });
};

export default sendEmail;
