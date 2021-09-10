'use strict';

const passwordUtils = require(`../../lib/password`);
const {UserRole} = require(`../../../constants`);

const generateSuperUser = () => {
  const password = passwordUtils.hashSync(`master`);
  return {
    id: 1,
    email: `superuser@gmail.com`,
    password,
    passwordRepeated: password,
    firstName: `Vasyl`,
    lastName: `Ponomarenko`,
    roleId: UserRole.ADMIN,
    avatar: `avatar-1.png`,
  };
};

module.exports = {
  generateSuperUser
};
