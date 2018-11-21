import 'babel-polyfill';
import db from '../db/connection';

class UserController {
  static async getAllUserOrders(req, res, next) {
    const { userId } = req.params;
    if(req.user.userId !== userId) return res.status(403).json({message: 'Access denied. You are forbidden from accessing this route.'});
    try {
      const result = await db.query('SELECT * FROM parcelOrders WHERE userId = $1', [userId]);
      if (result.rows.length === 0) return res.status(404).json({ message: 'No orders found for user' });
      res.status(200).json(result.rows);
    }
    catch (error) {
      console.log(error);
      next();
    }
  }
}

export default UserController;
