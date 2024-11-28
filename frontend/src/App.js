import logo from './logo.svg';
import React from 'react';
import { AuthProvider } from './context/AuthContext';
import './App.css';
import Toolbar from './components/Toolbar';
import { AuthContext } from './context/AuthContext';

function App() {

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {Toolbar}
        <p>
          dddddddfff
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
