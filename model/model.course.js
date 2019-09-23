
var mongoose = require('mongoose');
var validator = require('validator');

var CourseModel = mongoose.model('courseModel', {
    courseNameKey: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    index:true
   },
   createdBy:{type: String},
   students:[
      {
      name: {type: String},
      email:{type:String, unique:true},
      isRevealed:{type: Boolean},
      codeword:{type: String}
      }
   ],
   codewordSet:{
      codewordSetName:{type:String},
      codewords:[
         {type: String, min:3}
      ]
   },
   isAssigned:{
      type:Boolean
   },
   Startdate: {
    type: Date
   },
   Enddate: {
    type: Date
   },
   PreSurveyURL: {
    type: String
   },
   PostSurveyURL: {
    type: String
   }
});
module.exports.CourseModel = CourseModel
