'use strict';
const moment = require(`moment`);
const {getRandomInt} = require(`../../../utils`);

const DateLimit = {
  DAYS: 90,
  HOURS: 24,
  MINUTES: 60,
  SECONDS: 60,
};

const generateDate = () => {
  const days = getRandomInt(1, DateLimit.DAYS);
  const hours = getRandomInt(1, DateLimit.HOURS);
  const minutes = getRandomInt(1, DateLimit.MINUTES);
  const seconds = getRandomInt(1, DateLimit.SECONDS);

  const date = moment();

  date.subtract(days, `day`);
  date.subtract(hours, `hour`);
  date.subtract(minutes, `minute`);
  date.subtract(seconds, `second`);

  return date.format(`YYYY-MM-DD HH:mm:ss`);
};

module.exports = {
  generateDate
};
