import React from 'react';
import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import { Home } from './home/home';
import { StartGame } from './start/start';
import { WaitingRoom } from './waitingroom/waitingroom';
import { Rules } from './rules/rules';
import { BluffCalled } from './bluffcalled/bluffcalled';
import { Leaderboard } from './leaderboard/leaderboard';
import { Loser } from './loser/loser';
import { Winner } from './winner/winner';

function ScrollToTop() {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function NotFound() {
  return (
    <main className="standard-page not-found-page">
      <h1>Page not found</h1>
      <Link to="/">Back to Menu</Link>
    </main>
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
