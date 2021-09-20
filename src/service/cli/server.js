'use strict';

const express = require(`express`);
const http = require(`http`);
const sequelize = require(`../lib/sequelize`);
const session = require(`../lib/session`);

const {ChalkTheme} = require(`./chalk-theme`);
const {success, error} = ChalkTheme.server;
const {HttpCode, HOT_ARTICLES_LIMIT, LAST_COMMENTS_LIMIT, SocketEvent} = require(`../../constants`);
const {getLogger} = require(`../lib/logger`);
const postsRouter = require(`./routes/posts`);
const apiRoutes = require(`../lib/api-routes`);
const CommentService = require(`../data-service/comment`);
const ArticleService = require(`../data-service/article`);
const {eventEmitter} = require(`../event-emitter`);

const API_PREFIX = `/api`;
const DEFAULT_PORT = 3000;

const app = express();
const server = http.createServer(app);
const io = require(`socket.io`)(server, {
  cors: {
    origin: `*`,
  }
});
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

// Socket.io
io.on(`connection`, (socket) => {
  eventEmitter.on(SocketEvent.COMMENTS_UPDATED, async () => {
    const [lastComments, hotArticles] = await Promise.all([
      (new CommentService(sequelize).getLastComments(LAST_COMMENTS_LIMIT)),
      (new ArticleService(sequelize).getHotArticles(HOT_ARTICLES_LIMIT))
    ]);

    socket.broadcast.emit(SocketEvent.COMMENTS_UPDATED, JSON.stringify({lastComments, hotArticles}));
  });
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
      await server.listen(port);
    } catch (err) {
      return logger.error(error(`An error occured: ${err.message}`));
    }

    return logger.info(success(`Server started on ${port} port`));
  }
};
