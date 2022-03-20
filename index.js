const express = require('express') //익스프레스 모듈을 가져온다
const app = express() //
const port = 5000
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://yunji:<dudgus0519>@boilerplate.szdfv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
  useNewUrlParser : true, useUnifiedTopology : true, useCreateIndex : true, useFindAndModify : false, // 이걸 써줘야 에러가 안뜸
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

