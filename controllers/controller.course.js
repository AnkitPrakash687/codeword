
const _ = require('lodash');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var { CourseModel } = require('../model/model.course');
var { UserModel } = require('../model/model.user');
var  CodewordSet  = require('../model/model.codewordset');
var { mongoose } = require('./../config/database')
var mailController = require('../config/user.mail.js')
let XLSX = require('xlsx')
var { CourseStudentModel } = require('../model/model.coursestudent');
const multer = require('multer')
const csv = require('csvtojson')


var uploadFile = multer(
    {
        storage: multer.memoryStorage(),
    })
    .single('file');

const saveCourseData = (students, invalidRecords, req, res) => {
    var body = _.pick(req.body, ['courseNameKey',
        'codeWordSetName', 'startDate', 'endDate', 'preSurveyURL', 'postSurveyURL', 'codewords']);
    //var body = req.
    var codewordSet
    console.log(invalidRecords)
    if(!body.codeWordSetName || !body.codewords){
        codewordSet = {
            codeWordSetName: '',
            codewords: []
        }
    }else{
        codewordSet = {
        codewordSetName: body.codeWordSetName,
        codewords: body.codewords.split(',')
        }
    }

    var courseModel = new CourseModel({
        courseNameKey: body.courseNameKey,
        students: students,
        codewordSet: codewordSet, 
        Startdate: body.startDate,
        Startdate: body.startDate,
        isAssigned: false,
        createdBy: req.session.email,
        Enddate: body.endDate,
        PreSurveyURL: body.preSurveyURL,
        PostSurveyURL: body.postSurveyURL
    });

    courseModel.save().then((user) => {
        if (user)
            return res.status(200).json({ code: '200',data:invalidRecords ,message: "Course created successfully." });
    }).catch((error) => {
        console.log(error)
        console.log(error.name + ' ' + error.code)
        if (error.name == 'MongoError' && error.code == 11000) {
            console.log('working')
            return res.status(200).json({ code:'403',message: 'There was a duplicate course error' });
        }
        return res.status(200).json({ data:'400', message: error.message });
    })
}

let addCourse = (req, res) => {

    uploadFile(req, res, error => {
        if (error instanceof multer.MulterError) {
            // A Multer error occurred when uploading.
        } else if (error) {
            // An unknown error occurred when uploading.
        }
       
        var studentList = req.file;
   
        if (studentList) {
            var fileExtn = req.file.originalname.split('.').pop()
            var invalidRecords = []
            console.log(fileExtn)
            if(fileExtn != 'csv'){
                return res.status(200).json({code:400, message: 'Wrong File Extension' });
            }
            var data = studentList.buffer.toString();

            csv({
                noheader: true,
                output: "csv"
            })
                .fromString(data)
                .then((jsonObj) => {
                    console.log(jsonObj)

                    var students = jsonObj.filter((data) => {
                        var email = data[1].trim()
                        var name = data[0].trim()
                        if(checkInput(name,email)){
                        return {
                            name: data[0],
                            email: data[1],
                            isRevealed: false,
                            codeword: ''
                        }
                    }else{
                        invalidRecords.push(data)
                    }
                    })
                    console.log('***************students****************')
                   students = students.map((item)=>{     
                            
                              return {  
                                name: item[0],
                                email: item[1],
                                isRevealed: false,
                                codeword:''
                              }           
                        
                    })
                    invalidRecords = invalidRecords.map((item)=>{
                        return {
                            name: item[0],
                            email:item[1]
                        }
                    })
                    console.log(students)
                    saveCourseData(students, invalidRecords, req, res)
                })

        } else {
            console.log(req.body)
            saveCourseData([], [], req, res)
        }

    })

    const checkInput = (name, email) =>{

        var emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        if(name.length > 50){
            return false
        }else if(!emailRegex.test(email)){
            return false
        }
        return true
    }

}
module.exports.addCourse = addCourse;

let getCourses = (req, res, next) => {
    // CourseModel.find({ emailKey: req.session.email }, function (err, courses) {
    CourseModel.find({ createdBy: req.session.email }, function (err, courses) {
        // if (courses)
        //     return res.json({ code: 200, data: courses });
        console.log(courses)
        // req.courses = courses;
        return res.json({ code: 200, data: courses });
        //  next();
    }).catch((e) => {
        return res.json({ code: 400, message: e });
    })
}
module.exports.getCourses = getCourses;

