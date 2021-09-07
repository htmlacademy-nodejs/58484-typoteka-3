'use strict';

const {USER_ROLES} = require(`../../../constants`);

const generateRoles = () => {
  return USER_ROLES.map((title, index) => ({
    id: index + 1,
    title
  }));
};

module.exports = {
  generateRoles
};
