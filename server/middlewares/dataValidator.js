import 'babel-polyfill';
import db from '../db/connection';
import validationHelper from '../helpers/validationHelpers';
import mailer from '../helpers/mailer';
import messages from '../helpers/mailMessages';

const { statusDeliveredMail, statusInTransitMail } = messages;

/**
 * @description Represents a collection of improper data values submitted by a client
 * @class improperUserData
 */
class ImproperValues {
  /**
   * @description captures all improper data from signup form
   * @static
   * @param {object} req Request Object
   * @returns an array of improper data from signup form
   */
  static improperUserData(req) {
    const {
      fullname, email, phoneNo, password,
    } = req.body;

    const fnameTest = /^[a-zA-Z]+? [a-zA-Z]+?( [a-zA-Z]+?)?$/.test(fullname);
    const emailTest = /[-.\w]+@([\w-]+\.)+[\w-]{2,20}/.test(email);
    const phNoTest = /^\d{10,20}$/.test(phoneNo);
    const passwordTest = /.{7,}/.test(password);

    const improperValues = [];

    if (!fnameTest) improperValues.push('Improper name pattern. There should be a space between first and last name. E.g: \'John Smith\'');
    if (!passwordTest) improperValues.push('Password too short. Should be at least 7 characters');
    if (!phNoTest) improperValues.push('Invalid phone No');
    if (!emailTest) improperValues.push('Invalid email');

    return improperValues;
  }

  /**
   * @description captures mproper entries from parcel delivery creation data
   * @static
   * @param {object} req Request Object
   * @returns an array of improper data from parcel delivery order form
   */
  static improperParcelData(req) {
    const {
      pickupAddress, destination, pickupTime, parcelDescription, parcelWeight,
    } = req.body;

    const timeTest = /^\d{4}-((1[0-2])|(0[1-9]))-((3[0-1])|([0-2][0-9]))T(([0-1][0-9])|(2[0-3])):[0-5][0-9]$/.test(pickupTime);
    const pAdTest = /.{15,}/.test(pickupAddress);
    const dAdTest = /.{15,}/.test(destination);
    const pDeTest = /^.{3,40}$/.test(parcelDescription);
    const pWeightTest = /kg/.test(parcelWeight);

    const improperValues = [];

    if (!timeTest) improperValues.push('Improper date-time format or invalid date. Pattern should follow: YYYY-MM-DDThh:mm and date/time must not be behind present');
    if (!pAdTest) improperValues.push('Pickup Address not detailed enough');
    if (!dAdTest) improperValues.push('destination not detailed enough');
    if (!pDeTest) improperValues.push('parcel description not detailed enough or too long. Min. Length:3, Max. Length:40');
    if (!pWeightTest) improperValues.push('parcel weight value must be a positive integer and its unit must be in kg');


    return improperValues;
  }
}

/**
 * @description Represents a collection of input validators
 * @class DataCreationValidator
 */
class DataCreationValidator {
  /**
   * @description validates user signup input
   * @static
   * @param {object} req Request Object
   * @param {object} res Response Object
   * @param {object} next passes control to the next middleware
   */
  static userDataValidator(req, res, next) {
    const dataKeys = ['fullname', 'email', 'phoneNo', 'password'];
    validationHelper(req, res, dataKeys, ImproperValues.improperUserData, next);
  }


  /**
   * @description validates parcel delivery order input
   * @static
   * @param {object} req Request Object
   * @param {object} res Response Object
   * @param {object} next passes control to the next middleware/handler
   */
  static parcelDataValidator(req, res, next) {
    const dataKeys = ['pickupAddress', 'destination', 'pickupTime', 'parcelDescription', 'parcelWeight'];
    validationHelper(req, res, dataKeys, ImproperValues.improperParcelData, next);
  }
}

/**
 * @description Represents a collection of update request validators
 * @class DataUpdateValidator
 */
