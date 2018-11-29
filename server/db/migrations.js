import db from './connection';

const userTable = `CREATE TABLE IF NOT EXISTS users (
    userId VARCHAR(255) PRIMARY KEY NOT NULL,
    phoneNo VARCHAR(20) NOT NULL,
    fullname VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    isAdmin BOOLEAN DEFAULT false,
    registered DATE DEFAULT CURRENT_DATE
);`;

const parcelTable = `CREATE TABLE IF NOT EXISTS parcelOrders (
    parcelId SERIAL,
    userId VARCHAR(255) REFERENCES users(userId),
    parcelDescription VARCHAR(40) NOT NULL,
    parcelWeight VARCHAR(10) NOT NULL,
    pickupAddress VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    pickupTime TIMESTAMP NOT NULL,
    status VARCHAR(15) DEFAULT 'recorded',
    presentLocation VARCHAR(255),
    receivedBy VARCHAR(255),
    receivedAt TIMESTAMP,
    PRIMARY KEY (parcelId, userId)
);`;


const createTables = () => {
  db(`${userTable} ${parcelTable}`)
    .catch((error) => {
      console.log(error);
    });
};

export default createTables;
