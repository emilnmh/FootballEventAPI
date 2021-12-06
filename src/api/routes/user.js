const express = require("express");
const user = require("../services/user");

const router = new express.Router();

/**
 * Creates a new user
 */
router.post("/", async (req, res, next) => {
  const options = {
    body: req.body["body"],
  };

  try {
    const result = await user.createUser(options);
    res.status(200).send(result.data);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
