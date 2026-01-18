import { transition } from './fsm.js';
import { closeBlock } from './analytics.js';
import { shouldExit } from './decision.js';
import { uiLock } from './ui-lock.js';

const BET = 1000;
const MODAL = 500000;
const RISK = MODAL * 0.2;

let m = {
  state: 'IDLE',
  ctx: {
    balance: MODAL,
    session: 1,
    blocksPnL: [],
    spinsInBlock: 0,
    totalSpins: 0,
    blockStake: 0,
    blockReturn: 0
  }
};

function render() {
  state.textContent = m.state;
  balance.textContent = `Rp ${m.ctx.balance}`;
  info.textContent = `Session ${m.ctx.session} | Spins ${m.ctx.totalSpins}/120 | Blocks ${m.ctx.blocksPnL.length}`;
  uiLock(m.state);
}

function send(e) {
  m = transition(m, e);
  render();
}

btnStart.onclick = () => send('START');

btnSpin.onclick = () => {
  const win = Number(winInput.value || 0);

  m.ctx.spinsInBlock++;
  m.ctx.totalSpins++;
  m.ctx.blockStake += BET;
  m.ctx.blockReturn += win;
  m.ctx.balance += win - BET;

  if (m.ctx.spinsInBlock === 30) {
    const pnl = closeBlock(m.ctx.blockStake, m.ctx.blockReturn);
    m.ctx.blocksPnL.push(pnl);

    const exit = shouldExit({
      blockIndex: m.ctx.blocksPnL.length,
      blocksPnL: m.ctx.blocksPnL,
      riskBudget: RISK,
      bonusHit: false
    });

    m.ctx.spinsInBlock = 0;
    m.ctx.blockStake = 0;
    m.ctx.blockReturn = 0;

    if (exit) send('RESET');
  }
  render();
};

btnBonus.onclick = () => send('BONUS');
btnUpdate.onclick = () => send('UPDATE_PNL');
btnReset.onclick = () => {
  m.ctx.session++;
  m.ctx.blocksPnL = [];
  m.ctx.totalSpins = 0;
  m.ctx.spinsInBlock = 0;
  send('RESET');
};

render();
