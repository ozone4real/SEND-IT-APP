class Messages {
  static statusInTransitMail(location, id) {
    return {
      subject: 'Re: Your parcel delivery status',
      html: `<header style="text-align: center; background: blue; padding: 5px;"><h1 style="color: gold" >SeNd It</h1></header>
        <p>Your parcel ${id} is now in transit and presently at ${location}</p>`
    };
  }

  static statusDeliveredMail(receivedBy, receivedAt, id) {
    return {
      subject: 'Re: Your parcel delivery status',
      html: `<header style="text-align: center; background: blue; padding: 5px;"><h1 style="color: gold" >SeNd It</h1></header>
          <p>Your parcel ${id} has been delivered !</p>
          <ul>
          <li>received by : ${receivedBy}</li>
          <li><received at: ${receivedAt}</li>
          </ul>`
    };
  }

  static locationChangeMail(location, id) {
    return {
      subject: 'Re: Your parcel delivery status',
      html: `<header style="text-align: center; background: blue; padding: 5px;"><h1 style="color: gold" >SeNd It</h1></header>
        <p>Your parcel ${id} is presently at ${location}</p>`
    };
  }
}

export default Messages;
