import React, { useState } from 'react';
import axios from 'axios';
import './Booking.css';

const BookingModal = ({ flight, user, travelDate, onClose }) => {
    const [isSuccess, setIsSuccess] = useState(false); // New State
    const [passenger, setPassenger] = useState({
        name: user ? user.name : '',
        age: '',
        gender: 'Male',
        email: user ? user.email : ''
    });

    const handleConfirm = async () => {
        try {
            await axios.post('https://flight-backend-h87z.onrender.com/api/bookings/confirm', {
                flightId: flight._id,
                passengerName: passenger.name,
                age: passenger.age,
                gender: passenger.gender,
                email: passenger.email,
                travelDate: travelDate
            });
            
            setIsSuccess(true); // Animation start karo
            
            // 3 second baad modal band karo
            setTimeout(() => {
                onClose();
            }, 3000);
            
        } catch (err) {
            alert("Booking Failed!");
        }
    };

    if (isSuccess) {
        return (
            <div className="success-overlay">
                <div className="checkmark-circle">
                    <span>✓</span>
                </div>
                <div className="success-text">Ticket Confirmed!</div>
                <p>Check your email: <b>{passenger.email}</b></p>
                <p style={{color: '#666', fontSize: '14px'}}>Safe Journey to {flight.destination} ✈️</p>
            </div>
        );
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <span className="close-btn" onClick={onClose}>&times;</span>
                <h2>Passenger Details</h2>
                <p><strong>Flight:</strong> {flight.airline} | <strong>Date:</strong> {travelDate}</p>
                
                <input 
                    className="input-field" 
                    placeholder="Full Name" 
                    value={passenger.name}
                    onChange={(e) => setPassenger({...passenger, name: e.target.value})}
                />
                <input 
                    className="input-field" 
                    type="number" 
                    placeholder="Age" 
                    onChange={(e) => setPassenger({...passenger, age: e.target.value})}
                />
                <select 
                    className="input-field"
                    onChange={(e) => setPassenger({...passenger, gender: e.target.value})}
                >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>

                <button className="confirm-btn" onClick={handleConfirm}>Confirm Booking (₹{flight.price})</button>
            </div>
        </div>
    );
};

export default BookingModal;