const express = require("express");
const mysql = require('mysql2');
const oracledb = require("oracledb");
const bodyParser = require("body-parser");
const cors = require('cors');

const app = express();
app.use(cors());
const port = process.env.PORT || 5000;

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Create a MySQL database connectionc
const db = mysql.createConnection({
  host: "localhost",       // Replace with your MySQL host
  user: "root",            // Replace with your MySQL username
  password: "",    // Replace with your MySQL password
  database: "TicketBooking",  // Replace with your database name
});

// Create an Oracle Database connection pool
// const poolConfig = {
//   user: "your_oracle_username",
//   password: "your_oracle_password",
//   connectString: "localhost:1521/your_oracle_service_name",
//   poolMax: 10,
//   poolMin: 2,
//   poolIncrement: 1,
// };

// let connectionPool;

// oracledb.createPool(poolConfig, (err, pool) => {
//   if (err) {
//     console.error('Error creating Oracle Database connection pool:', err);
//     return;
//   }
//   connectionPool = pool;
//   console.log('Oracle Database connection pool created!');
// });

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL!');
});






// ==============MYSQL====================
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

// ==============ORACLE DB====================
// app.get("/api/users", (req, res) => {
//   connectionPool.getConnection((err, connection) => {
//     if (err) {
//       console.error('Error acquiring Oracle Database connection:', err);
//       res.status(500).json({ message: "Internal Server Error" });
//       return;
//     }

//     connection.execute("SELECT * FROM Users", [], { resultSet: true }, (err, result) => {
//       if (err) {
//         console.error("Oracle Database query error:", err);
//         res.status(500).json({ message: "Internal Server Error" });
//       } else {
//         const rows = result.getRows();
//         const users = rows.map((row) => ({ name: row.name, email: row.email, password: row.password, userType: row.userType}));
//         res.status(200).json(users);
//       }

//       // Release the connection back to the pool
//       connection.close((err) => {
//         if (err) {
//           console.error('Error releasing Oracle Database connection:', err);
//         }
//       });
//     });
//   });
// });






// // Define the POST endpoint to save user data
app.post("/api/users", (req, res) => {
    const { name, email, password, userType } = req.body;
  
    // Basic validation (you should perform more extensive validation)
    if (!name || !email || !password || !userType) {
      return res.status(400).json({ message: "Missing required fields" });
    }
  
    // Insert user data into the database
    const newUser = {
      name,
      email,
      password,
      userType
    };
  
    db.query("INSERT INTO Users SET ?", newUser, (err, result) => {
      if (err) {
        console.error("MySQL insert error:", err);
        res.status(500).json({ message: "Failed to save user data" });
      } else {
        res.status(201).json({ message: "User created successfully", newUser });
      }
    });
  });

// ==============ORACLE DB====================
// app.post("/api/users", (req, res) => {
//   const { name, email, password, userType } = req.body;

//   if (!name || !email || !password || !userType) {
//     return res.status(400).json({ message: "Missing required fields" });
//   }

//   const newUser = {
//     name,
//     email,
//     password,
//     userType
//   };

//   connectionPool.getConnection((err, connection) => {
//     if (err) {
//       console.error('Error acquiring Oracle Database connection:', err);
//       res.status(500).json({ message: "Internal Server Error" });
//       return;
//     }

//     connection.execute("INSERT INTO Users (name, email, password, userType) VALUES (:name, :email, :password, :userType)",
//       newUser,
//       { autoCommit: true },
//       (err, result) => {
//         if (err) {
//           console.error("Oracle Database insert error:", err);
//           res.status(500).json({ message: "Failed to save user data" });
//         } else {
//           res.status(201).json({ message: "User created successfully", newUser });
//         }

