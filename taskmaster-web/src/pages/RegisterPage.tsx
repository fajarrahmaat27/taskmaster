import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authService.register({ username, password });
      navigate('/', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', background: '#0f0f13',
    border: '1px solid #2a2a35', borderRadius: '10px',
    padding: '10px 14px', fontSize: '13px', color: '#c0c0d0',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    outline: 'none', boxSizing: 'border-box',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '10px', fontWeight: 700,
    color: '#454568', textTransform: 'uppercase',
    letterSpacing: '0.6px', marginBottom: '6px',
  };

  return (
    <div style={{
      minHeight: '100vh', width: '100vw',
      background: '#0f0f13', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
    }}>
      <div style={{ width: '100%', maxWidth: '420px', padding: '0 24px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '26px', fontWeight: 700, color: '#fff', letterSpacing: '-0.5px' }}>
            Task<span style={{ color: '#f5c518' }}>Master</span>
          </div>
          <div style={{ fontSize: '13px', color: '#454558', marginTop: '6px' }}>
            Create your account
          </div>
        </div>

        {/* Card */}
        <div style={{
          background: '#17171d', border: '1px solid #2a2a35',
          borderRadius: '16px', padding: '32px',
        }}>

          {error && (
            <div style={{
              background: '#f5656515', border: '1px solid #f5656540',
              borderRadius: '10px', padding: '10px 14px',
              fontSize: '13px', color: '#f56565', marginBottom: '20px',
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleRegister}>
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Username</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                minLength={3} required autoFocus
                placeholder="Min. 3 characters"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#f5c518'}
                onBlur={e => e.target.style.borderColor = '#2a2a35'}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                minLength={6} required
                placeholder="Min. 6 characters"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#f5c518'}
                onBlur={e => e.target.style.borderColor = '#2a2a35'}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', background: loading ? '#a08010' : '#f5c518',
                color: '#0f0f13', border: 'none', borderRadius: '10px',
                padding: '11px', fontSize: '14px', fontWeight: 700,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background 0.15s',
              }}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
        </div>

        {/* Footer link */}
        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: '#454558' }}>
          Already have an account?{' '}
          <Link to="/" style={{ color: '#f5c518', fontWeight: 600, textDecoration: 'none' }}>
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;