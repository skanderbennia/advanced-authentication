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

const sendMailForgetPassword = async (email, otp) => {
  await transporter.sendMail(
    {
      from: "Authentication service",
      to: email,
      subject: "Forget Password",
      text: `Here's a link to reset you password http://localhost:3000/forgetPassword/?token=${otp}`,
      html: `Here's a link to reset you password http://localhost:3000/forgetPassword/?token=${otp}</b>` // plain text body
    },
    function (err, data) {
      if (err) {
        console.log("Something went wrong while trying to send a mail");
      }
    }
  );
};
export default sendMailForgetPassword;
//   html: "<b>Hello mister you did regiester your account in our webapplication</b>" // html body
