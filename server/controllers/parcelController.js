import 'babel-polyfill';
import db from '../db/connection';

/**
 * @description Represents a collection of route handlers for the parcel delivery resource
 * @class ParcelControllers
 */
class ParcelControllers {
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
      pickupAddress, destination, pickupTime, parcelDescription, parcelWeight,
    } = req.body;
    const { userId } = req.user;
    console.log(req.user);
    try {
      const result = await db.query('INSERT INTO parcelOrders (userId, pickupAddress, destination, pickupTime, parcelDescription, parcelWeight) values ($1, $2, $3, $4, $5, $6) RETURNING *', [userId, pickupAddress, destination, pickupTime, parcelDescription, parcelWeight]);
      res.status(201).json(result.rows[0]);
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
   * @param {object} next passes control to the next middleware/handler
   * @returns a response object and status code
   */
  static async getAllOrders(req, res, next) {
    try {
      const result = await db.query('SELECT * FROM parcelOrders');
      res.status(200).json(result.rows);
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
      const result = await db.query('SELECT * FROM parcelOrders WHERE parcelId = $1', [parcelId]);
      if (result.rows.length === 0) return res.status(404).json({ message: 'Order not found' });
      res.status(200).json(result.rows[0]);
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
      const result = await db.query('UPDATE parcelOrders SET status=\'cancelled\' WHERE parcelId = $1 RETURNING *', [parcelId]);
      if (!result.rows[0]) return res.status(404).json({ message: 'Order not found' });
      res.status(200).json(result.rows[0]);
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
      const result = await db.query('UPDATE parcelOrders SET status = $1 WHERE parcelId = $2 RETURNING *', [status, parcelId]);
      return res.status(200).json(result.rows[0]);
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
    const { destination } = req.body;
    const { parcelId } = req.params;
    try {
      const result = await db.query('UPDATE parcelOrders SET destination = $1 WHERE parcelId = $2 RETURNING *', [destination, parcelId]);
      return res.status(200).json(result.rows[0]);
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
      const result = await db.query('UPDATE parcelOrders SET presentLocation = $1 WHERE parcelId= $2 RETURNING *', [presentLocation, parcelId]);
      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.log(error);
      next();
    }
  }
}

export default ParcelControllers;
