import "./Login.css";
import React, { useEffect, useState } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import Popup from "./Popup";

function Login() {
  let navigate = useNavigate();

  const [usernameReg, setUsernameReg] = useState("");
  const [passwordReg, setPasswordReg] = useState("");
  const [buttonPopup, setButtonPopup] = useState(false);

  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [loginStatus, setLoginStatus] = useState("");
  const [role, setRole] = useState(null);

  Axios.defaults.withCredentials = true;

  const register = () => {
    Axios.post("http://localhost:3001/register", {
      username: usernameReg,
      password: passwordReg,
      name: name,
      position: position,
      department: department,
      role: role,
    }).then((response) => {
      console.log(response);
    });
  };

  const login = () => {
    Axios.post("http://localhost:3001/login", {
      username: username,
      password: password,
    })
      .then((response) => {
        if (response.data.message) {
          setLoginStatus(response.data.message);
        } else {
          setLoginStatus(response.data[0].username);
          navigate("/");
        }
      })
      .catch((error) => {
        console.log(error);
        setLoginStatus("Error: " + error.message);
      });
  };

  useEffect(() => {
    Axios.get("http://localhost:3001/login").then((response) => {
      if (response.data.loggedIn == true) {
        setLoginStatus(response.data.user[0].username);
        navigate("/");
      }
    });
  }, []);

  return (
    <div className="login-container">
      <div className="toptab">
        <img className="LOGO" src={require("./logo1116v2.png")} />
      </div>

      <div className="login">
        <h3 id="signIn">Sign In</h3>

        <div id="boxing">
          <input
            className="varr"
            type="text"
            placeholder="Username"
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
        </div>

        <div id="boxing">
          <input
            className="varr"
            type="text"
            placeholder="Password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>
        <button className="submit" onClick={login}>
          Login
        </button>

        <h3 className="login-status">{loginStatus}</h3>


        <div className="Information">
          <main>
            <button className="submit" onClick={() => setButtonPopup(true)}>
              Register
            </button>
          </main>
          <Popup trigger={buttonPopup} setTrigger={setButtonPopup}>
            <label>Full Name:</label>
            <input
              type="text"
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
            <label>Position:</label>
            <input
              type="text"
              onChange={(e) => {
                setPosition(e.target.value);
              }}
            />

            <label htmlFor="department">Department:</label>
            <select
              id="department"
              onChange={(e) => {
                setDepartment(e.target.value);
              }}
            >
              <option value="0"></option>
              <option value="Nursing">Nursing</option>
              <option value="Bookeeping">Bookeeping</option>
              <option value="HR">HR</option>
            </select>
            <label>Username</label>
            <input
              type="text"
              onChange={(e) => {
                setUsernameReg(e.target.value);
              }}
            />
            <label>Password</label>
            <input
              type="text"
              onChange={(e) => {
                setPasswordReg(e.target.value);
              }}
            />
            <button onClick={register}> Register </button>
          </Popup>
        </div>
      </div>
      <i className="glyphicon glyphicon-user w3-text-teal"></i>
    </div>
  );
}

export default Login;
