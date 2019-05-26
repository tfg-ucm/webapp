var express = require('express');
var router = express.Router();
var config = require('../config/config');
var {isAuthenticated} = require('../middlewares/auth');
var request = require('request');

router.get('/', isAuthenticated, function (req, res, next) {
    request.get(config.apiUrl + 'beacons', {json: true},
        (error, response, body) => {
            if (error) {
                return res.render('error', {
                    title: 'There was an error',
                    message: 'Ooops! There was an error.',
                    error: error
                });
            }
            if (response.statusCode !== 200) {
                return res.status(response.statusCode).render('beacons/details', {
                    title: 'Beacons',
                    errors: [body.error]
                });
            }
            return res.status(response.statusCode).render('beacons/details', {
                title: 'Beacons',
                puntos: body
            });
        }).auth(null, null, true, req.session.token);
});

router.post('/', isAuthenticated, function (req, res, next) {
    request.post(config.apiUrl + 'beacons', {
        json: {
            name: req.body.name,
            longitud: req.body.longitud,
            latitud: req.body.latitud,
            ciudad: req.body.ciudad,
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
            return res.status(response.statusCode).render('beacons/details', {
                title: 'Beacons',
                errors: [body.error]
            });
        }
        return res.redirect('beacons');
    }).auth(null, null, true, req.session.token);
});

module.exports = router;