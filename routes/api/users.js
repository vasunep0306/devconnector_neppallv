const router = require("express").Router();

router.get("/test", (req, res) => {
  res.json({ message: "User works" });
});

module.exports = router;
