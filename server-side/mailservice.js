import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.email,
    pass: process.env.password
  }
});

const sendMailValidateAccount = async (email, otp) => {
  await transporter.sendMail(
    {
      from: "Authentication Application",
      to: email,
      subject: "Account validation",
      text: `You just did your registration. use this link to validate your account http://localhost:3000/?token=${otp}`,
      html: `<b>You just did your registration. use this link to validate your account http://localhost:3000/?token=${otp}</b>` // plain text body
    },
    function (err, data) {
      if (err) {
        console.log("Something went wrong while trying to send a mail");
      }
    }
  );
};
export default sendMailValidateAccount;
//   html: "<b>Hello mister you did regiester your account in our webapplication</b>" // html body
