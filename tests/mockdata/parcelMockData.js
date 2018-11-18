// Mock parcel data for testing 'parcels' endpoint

const parcelTestData = {
  incompleteData: {
  // pickupTime not provided
    pickupAddress: '8 Oluwaseyi st, Isashi',
    destination: '14 Hundeyin st, Badagary',
    parcelDescription: 'bag of rice',
    userId: 'ozonkwo',
  },

  improperData: {
  // unexpected date format and improper pickupAddress (no address number)
    pickupAddress: 'Ola',
    destination: '14 Hundeyin st, Badagary',
    parcelDescription: '50kg parcel',
    userId: 'nduka',
    pickupTime: 'October 7th 1999',
  },

  unwantedParams: {
  // unwanted parameters age and height
    destination: '14 Hundeyin st, Badagary',
    age: 24,
    height: '6ft',
    parcelDescription: '50kg parcel',
    userId: 'nduka',
    pickupTime: 'October 7th 1999',
  },

  expectedData: {
  // correct data
    pickupAddress: '8 Oluwaseyi st, Isashi',
    destination: '14 Hundeyin st, Badagary',
    parcelDescription: 'bag of rice and egg',
    userId: '8559ef1e-c674-4c84-9726-b86ad71f2509',
    pickupTime: '2018-12-06T19:07',
    parcelWeight: '80kg',
  },
};


export default parcelTestData;
