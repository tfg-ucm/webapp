var express = require('express');
var router = express.Router();
var config = require('../config/config');
var {isAuthenticated} = require('../middlewares/auth');
var request = require('request');

router.get('/create', function (req, res, next) {
    return res.render('accounts/create', {title: 'Crear cuenta'});
});

router.post('/create', function (req, res, next) {
    request.post(config.apiUrl + 'accounts', {
        json: {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            userType: req.body.type
        }
    }, (error, response, body) => {
        if (error) {
            return res.render('error', {
                title: 'There was an error',
                message: 'Ooops! There was an error.',
                error: error
            });
        }
        if (response.statusCode !== 201) {
            return res.status(response.statusCode).render('accounts/create', {
                title: 'Create account',
                errors: [ body.error ]
            });
        }
        return res.status(response.statusCode).redirect('/accounts/login');
    });
});

router.put("/:id", isAuthenticated, function(req, res, next) {
  request
    .put(
      config.apiUrl + "accounts/" + toString(req.params.id),
      {
        json: {
          name: req.body.name,
          email: req.body.email,
        }
      },
      (error, response, body) => {
        if (error) {
          return res.render("error", {
            title: "There was an error",
            message: "Ooops! There was an error.",
            error: error
          });
        }
        if (response.statusCode !== 200) {
          return res.status(response.statusCode).render("accounts/details", {
            title: "Detalles de la cuenta",
            errors: [body.error]
          });
        }
        return res.redirect("/details");
      }
    )
    .auth(null, null, true, req.session.token);
});

router.get('/details', isAuthenticated, function (req, res, next) {
    request
    .get(config.apiUrl + "accounts/" + req.session.userId , { json: true }, (error, response, body) => {
      if (error) {
        return res.render("error", {
          title: "There was an error",
          message: "Ooops! There was an error.",
          error: error
        });
      }
      if (response.statusCode !== 200) {
        return res.status(response.statusCode).render("accounts/details", {
          title: "Detalles de la cuenta",
          errors: [body.error]
        });
      }
      return res.status(response.statusCode).render("accounts/details", {
        title: "Detalles de la cuenta",
        usuario: body
      });
    })
    .auth(null, null, true, req.session.token);
});

router.get('/login', function (req, res, next) {
    res.render('accounts/login', {title: 'Acceso'});
});

router.post('/login', function (req, res) {
    request.post(config.apiUrl + 'auth/login', {
        json: {
            email: req.body.email,
            password: req.body.password
        }
    }, (error, response, body) => {
        if (error) {
            console.log(error);
            return res.render('error', {
                title: 'There was an error',
                message: 'Ooops! There was an error.',
                error: error
            });
        }
        if (response.statusCode !== 200) {
            return res.status(response.statusCode).redirect('/accounts/login');
        }
        req.session.token = response.body.token;
        req.session.userId = response.body.id;
        req.session.role = response.body.role;
        
        let redirectTo = req.session.redirectTo;
        delete req.session.redirectTo;
        res.status(response.statusCode).redirect(redirectTo);
    });
});

router.get('/logout', isAuthenticated, function (req, res) {
    if (req.session) {
        req.session.destroy(function (err) {
            return res.redirect('/');
        })
    }
});

router.delete("/:id", isAuthenticated, function(req, res, next) {
    request
      .delete(
        config.apiUrl + "accounts/" + toString(req.params.id),
        {
          json: {
            id: req.params.id
          }
        },
        (error, response, body) => {
          if (error) {
            return res.render("error", {
              title: "There was an error",
              message: "Ooops! There was an error.",
              error: error
            });
          }
          if (response.statusCode !== 204) {
            return res.status(response.statusCode).render("accounts/details", {
              title: "Beacons",
              errors: [body.error]
            });
          }
          return res.redirect("accounts");
        }
      )
      .auth(null, null, true, req.session.token);
  });

module.exports = router;
