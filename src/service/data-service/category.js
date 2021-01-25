'use strict';

class CategoryService {
  constructor(articles) {
    this._articles = articles;
  }

  findAll() {
    const categories = this._articles.reduce((acc, article) => {
      acc.push(...article.category);
      return acc;
    }, []);

    return [...new Set(categories)];
  }
}

module.exports = CategoryService;
