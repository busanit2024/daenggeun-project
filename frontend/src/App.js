import './App.css';
import React, {useState} from 'react';
import MainPage from './components/page/MainPage';
import {
  BrowserRouter,  
  Routes,
  Route
} from "react-router-dom";
import Navigation from './components/navigation/Navigation';


function App() {

  return (
    <BrowserRouter>
    <Navigation />
    <Routes>
      <Route index element={<MainPage />} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;
