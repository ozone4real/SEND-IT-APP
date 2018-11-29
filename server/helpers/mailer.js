import 'babel-polyfill';
import sgMail from '@sendgrid/mail';

const mailer = (subject, html, receiver) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: receiver,
    from: 'senditcourierapp@gmail.com',
    subject,
    html
  };
  sgMail
    .send(msg)
    .then(result => console.log('mail successfully sent'))
    .catch(error => console.log(error));
};


export default mailer;
