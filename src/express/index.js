'use strict';

const path = require(`path`);
const express = require(`express`);
const session = require(`express-session`);
const mainRouter = require(`./routes/main`);
const myRouter = require(`./routes/my`);
const articlesRouter = require(`./routes/articles`);
const categoriesRouter = require(`./routes/categories`);

const DEFAULT_PORT = 8080;
const {SESSION_SECRET} = process.env;

const somethingIsNotDefined = [SESSION_SECRET].includes(undefined);

if (somethingIsNotDefined) {
  throw new Error(`One or more environmental variables are not defined`);
}

const app = express();

app.set(`views`, path.join(__dirname, `templates`));
app.set(`view engine`, `pug`);

app.use(express.static(path.join(__dirname, `/public`)));
app.use(express.static(path.join(__dirname, `/upload`)));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(session({
  secret: SESSION_SECRET,
}));

app.use(`/`, mainRouter);
app.use(`/my`, myRouter);
app.use(`/articles`, articlesRouter);
app.use(`/categories`, categoriesRouter);

// Error Routes
app.get(`/500`, (req, res) => {
  res.render(`errors/500`);
});

app.get(`*`, (req, res) => {
  res.render(`errors/400`);
});

app.listen(DEFAULT_PORT, () => {
  console.log(`Сервер запущен на порту: ${DEFAULT_PORT}`);
});
