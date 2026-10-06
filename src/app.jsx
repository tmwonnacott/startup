import React, { useState } from 'react';
import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../index.css';
import '../start.css';
import '../leaderboard.css';
import '../BluffCalled.css';
import '../loser.css';
import '../winner.css';
import './app.css';
import bigRedButton from '../BigRedButton.png';

function ScrollToTop() {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function PageFrame({ children, className = '', footer, footerClassName = '' }) {
  return (
    <div className={`standard-page ${className}`}>
      <header>
        <h1>NeverWord</h1>
        <h3>Trap your opponent with your vocabulary!</h3>
      </header>
      {children}
      <footer className={footerClassName}>{footer}</footer>
    </div>
  );
}

function Home() {
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

function WaitingRoom() {
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

function Rules() {
  return (
    <PageFrame className="rules-page" footer={<p>NeverWord © 2026</p>}>
      <main className="rules-main">
        <h2>How to Play</h2>
        <p>In NeverWord, your goal is to avoid spelling a real word, but don&apos;t spell a never-word. A never-word is a group of letters that can never become a word, like &quot;Qezx.&quot;</p>
        <p>You and your opponent take turns adding letters. The game ends when:</p>
        <p>1. Someone spells a real word and loses.</p>
        <p>2. Someone calls bluff. The opponent must write a real word that starts with the current letters. If they can&apos;t think of one, they lose.</p>
        <Link to="/" className="btn-primary">Back to Menu</Link>
      </main>
    </PageFrame>
  );
}

function StartGame() {
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
        <p className="current-letters">[LETTERS PLACEHOLDER]</p>
        <h3>Player 2 Chose the Letter: [PLAYER2 LETTER PLACEHOLDER]</h3>
        <h3>Player 1 Choose a Letter</h3>
        <input type="text" className="form-control letter-input" maxLength="1" aria-label="Choose a letter" />
        <button type="button" className="btn btn-primary submit-letter">Submit Letter</button>
        <p className="call-bluff">CALL BLUFF!</p>
        <Link to="/bluff-called" aria-label="Call bluff">
          <img src={bigRedButton} width="100" alt="Call bluff" />
        </Link>
      </main>
    </PageFrame>
  );
}

function BluffCalled() {
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

function Leaderboard() {
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

function Loser() {
  return (
    <div className="loss-page">
      <header className="loss-header">
        <p className="loss-eyebrow">ROUND OVER</p>
        <h1>YOU LOSE!</h1>
      </header>
      <main>
        <h2>LOSER</h2>
        <p>[PLACEHOLDER OF WHY YOU LOST]</p>
        <Link className="loss-button" to="/start">Play Again With Same Players</Link>
        <Link className="loss-button" to="/">Back to Menu</Link>
      </main>
      <footer><p>NeverWord © 2026</p></footer>
    </div>
  );
}

function Winner() {
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

function NotFound() {
  return (
    <PageFrame className="not-found-page" footer={<p>NeverWord © 2026</p>}>
      <main><h2>Page not found</h2><Link to="/" className="btn btn-primary">Back to Menu</Link></main>
    </PageFrame>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/start" element={<StartGame />} />
        <Route path="/waitingroom" element={<WaitingRoom />} />
        <Route path="/rules" element={<Rules />} />
        <Route path="/bluff-called" element={<BluffCalled />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/loser" element={<Loser />} />
        <Route path="/winner" element={<Winner />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
