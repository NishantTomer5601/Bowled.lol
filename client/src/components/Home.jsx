import React, { useEffect, useState } from 'react';
import { Search, ShoppingCart, Menu, ArrowLeft, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { auth, onAuthStateChanged } from '../firebase';
import { signOut } from 'firebase/auth';
import ThreeBackground from '../threejs/ThreeBackground.jsx';

function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      Navigate('/');
    } catch (error) {
      console.log('Logout Failed: ', error);
    }
  };

  return (
    <div>
      {/* Ensure the 3D canvas is always on top */}
      <ThreeBackground />

      {/* Main Content */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="flex justify-between items-center p-4 ">
          <div className="text-2xl font-bold">Bowled</div>
          <div className="hidden md:flex space-x-6">
            <Link to="/" className="text-green-400">
              Home
            </Link>
            <Link to="/shop">Shop</Link>
            <Link to="/blog">Blog</Link>
            <Link to="/contact">Contact</Link>
          </div>
          <div className="flex items-center space-x-4">
            <Search className="h-6 w-6" />
            <div className="relative">
              <ShoppingCart className="h-6 w-6" />
              <span className="absolute -top-2 -right-2 bg-red-500 rounded-full w-4 h-4 text-xs flex items-center justify-center">
                1
              </span>
            </div>
            {user ? (
              <div className="flex items-center">
                <span className="text-green-400 mr-4">Welcome, {user.displayName || 'User'}</span>
                <button
                  onClick={handleLogout}
                  className="text-red-400 hover:text-red-300 bg-gray-800 px-4 py-2 rounded-md"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div>
                <Link to="/login" className="text-green-400 hover:text-green-300 mr-4">
                  Sign In
                </Link>
                <Link to="/signup" className="text-green-400 hover:text-green-300">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* Hero Section */}
        <div className="relative h-[calc(100vh-80px)]">
          <div className="flex flex-col justify-center items-center h-full text-center px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-wider">
              Guess the Cricketer!
              <br />
            </h1>
            <p className="mb-8 max-w-2xl">Bowled is a dynamic platform for interactive online game centered around cricket.</p>
            <div className="flex space-x-4">
              <button className="bg-green-400 text-black px-6 py-2 rounded-full font-semibold hover:bg-green-500 transition duration-300">
                <Link to="/play">START NOW</Link>
              </button>
              <button className="border border-white px-6 py-2 rounded-full font-semibold hover:bg-white hover:text-black transition duration-300">
                LEARN MORE
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4">
          <button className="bg-white bg-opacity-20 p-2 rounded-full hover:bg-opacity-30 transition duration-300">
            <ArrowLeft className="h-6 w-6" />
          </button>
          <button className="bg-white bg-opacity-20 p-2 rounded-full hover:bg-opacity-30 transition duration-300">
            <ArrowRight className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;