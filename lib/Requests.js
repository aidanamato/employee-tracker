const { response } = require('express');
const fetch = require('node-fetch');

class Requests {
  // department methods
  getDepartments() {
    return fetch('http://localhost:3001/departments')
      .then(response => response.json())
      .then(data => data);
  }

  getDepartmentsInternal() {
    return fetch('http://localhost:3001/departments/internal')
      .then(response => response.json())
      .then(data => data);
  }

  postDepartment(name) {
    
    const body = {
      name: name
    };
    
    return fetch('http://localhost:3001/department', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
      .then(response => response.json())
      .then(data => data);
  }

  // role methods
  getRoles() {
    return fetch('http://localhost:3001/roles')
      .then(response => response.json())
      .then(data => data);
  }

  getRolesInternal() {
    return fetch('http://localhost:3001/roles/internal')
      .then(response => response.json())
      .then(data => data);
  }

  postRole(roleObj) {
    return fetch('http://localhost:3001/role', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(roleObj)
    })
      .then(response => response.json())
      .then(data => data);
  }

  // employee methods
  getEmployees() {
    return fetch('http://localhost:3001/employees')
      .then(response => response.json())
      .then(data => data);
  }

  postEmployee(employeeObj) {
    return fetch('http://localhost:3001/employee', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(employeeObj)
    })
      .then(response => response.json())
      .then(data => data);
  }

  putEmployee(employeeObj) {
    return fetch('http://localhost:3001/employee', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(employeeObj)
    })
      .then(response => response.json())
      .then(data => data);
  }
}

module.exports = Requests;