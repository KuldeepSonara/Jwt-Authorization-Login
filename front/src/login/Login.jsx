import React from 'react'
import { useState } from "react";
import PropTypes from 'prop-types'
import "./Login.scss";
import axios from '../api';

function Login ({setUser})  {
    const[username,setusername] = useState("");
    const[password,setpassword] = useState("");
    


    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const res = await axios.post("/login", { username, password });
        setUser(res.data);
      } catch (err) {
        console.log(err);
      }
    };
  return (
    <div class="login" >
      <header>JWT TOKEN Authorization<br/><small style={{fontSize: "10px"}}> &#169; Kuldeep Sonara</small></header>
	<h1>Login</h1>
    <form method="post" onSubmit={handleSubmit}>
    	<input type="text" name="u" placeholder="Username" required="required" onChange={(e)=>setusername(e.target.value)}/>
        <input type="password" name="p" placeholder="Password" required="required"  onChange={(e)=>setpassword(e.target.value)} />
        <button type="submit" class="btn">Let me in.</button>
    </form>
</div>
  )
}

Login.propTypes = {
  setUser: PropTypes.func.isRequired,
}

export default Login