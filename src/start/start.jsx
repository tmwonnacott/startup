import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageFrame } from '../shared/pageFrame';
import './start.css';

export function StartGame() {
  const [letter, setLetter] = useState('');
  const [currentLetters, setCurrentLetters] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(1);

  function submitLetter() {
    const submittedLetter = letter.trim().toUpperCase();
    if (submittedLetter) {
      setCurrentLetters((letters) => [...letters, submittedLetter]);
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
        <p className="current-player-turn">Player {currentPlayer}&apos;s Turn</p>
        <h2>Current Letters</h2>
        <p className="current-letters">{currentLetters.join('') || '_'}</p>
        {currentLetters.length > 0 && (
          <h3>
            Player {currentPlayer === 1 ? 2 : 1} Chose the Letter:{' '}
            {currentLetters[currentLetters.length - 1]}
          </h3>
        )}
        <h3>Player {currentPlayer} Choose a Letter</h3>
        <input
          type="text"
          className="form-control letter-input"
          maxLength="1"
          aria-label="Choose a letter"
          value={letter}
          onChange={(event) => setLetter(event.target.value)}
        />
        <button type="button" className="btn btn-primary submit-letter" onClick={submitLetter}>
          Submit Letter
        </button>
        <p className="call-bluff">CALL BLUFF!</p>
        <Link
          to="/bluff-called"
          state={{ currentLetters: currentLetters.join('') || 'None' }}
          aria-label="Call bluff"
        >
          <img src="/BigRedButton.png" width="100" alt="Call bluff" />
        </Link>
      </main>
    </PageFrame>
  );
}
