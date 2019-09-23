const _ = require('lodash');
var { CourseStudentModel } = require('../model/model.coursestudent');
var { mongoose } = require('./../config/database')
var { CodeWord } = require('../model/model.codeword')
let XLSX = require('xlsx')
var Course = require('./../controllers/controller.course')
var { CourseModel } = require('../model/model.course');
const fs = require('fs')

let getcourse = (req,res) => {
   // var body = _.pick(req.body,['courseNameKey','email','codeWordSet','Startdate','Enddate','PreSurveyURL','PostSurveyURL']);
    var id = req.params.id
    console.log(id)
    CourseModel.findOne({_id: id}, function (err, course) {
        if(err){
            return res.json({ code: 404, message: 'Course Doesnt Exist'});
        }else if(course.createdBy != req.session.email){
            return res.json({ code: 400, message: 'Unauthorized'});
        }
        return res.json({ code: 200, data: course});
    })
}
module.exports.getcourse = getcourse;