//         connection.close((err) => {
//           if (err) {
//             console.error('Error releasing Oracle Database connection:', err);
//           }
//         });
//       });
//   });
// });




  app.get('/api/users/:email', (req, res) => {
    const tableName = 'Users';
    const keyColumn = 'email';
    const keyValue = req.params.email;
  
    const sqlQuery = `SELECT * FROM ${tableName} WHERE ${keyColumn} = ?`;
  
    db.query(sqlQuery, [keyValue], (err, results) => {
      if (err) {
        console.error('Error retrieving details:', err);
        res.status(500).send('Internal Server Error');
      } else {
        if (results.length > 0) {
          const details = results[0];
          res.json(details);
        } else {
          res.status(404).send('Not Found');
        }
      }
    });
  });


  // =============ORACLE DB==================
  // app.get('/api/users/:email', (req, res) => {
  //   const tableName = 'Users';
  //   const keyColumn = 'email';
  //   const keyValue = req.params.email;
  
  //   const sqlQuery = `SELECT * FROM ${tableName} WHERE ${keyColumn} = :email`;
  
  //   connectionPool.getConnection((err, connection) => {
  //     if (err) {
  //       console.error('Error acquiring Oracle Database connection:', err);
  //       res.status(500).json({ message: "Internal Server Error" });
  //       return;
  //     }
  
  //     connection.execute(sqlQuery, [keyValue], { resultSet: true }, (err, result) => {
  //       if (err) {
  //         console.error('Error retrieving details:', err);
  //         res.status(500).send('Internal Server Error');
  //       } else {
  //         const rows = result.getRows();
  //         if (rows.length > 0) {
  //           const details = rows[0];
  //           res.json(details);
  //         } else {
  //           res.status(404).send('Not Found');
  //         }
  //       }
  
  //       connection.close((err) => {
  //         if (err) {
  //           console.error('Error releasing Oracle Database connection:', err);
  //         }
  //       });
  //     });
  //   });
  // });




  app.delete('/api/users/:email', (req, res) => {
    const tableName = 'Users';
    const keyColumn = 'email';
    const keyValue = req.params.email;
  
    const sqlQuery = `DELETE FROM ${tableName} WHERE ${keyColumn} = ?`;
  
    db.query(sqlQuery, [keyValue], (err, results) => {
      if (err) {
        console.error('Error retrieving details:', err);
        res.status(500).send('Internal Server Error');
      } else {
        if (results.length > 0) {
          res.status(200).send('Deleted Successfully');
        } else {
          res.status(404).send('Not Found');
        }
      }
    });
  });

  //=============ORACLE DB====================
  // app.delete('/api/users/:email', (req, res) => {
  //   const tableName = 'Users';
  //   const keyColumn = 'email';
  //   const keyValue = req.params.email;
  
  //   const sqlQuery = `DELETE FROM ${tableName} WHERE ${keyColumn} = :email`;
  
  //   connectionPool.getConnection((err, connection) => {
  //     if (err) {
  //       console.error('Error acquiring Oracle Database connection:', err);
  //       res.status(500).json({ message: "Internal Server Error" });
  //       return;
  //     }
  
  //     connection.execute(sqlQuery, [keyValue], { autoCommit: true }, (err, result) => {
  //       if (err) {
  //         console.error('Error deleting details:', err);
  //         res.status(500).send('Internal Server Error');
  //       } else {
  //         if (result.rowsAffected > 0) {
  //           res.status(200).send('Deleted Successfully');
  //         } else {
  //           res.status(404).send('Not Found');
  //         }
  //       }
  
  //       connection.close((err) => {
  //         if (err) {
  //           console.error('Error releasing Oracle Database connection:', err);
  //         }
  //       });
  //     });
  //   });
  // });



// Movie

app.get("/api/movie", (req, res) => {
  // Query the database to retrieve user data
  db.query("SELECT * FROM Movie", (err, results) => {
    if (err) {
      console.error("MySQL query error:", err);
      res.status(500).json({ message: "Internal Server Error" });
    } else {
      res.status(200).json(results);
    }
  });
});

// ==========ORACLE DB=================
app.get("/api/movie", (req, res) => {
  const sqlQuery = "SELECT * FROM Movie";

  connectionPool.getConnection((err, connection) => {
    if (err) {
      console.error('Error acquiring Oracle Database connection:', err);
      res.status(500).json({ message: "Internal Server Error" });
      return;
    }

    connection.execute(sqlQuery, [], { resultSet: true }, (err, result) => {
      if (err) {
        console.error('Error retrieving movie data:', err);
        res.status(500).send('Internal Server Error');
      } else {
        const rows = result.getRows();
        res.status(200).json(rows);
      }

      connection.close((err) => {
        if (err) {
          console.error('Error releasing Oracle Database connection:', err);
        }
      });
    });
  });
});

app.post("/api/movie", (req, res) => {
    const { name, tickets, showTime, date, ticketsSold, price, description } = req.body;
  
    // Basic validation (you should perform more extensive validation)
    if (!name || !tickets || !showTime || !date || !price) {
      return res.status(400).json({ message: "Missing required fields" });
    }
  
    // Insert user data into the database
    const newMovie = {
      name, tickets, showTime, date, ticketsSold, price, description
    };
  
    db.query("INSERT INTO Movie SET ?", newMovie, (err, result) => {
      if (err) {
        console.error("MySQL insert error:", err);
        res.status(500).json({ message: "Failed to save user data" });
      } else {
        res.status(201).json({ message: "Movie created successfully", newMovie });
      }
    });
  });