// let getCoursesAckData = (req, res) => {
//     let tCourses = _.map(req.courses, 'courseNameKey')
//     CourseStudentModel.find({ CourseNameKey: { $in: tCourses } }, function (err, result) {
//         let cRes = _.groupBy(result, 'CourseNameKey');
//         var result = [];
//         _.forEach(req.courses, function (value) {
//             let cData = value.toObject()
//             let tempData = cRes[value.courseNameKey];
//             if (tempData) {
//                 cData.totalAck = tempData.length;
//                 cData.ackAval = _.filter(tempData, { Acknowledged: true }).length

//             }
//             result.push(cData)
//         });
//         if (err) { res.send(err) }
//         return res.json({ code: 200, data: result });
//     })
// }
// module.exports.getCoursesAckData = getCoursesAckData;

// let updateCourseInfo = (req, res) => {

//     CourseModel.updateOne({ _id: req.body.id }, {
//         $set: {
//             "courseNameKey": req.body.courseNameKey,
//             "Startdate": req.body.Startdate,
//             "Enddate": req.body.Enddate,
//             "PreSurveyURL": req.body.PreSurveyURL,
//             "PostSurveyURL": req.body.PostSurveyURL
//         }
//     }, function (err, updatecodeword) {
//         if (err) {
//             return res.json({ code: 200, message: 'Course info is updated' });
//         }
//         return res.json({ code: 400, message: true })
//     })
// }
// module.exports.updateCourseInfo = updateCourseInfo;

let addStudent = (req, res) => {

    var body = _.pick(req.body, ['id', 'email', 'name']);
    CourseModel.findOne({ _id: body.id }, (err, course) => {

        if (!course) {
            return res.json({ code: 400, message: 'Course does not exist' });
        } else {
            var duplicate = false
            for (var i in course.students) {
                if (course.students[i].email == body.email) {
                    console.log(course.students[i].email + '==' + body.email)
                    duplicate = true
                }
            }
            if (duplicate) {
                return res.json({ code: 400, message: 'Student already added' });
            }
            var newStudents = course.students

            newStudents.push({
                name: body.name,
                email: body.email,
                isRevealed: false,
                codeword: ""
            })

            CourseModel.updateOne({ _id: body.id, createdBy: req.session.email },
                {
                    $set:
                        { students: newStudents }
                }, function (err, updatecoursestudent) {
                    console.log(updatecoursestudent)
                    if (err) {
                        return res.json({ code: 400, message: err });
                    }
                    return res.json({ code: 200, message: 'Student added successfully' })
                })
        }
    })
}
module.exports.addStudent = addStudent;

let editStudent = (req, res) => {

    var body = _.pick(req.body, ['id', 'oldName', 'oldEmail', 'newEmail', 'newName']);
    CourseModel.findOne({ _id: body.id }, (err, course) => {

        if (!course) {
            return res.json({ code: 400, message: 'Course does not exist' });
        } else {
            var duplicate = false
            if(body.oldEmail != body.newEmail){
            for (var i in course.students) {
                if (course.students[i].email == body.newEmail) {
                    console.log(course.students[i].email + '==' + body.email)
                    duplicate = true
                }
            }
        }
            if (duplicate) {
                return res.json({ code: 400, message: 'Student already exist' });
            }
            var newStudents = course.students

            for (var i in newStudents) {
                if (newStudents[i].email == body.oldEmail) {
                    newStudents[i].email = body.newEmail
                     newStudents[i].name = body.newName
                }
            }

            CourseModel.updateOne({ _id: body.id, createdBy: req.session.email },
                {
                    $set:
                        { students: newStudents }
                }, function (err, updatecoursestudent) {
                    console.log(updatecoursestudent)
                    if (err) {
                        return res.json({ code: 400, message: err });
                    }
                    return res.json({ code: 200, message: 'Student updated successfully' })
                })
        }
    })
}
module.exports.editStudent = editStudent;

