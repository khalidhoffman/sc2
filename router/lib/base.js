const express = require('express');
const passport = require('passport');

class Router {
    constructor(authController) {
        this.auth = authController;
        this.router = express.Router();
        this.passport = passport;
    }
}

module.exports = Router;
