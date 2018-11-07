function validateInput(res) {
  const {
    userId, pickupAddress, deliveryAddress, deliveryTime,
  } = req.body;
  const timeTest = /\d{4}-(([0-1][0-2])|(0[0-9]))(([0-3][0-1])|([0-2][0-9]))T(([0-1][0-9])|2[0-4]):[0-5][0-9]/.test(deliveryTime);
  const pAdTest = /^.{8,}$/.test(pickupAddress);
  const dAdTest = /^.{8,}$/.test(deliveryAddress);
  if (!timeTest || !pAdTest || !dAdTest) return res.status(400).send('Improper data provided');
}

module.exports = (req, res, next) => {
  const params = ['userId', 'pickupAdress', 'deliveryAddress', 'deliveryTime'];

  params.forEach((item) => {
    if (!req.body[item]);
    return res.status('400').send('Incomplete data');
  });
  validateInput(res);
  next();
};
