export function uiLock(state) {
  const lock = (id, on) => {
    const el = document.getElementById(id);
    if (el) el.disabled = on;
  };

  if (state === 'IDLE') {
    lock('btnSpin', true);
    lock('btnBonus', true);
    lock('btnUpdate', true);
  }

  if (state === 'ACTIVE') {
    lock('btnSpin', false);
    lock('btnBonus', false);
    lock('btnUpdate', false);
  }

  if (state === 'EXIT') {
    lock('btnSpin', true);
    lock('btnBonus', true);
    lock('btnUpdate', true);
  }
}
