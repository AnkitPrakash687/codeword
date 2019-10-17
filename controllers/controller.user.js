
var _ = require('lodash');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var { UserModel } = require('../model/model.user');
var mailController = require('../config/user.mail.js')
const crypto = require('crypto');
require('dotenv').config();
const nodemailer = require('nodemailer');
const fs = require('fs')
var handlebars = require('handlebars');
var readHTMLFile = function(path, callback) {
    fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
        if (err) {
            throw err;
            callback(err);
        }
        else {
            callback(null, html);
        }
    });
};
const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
            user: 'codeword.group03@gmail.com',
            pass: 'Aug@2019'
         }
});

var signUp = (req,res) => {
    console.log('working')
    var body = _.pick(req.body,['firstName','lastName','email','password','instructor']);
    // var gen_token = jwt.sign({email: body.email },'codewordnwmsu',{expiresIn:  1* 300 }).toString();
    // body.token = gen_token;
    var date = new Date()
    console.log("controller signup"+ body.email+" "+body.password+" "+body.instructor);
    const token = crypto.randomBytes(20).toString('hex'); 
    console.log(token)
    console.log(token);
    bcrypt.genSalt(10, (err,salt) => {
        bcrypt.hash(body.password,salt,(err,hash) => {
            body.password = hash;
            var userModel = new UserModel({
                first_name: body.firstName.trim(),
                last_name: body.lastName.trim(),
                email_id: body.email.toLowerCase(),
                password: body.password,
                emailVerificationToken: token,
                instructor_role_request: body.instructor,
                role: 'student',
                create_at: date.toISOString(),
                updated_at: date.toISOString()
            });
            userModel.save().then((user) => {
                if(user){

                    readHTMLFile(__dirname + '/resetPassword.html', function(err, html) {

                        console.log( __dirname+'/images/forget_password.png')
                        var template = handlebars.compile(html);
                        var replacements = {
                            username: user.first_name + ' ' + user.last_name,
                            image1: 'https://i.ibb.co/HF4ZQBF/codeword-favi.png',
                            url:'https://codeword-group03.herokuapp.com/verifyEmail/'+token,
                            type: 'Verify Email',
                            message1: 'There\'s just one more step before you get to the fun part.',
                            message2: 'Please verify that we have the right email address by clicking on the link below:'
                       };
                    const transporter = nodemailer.createTransport({
                        service: 'gmail', 
                        auth: {
                                user: 'codeword.group03@gmail.com',
                                pass: 'Aug@2019'
                             }
                    });

                const mailoptions = {
                    from: 'codeword.group03@gmail.com', 
                    to: body.email, 
                    subject: "Codeword email verification", 
                    text:'Hi, \n\n'+
                        'You are receiving this because you(or someone else) have requested the reset'+ 
                        'of the password for your account.\n\nPlease click on the following link,'+
                        'or paste this into your browser to complete the process within one hour of' +
                        ' receiving it:\n\n' + 'https://codeword-group03.herokuapp.com/resetPassword/'+token+'\n\n' + 
                        'If you did not request this, please ignore this email and your password will remain unchanged.\n\n'+
                        'Thank you!\n'+
                        'Team codeword group03',
                    html: template(replacements)
                }
            console.log('sending mail')

                    transporter.sendMail(mailoptions, function (err, response) {
                        if (err) {
                            res.json({code: 400, message:err});
                        } 
                })
            })

                    var newToken = jwt.sign({email: body.email, id: user.id },'codewordnwmsu',{expiresIn:  10000 * 3000 }).toString();
                    console.log(newToken)
                    UserModel.updateOne({emailKey: body.email},
                        {
                            $set: 
                            {
                                token: newToken,
                                last_login: new Date()

                            }}, (err) =>{
                        if(err){
                            return res.json({ code: 401, message: 'Unable to generate and update Token'});
                        }
                    
                            return res.json({ 
                                code: 200, 
                                message: 'Signed up successfully. Please verify your email before signing in', 
                                token: newToken,
                                role: user.role });
                            })
                }
                
                          
            }).catch((e) => {
                console.log(e);
                return res.json({ code: 400, message: e});        
            })
        })
    })
}
module.exports.signUp = signUp;

const verifyEmail = (req, res) => {
   console.log('working email verify')
    let body = _.pick(req.body, ['token', 'password'])
    console.log(body.token)
    UserModel.findOne({emailVerificationToken: body.token},
       (error, user)=>{
          if(error){
              res.json({code: 400, message:'Something went wrong'})
          }
          console.log(user)
        if(user){

          UserModel.updateOne({emailVerificationToken: body.token}, 
            {
                $set: {
                    emailVerificationToken: null,
                    isEmailVerified: true
                }
            }, (err, User)=>{
                if(err){
                    res.json({code: 400, message:'Something went wrong'})
                }
                res.json({code: 200, message:'Email Verified'})

            })
        }else{
            res.json({code: 400, message:'invalid code'})
        }

        }
    )
       
   
}

module.exports.verifyEmail = verifyEmail

