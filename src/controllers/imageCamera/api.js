const express = require('express');
const api = express();
const service = require('./service');
// const Auth = require('../../auth/services').authentication;

api.get('/', service.getCameraPhoto);
api.post('/', service.newPhoto);

module.exports = api;
