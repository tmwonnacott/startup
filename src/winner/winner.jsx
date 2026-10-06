import React from 'react';
import { Link } from 'react-router-dom';
import './winner.css';

export function Winner() {
  return (
    <div className="winner-page">
      <header className="win-header">
        <p className="win-eyebrow">ROUND OVER</p>
        <h1>YOU WIN!</h1>
      </header>
      <main>
        <h2>Well played!</h2>
        <nav className="win-actions" aria-label="Game options">
          <Link className="win-button" to="/start">Play Again With Same Players</Link>
          <Link className="win-button win-button--secondary" to="/">Main Menu</Link>
        </nav>
        <section className="win-leaderboard" aria-labelledby="leaderboard-title">
          <h3 id="leaderboard-title">Submit to the leaderboard</h3>
          <input type="text" aria-label="Username" placeholder="Enter Username" />
          <input type="password" aria-label="Password" placeholder="Enter Password" />
          <Link className="win-button win-button--secondary" to="/leaderboard">Submit to Leaderboard</Link>
        </section>
      </main>
      <footer><p>NeverWord © 2026</p></footer>
    </div>
  );
}
