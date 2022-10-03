const router = require("express").Router();
const devControllers = require("../controllers/devControllers.js");
router.post("/send_to_dev", devControllers.send__to__dev__post);

module.exports = router;