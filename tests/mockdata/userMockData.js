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


const signInTestData = {
  invalidData: {
    //invalid email/password
    email: "agadinwanyi@gmail.com",
    password: "mindurbizness",
  },

  validData: {
    //valid email/password
    email: "ezenwaogbonna1@gmail.com",
    password: "ozone4real",
  },
}

export {userTestData, signInTestData};
