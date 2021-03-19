let  mongoose = require('mongoose');
let  Schema = mongoose.Schema;
let userSchema = new Schema(
    {
        _id:{type:String},
        username:{type:String},
        room:{type:String},
        url:{type:String}
    }
)

module.exports = mongoose.model('User',userSchema);