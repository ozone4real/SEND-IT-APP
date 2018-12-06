import 'babel-polyfill';
import db from '../db/connection';
import mailer from '../helpers/mailer';
import messages from '../helpers/mailMessages';

const { locationChangeMail, orderCreatedMail } = messages;

/**
 * @description Represents a collection of route handlers for the parcel delivery resource
 * @class ParcelControllers
 */
class ParcelControllers {
  static confirmOrder(req, res) {
    res.status(200).json(req.body);
  }

  /**
   * @description Creates a parcel delivery order
   * @static
   * @param {object} req Request Object
   * @param {object} res Response Object
   * @param {object} next passes control to the next middleware/handler
   * @returns a response object and status code
   */
  static async createOrder(req, res, next) {
    const {
      pickupAddress, destination, pickupTime, parcelDescription, parcelWeight, price,
    } = req.body;
    const { userId } = req.user;
    try {
      const { rows: parcelRows } = await db(`INSERT INTO parcelOrders (userId, pickupAddress, destination, pickupTime, parcelDescription, parcelWeight, price) 
      values ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [userId, pickupAddress, destination, pickupTime, parcelDescription, parcelWeight, price]);

      const { rows: userRows } = await db(`SELECT email, fullname from users
      WHERE userid = $1`, [parcelRows[0].userid]);
      const { email, fullname } = userRows[0];
      const { subject, html } = orderCreatedMail(parcelRows[0], fullname);
      mailer(subject, html, email);

      res.status(201).json(parcelRows[0]);
    } catch (error) {
      console.log(error);
      if (error.detail.match(/userid/i)) return res.status(401).json({ message: "You'll have to be registered to create an order" });
      next();
    }
  }

  /**
   * @description Gets all parcel delivery orders
   * @static
   * @param {object} req Request Object
   * @param {object} res Response Object
   * @param {object} next passes control to the next middleware/handler.
   * @returns a response object and status code.
   */
  static async getAllOrders(req, res, next) {
    try {
      const { rows } = await db('SELECT * FROM parcelOrders');
      res.status(200).json(rows);
    } catch (error) {
      console.log(error);
      next();
    }
  }

  /**
   * @description Gets a single parcel delivery order
   * @static
   * @param {object} req Request Object
   * @param {object} res Response Object
   * @param {object} next passes control to the next middleware/handler
   * @returns a response object and status code
   */
  static async getOneOrder(req, res, next) {
    const { parcelId } = req.params;
    try {
      const { rows } = await db('SELECT * FROM parcelOrders WHERE parcelId = $1', [parcelId]);
      if (rows.length === 0) return res.status(404).json({ message: 'Order not found' });
      res.status(200).json(rows[0]);
    } catch (error) {
      console.log(error);
      next();
    }
  }

  /**
   * @description Cancels a parcel delivery order
   * @static
   * @param {object} req Request Object
   * @param {object} res Response Object
   * @param {object} next passes control to the next middleware/handler
   * @returns a response object and status code
   */
  static async cancelOrder(req, res, next) {
    const { parcelId } = req.params;
    try {
      const { rows } = await db('UPDATE parcelOrders SET status=\'cancelled\' WHERE parcelId = $1 RETURNING *', [parcelId]);
      if (!rows[0]) return res.status(404).json({ message: 'Order not found' });
      res.status(200).json(rows[0]);
    } catch (error) {
      console.log(error);
      next();
    }
  }

  /**
   * @description Changes the status of a parcel delivery order
   * @static
   * @param {object} req Request Object
   * @param {object} res Response Object
   * @param {object} next passes control to the next middleware/handler
   * @returns a response object and status code
   */
  static async changeStatus(req, res, next) {
    const { status } = req.body;
    const { parcelId } = req.params;
    try {
      const { rows } = await db('UPDATE parcelOrders SET status = $1 WHERE parcelId = $2 RETURNING *', [status, parcelId]);
      return res.status(200).json(rows[0]);
    } catch (error) {
      console.log(error);
      next();
    }
  }

  /**
   * @description Changes the destination of a parcel delivery order
   * @static
   * @param {object} req Request Object
   * @param {object} res Response Object
   * @param {object} next passes control to the next middleware/handler
   * @returns a response object and status code
   */
  static async changeDestination(req, res, next) {
    const { destination, price } = req.body;
    const { parcelId } = req.params;
    try {
      const { rows } = await db('UPDATE parcelOrders SET destination = $1, price = $2 WHERE parcelId = $3 RETURNING *', [destination, price, parcelId]);
      return res.status(200).json(rows[0]);
    } catch (error) {
      console.log(error);
      next();
    }
  }

  /**
   * @description Changes the present location of a parcel delivery order
   * @static
   * @param {object} req Request Object
   * @param {object} res Response Object
   * @param {object} next passes control to the next middleware/handler
   * @returns a response object and status code
   */
  static async changePresentLocation(req, res, next) {
    const { presentLocation } = req.body;
    const { parcelId } = req.params;
    try {
      const { rows: parcelRows } = await db(`UPDATE parcelOrders
       SET presentLocation = $1 WHERE parcelId= $2 RETURNING *`,
      [presentLocation, parcelId]);

      const { rows: userRows } = await db(`SELECT email, fullname from users
      WHERE userid = $1`, [parcelRows[0].userid]);
      const { email, fullname } = userRows[0];
      const { subject, html } = locationChangeMail(presentLocation, parcelId, fullname);
      mailer(subject, html, email);

      res.status(200).json(parcelRows[0]);
    } catch (error) {
      console.log(error);
      next();
    }
  }
}

export default ParcelControllers;
