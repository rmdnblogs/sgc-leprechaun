export function uiLock(state) {
  const ids = ['btnStart','btnSpin','btnBonus','btnUpdate','btnReset'];
  const b = {};
  ids.forEach(id => b[id] = document.getElementById(id));
  ids.forEach(id => b[id].disabled = true);

  document.body.classList.remove('bonus-exit');

  if (state === 'IDLE') b.btnStart.disabled = false;
  if (state === 'ACTIVE') {
    b.btnSpin.disabled = false;
    b.btnBonus.disabled = false;
    b.btnUpdate.disabled = false;
  }
  if (state === 'BONUS_EXIT') {
    b.btnUpdate.disabled = false;
    document.body.classList.add('bonus-exit');
  }
  if (state === 'ENDED') b.btnReset.disabled = false;
}
