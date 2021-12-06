const express = require("express");
const event = require("../services/event");
const response = require("../../lib/response")

const router = new express.Router();

/**
 * Returns all events from the given field.
 */
router.get("/:field_id", async (req, res, next) => {
  const options = {
    field_id: req.params["field_id"],
  };

  try {
    const result = await event.getEventsOfField(options);
    response.successResponse(res, result)
  } catch (err) {
    next(err);
  }
});

/**
 * Joins a event.
 */
router.post("/:event_id/join", async (req, res, next) => {
  const options = {
    event_id: req.params["event_id"],
    body: req.body["body"],
  };

  try {
    const result = await event.joinEvent(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    next(err);
  }
});

/**
 * Creates a new event of the field.
 */
router.post("/:field_id", async (req, res, next) => {
  const options = {
    field_id: req.params["field_id"],
    body: req.body["body"],
  };

  try {
    const result = await event.createEvent(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    next(err);
  }
});

/**
 * Returns all of todays events
 */
router.get("/", async (req, res, next) => {
  const options = {};

  try {
    const result = await event.getEvents(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    return res.status(500).send({
      status: 500,
      error: "Server Error",
    });
  }
});

module.exports = router;
