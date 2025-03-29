import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [successMessage, setSuccessMessage] = useState(''); // New state for success message
  const [errorMessage, setErrorMessage] = useState(''); // New state for error message

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/signup', formData);
     
      setErrorMessage(''); // Clear any previous error message
      setSuccessMessage('Signup successful!'); // Set success message
      setTimeout(() => {
        navigate('/login'); // Delay navigation by 1 second
      }, 1000);
    } catch (error) {
      console.error('Error during signup:', error);
      if (error.response && error.response.status === 400) {
        setErrorMessage('User with this email already exists'); // Set error message for duplicate user
      } else {
        setErrorMessage('An error occurred during signup'); // Generic error message
      }
    }
  };

  return (
    <>
      <div>
        <section className="rounded-md p-2 bg-white">
          <div className="flex items-center justify-center my-3" style={{ marginTop: '20vh' }}>
            <div className="xl:mx-auto shadow-md p-4 xl:w-full xl:max-w-sm 2xl:max-w-md">
              <h1 className="text-3xl font-bold text-center mb-4">AI powered World chat</h1>
              <hr className="border-t-2 border-gray-300 mb-4" />
              <h2 className="text-2xl font-bold leading-tight">
                Sign up to create account
              </h2>
              {successMessage && ( // Display success message if set
                <p className="text-green-500 text-center mb-4">{successMessage}</p>
              )}
              {errorMessage && ( // Display error message if set
                <p className="text-red-500 text-center mb-4">{errorMessage}</p>
              )}
              <form className="mt-5" onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="username" className="text-base font-medium text-gray-900">
                      User Name
                    </label>
                    <div className="mt-2">
                      <input
                        id="username"
                        placeholder="Full Name"
                        type="text"
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="email" className="text-base font-medium text-gray-900">
                      Email address
                    </label>
                    <div className="mt-2">
                      <input
                        id="email"
                        placeholder="Email"
                        type="email"
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <label htmlFor="password" className="text-base font-medium text-gray-900">
                        Password
                      </label>
                    </div>
                    <div className="mt-2">
                      <input
                        id="password"
                        placeholder="Password"
                        type="password"
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                      />
                    </div>
                    <p className="mt-2 text-base text-gray-600">
                      Already have an account? 
                      <span 
                        className="text-blue-500 cursor-pointer hover:underline" 
                        onClick={() => navigate('/login')}
                      >
                        Login
                      </span>
                    </p>
                  </div>
                  <div>
                    <button
                      className="inline-flex w-full items-center justify-center rounded-md bg-black px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-black/80"
                      type="submit"
                    >
                      Create Account
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
