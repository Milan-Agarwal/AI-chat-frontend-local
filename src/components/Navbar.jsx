import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear(); // Remove all localStorage data
    navigate('/login'); // Navigate to login page
  };

  const handleSignup = () => {
    localStorage.clear(); // Remove all localStorage data
    navigate('/signup'); // Navigate to signup page
  };

  const buttonStyle = {
    backgroundColor: 'black',
    color: 'white',
    margin: '0 5px', // Reduced margin
    border: '1px solid black',
    padding: '5px 10px', // Reduced padding
    fontSize: '12px', // Smaller font size
    cursor: 'pointer',
  };

  const buttonHoverStyle = {
    backgroundColor: '#333', // Darker black
  };

  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '10px', // Reduced gap
    margin: '10px 0 0 0', // Added top margin
    position: 'fixed', // Fix position
    top: '0', // Align to the top
    width: '100%', // Full width
    backgroundColor: 'white', // Optional: Add background color to avoid overlap
    zIndex: '1000', // Ensure it stays above other elements
  };

  return (
    <div style={containerStyle}>
      <button 
        style={buttonStyle} 
        onMouseOver={(e) => Object.assign(e.target.style, buttonHoverStyle)}
        onMouseOut={(e) => Object.assign(e.target.style, buttonStyle)}
        onClick={handleLogout}
      >
        Logout
      </button>
      <button 
        style={buttonStyle} 
        onMouseOver={(e) => Object.assign(e.target.style, buttonHoverStyle)}
        onMouseOut={(e) => Object.assign(e.target.style, buttonStyle)}
        onClick={handleSignup}
      >
        Signup
      </button>
      <button 
        style={buttonStyle} 
        onMouseOver={(e) => Object.assign(e.target.style, buttonHoverStyle)}
        onMouseOut={(e) => Object.assign(e.target.style, buttonStyle)}
        onClick={() => navigate('/profile')}
      >
        Profile Picture
      </button>
      <button 
        style={buttonStyle} 
        onMouseOver={(e) => Object.assign(e.target.style, buttonHoverStyle)}
        onMouseOut={(e) => Object.assign(e.target.style, buttonStyle)}
        onClick={() => navigate('/rooms')}
      >
        Room List
      </button>
    </div>
  )
}
