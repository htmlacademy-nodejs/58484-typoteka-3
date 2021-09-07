'use strict';

const api = require(`../api`).getAPI();

const showMy = async (req, res) => {
  const articles = await api.getArticles();
  res.render(`my`, {
    articles,
    user: req.session.user,
  });
};

const showComments = async (req, res) => {
  const comments = await api.getComments() || [];
  res.render(`comments`, {
    comments,
    user: req.session.user,
    csrfToken: req.csrfToken(),
  });
};

const deleteComment = async (req, res) => {
  const {id} = req.params;
  await api.deleteComment(id);

  return res.redirect(`back`);
};

module.exports = {
  showMy,
  showComments,
  deleteComment,
};
