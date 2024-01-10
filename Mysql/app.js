const express = require("express");
const mysql = require('mysql2');
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Create a MySQL database connectionc
const db = mysql.createConnection({
  host: "localhost",       // Replace with your MySQL host
  user: "root",            // Replace with your MySQL username
  password: "",    // Replace with your MySQL password
  database: "ChicagoCommunity",  // Replace with your database name
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL!');
});

// Define the GET endpoint to retrieve user data
app.get("/api/users", (req, res) => {
  // Query the database to retrieve user data
  db.query("SELECT * FROM Users", (err, results) => {
    if (err) {
      console.error("MySQL query error:", err);
      res.status(500).json({ message: "Internal Server Error" });
    } else {
      res.status(200).json(results);
    }
  });
});

// Define the POST endpoint to save user data
app.post("/api/users", (req, res) => {
    const { name, email, dob, password } = req.body;
  
    // Basic validation (you should perform more extensive validation)
    if (!name || !email || !dob || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }
  
    // Insert user data into the database
    const newUser = {
      name,
      email,
      dob,
      password,
    };
  
    db.query("INSERT INTO users SET ?", newUser, (err, result) => {
      if (err) {
        console.error("MySQL insert error:", err);
        res.status(500).json({ message: "Failed to save user data" });
      } else {
        res.status(201).json({ message: "User created successfully", newUser });
      }
    });
  });

// Define the PUT endpoint to update user data
app.put("/api/users/:userId", (req, res) => {
    const userId = req.params.userId;
    const { name, email, dob, password } = req.body;
  
    // Basic validation (you should perform more extensive validation)
    if (!name || !email || !dob || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }
  
    // Update user data in the database
    const updatedUser = {
      name,
      email,
      dob,
      password,
    };
  
    db.query("UPDATE users SET ? WHERE id = ?", [updatedUser, userId], (err, result) => {
      if (err) {
        console.error("MySQL update error:", err);
        res.status(500).json({ message: "Failed to update user data" });
      } else {
        res.status(200).json({ message: "User updated successfully", updatedUser });
      }
    });
  });

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
