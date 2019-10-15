
var express = require('express');
var router = express.Router();
var usersController = require('../controllers/controller.user')
const bodyParser = require('body-parser');

router.use(bodyParser.json());

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json('auth')
});

router.post('/signup', usersController.signUp);
router.post('/signin', usersController.signIn);
router.post('/forgotPassword', usersController.forgotPassword)
router.post('/resetPassword', usersController.resetPassword)
router.post('/verifyEmail', usersController.verifyEmail)
module.exports = router;
