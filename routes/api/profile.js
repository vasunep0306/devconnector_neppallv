const router = require("express").Router();

router.get("/test", (req, res) => {
  res.json({ message: "Profile works" });
});

module.exports = router;
