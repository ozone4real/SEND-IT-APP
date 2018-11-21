// Mock user data for testing 'auth' endpoints

const signUpTestData = {
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

  expectedData1: {
    // correct data
    fullname: 'Chinenye Francisca',
    phoneNo: '08132768939',
    email: 'franciscachinenye@gmail.com',
    password: 'francis908',
  },

  expectedData2: {
    fullname: 'Chigaemezu Ogbonna',
    email: 'estherOgbonna1@gmail.com',
    phoneNo: '0898477778939',
    password: 'esth0990e6',
    userId: 'chiga4real',
    isAdmin: true,
  },

  expectedData3: {
    fullname: 'Kelechi Umunna',
    email: 'kelechiumunna@gmail.com',
    phoneNo: '08135674889940',
    password: 'hdggdjjekkellel',
  },
};

const signInTestData = {
  invalidData: {
    // invalid email/password
    email: 'agadinwanyi@gmail.com',
    password: 'mindurbizness',
  },

  validData1: {
    // valid email/password
    email: 'franciscachinenye@gmail.com',
    password: 'francis908',
  },

  validData2: {
    email: 'estherOgbonna1@gmail.com',
    password: 'esth0990e6',
  },
};

export { signUpTestData, signInTestData };
