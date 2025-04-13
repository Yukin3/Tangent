const express = require('express');
const router = express.Router();
const syncClerkUser = require('../middleware/clerkUserSync');

router.get('/me', syncClerkUser, (req, res) => {
  res.json(req.mongoUser);
});

module.exports = router;
