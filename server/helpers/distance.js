import fetch from 'node-fetch';

const computeDistance = async (req) => {
  let { pickupAddress, destination } = req.body;
  pickupAddress = pickupAddress.split(', ');
  destination = destination.split(', ');
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${
        pickupAddress[1]
      }+${pickupAddress[2]}+Nigeria&destinations=${destination[1]}+${
        destination[2]
      }+Nigeria&language=en-EN&key=${process.env.GOOGLE_API_KEY}`
    );
    const body = await response.json();
    console.log(body);
    if (body.status !== 'OK') return 50;
    const distance = body.rows[0].elements[0].distance.value / 1000;
    return parseInt(distance);
  } catch (error) {
    console.log(error);
  }
};

export default computeDistance;