var signIn = (req,res) => {
    console.log('signIn working')
    var body = _.pick(req.body,['email','password']);
    console.log(body.email+"Controller user signin");
    var email = body.email.toLowerCase()
    UserModel.findOne({email_id: email}, function (err, User) {
        if(User == null){
            return res.json({ code: 401, message: 'Invalid Email or Password'});
        }
        //console.log(User.role+"Instructor status signIn controller user");
        return bcrypt.compare(body.password,User.password,(err,result) => {
            console.log(result)
            if(result){

                if(!User.isEmailVerified){
                    return res.json({ code: 401, message: 'Verify the email before signing in'})
                }
                var newToken = jwt.sign({email: email, id: User.id },'codewordnwmsu',{expiresIn:  10000 * 3000 }).toString();
                console.log(newToken)
                UserModel.updateOne({emailKey: email},{$set: {token: newToken}}, (err) =>{
                    if(err){
                        return res.json({ code: 401, message: 'Unable to generate and update Token'});
                    }
                    UserModel.updateOne({email_id: email}, 
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
                            firstName: User.first_name,
                            lastName: User.last_name,
                            role: User.role });
                        })
                   
                })
            }else{
                return res.json({ code: 401, message: 'Invalid Email or Password'})
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
        firstName: user.first_name,
        lastName: user.last_name, 
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
    //var body = _.pick(req.body,['email']);
    console.log('***********DATA************')
    UserModel.find({role: {$in: ['student', 'instructor']}}, (error, users)=>{
        if(error){
            return res.json({ code: 400, message: error}); 
        }
        console.log('***********Check Users*********')
        if(users){
            var data = users.map((item)=>{
                return item.email_id
            })
            return res.json({ code: 200, data, message: 'User available'});
        }
        return res.json({ code: 400, message: 'User not present'}); 
    })

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


 const forgotPassword = (req, res) => {
   
    if (req.body.email == "") {
        res.json('email required');
    }

    const body = _.pick(req.body, ['email'])
    console.log(body)
    UserModel.findOne({email_id: body.email.toLowerCase()}, (error, user)=>{
        if(error){
            res.json({code: 400, message:'Some went wrong'});
        }

        if(user){

            const token = crypto.randomBytes(20).toString('hex'); 
            console.log(token); 
            UserModel.updateOne({email_id: body.email},
                {$set: { 
                        resetPasswordToken: token,
                        resetPasswordExpires: Date.now() + 360000
                        }
                }, (error, updatedUser) =>{
                    if(error){
                        res.json({code: 400, message:'Something went wrong'});
                    }
                    readHTMLFile(__dirname + '/resetPassword.html', function(err, html) {

                        console.log( __dirname+'/images/forget_password.png')
                        var template = handlebars.compile(html);
                        var replacements = {
                            username: user.first_name + ' ' + user.last_name,
                            image1: 'https://i.ibb.co/HF4ZQBF/codeword-favi.png',
                            url:'https://codeword-group03.herokuapp.com/resetPassword/'+token,
                            type: 'Reset Password',
                            message1: 'There was a request to change your password!',
                            message2: 'If did not make this request, just ignore this email. Otherwise, please click the button below to change your password:'
                       };
                    const transporter = nodemailer.createTransport({
                        service: 'gmail', 
                        auth: {
                                user: 'codeword.group03@gmail.com',
                                pass: 'Aug@2019'
                             }
                    });

                const mailoptions = {
                    from: 'codeword.group03@gmail.com', 
                    to: body.email, 
                    subject: "Link To Reset Password", 
                    text:'Hi, \n\n'+
                        'You are receiving this because you(or someone else) have requested the reset'+ 
                        'of the password for your account.\n\nPlease click on the following link,'+
                        'or paste this into your browser to complete the process within one hour of' +
                        ' receiving it:\n\n' + 'https://codeword-group03.herokuapp.com/resetPassword/'+token+'\n\n' + 
                        'If you did not request this, please ignore this email and your password will remain unchanged.\n\n'+
                        'Thank you!\n'+
                        'Team codeword group03',
                    html: template(replacements)
                }
            console.log('sending mail')

                    transporter.sendMail(mailoptions, function (err, response) {
                        if (err) {
                            res.json({code: 400, message:err});
                        } else {
            
                            res.json({code: 200, message:'Recovery email sent'});
                        }
                })
            })
            })

        }else{
        res.json({code: 404, message:'User is not registered'});
        }
        
    })

}

module.exports.forgotPassword = forgotPassword


const resetPassword = (req, res) =>{
    let body = _.pick(req.body, ['resetToken', 'password'])
    bcrypt.genSalt(10, (err,salt) => {
        bcrypt.hash(body.password,salt,(err,hash) => {
            
            if(err){
                res.json({code: 400, message:'Something went wrong'})
            }

            UserModel.findOne({resetPasswordToken: body.resetToken, 
              resetPasswordExpires: {$gt: Date.now()}},
             (error, user)=>{
                if(error){
                    res.json({code: 400, message:'Something went wrong'})
                }

              
                if(!user){
                    res.json({code: 404, message:'This link is not valid or has already expired.'})
                }
               
               bcrypt.compare(body.password, user.password, (err, match)=>{

                console.log(match)
                if(!match){
                    UserModel.findOneAndUpdate({
                        resetPasswordToken: body.resetToken,
                        resetPasswordExpires: {$gt: Date.now()}
                    }, 
                    {
                        $set:{
                            resetPasswordToken: null,
                            resetPasswordExpires:null,
                            password: hash
                        }
                    },
                     (error, user)=>{
                    if(error){
                        res.json({code: 400, message:'Something went wrong'})
                    }
                    if(user){
                        res.json({code: 200, message:'Password Reset successfully. You can now login.'})
                    }else{
                        res.json({code: 404, message:'This link is not valid or has already expired.'})
                    }
                })
                }else{
                    res.json({code: 404, message:'Cannot used previous passwords'})
                }

               })
                    

                

            })
         

        })
    })
   
}

module.exports.resetPassword = resetPassword