// ============ORACLE DB=============
app.post("/api/movie", (req, res) => {
  const { name, tickets, showTime, date, ticketsSold, price, description } = req.body;

  if (!name || !tickets || !showTime || !date || !price) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const newMovie = {
    name, tickets, showTime, date, ticketsSold, price, description
  };

  const sqlQuery = `
    INSERT INTO Movie (name, tickets, showTime, date, ticketsSold, price, description)
    VALUES (:name, :tickets, :showTime, :date, :ticketsSold, :price, :description)
  `;

  connectionPool.getConnection((err, connection) => {
    if (err) {
      console.error('Error acquiring Oracle Database connection:', err);
      res.status(500).json({ message: "Internal Server Error" });
      return;
    }

    connection.execute(sqlQuery, newMovie, { autoCommit: true }, (err, result) => {
      if (err) {
        console.error('Error inserting movie data:', err);
        res.status(500).json({ message: "Failed to save movie data" });
      } else {
        res.status(201).json({ message: "Movie created successfully", newMovie });
      }

      connection.close((err) => {
        if (err) {
          console.error('Error releasing Oracle Database connection:', err);
        }
      });
    });
  });
});






// // Define the PUT endpoint to update user data
app.put("/api/movie/:id", (req, res) => {
    const id = req.params.id;
    const { name, tickets, showTime, date, ticketsSold, price, description } = req.body;
  
    // Basic validation (you should perform more extensive validation)
    if (!name || !tickets || !showTime || !date || !price) {
      return res.status(400).json({ message: "Missing required fields" });
    }
  
    // Update user data in the database
    const updatedMovie = {
      name, tickets, showTime, date, ticketsSold, price, description
    };
  
    db.query("UPDATE Movie SET ? WHERE id = ?", [updatedMovie, id], (err, result) => {
      if (err) {
        console.error("MySQL update error:", err);
        res.status(500).json({ message: "Failed to update user data" });
      } else {
        res.status(200).json({ message: "Movie updated successfully", updatedMovie });
      }
    });
  });

// ==============ORACLE DB===============
// app.put("/api/movie/:id", (req, res) => {
//   const id = req.params.id;
//   const { name, tickets, showTime, date, ticketsSold, price, description } = req.body;

//   if (!name || !tickets || !showTime || !date || !price) {
//     return res.status(400).json({ message: "Missing required fields" });
//   }

//   const updatedMovie = {
//     name, tickets, showTime, date, ticketsSold, price, description
//   };

//   const sqlQuery = `
//     UPDATE Movie
//     SET name = :name, tickets = :tickets, showTime = :showTime,
//         date = :date, ticketsSold = :ticketsSold, price = :price,
//         description = :description
//     WHERE id = :id
//   `;

//   connectionPool.getConnection((err, connection) => {
//     if (err) {
//       console.error('Error acquiring Oracle Database connection:', err);
//       res.status(500).json({ message: "Internal Server Error" });
//       return;
//     }

//     connection.execute(sqlQuery, { ...updatedMovie, id }, { autoCommit: true }, (err, result) => {
//       if (err) {
//         console.error('Error updating movie data:', err);
//         res.status(500).json({ message: "Failed to update movie data" });
//       } else {
//         res.status(200).json({ message: "Movie updated successfully", updatedMovie });
//       }

//       connection.close((err) => {
//         if (err) {
//           console.error('Error releasing Oracle Database connection:', err);
//         }
//       });
//     });
//   });
// });







  app.get('/api/movie/:id', (req, res) => {
    const tableName = 'Movie';
    const keyColumn = 'id';
    const keyValue = req.params.id;
  
    const sqlQuery = `SELECT * FROM ${tableName} WHERE ${keyColumn} = ?`;
  
    db.query(sqlQuery, [keyValue], (err, results) => {
      if (err) {
        console.error('Error retrieving details:', err);
        res.status(500).send('Internal Server Error');
      } else {
        if (results.length > 0) {
          const details = results[0];
          res.json(details);
        } else {
          res.status(404).send('Not Found');
        }
      }
    });
  });

// =============ORACLE DB===============
// app.get('/api/movie/:id', (req, res) => {
//   const tableName = 'Movie';
//   const keyColumn = 'id';
//   const keyValue = req.params.id;

//   const sqlQuery = `SELECT * FROM ${tableName} WHERE ${keyColumn} = :id`;

//   connectionPool.getConnection((err, connection) => {
//     if (err) {
//       console.error('Error acquiring Oracle Database connection:', err);
//       res.status(500).json({ message: "Internal Server Error" });
//       return;
//     }

//     connection.execute(sqlQuery, { id: keyValue }, { resultSet: true }, (err, result) => {
//       if (err) {
//         console.error('Error retrieving movie details:', err);
//         res.status(500).send('Internal Server Error');
//       } else {
//         const rows = result.getRows();
//         if (rows.length > 0) {
//           const details = rows[0];
//           res.json(details);
//         } else {
//           res.status(404).send('Not Found');
//         }
//       }

