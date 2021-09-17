const fetch = require('node-fetch');
const Prompt = require('./Prompt');

class Requests {
  getDepartments() {
    return fetch('http://localhost:3001/departments')
    .then(response => response.json())
    .then(data => data);
  }
}

module.exports = Requests;