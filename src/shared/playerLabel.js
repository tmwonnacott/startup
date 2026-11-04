export function getPlayerLabel(player, accountName) {
  if (player === 1 && accountName && accountName !== 'Guest' && accountName !== 'Account unavailable') {
    return accountName;
  }
  return `Player ${player}`;
}
