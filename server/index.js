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
    methods: ["GET", "POST"],
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
      expires: 60 * 60 * 24,
    },
  })
);


const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "rockclimb53",
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
  db.query("SELECT * FROM allemployees", (err, result) => {
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

app.get("/login", (req, res) => {
    if (req.session.user) {
      res.send({ loggedIn: true, user: req.session.user });
    } else {
      res.send({ loggedIn: false });
    }
  });



  app.post("/create", (req, res) => {
    const name = req.body.name;
    const address= req.body.address;
    const username= req.body.username;
    const password= req.body.password;
    const phonenumber= req.body.phonenumber;
    const department= req.body.department;
    
    
    db.query(
        "INSERT INTO addemployees (name, address, username, password, phonenumber, department) VALUES (?,?,?,?,?,?)", 
        [name, address, username, password, phonenumber, department], 
        (err, result) => {
          if (err) {
            console.log(err);
          } else {
            res.send("Values Inserted");
          }
        }
    );
      });










app.listen(3001, () => {
    console.log("yey, your server is running on port 3001");
});