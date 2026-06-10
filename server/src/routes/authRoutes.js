const express = require("express");
const { login } = require("../controllers/authController");
const { validateBody } = require("../middleware/validate");
const { authLoginSchema } = require("../validators/contentSchemas");

const router = express.Router();

router.post("/login", validateBody(authLoginSchema), login);

module.exports = router;

