const leaderboardStorageKey = 'neverword-leaderboard';

function isScoreEntry(entry) {
  return entry
    && typeof entry.username === 'string'
    && typeof entry.word === 'string'
    && Number.isInteger(entry.length)
    && entry.length === entry.word.length;
}

export function loadLeaderboardData() {
  const savedData = localStorage.getItem(leaderboardStorageKey);
  if (!savedData) {
    return { entries: [], latestScore: null };
  }

  let data;
  try {
    data = JSON.parse(savedData);
  } catch {
    throw new Error('Saved leaderboard data is unreadable. Clear the neverword-leaderboard localStorage entry to continue.');
  }

  if (
    !data
    || !Array.isArray(data.entries)
    || !data.entries.every(isScoreEntry)
    || !(data.latestScore === null || isScoreEntry(data.latestScore))
  ) {
    throw new Error('Saved leaderboard data is invalid. Clear the neverword-leaderboard localStorage entry to continue.');
  }

  return data;
}

export function saveLeaderboardScore(score) {
  const { entries } = loadLeaderboardData();
  const updatedData = {
    entries: [score, ...entries]
      .sort((first, second) => second.length - first.length)
      .slice(0, 10),
    latestScore: score,
  };
  localStorage.setItem(leaderboardStorageKey, JSON.stringify(updatedData));
  return updatedData;
}
