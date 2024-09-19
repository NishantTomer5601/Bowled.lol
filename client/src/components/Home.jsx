import React from 'react'
import { Search, ShoppingCart, Menu, ArrowLeft, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

function Home() {
    return (
        <div className="min-h-screen bg-black text-white relative">
          {/* Background image with overlay */}
          <div className="absolute inset-0">
            <img 
              src="https://i.pinimg.com/originals/c4/65/82/c46582ce47545bbd39cbea2866a07807.jpg" 
              alt="Background" 
              className="w-full h-full object-cover opacity-60" 
            />
          </div>
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          
          {/* Main Content */}
          <div className="relative z-10">
            {/* Navigation */}
            <nav className="flex justify-between items-center p-4">
              <div className="text-2xl font-bold">Stumple</div>
              <div className="hidden md:flex space-x-6">
                <Link to="/" className="text-green-400">Home</Link>
                <Link to="/shop">Shop</Link>
                <Link to="/blog">Blog</Link>
                <Link to="/contact">Contact</Link>
              </div>
              <div className="flex items-center space-x-4">
                <Search className="h-6 w-6" />
                <div className="relative">
                  <ShoppingCart className="h-6 w-6" />
                  <span className="absolute -top-2 -right-2 bg-red-500 rounded-full w-4 h-4 text-xs flex items-center justify-center">1</span>
                </div>
                <Link to="/login" className="text-white hover:text-green-400">Login</Link> {/* Login link */}
                <Link to="/signup" className="text-white hover:text-green-400">Signup</Link> {/* Signup link */}
                <Menu className="h-6 w-6 md:hidden" />
              </div>
            </nav>
      
            {/* Hero Section */}
            <div className="relative h-[calc(100vh-80px)]">
              <div className="flex flex-col justify-center items-center h-full text-center px-4">
                <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-wider">
                  Guess the Cricketer!<br />
                </h1>
                <p className="mb-8 max-w-2xl">
                    Stumple is a dynamic platform for interactive online game centered around cricket.
                </p>
                <div className="flex space-x-4">
                  <button className="bg-green-400 text-black px-6 py-2 rounded-full font-semibold hover:bg-green-500 transition duration-300">
                    START NOW
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
      )
}

export default Home;