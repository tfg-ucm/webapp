var express = require('express');
var router = express.Router();
var config = require("../config/config");
var {isAuthenticated} = require('../middlewares/auth');
var request = require("request");

router.get("/", isAuthenticated, function(req, res, next) {
    request
      .get(config.apiUrl + "rewards/" + toString(req.session.userId), { json: true }, (error, response, body) => {
        if (error) {
          return res.render("error", {
            title: "There was an error",
            message: "Ooops! There was an error.",
            error: error
          });
        }
        if (response.statusCode !== 200) {
          return res.status(response.statusCode).render("rewards/details", {
            title: "Rewards",
            errors: [body.error]
          });
        }
        return res.status(response.statusCode).render("rewards/details", {
          title: "Rewards",
          rutas: body,
        });
      })
      .auth(null, null, true, req.session.token);
  });

router.get('/', isAuthenticated, function (req, res, next) {
    res.render('rewards/details', {title: 'Rewards'});
});

router.post("/", isAuthenticated, function (req, res, next) {
    let nombresBeacons = req.body.puntos.split(",");
    let puntos = [{name: String, validado: Boolean}];

    for (let i = 0; i < nombresBeacons.length; i++) {
        puntos.unshift({name: nombresBeacons[i], validado: false});
    }

    request.post(config.apiUrl + "rewards", {
            json: {
                account_id: req.session.userId,
                name: req.body.name,
                ciudad: req.body.ciudad,
                recompensa: req.body.recompensa,
                beacons: puntos,
                terminada: false,
                canjeada: false
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
            if (response.statusCode !== 201) {
                return res.status(response.statusCode).render("routes/details", {
                    title: "Beacons",
                    errors: [body.error]
                });
            }
            return res.redirect("rewards");
        }
    )
        .auth(null, null, true, req.session.token);
});

router.post("/claim/:name", isAuthenticated, function (req, res, next) {
    /**
     * Se envia el pago al hostelero y el usuario recibe la recompensa fisicamente en el establecimiento.
     *
     * Es necesario hacer una peticion a la api: /rewards/claim/:name (name es el nombre de la reward)
     *
     * La api hace un pago desde la cuenta Stellar del usuario a la cuenta del hostelero por el mismo
     * valor de la recompensa. El hostelero puede verificar que se ha realizado ese pago en su panel.
     */
});

module.exports = router;