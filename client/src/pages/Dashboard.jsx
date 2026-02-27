import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (!token) {
            navigate('/login');
        } else if (userData) {
            setUser(JSON.parse(userData));
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="dashboard-container">
            <nav className="navbar glass-panel">
                <div className="logo">🛡️ SecureApp</div>
                <button onClick={handleLogout} className="logout-btn">Log Out</button>
            </nav>
            <main className="dashboard-content">
                <div className="welcome-card glass-panel">
                    <h1>Welcome, {user?.username}!</h1>
                    <p>You have successfully authenticated via JWT.</p>
                    <div className="user-details">
                        <p><strong>Email:</strong> {user?.email}</p>
                        <p><strong>User ID:</strong> {user?.id}</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
