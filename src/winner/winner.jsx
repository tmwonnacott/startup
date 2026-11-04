import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { PageFrame } from '../shared/pageFrame';
import { saveLeaderboardScore } from '../leaderboard/leaderboardStorage';
import { AccountContext } from '../shared/accountContext';
import './winner.css';

export function Winner() {
  const { state } = useLocation();
  const word = state?.word;
  const navigate = useNavigate();
  const { accountName, accountLoading } = React.useContext(AccountContext);
  const [submitError, setSubmitError] = useState('');
  const isLoggedIn = !accountLoading
    && accountName !== 'Guest'
    && accountName !== 'Account unavailable';

  function submitScore(event) {
    event.preventDefault();
    if (!isLoggedIn) {
      return;
    }

    try {
      saveLeaderboardScore({
        username: accountName,
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
          <div className="win-leaderboard-heading">
            <h3 id="leaderboard-title">
              {isLoggedIn ? '' : 'Login to Submit to Leaderboard'}
            </h3>
            {!accountLoading && !isLoggedIn && (
              <Link
                className="win-button"
                to="/login"
                state={{ returnTo: '/winner', returnState: state }}
              >
                Login/Register
              </Link>
            )}
          </div>
          {accountLoading && <h3 id = 'leaderboard-title'>Checking account...</h3>}
          {isLoggedIn && <h3>Submitting as {accountName}</h3>}
          {submitError && <p role="alert">{submitError}</p>}
          <button
            className="win-button win-button--secondary"
            type="submit"
            disabled={accountLoading || !isLoggedIn}
          >
            Submit to Leaderboard
          </button>
        </form>
      </main>
    </PageFrame>
  );
}
