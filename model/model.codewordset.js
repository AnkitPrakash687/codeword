var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var codeWordSetSchema = new Schema({
        codewordSetName: {
                type: String,
                require: true,
                unique:true
        },
        createdBy: {
                     type: String, 
                     require: true
                },
        codewords:[
                {type: String,
                 unique: true,
                 min: 3       
                }
        ],
        isPublished:{type: Boolean, default: false}
});

// create the model for users and expose it to our app
module.exports = mongoose.model('CodeWordSet', codeWordSetSchema);

