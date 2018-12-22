/**
 * @description represents a collection of email body
 * @class Messages
 */
class Messages {
  static messageHTML(mailMessage) {
    return `<div style="font-family: 'Verdana';">
      <header style="text-align: center; background: #0B0B61; padding: 5px;"><h1 style="color: gold; margin-bottom:0;">SeNd It</h1><small style="color: white; margin-top:0;"><i>fast, reliable, efficient</i></small></header>
      <section style="font-size: 13px; background-color: white; padding: 10px; margin: 20px auto; border: 10px solid #F2F2F2;"> 
      ${mailMessage}
      </section>
      </div>`;
  }

  /**
   * @description Email body for signup
   * @static
   * @param {string} name Client's name
   * @returns an object
   */
  static signUpMail(name) {
    const message = `<p>Hello <b><i>${name}</i></b>. Welcome to send it. We are glad to have you. Do you need to deliver a package to a particular location?
    we are at your service anytime. Our <a href='http://sendit03.herokuapp.com/services.html'>services</a> are worldclass and our prices are affordable.
    Start delivering your parcels through us now.
    <a href='https://sendit03.herokuapp.com/bookings.html'>Make your order now</a>
    </p>`;
    return {
      subject: "Welcome To Send It !",
      html: Messages.messageHTML(message)
    };
  }

  /**
   * @description Email body for order creation
   * @static
   * @param {object} parcel Parcel Object from database
   * @param {string} name Client's name
   * @returns an object
   */
  static orderCreatedMail(parcel, name) {
    const message = `<p>Hello <b><i>${name}</i></b>. Your order has been recorded. 
    A delivery man would call you soon to find out more about your request before coming to get your parcel for delivery. Below are details of your order:</p>
    <ul>
    <li> <b>Parcel id:</b> ${parcel.parcelid}.</li>
    <li> <b>Pickup location:</b> <address>${
      parcel.pickupaddress
    }.</address></li>
    <li> <b>Destination:</b> <address>${parcel.destination}.</address></li>
    <li> <b>Pickup Time:</b> ${parcel.pickuptime}.</li>
    <li> <b>Parcel description:</b> ${parcel.parceldescription}.</li>
    <li> <b>Parcel Weight:</b> ${parcel.parcelweight}.</li>
    <li> <b>Price:</b> N${parcel.price}.</li>
    </ul>
    <p>Please note that you can change the destination of your parcel or cancel your parcel delivery <a href="https://sendit03.herokuapp.com/profile.html">HERE</a></p>`;

    return {
      subject: "Order successfully created",
      html: Messages.messageHTML(message)
    };
  }

  /**
   * @description Email body for status update
   * @static
   * @param {string} location Present location of the parcel
   * @param {number} id ID of the parcel
   * @param {string} name Name of the user
   * @returns an object
   */
  static statusInTransitMail(location, id, name) {
    const message = `<p>Hello <b><i>${name}</i></b>. Your parcel with parcel id: <b>${id}</b> is in transit and presently at <address><b>${location}</b>.</address></p>
    <p>You can <a href="http://sendit03.herokuapp.com/track.html?parcelId=${id}">track your parcel</a> while it is
     in transit</p>`;
    return {
      subject: "Update on your parcel delivery order",
      html: Messages.messageHTML(message)
    };
  }

  /**
   * @description Email content for when a parcel has been delivered
   * @static
   * @param {string} receivedBy Name of parcel receiver
   * @param {string} receivedAt Time the parcel was delivered
   * @param {number} id ID of the parcel
   * @param {string} name Name of thr user
   * @returns an object
   */
  static statusDeliveredMail(receivedBy, receivedAt, id, name) {
    const message = `<p>Hello <b><i>${name}</i></b>. Your parcel with parcel id: <b>${id}</b> has been delivered !</p>
    <ul>
    <li>Received by : <b>${receivedBy}</b></li>
    <li>Time received: <b>${new Date(receivedAt)}</b></li>
    </ul>
    <p>Thank you very much for your patronage and we look forward to offering you more of our service</p>
    <i>Regards. SEND IT</i>`;

    return {
      subject: "Update on your parcel delivery order",
      html: Messages.messageHTML(message)
    };
  }

  /**
   * @description Email content for updates on present location
   * @static
   * @param {string} location Present location of the parcel
   * @param {number} id ID of the parcel
   * @param {string} name name of the user
   * @returns an object
   */
  static locationChangeMail(location, id, name) {
    const message = `<p>Hello <b><i>${name}</i></b>. Your parcel with parcel id <b>${id}</b> is presently at <address><b>${location}.</b></address></p>
    <p>You can <a href="http://sendit03.herokuapp.com?parcelId=${id}">track your parcel</a> while it is in transit</p>`;
    return {
      subject: "Update on your parcel delivery order",
      html: Messages.messageHTML(message)
    };
  }
}

export default Messages;
