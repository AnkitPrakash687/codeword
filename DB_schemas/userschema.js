var mongoose = require("mongoose");
var uniqueValidator = require('mongoose-unique-validator');

var userschema = new mongoose.Schema({
    emailID: { type: String,unique: true, required: true },
    passwd:String,
    isInstructor:Boolean

});
 userschema.plugin(uniqueValidator);
module.exports.userschema=userschema;