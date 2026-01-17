const State = {
  IDLE: "IDLE",
  IN_SESSION: "IN_SESSION",
  BONUS_EXIT: "BONUS_EXIT",
  STOP_LOSS_EXIT: "STOP_LOSS_EXIT",
  TIME_EXIT: "TIME_EXIT",
  TARGET_EXIT: "TARGET_EXIT"
};

const Event = {
  START: "START",
  SPIN: "SPIN",
  BONUS_TRIGGERED: "BONUS_TRIGGERED",
  UPDATE_BALANCE: "UPDATE_BALANCE"
};

function transition(state, event, ctx) {

  // BONUS = EXIT (GUARD TERTINGGI)
  if (event === Event.BONUS_TRIGGERED) {
    return State.BONUS_EXIT;
  }

  // TERMINAL STATES (ANTI RELAPSE)
  if (
    state === State.BONUS_EXIT ||
    state === State.STOP_LOSS_EXIT ||
    state === State.TIME_EXIT ||
    state === State.TARGET_EXIT
  ) {
    return state;
  }

  // START SESSION
  if (state === State.IDLE && event === Event.START) {
    return State.IN_SESSION;
  }

  // IN SESSION LOGIC
  if (state === State.IN_SESSION) {

    // STOP LOSS
    if (ctx.balance <= ctx.initialBalance * 0.75) {
      return State.STOP_LOSS_EXIT;
    }

    // TARGET 100%
    if (ctx.balance >= ctx.initialBalance * 2) {
      return State.TARGET_EXIT;
    }

    // TIME / SPIN LIMIT
    const elapsed = Date.now() - ctx.startTime;
    if (elapsed >= ctx.timeLimitMs || ctx.spinCount >= ctx.spinLimit) {
      return State.TIME_EXIT;
    }
  }

  return state;
}