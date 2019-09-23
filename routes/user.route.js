
var express = require('express');
var router = express.Router();
var usersController = require('../controllers/controller.user')
var courseController = require('../controllers/controller.course')
var codewordsetController = require('../controllers/controller.codewordset')
var instructordasrboard=require('../controllers/controller.instructordahsboard')
const bodyParser = require('body-parser');
let multer = require('multer')
const tokencheck = require('../middleware/tokencheck')
router.use(bodyParser.json());

router.all('*', tokencheck.tokencheck)
/* GET home page. */
router.get('/', function(req, res, next) {
  res.json('codeword')
});


router.get('/details', usersController.details);
router.post('/validateEmail', usersController.validateEmail);
router.post('/sendmail', usersController.tempPassword);
router.post('/changepassword', usersController.changePassword);
router.post('/addnewCourse', courseController.addCourse);
router.get('/getCourseList', courseController.getCourses/*,courseController.getCoursesAckData*/);
router.post('/addcodewordset',codewordsetController.addcodewordset);
router.post('/addcodeword', codewordsetController.addcodeword)
router.post('/updatecodeword', codewordsetController.updatecodeword)
router.get('/getcodewordset', codewordsetController.getcodewordset)
router.post('/updateCourse', courseController.updateCourse)
router.post('/deleteCourse', courseController.deleteCourse)
router.post('/addstudent', courseController.addStudent)
router.post('/deletestudent', courseController.deleteStudent)
router.post('/editstudent', courseController.editStudent)
router.post('/assignCourse', courseController.assignCourse)
router.get('/getStudentCourses', courseController.getStudentCourses)
// router.post('/addcodewords',multer().single('file'), codewordController.addcodewords);
// router.post('/getdataxlsx',codewordsetController.getDataFromXLS);
// router.post('/addnewcodewords', codewordController.addcodewords);
router.post('/updateCourse', courseController.updateCourse);
router.post('/reset', usersController.sendResetEmail)
router.get('/resetpassword', usersController.resetPassword)
router.post('/resetpassword', usersController.reset)
router.get('/getcourse/:id',instructordasrboard.getcourse)
router.get('/getacodewordset/:id',codewordsetController.getacodewordset)
router.post('/reveal', courseController.revealCodeword)
router.post('/deletecodeword', codewordsetController.deletecodeword)
router.post('/generateReport', codewordsetController.generateReport)
router.post('/publishCodeworset', codewordsetController.publishCodeworset)
router.post('/deleteCodewordset', codewordsetController.deleteCodewordset)
router.post('/upadatecodewordset', codewordsetController.upadatecodewordset)
router.post('/checkUsers', usersController.checkUsers)
router.post('/instructorRequest', usersController.instructorRequest)
router.get('/requests', usersController.requests)
router.post('/acceptRequest', usersController.acceptRequest)
router.post('/declineRequest', usersController.declineRequest)
router.get('/getAllUsers', usersController.getAllUsers)
router.post('/deleteUser', usersController.deleteUser)
module.exports = router;
