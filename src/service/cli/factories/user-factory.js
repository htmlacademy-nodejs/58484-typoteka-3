'use strict';

const faker = require(`faker`);
const {getRandomItems} = require(`../../../utils`);

faker.locale = `ru`;

const AVATARS = [
  `avatar-1`,
  `avatar-2`,
  `avatar-3`,
  `avatar-4`,
  `avatar-5`,
];

const createUser = (userData) => {
  // faker.name.firstName - генерит латиницу;
  const [firstName, lastName] = faker.name.findName().split(` `);

  return {
    email: faker.internet.email(),
    password: faker.internet.password(),
    firstName,
    lastName,
    avatar: getRandomItems(AVATARS)[0],
    ...userData,
  };
};

module.exports = {
  createUser,
};
