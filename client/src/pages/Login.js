//import './Login.css'
import React, {useState} from "react";
import Axios from "axios";

function Login() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');

    const login = () => {
        Axios.post('http://localhost:3001/login', {
            username: username,
            password: password,
        }).then((response) => {
            if (response.data.message) {
                setLoginError(response.data.message);
                console.log(response.data.message);
            }
        }
        );
    };
    
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

            <h3>{loginError}</h3>
        </div>
    );
}

export default Login;