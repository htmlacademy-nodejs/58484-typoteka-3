'use strict';

const show = (req, res) => {
  const {id} = req.params;
  res.render(`post`, {id});
};

const edit = (req, res) => {
  res.send(`/articles/edit/${req.params.id}`);
};

const create = (req, res) => {
  res.render(`new-post`);
};

const showArticlesByCategory = (req, res) => {
  res.send(`/articles/category/${req.params.id}`);
};

module.exports = {
  show,
  edit,
  create,
  showArticlesByCategory,
};
