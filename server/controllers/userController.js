import 'babel-polyfill';
import db from '../db/connection';

class UserController {
  static async getAllUserOrders(req, res) {
    const { userId } = req.params;
    try {
      const result = await db.query('SELECT * FROM parcelOrders WHERE userId = $1', [userId]);
      if (result.rows.length === 0) return res.status(404).json({ message: 'No orders found for user' });
      res.status(200).json(result.rows);
    }
    catch (error) {
      console.log(error);
    }
  }
}

export default UserController;
