import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { setUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('https://flight-backend-h87z.onrender.com/api/auth/login', { email, password });
            
            // Local Storage mein save karo
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            
            // Global State update karo
            setUser(res.data.user);
            
            alert("Login Successful! ✈️");
            navigate('/'); // Home page par bhejo
        } catch (err) {
            alert(err.response?.data?.msg || "Login Failed");
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Welcome Back ✈️</h2>
                <p style={styles.subtitle}>Login to book your next flight</p>
                
                <form onSubmit={handleLogin}>
                    <div style={styles.inputGroup}>
                        <label>Email Address</label>
                        <input 
                            type="email" 
                            placeholder="faraz@example.com" 
                            onChange={(e) => setEmail(e.target.value)} 
                            style={styles.input}
                            required
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label>Password</label>
                        <input 
                            type="password" 
                            placeholder="••••••••" 
                            onChange={(e) => setPassword(e.target.value)} 
                            style={styles.input}
                            required
                        />
                    </div>
                    <button type="submit" style={styles.button}>Login</button>
                </form>
               <p style={styles.footerText}>
    Don't have an account? 
    <span 
        onClick={() => navigate('/register')} // 👈 Ye line add karni hai
        style={styles.link}
    >
        Register
    </span>
</p>
            </div>
        </div>
    );
};

// Quick Inline CSS for Styling
const styles = {
    container: { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f4f7fe' },
    card: { width: '400px', padding: '40px', background: '#fff', borderRadius: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', textAlign: 'center' },
    title: { fontSize: '24px', marginBottom: '10px', color: '#1a202c' },
    subtitle: { fontSize: '14px', color: '#718096', marginBottom: '30px' },
    inputGroup: { textAlign: 'left', marginBottom: '20px' },
    input: { width: '100%', padding: '12px', marginTop: '8px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none' },
    button: { width: '100%', padding: '12px', background: '#3182ce', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' },
    footerText: { marginTop: '20px', fontSize: '14px', color: '#718096' },
    link: { color: '#3182ce', fontWeight: 'bold', cursor: 'pointer' }
};

export default Login;