//       connection.close((err) => {
//         if (err) {
//           console.error('Error releasing Oracle Database connection:', err);
//         }
//       });
//     });
//   });
// });




  app.delete('/api/movie/:id', (req, res) => {
    const tableName = 'Movie';
    const keyColumn = 'id';
    const keyValue = req.params.id;
  
    const sqlQuery = `DELETE FROM ${tableName} WHERE ${keyColumn} = ?`;
  
    db.query(sqlQuery, [keyValue], (err, results) => {
      if (err) {
        console.error('Error retrieving details:', err);
        res.status(500).send('Internal Server Error');
      } else {
          res.status(200).send('Deleted Successfully');
        }
    });
  });


  //=============ORALCE DB==============
//   app.delete('/api/movie/:id', (req, res) => {
//     const tableName = 'Movie';
//     const keyColumn = 'id';
//     const keyValue = req.params.id;
  
//     const sqlQuery = `DELETE FROM ${tableName} WHERE ${keyColumn} = :id`;
  
//     connectionPool.getConnection((err, connection) => {
//       if (err) {
//         console.error('Error acquiring Oracle Database connection:', err);
//         res.status(500).json({ message: "Internal Server Error" });
//         return;
//       }
  
//       connection.execute(sqlQuery, { id: keyValue }, { autoCommit: true }, (err, result) => {
//         if (err) {
//           console.error('Error deleting movie details:', err);
//           res.status(500).send('Internal Server Error');
//         } else {
//           res.status(200).send('Deleted Successfully');
//         }
  
//         connection.close((err) => {
//           if (err) {
//             console.error('Error releasing Oracle Database connection:', err);
//           }
//         });
//       });
//   });
// })






// Bookings
app.get("/api/bookings", (req, res) => {
  // Query the database to retrieve user data
  db.query("SELECT * FROM Bookings", (err, results) => {
    if (err) {
      console.error("MySQL query error:", err);
      res.status(500).json({ message: "Internal Server Error" });
    } else {
      res.status(200).json(results);
    }
  });
});

// ==========ORALCE DB===============
// app.get("/api/bookings", (req, res) => {
//   const sqlQuery = "SELECT * FROM Bookings";

//   connectionPool.getConnection((err, connection) => {
//     if (err) {
//       console.error('Error acquiring Oracle Database connection:', err);
//       res.status(500).json({ message: "Internal Server Error" });
//       return;
//     }

//     connection.execute(sqlQuery, {}, { resultSet: true }, (err, result) => {
//       if (err) {
//         console.error('Error retrieving bookings data:', err);
//         res.status(500).send('Internal Server Error');
//       } else {
//         const rows = result.getRows();
//         res.status(200).json(rows);
//       }

//       connection.close((err) => {
//         if (err) {
//           console.error('Error releasing Oracle Database connection:', err);
//         }
//       });
//     });
//   });
// });








// Define the POST endpoint to save user data
app.post("/api/bookings", (req, res) => {
    const { userName, movieName, totalTickets, totalPrice, showTime, date, status } = req.body;
  
    // Basic validation (you should perform more extensive validation)
    if (!userName || !movieName || !totalTickets || !totalPrice || !showTime) {
      return res.status(400).json({ message: "Missing required fields" });
    }
  
    // Insert user data into the database
    const newBooking = {
      userName, movieName, totalTickets, totalPrice, showTime, date, status
    };
  
    db.query("INSERT INTO Bookings SET ?", newBooking, (err, result) => {
      if (err) {
        console.error("MySQL insert error:", err);
        res.status(500).json({ message: "Failed to save user data" });
      } else {
        const insertedId = result.insertId;
        res.status(201).json({ message: "Booking created successfully", bookingId: insertedId, newBooking });
      }
    });
  });

//==============ORALCE DB=================
// app.post("/api/bookings", (req, res) => {
//   const { userName, movieName, totalTickets, totalPrice, showTime, date, status } = req.body;

//   if (!userName || !movieName || !totalTickets || !totalPrice || !showTime) {
//     return res.status(400).json({ message: "Missing required fields" });
//   }

//   const newBooking = {
//     userName, movieName, totalTickets, totalPrice, showTime, date, status
//   };

//   const sqlQuery = `
//     INSERT INTO Bookings (userName, movieName, totalTickets, totalPrice, showTime, date, status)
//     VALUES (:userName, :movieName, :totalTickets, :totalPrice, :showTime, :date, :status)
//   `;

//   connectionPool.getConnection((err, connection) => {
//     if (err) {
//       console.error('Error acquiring Oracle Database connection:', err);
//       res.status(500).json({ message: "Internal Server Error" });
//       return;
//     }

