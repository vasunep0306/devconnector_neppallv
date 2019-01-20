const router = require("express").Router();

router.get("/test", (req, res) => {
  res.json({ message: "Post works" });
});

module.exports = router;
