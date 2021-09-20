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
      choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', "Update an employee's role", 'Quit'],
      pageSize: 8
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
      // gets list of departments and returns them as a table
      this.getDepartments()
        .then(({data}) => {

          console.table(`
Departments`, data);
          this.presentOptions();
        });
          
    } else if (option === 'View all roles') {
      // gets list of roles and returns them as a table
      this.getRoles()
        .then(({data}) => {
          // convert salary number into currency
          for (let i = 0; i < data.length; i++) {
            data[i].salary = new Intl.NumberFormat('en-US', 
            {style: 'currency', currency: 'USD'}).format(data[i].salary);
          }

          console.table(`
Roles`, data);
          this.presentOptions();
        });

    } else if (option === 'View all employees') {
      // gets list of employees and returns them as a table
      this.getEmployees()
        .then(({data}) => {
          // converts salary number into currency
          for (let i = 0; i < data.length; i++) {
            data[i].salary = new Intl.NumberFormat('en-US', 
            {style: 'currency', currency: 'USD'}).format(data[i].salary);
            
            // sets no manager to "N/A"
            if (!data[i].manager) {
              data[i].manager = 'N/A';
            }
            
            // sets is manager to "*"
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
      // input new department info
      this.newDepartment()
        .then(({name}) => {
          // make post request to server
          this.postDepartment(name)
            .then(() => {
              // confirm department added
              console.log('Department added!');
              this.presentOptions();
            });
        });

    } else if (option === 'Add a role') {
      // get list of departments
      this.getDepartments()
        .then(({data}) => {

          // input new role information
          this.newRole(data)
            .then(roleObj => {
              
              // make post request to server
              this.postRole(roleObj)
                .then(() => {
                  console.log('Role added!')
                  this.presentOptions();
                });
            });
            
        });
      
    } else if (option === 'Add an employee') {
      // get list of roles
      this.getRoles()
        .then(({data}) => {

          const roles = data;
          // get list of current employees
          this.getEmployees()
            .then(({data}) => {

              const employees = data;
              this.newEmployee([roles, employees])
                .then(employeeObj => {

                  // convert truthy and falsy values to 1 and 0 for mysql
                  if (employeeObj.managerConfirm) {
                    employeeObj.managerConfirm = 1;
                  } else {
                    employeeObj.managerConfirm = 0;
                  }

                  // post request to server
                  this.postEmployee(employeeObj)
                    .then(() => {
                      console.log('Employee added!')
                      this.presentOptions();
                    });
                });
            });
        });

    } else if (option === "Update an employee's role") {
      // get list of roles
      this.getRoles()
        .then(({data}) => {
          const roles = data;

          // get list of employees
          this.getEmployees()
          .then(({data}) => {
            const employees = data;

            // get updated info from user
            this.updateEmployee(roles, employees)
            
            .then(employeeObj => {
              // put request to server
              this.putEmployee(employeeObj)
                
              .then(() =>{
                  console.log('Employee info updated!');
                  this.presentOptions();
                });
            });
          });
        });

    } else if (option === 'Quit') {
      // display instructions to quit out of the server
      console.log('Press "Control-C" to quit!');
      return;
    }
  }

  newDepartment() {
    // inquirer prompt for new department
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
    // map array containing department names and id's to return the name of each
    const departmentNames = departmentArr.map(index => {
      return index.name;
    });

    // inquirer prompt for new role
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
          // loop through departmentArr to match the user inputted name with the id
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
    // get department and title from rolesArr
    const roles = rolesArr.map(index => {
      return `${index.department}: ${index.title}`
    });
    
    // get all employees who are managers
    const managers = employeesArr.filter(index => index.is_manager === 1);
    let managerNames = [];
    // return manager first and last names
    if (managers.length >= 1) {
      managerNames = managers.map(index => `${index.first_name} ${index.last_name}`);
    }

    // inquirer prompt for new employee
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
        choices: roles,
        filter: roleInput => {
          // gets name of role to match title in rolesArr
          const role = roleInput.split(": ")[1];
          
          // checks user inputted title role against each objects title in rolesArr
          for (let i = 0; i < rolesArr.length; i++) {
            if (role === rolesArr[i].title) {
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
          // splits user response into firstName and lastName constants
          const [firstName, lastName] = managerInput.split(" ");

          // filter managers array for manager matching user input, then map that result to parse the manager's id
          return (
            managers.filter(index => index.first_name === firstName && index.last_name === lastName)
              .map(index => index.id)[0]
          );
        }
      }
    ]);
  }

  updateEmployee(rolesArr, employeesArr) {
    const employeeNames = [];
    // get first and last names of employees in employeeArr
    for (let i = 0; i < employeesArr.length; i++) {
      employeeNames.push(`${employeesArr[i].first_name} ${employeesArr[i].last_name}`)
    }

    const roles = []
    // get role titles of roles in rolesArr
    for (let i =0; i < rolesArr.length; i++) {
      roles.push(rolesArr[i].title);
    }

    // update employee inquirer prompt
    return inquirer.prompt([
      {
        type: 'list',
        name: 'employee',
        message: "Which employee's role would you like to update?",
        choices: employeeNames,
        filter: employeeInput => {
          // split user response into firsName and lastName constants
          const [firstName, lastName] = employeeInput.split(" ");
          
          // filter employeesArr to select employee matching user response, then map that employee to parse the id
          return employeesArr.filter(index => 
            index.first_name === firstName && index.last_name === lastName
          ).map(index => index.id)[0];
        }
      },
      {
        type: 'list',
        name: 'role',
        message: "What is the employee's new role?",
        choices: roles,
        filter: roleInput => {
          // filter rolesArr to select role matching user input, then map the result to parse the id
          return rolesArr.filter(index =>
            index.title === roleInput
          ).map(index => index.id)[0];
        }
      }
    ]);
  }
}

module.exports = Prompt;