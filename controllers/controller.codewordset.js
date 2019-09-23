const _ = require('lodash');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var Codewordset = require('../model/model.codewordset');
var {UserModel} = require('../model/model.user')
var { mongoose } = require('./../config/database')
var mailController = require('../config/user.mail.js')
let xlsx2json = require('xlsx2json'); // added by Ujjawal Kumar
multer = require('multer')
const stringSimilarity = require('string-similarity')
const anagramFinder = require('anagram-finder')

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './data')
    },
    filename: function (req, file, cb) {
        cb(null, 'test.xlsx')
    }
})


let addcodewordset = (req, res) => {
    
    var body = _.pick(req.body,['codewordSetName', 'codewords']);
    console.log(req.body)
    var codewordset = new Codewordset({
        codewordSetName: body.codewordSetName,
        createdBy: req.session.email,
        codewords: body.codewords
    });
    codewordset.save().then((codes) => {
        return res.json({ code: 200, data: codes });
    }).catch((e) => {
        console.log(e);
        return res.json({ code: 400, message: e });
    })
}
module.exports.addcodewordset = addcodewordset;

let upadatecodewordset = (req, res) => {
    
    var body = _.pick(req.body,['id','oldCodewordSetName','newCodewordSetName', 'codewords']);
  
    console.log(req.body)
    console.log('**********update codewordset*******')
    console.log(body)
    if(body.codewords.length == 0){

        Codewordset.findOne({'codewordSetName':body.newCodewordSetName}, (error, codewordSet) =>{
            if(codewordSet){
                return res.json({ code: 404, message: 'Codeword set exists' });
            }else{
                Codewordset.updateOne({'codewordSetName':body.oldCodewordSetName},
                    {$set:{
                        codewordSetName: body.newCodewordSetName
                    }
                }, (error, updatedCodewordSet)=>{
                    if(error){

                        return res.json({ code: 400, message: e });
                    }
                    console.log(updatedCodewordSet)
                    return res.json({ code: 200, message: 'Codeword set updated' });
                }) 
            }
        }
        )
          
    }else{
        Codewordset.updateOne({'codewordSetName':body.oldCodewordSetName},
            {$set:{
                codewordSetName: body.newCodewordSetName,
                codewords: body.codewords
            }
        }, (error, updatedCodewordSet)=>{
            if(error){
                return res.json({ code: 400, message: e });
            }
            console.log(updatedCodewordSet)
            return res.json({ code: 200, message: 'Codeword set updated' });
        }) 
    }
 
}
module.exports.upadatecodewordset = upadatecodewordset;

let getcodewordset = (req, res) => {
    //console.log('get codewords')

    UserModel.find({role: 'admin', email_id:{$ne: req.session.email}}, (error,users)=>{
        if(!error){
          let usersEmail = users.map((item)=>{
               return item.email_id 
            })
           
            Codewordset.find({ createdBy: {$in: usersEmail}, isPublished:true} )
            .then((codewordSet) => {

                var data = []
                if (codewordSet.length > 0){
                   
                    for(var i in codewordSet){
                    console.log(codewordSet[i])
                    data.push({
                        id: codewordSet[i]._id,
                        codewordSetName: codewordSet[i].codewordSetName,
                        count: codewordSet[i].codewords.length,
                        codewords: codewordSet[i].codewords,
                        isPublished: codewordSet[i].isPublished
                    })
                }
                }
                Codewordset.find({createdBy: req.session.email}).then((codewordSet)=>{
                    if (codewordSet.length > 0){
                        for(var i in codewordSet){
                        console.log(codewordSet[i])
                        data.push({
                            id: codewordSet[i]._id,
                            codewordSetName: codewordSet[i].codewordSetName,
                            count: codewordSet[i].codewords.length,
                            codewords: codewordSet[i].codewords,
                            isPublished: codewordSet[i].isPublished
                        })
                    }
                    // console.log('**********get codeword sets')
                    // console.log(data)
                    return res.json({ code: 200, data:data, message: true });
                }

                }).catch((e) => {
                    console.log(e);
                    return res.json({ code: 400, message: e });
                })

               
            }).catch((e) => {
                console.log(e);
                return res.json({ code: 400, message: e });
            })
        }
    })

}
module.exports.getcodewordset = getcodewordset;

let getacodewordset = (req, res) => {
    console.log('get codewords')

   
            Codewordset.findOne({ _id: req.params.id} )
            .then((codewordSet) => {
        
                if (codewordSet){
                    var data = []
                   
                    var data = {
                        codewordSetName: codewordSet.codewordSetName,
                        count: codewordSet.codewords.length,
                        codewords: codewordSet.codewords,
                        isPublished: codewordSet.isPublished
                    }
                
                return res.json({ code: 200, data:data });
                }
                return res.json({ code: 404, message: 'not found' });
            }).catch((e) => {
               // console.log(e);
                return res.json({ code: 400, message: e });
            })
     

}
module.exports.getacodewordset = getacodewordset;


