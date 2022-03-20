const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  name : {
    type: String,
    maxlength : 50
  },
  email : {
    type: String,
    trim : true, //빈칸 지워줌
    unique : 1 //똑같은 이메일은 쓰지 못하게 unique
  },
  password : {
    type: String,
    minlength : 5
  },
  lastname :  {
    type : String,
    maxlenght : 50,
  },
  role : {
    type : Number,
    default : 0
  },
  image : String,
  token : { //유효성
    type : String
  },
  tokenExp : { //토큰의 유효기간
    type : Number
  }
})

const User = mongoose.model('User', userSchema);

module.exports = {User};