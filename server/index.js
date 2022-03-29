const express = require('express') //익스프레스 모듈을 가져온다
const app = express() //
const port = 5000
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const config = require('./config/key');
const auth = require('./middleware/auth');
const { User } = require('./models/User');


//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended : true})); //bodyParser 는 클라이언트에서 오는 정보를 서버에서 분석해서 가져올 수 있게 한다.
//application/json json 타입으로 된것을 분석해서 가져올 수 있게.
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require('mongoose');
mongoose.connect(config.mongoURI, {}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

app.get('/', (req, res) => res.send('Hello World!~~~~~'))

//회원가입을 위한 라우트
app.post('/api/users/register', (req, res) => {
  //회원가입 할 때 필요한 정보들을 client 에서 가져오면
  // 그것들을 데이터 베이스에 넣어준다.
    const user = new User(req.body) //req.body 에 들어올 수 있도록 해주는 것이 bodyParser가 있어서 그렇다. 이것이 클라이언트의 정보를 받아준다.
    user.save((err, userInfo) => { //save 는 몽고 디비의 메서드
      if(err) return res.json({success : false, err}) //에러는 제이슨 형식으로 전달, err  메세지도 함께 전달
      return res.status(200).json({
        success : true
      })
    })
})

//로그인 라우트
app.post('/api/users/login', (req, res) => {
  console.log(req);
  User.findOne({ email : req.body.email}, (err, user) => { //findeOne :몽고디비에서 제공하는 메서드(첫번째 요소를 찾는다)
    if(!user) {
      return res.json({
        loginSuccess : false,
        message : "제공된 이메일에 해당하는 유저가 없습니다."
      })
    }

    user.comparePassword(req.body.password, (err, isMatch) => {
      if(!isMatch)
      return res.json({loginSuccess:false, message : '비밀번호 틀렸습니다.'})

      //비밀번호까지 맞다면 토큰을 생성하기
      user.generateToken((err, user) => {
        // var jwt = require('jsonwebtoken');
        // var token = jwt.sign({ foo: 'bar' }, 'shhhhh');
        if(err) return res.status(400).send(err);

        //토큰을 저장한다. 어디에? 쿠키, 로컬스토리지, 세션 등등
        //쿠키에 저장하자!
        res.cookie("x_auth", user.token)
          .status(200)
          .json({loginSuccess : true, userId : user._id})

      })
    })
  }) //findOne : 몽고디비에서 제공하는 메서드
  //1. 요청된 이메일을 데이터 베이스에서 있는지 찾는다.
  //2. 요청한 이메일이 데이터 베이스에 있다면 비밀번호가 같은지 확인한다.
  //3. 비밀번호가 맞다면 그 유저를 위한 토큰을 생성한다.
})

// role 1 어드민 , role 2 특정 부서 어드민
// roll 0 -> 일반유저, role 0 이 아니면 관리자
//auth 라우트
app.get('/api/users/auth', auth ,(req, res) => {

  //여기까지 미들웨어를 통과해왔다는 얘기는 Authentication 이 True 라는 말
  return res.status(200).json({
    _id : req.user._id,
    isAdmin : req.user.role === 0 ? false : true,
    isAuth : true,
    email : req.user.email,
    name : req.user.name,
    lastname : req.user.lastname,
    role : req.user.role,
    image : req.user.image,

  })
})

//로그아웃 라우트 만들기
app.get('/app/users/logout', auth, (req, res) => {
  User.findOneAndUpdate({_id : req.user._id},
    { token : ""}
  , (err, user) => {
    if(err) return res.json({success : false, err})
    return res.status(200).send({
      success :true
    })
  })
})



app.listen(port, () => {console.log(`Example app listening on port ${port}`)})
