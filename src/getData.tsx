import {Row} from "./types"
import * as React from 'react'

export function getData(pageNumber, auth, username, setS3Data, setLoaded) {
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
            item["link"] = <a href={item["link"]}>Download</a>
            item["date_sort"] = new Date(item["date"].toString().substring(0,4), parseInt((item["date"] - 100).toString().substring(4, 6)), item["date"].toString().substring(6, 8), item["time"].toString().substring(0,2), item["time"].toString().substring(2,4), item["time"].toString().substring(4,6))
            new Date()
            item["date"] = item["date_sort"].toDateString()
            item["time"] = item["date_sort"].toTimeString()
            item["saw_motion"] = item["saw_motion"] ? "‼️" : "✅"
          })
          var s3Out = json.map((item) => {
            return new Row(item)
          })
          s3Out.sort((a, b) => {
            return (a.date_sort - b.date_sort).valueOf();
          }).reverse()
        }
  
        setS3Data(json)
        setLoaded(true)
      })  
    })
  }