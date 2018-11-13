import parcelData from '../db/parcelData';

class UserController {
  static getAllUserOrders(req, res) {
    const { userId } = req.params;
    const userOrders = parcelData.filter(a => a.userId === userId);
    if (userOrders.length === 0) return res.status(404).json({ message: 'No orders found for user' });
    res.status(200).json(userOrders);
  }
}

export default UserController;
