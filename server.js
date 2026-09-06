const express = require("express");
const cors = require("cors");

const app = express();
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const db = new sqlite3.Database(
    path.join(__dirname, "weightData.db")
);

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.post("/save", (req, res) =>
{
    console.log("SERVER RECEIVED DATA");

    const workout = req.body.workout;
    const name = req.body.name;
    const weight = req.body.weight;

    db.run(
    `UPDATE weightInfo
     SET "${name}" = ?
     WHERE Workout = ?`,
    [weight, workout],
    function(err)
    {
        if (err)
        {
            console.log("SQL ERROR:", err);
            return res.status(500).send(err.message);
        }

        if (this.changes === 0)
        {
            console.log("No workout matched:", workout);
            return res.status(404).send("Workout not found");
        }

        console.log("Data saved to database!");
        return res.send("Saved!");
    }
    );
});

app.get("/workouts", (req, res) =>
{
    db.all(
        `
        SELECT *
        FROM weightInfo
        ORDER BY rowid ASC;
        `,
        [],
        (err, rows) =>
        {
            if (err)
            {
                console.error("SQL ERROR:", err);
                return res.status(500).json({error: err.message});
            }
            else
            {
                res.json(rows);
            }
        }
    );
});

app.listen(3000, "0.0.0.0",() =>
{
    console.log("Backend running on port 3000");
});