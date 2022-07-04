const express = require("express");
const connectEnsureLogin = require('connect-ensure-login');// authorization
const dashboardControllers = require("../controllers/dashboardControllers");
const router = express.Router();

// all dashboard routes--------------------------------------------------------------
router.get("/", connectEnsureLogin.ensureLoggedIn("/"), dashboardControllers.dashboard_index);
router.get("/search", connectEnsureLogin.ensureLoggedIn("/"), dashboardControllers.dashboard_search_get);
router.post("/search/key", connectEnsureLogin.ensureLoggedIn("/"), dashboardControllers.dashboard_search_key_post);
router.get("/create", connectEnsureLogin.ensureLoggedIn("/"), dashboardControllers.dashboard_create_get);
router.post("/create", connectEnsureLogin.ensureLoggedIn("/"), dashboardControllers.dashboard_create_post);
router.get("/profile", connectEnsureLogin.ensureLoggedIn("/"), dashboardControllers.dashboard_profile_get);
// dashboard/profile routes
router.get("/profile/followers", connectEnsureLogin.ensureLoggedIn("/"), dashboardControllers.dashboard_profile_followers_get);
router.get("/profile/following", connectEnsureLogin.ensureLoggedIn("/"), dashboardControllers.dashboard_profile_following_get);

module.exports = router;