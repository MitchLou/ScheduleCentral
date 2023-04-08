import React, {useEffect, useState} from "react";
import Axios from "axios";


function Admin() {
  const [loginInfo, setLoginInfo] = useState('');

  useEffect(() => {
    Axios.get("http://localhost:3001/login").then((response) => {
      if (response.data.loggedIn == true) {
        setLoginInfo(response.data.user[0].username);
      }
    });
  }, [])

  return (
    <div>
    <h3>{loginInfo}</h3>
    <h3>Admin</h3>
    </div>
  )
}

export default Admin;