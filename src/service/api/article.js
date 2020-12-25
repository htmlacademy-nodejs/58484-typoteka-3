'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const articleValidator = require(`../middlewares/article-validator`);
const commentValidator = require(`../middlewares/comment-validator`);
const articleExist = require(`../middlewares/article-exist`);
const commentExist = require(`../middlewares/comment-exist`);

const route = new Router();

module.exports = (app, articleService, commentService) => {
  app.use(`/articles`, route);

  route.get(`/`, (req, res) => {
    const articles = articleService.findAll();
    res.status(HttpCode.OK)
      .json(articles);
  });

  route.get(`/:articleId`, articleExist(articleService), (req, res) => {
    return res
      .status(HttpCode.OK)
      .json(res.locals.article);
  });

  route.post(`/`, articleValidator, (req, res) => {
    const article = articleService.create(req.body);

    return res
      .status(HttpCode.CREATED)
      .json(article);
  });

  route.put(`/:articleId`, [articleExist(articleService), articleValidator], (req, res) => {
    const {articleId} = req.params;
    const article = articleService.update(articleId, req.body);

    return res
      .status(HttpCode.OK)
      .json(article);
  });

  route.delete(`/:articleId`, articleExist(articleService), (req, res) => {
    const {articleId} = req.params;
    const article = articleService.drop(articleId);

    return res
      .status(HttpCode.OK)
      .json(article);
  });

  route.get(`/:articleId/comments`, articleExist(articleService), (req, res) => {
    const article = res.locals.article;
    const comments = commentService.findAll(article);

    return res
      .status(HttpCode.OK)
      .json(comments);
  });

  route.post(`/:articleId/comments`, [articleExist(articleService), commentValidator], (req, res) => {
    const newComment = req.body;
    const article = res.locals.article;
    const comment = commentService.create(article, newComment);

    return res
      .status(HttpCode.CREATED)
      .json(comment);
  });

  route.delete(`/:articleId/comments/:commentId`, [articleExist(articleService), commentExist(commentService)], (req, res) => {
    const {commentId} = req.params;
    const article = res.locals.article;
    const dropComment = commentService.drop(article, commentId);

    return res
      .status(HttpCode.OK)
      .json(dropComment);
  });

};
