let state = State.IDLE;

const ctx = {
  initialBalance: 500000,
  balance: 500000,
  betSize: 1000,
  spinCount: 0,
  spinLimit: 500,
  startTime: 0,
  timeLimitMs: 30 * 60 * 1000 // 30 menit
};

function render() {
  document.getElementById("state").innerText = state;
  document.getElementById("balance").innerText = ctx.balance;
}

function startSession() {
  ctx.startTime = Date.now();
  ctx.spinCount = 0;
  state = transition(state, Event.START, ctx);
  render();
}

function spin() {
  ctx.spinCount++;
  state = transition(state, Event.SPIN, ctx);
  render();
}

function bonus() {
  state = transition(state, Event.BONUS_TRIGGERED, ctx);
  alert("BONUS EXIT — SESSION LOCKED");
  render();
}

function updateBalance() {
  const input = prompt("Masukkan saldo terbaru:");
  const newBalance = parseInt(input);

  if (!isNaN(newBalance)) {
    ctx.balance = newBalance;
    state = transition(state, Event.UPDATE_BALANCE, ctx);
    render();
  }
}

render();