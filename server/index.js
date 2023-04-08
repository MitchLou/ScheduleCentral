const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "password",
    database: "schedulecentral"
});

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    db.query(
        "SELECT * FROM allemployees WHERE username = ? AND password = ?", 
        [username, password], 
        (err, result) => {
            if (err) {
                res.send({err: err});
            }

            if (result.length > 0) {
                res.send(result);
            } else {
                res.send({ message: "Invalid username or password" });
            }
        }
    );
});

app.listen(3001, () => {
    console.log("yey, your server is running on port 3001");
});