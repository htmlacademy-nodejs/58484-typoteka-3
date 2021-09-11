'use strict';

const {UserRole} = require(`../../constants`);

const capitalized = ([first, ...rest]) => `${first}${rest.join(``).toLowerCase()}`;

const createRoleAliases = (userRoleId) => {
  const roles = Object.keys(UserRole);

  return roles.reduce((acc, role) => {
    const aliasKey = `is${capitalized(role)}`;

    return {
      ...acc,
      [aliasKey]: Boolean(UserRole[role] === userRoleId)
    };
  }, {});
};

class UserService {
  constructor(sequelize) {
    this._User = sequelize.models.User;
  }

  async create(userData) {
    try {
      const user = await this._User.create({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        avatar: userData.avatar,
        password: userData.passwordHash,
        roleId: UserRole.READER,
      });

      return user.get();
    } catch (err) {
      console.log(`ERROR`, err.message);
      return err;
    }

  }

  async findByEmail(email) {
    const user = await this._User.findOne({
      where: {email}
    });

    return user && this.addRoleAlias(user.get());
  }

  addRoleAlias(user) {
    return {
      ...user,
      ...createRoleAliases(user.roleId)
    };
  }
}

module.exports = UserService;
