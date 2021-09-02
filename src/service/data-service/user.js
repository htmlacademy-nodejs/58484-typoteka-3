'use strict';

const bcrypt = require(`bcrypt`);

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
        roleId: 2,
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
    return user && user.get();
  }

  async checkUser(user, password) {
    return await bcrypt.compare(password, user.password);
  }
}

module.exports = UserService;
