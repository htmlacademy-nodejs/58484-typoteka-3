'use strict';

const {Router} = require(`express`);
const {HttpCode, SocketEvent} = require(`../../constants`);
const bodyValidator = require(`../middlewares/body-validator`);
const paramValidator = require(`../middlewares/param-validator`);
const articleExist = require(`../middlewares/article-exist`);
const commentExist = require(`../middlewares/comment-exist`);
const articleSchema = require(`../joi-schemas/article-schema`);
const commentSchema = require(`../joi-schemas/comment-schema`);
const idSchema = require(`../joi-schemas/id-schema`);
const {eventEmitter} = require(`../event-emitter`);

module.exports = (app, articleService, commentService) => {
  const route = new Router();

  app.use(`/articles`, route);

  route.get(`/`, async (req, res) => {
    const {offset, limit, comments} = req.query;
    const articles = (limit || offset) ?
      await articleService.findPage({limit, offset}) :
      await articleService.findAll(comments);

    return res
      .status(HttpCode.OK)
      .json(articles);
  });

  route.get(`/hot`, async (req, res) => {
    const articles = await articleService.getHotArticles(req.query.limit);

    return res
      .status(HttpCode.OK)
      .json(articles);
  });

  route.get(`/:articleId`,
      paramValidator(idSchema, `articleId`),
      articleExist(articleService),
      async (req, res) => {
        const {articleId} = req.params;
        const {comments: needComments} = req.query;

        const comments = needComments ? {comments: await commentService.findAll(articleId)} : {};
        const article = {
          ...res.locals.article.get(),
          ...comments
        };

        return res
          .status(HttpCode.OK)
          .json(article);
      });

  route.post(`/`, bodyValidator(articleSchema), async (req, res) => {
    const article = await articleService.create(req.body);

    return res
      .status(HttpCode.CREATED)
      .json(article);
  });

  route.put(`/:articleId`, [
    paramValidator(idSchema, `articleId`),
    articleExist(articleService),
    bodyValidator(articleSchema)
  ], async (req, res) => {
    const {articleId} = req.params;
    await articleService.update(articleId, req.body);
    const article = await articleService.findOne(articleId, true);

    return res
      .status(HttpCode.OK)
      .json(article);
  });

  route.delete(`/:articleId`, [
    paramValidator(idSchema, `articleId`),
    articleExist(articleService),
  ],
  async (req, res) => {
    const {articleId} = req.params;
    const article = await articleService.drop(articleId);
    eventEmitter.emit(SocketEvent.COMMENTS_UPDATED);

    return res
      .status(HttpCode.OK)
      .json(article);
  });

  route.get(`/:articleId/comments`, [
    paramValidator(idSchema, `articleId`),
    articleExist(articleService)
  ], async (req, res) => {
    const {articleId} = req.params;
    const comments = await commentService.findAll(articleId);

    return res
      .status(HttpCode.OK)
      .json(comments);
  });

  route.post(`/:articleId/comments`, [
    paramValidator(idSchema, `articleId`),
    articleExist(articleService),
    bodyValidator(commentSchema),
  ], async (req, res) => {
    const newComment = req.body;
    const {articleId} = req.params;

    const comment = await commentService.create(articleId, newComment);
    eventEmitter.emit(SocketEvent.COMMENTS_UPDATED);

    return res
      .status(HttpCode.CREATED)
      .json(comment);
  });

  route.delete(`/:articleId/comments/:commentId`, [
    paramValidator(idSchema, `articleId`),
    paramValidator(idSchema, `commentId`),
    articleExist(articleService),
    commentExist(commentService),
  ], async (req, res) => {
    const {commentId} = req.params;
    const dropComment = await commentService.drop(commentId);

    return res
      .status(HttpCode.OK)
      .json(dropComment);
  });

  route.get(`/category/:categoryId`, [
    paramValidator(idSchema, `categoryId`)
  ], async (req, res) => {
    const {categoryId, limit, offset} = req.query;
    const articles = await articleService.findArticlesByCategoryId({limit, offset, categoryId});

    return res
      .status(HttpCode.OK)
      .json(articles);
  });

};
