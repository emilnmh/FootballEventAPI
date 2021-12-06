const express = require("express");
const field = require("../services/field");
const response = require("../../lib/response")

const router = new express.Router();

/**
 * Returns all the fields
 */
router.get("/", async (req, res, next) => {
  const options = {};

  try {
    const rows = await field.getFields(options);
    response.successResponse(res, rows);
  } catch (err) {
    return res.status(500).send({
      status: 500,
      error: "Server Error",
    });
  }
});

module.exports = router;
