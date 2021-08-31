'use strict';

const {DataTypes, Model} = require(`sequelize`);

class Role extends Model {}

const define = (sequelize) => Role.init({
  title: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: `Role`,
  tableName: `roles`,
  underscored: true,
  timestamps: false,
});

module.exports = define;
