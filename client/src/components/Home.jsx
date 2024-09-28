import React, { useEffect, useState } from 'react'
import { Search, ShoppingCart, Menu, ArrowLeft, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { auth, onAuthStateChanged } from '../firebase';
import { signOut } from 'firebase/auth';

function Home() {
    const [user , setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if(currentUser){
                setUser(currentUser);
            }
            else{
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleLogout =async () => {
        try{
            await signOut(auth);
            setUser(null);
            Navigate('/');
        }
        catch(error){
            console.log("Logout Failed: ", error);
        }
    };


    return (
        <div className="min-h-screen bg-black text-white relative">
          {/* Background image with overlay */}
          <div className="absolute inset-0">
            <img 
              src="/images/scenic_img.webp" 
              alt="Background" 
              className="w-full h-full object-cover" 
            />
          </div>
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          
          
          <div className="relative z-10">
            {/* Navigation */}
            <nav className="flex justify-between items-center p-4">
              <div className="text-2xl font-bold mx-5 my-2">Bowled</div>
              
              <div className="flex items-center space-x-4">
                
                <div className="relative">
                </div>
                {user ? (
                    <div className="flex items-center">
                        <span className="text-green-400 mr-4">Welcome, {user.displayName || "User"}</span>
                        <button
                        onClick={handleLogout}
                        className="text-red-400 hover:text-red-300 bg-gray-800 px-4 py-2 rounded-md"
                        >
                        Logout
                        </button>
                    </div>
                    ) : (
                    <div className=''>
                        <Link to="/login" className="text-green-400 hover:text-green-300 mr-4">Sign In</Link>
                        <Link to="/signup" className="text-green-400 hover:text-green-300">Sign Up</Link>
                    </div>
                    )}
              </div>
            </nav>
      
            {/* Hero Section */}
            <div className="relative h-[calc(100vh-80px)]">
              <div className="flex flex-col justify-center items-center h-full text-center px-4">
                <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-wider">
                  BOWLED<br />
                </h1>
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
            
            
          </div>
        </div>
      )
}

export default Home;