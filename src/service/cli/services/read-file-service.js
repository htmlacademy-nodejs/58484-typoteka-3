'use strict';

const fs = require(`fs`).promises;
const {HttpCode} = require(`../../../constants`);

const DEFAULT_CONTENT = `[]`;

class ReadFileService {
  constructor(path) {
    this.path = path;
  }

  async getJSON() {
    return JSON.parse(await this._read());
  }

  parseError(err) {
    return {
      code: HttpCode.INTERNAL_SERVER_ERROR,
      message: `Server error: ${err.message}`,
    };
  }

  async _isFileExists() {
    try {
      await fs.access(this.path);
      return true;
    } catch (err) {
      return false;
    }
  }

  async _read() {
    if (await this._isFileExists()) {
      return await fs.readFile(this.path, `utf-8`) || DEFAULT_CONTENT;
    }

    return DEFAULT_CONTENT;
  }
}

module.exports = ReadFileService;
