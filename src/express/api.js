'use strict';

const axios = require(`axios`);

const TIMEOUT = 1000;

const port = process.env.API_PORT || 3000;
const defaultUrl = `http://localhost:${port}/api/`;

class API {
  constructor(baseURL, timeout) {
    this._http = axios.create({
      baseURL,
      timeout,
    });
  }

  async _load(url, options) {
    const response = await this._http.request({url, ...options});
    return response.data;
  }

  async getArticles({offset, limit, comments} = {}) {
    return await this._load(`/articles`, {params: {offset, limit, comments}});
  }

  async getArticle(id, comments) {
    return await this._load(`/articles/${id}`, {params: {comments}});
  }

  async search(query) {
    return await this._load(`/search`, {params: {query}});
  }

  async getCategories(count) {
    return await this._load(`/categories`, {params: {count}});
  }

  async createArticle(data) {
    return await this._load(`/articles`, {
      method: `POST`,
      data
    });
  }

  async updateArticle(data) {
    return await this._load(`/articles/${data.id}`, {
      method: `PUT`,
      data
    });
  }

  async createComment(articleId, data) {
    return await this._load(`/articles/${articleId}/comments`, {
      method: `POST`,
      data
    });
  }

}

const defaultAPI = new API(defaultUrl, TIMEOUT);

module.exports = {
  API,
  getAPI: () => defaultAPI
};
