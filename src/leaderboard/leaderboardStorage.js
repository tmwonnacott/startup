function isScoreEntry(entry) {
  return entry
    && typeof entry.username === 'string'
    && typeof entry.word === 'string'
    && Number.isInteger(entry.length)
    && entry.length === entry.word.length;
}

async function readLeaderboardResponse(response) {
  if (!response.ok) {
    let message = `Leaderboard request failed with status ${response.status}.`;
    try {
      const error = await response.json();
      if (typeof error.msg === 'string') {
        message = error.msg;
      }
    } catch {
      // Keep the status-based message when the service does not return JSON.
    }
    throw new Error(message);
  }

  const data = await response.json();

  if (
    !data
    || !Array.isArray(data.entries)
    || !data.entries.every(isScoreEntry)
    || !(data.latestScore === null || isScoreEntry(data.latestScore))
  ) {
    throw new Error('The leaderboard service returned invalid data.');
  }

  return data;
}

export async function loadLeaderboardData() {
  const response = await fetch('/api/leaderboard');
  return readLeaderboardResponse(response);
}

export async function saveLeaderboardScore(score) {
  const response = await fetch('/api/leaderboard', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ word: score.word }),
  });
  return readLeaderboardResponse(response);
}
