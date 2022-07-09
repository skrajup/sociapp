const router = require("express").Router();
const connectEnsureLogin = require('connect-ensure-login');// authorization
const userControllers = require("../controllers/userControllers");

// /users/:id: users route
router.get("/:id", connectEnsureLogin.ensureLoggedIn("/"), userControllers.users_id_get);
router.get("/:id/follow", connectEnsureLogin.ensureLoggedIn("/"), userControllers.users_id_follow_get);
router.get("/:id/unfollow", connectEnsureLogin.ensureLoggedIn("/"), userControllers.users_id_unfollow_get);

module.exports = router;
