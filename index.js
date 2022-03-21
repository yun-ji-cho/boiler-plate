const express = require('express') //익스프레스 모듈을 가져온다
const app = express() //
const port = 5000
const bodyParser = require('body-parser');

const config = require('./config/key');

const { User } = require('./models/User');


//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended : true})); //bodyParser 는 클라이언트에서 오는 정보를 서버에서 분석해서 가져올 수 있게 한다.
//application/json json 타입으로 된것을 분석해서 가져올 수 있게.
app.use(bodyParser.json());

const mongoose = require('mongoose');
mongoose.connect(config.mongoURI, {}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

app.get('/', (req, res) => res.send('Hello World!~~~~~dfgdgdg'))

//회원가입을 위한 라우트
app.post('/register', (req, res) => {
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

app.listen(port, () => {console.log(`Example app listening on port ${port}`)})

