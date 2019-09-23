/**
 * @author Ujjawal Kumar <S530473@nwmissouri.edu>
 */
var jwt = require('jsonwebtoken');
const _ = require('lodash');

var tokencheck = (req,res,next) => {
   // console.log("Token check")
    var token = req.header('token') || req.body.token || req.query.token ;
   // console.log(token+" token")
    //console.log(jwt.)
    if(token)
    {
     jwt.verify(token, 'codewordnwmsu', (err, decoded) =>{
        if(err)
        {
          
          return res.status(400).json({message: 'Unauthorized User.' });
        }
        console.log('*********authorized*************')
        console.log(decoded)
        req.session = decoded
      //  console.log("_id:"+ req.session.id);
      //  console.log("email:"+req.session.email);
        next();
     });
    } else{
      console.log('*********invalid*************')
      res.status(400)
        .json({message: "Invalid auth token provided."})
      }
  };
        
module.exports = {tokencheck};