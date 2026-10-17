import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageFrame } from '../shared/pageFrame';
import './start.css';

export function StartGame() {
  const [letter, setLetter] = useState('');
  const [currentLetters, setCurrentLetters] = useState([]);

  function submitLetter() {
    const submittedLetter = letter.trim().toUpperCase();
    if (submittedLetter) {
      setCurrentLetters((letters) => [...letters, submittedLetter]);
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
        <h2>Current Letters</h2>
        <p className="current-letters">{currentLetters.join('') || 'None'}</p>
        <h3>Player 2 Chose the Letter: [PLAYER2 LETTER PLACEHOLDER]</h3>
        <h3>Player 1 Choose a Letter</h3>
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
