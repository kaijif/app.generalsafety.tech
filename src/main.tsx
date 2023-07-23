import * as React from 'react'
import ReactDOM from 'react-dom/client'
import { useState, useEffect } from "react";
import './index.css'
import 'react-base-table/styles.css'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import ReactPlayer from 'react-player'
import BaseTable, { Column, ColumnShape } from 'react-base-table'
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import Cookies from 'js-cookie'
import LoginScreen from "./login"

class ColumnObject {
  key: string;
  dataKey: string;
  title: string;
  width: number;
  sortable: boolean=false;
  public constructor(init?:Partial<ColumnObject>) {
    Object.assign(this, init);
  }
}

let columns: ColumnObject[] = [
  new ColumnObject({key:"date", dataKey:"date", title:"Incident Date", sortable:true, width: window.innerWidth / 5}),
  new ColumnObject({key:"time", dataKey:"time", title:"Incident Time", width: window.innerWidth * 2 / 5}),
  new ColumnObject({key:"bus_number", dataKey:"bus_number", title:"Bus Number", sortable:true, width: window.innerWidth / 5}),
  new ColumnObject({key:"link", dataKey:"link", title:"Video", width: window.innerWidth / 5})
]



class Row {
  date: string;
  time: string;
  bus_number: string;
  link: string;
  public constructor(init?:Partial<Row>) {
    Object.assign(this, init);
  }
}

let data: Row[] = [
  new Row({date: "2023/07/19", time: "7:06 PM", bus_number: "424", link: <a href="https://www.youtube.com"> Play </a>})
]

// let column: ColumnShape = {
//   key: "name",
//   width: 
// }

function App() {
  const [loaded, setLoaded] = useState(false)
  const [pageNumber, setPageNumber] = useState(1)
  const [auth, setAuth] = useState(null)
  const [username, setUsername] = useState(null)
  const [password, setPassword] = useState(null)
  const [s3Data, setS3Data] = useState(null)

  let auth_raw = Cookies.get("auth")
  if (auth_raw === undefined) {
    console.log("no auth cookie")
  } else if (auth === null){
    setAuth(auth_raw)
  } else {
    console.log("auth set up")
  }

  let uname_raw = Cookies.get("username")
  if (uname_raw === undefined) {
    console.log("no username cookie")
  } else if (username === null) {
    setUsername(uname_raw)
  } else {
    console.log("username set up")
  }

  let loggedIn = auth === null || username === null ? false : true

  useEffect(() => {
    console.log(loggedIn)
    if (loggedIn) {
      fetch(
        "https://4yy6qslsrf.execute-api.us-east-1.amazonaws.com/default/dbAPI/" + username,
        {
          method: "POST",
          mode: "cors",
          body: JSON.stringify({
            page_number: pageNumber
          }),
          headers: {
            "Authorization":auth,
            "Access-Control-Allow-Origin": "https://4yy6qslsrf.execute-api.us-east-1.amazonaws.com/default/dbAPI/" + username,
            "Content-Type": "application/json"
          }
        }
      ).then((response) => {
        response.json().then((json) => {
            json.forEach(item => {
              console.log(item)
              item["link"] = <a href={item["link"]}>Download</a>
              console.log(item["date"].toString().substring(0,4), item["date"].toString().substring(4, 6), item["date"].toString().substring(6, 8))
              let date = new Date(item["date"].toString().substring(0,4), item["date"].toString().substring(4, 6), item["date"].toString().substring(6, 8), item["time"].toString().substring(0,2), item["time"].toString().substring(2,4), item["time"].toString().substring(4,6))
              item["date"] = date.toDateString()
              item["time"] = date.toTimeString()
            })
          setS3Data(json)
          setLoaded(true)
        })  
      })
    } else {
      console.log("data getter awaiting login")
    }
  }, [pageNumber, auth])

  if (!loggedIn) {
    return(
      <LoginScreen username={username} setUsername={setUsername} password={password} setPassword={setPassword} setAuth={setAuth}/>
    )
  }
  else if (loggedIn && !loaded) {
    console.log("not loaded")
    return (
      <>
        <div className="container">
          <img src="https://generalsafety.tech/images/loading.gif" height={40} width={40} ></img>
          <p className="loading">loading...</p>
        </div>
      </>
    )
  }
  else if (loggedIn && loaded) {
    console.log("loaded?")
    console.log(s3Data[0]["link"]["props"]["href"])
    return (
      <>
      <div className="header">
        <a href="https://generalsafety.tech"><img src="https://generalsafety.tech/images/logos/logo.svg" width={112} height={28} style={
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
        }></img></a>
        <button style={
          {
            "justifyContent": "flex-end",
            "height": 28,
            "width": 112,
            "marginTop": "8px",
            "marginLeft": "4px",
            "marginRight": "4px",
           "marginBottom": "4px",
           "paddingLeft": "5px",
           "paddingTop": "5px",
           "paddingRight": "5px",
           "paddingBottom": "5px"
          }
        } onClick={() => {
          Cookies.remove("auth")
          Cookies.remove("username")
          setAuth(null)

        }}>Log out</button>
      </div>
      <BaseTable data={s3Data} width={window.innerWidth} height={window.innerHeight - 50} columns={columns}></BaseTable>
      </>
      )
  } else {
    console.log("what?")
  }
}

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
