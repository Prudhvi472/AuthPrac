const mongoose = require('mongoose')

const dbConnect = (uri) =>{
    mongoose.connect(uri)
};

module.exports = dbConnect;