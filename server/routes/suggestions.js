const express = require("express");
const authMiddleware = require("../middleware/auth");
const { getSuggestions } = require("../controllers/suggestionController");

const router = express.Router();

router.use(authMiddleware);
router.get("/", getSuggestions);

module.exports = router;
