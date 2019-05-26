var express = require('express');
var router = express.Router();
var { isAuthenticated } = require('../middlewares/auth');

router.get('/', isAuthenticated, function(req, res, next) {
  res.render('routes/details', { title: 'WEB APP' });
});

module.exports = router;
