const nodeps = require('./nodeps.js');

nodeps('github.com', [21, 22, 23, 25, 80, 110, 123, 443])
  .then(results => {  
    console.log(results);
  })
  .catch(error => {
    console.log(error);
});

async function checkLocalPorts () {
  
  const allPorts = nodeps('127.0.0.1', []);
  console.log(await allPorts);
  
}
checkLocalPorts();