'use strict';

const Alias = require(`./alias`);

const defineRole = require(`./role`);
const defineUser = require(`./user`);
const defineArticle = require(`./article`);
const defineCategory = require(`./category`);
const defineComment = require(`./comment`);
const defineArticleCategory = require(`./article-category`);


const define = (sequelize) => {
  const User = defineUser(sequelize);
  const Role = defineRole(sequelize);
  const Article = defineArticle(sequelize);
  const Category = defineCategory(sequelize);
  const Comment = defineComment(sequelize);
  const ArticleCategory = defineArticleCategory(sequelize);

  // User <-> Role
  User.belongsTo(Role, {
    as: Alias.ROLE,
    foreignKey: `roleId`,
  });
  Role.hasMany(User, {
    as: Alias.USERS,
    foreignKey: `roleId`
  });

  // Article <-> User
  User.hasMany(Article, {
    as: Alias.ARTICLES,
    foreignKey: `userId`
  });
  Article.belongsTo(User, {
    as: Alias.USER,
    foreignKey: `userId`
  });

  // Article <- ArticleCategory -> Category
  Article.belongsToMany(Category, {
    through: ArticleCategory,
    as: Alias.CATEGORIES
  });
  Category.belongsToMany(Article, {
    through: ArticleCategory,
    as: Alias.ARTICLES
  });
  Category.hasMany(ArticleCategory, {
    as: Alias.ARTICLE_CATEGORY
  });

  // Article <-> Comment
  Article.hasMany(Comment, {
    as: Alias.COMMENTS,
    foreignKey: `articleId`,
    onDelete: `CASCADE`
  });
  Comment.belongsTo(Article, {
    as: Alias.ARTICLE,
    foreignKey: `articleId`
  });

  // User <-> Comment
  User.hasMany(Comment, {
    as: Alias.COMMENT,
    foreignKey: `userId`
  });
  Comment.belongsTo(User, {
    as: Alias.USER,
    foreignKey: `userId`
  });

  return {
    User,
    Role,
    Article,
    Category,
    Comment,
    ArticleCategory
  };
};

module.exports = define;
