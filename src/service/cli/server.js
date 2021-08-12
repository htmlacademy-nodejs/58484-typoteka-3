'use strict';

const express = require(`express`);
const sequelize = require(`../lib/sequelize`);
const session = require(`../lib/session`);

const {ChalkTheme} = require(`./chalk-theme`);
const {success, error} = ChalkTheme.server;
const {HttpCode} = require(`../../constants`);
const {getLogger} = require(`../lib/logger`);
const postsRouter = require(`./routes/posts`);
const apiRoutes = require(`../api`);

const API_PREFIX = `/api`;
const DEFAULT_PORT = 3000;

const app = express();
const logger = getLogger({name: `api`});

app.use(express.json());
app.use(session(sequelize));

app.use((req, res, next) => {
  logger.debug(`Request on route ${req.url}`);
  res.on(`finish`, () => {
    logger.info(`Response status code ${res.statusCode}`);
  });
  next();
});

app.use(`/posts`, postsRouter);
app.use(API_PREFIX, apiRoutes);

app.use((req, res) => {
  res
    .status(HttpCode.NOT_FOUND)
    .send(`Not found`);

  logger.error(error(`Route not found: ${req.url}`));
});

app.use((err, _req, _res, _next) => {
  logger.error(error(`An error occured on processing request: ${err.message}`));
});

module.exports = {
  name: `--server`,
  async run(args) {
    // Connect to database
    try {
      logger.info(`Trying to connect to database...`);
      await sequelize.authenticate();
    } catch (err) {
      return logger.error(error(`An error occured: ${err.message}`));
    }
    logger.info(success(`Connection to database established`));

    // Starting server
    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

    try {
      await app.listen(port);
    } catch (err) {
      return logger.error(error(`An error occured: ${err.message}`));
    }

    return logger.info(success(`Server started on ${port} port`));
  }
};
