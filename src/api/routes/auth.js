const express = require('express');
const auth = require('../services/auth');

const router = new express.Router();


/**
 * Authorizes the user
 */
router.post('/', async (req, res, next) => {
  const options = {
    body: req.body['body']
  };

  try {
    const result = await auth.authUser(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
