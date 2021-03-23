'use strict';

const faker = require(`faker`);
const {getRandomInt} = require(`../../../utils`);

faker.locale = `ru`;

const createUser = (userData) => {
  // faker.name.firstName - генерит латиницу;
  const [firstName, lastName] = faker.name.findName().split(` `);
  const avatar = `avatar-${getRandomInt(1, 5)}`;

  return {
    email: faker.internet.email(),
    password: faker.internet.password(),
    firstName,
    lastName,
    avatar,
    ...userData,
  };
};

module.exports = {
  createUser,
};
