import './Login.css'
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
            <div className='login-container'>
        
            <div className='toptab'>                
                <img className="LOGO" src={require('./logo1116v2.png')} />  
            </div> 

            <div className ="login">
            <h3 id = "signIn">Sign In</h3>
            
            <form>

            <div id = "boxing">
            <input className = "varr"
            type = "text" 
            placeholder = "Username"
            onChange={(e) => {
                setUsername(e.target.value);
            }} 
            />
            </div>

            <div id = "boxing">
            <input className = "varr"
             type = "text"
             placeholder = "Password"
             onChange={(e) => {
                 setPassword(e.target.value);
             }}
              />
            </div>
            <button className="submit" onClick={login}>Login</button>

            <h3>{loginInfo}</h3>
            </form>
            </div>
            <i className="glyphicon glyphicon-user w3-text-teal"></i>
        </div>
    );
}

export default Login;