//     connection.execute(sqlQuery, newBooking, { autoCommit: true }, (err, result) => {
//       if (err) {
//         console.error('Error inserting booking data:', err);
//         res.status(500).json({ message: "Failed to save booking data" });
//       } else {
//         const insertedId = result.lastRowid;
//         res.status(201).json({ message: "Booking created successfully", bookingId: insertedId, newBooking });
//       }

//       connection.close((err) => {
//         if (err) {
//           console.error('Error releasing Oracle Database connection:', err);
//         }
//       });
//     });
//   });
// });










app.put("/api/booking/:id", (req, res) => {
    const id = req.params.id;
    const { userName, movieName, totalTickets, totalPrice, showTime, date } = req.body;
  
    // Basic validation (you should perform more extensive validation)
    if (!userName || !movieName || !totalTickets || !totalPrice || !date || !showTime) {
      return res.status(400).json({ message: "Missing required fields" });
    }
  
  
    // Update user data in the database
    const updatedBooking = {
      userName, movieName, totalTickets, totalPrice, showTime, date 
    };
  
    db.query("UPDATE Bookings SET ? WHERE id = ?", [updatedBooking, userId], (err, result) => {
      if (err) {
        console.error("MySQL update error:", err);
        res.status(500).json({ message: "Failed to update user data" });
      } else {
        res.status(200).json({ message: "Booking updated successfully", updatedBooking });
      }
    });
  });

// ============ORALCE DB===================
// app.put("/api/booking/:id", (req, res) => {
//   const id = req.params.id;
//   const { userName, movieName, totalTickets, totalPrice, showTime, date } = req.body;

//   if (!userName || !movieName || !totalTickets || !totalPrice || !date || !showTime) {
//     return res.status(400).json({ message: "Missing required fields" });
//   }

//   const updatedBooking = {
//     userName, movieName, totalTickets, totalPrice, showTime, date
//   };

//   const sqlQuery = `
//     UPDATE Bookings
//     SET userName = :userName, movieName = :movieName, totalTickets = :totalTickets,
//         totalPrice = :totalPrice, showTime = :showTime, date = :date
//     WHERE id = :id
//   `;

//   connectionPool.getConnection((err, connection) => {
//     if (err) {
//       console.error('Error acquiring Oracle Database connection:', err);
//       res.status(500).json({ message: "Internal Server Error" });
//       return;
//     }

//     connection.execute(sqlQuery, { ...updatedBooking, id }, { autoCommit: true }, (err, result) => {
//       if (err) {
//         console.error('Error updating booking data:', err);
//         res.status(500).json({ message: "Failed to update booking data" });
//       } else {
//         res.status(200).json({ message: "Booking updated successfully", updatedBooking });
//       }

//       connection.close((err) => {
//         if (err) {
//           console.error('Error releasing Oracle Database connection:', err);
//         }
//       });
//     });
//   });
// });





  app.get('/api/booking/:id', (req, res) => {
    const tableName = 'Bookings';
    const keyColumn = 'id';
    const keyValue = req.params.id;
  
    const sqlQuery = `SELECT * FROM ${tableName} WHERE ${keyColumn} = ?`;
  
    db.query(sqlQuery, [keyValue], (err, results) => {
      if (err) {
        console.error('Error retrieving details:', err);
        res.status(500).send('Internal Server Error');
      } else {
        if (results.length > 0) {
          const details = results[0];
          res.json(details);
        } else {
          res.status(404).send('Not Found');
        }
      }
    });
  });

// ============ORACLE DB===========
// app.get('/api/booking/:id', (req, res) => {
//   const tableName = 'Bookings';
//   const keyColumn = 'id';
//   const keyValue = req.params.id;

//   const sqlQuery = `SELECT * FROM ${tableName} WHERE ${keyColumn} = :id`;

//   connectionPool.getConnection((err, connection) => {
//     if (err) {
//       console.error('Error acquiring Oracle Database connection:', err);
//       res.status(500).json({ message: "Internal Server Error" });
//       return;
//     }

//     connection.execute(sqlQuery, { id: keyValue }, { resultSet: true }, (err, result) => {
//       if (err) {
//         console.error('Error retrieving booking details:', err);
//         res.status(500).send('Internal Server Error');
//       } else {
//         const rows = result.getRows();
//         if (rows.length > 0) {
//           const details = rows[0];
//           res.json(details);
//         } else {
//           res.status(404).send('Not Found');
//         }
//       }

