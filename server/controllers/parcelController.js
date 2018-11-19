import 'babel-polyfill';
import db from '../db/connection';

class ParcelControllers {
  static async createOrder(req, res) {
    const {
      userId, pickupAddress, destination, pickupTime, parcelDescription, parcelWeight,
    } = req.body;
    try {
      const result = await db.query('INSERT INTO parcelOrders (userId, pickupAddress, destination, pickupTime, parcelDescription, parcelWeight) values ($1, $2, $3, $4, $5, $6) RETURNING *', [userId, pickupAddress, destination, pickupTime, parcelDescription, parcelWeight]);
      res.status(201).json(result.rows[0]);
    }
    catch (error) {
      console.log(error);
      if (error.detail.match(/userid/i)) res.status(401).json({ message: "You'll have to be registered to create an order" });
    }

  }

  static async getAllOrders(req, res) {
    try {
      const result = await db.query('SELECT * FROM parcelOrders');
      res.status(200).json(result.rows);
    }
    catch (error) {
      console.log(error);
    }
  }

  static async getOneOrder(req, res) {
    const { parcelId } = req.params;
    try {
      const result = await db.query('SELECT * FROM parcelOrders WHERE parcelId = $1', [parcelId]);
      if (result.rows.length === 0) return res.status(404).json({ message: 'Order not found' });
      res.status(200).json(result.rows[0]);
    }
    catch (error) {
      console.log(error);
    }
  }

  static async cancelOrder(req, res) {
    const { parcelId } = req.params;
    try {
      const result = await db.query('UPDATE parcelOrders SET status=\'cancelled\' WHERE parcelId = $1 RETURNING *', [parcelId]);
      if (!result.rows[0]) return res.status(404).json({ message: 'Order not found' });
      res.status(200).json(result.rows[0]);
    }
    catch (error) {
      console.log(error);
    }
  }

  static async changeStatus(req, res) {
    const { status } = req.body;
    const { parcelId } = req.params;
    try {
      const result = await db.query('UPDATE parcelOrders SET status = $1 WHERE parcelId = $2 RETURNING *', [status, parcelId]);
      return res.status(200).json(result.rows[0]);
    }
    catch (error) {
      console.log(error);
    }
  }
}

export default ParcelControllers;
