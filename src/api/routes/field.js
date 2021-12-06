const express = require("express");
const field = require("../services/field");

const router = new express.Router();

/**
 * Returns all the fields
 */
router.get("/", async (req, res, next) => {
  const options = {};

  try {
    const result = await field.getFields(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    return res.status(500).send({
      status: 500,
      error: "Server Error",
    });
  }
});

module.exports = router;
