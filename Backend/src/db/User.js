const moongose = require('mongoose')

const UserSchema = moongose.Schema({
    user: {
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
})


module.exports = moongose.model('User',UserSchema);