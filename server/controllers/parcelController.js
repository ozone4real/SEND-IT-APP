import parcelData from '../db/parcelData';

class ParcelControllers {
  static createOrder(req, res) {
    const order = req.body;
    order.id = parcelData.length + 1;
    order.status = 'received';
    parcelData.push(order);
    res.status(200).json(order);
  }

  static getAllOrders(req, res) {
    res.status(200).json(parcelData);
  }

  static getOneOrder(req, res) {
    const { parcelId } = req.params;
    const order = parcelData.find(a => a.parcelId === parseInt(parcelId));
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.status(200).json(order);
  }

  static cancelOrder(req, res) {
    const { parcelId } = req.params;
    const parcelOrder = parcelData.find(a => a.parcelId === parseInt(parcelId));
    if (!parcelOrder) return res.status(404).send({ message: 'Order not found' });
    parcelOrder.status = 'cancelled';
    res.status(200).json(parcelOrder);
  }
}

export default ParcelControllers;
