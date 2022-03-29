if(process.env.NODE_ENV === 'production'){ //개발환경이 로컬인지 배포모드인지에 따라
  module.exports = require('./prod');
} else {
  module.exports = require('./dev');
}