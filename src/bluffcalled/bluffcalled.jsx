import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AccountContext } from '../shared/accountContext';
import { getPlayerLabel } from '../shared/playerLabel';
import './bluffcalled.css';

export function BluffCalled() {
  const [word, setWord] = useState('');
  const [checkingWord, setCheckingWord] = useState(false);
  const [error, setError] = useState('');
  const { state } = useLocation();
  const navigate = useNavigate();
  const { accountName } = React.useContext(AccountContext);
  const currentLetters = state?.currentLetters ?? 'None';
  const currentPlayer = state?.currentPlayer;

  async function submitWord(event) {
    event.preventDefault();
    const submittedWord = word.trim().toLowerCase();
    if (!submittedWord || checkingWord) {
      return;
    }

    setCheckingWord(true);
    setError('');
    try {
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(submittedWord)}`,
      );
      if (response.status === 404) {
        navigate('/loser');
        return;
      }
      if (!response.ok) {
        throw new Error(`Dictionary lookup failed with status ${response.status}`);
      }

      const entries = await response.json();
      navigate(Array.isArray(entries) && entries.length > 0 ? '/winner' : '/loser', {
        state: { word: word.trim().toUpperCase() },
      });
    } catch (requestError) {
      console.error('Unable to verify submitted word:', requestError);
      setError('Could not verify the word right now. Please try again.');
    } finally {
      setCheckingWord(false);
    }
  }

  return (
    <div className="bluff-page">
      <header className="bluff-called-header">
        <h1>{currentPlayer ? `${getPlayerLabel(currentPlayer, accountName)} ` : ''}CALLED BLUFF</h1>
      </header>
      <main>
        <h2>Type a word that starts with {currentLetters} or admit to bluffing.</h2>
        <form className="bluff-word-form" onSubmit={submitWord}>
          <input
            id="word-input"
            type="text"
            placeholder="Enter word"
            value={word}
            onChange={(event) => setWord(event.target.value.replace(/[^a-z]/gi, '').toUpperCase())}
            aria-label="Word to check"
          />
          {error && <p className="word-check-error" role="alert">{error}</p>}
          <button type="submit" disabled={!word.trim() || checkingWord}>
            {checkingWord ? 'Checking word...' : 'Submit Word'}
          </button>
        </form>
        <Link to="/loser">ADMIT TO BLUFF</Link>
      </main>
      <footer><p>NeverWord © 2026</p></footer>
    </div>
  );
}
