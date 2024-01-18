import * as React from 'react'
import ReactDOM from 'react-dom/client'
import { useState, useEffect } from "react";
import './index.css'
import 'react-base-table/styles.css'
import BaseTable, { Column, ColumnShape } from 'react-base-table'
import Plyr from "plyr-react"
import "plyr-react/plyr.css"
import Cookies from 'js-cookie'
import LoginScreen from "./login"
import Modal from 'react-modal';

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
  new ColumnObject({key:"time", dataKey:"time", title:"Incident Time", width: window.innerWidth / 5}),
  new ColumnObject({key:"bus_number", dataKey:"bus_number", title:"Bus Number", sortable:true, width: window.innerWidth / 5}),
  new ColumnObject({key:"saw_motion", dataKey:"saw_motion", title:"Violation?", width: window.innerWidth / 5}),
  new ColumnObject({key:"link", dataKey:"link", title:"Video", width: window.innerWidth / 5})
]



class Row {
  date: string;
  time: string;
  bus_number: string;
  saw_motion: boolean;
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
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [modalData, setModalData] = React.useState(null);
  function openModal(url) {
    console.log(url)
    setIsOpen(true);
    setModalData({
      type: "video",
      sources: [
        {
          src: url,
          type: "video/mp4",
          size: 720,
        }
      ]
    })
  }
  
  function closeModal() {
    setIsOpen(false);
  }
  let auth_raw = Cookies.get("auth")
  if (auth_raw !== undefined && auth === null){
    setAuth(auth_raw)
  }

  let uname_raw = Cookies.get("username")
  if (uname_raw !== undefined && username === null) {
    setUsername(uname_raw)
  }

  let loggedIn = auth === null || username === null ? false : true

  useEffect(() => {
    
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
          if (json.length > 0) {
            json.forEach(item => {
              const url = item["link"]
              item["link"] = <button onClick={() => {openModal(url)}}>Review</button>
              item["date_sort"] = new Date(item["date"].toString().substring(0,4), parseInt((item["date"] - 100).toString().substring(4, 6)), item["date"].toString().substring(6, 8), item["time"].toString().substring(0,2), item["time"].toString().substring(2,4), item["time"].toString().substring(4,6))
              new Date()
              item["date"] = item["date_sort"].toDateString()
              item["time"] = item["date_sort"].toTimeString()
              item["saw_motion"] = item["saw_motion"] ? "‼️" : "✅"
            })
            json.sort((a, b) => {
              
              return (a.date_sort - b.date_sort).valueOf();
            }).reverse()
          }

          setS3Data(json)
          setLoaded(true)
        })  
      })
    } else {
      
    }
  }, [pageNumber, auth])

  if (!loggedIn) {
    return(
      <LoginScreen username={username} setUsername={setUsername} password={password} setPassword={setPassword} setAuth={setAuth}/>
    )
  }
  else if (loggedIn && !loaded) {
    
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
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={() => {}}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
        className="Modal"
      >
        <div><Plyr source={modalData}/></div>
      </Modal>
      </>
      )
  } else {
    
  }
}

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
