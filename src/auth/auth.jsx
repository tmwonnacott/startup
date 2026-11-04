import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PageFrame } from '../shared/pageFrame';

export function LoginPanel() {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');

  async function createAuth(method) {
    setError('');
    try {
      const response = await fetch('/api/auth', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        setError(
          response.status === 409
            ? 'An account with that email already exists.'
            : response.status === 401
              ? 'Email or password is incorrect.'
              : 'Authentication failed. Please try again.',
        );
        return;
      }

      await response.json();
      navigate('/profile');
    } catch (requestError) {
      console.error('Authentication request failed:', requestError);
      setError('Unable to connect to the authentication service.');
    }
  }

  return (
    <section className="login-panel" aria-labelledby="login-heading">
      <h2 id="login-heading">Account</h2>
      <form onSubmit={(event) => event.preventDefault()}>
        <label htmlFor="account-email">Email:</label>
        <input
          id="account-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <label htmlFor="account-password">Password:</label>
        <input
          id="account-password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        <div className="login-actions">
          <button
            type="button"
            className="btn btn-primary"
            disabled={!email || !password}
            onClick={() => createAuth('PUT')}
          >
            Login
          </button>
          <button
            type="button"
            className="btn btn-primary"
            disabled={!email || !password}
            onClick={() => createAuth('POST')}
          >
            Register
          </button>
        </div>
      </form>
      {error && <p className="login-error" role="alert">{error}</p>}
    </section>
  );
}

export function LoginPage() {
  return (
    <PageFrame
      className="home-page"
      footer={<Link to="/" className="btn btn-primary">Back to game</Link>}
    >
      <main className="container text-center profile-main">
        <LoginPanel />
      </main>
    </PageFrame>
  );
}

export function Profile() {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState('');
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    let active = true;

    async function loadProfile() {
      try {
        const response = await fetch('/api/user/me');
        if (response.status === 401) {
          navigate('/');
          return;
        }
        if (!response.ok) {
          throw new Error(`Profile request failed with status ${response.status}`);
        }
        const user = await response.json();
        if (active) {
          setEmail(user.email);
        }
      } catch (requestError) {
        console.error('Unable to load profile:', requestError);
        if (active) {
          setError('Unable to load your profile. Please try again.');
        }
      }
    }

    loadProfile();
    return () => {
      active = false;
    };
  }, [navigate]);

  async function handleLogout() {
    setError('');
    try {
      const response = await fetch('/api/auth', { method: 'DELETE' });
      if (!response.ok) {
        throw new Error(`Logout request failed with status ${response.status}`);
      }
      navigate('/');
    } catch (requestError) {
      console.error('Logout request failed:', requestError);
      setError('Unable to log out. Please try again.');
    }
  }

  return (
    <PageFrame
      className="home-page"
      footer={<Link to="/" className="btn btn-primary">Back to game</Link>}
    >
      <main className="container text-center profile-main">
        <h2>Profile</h2>
        <p>Logged in as: {email || 'Loading...'}</p>
        {error && <p className="login-error" role="alert">{error}</p>}
        <button type="button" className="btn btn-primary" onClick={handleLogout}>
          Logout
        </button>
      </main>
    </PageFrame>
  );
}