let addcodeword = (req, res) => {
   console.log('************add code word**************')
    var body = _.pick(req.body,['id','codeword']);
    console.log(body)

    Codewordset.findOne({_id: body.id}, (error, codewordset)=>{
        if(!error){
           var newCodeword = codewordset.codewords
           newCodeword.push(body.codeword)
           Codewordset.updateOne({_id: body.id}, {
               $set:{
                   codewords: newCodeword
               }
              
           }, (error, updatedCodewordSet) => {
                  if(!error){
                      console.log(updatedCodewordSet)
                      return res.json({ code: 200, message: 'Codeword added' });
                  } 

                  return res.json({ code: 400, message: error });
        })
        }
    })
 
 }
 module.exports.addcodeword = addcodeword;

 let updatecodeword = (req, res) => {
    console.log('************update code word**************')
     var body = _.pick(req.body,['id','newCodeword', 'oldCodeword']);
     console.log(body)
 
     Codewordset.findOne({_id: body.id}, (error, codewordset)=>{
         if(!error){
            var newCodewords = codewordset.codewords.filter((item)=>{
                if(item != body.oldCodeword){
                    return item
                }
            })
            newCodewords.push(body.newCodeword)
            Codewordset.updateOne({_id: body.id}, {
                $set:{
                    codewords: newCodewords
                }
               
            }, (error, updatedCodewordSet) => {
                   if(!error){
                       console.log(updatedCodewordSet)
                       return res.json({ code: 200, message: 'Codeword updated' });
                   } 
 
                   return res.json({ code: 400, message: error });
         })
         }
     })
  
  }
  module.exports.updatecodeword = updatecodeword;


  let deletecodeword = (req, res) => {
    console.log('************delete code word**************')
     var body = _.pick(req.body,['id','codeword']);
     console.log(body)
 
     Codewordset.findOne({_id: body.id}, (error, codewordset)=>{
         if(!error){
            // var newCodeword = codewordset.codewords
            // newCodeword.push(body.codeword)
            Codewordset.updateOne({_id: body.id}, {
                $pull:{
                    codewords: body.codeword
                }
               
            }, (error, updatedCodewordSet) => {
                   if(!error){
                       console.log(updatedCodewordSet)
                       return res.json({ code: 200, message: 'Codeword deleted' });
                   } 
 
                   return res.json({ code: 400, message: error });
         })
         }
     })
  
  }
  module.exports.deletecodeword = deletecodeword;

  let generateReport = (req, res) =>{

    var body = _.pick(req.body,['id','level']);
    console.log('********LEVEL**********')
    console.log(body.level)
    var similarityLevel
    switch(body.level){
        case 0:
            similarityLevel = 0.3
            break;
        case 1:
            similarityLevel = 0.5
            break;
        case 2:
            similarityLevel = 0.7
            break;
        case 3:
            similarityLevel = 0.8
            break;
        case 4:
            similarityLevel = 0.9
            break;
        default:
            similarityLevel = 0.5
    }
    console.log(similarityLevel)
    Codewordset.findOne({_id: body.id}, (error, codewordset)=>{
        if(error){
            return res.json({ code: 400, message: error });
        }

        var codewords = codewordset.codewords
        var result = []
        //console.log(codewords)
        for(var i in codewords){
            var targetCodewords = codewords.filter((item, index)=>{
                if(index != i){
                    return item
                }
            })

            result.push({word: codewords[i], similarity: stringSimilarity.findBestMatch(codewords[i], targetCodewords)})
        }

        var similars = []
        var checkerArray = []
       for(var i in result){

        if(!checker(checkerArray, result[i].word)){
          // console.log(result[i])
           var ratings = result[i].similarity.ratings
           var output = []
           output.push(result[i].word)
           for(var i in ratings){
                if(ratings[i].rating > similarityLevel){
                    output.push(ratings[i].target)
                    checkerArray.push(ratings[i].target)
                    }
                }
           }
           
           similars.push(output)
        
       }
       let final = similars.filter((item)=>{
           if(item.length > 1){
               return item
           }
       })
      // console.log(Array.from(new Set(final.map(JSON.stringify)), JSON.parse))
     
      
     var anagrams = anagramFinder.find(codewords).filter((item)=>{
         if(item.length > 1){
             return item
         }
     })

     var data ={similars: Array.from(new Set(final.map(JSON.stringify)), JSON.parse),
                anagrams: anagrams}
    // console.log('************ANAGRAMS******************')
     //console.log(anagrams)
      return res.json({ code: 200, data: data });
    })
  }

  module.exports.generateReport = generateReport


const publishCodeworset = (req, res) =>{
    var body = _.pick(req.body,['id'])
    //console.log(body.id)
    Codewordset.updateOne({_id:body.id}, 
       { 
           $set:{
                    "isPublished": true

                }
        },
        (error, updatedCodewordSet)=>{
        if(error){

            return res.json({ code: 400, message: error });
        }

        return res.json({ code: 200, message: 'Codeword set finalized' });
    }
    )
}
module.exports.publishCodeworset = publishCodeworset

const deleteCodewordset = (req, res) =>{
    var body = _.pick(req.body,['id'])
    console.log('*************delete codewordset**********')
    console.log(body.id)
    Codewordset.findOne({_id:body.id}, (error, codewordset)=>{

        if(codewordset.createdBy != req.session.email){
            return res.json({ code: 400, message: 'Cannot delete admin codeword set' });
        }
        Codewordset.deleteOne({_id:body.id}, 
            (error, deletedCodewordSet)=>{
            if(error){
    
                return res.json({ code: 400, message: error });
            }
    
            return res.json({ code: 200, message: 'Codeword set deleted' });
        }
        )
    })
   
}
module.exports.deleteCodewordset = deleteCodewordset

const checker = (checkerArray, str) =>{
    for(var i in checkerArray){
        if(checkerArray[i] == str){
            return true
        }
    }
    return false
}
