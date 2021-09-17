const router = require('express').Router();
const db = require('../../db/connection');

// department routes
router.get('/departments', (req, res) => {
  const sql = `SELECT * FROM departments`;

  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({error: err.message});
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
      res.status(400).json({error: err.message});
      return;
    }
    res.json({
      message: 'success',
      data: body
    });
  });
});

module.exports = router;