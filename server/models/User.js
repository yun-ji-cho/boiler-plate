const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10 //salt 가 몇 글자인지 나타냄
const jwt = require('jsonwebtoken');

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

userSchema.pre('save', function(next){
  var user = this;

  if(user.isModified('password')){
    //비밀번호를 암호화 시킨다.
    //salt 를 만들때 saltRounds가 필요하다.
    bcrypt.genSalt(saltRounds, function(err, salt){
      if(err) return next(err)
      
      bcrypt.hash(user.password ,salt, function(err, hash){
        if(err) return next(err)
        user.password = hash //비밀번호 암호화 완성
        next();
      })
    })
  } else{ //비밀번호를 바꿀때가 아니여도 next() 를 넣어줘야 index.js 해당부분으로 넘어갈수 있으므로 넣어준다.
    next();
  }
});
//comparePassword 메소드 만들기
userSchema.methods.comparePassword = function(plainPassword, cb){
  //비밀번호 비교
  //plainPassword 1234567, 
  //암호화된 비밀번호 : $2b$10$nWJpscm8tT99ObEbcfSVwO7YQCm6NXXVQcc79Yg2VFvBzYDwvuSxm

  //암호화된 것을 복호화(비밀번호원상태로돌리기) 할수 없기 때문에 순수한 비밀번호를 암호화 한 다음 비교해야 한다.

  bcrypt.compare(plainPassword, this.password, function(err, isMatch){
    if(err) return cb(err),
    cb(null, isMathc)
  })
}

userSchema.methods.generateToken = function(cb){
  var user = this;
  //jsonwebtoken 을 이용해서 token 을 생성하기
  var token = jwt.sign(user._id.toHexString(), 'secretToken')

  user.token = token
  user.save(function(err, user){
    if(err) return cb(err)
    cb(null, user)
  })

  // user._id + 'secretToken' = token
}

userSchema.statics.findByToken = function(token, cb){
  var user = this;
  
  //토큰을 decode 한다.
  jwt.verify(token, 'secretToken', function(err, decoded){
    //유저 아이디를 이용해서 유저를 찾은 다음에
    //클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인

    user.findOne({"_id" : decoded, "token" : token}, function(err, user){
      if(err) return cb(err);
      cb(null, user)
    })
  })
}

const User = mongoose.model('User', userSchema);

module.exports = {User};