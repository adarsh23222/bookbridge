function fix(iso) {
  if (!iso) return '';
  return /Z$|[+-]\d{2}:?\d{2}$/.test(iso) ? iso : iso + 'Z';
}

export function toIST(iso) {
  if (!iso) return '';
  return new Date(fix(iso)).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit', minute: '2-digit',
    day: '2-digit', month: 'short',
  });
}

export function timeIST(iso) {
  if (!iso) return '';
  return new Date(fix(iso)).toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit', minute: '2-digit',
  });
}

export function dateIST(iso) {
  if (!iso) return '';
  return new Date(fix(iso)).toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit', month: 'short', year: 'numeric',
  });
}
