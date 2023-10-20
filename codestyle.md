# CodeStyle - Backend (Node.js)

This code style guide is inspired by common practices and readability principles in Node.js development.

## JavaScript (Node.js)

### 1. Indentation and Spaces

- Use 2 spaces for indentation.
- Avoid leaving spaces at the end of lines.

### 2. Variable Naming

- Use camelCase for variable names.
- Be descriptive with variable names, and avoid single-character names unless in specific contexts.

```JavaScript
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');

const app = express();
const PORT = 3000;

// MySQL connection settings
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'cal'
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
```

### 3. Comments

- Use comments to explain key steps or complex operations.
- Keep comments clear, concise, and easy to understand.

### 4. Function Naming

- Use camelCase for function names.
- Functions should have clear purposes and follow the single responsibility principle.

### 5. Error Handling

- Use try-catch blocks to handle exceptions.
- Avoid catching all exceptions. Be specific about the exceptions you catch.

### 6. API Endpoint Naming

- Use descriptive names for API endpoints that reflect their functionality.

### 7. Consistency

- Maintain consistent styling throughout the codebase.
