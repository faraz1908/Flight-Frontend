import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [showConfirm, setShowConfirm] = useState(false);
    const navigate = useNavigate();

    const handleNext = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.password) {
            alert("Please fill all details!");
            return;
        }
        setShowConfirm(true); // Confirmation window open hogi
    };

    const finalSubmit = async () => {
        try {
            await axios.post('https://flight-backend-h87z.onrender.com/api/auth/register', formData);
            alert("Registration Successful! Now please login.");
            navigate('/login');
        } catch (err) {
            alert(err.response?.data?.msg || "Registration Failed");
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={{ marginBottom: '20px' }}>Create Account 👤</h2>
                <form onSubmit={handleNext}>
                    <input 
                        placeholder="Full Name" 
                        style={styles.input} 
                        onChange={(e) => setFormData({...formData, name: e.target.value})} 
                    />
                    <input 
                        type="email" 
                        placeholder="Email Address" 
                        style={styles.input} 
                        onChange={(e) => setFormData({...formData, email: e.target.value})} 
                    />
                    <input 
                        type="password" 
                        placeholder="Create Password" 
                        style={styles.input} 
                        onChange={(e) => setFormData({...formData, password: e.target.value})} 
                    />
                    <button type="submit" style={styles.btn}>Register</button>
                </form>
            </div>

            {/* --- EMAIL CONFIRMATION MODAL --- */}
            {showConfirm && (
                <div style={styles.overlay}>
                    <div style={styles.modal}>
                        <h3>Confirm Your Email 📧</h3>
                        <p>Is this email correct? <br/> <b>{formData.email}</b></p>
                        <p style={{ fontSize: '12px', color: 'red' }}>
                            *Your flight tickets will be sent to this email address.
                        </p>
                        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                            <button onClick={finalSubmit} style={styles.confirmBtn}>Yes, Correct</button>
                            <button onClick={() => setShowConfirm(false)} style={styles.cancelBtn}>No, Change</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Styles object define karna zaroori hai (Error fix yahan hai)
const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f4f7f6' },
    card: { width: '350px', padding: '40px', background: '#fff', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', textAlign: 'center' },
    input: { width: '100%', padding: '12px', margin: '10px 0', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' },
    btn: { width: '100%', padding: '12px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' },
    overlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }, // Fixed: z-index -> zIndex
    modal: { background: '#fff', padding: '30px', borderRadius: '12px', textAlign: 'center', width: '300px' },
    confirmBtn: { flex: 1, padding: '10px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' },
    cancelBtn: { flex: 1, padding: '10px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }
};

export default Register;