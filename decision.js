export function shouldExit({ blockIndex, blocksPnL, riskBudget, bonusHit }) {
  const cum = blocksPnL.reduce((a, b) => a + b, 0);
  const avg = cum / blocksPnL.length;
  const pProfit = blocksPnL.filter(p => p > 0).length / blocksPnL.length;

  if (bonusHit) return true;
  if (cum <= -riskBudget) return true;

  if (blockIndex === 1) return blocksPnL[0] < -0.25 * riskBudget;
  if (blockIndex === 2)
    return cum < -0.5 * riskBudget || (blocksPnL[0] < 0 && blocksPnL[1] < 0);
  if (blockIndex === 3)
    return cum < -0.75 * riskBudget || (avg < 0 && pProfit < 0.33);
  if (blockIndex === 4) return true;

  return false;
      }
