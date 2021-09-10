'use strict';

const fs = require(`fs`).promises;

const {generateSuperUser} = require(`./factories/generate-superuser`);
const {generateRoles} = require(`./factories/generate-roles`);
const {generateArticles} = require(`./factories/generate-articles`);
const {generateUsers} = require(`./factories/generate-users`);
const {getFileContent} = require(`./services/get-file-content`);
const {getMockData} = require(`./factories/get-mock-data`);

const {
  ExitCode,
  MOCKS_DB_FILE_NAME,
  MockFileName,
} = require(`../../constants`);
const {ChalkTheme} = require(`./chalk-theme`);

const {
  success,
  error,
  warning,
} = ChalkTheme.filldb;

const DEFAULT_COUNT = 1;
const MAX_COUNT_LIMIT = 1000;
const USER_COUNT = 5;

const createFile = async (content) => {
  try {
    await fs.writeFile(MOCKS_DB_FILE_NAME, content);
    console.info(success(`Operation success. File created.`));
  } catch (e) {
    console.error(error(`Can't write data to file... ${e.message}`));
    process.exit(ExitCode.ERROR);
  }
};

module.exports = {
  name: `--fill`,
  async run(args) {
    const [count] = args;

    if (count > MAX_COUNT_LIMIT) {
      console.info(warning(`Не больше 1000 объявлений`));
      process.exit(ExitCode.ERROR);
    }

    const countArticle = Number.parseInt(count, 10) || DEFAULT_COUNT;

    const superUser = generateSuperUser();
    const users = [superUser, ...generateUsers(USER_COUNT)];
    const categories = await getFileContent(`./data/${MockFileName.CATEGORIES}`);
    const articles = await generateArticles(countArticle, users, await getMockData());
    const comments = articles.flatMap((article) => article.comments);
    const roles = generateRoles();
    const articlesCategories = articles.flatMap((article, index) => {
      return article.categories.map((category) => ({
        articleId: index + 1,
        categoryId: category.id
      }));
    });

    const userValues = users.map(
        ({firstName, lastName, email, avatar, password, roleId}) =>
          `('${firstName}', '${lastName}', '${email}', '${avatar}', '${password}', '${roleId}')`
    ).join(`,\n`);

    const roleValues = roles
      .map(({title}) => `('${title}')`)
      .join(`,\n`);

    const categoryValues = categories
      .map((title) => `('${title}')`)
      .join(`,\n`);

    const articleValues = articles.map(
        ({title, image, announce, fullText, publishedAt, userId}) =>
          `('${title}', '${image}', '${announce}', '${fullText}', '${publishedAt}', '${userId}')`
    ).join(`,\n`);

    const articleCategoryValues = articlesCategories.map(
        ({articleId, categoryId}) =>
          `(${articleId}, ${categoryId})`
    ).join(`,\n`);

    const commentValues = comments.map(
        ({text, userId, articleId}) =>
          `('${text}', ${userId}, ${articleId})`
    ).join(`,\n`);

    const content = `
      INSERT INTO roles(title) VALUES
        ${roleValues};
      INSERT INTO users(first_name, last_name, email, avatar, password, role_id) VALUES
        ${userValues};
      INSERT INTO categories(title) VALUES
        ${categoryValues};
      ALTER TABLE articles DISABLE TRIGGER ALL;
      INSERT INTO articles(title, image, announce, full_text, published_at, user_id) VALUES
        ${articleValues};
      ALTER TABLE articles ENABLE TRIGGER ALL;
      ALTER TABLE articles_categories DISABLE TRIGGER ALL;
      INSERT INTO articles_categories(article_id, category_id) VALUES
        ${articleCategoryValues};
      ALTER TABLE articles_categories ENABLE TRIGGER ALL;
      ALTER TABLE comments DISABLE TRIGGER ALL;
      INSERT INTO COMMENTS(text, user_id, article_id) VALUES
        ${commentValues};
      ALTER TABLE comments ENABLE TRIGGER ALL;
    `;

    await createFile(content);
  }
};
