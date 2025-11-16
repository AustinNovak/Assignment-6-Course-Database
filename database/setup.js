const sqlite3 = require("sqlite3").verbose();

// Create database file
const db = new sqlite3.Database("./database/university.db", (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Database created: university.db");
  }
});

// Create courses table
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      courseCode TEXT NOT NULL,
      title TEXT NOT NULL,
      credits INTEGER NOT NULL,
      description TEXT NOT NULL,
      semester TEXT NOT NULL
    )
  `, (err) => {
    if (err) {
      console.error("Error creating table:", err.message);
    } else {
      console.log("Table 'courses' created successfully.");
    }
  });
});

// Close database
db.close();
