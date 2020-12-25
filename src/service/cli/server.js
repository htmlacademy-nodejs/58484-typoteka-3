'use strict';

const express = require(`express`);

const {ChalkTheme} = require(`./chalk-theme`);
const {success} = ChalkTheme.server;
const {HttpCode} = require(`../../constants`);
const postsRouter = require(`./routes/posts`);
const apiRoutes = require(`../api`);

const API_PREFIX = `/api`;
const DEFAULT_PORT = 3000;

const app = express();

app.use(express.json());

app.use(`/posts`, postsRouter);
app.use(API_PREFIX, apiRoutes);

app.use((req, res) => {
  return res
    .status(HttpCode.NOT_FOUND)
    .send(`Not found`);
});

module.exports = {
  name: `--server`,
  run(args) {
    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

    app.listen(port, () => {
      return console.info(success(`Ожидаю соединений на ${port}`));
    });

  }
};
