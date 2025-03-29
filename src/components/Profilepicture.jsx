import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import Navbar from "./Navbar";

export default function Profilepicture() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState('');
  const [currentProfilePicture, setCurrentProfilePicture] = useState('');
  const userId = localStorage.getItem("userId"); // Retrieve logged-in user's MongoDB ID

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert('Please select a file to upload.');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', "first_time"); // Replace with your Cloudinary upload preset

    try {
      setUploading(true);
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/den7f7mna/image/upload', // Replace with your Cloudinary cloud name
        formData
      );
      const uploadedImageUrl = response.data.secure_url;
      setUploadedUrl(uploadedImageUrl);

      // Update the user's profile picture in the backend
     await axios.put(
        `http://localhost:3000/users/${userId}/profile-picture`, // Backend endpoint
        { profilePicture: uploadedImageUrl }
      );
      

      alert('Profile picture updated successfully!');
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file.');
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    const fetchProfilePicture = async () => {
      try {
        
        const response = await axios.get(
          `http://localhost:3000/users/${userId}/profile-picture` // Backend endpoint to fetch profile picture
        );
        console.log(" Profile picture response:", response.data); // Debugging: Log API response
        setCurrentProfilePicture(response.data.user.profilePicture);
      } catch (error) {
        console.error('Error fetching profile picture:', error);
      }
    };

    if (userId) {
      fetchProfilePicture();
    }
  }, [userId]);

  return (
    <>
      <Navbar />
      <StyledWrapper>
       
       
          <div className="current-profile-picture">
            <p>Current Profile Picture:</p>
            {uploadedUrl || currentProfilePicture ? (
              <img src={uploadedUrl || currentProfilePicture} alt="Current Profile" />
            ) : (
              <p>No profile picture available</p>
            )}
          </div>
        
        <form className="form" onSubmit={handleUpload}>
          <span className="form-title">Upload your file</span>
          <p className="form-paragraph">File should be an image</p>
          <label htmlFor="file-input" className="drop-container">
            <span className="drop-title">Drop files here</span>
            or
            <input
              type="file"
              accept="image/*"
              required
              id="file-input"
              onChange={handleFileChange}
            />
          </label>
          <button type="submit" disabled={uploading}>
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </form>
        
      </StyledWrapper>
    </>
  );
}

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 60px); /* Adjust for navbar height */
  padding-top: 60px; /* Prevent overlap with navbar */

  .form {
    background-color: #fff;
    box-shadow: 0 10px 60px rgb(218, 229, 255);
    border: 1px solid rgb(159, 159, 160);
    border-radius: 20px;
    padding: 2rem .7rem .7rem .7rem;
    text-align: center;
    font-size: 1.125rem;
    max-width: 320px;
  }

  .form-title {
    color: #000000;
    font-size: 1.8rem;
    font-weight: 500;
  }

  .form-paragraph {
    margin-top: 10px;
    font-size: 0.9375rem;
    color: rgb(105, 105, 105);
  }

  .drop-container {
    background-color: #fff;
    position: relative;
    display: flex;
    gap: 10px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 10px;
    margin-top: 2.1875rem;
    border-radius: 10px;
    border: 2px dashed rgb(171, 202, 255);
    color: #444;
    cursor: pointer;
    transition: background .2s ease-in-out, border .2s ease-in-out;
  }

  .drop-container:hover {
    background: rgba(0, 140, 255, 0.164);
    border-color: rgba(17, 17, 17, 0.616);
  }

  .drop-container:hover .drop-title {
    color: #222;
  }

  .drop-title {
    color: #444;
    font-size: 20px;
    font-weight: bold;
    text-align: center;
    transition: color .2s ease-in-out;
  }

  #file-input {
    width: 350px;
    max-width: 100%;
    color: #444;
    padding: 2px;
    background: #fff;
    border-radius: 10px;
    border: 1px solid rgba(8, 8, 8, 0.288);
  }

  #file-input::file-selector-button {
    margin-right: 20px;
    border: none;
    background: #084cdf;
    padding: 10px 20px;
    border-radius: 10px;
    color: #fff;
    cursor: pointer;
    transition: background .2s ease-in-out;
  }

  #file-input::file-selector-button:hover {
    background: #0d45a5;
  }

  button {
    margin-top: 1rem;
    padding: 10px 20px;
    background-color: #084cdf;
    color: #fff;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: background 0.2s ease-in-out;
  }

  button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  button:hover:not(:disabled) {
    background-color: #0d45a5;
  }

  .uploaded-image {
    margin-top: 1rem;
    text-align: center;
  }

  .uploaded-image img {
    max-width: 100%;
    border-radius: 10px;
    margin-top: 0.5rem;
  }

  .uploaded-image .small-circle {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #084cdf;
    margin-top: 0.5rem;
  }

  .current-profile-picture {
    text-align: center;
    margin-bottom: 1rem;
  }

  .current-profile-picture img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #084cdf;
  }`
  ;
