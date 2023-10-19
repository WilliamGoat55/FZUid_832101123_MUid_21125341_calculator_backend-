const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');

const app = express();
const PORT = 3000;

app.use(cors());

// MySQL connection settings
const db = mysql.createConnection({
  host: 'localhost',   // Replace with your MySQL server hostname
  user: 'root',        // Replace with your MySQL database username
  password: 'root',    // Replace with your MySQL database password
  database: 'cal'      // Replace with your MySQL database name
});

// Connect to the MySQL database
db.connect((err) => {
  if (err) throw err;
  console.log('Connected to the database.');
});

// Use body-parser middleware to handle POST data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// API endpoint to get history records
app.get('/api/get_history', (req, res) => {
  // Get the 'limit' value from the query parameters of the request. Default to 10 if not provided.
  let limit = req.query.limit ? parseInt(req.query.limit) : 10;

  // Prevent SQL injection: Ensure the limit value is a number
  if (isNaN(limit)) {
    res.status(400).json({ error: 'Invalid limit value' });
    return;
  }

  // Query the database with the specified limit
  db.query('SELECT * FROM t_history ORDER BY update_time DESC LIMIT ?', [limit], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// API endpoint to add a new history record
app.post('/api/add_history', (req, res) => {
  const { note } = req.body;
  if (!note) {
    res.status(400).json({ error: 'Please provide a history record' });
    return;
  }

  const history = { note };
  const query = 'INSERT INTO t_history SET ?';

  // Insert the new history record into the database
  db.query(query, history, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    // Respond with a success message and the ID of the inserted record
    res.json({ message: 'Record added successfully!', id: result.insertId });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
