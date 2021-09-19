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
  const sql = `SELECT * FROM employees`;

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

module.exports = router;