var express = require('express');
var router = express.Router();
var { isAuthenticated } = require('../middlewares/auth');

router.get('/', isAuthenticated, function(req, res, next) {
    res.render('rewards/details', { title: 'Rewards' });
});

module.exports = router;