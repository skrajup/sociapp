const router = require("express").Router();
const connectEnsureLogin = require('connect-ensure-login');// authorization
const postControllers = require("../controllers/postControllers");

// posts routes
router.get("/:id", connectEnsureLogin.ensureLoggedIn("/"), postControllers.posts_id_get);
router.get("/:id/update", connectEnsureLogin.ensureLoggedIn("/"), postControllers.posts_id_update_get);
router.post("/:id/update", connectEnsureLogin.ensureLoggedIn("/"), postControllers.posts_id_update_post);
router.get("/:id/delete", connectEnsureLogin.ensureLoggedIn("/"), postControllers.posts_id_delete_get);
router.post("/:id/post_comment", connectEnsureLogin.ensureLoggedIn("/"), postControllers.posts_id_post_comment_get);

module.exports = router;