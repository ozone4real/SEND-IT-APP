// Mock parcel data for testing 'parcels' endpoint

const parcelTestData = {
  incompleteData: {
  // deliveryTime not provided
    pickupAddress: '8 Oluwaseyi st, Isashi',
    deliveryAddress: '14 Hundeyin st, Badagary',
    parcelDescription: 'bag of rice',
    userId: 'ozonkwo',
  },

  improperData: {
  // unexpected date format and improper pickupAddress (no address number)
    pickupAddress: 'Ola',
    deliveryAddress: '14 Hundeyin st, Badagary',
    parcelDescription: '50kg parcel',
    userId: 'nduka',
    deliveryTime: 'October 7th 1999',
  },

  unwantedParams: {
  // unwanted parameters age and height
    deliveryAddress: '14 Hundeyin st, Badagary',
    age: 24,
    height: '6ft',
    parcelDescription: '50kg parcel',
    userId: 'nduka',
    deliveryTime: 'October 7th 1999',
  },

  expectedData: {
  // correct data
    pickupAddress: '8 Oluwaseyi st, Isashi',
    deliveryAddress: '14 Hundeyin st, Badagary',
    parcelDescription: 'bag of rice and egg',
    userId: 'ozonkwo',
    deliveryTime: '2018-12-06T19:07',

  },
};

// Mock user data for testing 'auth' endpoints

const userTestData = {
  incompleteData: {
    // email not provided
    phoneNo: '08098756478',
    fullname: 'Asari Dokubo',
    password: 'lidhhe648',
  },

  improperData: {
    // invalid email, very short password
    email: 'nduka.com',
    phoneNo: '08098756478',
    fullname: 'Asari Dokubo',
    password: 'lid',
  },

  unwantedParams: {
    // unwanted parameters age and height
    height: '6ft tall',
    age: 24,
    phoneNo: '08098756478',
    fullname: 'Asari Dokubo',
    password: 'lidhhe648',
  },

  expectedData: {
    // correct data
    fullname: 'Chinenye Francisca',
    phoneNo: '08132768939',
    email: 'franciscachinenye@gmail.com',
    password: 'francis908',
  },
};

export {
  userTestData, parcelTestData,
};
