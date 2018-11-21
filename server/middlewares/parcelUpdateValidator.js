import 'babel-polyfill';
import db from '../db/connection';

class UpdateValidator {
  static async cancel(req, res, next) {
    const { parcelId } = req.params;
    try {
      const result = await db.query('SELECT status FROM parcelOrders WHERE parcelId = $1', [parcelId]);
      if (!result.rows[0]) return res.status(404).json({ message: 'Order not found' });
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
      if (!result.rows[0]) return res.status(404).json({ message: 'Order not found' });
      if (result.rows[0].status === 'delivered') return res.status(400).json({ message: 'You cannot change the status of an already delivered order' });
      if (!status) return res.status(400).json({ message: 'invalid request, new status not provided' });
      if (!validValues.includes(status)) return res.status(400).json({ message: "Invalid status value. Value must be either 'recorded', 'in transit' or 'delivered'" });
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
      if (!result.rows[0]) return res.status(404).json({ message: 'Order not found' });
      if (result.rows[0].status === 'delivered') return res.status(400).json({ message: 'You cannot change the destination of an already delivered order' });
      if (!destination) return res.status(400).json({ message: 'invalid request, new destination not provided' });
      if (!/.{15,}/.test(destination)) return res.status(400).json({ message: 'destination not detailed enough' });
      next();
    }
    catch (error) {
      console.log(error);
    }
  }

  static async inTransit(req, res, next) {
    const { status, presentLocation } = req.body;
    const { parcelId } = req.params;

    if (status !== 'in transit') return next();
    if (!presentLocation) return res.status(400).json({ message: "Changing the status to 'in transit' requires a 'present location', value" });
    if (!/[\dA-Za-z]{1,20}/.test(presentLocation)) return res.status(400).json({ message: 'invalid location or location length too long' });

    try {
      const result = await db.query('UPDATE parcelOrders SET status = $1, presentLocation = $2 WHERE parcelId= $3 RETURNING *', [status, presentLocation, parcelId]);
      res.status(200).json(result.rows[0]);
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
      const result = await db.query('SELECT status FROM parcelOrders WHERE parcelId = $1', [parcelId]);
      if (!result.rows[0]) return res.status(404).json({ message: 'Order not found' });
      if (result.rows[0].status === 'delivered') return res.status(400).json({ message: 'You cannot change the present location of an already delivered parcel' });
      if (!presentLocation) return res.status(400).json({ message: 'Invalid request, present location not provided' });
      if (!/[\dA-Za-z]{1,20}/.test(presentLocation)) return res.status(400).json({ message: 'invalid location or location length too long' });
      next();
    }
    catch (error) {
      console.log(error);
    }
  }
}

export default UpdateValidator;
