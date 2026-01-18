export const T = {
  IDLE: { START: 'ACTIVE' },
  ACTIVE: { SPIN: 'ACTIVE', BONUS: 'BONUS_EXIT', UPDATE_PNL: 'ACTIVE' },
  BONUS_EXIT: { UPDATE_PNL: 'ENDED' },
  ENDED: { RESET: 'IDLE' }
};

export function transition(m, e, patch = {}) {
  const next = T[m.state]?.[e];
  if (!next) throw new Error(`INVALID ${m.state} -> ${e}`);
  return { state: next, ctx: { ...m.ctx, ...patch } };
}
