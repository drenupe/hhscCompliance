let locks = 0;
let prevOverflow = '';
let prevPaddingRight = '';

function getScrollbarWidth(): number {
  return window.innerWidth - document.documentElement.clientWidth;
}

export function lockBodyScroll(): void {
  locks++;
  if (locks !== 1) return;

  const body = document.body;
  prevOverflow = body.style.overflow;
  prevPaddingRight = body.style.paddingRight;

  const w = getScrollbarWidth();
  if (w > 0) body.style.paddingRight = `${w}px`;
  body.style.overflow = 'hidden';
}

export function unlockBodyScroll(): void {
  locks--;
  if (locks > 0) return;
  locks = 0;

  const body = document.body;
  body.style.overflow = prevOverflow;
  body.style.paddingRight = prevPaddingRight;
}
