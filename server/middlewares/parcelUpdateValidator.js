import 'babel-polyfill';
import { request } from 'http';
import db from '../db/connection';

class UpdateValidator {
  static async cancel(req, res, next) {
    const { parcelId } = req.params;
    try {
      const result = await db.query('SELECT status FROM parcelOrders WHERE parcelId = $1', [parcelId]);
      if (!result.rows[0]) return res.status(400).json({ message: 'Order not found' });
      if (result.rows[0].status === 'delivered') return res.status(400).json({ message: 'You cannot cancel an already delivered order' });
      next();
    }
    catch (error) {
      console.log(error);
    }

  }

  static async changeStatus(req, res, next) {
    const validValues = ['recorded', 'dispatched', 'in transit', 'delivered'];
    const { status } = req.body;
    const { parcelId } = req.params;
    try {
      const result = await db.query('SELECT status FROM parcelOrders WHERE parcelId = $1', [parcelId]);
      if (!result.rows[0]) return res.status(400).json({ message: 'Order not found' });
      if (result.rows[0].status === 'delivered') return res.status(400).json({ message: 'You cannot change the status of an already delivered order' });
      if (!status) return res.status(400).json({ message: 'invalid request, new status not provided' });
      if (!validValues.includes(status)) return res.status(400).json({ message: 'Invalid status value' });
      next();
    }
    catch (error) {
      console.log(error);
    }
  }

  static async delivered(req, res, next) {
    const { status, receivedBy, receivedAt } = req.body;
    const { parcelId } = req.params;
    if (status !== 'delivered') return next();
    if (!receivedBy || !receivedAt) return res.status(400).json({ message: 'Incomplete request, pls submit the name of the parcel receiver and the time the parcel was delivered' });
    try {
      const result = await db.query('UPDATE parcelOrders SET status= $1, receivedBy= $2, receivedAt= $3 WHERE parcelId= $4 RETURNING *', [status, receivedBy, receivedAt, parcelId]);
      res.status(200).json(result.rows[0]);
    }
    catch (error) {
      console.log(error);
    }
  }

  static async changeDestination(req, res, next) {
    const { destination } = req.body;
    const { parcelId } = req.params;
    try {
      const result = await db.query('SELECT status FROM parcelOrders WHERE parcelId = $1', [parcelId]);
      if (!result.rows[0]) return res.status(400).json({ message: 'Order not found' });
      if (result.rows[0].status === 'delivered') return res.status(400).json({ message: 'You cannot change the destination of an already delivered order' });
      if (!destination) return res.status(400).json({ message: 'invalid request, new destination not provided' });
      if (!/.{15,}/.test(destination)) return res.status(400).json({ message: 'destination not detailed enough' });
      next();
    }
    catch (error) {
      console.log(error);
    }
  }
}

export default UpdateValidator;
