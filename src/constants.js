'use strict';

const MAX_ID_LENGTH = 6;
const DEFAULT_COMMAND = `--help`;
const USER_ARGV_INDEX = 2;
const MOCKS_FILE_NAME = `mocks.json`;
const MOCKS_DB_FILE_NAME = `fill-db.sql`;
const HOT_ARTICLES_LIMIT = 4;
const LAST_COMMENTS_LIMIT = 4;
const ExitCode = {
  SUCCESS: 0,
  ERROR: 1,
};
const HttpCode = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

const HttpMethod = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const Env = {
  DEVELOPMENT: `development`,
  PRODUCTION: `production`
};

const MockFileName = {
  SENTENCES: `sentences.txt`,
  TITLES: `titles.txt`,
  CATEGORIES: `categories.txt`,
  COMMENTS: `comments.txt`,
};

const USER_ROLES = [
  `Читатель`,
  `Автор`,
];

const UserRole = {
  ADMIN: 1,
  READER: 2,
};

const RegisterMessage = {
  USER_ALREADY_REGISTER: `Пользователь с таким email уже зарегистрирован`,
  WRONG_EMAIL: `Неправильный email`,
  REQUIRED_FIELD: `Поле обязательно для заполнения`,
  MIN_PASSWORD_LENGTH: `Пароль должен быть не меньше 6 символов`,
  MAX_PASSWORD_LENGTH: `Пароль должен быть не больше 12 символов`,
  PASSWORDS_NOT_EQUALS: `Пароли не совпадают`,
  EMPTY_VALUE: `Не указано значение`,
};

const LoginMessage = {
  USER_NOT_EXISTS: `Пользователь с таким email не зарегистрирован`,
  WRONG_PASSWORD: `Неправильно введён логин или пароль`,
  WRONG_EMAIL: `Неправильный email`,
  REQUIRED_FIELD: `Поле обязательно для заполнения`,
};

const CategoryMessage = {
  UNABLE_TO_DELETE: `Невозможно удалить. Категория имеет связанные статьи`
};

module.exports = {
  MAX_ID_LENGTH,
  DEFAULT_COMMAND,
  USER_ARGV_INDEX,
  MOCKS_FILE_NAME,
  MOCKS_DB_FILE_NAME,
  HOT_ARTICLES_LIMIT,
  LAST_COMMENTS_LIMIT,
  ExitCode,
  HttpCode,
  HttpMethod,
  Env,
  MockFileName,
  USER_ROLES,
  RegisterMessage,
  LoginMessage,
  UserRole,
  CategoryMessage,
};
