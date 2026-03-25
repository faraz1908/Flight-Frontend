import React, { useState, useContext } from 'react';
import axios from 'axios';
import BookingModal from '../components/BookingModal';
import { AuthContext } from '../context/AuthContext';
import { FaCog, FaLock, FaTicketAlt, FaSearch, FaSignOutAlt } from 'react-icons/fa';

const Home = () => {
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [date, setDate] = useState('');
    const [flights, setFlights] = useState([]);
    const [selectedFlight, setSelectedFlight] = useState(null);
    
    // Naya state modals ke liye
    const [activeModal, setActiveModal] = useState(null); 
    const { user, logout } = useContext(AuthContext);

    const handleSearch = async () => {
        if (!from || !to) {
            alert("Please enter both From and To cities!");
            return;
        }
        try {
            const res = await axios.get(`https://flight-backend-h87z.onrender.com/api/flights/search?from=${from}&to=${to}`);
            setFlights(res.data);
        } catch (err) {
            console.error("Search Error:", err);
        }
    };

    return (
        <div style={styles.dashboardContainer}>
            
            
            {/* --- LEFT SIDE PANEL --- */}
            <div style={styles.sidebar}>
                <div style={styles.profileSection}>
                    <div style={styles.avatar}>
                        {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <h3 style={styles.welcomeText}>Welcome, <br/> {user?.name || 'Mizan Ahmed'}</h3>
                    <p style={styles.userEmail}>{user?.email}</p>
                </div>

                <div style={styles.menuLinks}>
                    <button style={styles.menuBtn} onClick={() => setActiveModal('settings')}>
                        <FaCog style={styles.icon} /> User Settings
                    </button>
                    <button style={styles.menuBtn} onClick={() => setActiveModal('password')}>
                        <FaLock style={styles.icon} /> Change Password
                    </button>
                    <button style={styles.menuBtn} onClick={() => setActiveModal('bookings')}>
                        <FaTicketAlt style={styles.icon} /> My Bookings
                    </button>
                </div>

                <button onClick={logout} style={styles.logoutBtn}>
                    <FaSignOutAlt style={{marginRight: '10px'}} /> Logout
                </button>
            </div>

            {/* --- MAIN CENTER CONTENT --- */}
            <div style={styles.mainContent}>
                <h1 style={{ fontSize: '36px', marginBottom: '30px', color: '#1a2a3a' }}>Search Your Flight ✈️</h1>
                
                <div style={styles.searchBox}>
                    <input placeholder="From" onChange={(e) => setFrom(e.target.value)} style={styles.input} />
                    <input placeholder="To" onChange={(e) => setTo(e.target.value)} style={{ ...styles.input, marginLeft: '10px' }} />
                    <input type="date" onChange={(e) => setDate(e.target.value)} style={{ ...styles.input, marginLeft: '10px' }} />
                    <button onClick={handleSearch} style={styles.searchBtn}>
                        <FaSearch style={{marginRight: '8px'}} /> Search
                    </button>
                </div>

                <div style={styles.listContainer}>
                    {flights.length > 0 ? (
                        flights.map(f => (
                            <div key={f._id} style={styles.card}>
                                <div style={{ textAlign: 'left' }}>
                                    <h3 style={{ margin: '0' }}>{f.airline}</h3>
                                    <p>{f.source} ➔ {f.destination}</p>
                                    <p style={{ fontWeight: 'bold', color: '#28a745' }}>₹{f.price}</p>
                                </div>
                                <button onClick={() => setSelectedFlight(f)} style={styles.bookBtn}>Book Now</button>
                            </div>
                        ))
                    ) : (
                        <p style={{marginTop: '50px', color: '#888'}}>Enter cities to find your flight...</p>
                    )}
                </div>
            </div>

            {/* --- MODALS LOGIC --- */}
            {activeModal === 'settings' && (
                <div style={styles.overlay}>
                    <div style={styles.modal}>
                        <h3>User Settings ⚙️</h3>
                        <p><b>Name:</b> {user?.name}</p>
                        <p><b>Email:</b> {user?.email}</p>
                        <button onClick={() => setActiveModal(null)} style={styles.closeBtn}>Close</button>
                    </div>
                </div>
            )}

            {activeModal === 'password' && (
                <div style={styles.overlay}>
                    <div style={styles.modal}>
                        <h3>Change Password 🔑</h3>
                        <input type="password" placeholder="New Password" style={styles.modalInput} />
                        <div style={{display: 'flex', gap: '10px', marginTop: '15px'}}>
                            <button style={styles.saveBtn}>Update</button>
                            <button onClick={() => setActiveModal(null)} style={styles.closeBtn}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {activeModal === 'bookings' && (
                <div style={styles.overlay}>
                    <div style={styles.modalWide}>
                        <h3>My Bookings 📜</h3>
                        <p>You haven't booked any flights yet.</p>
                        <button onClick={() => setActiveModal(null)} style={styles.closeBtn}>Close</button>
                    </div>
                </div>
            )}

            {selectedFlight && (
                <BookingModal flight={selectedFlight} user={user} travelDate={date} onClose={() => setSelectedFlight(null)} />
            )}
        </div>
    );
};

const styles = {
    dashboardContainer: { display: 'flex', minHeight: '100vh', backgroundColor: '#f4f7f6' },
    sidebar: { width: '280px', backgroundColor: '#1a2a3a', color: '#fff', display: 'flex', flexDirection: 'column', padding: '30px 20px', position: 'fixed', height: '100vh', top: 0, left: 0, boxSizing: 'border-box' },
    profileSection: { textAlign: 'center', marginBottom: '30px', borderBottom: '1px solid #334455', paddingBottom: '20px' },
    avatar: { width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#007bff', margin: '0 auto 15px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold' },
    welcomeText: { margin: '10px 0 5px', fontSize: '18px', fontWeight: '600' },
    userEmail: { fontSize: '11px', color: '#adb5bd', wordBreak: 'break-all' },
    menuLinks: { display: 'flex', flexDirection: 'column', gap: '10px', flexGrow: 1 },
    menuBtn: { background: 'none', border: 'none', color: '#adb5bd', textAlign: 'left', padding: '12px 15px', cursor: 'pointer', fontSize: '15px', borderRadius: '8px', transition: '0.3s', display: 'flex', alignItems: 'center' },
    icon: { marginRight: '12px', fontSize: '18px' },
    logoutBtn: { background: '#dc3545', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' },
    mainContent: { flex: 1, marginLeft: '280px', padding: '50px', textAlign: 'center' },
    searchBox: { padding: '25px', backgroundColor: '#fff', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', display: 'inline-flex', gap: '15px', alignItems: 'center' },
    input: { padding: '12px', border: '1px solid #ddd', borderRadius: '8px', width: '190px', fontSize: '15px' },
    searchBtn: { backgroundColor: '#007bff', color: '#fff', border: 'none', padding: '12px 25px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center' },
    listContainer: { maxWidth: '800px', margin: '40px auto' },
    card: { backgroundColor: '#fff', border: '1px solid #eee', marginBottom: '20px', padding: '20px', borderRadius: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 5px 10px rgba(0,0,0,0.03)' },
    bookBtn: { backgroundColor: '#28a745', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
    
    // --- MODAL STYLES ---
    overlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
    modal: { backgroundColor: '#fff', padding: '30px', borderRadius: '15px', width: '350px', textAlign: 'center' },
    modalWide: { backgroundColor: '#fff', padding: '30px', borderRadius: '15px', width: '500px', textAlign: 'center' },
    modalInput: { width: '100%', padding: '10px', margin: '10px 0', borderRadius: '5px', border: '1px solid #ddd' },
    saveBtn: { background: '#28a745', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' },
    closeBtn: { background: '#6c757d', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }
};

export default Home;