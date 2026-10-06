import React from 'react';
import { Link } from 'react-router-dom';
import './leaderboard.css';

const entries = [
  ['WordWizard', 'Floccinaucinihilipilification', 29],
  ['LetterLegend', 'Antidisestablishmentarianism', 28],
  ['LexiMaster', 'Psychoneuroendocrinological', 28],
  ['SpellSprinter', 'Honorificabilitudinitatibus', 27],
  ['VocabVoyager', 'Counterrevolutionaries', 22],
  ['SyntaxSage', 'Uncharacteristically', 20],
  ['WordSmithy', 'Misunderstanding', 16],
  ['GlyphGazer', 'Extraordinary', 13],
  ['PhrasePilot', 'Knowledgeable', 12],
  ['RhymeRunner', 'Imagination', 11],
  ['[your name]', '[your word]', '[number of letters]'],
];

export function Leaderboard() {
  return (
    <div className="leaderboard-app">
      <main className="leaderboard-page">
        <h1>Leaderboard</h1>
        <div className="table-scroll" role="region" aria-label="Leaderboard entries" tabIndex="0">
          <table>
            <caption>Longest words played</caption>
            <thead>
              <tr>
                <th scope="col">Username</th>
                <th scope="col">Word</th>
                <th scope="col">Number of Letters</th>
              </tr>
            </thead>
            <tbody>
              {entries.map(([username, playedWord, length]) => (
                <tr key={username}><td>{username}</td><td>{playedWord}</td><td>{length}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      <footer className="leaderboard-footer">
        <Link className="menu-button" to="/">Back to Main Menu</Link>
        <p>NeverWord © 2026</p>
      </footer>
    </div>
  );
}
