var express = require("express");
var router = express.Router();
var config = require("../config/config");
var { isAuthenticated } = require("../middlewares/auth");
var request = require("request");

router.get("/", isAuthenticated, function(req, res, next) {
  
  if(req.session.role === "hostelero"){
    request
    .get(
      config.apiUrl + "rewards/hostelero/" + req.session.userId,
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
          return res.status(response.statusCode).render("rewards/details", {
            title: "Rewards",
            errors: [body.error]
          });
        }
        return res.status(response.statusCode).render("rewards/details", {
          title: "Rewards",
          rutas: body,
          role: req.session.role
        });
      }).auth(null, null, true, req.session.token);
  }else{
    request
    .get(
      config.apiUrl + "rewards/" + req.session.userId,
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
          return res.status(response.statusCode).render("rewards/details", {
            title: "Rewards",
            errors: [body.error]
          });
        }
        return res.status(response.statusCode).render("rewards/details", {
          title: "Rewards",
          rutas: body,
          role: req.session.role
        });
      }).auth(null, null, true, req.session.token);
  }
  
  
});

router.get("/", isAuthenticated, function(req, res, next) {
  res.render("rewards/details", { title: "Rewards" });
});

router.post("/", isAuthenticated, function(req, res, next) {
  let nombresBeacons = req.body.puntos.split(",");
  let puntosBe = [{ name: String, validado: Boolean }];

  for (let i = 0; i < nombresBeacons.length; i++) {
    puntosBe.unshift({ name: nombresBeacons[i], validado: false });
  }

  puntosBe.pop();

  request
    .post(
      config.apiUrl + "reward-points/ciudad",
      { 
        json: {
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
          return res.status(response.statusCode).render("rewards/details", {
            title: "Rewards",
            errors: [body.error]
          });
        }

        let puntosRe = [{ name: String, id: Boolean }];

        for (let i = 0; i < body.length; i++) {
          puntosRe.unshift({ name: body[i].name, id: body[i].account_id });
        }

        puntosRe.pop();

        request
          .post(
            config.apiUrl + "rewards",
            {
              json: {
                account_id: req.session.userId,
                hostelero_id: null,
                name: req.body.name,
                ciudad: req.body.ciudad,
                recompensa: req.body.recompensa,
                beacons: puntosBe,
                puntosRecompensa: puntosRe,
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
                return res
                  .status(response.statusCode)
                  .render("routes/details", {
                    title: "Beacons",
                    errors: [body.error]
                  });
              }
              return res.redirect("rewards");
            }
          )
          .auth(null, null, true, req.session.token);
      }
    )
    .auth(null, null, true, req.session.token);
});

router.post("/claim/:name", isAuthenticated, function(req, res, next) {
  request
    .post(config.apiUrl + "rewards/claim/" + req.params.name, 
    { 
      json: {
        hostelero_id: req.body.id
      }
     }, (error, response, body) => {
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
      return res.redirect("/rewards/");
    })
    .auth(null, null, true, req.session.token);
});

module.exports = router;
