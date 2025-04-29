const {default: mongoose} = require("mongoose");

const schema = new mongoose.Schema({
  title:{
    type: String,
    required: true
  },
  content:{
    type: String,
    required: true
  },
  author: {
    type: String,
    default: "admin"
  },
  isPublished:{
    type:Boolean,
    default:false
  }
}, {
  timestamps:true
})

exports.BooksModel = mongoose.model("book",schema);