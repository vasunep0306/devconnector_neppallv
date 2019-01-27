const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const users = require("./routes/api/users");
const passport = require("passport");

const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");
const app = express();

// DB Config
const db = require("./config/keys").mongoURI;
// Body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Connect to MongoDB
mongoose
  .connect(db)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// passport middleware
app.use(passport.initialize());

// Passport Config
require("./config/passport.js")(passport);
// Use routes
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
