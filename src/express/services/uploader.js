'use strict';

const multer = require(`multer`);
const path = require(`path`);
const {nanoid} = require(`nanoid`);

const UPLOAD_DIR = `../upload/img/`;
const NAME_LENGTH = 10;

const uploadDirAbsolute = path.resolve(__dirname, UPLOAD_DIR);

const createStorage = (uploadDir) => {
  return multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
      const uniqueName = nanoid(NAME_LENGTH);
      const extension = file.originalname.split(`.`).pop();
      cb(null, `${uniqueName}.${extension}`);
    }
  });
};

const storage = createStorage(uploadDirAbsolute);

module.exports = {
  uploader: multer({storage})
};
