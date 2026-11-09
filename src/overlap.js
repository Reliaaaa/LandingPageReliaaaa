// Position formula adapted from react-overlap, MIT; see THIRD_PARTY_NOTICES.md.
export function overlapOffset(index, expanded) {
  const size = 48;
  const spacing = 8;
  const overlap = 0.4;
  return expanded ? index * (size + spacing) : index * size * (1 - overlap);
}
