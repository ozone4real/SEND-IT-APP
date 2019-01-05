import computeDistance from "../helpers/distance";

const calculatePrice = async (req, res, next) => {
  const { parcelWeight } = req.body;
  const distance = await computeDistance(req);
  if (!distance) {
    return res
      .status(503)
      .json({ message: "Connection Error. Check your internet connection" });
  }

  let price;
  switch (parcelWeight) {
    case "0kg - 5kg":
      price = 50 * distance;
      break;
    case "5kg - 20kg":
      price = 70 * distance;
      break;
    case "20kg - 50kg":
      price = 100 * distance;
      break;
    case "50kg - 100kg":
      price = 150 * distance;
      break;
    case "100kg above":
      price = 200 * distance;
      break;
    default:
      return;
  }

  req.body.price = price;
  req.body.distance = distance;
  next();
};

export default calculatePrice;
