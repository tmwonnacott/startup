import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PageFrame } from '../shared/pageFrame';
import { AccountContext } from '../shared/accountContext';
import { getPlayerLabel } from '../shared/playerLabel';
import './loser.css';

export function Loser() {
  const { state } = useLocation();
  const { accountName } = React.useContext(AccountContext);

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
        {state?.losingPlayer ? (
          <p>{getPlayerLabel(state.losingPlayer, accountName)} loses for completing the real word {state.word}.</p>
        ) : (
          <p>You were bluffing or submitted a word that is not a real word.</p>
        )}
        <Link className="loss-button" to="/start">Play Again With Same Players</Link>
        <Link className="loss-button" to="/">Back to Menu</Link>
      </main>
    </PageFrame>
  );
}
