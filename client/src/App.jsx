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
        <Route path='/' element={<Home/>} /> {/* Route for Home component */}
        <Route path="/login" element={<Login />} /> {/* Route for Login component */}
        <Route path="/signup" element={<Signup />} /> {/* Route for Login component */}
        <Route path='/play' element={<Play />} />  {/* Route for main gameplay */}
      </Routes>
    </>
  );
}

export default App;