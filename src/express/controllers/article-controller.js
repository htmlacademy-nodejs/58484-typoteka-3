'use strict';

const api = require(`../api`).getAPI();

const {getSessionError} = require(`../utils`);

const getArticleData = ({body, file}) => ({
  title: body.title,
  publishedAt: body.date,
  announce: body.announcement,
  fullText: body[`full-text`],
  categories: Object.keys(body.category || {}),
  ...(file ? {image: file.filename} : {})
});

const show = async (req, res) => {
  const {id} = req.params;
  const error = getSessionError(req);

  const [
    article,
    categories
  ] = await Promise.all([
    api.getArticle(id, true),
    api.getCategories(true)
  ]);

  const categoriesByArticle = categories.filter(
      (cat) => article.categories.map(
          (articleCategories) => articleCategories.id).includes(cat.id)
  );

  res.render(`post`, {
    article: {...article, categories: categoriesByArticle},
    error,
    user: req.session.user,
    csrfToken: req.csrfToken(),
  });
};

const edit = async (req, res) => {
  const {id} = req.params;

  const [article, categories] = await Promise.all([
    api.getArticle(id),
    api.getCategories()
  ]);

  const error = getSessionError(req);

  res.render(`new-post`, {
    article,
    categories,
    error,
    user: req.session.user,
    csrfToken: req.csrfToken(),
  });
};

const update = async (req, res) => {
  const {id} = req.params;

  const articleData = getArticleData(req);

  try {
    await api.updateArticle({id, data: articleData});
    res.redirect(`/articles/${id}`);
  } catch (err) {
    req.session.error = err.response.data;
    res.redirect(`back`);
  }
};

const create = async (req, res) => {
  const error = getSessionError(req);
  const categories = await api.getCategories();

  res.render(`new-post`, {
    categories,
    error,
    user: req.session.user,
    csrfToken: req.csrfToken()
  });
};

const store = async (req, res) => {
  const articleData = getArticleData(req);

  try {
    await api.createArticle(articleData);
    res.redirect(`/my`);
  } catch (err) {
    req.session.error = err.response.data;
    res.redirect(`back`);
  }
};

const showArticlesByCategory = (req, res) => {
  res.send(`/articles/category/${req.params.id}`);
};

const destroy = async (req, res) => {
  const {id} = req.params;
  await api.deleteArticle(id);

  return res.redirect(`back`);
};

module.exports = {
  show,
  edit,
  create,
  showArticlesByCategory,
  store,
  update,
  destroy,
};
