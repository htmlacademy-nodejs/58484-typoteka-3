'use strict';

const express = require(`express`);
const mainRouter = require(`./routes/main`);
const myRouter = require(`./routes/my`);
const articlesRouter = require(`./routes/articles`);
const categoriesRouter = require(`./routes/categories`);

const DEFAULT_PORT = 8080;

const app = express();

app.use(express.json());

app.use(`/`, mainRouter);
app.use(`/my`, myRouter);
app.use(`/articles`, articlesRouter);
app.use(`/categories`, categoriesRouter);

app.listen(DEFAULT_PORT, () => {
  console.log(`Сервер запущен на порту: ${DEFAULT_PORT}`);
});
