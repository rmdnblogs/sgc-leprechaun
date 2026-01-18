export function transition(machine, event) {
  const s = machine.state;

  if (s === 'IDLE' && event === 'START') {
    return { ...machine, state: 'ACTIVE' };
  }

  if (s === 'ACTIVE' && event === 'BONUS') {
    return { ...machine, state: 'EXIT' };
  }

  if (event === 'RESET') {
    return { ...machine, state: 'IDLE' };
  }

  return machine;
}
