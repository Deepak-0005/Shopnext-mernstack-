import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/auth.css';

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [step, setStep] = useState("register");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });
            const data = await res.json();
            if (res.ok) {
                setStep('verify');
                setMessage(data.message || 'OTP sent to your email.');
            } else {
                alert(data.message);
                console.error(data.message);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/auth/verify-email', {
                method: 'POST',
                headers: { 'content-Type': 'application/json' },
                body: JSON.stringify({ email, otp })
            });
            const data = await res.json();
            if (res.ok) {
                alert(data.message);
                navigate('/login');
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleResendOtp = async () => {
        try {
            const res = await fetch('/api/auth/resend-otp', {
                method: 'POST',
                headers: { 'content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await res.json();
            alert(data.message);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="auth-container">
            <form onSubmit={step === 'register' ? handleRegister : handleVerify} className="auth-form">
                <h2>{step === 'register' ? 'Register' : 'Verify Email'}</h2>
                {message && <p style={{ color: '#fbbf24', margin: 0 }}>{message}</p>}
                {step === 'register' ? (
                    <>
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button type="submit" className="btn">Register</button>
                    </>
                ) : (
                    <>
                        <input
                            type="text"
                            placeholder="Enter 6-digit OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            maxLength="6"
                            required
                        />
                        <button type="submit" className="btn">Verify Email</button>
                        <button type="button" className="btn" onClick={handleResendOtp} style={{ background: '#27272a', boxShadow: 'none' }}>Resend OTP</button>
                    </>
                )}
                <p>Already have an account? <Link to="/login">Login</Link></p>
            </form>
        </div>
    );
};

export default Register;