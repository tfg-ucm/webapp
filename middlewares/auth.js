var config = require('../config/config');
var request = require('request');

exports.isAuthenticated = function(req, res, next) {
    if (req.session.token === undefined || req.session.token === "") {
        req.session.redirectTo = req.originalUrl;
        res.status(401);
        return res.redirect('/accounts/login');
    }
    next()
};