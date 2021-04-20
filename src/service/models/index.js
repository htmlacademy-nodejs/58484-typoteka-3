'use strict';

const Aliase = require(`./aliase`);

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
    as: Aliase.ROLE,
    foreignKey: `role_id`,
  });
  Role.hasMany(User, {
    as: Aliase.USERS,
    foreignKey: `role_id`
  });

  // Article <-> User
  User.hasMany(Article, {
    as: Aliase.ARTICLES,
    foreignKey: `user_id`
  });
  Article.belongsTo(User, {
    as: Aliase.USER,
    foreignKey: `user_id`
  });

  // Article <- ArticleCategory -> Category
  Article.belongsToMany(Category, {
    through: ArticleCategory,
    as: Aliase.CATEGORIES
  });
  Category.belongsToMany(Article, {
    through: ArticleCategory,
    as: Aliase.ARTICLES
  });
  Category.hasMany(Article, {
    as: Aliase.ARTICLE_CATEGORY
  });

  // Article <-> Comment
  Article.hasMany(Comment, {
    as: Aliase.COMMENTS,
    foreignKey: `article_id`
  });
  Comment.belongsTo(Article, {
    as: Aliase.ARTICLE,
    foreignKey: `article_id`
  });

  // User <-> Comment
  User.hasMany(Comment, {
    as: Aliase.COMMENT,
    foreignKey: `user_id`
  });
  Comment.belongsTo(User, {
    as: Aliase.USER,
    foreignKey: `user_id`
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