let deleteStudent = (req, res) => {
    var body = _.pick(req.body, ['id', 'email']);
    CourseModel.findOne({ _id: body.id }, (err, course) => {

        if (!course) {
            return res.json({ code: 400, message: 'Course does not exist' });
        } else {

            var newStudents = course.students.filter((value, index, arr) => {
                return value.email != body.email
            })

            console.log(newStudents)
            CourseModel.updateOne({ _id: body.id, createdBy: req.session.email },
                {
                    $set:
                        { students: newStudents }
                }, function (err, updatecoursestudent) {
                    console.log(updatecoursestudent)
                    if (err) {
                        return res.json({ code: 400, message: err });
                    }
                    return res.json({ code: 200, message: 'Student deleted successfully' })
                })
        }
    })
}

module.exports.deleteStudent = deleteStudent;

let deleteCourse = (req, res) => {
    var body = _.pick(req.body, ['id', 'studentEmails']);
    console.log(req.session.email)
   
            //return res.json({ code: 200, message: true })

            UserModel.updateMany({email_id:{$in:body.studentEmails}}, 
                {$pull: {courses:{
                    course_id: body.id
                }}}, (error, updatedUser)=>{
                    console.log('user*************************************')
                    if(error){
                        return res.json({ code: 400, message: err });
                    }
                    console.log(updatedUser)
                    CourseModel.deleteOne({ _id: body.id, createdBy: req.session.email }, function (err, deletecourse) {
                        console.log(deletecourse.deletedCount)
                        if (err) {
                            return res.json({ code: 400, message: err });
                        }
                        if (deletecourse.deletedCount > 0) {
                            return res.json({ code: 200, message: 'Course deleted' })
                        } else {
                            return res.json({ code: 404, message: 'No course or unauthorized' })
                        }
                   
                })
        
    })
}

module.exports.deleteCourse = deleteCourse;

const updateCourseData = (students, course, req, res) => {
    console.log('course----------------------------------------------------')
    console.log(course)
    CourseModel.updateOne({_id: course.id, createdBy: req.session.email},
        { $set:
            {   courseNameKey: course.courseNameKey,
                students: students,
                codewordSet: course.codewordSet,
                Startdate: course.Startdate,
                Enddate: course.Enddate,
                PreSurveyURL: course.PreSurveyURL,
                PostSurveyURL: course.PostSurveyURL
            }
        }, (error, updatedCourse)=>{

            if(error){
                return res.json({ code: 400, message: err });
            }
            return res.json({ code: 200, message: 'Course updated successfully' })

    })
}

