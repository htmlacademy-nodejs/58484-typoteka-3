'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const bodyValidator = require(`../middlewares/body-validator`);
const paramValidator = require(`../middlewares/param-validator`);
const articleExist = require(`../middlewares/article-exist`);
const commentExist = require(`../middlewares/comment-exist`);
const articleSchema = require(`../joi-schemas/article-schema`);
const commentSchema = require(`../joi-schemas/comment-schema`);
const idSchema = require(`../joi-schemas/id-schema`);

module.exports = (app, articleService, commentService) => {
  const route = new Router();

  app.use(`/articles`, route);

  route.get(`/`, async (req, res) => {
    const {offset, limit, comments} = req.query;
    let articles;
    if (limit || offset) {
      articles = await articleService.findPage({limit, offset});
    } else {
      articles = await articleService.findAll(comments);
    }

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
        let article = res.locals.article.get();

        if (needComments) {
          const comments = await commentService.findAll(articleId);
          article = {...article, comments};
        }

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
