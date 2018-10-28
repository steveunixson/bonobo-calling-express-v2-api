const express = require('express');
const basicAuth = require('express-basic-auth');

const auth = express.Router();
const config = require('../config/config');
const controller = require('../controllers/auth');
const org = require('../controllers/org');

/**
 * @return {boolean}
 */
function BasicAuthorizer(username, password) {
  return username === process.env.ROOTUSER && password === process.env.ROOTPWD;
}

const baseUrl = config.url;
// Create authorization
auth.post(`${baseUrl}/user/signup`, org.key, controller.tokenAdmin, controller.setupPostUser);

// View authorization via query
auth.post(`${baseUrl}/user/signup/admin`, org.key, basicAuth({ authorizer: BasicAuthorizer }), controller.setupPost);

// Delete authorization
auth.delete(`${baseUrl}/user`, org.key, controller.tokenAdmin, controller.removeUser);

// Login
auth.post(`${baseUrl}/user/login`, org.key, controller.login);


module.exports = auth;
