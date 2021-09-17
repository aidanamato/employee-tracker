// Dependencies
const inquirer = require('inquirer');
const Requests = require('./Requests');

class Prompt extends Requests {
  launch() {
    console.log('Welcome to the Employee Tracker CMS!');
    this.presentOptions();
  }

  presentOptions() {
    inquirer.prompt({
      type: 'list',
      name: 'chooseOption',
      message: 'What would you like to do?',
      choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Quit']
    })
    .then(({chooseOption}) => {
      this.chooseOption(chooseOption);
    })
    .catch(err => {
      console.log(err);
    });
  }

  chooseOption(option) {
    if (option === 'View all departments') {
      this.getDepartments()
        .then(data => {
          console.log(data);
          this.presentOptions();
        });
          
    } else if (option === 'View all roles') {

    } else if (option === 'View all employees') {
      
    } else if (option === 'Add a department') {
      
    } else if (option === 'Add a role') {
      
    } else if (option === 'Add an employee') {
      
    } else if (option === 'Quit') {
      console.log('Press "Control-c" to quit!');
      return;
    }
  }
}

module.exports = Prompt;