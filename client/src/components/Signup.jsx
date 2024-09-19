import React, { useState } from 'react';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try{
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await updateProfile(user, {
            displayName: firstname,
        });

        navigate('/');
        console.log('Signup SUccessful, user:', user);
    }
    catch (error) {
        console.error('Signup failed', error);
        setError(error.message);
      }
  };

  const handleGoogleLogin = async () =>{
    try{
        await signInWithPopup(auth, googleProvider);
        navigate('/');
    }
    catch(error){
        setError(error.message);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-4">
        <Link to="/" className="text-2xl font-bold">Stumple</Link>
        <Link to="/" className="text-green-400 hover:text-green-300">Back to Home</Link>
      </nav>

      {/* Signup Form and Image */}
      <div className="flex-grow flex flex-col md:flex-row-reverse">
        {/* Image Section */}
        <div className="md:w-1/2 relative">
          <img
            src="https://pbs.twimg.com/media/FwbX_g1akAEZaS9.jpg:large"
            alt="Gym equipment"
            className="absolute inset-0 w-full h-full object-cover brightness-50"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white text-center px-4">
              {/* We can add heading in here  */}
            </h1>
          </div>
        </div>

        {/* Signup Form Section */}
        <div className="md:w-1/2 flex items-center justify-center px-4 py-12 md:py-0">
          <div className="w-full max-w-md">
            <h2 className="text-3xl font-bold mb-6 text-center">Create Your Account</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="firstname" className="block text-sm font-medium mb-2">First Name</label>
                <input
                  type="text"
                  id="firstname"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                  required
                />
              </div>
              <div>
                <label htmlFor="lastname" className="block text-sm font-medium mb-2">Last Name</label>
                <input
                  type="text"
                  id="lastname"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center items-center px-4 py-2 bg-green-400 text-black rounded-md hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400"
                >
                  Sign Up
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </div>
            </form>

            <br/>
            {/* Google Login Button */}
            <button
                onClick={handleGoogleLogin}
                className="w-full max-w-md flex justify-center items-center mb-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                Login with Google
            </button>
            <p className="mt-6 text-center text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-green-400 hover:text-green-300 font-medium">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}