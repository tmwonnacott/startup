import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PageFrame } from '../shared/pageFrame';
import { loadLeaderboardData } from './leaderboardStorage';
import './leaderboard.css';

export function Leaderboard() {
  const { state } = useLocation();
  const showLatestScore = state?.showLatestScore === true;
  const [storageState] = useState(() => {
    try {
      return { data: loadLeaderboardData(), error: '' };
    } catch (error) {
      return {
        data: { entries: [], latestScore: null },
        error: error instanceof Error ? error.message : 'Could not load the leaderboard.',
      };
    }
  });
  const { entries, latestScore } = storageState.data;

  return (
    <PageFrame
      className="leaderboard-app"
      footerClassName="leaderboard-footer"
      footer={
        <>
          <Link className="menu-button" to="/">Back to Main Menu</Link>
          <p>NeverWord © 2026</p>
        </>
      }
    >
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
              {showLatestScore && latestScore && (
                <tr className="current-game-score">
                  <td>{latestScore.username} (This Game)</td>
                  <td>{latestScore.word}</td>
                  <td>{latestScore.length}</td>
                </tr>
              )}
              {entries.map((entry, index) => (
                <tr key={`${entry.username}-${entry.word}-${index}`}>
                  <td className={index < 3 ? `leaderboard-rank-cell leaderboard-rank-${index + 1}` : undefined}>
                    {index < 3 && <span className="leaderboard-rank" aria-hidden="true">{index + 1}</span>}
                    <span>{entry.username}</span>
                  </td>
                  <td>{entry.word}</td>
                  <td>{entry.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {storageState.error && <p role="alert">{storageState.error}</p>}
        {!storageState.error && entries.length === 0 && <p>No scores submitted yet.</p>}
      </main>
    </PageFrame>
  );
}