//       connection.close((err) => {
//         if (err) {
//           console.error('Error releasing Oracle Database connection:', err);
//         }
//       });
//     });
//   });
// });





  app.get('/api/bookings/:userName', (req, res) => {
    const tableName = 'Bookings';
    const keyColumn = 'userName';
    const keyValue = req.params.userName;
  
    const sqlQuery = `SELECT * FROM ${tableName} WHERE ${keyColumn} = ?`;
  
    db.query(sqlQuery, [keyValue], (err, results) => {
      if (err) {
        console.error('Error retrieving details:', err);
        res.status(500).send('Internal Server Error');
      } else {
        if (results.length > 0) {
          res.status(200).json(results);
        } else {
          res.status(404).send('Not Found');
        }
      }
    });
  });

  //===========ORALCE DB==============
  // app.get('/api/bookings/:userName', (req, res) => {
  //   const tableName = 'Bookings';
  //   const keyColumn = 'userName';
  //   const keyValue = req.params.userName;
  
  //   const sqlQuery = `SELECT * FROM ${tableName} WHERE ${keyColumn} = :userName`;
  
  //   connectionPool.getConnection((err, connection) => {
  //     if (err) {
  //       console.error('Error acquiring Oracle Database connection:', err);
  //       res.status(500).json({ message: "Internal Server Error" });
  //       return;
  //     }
  
  //     connection.execute(sqlQuery, { userName: keyValue }, { resultSet: true }, (err, result) => {
  //       if (err) {
  //         console.error('Error retrieving bookings details:', err);
  //         res.status(500).send('Internal Server Error');
  //       } else {
  //         const rows = result.getRows();
  //         if (rows.length > 0) {
  //           res.status(200).json(rows);
  //         } else {
  //           res.status(404).send('Not Found');
  //         }
  //       }
  
  //       connection.close((err) => {
  //         if (err) {
  //           console.error('Error releasing Oracle Database connection:', err);
  //         }
  //       });
  //     });
  //   });
  // });





  

  app.delete('/api/booking/:id', (req, res) => {
    const tableName = 'Booking';
    const keyColumn = 'id';
    const keyValue = req.params.id;
  
    const sqlQuery = `DELETE FROM ${tableName} WHERE ${keyColumn} = ?`;
  
    db.query(sqlQuery, [keyValue], (err, results) => {
      if (err) {
        console.error('Error retrieving details:', err);
        res.status(500).send('Internal Server Error');
      } else {
        if (results.length > 0) {
          res.status(200).send('Deleted Successfully');
        } else {
          res.status(404).send('Not Found');
        }
      }
    });
  });

  // =============ORALCE DB================
  // app.delete('/api/booking/:id', (req, res) => {
  //   const tableName = 'Bookings';
  //   const keyColumn = 'id';
  //   const keyValue = req.params.id;
  
  //   const sqlQuery = `DELETE FROM ${tableName} WHERE ${keyColumn} = :id`;
  
  //   connectionPool.getConnection((err, connection) => {
  //     if (err) {
  //       console.error('Error acquiring Oracle Database connection:', err);
  //       res.status(500).json({ message: "Internal Server Error" });
  //       return;
  //     }
  
  //     connection.execute(sqlQuery, { id: keyValue }, { autoCommit: true }, (err, result) => {
  //       if (err) {
  //         console.error('Error deleting booking details:', err);
  //         res.status(500).send('Internal Server Error');
  //       } else {
  //         res.status(200).send('Deleted Successfully');
  //       }
  
  //       connection.close((err) => {
  //         if (err) {
  //           console.error('Error releasing Oracle Database connection:', err);
  //         }
  //       });
  //     });
  //   });
  // });






