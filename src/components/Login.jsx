import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // New state for success message
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/login', { email, password }); // Updated URL
      if (response.status === 200) {
        const userId = response.data.user._id; // Assuming the user ID is returned in the response
        const username = response.data.user.username; // Assuming the username is returned in the response
        localStorage.setItem("username", username);
        localStorage.setItem("userId", userId);
        setSuccessMessage('Login successful! Redirecting...'); // Set success message
        setTimeout(() => {
          navigate('/rooms');
        }, 1000); // Delay of 1 second
      } else {
        alert('Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed');
    }
  };

  return (
    <>
      <div >
        <section className="rounded-md p-2 bg-white">
          <div className="flex items-center justify-center my-3" style={{ marginTop: '20vh' }}>
            <div className="xl:mx-auto shadow-md p-4 xl:w-full xl:max-w-sm 2xl:max-w-md">
              <h1 className="text-3xl font-bold text-center mb-4">AI powered World chat</h1>
              <hr className="border-t-2 border-gray-300 mb-4" />
              <h2 className="text-2xl font-bold leading-tight">
                Login to your account
              </h2>
              {successMessage && ( // Display success message if it exists
                <p className="text-green-500 text-center mb-4">{successMessage}</p>
              )}
              <form className="mt-5" onSubmit={handleLogin}>
                <div className="space-y-4">
                  <div>
                    <label className="text-base font-medium text-gray-900" htmlFor="email"> {/* Updated to use htmlFor */}
                      Email address
                    </label>
                    <div className="mt-2">
                      <input
                        placeholder="Email"
                        type="email"
                        id="email" // Added id
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-base font-medium text-gray-900" htmlFor="password"> {/* Updated to use htmlFor */}
                      Password
                    </label>
                    <div className="mt-2">
                      <input
                        placeholder="Password"
                        type="password"
                        id="password" // Added id
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </div>
                  <p className="mt-2 text-base text-gray-600">
                    Don't have an account?{' '}
                    <span
                      className="text-blue-500 cursor-pointer"
                      onClick={() => navigate('/')}
                    >
                      Signup
                    </span>
                  </p>
                  <div>
                    <button
                      className="inline-flex w-full items-center justify-center rounded-md bg-black px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-black/80"
                      type="submit"
                    >
                     Login
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
