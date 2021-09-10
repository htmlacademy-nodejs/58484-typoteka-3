'use strict';

const fs = require(`fs`).promises;

const {ChalkTheme} = require(`../chalk-theme`);
const {error} = ChalkTheme.filldb;

const getFileContent = async (fileName) => {
  try {
    const data = await fs.readFile(fileName, `utf8`);

    return data
      .trim()
      .split(`\n`);
  } catch (e) {
    console.error(error(`Can't read data from file... ${e.message}`));
    return [];
  }
};

module.exports = {
  getFileContent
};
