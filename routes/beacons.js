var express = require("express");
var router = express.Router();
var config = require("../config/config");
var { isAuthenticated } = require("../middlewares/auth");
var request = require("request");

router.get("/", isAuthenticated, function(req, res, next) {
  request
    .get(config.apiUrl + "beacons", { json: true }, (error, response, body) => {
      if (error) {
        return res.render("error", {
          title: "There was an error",
          message: "Ooops! There was an error.",
          error: error
        });
      }
      if (response.statusCode !== 200) {
        return res.status(response.statusCode).render("beacons/details", {
          title: "Beacons",
          errors: [body.error]
        });
      }
      return res.status(response.statusCode).render("beacons/details", {
        title: "Beacons",
        puntos: body,
        role: req.session.role
      });
    })
    .auth(null, null, true, req.session.token);
});

router.post("/", isAuthenticated, function(req, res, next) {
  request
    .post(
      config.apiUrl + "beacons",
      {
        json: {
          name: req.body.name,
          longitud: req.body.longitud,
          latitud: req.body.latitud,
          ciudad: req.body.ciudad,
          ruta: " "
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
          return res.status(response.statusCode).render("beacons/details", {
            title: "Beacons",
            errors: [body.error]
          });
        }
        return res.redirect("beacons");
      }
    )
    .auth(null, null, true, req.session.token);
});

router.put("/:id", isAuthenticated, function(req, res, next) {
  request
    .put(
      config.apiUrl + "beacons/" + toString(req.params.id),
      {
        json: {
          id: req.params.id,
          name: req.body.name,
          longitud: req.body.longitud,
          latitud: req.body.latitud,
          ciudad: req.body.ciudad
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
          return res.status(response.statusCode).render("beacons/details", {
            title: "Beacons",
            errors: [body.error]
          });
        }
        return res.redirect("beacons");
      }
    )
    .auth(null, null, true, req.session.token);
});

router.delete("/:id", isAuthenticated, function(req, res, next) {
  request
    .delete(
      config.apiUrl + "beacons/" + toString(req.params.id),
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
          return res.status(response.statusCode).render("beacons/details", {
            title: "Beacons",
            errors: [body.error]
          });
        }
        return res.redirect("beacons");
      }
    )
    .auth(null, null, true, req.session.token);
});

router.post("/validate/:name", isAuthenticated, function(req, res, next) {
  request
    .post(
      config.apiUrl + "beacons/validate",
      {
        json: {
          beacon: req.params.name,
          reward: req.body.reward
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
          return res.status(response.statusCode).render("rewards/details", {
            title: "Rewards",
            errors: [body.error]
          });
        }

        response.body.beacons.forEach(beacon => {
          if (!beacon.validado) {
            return res.redirect("/rewards");
          }
        });

        request
          .post(
            config.apiUrl + "rewards/validate",
            { 
              json: {
                name: req.body.reward
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
                return res
                  .status(response.statusCode)
                  .render("rewards/details", {
                    title: "Rewards",
                    errors: [body.error]
                  });
              }
              return res.redirect("/rewards");
              
            }
          )
          .auth(null, null, true, req.session.token);
      }
    )
    .auth(null, null, true, req.session.token);

  /**
   * Valida un punto de una ruta.
   *
   * Es necesario hacer una peticion a la api: /beacons/validate/:name
   * (name es el nombre del beacon a validar) y pasar:
   *
   * - name de la recompensa en el req.body.reward
   *
   * La api buscara el beacon y lo marcara como validado.
   * La api devuelve la recompensa con el beacon validado.
   *
   * Cuando se recibe la recompensa se deberia comprobar si todos los puntos han sido
   * validados, en cuyo caso se haria una llamada a la api para solicitar el pago.
   * Esta llamada se hace a: /rewards/validate/:name (name es el nombre de la reward).
   */
    
});

module.exports = router;
