require("dotenv").config();
const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const path = require("path");

// Allow json values to be used
app.use(express.json());

// Require data produced by generators
const tableData = require("../endpointData.json");

/** Middleware for protected routes to authenticate tokens  */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    res.status(401);
    return res.send("No token provided");
  }

  // Verify the token and move to next function only if valid
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
    if (error) {
      // console.error(error);
      res.status(403);
      return res.send("Token is invalid");
    }
    req.user = user;
    next();
  });
};

/** Protected GET endpoint to send a list of visible tables to authorised users
 * @requires JWT authorised web token from /login
 */
app.get("/getVisibleTables", authenticateToken, (req, res) => {
  res.status(200);
  res.json(tableData);
});

/** POST endpoint to authorise user and receive JWT for calls to protected routes
 * Currently this route assumes all users are authorised and returns a token, but in actual
 * production, I would tie this into an auth service such as Auth0, Firebase or another
 * provider to properly authenticate users
 */
app.post("/login", (req, res) => {
  // Create generic user to use for token access
  const username = req.body && req.body.username;
  const newUser = { name: username };

  // Create new access token using secret from .env
  const accessToken = jwt.sign(newUser, process.env.ACCESS_TOKEN_SECRET);

  res.status(200);
  res.json({ accessToken: accessToken });
});

app.get("/viewTabularData", (req, res) => {
  res.sendFile(path.join(__dirname + "/viewTabularData.html"));
});

module.exports = app;
