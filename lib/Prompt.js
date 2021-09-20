// Dependencies
const inquirer = require('inquirer');
const cTable = require('console.table');
const Requests = require('./Requests');

class Prompt extends Requests {
  launch() {
    console.log(`
+---------------------------------------------------------------------------------------+
|   _____                 _                         _____               _               |
|  | ____|_ __ ___  _ __ | | ___  _   _  ___  ___  |_   _| __ __ _  ___| | _____ _ __   |
|  |  _| | '_ \` _ \\| '_ \\| |/ _ \\| | | |/ _ \\/ _ \\   | || '__/ _\` |/ __| |/ / _ \\ '__|  |
|  | |___| | | | | | |_) | | (_) | |_| |  __/  __/   | || | | (_| | (__|   <  __/ |     |
|  |_____|_| |_| |_| .__/|_|\\___/ \\__, |\\___|\\___|   |_||_|  \\__,_|\\___|_|\\_\\___|_|     |  
|                  |_|            |___/                                                 |
+---------------------------------------------------------------------------------------+
                                                                                    
`);
    this.presentOptions();
  }

  presentOptions() {
    inquirer.prompt({
      type: 'list',
      name: 'chooseOption',
      message: 'What would you like to do?',
      choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', "Update an employee's info", 'Quit'],
      pageSize: [8]
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
        .then(({data}) => {

          console.table(`
Departments`, data);
          this.presentOptions();
        });
          
    } else if (option === 'View all roles') {
      this.getRoles()
        .then(({data}) => {
          for (let i = 0; i < data.length; i++) {
            data[i].salary = new Intl.NumberFormat('en-US', 
            {style: 'currency', currency: 'USD'}).format(data[i].salary);
          }

          console.table(`
Roles`, data);
          this.presentOptions();
        });

    } else if (option === 'View all employees') {
      this.getEmployees()
        .then(({data}) => {
          for (let i = 0; i < data.length; i++) {
            data[i].salary = new Intl.NumberFormat('en-US', 
            {style: 'currency', currency: 'USD'}).format(data[i].salary);
            
            if (!data[i].manager) {
              data[i].manager = 'N/A';
            }
            
            if (data[i].is_manager === 1) {
              data[i].is_manager = '*';
            } else {
              data[i].is_manager = '';
            }
          }

          console.table(`
Employees`, data);
          this.presentOptions();
        });

    } else if (option === 'Add a department') {
      this.newDepartment()
        .then(({name}) => {
          this.postDepartment(name)
            .then(() => {
              console.log('Department added!');
              this.presentOptions();
            });
        });

    } else if (option === 'Add a role') {
      this.getDepartments()
        .then(({data}) => {

          this.newRole(data)
            .then(roleObj => {
              console.log(roleObj);

              this.postRole(roleObj)
                .then(() => {
                  console.log('Role added!')
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
                    .then(() => {
                      console.log('Employee added!')
                      this.presentOptions();
                    });
                });
            });
        });

    } else if (option === "Update an employee's info") {

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
    
    const managers = employeesArr.filter(index => index.is_manager === 1);
    let managerNames = [];
    if (managers.length >= 1) {
      managerNames = managers.map(index => `${index.first_name} ${index.last_name}`);
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
        choices: [...managerNames, 'No manager'],
        filter: managerInput => {
          if (managerInput === 'No manager') {
            return null;
          }
          const [firstName, lastName] = managerInput.split(" ");

          return (
            managers.filter(index => index.first_name === firstName && index.last_name === lastName)
              .map(index => index.id)[0]
          );
        }
      }
    ]);
  }
}

module.exports = Prompt;