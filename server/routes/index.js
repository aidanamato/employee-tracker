const router = require('express').Router();
const db = require('../../db/connection');

// department routes
router.get('/departments', (req, res) => {
  const sql = `SELECT * FROM departments`;

  db.query(sql, (err, rows) => {
    if (err) {
      res.status(400).json({error: err.message});
      return;
    }
    res.json({
      message: 'success',
      data: rows
    });
  });
});

router.post('/department', ({body}, res) => {
  const sql = `INSERT INTO departments (name) VALUE
               (?)`;
  const param = body.name;

  db.query(sql, param, (err, result) => {
    if (err) {
      res.status(500).json({error: err.message});
      return;
    }
    res.json({
      message: 'success',
      data: body
    });
  });
});

// role routes
router.get('/roles', (req, res) => {
  const sql = `SELECT roles.*, departments.name AS department
               FROM roles
               JOIN departments ON roles.department_id = departments.id`;

  db.query(sql, (err, rows) => {
    if (err) {
      res.status(400).json({error: err.message});
      return;
    }
    res.json({
      message: 'success',
      data: rows
    });
  });
});

router.get('/roles/internal', (req, res) => {
  const sql = 'SELECT * FROM roles';

  db.query(sql, (err, rows) => {
    if (err) {
      res.status(400).json({error: err.message});
      return;
    }
    res.json({
      message: 'success',
      data: rows
    });
  });
});

router.post('/role', ({body}, res) => {

  const sql = `INSERT INTO roles (title, salary, department_id) 
               VALUES (?, ?, ?)`;
  const params = [body.title, body.salary, body.departmentID];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(500).json({error: err.message});
      return;
    }
    res.json({
      message: 'success',
      data: body
    });
  });
});

// employee routes
router.get('/employees', (req, res) => {
  const sql = `SELECT a.id, a.first_name, a.last_name, roles.title AS role, departments.name AS department, roles.salary, CONCAT(b.first_name, " ", b.last_name) AS manager, a.is_manager
               FROM employees a LEFT JOIN employees b
               ON a.manager_id = b.id
               JOIN roles
               ON a.role_id = roles.id
               JOIN departments
               ON roles.department_id = departments.id`;

  db.query(sql, (err, rows) => {
    if (err) {
      res.status(400).json({error: err.message});
      return;
    }
    res.json({
      message: 'success',
      data: rows
    });
  });
});

router.post('/employee', ({body}, res) => {
  const sql = `INSERT INTO employees (first_name, last_name, role_id, is_manager, manager_id) 
               VALUES (?, ?, ?, ?, ?)`;
  const params = [body.firstName, body.lastName, body.roleID, body.managerConfirm, body.managerID];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(500).json({error: err.message});
      return;
    }
    res.json({
      message: 'success',
      data: body
    });
  });
});

router.put('/employee', ({body}, res) => {
  const sql = `UPDATE employees SET role_id = ?
               WHERE id = ?`;
  const params = [body.role, body.employee];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(500).json({error: err.message});
      return;
    }
    res.json({
      message: 'success',
      data: body
    });
  });
});

module.exports = router;