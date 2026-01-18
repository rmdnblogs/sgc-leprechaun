import { transition } from './fsm.js';
import { closeBlock } from './analytics.js';
import { shouldExit } from './decision.js';
import { uiLock } from './ui-lock.js';

/* ===== DOM ===== */
const elState   = document.getElementById('state');
const elBalance = document.getElementById('balance');
const elInfo    = document.getElementById('info');

const initialBalanceInput = document.getElementById('initialBalance');
const winInput  = document.getElementById('win');

const btnStart  = document.getElementById('btnStart');
const btnSpin   = document.getElementById('btnSpin');
const btnBonus  = document.getElementById('btnBonus');
const btnUpdate = document.getElementById('btnUpdate');
const btnReset  = document.getElementById('btnReset');

/* ===== PARAM ===== */
const BET = 1000;
let RISK = 0;

/* ===== MACHINE ===== */
let m = {
  state: 'IDLE',
  ctx: {
    balance: 0,
    session: 1,
    blocksPnL: [],
    spinsInBlock: 0,
    totalSpins: 0,
    blockStake: 0,
    blockReturn: 0
  }
};

/* ===== RENDER ===== */
function render() {
  elState.textContent = m.state;
  elBalance.textContent = `Rp ${m.ctx.balance}`;
  elInfo.textContent =
    `Session ${m.ctx.session} | ` +
    `Spins ${m.ctx.totalSpins}/120 | ` +
    `Blocks ${m.ctx.blocksPnL.length}`;

  uiLock(m.state);
}

/* ===== FSM ===== */
function send(event) {
  m = transition(m, event);
  render();
}

/* ===== EVENTS ===== */

// START SESSION
btnStart.onclick = () => {
  const val = Number(initialBalanceInput.value);
  if (!val || val <= 0) {
    alert('Masukkan saldo awal yang valid');
    return;
  }

  m.ctx.balance = val;
  RISK = val * 0.2;

  m.ctx.blocksPnL = [];
  m.ctx.spinsInBlock = 0;
  m.ctx.totalSpins = 0;
  m.ctx.blockStake = 0;
  m.ctx.blockReturn = 0;

  initialBalanceInput.disabled = true;
  send('START');
};

// SPIN
btnSpin.onclick = () => {
  if (m.state !== 'ACTIVE') return;

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

    if (exit) {
      send('RESET');
      return;
    }
  }

  render();
};

// BONUS
btnBonus.onclick = () => {
  if (m.state !== 'ACTIVE') return;
  send('BONUS'); // BONUS = EXIT WAJIB (SGC)
};

// UPDATE SALDO (opsional manual)
btnUpdate.onclick = () => {
  const win = Number(winInput.value || 0);
  m.ctx.balance += win;
  render();
};

// RESET
btnReset.onclick = () => {
  m.ctx.session++;
  m.ctx.balance = 0;
  m.ctx.blocksPnL = [];
  m.ctx.totalSpins = 0;
  m.ctx.spinsInBlock = 0;
  m.ctx.blockStake = 0;
  m.ctx.blockReturn = 0;

  initialBalanceInput.disabled = false;
  initialBalanceInput.value = '';

  send('RESET');
};

/* ===== INIT ===== */
render();
