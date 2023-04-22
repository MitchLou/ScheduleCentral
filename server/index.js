const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");


app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    key: "userId",
    secret: "testing",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: null
    },
  })
);


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
      "SELECT * FROM login_info WHERE username = ? AND password = ?", 
      [username, password], 
      (err, result) => {
          if (err) {
              res.send({err: err});
          }

          if (result.length > 0) {
              req.session.user = result;
              console.log(req.session.user);
              res.send(result);
          } else {
              res.send({ message: "Invalid username or password" });
          }
      }
  );
});

app.get("/employees", (req, res) => {
  db.query("SELECT * FROM all_employees", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.get("/schedule", (req, res) => {
  db.query("SELECT * FROM schedules", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.put("/update", (req, res) => {
  const id = req.body.id;
  const workDate = req.body.workDate;
  const workStart = req.body.workStart;
  const workEnd = req.body.workEnd;
  const oldDate = req.body.oldDate;
  const employeeID = req.body.employee_ID;

  console.log(req.body.workDate);
  db.query(
    "UPDATE schedules SET work_date = ?, start_work_hour = ?, end_work_hour = ? WHERE id = ? AND work_date = ?",
    [workDate, workStart, workEnd, id, oldDate],
    (err, result) => {
      if (err) {
        db.query(
          "INSERT INTO schedules (employee_ID, work_date, start_work_hour, end_work_hour) VALUES (?,?,?,?)", 
          [employeeID, workDate, workStart, workEnd], 
          (err, result) => {
            if (err) {
              console.log(err);
            } else {
              res.send("Values Inserted");
            }
          }
      );
      } else {
        res.send(result);
      }
    }
  );
});

app.get("/login", (req, res) => {
    if (req.session.user) {
      res.send({ loggedIn: true, user: req.session.user });
    } else {
      res.send({ loggedIn: false });
    }
  });



  app.post("/create", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const role = req.body.role;
  
    db.query(
        "INSERT INTO login_info (username, password, role) VALUES (?,?,?)", 
        [username, password, role], 
        (err, result) => {
          if (err) {
            console.log(err);
          } else {
            res.send("Values Inserted");
          }
        }
    );
      });



app.listen(3001, (req, res) => {
    console.log("yey, your server is running on port 3001");
});