import 'babel-polyfill';
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
      if (!validValues.includes(status)) return res.status(400).json({ message: 'Invalid status value' });
      next();
    }
    catch(error) {
      console.log(error);
    }
  }
}

export default UpdateValidator;
