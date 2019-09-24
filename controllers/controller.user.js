
var _ = require('lodash');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var { UserModel } = require('../model/model.user');
var { mongoose } = require('./../config/database')
var mailController = require('../config/user.mail.js')
var XLSX = require('xlsx')


var signUp = (req,res) => {
    console.log('working')
    var body = _.pick(req.body,['firstName','lastName','email','password','instructor']);
    // var gen_token = jwt.sign({email: body.email },'codewordnwmsu',{expiresIn:  1* 300 }).toString();
    // body.token = gen_token;
    var date = new Date()
    console.log("controller signup"+ body.email+" "+body.password+" "+body.instructor);
    bcrypt.genSalt(10, (err,salt) => {
        bcrypt.hash(body.password,salt,(err,hash) => {
            body.password = hash;
            var userModel = new UserModel({
                first_name: body.firstName.trim(),
                last_name: body.lastName.trim(),
                email_id: body.email,
                password: body.password,
                instructor_role_request: body.instructor,
                role: 'student',
                create_at: date.toISOString(),
                updated_at: date.toISOString()
            });
            userModel.save().then((user) => {
                if(user)
                return res.json({ code: 200, message: true});           
            }).catch((e) => {
                console.log(e);
                return res.json({ code: 400, message: e});        
            })
        })
    })
}
module.exports.signUp = signUp;

var signIn = (req,res) => {
    console.log('signIn working')
    var body = _.pick(req.body,['email','password']);
    console.log(body.email+"Controller user signin");
    UserModel.findOne({email_id: body.email}, function (err, User) {
        if(User == null){
            return res.json({ code: 401, message: 'Email id not registered!!'});
        }
        //console.log(User.role+"Instructor status signIn controller user");
        return bcrypt.compare(body.password,User.password,(err,result) => {
            console.log(result)
            if(result){
                var newToken = jwt.sign({email: body.email, id: User.id },'codewordnwmsu',{expiresIn:  10000 * 3000 }).toString();
                console.log(newToken)
                UserModel.updateOne({emailKey: body.email},{$set: {token: newToken}}, (err) =>{
                    if(err){
                        return res.json({ code: 401, message: 'Unable to generate and update Token'});
                    }
                    UserModel.updateOne({email_id: body.email}, 
                        {
                            $set: {
                                last_login: new Date()
                            }
                        }, (err, User)=>{
                        if(err){
                            return res.json({ code: 401, message: 'Something went wrong'});
                        }
                        return res.json({ 
                            code: 200, 
                            message: 'Signed in successfully. Redirecting.', 
                            token: newToken,
                            role: User.role });
                        })
                   
                })
            }else{
                return res.json({ code: 401, message: 'Invalid Password'})
            }
        })
    })
}
module.exports.signIn = signIn;

var details = (req,res) => {    
    console.log('email'+ req.session.id);
    UserModel.findOne({_id: req.session.id}).then((user) => {
    if(!user){
        return  res.status(400).send("User details not found!!");
    }
    console.log('user'+user);        
    return res.send({email_id: user.email_id, 
        name: user.first_name + ' '+ user.last_name, 
        role:user.role,
        instructorRequest: user.instructor_role_request,
        role: user.role
    });
    });
}
module.exports.details = details;

var validateEmail = (req, res) => {
    var body = _.pick(req.body,['email']);
    console.log(body.email+"controller validateEmail");
    UserModel.findOne({ emailKey: body.email}).then((user) => {
        if(!user){
            return res.json({ code: 400, message: false});
        }        
        return new Promise((resolve, err) =>{
                if(resolve){
                    return res.json({ code: 200, message: true});
                }
                if(err){                    
                    return res.json({ code: 200, message: false});
                }
            });
        });
}
module.exports.validateEmail = validateEmail;

var tempPassword = (req, res ) => {
    var body = _.pick(req.body,['email']);
    console.log('Tempa'+ body.email);
    var chars = "abcdefghijklmnopqrstuvwxyz@#$%&*ABCDEFGHIJKLMNOP123456789";
    var temporaryPassword = "";
    for (var x = 0; x < 5; x++) {
        var i = Math.floor(Math.random() * chars.length);
        temporaryPassword += chars.charAt(i);
    }
    bcrypt.genSalt(10, (err,salt) => {
        bcrypt.hash(temporaryPassword,salt,(err,hash) => {
        hashPassword = hash;
        UserModel.updateOne({emailKey: body.email },{$set: {password: hashPassword}}, (err,result) =>{
        if(!res){
            return  res.status(400).send("Error");
        }
        console.log(body.email+"   "+temporaryPassword);
        mailController.sendMail(body.email,temporaryPassword);
        return res.json({ code: 200, message: true});
     });
     });
    });
}
module.exports.tempPassword = tempPassword;

var changePassword = (req,res) => { 
    var body = _.pick(req.body,['password']);
    console.log("change password:"+ req.session.id+" Change Password:"+body.password); 
    var hashPassword="";
    bcrypt.genSalt(10, (err,salt) => {
    bcrypt.hash(body.password,salt,(err,hash) => {
        hashPassword = hash;
    
    UserModel.updateOne({_id: req.session.id },{$set: {password: hashPassword}}, (err,result) =>{
        if(!res){
            return  res.status(400).send("Unable to change Password!!");
        }
        return res.json({ code: 200, message: true});
     });
    });
   });
}
module.exports.changePassword = changePassword;


