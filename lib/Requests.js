const fetch = require('node-fetch');
const Prompt = require('./Prompt');

class Requests {
  getDepartments() {
    return fetch('http://localhost:3001/departments')
      .then(res => res.json())
      .then(data => data);
  }
}

module.exports = Requests;