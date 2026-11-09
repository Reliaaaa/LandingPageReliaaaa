import { useState } from 'react';
import { ShieldCheck, Globe2, Lightbulb, Clapperboard } from 'lucide-react';
import { overlapOffset } from './overlap.js';

// Adapted from react-overlap by Kristofer Lund (MIT); see THIRD_PARTY_NOTICES.md.
const icons = [ShieldCheck, Globe2, Lightbulb, Clapperboard];
export default function InterestOverlap() {
  const [hovered, setHovered] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const open = hovered || expanded;
  return <div className="interest-overlap-wrap">
    <p>Areas of interest</p>
    <button type="button" className="interest-overlap" aria-label="Expand or collapse interest icons" aria-pressed={expanded} onClick={() => setExpanded(value => !value)} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onFocus={() => setHovered(true)} onBlur={() => setHovered(false)}>
      {icons.map((Icon, index) => <span className="interest-overlap-icon" key={index} style={{ transform: `translateX(${overlapOffset(index, open)}px)` }}><Icon size={21} aria-hidden="true" /></span>)}
    </button>
    <small>Technology · Digital transformation · Entrepreneurship · Creative media</small>
  </div>;
}
