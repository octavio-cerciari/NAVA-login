const mongoose = require("mongoose")
mongoose.pluralize(null);

const schema = mongoose.Schema({
    name: 'String',
    email: 'String',
    password: 'String',
}, {timestamps:true})

const Post = mongoose.model('User',schema);
module.exports=Post;

