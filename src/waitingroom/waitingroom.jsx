import React from 'react';
import { Link } from 'react-router-dom';
import { PageFrame } from '../shared/pageFrame';

export function WaitingRoom() {
  return (
    <PageFrame
      className="waiting-page"
      footer={
        <>
          <nav aria-label="Game information">
            <Link to="/leaderboard" className="btn btn-primary">Leaderboard</Link>
            <Link to="/rules" className="btn btn-primary">Rules</Link>
          </nav>
          <p>Thomas Wonnacott</p>
          <a id="Github" href="https://github.com/tmwonnacott/startup">GitHub Repo</a>
          <p>NeverWord © 2026</p>
        </>
      }
    >
      <main className="container text-center">
        <section className="waiting-room" aria-labelledby="room-title">
          <h2 id="room-title">Your room is ready</h2>
          <p>Share this code with your friend to get started.</p>
          <div className="room-code">A7K2</div>
          <p className="status">Waiting for player to join</p>
          <Link to="/" className="btn btn-primary">Back to Home</Link>
        </section>
      </main>
    </PageFrame>
  );
}
