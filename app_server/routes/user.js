const express = require('express');
const ctrl = require('../controllers/user');
var router = express.Router();
var fs = require('fs');
const { requireAuth } = require('../middleware/auth');
var sendJsonResponse = (res, status, content) => {
  res.status(status);
  res.json(content);
};

router.post('/', ctrl.register);
router.post('/login/', ctrl.login);
router.use(function (req, res, next) {
  if (req.session.authentication) {
    next();
  } else {
    sendJsonResponse(res, 404, { Message: 'Your are not logged in' });
  }
});
router.get('/notes/completed', ctrl.completed);
router.get('/notes/', ctrl.notes);
router.post('/notes/add', ctrl.create);
router.get('/notes/incomplete', ctrl.incomplete);
router.put('/notes/changestatus/:noteID', ctrl.changestatus);
router.delete('/notes/remove/:noteID', ctrl.delete);
router.post('/logout', ctrl.logout);

module.exports = router;
