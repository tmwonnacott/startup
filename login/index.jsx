import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import './main.css';

function App() {
  return (
    <BrowserRouter>
      <main>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  function handleLogin() {
    createAuth('PUT');
  }

  function handleRegister() {
    createAuth('POST');
  }

  async function createAuth(method) {
    try {
      const res = await fetch('/api/auth', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      await res.json();
      if (res.ok) {
        navigate('/profile');
      } else {
        alert('Authentication failed');
      }
    } catch (error) {
      console.error('Authentication request failed:', error);
      alert('Unable to connect to the authentication service');
    }
  }

  return (
    <div>
      <h1>Login</h1>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="button" disabled={!(email && password)} onClick={handleLogin}>
        Login
      </button>
      <button type="button" disabled={!(email && password)} onClick={handleRegister}>
        Register
      </button>
    </div>
  );
}

function Profile() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = React.useState(null);

  React.useEffect(() => {
    let active = true;

    async function getUser() {
      try {
        const res = await fetch('/api/user/me');
        if (res.status === 401) {
          navigate('/');
          return;
        }
        if (!res.ok) {
          throw new Error(`Get user failed with status ${res.status}`);
        }
        const data = await res.json();
        if (active) {
          setUserInfo(data);
        }
      } catch (error) {
        console.error('Unable to load profile:', error);
        if (active) {
          alert('Unable to load profile');
        }
      }
    }

    getUser();
    return () => {
      active = false;
    };
  }, [navigate]);

  async function handleLogout() {
    try {
      const res = await fetch('/api/auth', { method: 'DELETE' });
      if (!res.ok) {
        throw new Error(`Logout failed with status ${res.status}`);
      }
      navigate('/');
    } catch (error) {
      console.error('Logout request failed:', error);
      alert('Unable to log out. Please try again.');
    }
  }

  return (
    <div>
      <h1>Profile</h1>
      <div>Logged in as: {userInfo?.email ?? 'Loading...'}</div>
      <button type="button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
