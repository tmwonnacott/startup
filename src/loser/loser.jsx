import React from 'react';
import { Link } from 'react-router-dom';
import { PageFrame } from '../shared/pageFrame';
import './loser.css';

export function Loser() {
  return (
    <PageFrame
      className="loss-page"
      header={
        <header className="loss-header">
          <p className="loss-eyebrow">ROUND OVER</p>
          <h1>YOU LOSE!</h1>
        </header>
      }
      footer={<p>NeverWord © 2026</p>}
    >
      <main>
        <h2>LOSER</h2>
        <p>[PLACEHOLDER OF WHY YOU LOST]</p>
        <Link className="loss-button" to="/start">Play Again With Same Players</Link>
        <Link className="loss-button" to="/">Back to Menu</Link>
      </main>
    </PageFrame>
  );
}
