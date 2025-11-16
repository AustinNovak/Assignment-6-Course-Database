const express = require("express");
const sqlite3 = require("sqlite3").verbose();

const app = express();
app.use(express.json());

// Connect to database
const db = new sqlite3.Database("./database/university.db");

// GET all courses
app.get("/api/courses", (req, res) => {
    db.all("SELECT * FROM courses", (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// GET course by ID
app.get("/api/courses/:id", (req, res) => {
    db.get("SELECT * FROM courses WHERE id = ?", [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: "Course not found" });
        res.json(row);
    });
});

// POST new course
app.post("/api/courses", (req, res) => {
    const { courseCode, title, credits, description, semester } = req.body;

    if (!courseCode || !title || !credits || !description || !semester) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const sql = `
        INSERT INTO courses (courseCode, title, credits, description, semester)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.run(sql, [courseCode, title, credits, description, semester], function (err) {
        if (err) return res.status(500).json({ error: err.message });

        res.status(201).json({ id: this.lastID });
    });
});

// PUT update course
app.put("/api/courses/:id", (req, res) => {
    const { courseCode, title, credits, description, semester } = req.body;

    const sql = `
        UPDATE courses
        SET courseCode = ?, title = ?, credits = ?, description = ?, semester = ?
        WHERE id = ?
    `;

    db.run(sql, [courseCode, title, credits, description, semester, req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: "Course not found" });

        res.json({ message: "Course updated successfully" });
    });
});

// DELETE course
app.delete("/api/courses/:id", (req, res) => {
    db.run("DELETE FROM courses WHERE id = ?", [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: "Course not found" });

        res.json({ message: "Course deleted successfully" });
    });
});

// Start server
app.listen(3000, () => console.log("Server running on port 3000"));
