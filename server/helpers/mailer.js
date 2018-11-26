import 'babel-polyfill';
import nodemailer from 'nodemailer';


const mailer = async (subject, html, receiver) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    service: 'Gmail',
    port: '587',
    auth: {
      user: 'senditcourierapp@gmail.com',
      password: process.env.mail_password,
    },
    secure: false,
    tls: {
      rejectUnauthorized: false
    }
  });

  const mailOptions = {
    from: 'senditcourierapp@gmail.com',
    to: receiver,
    subject,
    html
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email Sent. ${info.response}`);
  } catch (error) {
    console.log(error);
  }
};

export default mailer;
