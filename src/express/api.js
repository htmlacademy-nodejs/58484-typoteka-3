'use strict';

const axios = require(`axios`);
const {HttpMethod} = require(`../constants`);

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

  async getHotArticles(limit) {
    return await this._load(`/articles/hot`, {params: {limit}});
  }

  async getArticlesByCategoryId({offset, limit, categoryId} = {}) {
    return await this._load(`/articles/category/${categoryId}`, {params: {offset, limit, categoryId}});
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

  async createCategory(category) {
    return await this._load(`/categories`, {
      method: HttpMethod.POST,
      data: {
        category
      }
    });
  }

  async updateCategory(id, category) {
    return await this._load(`/categories/edit/${id}`, {
      method: HttpMethod.PUT,
      data: {
        category
      }
    });
  }

  async deleteCategory(id) {
    return await this._load(`/categories/${id}`, {
      method: HttpMethod.DELETE,
    });
  }

  async createArticle(data) {
    return await this._load(`/articles`, {
      method: HttpMethod.POST,
      data
    });
  }

  async updateArticle({id, data}) {
    return await this._load(`/articles/${id}`, {
      method: HttpMethod.PUT,
      data
    });
  }

  async deleteArticle(id) {
    return await this._load(`/articles/${id}`, {
      method: HttpMethod.DELETE
    });
  }

  async createComment(articleId, data) {
    return await this._load(`/articles/${articleId}/comments`, {
      method: HttpMethod.POST,
      data
    });
  }

  async createUser(data) {
    return await this._load(`/user`, {
      method: HttpMethod.POST,
      data
    });
  }

  async getComments() {
    return await this._load(`/comments`);
  }

  async getLastComments(limit) {
    return await this._load(`/comments/last`, {params: {limit}});
  }

  auth(email, password) {
    return this._load(`/user/auth`, {
      method: HttpMethod.POST,
      data: {email, password}
    });
  }

  async deleteComment(id) {
    return await this._load(`/comments/${id}`, {
      method: HttpMethod.DELETE
    });
  }

}

const defaultAPI = new API(defaultUrl, TIMEOUT);

module.exports = {
  API,
  getAPI: () => defaultAPI
};