let updateCourse = (req, res) => {
    uploadFile(req, res, error => {
        if (error instanceof multer.MulterError) {
            // A Multer error occurred when uploading.
        } else if (error) {
            // An unknown error occurred when uploading.
        }
        var body = _.pick(req.body, ['id','courseNameKey',
        'codewordSetName', 'startDate', 'endDate', 'preSurveyURL', 'postSurveyURL']);
     console.log('body--------------------------------------------------------------------/n'+body.courseNameKey)
    //var body = req.
    //    console.log(body)
    CodewordSet.findOne({codewordSetName: body.codewordSetName}, (error, codewordSet)=>{
        if(error){
            return res.json({ code: 400, message: err });
        }
    CourseModel.findOne({_id:body.id}, (error, course)=>{
     console.log('course ENd date'+course.Enddate + course.Startdate)
     if(error){
        return res.json({ code: 400, message: err });
    }
        var courseData = {
            id: body.id,
            courseNameKey: course.courseNameKey,
            students: course.students,
            codewordSet: course.codewordSet,
            Startdate: course.Startdate,
            Enddate: course.Enddate,
            PreSurveyURL: course.PreSurveyURL,
            PostSurveyURL: course.PostSurveyURL
        }

        if(course.courseNameKey != body.courseNameKey){
            courseData.courseNameKey = body.courseNameKey
        }
        console.log('*******course.codewordSet.codewordSetName')
        console.log(course.codewordSet.codewordSetName != body.codewordSetName)
        if(course.codewordSet.codewordSetName != body.codewordSetName){
           
              
                console.log('*********codeword set********')
                console.log(codewordSet)
                if(codewordSet){
                courseData.codewordSet = {
                    codewordSetName: codewordSet.codewordSetName,
                    codewords: codewordSet.codewords
                }
            }else{
                courseData.codewordSet = {
                    codewordSetName: '',
                    codewords: []
                }
            }
            
            
        }
      //  console.log(course.Startdate.toISOString().substring(0,10) +'!='+ body.startDate)
         if(course.Startdate.toISOString().substring(0,10) != body.startDate){
            courseData.Startdate = new Date(body.startDate)
        }
        if(course.Enddate.toISOString().substring(0,10) != body.endDate){
            courseData.Enddate = new Date(body.endDate)
        }

        console.log(course.PreSurveyURL +'!='+ body.preSurveyURL)
        if(course.PreSurveyURL != body.preSurveyURL ){
            courseData.PreSurveyURL = body.preSurveyURL
        }
        if(course.PostSurveyURL != body.postSurveyURL ){
            courseData.PostSurveyURL = body.postSurveyURL
        }
    
        var studentList = req.file;
      //  console.log(studentList)
        if (studentList) {
            var data = studentList.buffer.toString();

            csv({
                noheader: true,
                output: "csv"
            })
                .fromString(data)
                .then((jsonObj) => {
                   // console.log(jsonObj)

                    var students = jsonObj.map((data) => {
                        return {
                            email: data[0],
                            isRevealed: false,
                            codeword: ''
                        }
                    })
                   // console.log(courseData)
                    updateCourseData(students, courseData, req, res)
                })

        } else {
           // console.log(req.body)
           // console.log(courseData)
            updateCourseData(courseData.students,courseData, req, res)
        }
    })
    })
})

}
module.exports.updateCourse = updateCourse;

let assignCourse = (req, res) => {

    var body = _.pick(req.body, ['id', 'studentEmails']);
    CourseModel.updateOne({_id: body.id, createdBy: req.session.email}, 
        {$set:{
            isAssigned: true
        }}, (error, updateCourse) => {
            if(error){
                return res.json({ code: 400, message: err });
            }
            console.log('assigned*************************************')
            return res.json({ code: 200, message: 'Course Assigned' })
        })       

}

module.exports.assignCourse = assignCourse

let getStudentCourses = (req,res) =>{

    CourseModel.find({
        isAssigned: true,
        students: {$elemMatch: {email: req.session.email}}
    }, (error, courses) => {
        if(error){
            return res.json({ code: 400, message: error });
        }
        return res.json({ code: 200, data: courses });
    }
    )
         
}

module.exports.getStudentCourses = getStudentCourses

const revealCodeword = (req, res) => {
    var body = _.pick(req.body,['courseId']);
console.log(body.courseId)

    CourseModel.findOne({_id: body.courseId }, (error, course)=>{
        if(error){
            return res.json({ code: 400, message: e });
        }
        let index = getRandomIntInclusive(0, course.codewordSet.codewords.length-1)
        console.log('index**********')
        console.log(index)
        let codeword = course.codewordSet.codewords[index]
        console.log('codeword:  '+codeword)
        // var bulk = CourseModel.collection.initializeOrderedBulkOp()
        // bulk.find({_id: body.courseId }).updateOne({$pull:{"codewordSet.codewords": codeword}})
        // bulk.find({_id: body.courseId, "students.email":req.session.email }).updateOne(
        //     {$set:
        //         {"students.$.codeword": codeword, 
        //         "students.$.isRevealed": true}
        //     })

        // bulk.execute()
        CourseModel.updateOne({_id: body.courseId },{$pull:{"codewordSet.codewords": codeword}}, (error, updated)=>{
            if(error)
            console.log(error)
            else{
                CourseModel.updateOne({_id: body.courseId, "students.email":req.session.email },
                {$set:
                            {"students.$.codeword": codeword, 
                            "students.$.isRevealed": true
                            }
                        }, (error, updated) =>{

                            if(error){
                                return res.json({ code: 400, message: error });
                            }
                            else{
                            console.log(updated)
                            return res.json({ code: 200, codeword: codeword });  
                            }
                        }
                )
                    }
        })

    })
    
}

module.exports.revealCodeword = revealCodeword

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
  }