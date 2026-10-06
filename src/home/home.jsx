import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageFrame } from '../shared/pageFrame';

export function Home() {
  const [gameCode, setGameCode] = useState('');

  return (
    <PageFrame
      className="home-page"
      footer={
        <>
          <nav aria-label="Main navigation">
            <Link to="/leaderboard" className="btn btn-primary">Leaderboard</Link>
            <Link to="/rules" className="btn btn-primary">Rules</Link>
          </nav>
          <p>Thomas Wonnacott</p>
          <a id="Github" href="https://github.com/tmwonnacott/startup">GitHub Repo</a>
          <p>NeverWord © 2026</p>
        </>
      }
    >
      <main className="container text-center home-main">
        <Link to="/waitingroom" className="btn btn-primary">Start Game</Link>
        <div className="join-game">
          <Link to="/start" className="btn btn-primary">Join Game</Link>
          <input
            type="text"
            id="game-code"
            className="form-control"
            maxLength="4"
            placeholder="CODE"
            value={gameCode}
            onChange={(event) => setGameCode(event.target.value)}
            aria-label="Game code"
          />
        </div>
      </main>
    </PageFrame>
  );
}
