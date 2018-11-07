export default (req, res, next) => {
  const {
    userId, pickupAddress, deliveryAddress, deliveryTime, parcelDescription,
  } = req.body;

  if (!userId || !pickupAddress || !deliveryAddress || !deliveryTime || !parcelDescription) {
    return res.status(400).send('Incomplete request');
  }

  const timeTest = /^\d{4}-((1[0-2])|(0[1-9]))-((3[0-1])|([0-2][1-9]))T(([0-1][0-9])|(2[0-3])):[0-5][0-9]$/.test(deliveryTime);
  const pAdTest = /.{10,}/.test(pickupAddress);
  const dAdTest = /.{10,}/.test(deliveryAddress);

  if (!timeTest || !pAdTest || !dAdTest) {
    return res.status(400).send('Improper data provided');
  }

  next();

};
