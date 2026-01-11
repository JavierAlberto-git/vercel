const router = require("express").Router();
const { health, login } = require("../controllers/auth.controller");

router.get("/health", health);     // GET /api/health
router.post("/login", login);      // POST /api/login

module.exports = router;
