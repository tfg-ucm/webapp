var express = require("express");
var router = express.Router();
var config = require("../config/config");
var { isAuthenticated } = require("../middlewares/auth");
var request = require("request");

router.get("/", isAuthenticated, function(req, res, next) {
  request
    .get(config.apiUrl + "beacons", { json: true }, (error, response, bodyBeacons) => {
      if (error) {
        return res.render("error", {
          title: "There was an error",
          message: "Ooops! There was an error.",
          error: error
        });
      }
      if (response.statusCode !== 200) {
        return res.status(response.statusCode).render("routes/details", {
          title: "Rutas",
          errors: [bodyBeacons]
        });
      }

      let puntos = bodyBeacons;

      request
        .get(
          config.apiUrl + "routes",
          { json: true },
          (error, response, bodyRoutes) => {
            if (error) {
              return res.render("error", {
                title: "There was an error",
                message: "Ooops! There was an error.",
                error: error
              });
            }
            if (response.statusCode !== 200) {
              return res.status(response.statusCode).render("routes/details", {
                title: "Rutas",
                errors: [bodyRoutes]
              });
            }

            return res.status(response.statusCode).render("routes/details", {
                title: "Rutas",
                rutas: bodyRoutes,
                puntos: puntos,
                role: req.session.role
              });
          }
        )
        .auth(null, null, true, req.session.token);
    })
    .auth(null, null, true, req.session.token);
});

router.post("/", isAuthenticated, function(req, res, next) {
    request
      .post(
        config.apiUrl + "routes",
        {
          json: {
            account_id: req.session.id,
            name: req.body.name,
            descripcion: req.body.descripcion,
            ciudad: req.body.ciudad,
            recompensa: req.body.recompensa,
            puntos: req.body.punto,
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
              title: "Rutas",
              errors: [body.error]
            });
          }
          return res.redirect("routes");
        }
    ).auth(null, null, true, req.session.token);
});

router.delete("/:id", isAuthenticated, function(req, res, next) {
    request
      .delete(
        config.apiUrl + "routes/" + toString(req.params.id),
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
            return res.status(response.statusCode).render("routes/details", {
              title: "Rutas",
              errors: [body.error]
            });
          }
          return res.redirect("routes");
        }
      ).auth(null, null, true, req.session.token);
});

module.exports = router;
