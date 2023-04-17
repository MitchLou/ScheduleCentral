//import './Login.css'
import React, {useEffect, useState} from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";


function Login() {
    let navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginInfo, setLoginInfo] = useState('');

    Axios.defaults.withCredentials = true;

    const login = () => {
        Axios.post('http://localhost:3001/login', {
            username: username,
            password: password,
        }).then((response) => {
            if (response.data.message) {
                setLoginInfo(response.data.message);
                console.log(response.data.message);
            } else {
                navigate("/")
            }
        }
        );
    };
    
    useEffect(() => {
        Axios.get("http://localhost:3001/login").then((response) => {
          if (response.data.loggedIn == true) {
            navigate("/")
          }
        });
      }, []);

    return (
        <div className="App">
            <div className = "Toptab"></div>
            <h1>Schedule Central</h1>
            <input
            type = "text" 
            placeholder = "Username"
            onChange={(e) => {
                setUsername(e.target.value);
            }} 
            />
            <input
             type = "text"
             placeholder = "Password"
             onChange={(e) => {
                 setPassword(e.target.value);
             }}
              />
            <button onClick={login}>Login</button>

            <h3>{loginInfo}</h3>
        </div>
    );
}

export default Login;