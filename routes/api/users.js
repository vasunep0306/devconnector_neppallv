const router = require("express").Router();
var User = require("../../models/User");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");
// Vasu defined helper functions

// setup user avatar
setupAvatar = email => {
  return gravatar.url(email, {
    s: "200", // size
    r: "r", // rating
    d: "404" // default picture
  });
};

// set up user
setupUser = (name, email, avatar, password) => {
  return new User({
    name: name,
    email: email,
    avatar,
    password: password
  });
};

// set up JWT payload
createPayload = (id, name, avatar) => {
  return {
    id: id,
    name: name,
    avatar: avatar
  };
};

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
      const avatar = setupAvatar(req.body.email);
      const newUser = setupUser(
        req.body.name,
        req.body.email,
        avatar,
        req.body.password
      );

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
      return res.status(404).json({ user: "User not found" });
    }
    // Check the password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // Create JWT Payload
        const payload = createPayload(user._id, user.name, user.avatar);
        // Sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({ success: true, token: "Bearer " + token });
          }
        );
      } else {
        res.status(400).json({ Password: "Password incorrect" });
      }
    });
  });
});

// @route   GET api/users/current
// @desc    Return Current User
// @access  Private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user._id,
      name: req.user.name
    });
  }
);

module.exports = router;
