export function shouldExit({ blockIndex, blocksPnL, riskBudget, bonusHit }) {
  if (bonusHit) return true;

  const totalPnL = blocksPnL.reduce((a, b) => a + b, 0);

  // Stop-loss berbasis sesi
  if (totalPnL <= -riskBudget) return true;

  // Hard cap: max 4 block (120 spin)
  if (blockIndex >= 4) return true;

  return false;
}
