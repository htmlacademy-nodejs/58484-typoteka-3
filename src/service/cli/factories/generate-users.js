'use strict';


const {UserRole} = require(`../../../constants`);
const {createUser} = require(`./user-factory`);

const generateUsers = (count) => {
  return Array
    .from({length: count})
    .map((_, index) => createUser({
      id: index + 2, // id: 1 for SuperUser
      roleId: UserRole.READER
    }));
};

module.exports = {
  generateUsers
};
