import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Login = () => {
    const [credentials, setCredentials] = useState({ identifier: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await api.post('/auth/login', {
                username: credentials.identifier,
                email: credentials.identifier,
                password: credentials.password
            });

            const { token, user } = response.data;
            // Instead of relying purely on local storage & dashboard mock, 
            // we immediately hand over the session back to the Nestflix Vercel app
            window.location.href = `https://nestflix.vercel.app/?token=${token}&username=${user.username}`;
        } catch (err) {
            setError(err.response?.data?.error || 'Sorry, we can\'t find an account with this email/username. Please try again or create a new account.');
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-wrapper">
            <header className="auth-header">
                <Link to="/" className="logo-text">KODFLIX</Link>
            </header>

            <div className="auth-container">
                <div className="auth-card">
                    <h2>Sign In</h2>

                    {error && <div className="alert error">{error}</div>}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="input-group">
                            <input
                                type="text"
                                name="identifier"
                                placeholder="Email or username"
                                value={credentials.identifier}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={credentials.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <button type="submit" className="primary-btn" disabled={isLoading}>
                            {isLoading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="auth-footer mt-4">
                        New to Kodflix? <Link to="/register">Sign up now.</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
