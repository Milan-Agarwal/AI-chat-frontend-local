import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import RoomList from "./components/RoomList";
import Room from "./components/Room";
import Profilepicture from "./components/profilepicture";
function App() {
    return (
        <Router>
            
                <Routes>
                    <Route path="/" element={<Signup />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/rooms" element={<RoomList />} />
                    <Route path="/rooms/:roomId/:creator" element={<Room />} />
                    <Route path="/profile" element={<Profilepicture />} />
                    
                </Routes>
            
        </Router>
    );
}

export default App;
