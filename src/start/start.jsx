import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PageFrame } from '../shared/pageFrame';
import { AccountContext } from '../shared/accountContext';
import { getPlayerLabel } from '../shared/playerLabel';
import './start.css';

export function StartGame() {
  const [letter, setLetter] = useState('');
  const [currentLetters, setCurrentLetters] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [checkingWord, setCheckingWord] = useState(false);
  const [error, setError] = useState('');
  const { accountName } = React.useContext(AccountContext);
  const navigate = useNavigate();

  async function submitLetter() {
    if (!/^[A-Z]$/.test(letter) || checkingWord) {
      return;
    }

    const submittedLetter = letter;
    const nextLetters = [...currentLetters, submittedLetter];
    setLetter('');
    setError('');

    if (nextLetters.length >= 4) {
      setCheckingWord(true);
      try {
        const submittedWord = nextLetters.join('');
        const response = await fetch(
          `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(submittedWord.toLowerCase())}`,
        );
        if (response.status === 404) {
          setCurrentLetters(nextLetters);
          setCurrentPlayer((player) => (player === 1 ? 2 : 1));
          return;
        }
        if (!response.ok) {
          throw new Error(`Dictionary lookup failed with status ${response.status}`);
        }

        const entries = await response.json();
        if (Array.isArray(entries) && entries.length > 0) {
          navigate('/loser', {
            state: {
              losingPlayer: currentPlayer,
              word: submittedWord,
              reason: 'submitted a real word',
            },
          });
          return;
        }

        setCurrentLetters(nextLetters);
        setCurrentPlayer((player) => (player === 1 ? 2 : 1));
      } catch (requestError) {
        console.error('Unable to verify submitted word:', requestError);
        setError('The dictionary service is unavailable. Your letter was not submitted; please try again.');
        setLetter(submittedLetter);
      } finally {
        setCheckingWord(false);
      }
    } else {
      setCurrentLetters(nextLetters);
      setCurrentPlayer((player) => (player === 1 ? 2 : 1));
    }

  }

  return (
    <PageFrame
      className="game-page"
      footerClassName="game-footer"
      footer={
        <>
          <Link to="/" className="btn btn-primary">Home</Link>
          <p>NeverWord © 2026</p>
        </>
      }
    >
      <main className="container text-center game-screen">
        <p className="current-player-turn">
          {checkingWord
            ? 'Checking word...'
            : currentPlayer === 1
              ? `Submit a letter ${getPlayerLabel(1, accountName)}`
              : 'Waiting for Player 2 to Submit a Letter'}
        </p>
        <br></br>
        <h2>Current Letters</h2>
        <p className="current-letters">{currentLetters.join('') || '_'}</p>
        {currentLetters.length > 0 && (
          <h3>
            {getPlayerLabel(currentPlayer === 1 ? 2 : 1, accountName)} Chose the Letter:{' '}
            {currentLetters[currentLetters.length - 1]}
          </h3>
        )}
        <form
          className="letter-form"
          onSubmit={(event) => {
            event.preventDefault();
            submitLetter();
          }}
        >
          <input
            type="text"
            className="form-control letter-input"
            maxLength="1"
            aria-label="Choose a letter"
            value={letter}
            onChange={(event) => setLetter(event.target.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 1))}
            disabled={checkingWord}
          />
          <button
            type="submit"
            className="btn btn-primary submit-letter"
            disabled={!/^[A-Z]$/.test(letter) || checkingWord}
          >
            {checkingWord ? 'Checking...' : 'Submit Letter'}
          </button>
        </form>
        {error && <p className="word-check-error" role="alert">{error}</p>}
        <p className="call-bluff">CALL BLUFF!</p>
        {currentLetters.length >= 2 ? (
          <Link
            to="/bluff-called"
            state={{ currentLetters: currentLetters.join(''), currentPlayer }}
            aria-label="Call bluff"
          >
            <img src="/BigRedButton.png" width="100" alt="Call bluff" />
          </Link>
        ) : (
          <span className="bluff-button-disabled" aria-label="Call bluff is available after two letters">
            <img src="/BigRedButton.png" width="100" alt="" />
          </span>
        )}
      </main>
    </PageFrame>
  );
}
