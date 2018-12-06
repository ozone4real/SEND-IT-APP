import computeDistance from '../helpers/distance';

const calculatePrice = async (req, res, next) => {
  const { parcelWeight } = req.body;
  const distance = await computeDistance(req);
  let price;
  if (parcelWeight === '0kg - 5kg') price = 50 * distance;
  if (parcelWeight === '5kg - 20kg') price = 70 * distance;
  if (parcelWeight === '20kg - 50kg') price = 100 * distance;
  if (parcelWeight === '50kg - 100kg') price = 150 * distance;
  if (parcelWeight === '100kg above') price = 200 * distance;

  req.body.price = price;
  req.body.distance = distance;
  next();
};

export default calculatePrice;
