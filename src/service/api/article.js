'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const articleValidator = require(`../middlewares/article-validator`);
const commentValidator = require(`../middlewares/comment-validator`);
const articleExist = require(`../middlewares/article-exist`);
const commentExist = require(`../middlewares/comment-exist`);

module.exports = (app, articleService, commentService) => {
  const route = new Router();

  app.use(`/articles`, route);

  route.get(`/`, async (req, res) => {
    const {comments} = req.query;
    const articles = await articleService.findAll(comments);

    return res
      .status(HttpCode.OK)
      .json(articles);
  });

  route.get(`/:articleId`, articleExist(articleService), (req, res) => {
    return res
      .status(HttpCode.OK)
      .json(res.locals.article);
  });

  route.post(`/`, articleValidator, async (req, res) => {
    const article = await articleService.create(req.body);

    return res
      .status(HttpCode.CREATED)
      .json(article);
  });

  route.put(`/:articleId`, [articleExist(articleService), articleValidator], async (req, res) => {
    const {articleId} = req.params;
    const article = await articleService.update(articleId, req.body);

    return res
      .status(HttpCode.OK)
      .json(article);
  });

  route.delete(`/:articleId`, articleExist(articleService), async (req, res) => {
    const {articleId} = req.params;
    const article = await articleService.drop(articleId);

    return res
      .status(HttpCode.OK)
      .json(article);
  });

  route.get(`/:articleId/comments`, articleExist(articleService), async (req, res) => {
    const {articleId} = req.params;
    const comments = await commentService.findAll(articleId);

    return res
      .status(HttpCode.OK)
      .json(comments);
  });

  route.post(`/:articleId/comments`, [articleExist(articleService), commentValidator], async (req, res) => {
    const newComment = req.body;
    const {articleId} = req.params;
    const comment = await commentService.create(articleId, newComment);

    return res
      .status(HttpCode.CREATED)
      .json(comment);
  });

  route.delete(`/:articleId/comments/:commentId`, [articleExist(articleService), commentExist(commentService)], async (req, res) => {
    const {commentId} = req.params;
    const dropComment = await commentService.drop(commentId);

    return res
      .status(HttpCode.OK)
      .json(dropComment);
  });

};
