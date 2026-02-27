import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Login = () => {
    const [credentials, setCredentials] = useState({ identifier: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await api.post('/auth/login', {
                username: credentials.identifier,
                email: credentials.identifier,
                password: credentials.password
            });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed.');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card glass-panel">
                <h2>Welcome Back</h2>
                <p className="subtitle">Please enter your details</p>

                {error && <div className="alert error">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="input-group">
                        <label>Username or Email</label>
                        <input type="text" name="identifier" value={credentials.identifier} onChange={handleChange} required />
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <input type="password" name="password" value={credentials.password} onChange={handleChange} required />
                    </div>
                    <button type="submit" className="primary-btn">Log In</button>
                </form>
                <p className="auth-footer">
                    Don't have an account? <Link to="/register">Sign up</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
