const multer = require("multer");
const DataURI = require("datauri/parser");
const path = require("path");

const dataURI = new DataURI();

const dataUri = (image) =>
  dataURI.format(
    `${path.extname(image.originalname).toString()}`,
    image.buffer
  );

const storage = multer.memoryStorage();

const mimeTypes = ["image/jpeg", "image/png", "image/gif"];
const fileFilter = (req, files, cb) => {
  const { mimetype } = files;
  if (mimeTypes.includes(mimetype)) cb(null, true);
  else cb(null, false);
};

// const limits = { fileSize: 3 * 1024 * 1024 };

const multerUpload = multer({
  storage,
  fileFilter,
  // limits,
});

module.exports = { dataUri, multerUpload };
