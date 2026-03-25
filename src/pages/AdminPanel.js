import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPanel = () => {
    const [flights, setFlights] = useState([]);
    const [formData, setFormData] = useState({ 
        airline: '', 
        flightNumber: '', 
        source: '', 
        destination: '', 
        price: '',
        departureTime: '', // Naya Field
        arrivalTime: ''    // Naya Field
    });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => { fetchFlights(); }, []);

    const fetchFlights = async () => {
        try {
            const res = await axios.get('https://flight-backend-h87z.onrender.com/api/flights/all');
            setFlights(res.data);
        } catch (err) {
            console.error("Fetch Error:", err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await axios.put(`https://flight-backend-h87z.onrender.com/api/flights/update/${editingId}`, formData);
                setEditingId(null);
            } else {
                await axios.post('https://flight-backend-h87z.onrender.com/api/flights/add', formData);
            }
            // Form Reset
            setFormData({ airline: '', flightNumber: '', source: '', destination: '', price: '', departureTime: '', arrivalTime: '' });
            fetchFlights();
            alert(editingId ? "Flight Updated! ✅" : "Flight Added! ✈️");
        } catch (err) {
            alert("Error: " + (err.response?.data?.msg || "Something went wrong"));
        }
    };

    const deleteFlight = async (id) => {
        if (window.confirm("Pakka delete kar dein?")) {
            await axios.delete(`https://flight-backend-h87z.onrender.com/api/flights/delete/${id}`);
            fetchFlights();
        }
    };

    const startEdit = (f) => {
        setEditingId(f._id);
        setFormData({ 
            airline: f.airline, 
            flightNumber: f.flightNumber, 
            source: f.source, 
            destination: f.destination, 
            price: f.price,
            departureTime: f.departureTime || '',
            arrivalTime: f.arrivalTime || ''
        });
    };

    return (
        <div style={{ padding: '40px', fontFamily: 'Arial', backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
            <h2 style={{ color: '#1a2a3a' }}>Admin Flight Management ✈️</h2>
            
            {/* --- Form Section --- */}
            <div style={{ background: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
                <h4 style={{marginTop: 0}}>{editingId ? "Edit Flight Details" : "Add New Flight"}</h4>
                <form onSubmit={handleSubmit} style={styles.form}>
                    <input placeholder="Airline" value={formData.airline} onChange={e => setFormData({...formData, airline: e.target.value})} required style={styles.input}/>
                    <input placeholder="Flight No." value={formData.flightNumber} onChange={e => setFormData({...formData, flightNumber: e.target.value})} required style={styles.input}/>
                    <input placeholder="Source" value={formData.source} onChange={e => setFormData({...formData, source: e.target.value})} required style={styles.input}/>
                    <input placeholder="Destination" value={formData.destination} onChange={e => setFormData({...formData, destination: e.target.value})} required style={styles.input}/>
                    <input placeholder="Price" type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required style={styles.input}/>
                    
                    {/* Time Inputs */}
                    <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                        <label style={{fontSize: '12px'}}>Dep:</label>
                        <input type="time" value={formData.departureTime} onChange={e => setFormData({...formData, departureTime: e.target.value})} required style={styles.input}/>
                        <label style={{fontSize: '12px'}}>Arr:</label>
                        <input type="time" value={formData.arrivalTime} onChange={e => setFormData({...formData, arrivalTime: e.target.value})} required style={styles.input}/>
                    </div>

                    <button type="submit" style={editingId ? styles.updateBtn : styles.addBtn}>
                        {editingId ? 'Update Flight' : 'Add Flight'}
                    </button>
                    {editingId && <button type="button" onClick={() => {setEditingId(null); setFormData({airline:'', flightNumber:'', source:'', destination:'', price:'', departureTime:'', arrivalTime:''})}} style={styles.cancelBtn}>Cancel</button>}
                </form>
            </div>

            {/* --- Table Section --- */}
            <table style={styles.table}>
                <thead>
                    <tr style={{background: '#1a2a3a', color: '#fff'}}>
                        <th style={styles.th}>Airline</th>
                        <th style={styles.th}>Route</th>
                        <th style={styles.th}>Timing (Dep - Arr)</th>
                        <th style={styles.th}>Price</th>
                        <th style={styles.th}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {flights.map(f => (
                        <tr key={f._id} style={styles.tr}>
                            <td style={styles.td}><b>{f.airline}</b> <br/> <small>{f.flightNumber}</small></td>
                            <td style={styles.td}>{f.source} ➔ {f.destination}</td>
                            <td style={styles.td}>{f.departureTime || '--:--'} - {f.arrivalTime || '--:--'}</td>
                            <td style={styles.td}>₹{f.price}</td>
                            <td style={styles.td}>
                                <button onClick={() => startEdit(f)} style={styles.editBtn}>Edit</button>
                                <button onClick={() => deleteFlight(f._id)} style={styles.delBtn}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const styles = {
    form: { display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'center' },
    input: { padding: '10px', borderRadius: '5px', border: '1px solid #ddd', fontSize: '14px' },
    table: { width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', borderRadius: '8px', overflow: 'hidden' },
    th: { padding: '15px', textAlign: 'left' },
    td: { padding: '15px', borderBottom: '1px solid #eee' },
    tr: { transition: '0.3s' },
    addBtn: { padding: '10px 20px', background: '#28a745', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '5px', fontWeight: 'bold' },
    updateBtn: { padding: '10px 20px', background: '#007bff', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '5px', fontWeight: 'bold' },
    cancelBtn: { padding: '10px 20px', background: '#6c757d', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '5px' },
    editBtn: { marginRight: '10px', background: '#ffc107', border: 'none', padding: '8px 12px', cursor: 'pointer', borderRadius: '4px' },
    delBtn: { background: '#dc3545', color: '#fff', border: 'none', padding: '8px 12px', cursor: 'pointer', borderRadius: '4px' }
};

export default AdminPanel;