const sendResetEmail = async (req,res) => {
    try{
        await mailController.sendResetEmail(req.body.username)
        return res.send("success")
    }catch (err) {
        return res.send("failed")
    }
}
module.exports.sendResetEmail = sendResetEmail

const resetPassword = (req, res) => {
   return  res.render(`index`)
}
module.exports.resetPassword = resetPassword

const reset = (req,res) => {
    UserModel.findOne({emailKey: req.session.username}, function (err, userModel) {
        if(err) return res.json({ code: 200, message: 'Email id not registered!!'});
        bcrypt.genSalt(10, (err,salt) => {
            bcrypt.hash(req.body.password,salt,(err,hash) => {
                userModel.password = hash
                userModel.save().then((user) => {
                    if(user) return res.json({ code: 200, message: true});           
                }).catch((e) => {
                    return res.json({ code: 400, message: e});        
                })
            })
        })
    })
}
module.exports.reset = reset


const checkUsers = (req,res) =>{
    var body = _.pick(req.body,['studentEmails']);
    console.log('***********DATA************')
    console.log(body.studentEmails)
    

}

module.exports.checkUsers = checkUsers

var instructorRequest = (req,res) =>{
   // var body = _.pick(req.body,['studentEmails']);
   console.log('working request')
   console.log(req.session.id)
   UserModel.updateOne({_id: req.session.id}, 
    {
        $set:{
            instructor_role_request: true
        }
    }
    ,(error, user)=>{

        if(error){
            console.log(error)
            return  res.status(400).send("Error");
        }
        return res.json({ code: 200, message: true});
   })
    

}

module.exports.instructorRequest = instructorRequest


var requests = (req,res) =>{
   
    console.log(req.session.id)
    UserModel.findOne({_id: req.session.id}
     ,(error, user)=>{
 
         if(error){
             return  res.status(400).send("Error");
         }
         if(user.role != 'admin'){
         return res.json({ code: 400, message: 'Unauthorized'});
         }
         UserModel.find({instructor_role_request: true, role: 'student'}, (error, users)=>{
             if(error){
                return  res.status(400).send("Error");
             }
             //console.log(users
             var data = users.map((user)=>{
                 return {
                            id: user._id,
                            name: user.first_name + ' ' + user.last_name,
                            email: user.email_id,

                        }

             })
             return res.json({ code: 200, data:data, message: true});
         })
    })
     
 
 }
 
 module.exports.requests = requests

 var acceptRequest = (req,res) =>{
   
    var body = _.pick(req.body,['id']);
    console.log(req.session.id)
    UserModel.findOne({_id: req.session.id}
     ,(error, user)=>{
 
         if(error){
             return  res.status(400).send("Error");
         }
         if(user.role != 'admin'){
         return res.json({ code: 400, message: 'Unauthorized'});
         }
         UserModel.updateOne({_id: body.id}, 
            {
                $set:{
                    role: 'instructor',
                    instructor_role_request: false
                }
            }
            ,(error, users)=>{
             if(error){
                return  res.status(400).send("Error");
             }
             //console.log(users
             return res.json({ code: 200, message: true});
         })
    })
 }
 
 module.exports.acceptRequest = acceptRequest

 var declineRequest = (req,res) =>{
   
    var body = _.pick(req.body,['id']);
    console.log(req.session.id)
    UserModel.findOne({_id: req.session.id}
     ,(error, user)=>{
 
         if(error){
             return  res.status(400).send("Error");
         }
         if(user.role != 'admin'){
         return res.json({ code: 400, message: 'Unauthorized'});
         }
         UserModel.updateOne({_id: body.id}, 
            {
                $set:{
                    instructor_role_request: false
                }
            }
            ,(error, users)=>{
             if(error){
                return  res.status(400).send("Error");
             }
             //console.log(users)
            
             return res.json({ code: 200,  message: true});
         })
    })
 }
 
 module.exports.declineRequest = declineRequest

 var getAllUsers = (req, res) =>{

    UserModel.findOne({email_id: req.session.email}, (error, user)=>{
        if(error){
            return res.json({ code: 400, message: 'Something went wrong'});
        }
        if(user.role === 'admin'){
            UserModel.find({role:{$in:['student', 'instructor']}}, (error, users)=>{
                if(error){
                    return res.json({ code: 400, message: 'Something went wrong'});
                }
                return res.json({ code: 200, data:users});
            })
        }
        else{
            return res.json({ code: 400, message: 'Unauthorized'});
        }
    })
 }

 module.exports.getAllUsers = getAllUsers

 var deleteUser = (req, res) =>{
    var body = _.pick(req.body, ['id'])
    console.log(body)
    UserModel.findOne({email_id: req.session.email}, (error, user)=>{
        if(error){
            return res.json({ code: 400, message: 'Something went wrong'});
        }
        if(user.role === 'admin'){
            UserModel.deleteOne({_id: body.id}, (error, deletedUsers)=>{
                if(error){
                    return res.json({ code: 400, message: 'Something went wrong'});
                }
                return res.json({ code: 200, message: 'User deleted successfully'});
            })
        }
        else{
            return res.json({ code: 400, message: 'Unauthorized'});
        }
    })
 }

 module.exports.deleteUser = deleteUser