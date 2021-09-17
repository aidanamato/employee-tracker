const http = require('http');

class Requests {
  getDepartments() {
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: '/departments',
      method: 'GET'
    }
    const req = http.request(options, res => {
      console.log(`statusCode: ${res.statusCode}`);
    
      res.on('data', data => {
        process.stdout.write(data);
      });
    });
    
    req.end();
  }
}

module.exports = Requests;