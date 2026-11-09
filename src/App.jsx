import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import Lenis from 'lenis';
import InterestOverlap from './InterestOverlap.jsx';
import { OverlayScrollbars } from 'overlayscrollbars';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
import { ArrowDown, ArrowUpRight, ChevronDown, Menu, X } from 'lucide-react';

const linkedin = 'https://www.linkedin.com/in/varellio-louis-tinangon-4172702a0/';
const concepts = [
  { number: '01', title: 'A space for what’s next.', description: 'A future home for a project overview, your role, and what you learned.', style: 'orbit' },
  { number: '02', title: 'Ideas, made tangible.', description: 'A place for a real project, its process, and an honest account of the outcome.', style: 'type' },
  { number: '03', title: 'Always in progress.', description: 'A space for an experiment or a personal exploration.', style: 'grid' },
];

const marqueeWords = ['Technology', 'Creative Media', 'Digital Transformation', 'Entrepreneurship'];
function Marquee() {
  return <div className="hero-marquee" aria-hidden="true">{marqueeWords.map((word, i) => <div className={`marquee-row marquee-row-${i + 1}`} key={word}><div className="marquee-track"><span>{word} · {word} · </span><span>{word} · {word} · </span></div></div>)}</div>;
}

export default function App() {
  const reducedMotion = useReducedMotion();
  const [intro, setIntro] = useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeProject, setActiveProject] = useState(null);
  const [status, setStatus] = useState({ kind: 'idle', message: '' });
  const [form, setForm] = useState({ name: '', email: '', message: '', company: '' });
  const menuRef = useRef(null);
  const dialogRef = useRef(null);
  const photoSectionRef = useRef(null);
  const photoRailRef = useRef(null);

  useLayoutEffect(() => {
    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    return () => { window.history.scrollRestoration = previous; };
  }, []);
  useEffect(() => {
    const instance = OverlayScrollbars({ target: document.body, cancel: { body: null } }, {
      overflow: { x: 'hidden', y: 'scroll' },
      scrollbars: { theme: 'os-theme-portfolio', autoHide: 'never', dragScroll: true },
    });
    const frame = window.requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => { window.cancelAnimationFrame(frame); instance?.destroy(); };
  }, []);
  useEffect(() => {
    if (intro || reducedMotion || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const lenis = new Lenis({ autoRaf: true, anchors: { offset: -95 }, syncTouch: false });
    return () => lenis.destroy();
  }, [intro, reducedMotion]);
  useEffect(() => {
    if (!intro) return;
    document.documentElement.classList.add('intro-lock');
    return () => document.documentElement.classList.remove('intro-lock');
  }, [intro]);
  useEffect(() => {
    fetch('/api/analytics', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ event: 'page_view', path: window.location.pathname }) }).catch(() => {});
  }, []);
  useEffect(() => {
    if (!intro) return;
    const timer = window.setTimeout(() => setIntro(false), 2500);
    return () => window.clearTimeout(timer);
  }, [intro]);
  useEffect(() => { if (reducedMotion) { const timer = window.setTimeout(() => setIntro(false), 0); return () => window.clearTimeout(timer); } }, [reducedMotion]);
  useEffect(() => {
    if (!menuOpen) return;
    const close = event => { if (event.key === 'Escape') { setMenuOpen(false); menuRef.current?.focus(); } };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [menuOpen]);
  useEffect(() => { if (activeProject) dialogRef.current?.showModal(); }, [activeProject]);
  useEffect(() => {
    if (reducedMotion || window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window) || !Element.prototype.animate) return;
    const animations = [];
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        animations.push(entry.target.animate(
          [{ opacity: 0.45, transform: 'translateY(24px)' }, { opacity: 1, transform: 'translateY(0)' }],
          { duration: 850, easing: 'cubic-bezier(.22,1,.36,1)' },
        ));
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.12 });
    document.querySelectorAll('.about-content, .timeline-row, .section-heading, .photo-rail, .project-card, .contact-copy, .contact-form-wrap').forEach(element => observer.observe(element));
    return () => { observer.disconnect(); animations.forEach(animation => animation.cancel()); };
  }, [reducedMotion]);


  useEffect(() => {
    const rail = photoRailRef.current;
    const section = photoSectionRef.current;
    if (!rail || !section || reducedMotion || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const media = gsap.matchMedia();
    media.add('(min-height: 600px)', () => {
      const previous = section.previousElementSibling;
      const previousLayer = previous && previous.getBoundingClientRect().height <= window.innerHeight
        ? ScrollTrigger.create({ trigger: previous, start: 'top top', endTrigger: section, end: 'top top', pin: true, pinSpacing: false, invalidateOnRefresh: true })
        : null;
      const distance = () => Math.max(0, rail.scrollWidth - rail.clientWidth);
      const leadDistance = () => Math.min(window.innerWidth * 0.08, distance() * 0.12);
      const setCut = amount => { section.style.clipPath = `inset(0 0 ${amount}% 0)`; };
      const approach = ScrollTrigger.create({
        trigger: section, start: 'top bottom', end: 'top top',
        onUpdate: self => { rail.scrollLeft = self.progress * leadDistance(); setCut((1 - self.progress) * 100); },
      });
      const pinned = ScrollTrigger.create({
        trigger: section, start: 'top top',
        end: () => `+=${Math.max(distance() - leadDistance(), window.innerHeight)}`,
        pin: true, anticipatePin: 1, invalidateOnRefresh: true,
        onUpdate: self => { rail.scrollLeft = leadDistance() + self.progress * (distance() - leadDistance()); setCut(Math.max(0, (self.progress - 0.86) / 0.14) * 20); },
      });
      return () => { pinned.kill(); approach.kill(); previousLayer?.kill(); section.style.removeProperty('clip-path'); };
    });
    return () => media.revert();
  }, [reducedMotion]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (status.kind === 'sending') return;
    setStatus({ kind: 'sending', message: 'Sending your message…' });
    try {
      const response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Your message couldn’t be sent. Please try again or connect on LinkedIn.');
      fetch('/api/analytics', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ event: 'contact_submit', path: window.location.pathname }) }).catch(() => {});
      setStatus({ kind: 'success', message: 'Message received. Thank you for getting in touch!' });
      setForm({ name: '', email: '', message: '', company: '' });
    } catch (error) { setStatus({ kind: 'error', message: error.message || 'Something went wrong. Please try again.' }); }
  }

  const closeProject = () => { dialogRef.current?.close(); setActiveProject(null); };
  const closeMenuOnBlur = event => { if (!event.currentTarget.contains(event.relatedTarget)) setMenuOpen(false); };
  return <>
    <div className="ambient-bg" aria-hidden="true"><span /><span /><span /></div>
    <a href="#main" className="skip-link" onClick={() => { setIntro(false); document.getElementById('main')?.focus({ preventScroll: true }); }}>Skip to content</a>
    <header className={intro ? "site-header is-intro" : "site-header"} onMouseEnter={() => setMenuOpen(true)} onMouseLeave={event => { if (!event.currentTarget.contains(document.activeElement)) setMenuOpen(false); }} onFocus={event => { if (!event.currentTarget.contains(event.relatedTarget) && event.target.matches(':focus-visible')) setMenuOpen(true); }} onBlur={closeMenuOnBlur}>
      <button ref={menuRef} className="notch-trigger" type="button" aria-label="Navigation menu" aria-expanded={menuOpen} aria-controls="main-nav" onClick={() => setMenuOpen(open => !open)}><Menu size={17} /><span>Menu</span><ChevronDown size={16} /></button>
      <nav id="main-nav" className={menuOpen ? 'nav-links is-open' : 'nav-links'} aria-label="Main navigation" hidden={!menuOpen}>
        <a href="#about" onClick={() => setMenuOpen(false)}>About</a><a href="#experience" onClick={() => setMenuOpen(false)}>Experience</a><a href="#work" onClick={() => setMenuOpen(false)}>Explorations</a><a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
      </nav>
    </header>
    <main id="main" tabIndex={-1}>
      <section id="home" className={intro ? "hero section-wrap is-intro" : "hero section-wrap"}>
        <Marquee />
        <div className="hero-copy"><div className="eyebrow">Informatics student · Surabaya</div><h1>Varellio Louis<br />{' '}<span>Tinangon.</span></h1></div>
        <div className="portrait-stage"><div className="portrait-halo" aria-hidden="true" /><img className="portrait-photo" src="/varellio-portrait.png" alt="Varellio Louis Tinangon" width="1024" height="1536" fetchPriority="high" /></div>
        <div className="hero-ground"><div className="hero-ground-text" aria-hidden="true">Technology · Creativity · Community</div><div className="hero-buttons"><a href="#about" className="button button-dark">Explore my interests <ArrowDown size={17} /></a><a className="text-link" href={linkedin} target="_blank" rel="noreferrer">Connect on LinkedIn <ArrowUpRight size={17} /></a></div>
        <div className="hero-bottom"><a href="#about">Scroll to discover <ArrowDown size={16} /></a></div></div>
      </section>
      <section id="about" className="about-section section-wrap">
        <div className="about-visual"><div className="section-index">01 / About</div><div className="about-photo-placeholder"><span className="about-photo-orbit" aria-hidden="true" /><span className="about-photo-caption">A moment in the making <small>Photo coming soon</small></span></div></div>
        <div className="about-content"><h2>More than a name.<br /><span>A story taking shape.</span></h2><div className="about-columns"><p>I’m Varellio, an Informatics student at Petra Christian University, exploring network and cyber security, digital transformation, and entrepreneurship.</p><p>I enjoy discovering how technology, creative media, and community can come together to create meaningful ideas.</p></div><InterestOverlap /></div>
      </section>
      <section id="experience" className="experience-section section-wrap"><div className="experience-inner"><div className="section-index">02 / Experience</div><div><h2>A journey <span>in the making.</span></h2><div className="timeline"><article className="timeline-row"><p>Mar 2025 – Feb 2026</p><div><h3>Student Council Treasurer</h3><p>Frateran Catholic Senior High School</p><p>Worked on budgets and financial reports.</p></div></article><article className="timeline-row"><p>Feb 2024 – Feb 2025</p><div><h3>Social &amp; Community Relations</h3><p>Frateran Catholic Senior High School</p><p>Supported community events and the Suara Fratorian podcast.</p></div></article></div><a className="underlined-link" href={linkedin} target="_blank" rel="noreferrer">View experience on LinkedIn <ArrowUpRight size={16} /></a></div></div></section>
      <section id="moments" ref={photoSectionRef} className="photo-section section-wrap"><div className="section-heading"><div><div className="section-index">03 / Moments</div><h2>Moments <span>in motion.</span></h2></div><p>A space for photographs to come.</p></div><div className="photo-toolbar"><p>Photo placeholders — personal photographs will be added later. Scroll down to explore the gallery, or swipe through it.</p></div><div ref={photoRailRef} className="photo-rail" role="region" aria-label="Photo placeholders; scroll horizontally" tabIndex={0}><div className="photo-track">{Array.from({length: 8}, (_, column) => <div className="photo-column" key={column}>{[0, 1].map(row => <div className="photo-placeholder" key={row}><span>{String(column * 2 + row + 1).padStart(2, '0')}</span><p>PHOTO PLACEHOLDER</p><small>Coming soon</small></div>)}</div>)}</div></div></section>
      <section id="work" className="work-section section-wrap"><div className="section-heading"><div><div className="section-index">04 / Explorations</div><h2>Selected <span>possibilities.</span></h2></div><p>A space for ideas and what comes next.</p></div><div className="project-grid">{concepts.map(project => <button key={project.number} className="project-card" onClick={() => setActiveProject(project)} aria-label={`View concept placeholder ${project.number}: ${project.title}`}><div className={`project-art ${project.style}`}><span>EXPLORATION {project.number}</span><span className="concept-symbol" aria-hidden="true">{project.style === 'orbit' ? '◉' : project.style === 'type' ? '↗' : '✳'}</span><span className="placeholder-label">CONCEPT / PLACEHOLDER</span></div><div className="project-info"><span>Concept / Placeholder</span><h3>{project.title}</h3><p>Explore the idea <ArrowUpRight size={15} /></p></div></button>)}</div></section>
      <section id="contact" className="contact-section section-wrap"><div className="contact-copy"><div className="section-index">05 / Say hello</div><h2>Good things start<br />with a <span>conversation.</span></h2><p>A question, an idea, or just a hello. There’s always room for a new connection.</p><a href={linkedin} className="linkedin-link" target="_blank" rel="noreferrer">Find me on LinkedIn <ArrowUpRight size={16} /></a></div><div className="contact-form-wrap"><form onSubmit={handleSubmit}><div className="form-row"><label>Your name<input name="name" autoComplete="name" placeholder="Your name" value={form.name} required minLength={2} maxLength={100} onChange={e => setForm({ ...form, name: e.target.value })} /></label><label>Email address<input name="email" type="email" autoComplete="email" placeholder="you@example.com" value={form.email} required maxLength={254} onChange={e => setForm({ ...form, email: e.target.value })} /></label></div><label>Message<textarea name="message" placeholder="Tell me a little about it…" rows={5} required minLength={10} maxLength={4000} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} /></label><div className="honeypot" aria-hidden="true"><label>Company<input name="company" tabIndex={-1} autoComplete="off" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} /></label></div><div className="form-footer"><span>Let’s see where it goes.</span><button className="button button-dark" type="submit" disabled={status.kind === 'sending'}>{status.kind === 'sending' ? 'Sending…' : 'Send a message'} <ArrowUpRight size={17} /></button></div><p className={`form-status ${status.kind}`} role="status" aria-live="polite">{status.message}</p></form></div></section>
    </main>
    <footer className="site-footer section-wrap"><span>© {new Date().getFullYear()} Varellio Louis Tinangon</span><a href={linkedin} target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={14} /></a><a href="#home">Back to top ↑</a></footer>
    <dialog data-lenis-prevent ref={dialogRef} onCancel={closeProject} onClick={e => { if (e.target === e.currentTarget) closeProject(); }} className="project-dialog" aria-labelledby="project-title">{activeProject && <><button className="dialog-close" onClick={closeProject} aria-label="Close project"><X /></button><div className="eyebrow">CONCEPT {activeProject.number} / PLACEHOLDER</div><h2 id="project-title">{activeProject.title}</h2><p>{activeProject.description}</p><p>This is sample portfolio content; no completed project, client relationship, or result is claimed.</p><button className="button button-dark" onClick={closeProject}>Back to exploring</button></>}</dialog>
  </>;
}

