import 'babel-polyfill';
import db from '../db/connection';

class ParcelControllers {
  static async createOrder(req, res, next) {
    const {
      pickupAddress, destination, pickupTime, parcelDescription, parcelWeight,
    } = req.body;
    const { userId } = req.user;
    console.log(req.user);
    try {
      const result = await db.query('INSERT INTO parcelOrders (userId, pickupAddress, destination, pickupTime, parcelDescription, parcelWeight) values ($1, $2, $3, $4, $5, $6) RETURNING *', [userId, pickupAddress, destination, pickupTime, parcelDescription, parcelWeight]);
      res.status(201).json(result.rows[0]);
    }
    catch (error) {
      console.log(error);
      if (error.detail.match(/userid/i)) res.status(401).json({ message: "You'll have to be registered to create an order" });
      next();
    }

  }

  static async getAllOrders(req, res, next) {
    try {
      const result = await db.query('SELECT * FROM parcelOrders');
      res.status(200).json(result.rows);
    }
    catch (error) {
      console.log(error);
      next();
    }
  }

  static async getOneOrder(req, res, next) {
    const { parcelId } = req.params;
    try {
      const result = await db.query('SELECT * FROM parcelOrders WHERE parcelId = $1', [parcelId]);
      if (result.rows.length === 0) return res.status(404).json({ message: 'Order not found' });
      res.status(200).json(result.rows[0]);
    }
    catch (error) {
      console.log(error);
      next();
    }
  }

  static async cancelOrder(req, res, next) {
    const { parcelId } = req.params;
    try {
      const result = await db.query('UPDATE parcelOrders SET status=\'cancelled\' WHERE parcelId = $1 RETURNING *', [parcelId]);
      if (!result.rows[0]) return res.status(404).json({ message: 'Order not found' });
      res.status(200).json(result.rows[0]);
    }
    catch (error) {
      console.log(error);
      next();
    }
  }

  static async changeStatus(req, res, next) {
    const { status } = req.body;
    const { parcelId } = req.params;
    try {
      const result = await db.query('UPDATE parcelOrders SET status = $1 WHERE parcelId = $2 RETURNING *', [status, parcelId]);
      return res.status(200).json(result.rows[0]);
    }
    catch (error) {
      console.log(error);
      next();
    }
  }

  static async changeDestination(req, res, next) {
    const { destination } = req.body;
    const { parcelId } = req.params;
    try {
      const result = await db.query('UPDATE parcelOrders SET destination = $1 WHERE parcelId = $2 RETURNING *', [destination, parcelId]);
      return res.status(200).json(result.rows[0]);
    }
    catch (error) {
      console.log(error);
      next();
    }
  }

  static async changePresentLocation(req, res, next) {
    const { presentLocation } = req.body;
    const { parcelId } = req.params;
    try {
      const result = await db.query('UPDATE parcelOrders SET presentLocation = $1 WHERE parcelId= $2 RETURNING *', [presentLocation, parcelId]);
      res.status(200).json(result.rows[0]);
    }
    catch (error) {
      console.log(error);
      next();
    }

  }
}

export default ParcelControllers;
