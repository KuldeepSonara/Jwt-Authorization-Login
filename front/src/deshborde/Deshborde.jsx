import React from 'react'
import "./Deshborde.scss";
import axios from "axios";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

// import axios from '../api';

function Deshborde({ user, setUser }) {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);


const refreshToken = async ()=>{
  try {
    const res = await axiosJWT.post("/refresh", {token: user.refreshToken});
    setUser({
      ...user,
      accessToken: res.data.accessToken,
      refreshToken : res.data.refreshToken,
    })
    return res.data;
  } catch (err) {
    console.log(err)
  }
}

const axiosJWT = axios.create() // create a new innstant

//Token refresh automatic evry 15m 
axiosJWT.interceptors.request.use(async (config) =>{
    let currentDate = new Date ();
    const decodeToken = jwtDecode(user.accessToken);
    if(decodeToken.exp * 1000 < currentDate.getTime()){
      const data = await refreshToken();
      config.headers["Authorization"] = "Bearer " + data.accessToken;
    }
    return config;
  },(error)=>{
    return Promise.reject(error);
  }) 

const handleDelete = async (id)=>{
  setSuccess(false);
  setError(false);
  try{
    await axiosJWT.delete("/users/"+id, {
      headers:{Authorization:"Bearer " + user.accessToken},
    })  
    setSuccess(true);
  }catch(err){
    setError(true);
  }
} 
  return (
    <div className='deshborde'>
        <div className="continer">
        <div className="bluer"></div>
          <div className="contenst">
            <p>Welcome to the <b>{user.isAdmin ? "admin" : "user"}</b> dashboard{" "}
                <b>{user.username}</b>.</p>
            <p>Delete Users:</p>
            <button className="btn kuldeep" type='submit' onClick={()=>handleDelete(1)}>Delete Kuldeep</button>
            <button className="btn user"type='submit'onClick={()=>handleDelete(2)}>Delete User</button>
            {error && (
                <span className="error">
                  You are not allowed to delete this user!
                </span>
            )}
            {success && (
                <span className="success">
                  User has been deleted successfully...
                </span>
            )}
            </div>
        </div>
    </div>
  );
}

export default Deshborde