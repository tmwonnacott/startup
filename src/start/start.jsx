import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageFrame } from '../shared/pageFrame';
import './start.css';

export function StartGame() {
  const [letter, setLetter] = useState('');
  const [currentLetters, setCurrentLetters] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(1);

  function submitLetter() {
    if (/^[A-Z]$/.test(letter)) {
      setCurrentLetters((letters) => [...letters, letter]);
      setCurrentPlayer((player) => (player === 1 ? 2 : 1));
    }
    setLetter('');
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
          {currentPlayer === 1
            ? 'Submit a letter Player 1'
            : 'Waiting for Player 2 to Submit a Letter'}
        </p>
        <br></br>
        <h2>Current Letters</h2>
        <p className="current-letters">{currentLetters.join('') || '_'}</p>
        {currentLetters.length > 0 && (
          <h3>
            Player {currentPlayer === 1 ? 2 : 1} Chose the Letter:{' '}
            {currentLetters[currentLetters.length - 1]}
          </h3>
        )}
        <input
          type="text"
          className="form-control letter-input"
          maxLength="1"
          aria-label="Choose a letter"
          value={letter}
          onChange={(event) => setLetter(event.target.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 1))}
        />
        <button
          type="button"
          className="btn btn-primary submit-letter"
          onClick={submitLetter}
          disabled={!/^[A-Z]$/.test(letter)}
        >
          Submit Letter
        </button>
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
