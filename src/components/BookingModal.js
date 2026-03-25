import React, { useState } from 'react';
import axios from 'axios';
import emailjs from 'emailjs-com'; // ✅ ADD THIS
import './Booking.css';

const BookingModal = ({ flight, user, travelDate, onClose }) => {
    const [isSuccess, setIsSuccess] = useState(false);
    const [passenger, setPassenger] = useState({
        name: user ? user.name : '',
        age: '',
        gender: 'Male',
        email: user ? user.email : ''
    });

    // ✅ EMAIL FUNCTION
    const sendEmail = () => {
        const templateParams = {
            passenger_name: passenger.name,
            user_email: passenger.email,
            airline: flight.airline,
            flight_number: flight.flightNumber,
            source: flight.source,
            destination: flight.destination,
            date: travelDate,
            price: flight.price
        };

        emailjs.send(
            'service_v2crfql',        // ✅ tera service ID
            'YOUR_TEMPLATE_ID',      // 🔴 yaha apna Template ID daal
            templateParams,
            'YOUR_PUBLIC_KEY'        // 🔴 yaha Public Key daal
        )
        .then(() => console.log("✅ Email sent"))
        .catch((err) => console.log("❌ Email error:", err));
    };

    const handleConfirm = async () => {
        if (!passenger.age || !travelDate) {
            alert("Please enter age and select a travel date!");
            return;
        }

        try {
            const token = localStorage.getItem('token');

            const response = await axios.post(
                'https://flight-backend-h87z.onrender.com/api/bookings/confirm',
                {
                    flightId: flight._id,
                    passengerName: passenger.name,
                    age: passenger.age,
                    gender: passenger.gender,
                    email: passenger.email,
                    travelDate: travelDate
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log("Booking Success:", response.data);

            // ✅ EMAIL CALL
            sendEmail();

            setIsSuccess(true);

            setTimeout(() => {
                onClose();
            }, 3000);

        } catch (err) {
            console.error("Booking Error:", err.response?.data);
            alert(err.response?.data?.msg || "Booking Failed!");
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
                <p style={{ color: '#666', fontSize: '14px' }}>
                    Safe Journey to {flight.destination} ✈️
                </p>
            </div>
        );
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <span className="close-btn" onClick={onClose}>&times;</span>
                <h2>Passenger Details</h2>
                <p>
                    <strong>Flight:</strong> {flight.airline} |{' '}
                    <strong>Date:</strong> {travelDate || "Not Selected"}
                </p>

                <input
                    className="input-field"
                    placeholder="Full Name"
                    value={passenger.name}
                    onChange={(e) =>
                        setPassenger({ ...passenger, name: e.target.value })
                    }
                />

                <input
                    className="input-field"
                    type="number"
                    placeholder="Age"
                    value={passenger.age}
                    onChange={(e) =>
                        setPassenger({ ...passenger, age: e.target.value })
                    }
                />

                <select
                    className="input-field"
                    value={passenger.gender}
                    onChange={(e) =>
                        setPassenger({ ...passenger, gender: e.target.value })
                    }
                >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>

                <button className="confirm-btn" onClick={handleConfirm}>
                    Confirm Booking (₹{flight.price})
                </button>
            </div>
        </div>
    );
};

export default BookingModal;