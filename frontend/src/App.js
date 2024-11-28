import logo from './logo.svg';
import React from 'react';
import { AuthProvider } from './context/AuthContext';
import './App.css';
import axios from "axios";
import Toolbar from './components/Toolbar';
import { AuthContext } from './context/AuthContext';

function App() {
  axios.get("/test")
  .then((response) => console.log(response.data))
  .catch((error) => console.log(error));
  return (
    <div>

    </div>
  );
}

export default App;
