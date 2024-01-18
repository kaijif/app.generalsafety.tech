import * as React from 'react'
import ReactDOM from 'react-dom/client'
import { useState, useEffect } from "react";
import './output.css'
import { ColumnDef, useReactTable } from '@tanstack/react-table'
import 'video.js/dist/video-js.css';
import Cookies from 'js-cookie'
import LoginScreen from "./login"
import { get } from 'cypress/types/lodash';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

function App() { 
  
  return <div className="text-teal-700 p-16">hello</div>
}

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);