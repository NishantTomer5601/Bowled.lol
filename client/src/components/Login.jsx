import React, { useState } from 'react';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            navigate('/');
            console.log('Login Successfull', user);
        })
        .catch((error) => {
            console.log("Login Failed", error)
            setError('Invalid email or password');
        })
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-4">
        <Link to="/" className="text-2xl font-bold">Stumple</Link>
        <Link to="/" className="text-green-400 hover:text-green-300">Back to Home</Link>
      </nav>

      {/* Login Form and Image */}
      <div className="flex-grow flex flex-col md:flex-row">
        {/* Image Section */}
        <div className="md:w-1/2 relative">
          <img
            src="https://pbs.twimg.com/media/FwbX_g1akAEZaS9.jpg:large"
            alt="Gym equipment"
            className="absolute inset-0 w-full h-full object-cover brightness-50"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white text-center px-4">
              
            </h1>
          </div>
        </div>

        {/* Login Form Section */}
        <div className="md:w-1/2 flex items-center justify-center px-4 py-12 md:py-0">
          <div className="w-full max-w-md">
            <h2 className="text-3xl font-bold mb-6 text-center">Login to Your Account</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
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
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-green-400 focus:ring-green-400"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm">Remember me</label>
                </div>
                <div className="text-sm">
                  <Link to="/forgot-password" className="text-green-400 hover:text-green-300">Forgot your password?</Link>
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center items-center px-4 py-2 bg-green-400 text-black rounded-md hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400"
                >
                  Sign In
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </div>
            </form>
            <p className="mt-6 text-center text-sm">
              Don't have an account?{" "}
              <Link to="/signup" className="text-green-400 hover:text-green-300 font-medium">
                Sign up now
              </Link>
            </p>
          </div>
        </div>
      </div>

      
    </div>
  );
}