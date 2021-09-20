'use strict';

const sequelize = require(`../lib/sequelize`);
const initDatabase = require(`../lib/init-db`);

const {generateArticles} = require(`./factories/generate-articles`);
const {generateUsers} = require(`./factories/generate-users`);
const {generateSuperUser} = require(`./factories/generate-superuser`);
const {generateRoles} = require(`./factories/generate-roles`);
const {getMockData} = require(`./factories/get-mock-data`);
const {getFileContent} = require(`./services/get-file-content`);
const {ChalkTheme} = require(`./chalk-theme`);
const {
  ExitCode,
  MockFileName,
} = require(`../../constants`);

const DEFAULT_COUNT = 1;
const MAX_COUNT_LIMIT = 1000;
const USER_COUNT = 5;

const {
  success,
  error,
  warning,
} = ChalkTheme.filldb;

module.exports = {
  name: `--filldb`,
  async run(args) {
    // Connect to database
    try {
      console.info(success(`Trying to connect to database...`));
      await sequelize.authenticate();
    } catch (err) {
      return console.error(error(`An error occured: ${err.message}`));
    }
    console.info(success(`Connection to database established`));

    const [count] = args;

    if (count > MAX_COUNT_LIMIT) {
      console.info(warning(`Не больше 1000 объявлений`));
      process.exit(ExitCode.ERROR);
    }

    const countArticle = Number.parseInt(count, 10) || DEFAULT_COUNT;

    const superUser = generateSuperUser();
    const users = [superUser, ...generateUsers(USER_COUNT)];
    const categories = await getFileContent(`./data/${MockFileName.CATEGORIES}`);
    const articles = await generateArticles(countArticle, users, await getMockData());
    const roles = generateRoles();

    // fill DB
    console.info(success(`Trying to fill database...`));
    await initDatabase(sequelize, {
      users,
      categories,
      articles,
      roles
    });

    console.info(success(`Database filled!`));
    return process.exit(ExitCode.SUCCESS);
  }
};
