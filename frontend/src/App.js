import React from 'react';
import { AuthProvider } from './context/AuthContext';
import './App.css';
import Toolbar from './components/Toolbar';
import MainPage from './components/page/MainPage';

function App() {

  return (
    <AuthProvider> 
      <div>
        <Toolbar />
        <MainPage />
      </div>
    </AuthProvider>
  );
}

export default App;
