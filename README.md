# 12. SQL Challenge: Employee Tracker

![MIT License](https://img.shields.io/badge/license-MIT-green)

## Description

Welcome to my Employee Tracker node.js application! Use this application to populate a SQL database with information regarding your company's departments, employee roles, and individual employees. Simply use the command line interface to view saved data, add new data, and update existing data for your company's database.

## Table of Contents

* [Installation](#installation)
* [Usage](#usage)
* [License](#license)
* [Credits](#credits)
* [Authors](#authors)
* [Questions](#questions)

## Instillation

This application requires node.js. If you do not have node.js installed, you can download it [here](https://nodejs.org/en/). It also requires the MySQL database management system. Instillation instructions for Windows and Mac operating systems can be found [here](https://coding-boot-camp.github.io/full-stack/mysql/mysql-installation-guide). To begin the instillation process once node.js and MySQL are installed, first clone this repository into your desired local directory. Next, navigate into the cloned repository and run the command `npm install` to install the required dependencies for the application. The application is now fully installed and ready for use.

## Usage

To prepare this application for use you will first need to run the db.sql and schema.sql files in the mySQL CLI. After logging in using your password with the command `mysql -u root -p`, run `source db/db.sql` and then `source db/schema.sql` to configure the database. Lastly, open the `connection.js` file ind the `db` folder and input your password in the corresponding field.

Now, simply enter the command `npm start` and follow the command line prompts to view, add, and update employee information.

[Walkthrough Video Part 1](https://watch.screencastify.com/v/MwdqVsAndB9EloZf2FxD)
[Walkthrough Video Part 2](https://watch.screencastify.com/v/p8qczZ1URkQIK4VTttyN)

## License

[MIT](./LICENSE.txt)

## Credits

Technologies

* [Node.js](https://nodejs.org/en/)
* [MySQL](https://www.mysql.com/)

NPM Dependencies

* [Express](https://www.npmjs.com/package/express)
* [Node MySQL 2](https://www.npmjs.com/package/mysql2?__cf_chl_captcha_tk__=pmd_D_9ZYQ1MY_s2zyp9_cyigjzi9F6rp.HQGrKz3R3K9gA-1632161698-0-gqNtZGzNAuWjcnBszQfR)
* [NPM Inquirer](https://www.npmjs.com/package/inquirer#prompt)
* [console.table](https://www.npmjs.com/package/console.table)

[Text to ASCII Art Generator](https://patorjk.com/software/taag/#p=display&f=Graffiti&t=Type%20Something%20)

## Authors

Aidan Amato

## Questions

Please reach out of you have any additional questions!

* [GitHub](https://github.com/aidanamato)
* [Email](mailto:aidanamato@comcast.net)
