/**
 * @description represents a collection of email body
 * @class Messages
 */
class Messages {
  /**
   * @description Email body for signup
   * @static
   * @param {string} name Client's name
   * @returns an object
   */
  static signUpMail(name) {
    return {
      subject: 'Welcome To Send It !',
      html: `<div style="background:#E6E6E6;">
      <header style="text-align: center; background: #3104B4; padding: 5px;"><h1 style="color: gold" >SeNd It</h1></header>
      <section style="font-size: 13px; width: 90%; background-color: white; padding: 5px; margin-top: 10px; margin: auto;"> 
      <p>Hello ${name}. Welcome to send it. We are glad to have you. Do you need to deliver a package to a particular location?
      we are at your service anytime. We go the distance so you don't have to.
      Make you order now!
      </p>
      </section>
      </div>`
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
    return {
      subject: 'Order successfully created',
      html: `<div style="background:#E6E6E6;">
      <header style="text-align: center; background: #3104B4; padding: 5px;"><h1 style="color: gold" >SeNd It</h1></header>
      <section style="font-size: 13px; width:90%; background-color: white; padding: 5px; margin-top: 10px; margin: auto;"> 
      <p>Hello ${name}. Your order has been recorded. 
      A delivery man would call you soon to find out more about your request before coming to get your parcel for delivery. Below are details of your order:</p>
      <ul>
      <li> Parcel id: ${parcel.parcelid}.</li>
      <li> Pickup location: ${parcel.pickupaddress}.</li>
      <li> Destination: ${parcel.destination}.</li>
      <li> Pickup Time: ${parcel.pickuptime}.</li>
      <li> Parcel description: ${parcel.parceldescription}.</li>
      <li>Parcel Weight: ${parcel.parcelweight}.</li>
      </ul>
      </section>
      </div>`
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
    return {
      subject: 'Update on your parcel delivery order',
      html: `<div style="background:#E6E6E6;">
      <header style="text-align: center; background: #3104B4; padding: 5px;"><h1 style="color: gold" >SeNd It</h1></header>
      <section style="font-size: 13px; width: 90%; background-color: white; padding: 5px; margin-top: 10px; margin: auto;"> 
      <p>Hello ${name}. Your parcel with parcel id: <b>${id}</b> is in transit and presently at <b>${location}</b>.</p>
      </section>
      </div>`
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
    return {
      subject: 'Update on your parcel delivery order',
      html: `<div style="background:#E6E6E6;">
      <header style="text-align: center; background: #3104B4; padding: 5px;"><h1 style="color: gold" >SeNd It</h1></header>
      <section style="font-size: 13px; width:90%; background-color: white; padding: 5px; margin-top: 10px; margin: auto;">
      <p>Hello ${name}. Your parcel with parcel id: <b>${id}</b> has been delivered !</p>
      <ul>
      <li>received by : <b>${receivedBy}</b></li>
      <li>received at: <b>${receivedAt}</b></li>
      </ul>
      </section>
      </div>`
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
    return {
      subject: 'Update on your parcel delivery order',
      html: `<div style="background:#E6E6E6;">
        <header style="text-align: center; background: #3104B4; padding: 5px;"><h1 style="color: gold" >SeNd It</h1></header>
        <section style="font-size:13px; width:90%; background-color: white; padding: 5px; margin-top: 10px; margin: auto;">
        <p>Hello ${name}. Your parcel with parcel id ${id} is presently at ${location}.</p>
        </section>
        </div>`
    };
  }
}

export default Messages;
