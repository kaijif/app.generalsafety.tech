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
        setProcessingLogin(true)
        fetch('https://4yy6qslsrf.execute-api.us-east-1.amazonaws.com/default/login', { 
            method: "POST", 
            body: JSON.stringify(formJson),
            headers: {
                "Access-Control-Allow-Origin": 'https://4yy6qslsrf.execute-api.us-east-1.amazonaws.com/default/login',
                "Content-Type": "application/json"
              }
        }).then((response) => {
            response.json().then((json) => {
                setProcessingLogin(false)
                if (json["success"] === true) {
                    
                    setUsername(formJson["username"])
                    Cookies.set("username", formJson["username"])
                    setAuth(json["auth_cookie"])
                    Cookies.set("auth", json["auth_cookie"])
                } else {
                    setLoginFailed(true)
                }
            })
        })

    }
    if (!processingLogin) {
        return (
            <>
            <div className="header">
                <a href="https://nolyn.co">
                    <img src="https://www.nolyn.co/img/logo.svg" width={112} height={28} style={
                    {
                        "marginTop": "8px",
                        "marginLeft": "4px",
                        "marginRight": "4px",
                    "marginBottom": "4px",
                    "paddingLeft": "5px",
                    "paddingTop": "5px",
                    "paddingRight": "5px",
                    "paddingBottom": "5px"
                    }
                    }></img>
                </a>
            </div>
            <div className="text-center m-5-auto login-input">
                <form method="post" onSubmit={handleSubmit}>
                    <p>
                        <input type="text" name="username" class="login-input" placeholder="Username" required />
                    </p>
                    <p>
                        <input type="password" name="password" class="login-input" placeholder="Password" required />
                    </p>
                    <p>
                        <button id="sub_btn" type="submit" >Login</button>
                    </p>
                    <p>
                        {loginFailed ? <label>Invalid username or password</label> : <></>}
                    </p>
                </form>
            </div>
            </>
        )
    } else {
        return (
            <div className="container">
                <img src="https://nolyn.co/images/loading.gif" height={40} width={40} ></img>
                <h1 className="loading">logging in...</h1>
          </div>
        )
    }
}