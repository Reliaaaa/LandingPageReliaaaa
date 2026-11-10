export function menuScrollPosition(target, sectionTop, headingOffset, headingHeight, viewportHeight) {
  if (target === '#home') return 0;
  if (target === '#experience') return Math.max(0, sectionTop + headingOffset + headingHeight / 2 - viewportHeight / 2);
  return null;
}
