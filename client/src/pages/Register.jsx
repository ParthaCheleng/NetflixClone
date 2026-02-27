import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phone: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            const response = await api.post('/auth/register', formData);
            setSuccess(response.data.message);
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed.');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card glass-panel">
                <h2>Create Account</h2>
                <p className="subtitle">Join us to get started</p>

                {error && <div className="alert error">{error}</div>}
                {success && <div className="alert success">{success}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="input-group">
                        <label>Username</label>
                        <input type="text" name="username" value={formData.username} onChange={handleChange} required />
                    </div>
                    <div className="input-group">
                        <label>Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="input-group">
                        <label>Phone</label>
                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} />
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                    </div>
                    <button type="submit" className="primary-btn">Sign Up</button>
                </form>
                <p className="auth-footer">
                    Already have an account? <Link to="/login">Log in here</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
