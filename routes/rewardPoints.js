var express = require("express");
var router = express.Router();
var config = require("../config/config");
var { isAuthenticated } = require("../middlewares/auth");
var request = require("request");

router.get("/", isAuthenticated, function(req, res, next) {
  request
    .get(
      config.apiUrl + "reward-points",
      { json: true },
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
            .render("rewardPoints/details", {
              title: "Reward Points",
              errors: [body.error]
            });
        }
        return res.status(response.statusCode).render("rewardPoints/details", {
          title: "Reward Points",
          puntos: body
        });
      }
    )
    .auth(null, null, true, req.session.token);
});

router.post("/", isAuthenticated, function(req, res, next) {
  request
    .post(
      config.apiUrl + "reward-points",
      {
        json: {
          name: req.body.name,
          descripcion: req.body.descripcion,
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
        if (response.statusCode !== 201) {
          return res.status(response.statusCode).render("rewardPoints/details", {
              title: "Reward Points",
              errors: [body.error]
            });
        }
        return res.redirect("reward-points");
      }
    )
    .auth(null, null, true, req.session.token);
});

router.put("/:id", isAuthenticated, function(req, res, next) {
  request
    .put(
      config.apiUrl + "reward-points/" + toString(req.params.id),
      {
        json: {
          id: req.params.id,
          name: req.body.name,
          descripcion: req.body.descripcion,
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
          return res
            .status(response.statusCode)
            .render("rewardPoints/details", {
              title: "Reward Points",
              errors: [body.error]
            });
        }
        return res.redirect("rewardPoints");
      }
    )
    .auth(null, null, true, req.session.token);
});

router.delete("/:id", isAuthenticated, function(req, res, next) {
  request
    .delete(
      config.apiUrl + "reward-points/" + toString(req.params.id),
      {
        json: {
          id: req.params.id,
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
          return res
            .status(response.statusCode)
            .render("rewardPoints/details", {
              title: "Reward Points",
              errors: [body.error]
            });
        }
        return res.redirect("rewardPoints");
      }
    )
    .auth(null, null, true, req.session.token);
});

module.exports = router;
