const router = require("express").Router();
var User = require("../../models/User");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get("/test", (req, res) => {
  res.json({ message: "User works" });
});

// @route   GET api/users/register
// @desc    Register a user
// @access  Public
router.post("/register", (req, res) => {
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res
        .status(400)
        .json({ email: "The user with the given email already exists" });
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200", // size
        r: "r", // rating
        d: "404" // default picture
      });
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => {
              res.json(user);
            })
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route   GET api/users/login
// @desc    Login user / Return JWT web token
// @access  Public
router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  // find the user by the email
  User.findOne({ email }).then(user => {
    if (!user) {
      return res
        .status(404)
        .json({ email: "There is no user with that given email" });
    }

    // Check the password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        res.json({ msg: "success" });
        // TODO: Generate JWT Token
      } else {
        res.status(400).json({ wrongpassword: "This is not a valid password" });
      }
    });
  });
});

module.exports = router;
