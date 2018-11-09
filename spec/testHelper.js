const incompleteData = {
  // deliveryTime not provided
  pickupAddress: '8 Oluwaseyi st, Isashi',
  deliveryAddress: '14 Hundeyin st, Badagary',
  parcelDescription: 'bag of rice',
  userId: 'ozonkwo',
};

const improperData = {
  // unexpected date format and improper pickupAddress (no address number)
  pickupAddress: 'Ola',
  deliveryAddress: '14 Hundeyin st, Badagary',
  parcelDescription: '50kg parcel',
  userId: 'nduka',
  deliveryTime: 'October 7th 1999',
};

const expectedData = {
  // correct data
  pickupAddress: '8 Oluwaseyi st, Isashi',
  deliveryAddress: '14 Hundeyin st, Badagary',
  parcelDescription: 'bag of rice and egg',
  userId: 'ozonkwo',
  deliveryTime: '2018-12-06T19:07',

};

export { incompleteData, improperData, expectedData };
