import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import "./RoomList.css"; // Import the CSS file

function RoomList() {
    const [rooms, setRooms] = useState([]);
    const [roomName, setRoomName] = useState("");
    const navigate = useNavigate();
    const username = localStorage.getItem("username");

    useEffect(() => {
        axios.get("http://localhost:3000/rooms").then((response) => {
            console.log("API Response:", response.data); // Debugging: Log API response
            setRooms(response.data);
        }).catch((error) => {
            console.error("Error fetching rooms:", error); // Handle API errors
        });
    }, []);

    const createRoom = () => {
        const creator = username; // Replace with actual user logic
        axios.post("http://localhost:3000/rooms", { roomName, creator }).then((response) => {
            setRooms([...rooms, response.data]);
            setRoomName("");
        });
    };

    const deleteRoom = (id) => {
        const creator = username; // Ensure the username is correctly retrieved
        if (!creator) {
            console.error("Error: Creator username is missing.");
            return; // Prevent the API call if the creator is not defined
        }

        const updatedRooms = rooms.filter((room) => room._id !== id); // Optimistically update UI
        setRooms(updatedRooms);

        axios.delete(`http://localhost:3000/rooms/${id}`, { data: { creator } })
            .then(() => {
                console.log(`Room with ID ${id} deleted successfully.`);
            })
            .catch((error) => {
                console.error("Error deleting room in roomlist:", error); // Handle API errors
                setRooms(rooms); // Revert UI changes if the API call fails
                alert("Failed to delete the room. Please check your permissions.");
            });
    };

    return (
        <>
            <Navbar /> {/* Assuming you have a Navbar component */}
            <div className="room-list-container" style={{ marginTop: "70px" }}> {/* Apply CSS class and add margin to avoid overlap */}
                <h1 className="room-list-title">Room List</h1> {/* Apply CSS class */}
                <input
                    type="text"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    placeholder="Room Name"
                    className="room-input" // Apply CSS class
                />
                <button onClick={createRoom} className="create-room-button">Create Room</button> {/* Apply CSS class */}
                <ul className="room-list"> {/* Apply CSS class */}
                    {rooms.map((room, index) => (
                        <li key={`${room._id || index}-${room.creator || "unknown"}`} className="room-item"> {/* Apply CSS class */}
                            {room.name || "Unnamed Room"}
                            <div className="button-container"> {/* Add a container for centering */}
                                <button onClick={() => navigate(`/rooms/${room._id || "unknown"}/${room.creator || "unknown"}`)} className="join-room-button">Join</button> {/* Apply CSS class */}
                                {room.creator === username && ( // Show delete button only if logged-in user is the creator
                                    <button onClick={() => deleteRoom(room._id)} className="delete-room-button">Delete</button> 
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}

export default RoomList;
