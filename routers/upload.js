const express = require('express');

const upload = express.Router();
const config = require('../config/config');
const controller = require('../controllers/upload');

const baseUrl = config.url;
// Create database
upload.post(`${baseUrl}/upload`, controller.postUpload);

module.exports = upload;
