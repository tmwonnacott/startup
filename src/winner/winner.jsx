import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { PageFrame } from '../shared/pageFrame';
import { saveLeaderboardScore } from '../leaderboard/leaderboardStorage';
import './winner.css';

export function Winner() {
  const { state } = useLocation();
  const word = state?.word;
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [submitError, setSubmitError] = useState('');

  function submitScore(event) {
    event.preventDefault();
    const trimmedUsername = username.trim();
    if (!trimmedUsername || !password) {
      return;
    }

    try {
      saveLeaderboardScore({
        username: trimmedUsername,
        word: typeof word === 'string' ? word : '',
        length: typeof word === 'string' ? word.length : 0,
      });
      navigate('/leaderboard', { state: { showLatestScore: true } });
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Could not save your score.');
    }
  }

  return (
    <PageFrame
      className="winner-page"
      header={
        <header className="win-header">
          <p className="win-eyebrow">ROUND OVER</p>
          <h1>YOU WIN!</h1>
        </header>
      }
      footer={<p>NeverWord © 2026</p>}
    >
      <main>
        <h2>Well played!</h2>
        <nav className="win-actions" aria-label="Game options">
          <Link className="win-button" to="/start">Play Again With Same Players</Link>
          <Link className="win-button win-button--secondary" to="/">Main Menu</Link>
        </nav>
        <br></br>
        {word && <h2>Your Word: {word}</h2>}
        <form className="win-leaderboard" aria-labelledby="leaderboard-title" onSubmit={submitScore}>
          <h3 id="leaderboard-title">Submit to the leaderboard</h3>
          <input
            type="text"
            aria-label="Username"
            placeholder="Enter Username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoComplete="username"
            required
          />
          <input
            type="password"
            aria-label="Password"
            placeholder="Enter Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
          />
          <p>Password is required for this local demo but is not stored.</p>
          {submitError && <p role="alert">{submitError}</p>}
          <button
            className="win-button win-button--secondary"
            type="submit"
            disabled={!username.trim() || !password}
          >
            Submit to Leaderboard
          </button>
        </form>
      </main>
    </PageFrame>
  );
}
