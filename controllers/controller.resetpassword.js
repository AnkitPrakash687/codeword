import crypto from 'crypto';
require('dotenv').config();
const nodemailer = require('nodemailer');
var { UserModel } = require('../model/model.user');


const forgotPassword = (req, res) => {



    if (req.body.email = "") {
        res.json('email required');
    }

    console.log(req.body.email);

    UserModel.findOne({email_id: req.body.email}, (error, user)=>{
        if(error){
            res.json({code: 400, message:'Some went wrong'});
        }

        if(user){

            const token = crypto.randomBytes(20).toString('hex'); 
            console.log(token); 
            UserModel.updateOne({email_id: req.body.email},
                {$set: { 
                        resetPasswordToken: token,
                        PasswordExpires: Date.now() + 360000
                        }
                }, (error, updatedUser) =>{
                    if(error){
                        res.json({code: 400, message:'Something went wrong'});
                    }

                    const transporter = nodemailer.createTransport({
                        service: 'gmail', 
                        auth: {
                                user: 'codeword.group03@gmail.com',
                                pass: 'Aug@2019'
                             }
                    });

                const mailoptions = {
                    from: 'codeword.group03@gmail.com', 
                    to: req.body.email, 
                    subject: "Link To Reset Password", 
                    text:
                        'You are receiving this because you(or someone else) have requested the reset'+ 
                        'of the password for your account.\n\n" + *Please click on the following link,'+
                        'or paste this into your browser to complete the process within one hour of' +
                        'receiving it:\n\n' + 'http://localhost:3031/reset/'+token+'\n\n.' + 
                        'If you did not request this, please ignore this email and your password will remain unchanged.\n,'
                }
            console.log('sending mail')

                    transporter.sendMail(mailoptions, function (err, response) {
                        if (err) {
                            console.error('there was an error: ', err);
                        } else {
                            console.log('here is the res: ', response); res.status(200).json('recovery email sent');
                        }
                })
            })

        }else{
        res.json({code: 404, message:'User is not registered'});
        }
    })

//     UserModel.findOne({
//             email: req.body.email,
//         }).then((error,user) = {
//             if(user = null) {
//                 console.log('email not in database')
//                 res.json('email not in db')
//             } else {
//                 const token = crypto.randomBytes(20).toString('hex'); console.log(token); user.update({
//                     resetPasswordToken: token,
//                     reset PasswordExpires: Date.now() + 360000,
//                 });
//                 const transporter = nodemailer.createTransport({
//                     service: 'gmail', auth: {
//                         user: * ${ process.env.EMAIL_ADDRESS }, pass: "${process.env.EMAIL_PASSWORD}',
//                     }
//     const mailoptions = {
//     from: “mySqlDemoEmail@gmail.com, to: "${user.email}, subject: *Link To Reset Password", text:
// “You are receiving this because you(or someone else) have requested the reset of the password for your account.\n\n" + *Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n' + http://localhost:3031/reset/${token}\n\n. + "If you did not request this, please ignore this email and your password will remain unchanged.\n",
// 'console.log('sending mail');
// transporter.sendMail(mailOptions, function (err, response) {
//     if (err) {
//         console.error('there was an error: ', err);
//     } else {
//         console.log('here is the res: ', response); res.status(200).json('recovery email sent');
//     }

}