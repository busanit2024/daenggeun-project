import logo from './logo.svg';
import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import './App.css';
import Toolbar from './components/Toolbar';
import { AuthContext } from './context/AuthContext';

function App() {
  const [ isLoggedIn, setIsLoggedIn ] = useState(false);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      <Toolbar />
        <div className="App">
              <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
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
    </AuthContext.Provider>
  );
};

export default App;
