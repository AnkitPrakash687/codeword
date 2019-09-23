var mongoose = require('mongoose');
mongoose.connect('mongodb+srv://admin:admin@codeword01-u3krm.mongodb.net/test?retryWrites=true&w=majority')
.then(() => {
    console.log('DB Connected ');
}, err => {
    console.log(err);
});
