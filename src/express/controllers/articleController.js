'use strict';

const show = (req, res) => {
  res.send(`/articles/${req.params.id}`);
};

const edit = (req, res) => {
  res.send(`/articles/edit/${req.params.id}`);
};

const create = (req, res) => {
  res.send(`/articles/add`);
};

const showArticlesByCategory = (req, res) => {
  res.send(`/articles/category/${req.params.id}`);
}

module.exports = {
  show,
  edit,
  create,
  showArticlesByCategory,
}
