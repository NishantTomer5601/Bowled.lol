import React from 'react';
import './components/tailwind.css'; 
import { Routes, Route, Link } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Home from './components/Home';
import Play from './components/Play';

function App() {
  return (
    <>          
      <Routes>
        <Route path='/' element={<Home/>} /> 
        <Route path="/login" element={<Login />} /> 
        <Route path="/signup" element={<Signup />} /> 
        <Route path='/play' element={<Play />} />  
      </Routes>
    </>
  );
}

export default App;