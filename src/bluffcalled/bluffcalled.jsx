import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './bluffcalled.css';

export function BluffCalled() {
  const [word, setWord] = useState('');

  return (
    <div className="bluff-page">
      <header className="bluff-called-header">
        <h1>PLAYER [] CALLED BLUFF</h1>
      </header>
      <main>
        <h2>Type a word that starts with [CURRENT LETTERS PLACEHOLDER] or admit to bluffing.</h2>
        <input
          id="word-input"
          type="text"
          placeholder="Enter word"
          value={word}
          onChange={(event) => setWord(event.target.value.replace(/[^a-z]/gi, '').toUpperCase())}
        />
        <Link to="/winner">Submit Word</Link>
        <Link to="/loser">ADMIT TO BLUFF</Link>
      </main>
      <footer><p>NeverWord © 2026</p></footer>
    </div>
  );
}
