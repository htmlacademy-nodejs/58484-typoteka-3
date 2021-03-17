'use strict';

const api = require(`../api`).getAPI();

const show = async (req, res) => {
  const {id} = req.params;
  const article = await api.getArticle(id);
  res.render(`post`, {article});
};

const edit = async (req, res) => {
  const {id} = req.params;

  const [article, categories] = await Promise.all([
    api.getArticle(id),
    api.getCategories()
  ]);

  res.render(`new-post`, {article, categories});
};

const update = async (req, res) => {
  const {body, file} = req;
  const {id} = req.params;

  const articleData = {
    id,
    title: body.title,
    createdDate: body.date,
    announce: body.announcement,
    fullText: body[`full-text`],
    category: Object.keys(body.category),
  };

  if (file) {
    Object.assign(articleData, {
      image: file.filename,
    });
  }

  try {
    const article = await api.updateArticle(articleData);
    res.render(`post`, {article});
  } catch (err) {
    res.redirect(`back`);
  }
};

const create = async (req, res) => {
  const categories = await api.getCategories();
  res.render(`new-post`, {categories});
};

const store = async (req, res) => {
  const {body, file} = req;

  const articleData = {
    title: body.title,
    createdDate: body.date,
    announce: body.announcement,
    fullText: body[`full-text`],
    image: file.filename,
    category: Object.keys(body.category),
  };

  try {
    await api.createArticle(articleData);
    res.redirect(`/my`);
  } catch (err) {
    res.redirect(`back`);
  }
};

const showArticlesByCategory = (req, res) => {
  res.send(`/articles/category/${req.params.id}`);
};

module.exports = {
  show,
  edit,
  create,
  showArticlesByCategory,
  store,
  update,
};
