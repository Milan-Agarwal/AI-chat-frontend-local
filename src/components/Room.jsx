import React, { useState, useEffect } from "react";
import styled from 'styled-components';
import axios from 'axios';
import { useParams } from "react-router-dom";
import logoImage from '../assets/e5b5f75aee252932abc227fc80cbb633.png'; // Import the logo image
import Navbar from "./Navbar";

function Room() {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [selectedLanguage, setSelectedLanguage] = useState(() => localStorage.getItem("selectedLanguage") || "Normal Mode"); // Retrieve from localStorage
    const [isSending, setIsSending] = useState(false); // Track sending state
    
    // const username = localStorage.getItem("username");
    const userId = localStorage.getItem("userId"); // Retrieve logged-in user's MongoDB ID
    const { roomId ,creator} = useParams(); // Extract roomId from URL

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/messages?roomId=${roomId}`);
                let fetchedMessages = response.data;

                // Translate messages if a language other than "Normal Mode" is selected
                if (selectedLanguage !== "Normal Mode") {
                    const prompt = `Translate the following messages and no other side words please separated by || into ${selectedLanguage}: ${fetchedMessages.map(msg => msg.text).join(' || ')}`;
                    const translationResponse = await axios.post("http://localhost:3000/content", { prompt });
                    const translatedTexts = translationResponse.data.result.split(' || ');
                    fetchedMessages = fetchedMessages.map((msg, index) => ({
                        ...msg,
                        text: translatedTexts[index] || msg.text,
                    }));
                }

                setMessages(fetchedMessages);
            } catch (error) {
                console.error("Error fetching or translating messages:", error);
            }
        };

        fetchMessages();
    }, [roomId, selectedLanguage]); // Re-run when roomId or selectedLanguage changes

    useEffect(() => {
        // Scroll to the bottom of the messages container when messages change
        const messagesContainer = document.querySelector(".messages-container");
        if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        setIsSending(true); // Show spinner
        try {
            let translatedMessage = newMessage;

            // Translate the message if a language other than "Normal Mode" is selected
            if (selectedLanguage !== "Normal Mode") {
                const prompt = `Translate the following message and no side words into ${selectedLanguage}: ${newMessage}`;
                const translationResponse = await axios.post("http://localhost:3000/content", { prompt });
                translatedMessage = translationResponse.data.result || newMessage;
            }

            // Save only the original message to the server
            const response = await axios.post("http://localhost:3000/messages", {
                roomId,
                senderId: userId, // Use logged-in user's MongoDB ID
                text: newMessage, // Save the original message
            });

            // Display the translated message in the UI
            setMessages((prevMessages) => [
                ...prevMessages,
                {
                    ...response.data,
                    text: translatedMessage, // Show the translated message
                    timestamp: new Date().toISOString(), // Add the current timestamp
                },
            ]);
            setNewMessage("");
        } catch (error) {
            console.error("Error sending message:", error);
        } finally {
            setIsSending(false); // Hide spinner
        }
    };

    const handleLanguageClick = async (language) => {
        setSelectedLanguage(language); // Update the selected language
        localStorage.setItem("selectedLanguage", language); // Save to localStorage
        if (language === "Normal Mode") {
            // Fetch original messages from the server
            try {
                const response = await axios.get(`http://localhost:3000/messages?roomId=${roomId}`);
                setMessages(response.data);
            } catch (error) {
                console.error("Error fetching original messages:", error);
            }
            return;
        }
    
        try {
            // Fetch the latest messages from the server
            const response = await axios.get(`http://localhost:3000/messages?roomId=${roomId}`);
            const latestMessages = response.data;
    
            const prompt = `Translate the following messages and no other side words please separated by || into ${language}: ${latestMessages.map(msg => msg.text).join(' || ')}`;
           
    
            const translationResponse = await axios.post("http://localhost:3000/content", { prompt });
           
            const translatedTexts = translationResponse.data.result.split(' || '); // 
            // Assuming the API returns translations separated by '||'
            
            setMessages(latestMessages.map((msg, index) => ({
                ...msg,
                text: translatedTexts[index] || msg.text,
            })));
        } catch (error) {
            console.error("Error translating messages:", error);
        }
    };

    return (
        <>
       <Navbar/>
        <StyledWrapper>
      <div className="card-container">
        <div className="card-header">
          <div className="img-avatar">
            <img src={logoImage} alt="Logo" className="avatar-image" />
          </div>
          <div className="text-chat">
            AI Powered World Chat <span className="built-by"><strong>BuiltBYMilanAgarwal</strong></span>
          </div>
        </div>
        <div className="card-body">
          <div className="messages-container">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`message-box ${
                  message.sender.username === creator ? "left" : "right"
                }`}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  {message.sender.profilePicture && ( // Display profile picture if available
                    <img
                      src={message.sender.profilePicture}
                      alt={`${message.sender.username}'s profile`}
                      className="profile-picture"
                    />
                  )}
                  <strong className="sender-username">
                    {message.sender.username}
                    {message.sender.username === creator && " (Admin)"}
                  </strong> {/* Display sender's username */}
                </div>
                <p>{message.text}</p>
                <span className="timestamp">
                  {new Date(message.timestamp).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
          <div className="language-options">
            <h4>Translate to:</h4>
            <ul>
              {["Normal Mode", "Afrikaans", "Albanian", "Amharic", "Arabic", "Armenian", "Azerbaijani", "Basque", "Belarusian", "Bengali", "Bosnian", "Bulgarian", "Burmese", "Catalan", "Cebuano", "Chinese (Simplified)", "Chinese (Traditional)", "Corsican", "Croatian", "Czech", "Danish", "Dutch", "English", "Esperanto", "Estonian", "Fijian", "Filipino", "Finnish", "French", "Galician", "Georgian", "German", "Greek", "Gujarati", "Haitian Creole", "Hausa", "Hawaiian", "Hebrew", "Hindi", "Hmong", "Hungarian", "Icelandic", "Igbo", "Indonesian", "Irish", "Italian", "Japanese", "Javanese", "Kannada", "Kazakh", "Khmer", "Korean", "Kurdish", "Kyrgyz", "Lao", "Latin", "Latvian", "Lithuanian", "Luxembourgish", "Macedonian", "Malagasy", "Malay", "Malayalam", "Maltese", "Maori", "Marathi", "Mongolian", "Nepali", "Norwegian", "Odia", "Pashto", "Persian", "Polish", "Portuguese", "Punjabi", "Romanian", "Russian", "Samoan", "Scottish Gaelic", "Serbian", "Shona", "Sindhi", "Sinhala", "Slovak", "Slovenian", "Somali", "Spanish", "Sundanese", "Swahili", "Swedish", "Tajik", "Tamil", "Tatar", "Telugu", "Thai", "Turkish", "Turkmen", "Ukrainian", "Urdu", "Uyghur", "Uzbek", "Vietnamese", "Welsh", "Xhosa", "Yiddish", "Yoruba", "Zulu"].map((language) => (
                <li key={language} onClick={() => handleLanguageClick(language)}>
                  {language} {selectedLanguage === language && <span>✓</span>}
                </li>
              ))}
            </ul>
          </div>
          <div className="message-input">
            <form onSubmit={handleSendMessage}>
              <textarea
                placeholder="Type your message here"
                className="message-send"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                disabled={isSending} // Disable input while sending
              />
              <button type="submit" className="button-send" disabled={isSending}>
                {isSending ? 
                <StyledWrapper2>
                <svg viewBox="25 25 50 50">
                  <circle r={20} cy={50} cx={50} />
                </svg>
              </StyledWrapper2>
                : "Send"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </StyledWrapper>
        </>

    );
}
const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw; /* Extend width to full page */
  background-color: #f9f9f9;

  .card-container {
    background-color: #fff;
    border-radius: 10px;
    padding: 20px;
    margin: 20px;
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 800px;
    height: 100%;
    max-height: 600px;
    transform: scale(1);
    position: relative;
  }

  .card-header {
    display: flex;
    align-items: center;
    padding-bottom: 10px;
    border-bottom: 1px solid #ccc;
  }

  .card-header .img-avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 20px;
    background-color: #333;
    overflow: hidden; /* Ensure the image fits within the avatar */
  }

  .avatar-image {
    width: 100%;
    height: 100%;
    object-fit: cover; /* Ensure the image covers the avatar area */
  }

  .card-header .text-chat {
    color: black;
    margin: 0;
    font-size: 20px;
    display: flex;
    align-items: center;
  }

  .card-header .text-chat .built-by {
    margin-left: 10px; /* Add spacing between the title and subtitle */
    font-size: 14px;
    color: #888;
    
  }

  .card-body {
    flex: 1;
    display: flex;
  }

  .messages-container {
    flex: 3;
    padding: 15px;
    overflow-y: auto; /* Enable scrolling for messages */
    max-height: 500px; /* Limit height for scrolling */
    padding-bottom: 100px; /* Add padding to ensure last message is visible */
    width: 100%; /* Extend width to full page */
  }

  .language-options {
    flex: 1;
    padding: 15px;
    border-left: 1px solid #ccc;
    background-color: #f9f9f9;
    overflow-y: auto; /* Enable scrolling for the language list */
    max-height: 500px; /* Limit height for scrolling */
    padding-bottom: 50px; /* Add padding to ensure the last language is visible */
  }

  .language-options h4 {
    margin-bottom: 10px;
    font-size: 16px;
    color: #333;
  }

  .language-options ul {
    list-style: none;
    padding: 0;
    margin: 0; /* Remove default margin */
  }

  .language-options li {
    margin-bottom: 8px; /* Add spacing between items */
    font-size: 14px;
    color: #555;
    cursor: pointer;
    display: flex;
    align-items: center; /* Align tick mark and text */
    padding: 8px; /* Add padding for better click area */
    border-radius: 5px; /* Rounded corners */
    transition: background-color 0.3s ease; /* Smooth hover effect */
  }

  .language-options li:hover {
    color: #000;
    background-color: #e6e6e6; /* Highlight background on hover */
  }

  .language-options li span {
    margin-left: 5px; /* Add spacing between text and tick mark */
    color: green; /* Tick mark color */
    font-weight: bold; /* Make tick mark bold */
  }

  .message-box {
    padding: 10px;
    margin-bottom: 5px;
    border-radius: 10px;
    position: relative; /* Ensure timestamp is positioned correctly */
  }

  .timestamp {
    display: block;
    font-size: 10px;
    color: #888;
    margin-top: 5px;
    text-align: right; /* Align timestamp to the right */
  }

  .message-box.left {
    background-color: #f1f1f1;
    color: black;
    font-size: 13px;
    left: 0;
  }

  .message-box.right {
    background-color: #333;
    color: #fff;
    font-size: 13px;
    right: 0;
  }

  .profile-picture {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    margin-right: 10px;
    object-fit: cover;
  }

  .message-input {
    position: fixed; /* Fix the chat box to the bottom of the viewport */
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 5px;
    border-top: 1px solid #ccc;
    background-color: #fff;
    z-index: 1000; /* Ensure it stays above other elements */
  }

  .message-input form {
    display: flex;
    width: 100%;
  }

  .message-input .message-send {
    flex: 1; /* Take up remaining space */
    padding: 10px;
    border: none;
    border-radius: 10px 0 0 10px; /* Rounded corners for left side */
    resize: none;
  }

  .message-input .button-send {
    width: 80px; /* Reduced width */
    background-color: #333;
    color: #fff;
    padding: 8px; /* Slightly smaller padding */
    border: none;
    cursor: pointer;
    border-radius: 0 10px 10px 0; /* Rounded corners for right side */
    font-size: 13px;
    position: relative; /* For spinner positioning */
  }

  .message-input .button-send:hover {
    background-color: #f1f1f1;
    color: #333;
  }

 
  }
`;
const StyledWrapper2 = styled.div`
  svg {
   width: 3.25em;
   transform-origin: center;
   animation: rotate4 2s linear infinite;
  }

  circle {
   fill: none;
   stroke: hsl(214, 97%, 59%);
   stroke-width: 2;
   stroke-dasharray: 1, 200;
   stroke-dashoffset: 0;
   stroke-linecap: round;
   animation: dash4 1.5s ease-in-out infinite;
  }

  @keyframes rotate4 {
   100% {
    transform: rotate(360deg);
   }
  }

  @keyframes dash4 {
   0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
   }

   50% {
    stroke-dasharray: 90, 200;
    stroke-dashoffset: -35px;
   }

   100% {
    stroke-dashoffset: -125px;
   }
  }`;

export default Room;
