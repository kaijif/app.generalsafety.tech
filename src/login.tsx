import * as React from 'react'
import ReactDOM from 'react-dom/client'
import { useState, useEffect } from "react"
import './index.css'
import Cookies from 'js-cookie'

export default function SignInPage({ username, setUsername, password, setPassword, setAuth }) {
    const [processingLogin, setProcessingLogin] = useState(false)
    const [loginFailed, setLoginFailed] = useState(false)
    function handleSubmit(e) {
        // Prevent the browser from reloading the page
        e.preventDefault()
    
        // Read the form data
        const form = e.target
        const formData = new FormData(form)
    
        // You can pass formData as a fetch body directly:
    
        // Or you can work with it as a plain object:
        const formJson = Object.fromEntries(formData.entries())
        console.log(formJson)
        setProcessingLogin(true)
        fetch('https://4yy6qslsrf.execute-api.us-east-1.amazonaws.com/default/login', { 
            method: "POST", 
            body: JSON.stringify(formJson),
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json"
              }
        }).then((response) => {
            response.json().then((json) => {
                setProcessingLogin(false)
                if (json["success"] === true) {
                    console.log("login successful")
                    setUsername(formJson["username"])
                    Cookies.set("username", formJson["username"])
                    setAuth(json["auth_cookie"])
                    Cookies.set("auth", json["auth_cookie"])
                } else {
                    console.log("login failed")
                    setLoginFailed(true)
                }
            })
        })

    }
    if (!processingLogin) {
        return (
            <div className="text-center m-5-auto">
                <h2>Sign in</h2>
                <form method="post" onSubmit={handleSubmit}>
                    <p>
                        <label>Username</label><br/>
                        <input type="text" name="username" required />
                    </p>
                    <p>
                        <label>Password</label>
                        <br/>
                        <input type="password" name="password" required />
                    </p>
                    <p>
                        <button id="sub_btn" type="submit" >Login</button>
                    </p>
                    <p>
                        {loginFailed ? <label>Invalid username or password</label> : <></>}
                    </p>
                </form>
            </div>
        )
    } else {
        return (
            <h1>
                Logging in...
            </h1>
        )
    }
}