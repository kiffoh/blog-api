var express = require('express');
var router = express.Router();
const { authenticateJwt } = require('../config/passportJWT')
const authorisation = require('../controllers/authorisation');
const userController = require('../controllers/userController');


/* GET users listing. */
router.get('/', authenticateJwt, function(req, res, next) {
  res.send('GET users');
  // List of users
});

/*
router.get('/sign-up', function(req, res, next) {
  res.send('GET sign-up');
});
*/

router.post('/sign-up', userController.createUser);

/*
router.get('/log-in', function(req, res, next) {
  res.send('GET log-in');
});
*/

router.post('/log-in', userController.logIn);

router.get('/:userId', authenticateJwt, userController.findUser);

router.put('/:userId', authenticateJwt, authorisation.ofUser, userController.updateUser);

router.delete('/:userId', authenticateJwt, authorisation.ofUser, userController.deleteUser);

module.exports = router;
