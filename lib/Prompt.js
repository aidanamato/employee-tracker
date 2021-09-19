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
      this.getRoles()
        .then(data => {
          console.log(data);
          this.presentOptions();
        });

    } else if (option === 'View all employees') {
      this.getEmployees()
        .then(data => {
          console.log(data);
          this.presentOptions();
        });

    } else if (option === 'Add a department') {
      this.newDepartment()
        .then(({name}) => {
          this.postDepartment(name)
            .then(data => {
              console.log(data);
              this.presentOptions();
            });
        });

    } else if (option === 'Add a role') {
      this.getDepartments()
        .then(({data}) => {

          this.newRole(data)
            .then(roleObj => {

              this.postRole(roleObj)
                .then(data => {
                  console.log(data);
                  this.presentOptions();
                });
            });
            
        });
      
    } else if (option === 'Add an employee') {
      this.getRoles()
        .then(({data}) => {

          const roles = data;
          this.getEmployees()
            .then(({data}) => {

              const employees = data;
              this.newEmployee([roles, employees])
                .then(employeeObj => {
                  if (employeeObj.managerConfirm) {
                    employeeObj.managerConfirm = 1;
                  } else {
                    employeeObj.managerConfirm = 0;
                  }

                  this.postEmployee(employeeObj)
                    .then(data => {
                      console.log(data);
                      this.presentOptions();
                    });
                });
            });
        });

    } else if (option === 'Quit') {
      console.log('Press "Control-C" to quit!');
      return;
    }
  }

  newDepartment() {
    return inquirer.prompt({
      type: 'input',
      name: 'name',
      message: 'What is the name of the new department?',
      validate: nameInput => {
        if (nameInput) {
          return true;
        } else {
          console.log('Please enter the name of the new department.');
          return false;
        }
      }
    });
  }

  newRole(departmentArr) {
    const departmentNames = departmentArr.map(index => {
      return index.name;
    });

    return inquirer.prompt([
      {
        type: 'input',
        name: 'title',
        message: 'What is the title of the new role?',
        validate: titleInput => {
          if (titleInput) {
            return true;
          } else {
            console.log('Please enter the title of the new role.');
            return false;
          }
        }
      },
      {
        type: 'input',
        name: 'salary',
        message: "What is the role's salary?",
        validate: salaryInput => {
          if (typeof parseInt(salaryInput) === 'number') {
            return true;
          } else {
            console.log(`${typeof salaryInput}`);
            return false;
          }
        },
        filter: salaryInput => {
          return parseInt(salaryInput);
        }
      },
      {
        type: 'list',
        name: 'departmentID',
        message: 'Which department does this role belong?',
        choices: departmentNames,
        filter: departmentInput => {
          // match id with department name
          for (let i =0; i < departmentArr.length; i++) {
            if (departmentInput === departmentArr[i].name) {
              return departmentArr[i].id;
            }
          }
        }
      }
    ]);
  }

  newEmployee([rolesArr, employeesArr]) {
    const roleNames = rolesArr.map(index => {
      return index.title;
    });
    
    let managers = employeesArr.filter(index => index.is_manager === 1);
    if (managers.length >= 1) {
      managers = managers.map(index => `${index.first_name} ${index.last_name}`);
    }

    return inquirer.prompt([
      {
        type: 'input',
        name: 'firstName',
        message: "What is the employee's first name?",
        validate: firstNameResponse => {
          if (firstNameResponse) {
            return true;
          } else {
            console.log("Please enter your employee's first name.");
            return false;
          }
        } 
      },
      {
        type: 'input',
        name: 'lastName',
        message: "What is the employee's last name?",
        validate: lastNameResponse => {
          if (lastNameResponse) {
            return true;
          } else {
            console.log("Please enter your employee's last name.");
            return false;
          }
        } 
      },
      {
        type: 'list',
        name: 'roleID',
        message: "What is your employee's role?",
        choices: roleNames,
        filter: roleInput => {
          for (let i = 0; i < rolesArr.length; i++) {
            if (roleInput === rolesArr[i].title) {
              return rolesArr[i].id;
            }
          }
        }
      },
      {
        type: 'confirm',
        name: 'managerConfirm',
        message: 'Is your employee a manager?',
      },
      {
        type: 'list',
        name: 'managerID',
        message: "Who is your employee's manager?",
        choices: [...managers, 'No manager'],
        filter: managerInput => {
          if (managerInput === 'No manager') {
            return null;
          }
          return managerInput;
        }
      }
    ]);
  }
}

module.exports = Prompt;