class DataUpdateValidator {
  /**
   * @description validates cancel requests
   * @static
   * @param {object} req Request Object
   * @param {object} res Response Object
   * @param {object} next passes control to the next middleware/handler
   */
  static async cancel(req, res, next) {
    const { parcelId } = req.params;
    try {
      const { rows } = await db('SELECT status FROM parcelOrders WHERE parcelId = $1', [parcelId]);
      if (!rows[0]) return res.status(404).json({ message: 'Order not found' });
      if (rows[0].status === 'delivered') return res.status(400).json({ message: 'You cannot cancel an already delivered order' });
      next();
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * @description validates change status requests
   * @static
   * @param {object} req Request Object
   * @param {object} res Response Object
   * @param {object} next passes control to the next middleware/handler
   */
  static async status(req, res, next) {
    const validValues = ['in transit', 'delivered'];
    const { status } = req.body;
    const { parcelId } = req.params;
    try {
      const { rows } = await db('SELECT status FROM parcelOrders WHERE parcelId = $1', [parcelId]);
      if (!rows[0]) return res.status(404).json({ message: 'Order not found' });
      if (rows[0].status === 'delivered' || rows[0].status === 'cancelled') {
        return res.status(400)
          .json({ message: 'You cannot change the status of an already delivered or cancelled order' });
      }
      if (!status) return res.status(400).json({ message: 'invalid request, new status not provided' });
      if (!validValues.includes(status)) {
        return res.status(400)
          .json({ message: "Invalid status value. Value must be either 'in transit' or 'delivered'" });
      }
      next();
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * @description validates 'update status' requests with 'delivered' value
   * @static
   * @param {object} req Request Object
   * @param {object} res Response Object
   * @param {object} next passes control to the next middleware/handler
   */
  static async delivered(req, res, next) {
    const { status, receivedBy, receivedAt } = req.body;
    const { parcelId } = req.params;
    if (status !== 'delivered') return next();
    if (!receivedBy || !receivedAt) {
      return res.status(400).json({ message: 'Incomplete request, pls submit the name of the parcel receiver and the time the parcel was delivered' });
    }
    if (!/^\d{4}-((1[0-2])|(0[1-9]))-((3[0-1])|([0-2][0-9]))T(([0-1][0-9])|(2[0-3])):[0-5][0-9]$/.test(receivedAt)) {
      return res.status(400).json({ message: 'Invalid time. Format must be timestamp' });
    }
    try {
      const { rows: parcelRows } = await db(
        `UPDATE parcelOrders SET status= $1, receivedBy= $2, receivedAt= $3
         WHERE parcelId= $4 RETURNING *`,
        [status, receivedBy, receivedAt, parcelId]
      );

      const { rows: userRows } = await db(`SELECT email, fullname from users
      WHERE userid = $1`, [parcelRows[0].userid]);

      const { email, fullname } = userRows[0];
      const { subject, html } = statusDeliveredMail(receivedBy, receivedAt, parcelId, fullname);

      mailer(subject, html, email);

      return res.status(200).json(parcelRows[0]);
    } catch (error) {
      console.log(error.message);
      next();
    }
  }

  /**
   * @description validates 'update status' requests with 'in transit' value
   * @static
   * @param {object} req Request Object
   * @param {object} res Response Object
   * @param {object} next passes control to the next middleware/handler
   */
  static async inTransit(req, res, next) {
    const { status, presentLocation } = req.body;
    const { parcelId } = req.params;

    if (status !== 'in transit') return next();
    if (!presentLocation) {
      return res.status(400)
        .json({ message: "Changing the status to 'in transit' requires a 'present location', value" });
    }
    if (!/[A-Za-z]{2,20}/.test(presentLocation)) {
      return res.status(400).json({ message: 'invalid location or location length too long' });
    }

    try {
      const { rows: parcelRows } = await db(
        `UPDATE parcelOrders
         SET status = $1, presentLocation = $2 
         WHERE parcelId= $3 RETURNING *`,
        [status, presentLocation, parcelId]
      );

      const { rows: userRows } = await db(`SELECT email, fullname from users
      WHERE userid = $1`, [parcelRows[0].userid]);
      const { email, fullname } = userRows[0];
      const { subject, html } = statusInTransitMail(presentLocation, parcelId, fullname);
      mailer(subject, html, email);
      res.status(200).json(parcelRows[0]);
    } catch (error) {
      console.log(error);
      next();
    }
  }


  /**
   * @description validates change destination requests
   * @static
   * @param {object} req Request Object
   * @param {object} res Response Object
   * @param {object} next passes control to the next middleware/handler
   */
  static async destination(req, res, next) {
    const { destination } = req.body;
    const { parcelId } = req.params;
    try {
      const { rows } = await db('SELECT * FROM parcelOrders WHERE parcelId = $1', [parcelId]);
      if (!rows[0]) return res.status(404).json({ message: 'Order not found' });
      const { status, pickupaddress, parcelweight } = rows[0];
      if (status === 'delivered' || status === 'cancelled') {
        return res.status(400)
          .json({
            message: 'You cannot change the destination of an already delivered or cancelled order'
          });
      }
      if (!destination) {
        return res.status(400).json({ message: 'invalid request, new destination not provided' });
      }
      if (!/.{15,}/.test(destination)) {
        return res.status(400).json({ message: 'destination not detailed enough' });
      }
      req.body.pickupAddress = pickupaddress;
      req.body.parcelWeight = parcelweight;
      next();
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * @description validates 'update present location' requests
   * @static
   * @param {object} req Request Object
   * @param {object} res Response Object
   * @param {object} next passes control to the next middleware/handler
   */
  static async presentLocation(req, res, next) {
    const { presentLocation } = req.body;
    const { parcelId } = req.params;
    try {
      const { rows } = await db('SELECT status FROM parcelOrders WHERE parcelId = $1', [parcelId]);
      if (!rows[0]) return res.status(404).json({ message: 'Order not found' });
      if (rows[0].status === 'delivered') {
        return res.status(400)
          .json({ message: 'You cannot change the present location of an already delivered parcel' });
      }
      if (!presentLocation) {
        return res.status(400).json({ message: 'Invalid request, present location not provided' });
      }
      if (!/^\w{2,20}, \w{2,20}$/.test(presentLocation)) {
        return res.status(400).json({ message: "invalid location or location length too long. Provide just city and state name, e.g: 'Ikeja, Lagos'" });
      }
      next();
    } catch (error) {
      console.log(error);
    }
  }
}

export { DataCreationValidator, DataUpdateValidator };
