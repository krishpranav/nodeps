// help

const nodeps = require('./nodeps')

nodeps('127.0.0.1', [21, 22, 23, 25, 80, 110, 123, 443])
  .then(results => {  
    console.log(results);
  })
  .catch(error => {
    console.log(error);
});