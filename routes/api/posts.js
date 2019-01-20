const router = require("express").Router();

// @route   GET api/posts/test
// @desc    Tests post route
// @access  Public
router.get("/test", (req, res) => {
  res.json({ message: "Post works" });
});

module.exports = router;
