const express = require("express");
const connectEnsureLogin = require('connect-ensure-login');// authorization
const userControllers = require("../controllers/userControllers");
const router = express.Router();

// /users/:id: users route
router.get("/:id", connectEnsureLogin.ensureLoggedIn("/"), userControllers.users_id_get);

module.exports = router;