// Payments
  app.get("/api/payments", (req, res) => {
    // Query the database to retrieve user data
    db.query("SELECT * FROM Payments", (err, results) => {
      if (err) {
        console.error("MySQL query error:", err);
        res.status(500).json({ message: "Internal Server Error" });
      } else {
        res.status(200).json(results);
      }
    });
  });

  // ============ORALCE DB==============
  // app.get("/api/payments", (req, res) => {
  //   const sqlQuery = "SELECT * FROM Payments";
  
  //   connectionPool.getConnection((err, connection) => {
  //     if (err) {
  //       console.error('Error acquiring Oracle Database connection:', err);
  //       res.status(500).json({ message: "Internal Server Error" });
  //       return;
  //     }
  
  //     connection.execute(sqlQuery, {}, { resultSet: true }, (err, result) => {
  //       if (err) {
  //         console.error('Error retrieving payments data:', err);
  //         res.status(500).send('Internal Server Error');
  //       } else {
  //         const rows = result.getRows();
  //         res.status(200).json(rows);
  //       }
  
  //       connection.close((err) => {
  //         if (err) {
  //           console.error('Error releasing Oracle Database connection:', err);
  //         }
  //       });
  //     });
  //   });
  // });





  
  // Define the POST endpoint to save user data
  app.post("/api/payments", (req, res) => {
      const { bookingId, amount, method, status } = req.body;
    
      // Basic validation (you should perform more extensive validation)
      if (!bookingId || !amount || !method) {
        return res.status(400).json({ message: "Missing required fields" });
      }
    
      // Insert user data into the database
      const newPayment = {
        bookingId, amount, method, status
      };
    
      db.query("INSERT INTO Payments SET ?", newPayment, (err, result) => {
        if (err) {
          console.error("MySQL insert error:", err);
          res.status(500).json({ message: "Failed to save user data" });
        } else {
          res.status(201).json({ message: "Payment created successfully", newPayment });
        }
      });
    });

  //=============ORALCE DB==============
  // app.post("/api/payments", (req, res) => {
  //   const { bookingId, amount, method, status } = req.body;
  
  //   if (!bookingId || !amount || !method) {
  //     return res.status(400).json({ message: "Missing required fields" });
  //   }
  
  //   const newPayment = {
  //     bookingId, amount, method, status
  //   };
  
  //   const sqlQuery = `
  //     INSERT INTO Payments (bookingId, amount, method, status)
  //     VALUES (:bookingId, :amount, :method, :status)
  //   `;
  
  //   connectionPool.getConnection((err, connection) => {
  //     if (err) {
  //       console.error('Error acquiring Oracle Database connection:', err);
  //       res.status(500).json({ message: "Internal Server Error" });
  //       return;
  //     }
  
  //     connection.execute(sqlQuery, newPayment, { autoCommit: true }, (err, result) => {
  //       if (err) {
  //         console.error('Error inserting payment data:', err);
  //         res.status(500).json({ message: "Failed to save payment data" });
  //       } else {
  //         const insertedId = result.lastRowid;
  //         res.status(201).json({ message: "Payment created successfully", paymentId: insertedId, newPayment });
  //       }
  
  //       connection.close((err) => {
  //         if (err) {
  //           console.error('Error releasing Oracle Database connection:', err);
  //         }
  //       });
  //     });
  //   });
  // });



  
  // Define the PUT endpoint to update user data
  app.put("/api/payment/:id", (req, res) => {
      const id = req.params.id;
      const { bookingId, amount, method, status } = req.body;
    
      // Basic validation (you should perform more extensive validation)
      if (!bookingId || !amount || !method) {
        return res.status(400).json({ message: "Missing required fields" });
      }
    
    
      // Update user data in the database
      const updatedPayment = {
        bookingId, amount, method, status
      };
    
      db.query("UPDATE Payments SET ? WHERE id = ?", [updatedPayment, userId], (err, result) => {
        if (err) {
          console.error("MySQL update error:", err);
          res.status(500).json({ message: "Failed to update user data" });
        } else {
          res.status(200).json({ message: "Payment updated successfully", updatedPayment });
        }
      });
    });

  // ============= ORALCE DB================
  // app.put("/api/payment/:id", (req, res) => {
  //   const id = req.params.id;
  //   const { bookingId, amount, method, status } = req.body;
  
  //   if (!bookingId || !amount || !method) {
  //     return res.status(400).json({ message: "Missing required fields" });
  //   }
  
  //   const updatedPayment = {
  //     bookingId, amount, method, status
  //   };
  
  //   const sqlQuery = `
  //     UPDATE Payments
  //     SET bookingId = :bookingId, amount = :amount, method = :method, status = :status
  //     WHERE id = :id
  //   `;
  
  //   connectionPool.getConnection((err, connection) => {
  //     if (err) {
  //       console.error('Error acquiring Oracle Database connection:', err);
  //       res.status(500).json({ message: "Internal Server Error" });
  //       return;
  //     }
  
  //     connection.execute(sqlQuery, { ...updatedPayment, id }, { autoCommit: true }, (err, result) => {
  //       if (err) {
  //         console.error('Error updating payment data:', err);
  //         res.status(500).json({ message: "Failed to update payment data" });
  //       } else {
  //         res.status(200).json({ message: "Payment updated successfully", updatedPayment });
  //       }
  
  //       connection.close((err) => {
  //         if (err) {
  //           console.error('Error releasing Oracle Database connection:', err);
  //         }
  //       });
  //     });
  //   });
  // });





  
    app.get('/api/payment/:id', (req, res) => {
      const tableName = 'Payments';
      const keyColumn = 'id';
      const keyValue = req.params.id;
    
      const sqlQuery = `SELECT * FROM ${tableName} WHERE ${keyColumn} = ?`;
    
      db.query(sqlQuery, [keyValue], (err, results) => {
        if (err) {
          console.error('Error retrieving details:', err);
          res.status(500).send('Internal Server Error');
        } else {
          if (results.length > 0) {
            const details = results[0];
            res.json(details);
          } else {
            res.status(404).send('Not Found');
          }
        }
      });
    });

    // ===============ORALCE DB==================
    // app.get('/api/payment/:id', (req, res) => {
    //   const tableName = 'Payments';
    //   const keyColumn = 'id';
    //   const keyValue = req.params.id;
    
    //   const sqlQuery = `SELECT * FROM ${tableName} WHERE ${keyColumn} = :id`;
    
    //   connectionPool.getConnection((err, connection) => {
    //     if (err) {
    //       console.error('Error acquiring Oracle Database connection:', err);
    //       res.status(500).json({ message: "Internal Server Error" });
    //       return;
    //     }
    
    //     connection.execute(sqlQuery, { id: keyValue }, { resultSet: true }, (err, result) => {
    //       if (err) {
    //         console.error('Error retrieving payment details:', err);
    //         res.status(500).send('Internal Server Error');
    //       } else {
    //         const rows = result.getRows();
    //         if (rows.length > 0) {
    //           const details = rows[0];
    //           res.json(details);
    //         } else {
    //           res.status(404).send('Not Found');
    //         }
    //       }
    
    //       connection.close((err) => {
    //         if (err) {
    //           console.error('Error releasing Oracle Database connection:', err);
    //         }
    //       });
    //     });
    //   });
    // });







  
    app.get('/api/payments/:bookingId', (req, res) => {
      const tableName = 'Payments';
      const keyColumn = 'bookingId';
      const keyValue = req.params.bookingId;
    
      const sqlQuery = `SELECT * FROM ${tableName} WHERE ${keyColumn} = ?`;
    
      db.query(sqlQuery, [keyValue], (err, results) => {
        if (err) {
          console.error('Error retrieving details:', err);
          res.status(500).send('Internal Server Error');
        } else {
          if (results.length > 0) {
            res.status(200).json(results);
          } else {
            res.status(404).send('Not Found');
          }
        }
      });
    });

    // ===========ORACLE DB=============
    // app.get('/api/payments/:bookingId', (req, res) => {
    //   const tableName = 'Payments';
    //   const keyColumn = 'bookingId';
    //   const keyValue = req.params.bookingId;
    
    //   const sqlQuery = `SELECT * FROM ${tableName} WHERE ${keyColumn} = :bookingId`;
    
    //   connectionPool.getConnection((err, connection) => {
    //     if (err) {
    //       console.error('Error acquiring Oracle Database connection:', err);
    //       res.status(500).json({ message: "Internal Server Error" });
    //       return;
    //     }
    
    //     connection.execute(sqlQuery, { bookingId: keyValue }, { resultSet: true }, (err, result) => {
    //       if (err) {
    //         console.error('Error retrieving payments details:', err);
    //         res.status(500).send('Internal Server Error');
    //       } else {
    //         const rows = result.getRows();
    //         if (rows.length > 0) {
    //           res.status(200).json(rows);
    //         } else {
    //           res.status(404).send('Not Found');
    //         }
    //       }
    
    //       connection.close((err) => {
    //         if (err) {
    //           console.error('Error releasing Oracle Database connection:', err);
    //         }
    //       });
    //     });
    //   });
    // });



  
    app.delete('/api/payment/:id', (req, res) => {
      const tableName = 'Payments';
      const keyColumn = 'id';
      const keyValue = req.params.id;
    
      const sqlQuery = `DELETE FROM ${tableName} WHERE ${keyColumn} = ?`;
    
      db.query(sqlQuery, [keyValue], (err, results) => {
        if (err) {
          console.error('Error retrieving details:', err);
          res.status(500).send('Internal Server Error');
        } else {
          if (results.length > 0) {
            res.status(200).send('Deleted Successfully');
          } else {
            res.status(404).send('Not Found');
          }
        }
      });
    });

    // =============ORALCE DB=============
  //   app.delete('/api/payment/:id', (req, res) => {
  //     const tableName = 'Payments';
  //     const keyColumn = 'id';
  //     const keyValue = req.params.id;
    
  //     const sqlQuery = `DELETE FROM ${tableName} WHERE ${keyColumn} = :id`;
    
  //     connectionPool.getConnection((err, connection) => {
  //       if (err) {
  //           console.error('Error acquiring Oracle Database connection:', err);
  //           res.status(500).json({ message: "Internal Server Error" });
  //           return;
  //         }
    
  //         connection.execute(sqlQuery, { id: keyValue }, { autoCommit: true }, (err, result) => {
  //           if (err) {
  //             console.error('Error deleting payment details:', err);
  //             res.status(500).send('Internal Server Error');
  //           } else {
  //             res.status(200).send('Deleted Successfully');
  //           }
    
  //           connection.close((err) => {
  //             if (err) {
  //               console.error('Error releasing Oracle Database connection:', err);
  //             }
  //           });
  //         });
  //       });
  // });


// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
