import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { ArrowDown, ArrowUpRight, ChevronDown, Menu, Moon, Sun, X } from 'lucide-react';

const linkedin = 'https://www.linkedin.com/in/varellio-louis-tinangon-4172702a0/';
const concepts = [
  { number: '01', title: 'A space for what’s next.', description: 'A future home for a project overview, your role, and what you learned.', style: 'orbit' },
  { number: '02', title: 'Ideas, made tangible.', description: 'A place for a real project, its process, and an honest account of the outcome.', style: 'type' },
  { number: '03', title: 'Always in progress.', description: 'A space for an experiment or a personal exploration.', style: 'grid' },
];

export default function App() {
  const reducedMotion = useReducedMotion();
  const [intro, setIntro] = useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [dark, setDark] = useState(() => { try { return localStorage.getItem('portfolio-theme') !== 'light'; } catch { return true; } });
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeProject, setActiveProject] = useState(null);
  const [status, setStatus] = useState({ kind: 'idle', message: '' });
  const [form, setForm] = useState({ name: '', email: '', message: '', company: '' });
  const menuRef = useRef(null);
  const dialogRef = useRef(null);

  useEffect(() => {
    fetch('/api/analytics', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ event: 'page_view', path: window.location.pathname }) }).catch(() => {});
  }, []);
  useEffect(() => { document.documentElement.dataset.theme = dark ? 'dark' : 'light'; try { localStorage.setItem('portfolio-theme', dark ? 'dark' : 'light'); } catch { /* Theme storage is optional. */ } }, [dark]);
  useEffect(() => {
    if (!intro) return;
    const timer = window.setTimeout(() => setIntro(false), 1800);
    const skip = event => { if (event.key === 'Escape') setIntro(false); };
    window.addEventListener('keydown', skip);
    return () => { window.clearTimeout(timer); window.removeEventListener('keydown', skip); };
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
    if (intro || reducedMotion || window.matchMedia('(prefers-reduced-motion: reduce)').matches || !Element.prototype.animate) return;
    const targets = document.querySelectorAll('.hero-copy .eyebrow, .hero-copy h1, .portrait-stage, .hero-buttons, .hero-bottom');
    const animations = Array.from(targets, (element, index) => element.animate(
      [{ opacity: 0.15, transform: 'translateY(24px)' }, { opacity: 1, transform: 'translateY(0)' }],
      { duration: 620 + index * 100, easing: 'cubic-bezier(.22,1,.36,1)' },
    ));
    return () => animations.forEach(animation => animation.cancel());
  }, [intro, reducedMotion]);
  useEffect(() => {
    if (reducedMotion || window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window) || !Element.prototype.animate) return;
    const animations = [];
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        animations.push(entry.target.animate(
          [{ opacity: 0.65, transform: 'translateY(22px)' }, { opacity: 1, transform: 'translateY(0)' }],
          { duration: 720, easing: 'cubic-bezier(.22,1,.36,1)' },
        ));
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.12 });
    document.querySelectorAll('.about-content, .experience-inner > div:last-child, .section-heading, .project-card, .contact-copy, .contact-form-wrap').forEach(element => observer.observe(element));
    return () => { observer.disconnect(); animations.forEach(animation => animation.cancel()); };
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
    {intro && <div className="intro-screen" role="region" aria-label="Introduction"><div className="intro-card"><div className="intro-mark" aria-hidden="true">✳</div><p>Logo placeholder</p><span>Varellio Louis Tinangon</span><button className="intro-skip" onClick={() => setIntro(false)}>Skip intro <ArrowUpRight size={16} /></button></div></div>}
    <a href="#main" className="skip-link" onClick={() => setIntro(false)}>Skip to content</a>
    <header className="site-header" onMouseEnter={() => setMenuOpen(true)} onMouseLeave={event => { if (!event.currentTarget.contains(document.activeElement)) setMenuOpen(false); }} onFocus={event => { if (!event.currentTarget.contains(event.relatedTarget) && event.target.matches(':focus-visible')) setMenuOpen(true); }} onBlur={closeMenuOnBlur}>
      <button ref={menuRef} className="notch-trigger" type="button" aria-label="Navigation menu" aria-expanded={menuOpen} aria-controls="main-nav" onClick={() => setMenuOpen(open => !open)}><Menu size={17} /><span>Menu</span><ChevronDown size={16} /></button>
      <nav id="main-nav" className={menuOpen ? 'nav-links is-open' : 'nav-links'} aria-label="Main navigation" hidden={!menuOpen}>
        <a href="#about" onClick={() => setMenuOpen(false)}>About</a><a href="#experience" onClick={() => setMenuOpen(false)}>Experience</a><a href="#work" onClick={() => setMenuOpen(false)}>Explorations</a><a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
        <button className="theme-button" onClick={() => setDark(!dark)} aria-label={`Switch to ${dark ? 'light' : 'dark'} mode`}>{dark ? <Sun size={18} /> : <Moon size={18} />}</button>
      </nav>
    </header>
    <main id="main">
      <section id="home" className="hero section-wrap">
        <div className="hero-copy"><div className="eyebrow">Informatics student · Surabaya</div><h1>Varellio Louis<br /><span>Tinangon.</span></h1></div>
        <div className="portrait-stage"><div className="portrait-halo" aria-hidden="true" /><img className="portrait-photo" src="/varellio-portrait.png" alt="Varellio Louis Tinangon" width="1024" height="1536" fetchPriority="high" /></div>
        <div className="hero-ground"><div className="hero-ground-text" aria-hidden="true">Technology · Creativity · Community</div><div className="hero-buttons"><a href="#about" className="button button-dark">Explore my interests <ArrowDown size={17} /></a><a className="text-link" href={linkedin} target="_blank" rel="noreferrer">Connect on LinkedIn <ArrowUpRight size={17} /></a></div>
        <div className="hero-bottom"><a href="#about">Scroll to discover <ArrowDown size={16} /></a></div></div>
      </section>
      <section id="about" className="about-section section-wrap"><div className="section-index">01 / About</div><div className="about-content"><h2>More than a name.<br /><span>A story taking shape.</span></h2><div className="about-columns"><p>I am an Informatics student at Petra Christian University, interested in network and cyber security, digital transformation, entrepreneurship, and creative media.</p><div><p>I’m curious about the connections between technology, creativity, and community.</p><a className="underlined-link" href={linkedin} target="_blank" rel="noreferrer">Get to know me <ArrowUpRight size={16} /></a></div></div></div></section>
      <section id="experience" className="experience-section section-wrap"><div className="experience-inner"><div className="section-index">02 / Experience</div><div><h2>A journey <span>in the making.</span></h2><div className="timeline"><article className="timeline-row"><p>Mar 2025 – Feb 2026</p><div><h3>Student Council Treasurer</h3><p>Frateran Catholic Senior High School</p><p>Worked on budgets and financial reports.</p></div></article><article className="timeline-row"><p>Feb 2024 – Feb 2025</p><div><h3>Social &amp; Community Relations</h3><p>Frateran Catholic Senior High School</p><p>Supported community events and the Suara Fratorian podcast.</p></div></article></div><a className="underlined-link" href={linkedin} target="_blank" rel="noreferrer">View experience on LinkedIn <ArrowUpRight size={16} /></a></div></div></section>
      <section id="work" className="work-section section-wrap"><div className="section-heading"><div><div className="section-index">03 / Explorations</div><h2>Selected <span>possibilities.</span></h2></div><p>A space for ideas and what comes next.</p></div><div className="project-grid">{concepts.map(project => <button key={project.number} className="project-card" onClick={() => setActiveProject(project)} aria-label={`View concept placeholder ${project.number}: ${project.title}`}><div className={`project-art ${project.style}`}><span>EXPLORATION {project.number}</span><span className="concept-symbol" aria-hidden="true">{project.style === 'orbit' ? '◉' : project.style === 'type' ? '↗' : '✳'}</span><span className="placeholder-label">CONCEPT / PLACEHOLDER</span></div><div className="project-info"><span>Concept / Placeholder</span><h3>{project.title}</h3><p>Explore the idea <ArrowUpRight size={15} /></p></div></button>)}</div></section>
      <section id="contact" className="contact-section section-wrap"><div className="contact-copy"><div className="section-index">04 / Say hello</div><h2>Good things start<br />with a <span>conversation.</span></h2><p>A question, an idea, or just a hello. There’s always room for a new connection.</p><a href={linkedin} className="linkedin-link" target="_blank" rel="noreferrer">Find me on LinkedIn <ArrowUpRight size={16} /></a></div><div className="contact-form-wrap"><form onSubmit={handleSubmit}><div className="form-row"><label>Your name<input name="name" autoComplete="name" placeholder="Your name" value={form.name} required minLength={2} maxLength={100} onChange={e => setForm({ ...form, name: e.target.value })} /></label><label>Email address<input name="email" type="email" autoComplete="email" placeholder="you@example.com" value={form.email} required maxLength={254} onChange={e => setForm({ ...form, email: e.target.value })} /></label></div><label>Message<textarea name="message" placeholder="Tell me a little about it…" rows={5} required minLength={10} maxLength={4000} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} /></label><div className="honeypot" aria-hidden="true"><label>Company<input name="company" tabIndex={-1} autoComplete="off" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} /></label></div><div className="form-footer"><span>Let’s see where it goes.</span><button className="button button-dark" type="submit" disabled={status.kind === 'sending'}>{status.kind === 'sending' ? 'Sending…' : 'Send a message'} <ArrowUpRight size={17} /></button></div><p className={`form-status ${status.kind}`} role="status" aria-live="polite">{status.message}</p></form></div></section>
    </main>
    <footer className="site-footer section-wrap"><span>© {new Date().getFullYear()} Varellio Louis Tinangon</span><a href={linkedin} target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={14} /></a><a href="#home">Back to top ↑</a></footer>
    <dialog ref={dialogRef} onCancel={closeProject} onClick={e => { if (e.target === e.currentTarget) closeProject(); }} className="project-dialog" aria-labelledby="project-title">{activeProject && <><button className="dialog-close" onClick={closeProject} aria-label="Close project"><X /></button><div className="eyebrow">CONCEPT {activeProject.number} / PLACEHOLDER</div><h2 id="project-title">{activeProject.title}</h2><p>{activeProject.description}</p><p>This is sample portfolio content; no completed project, client relationship, or result is claimed.</p><button className="button button-dark" onClick={closeProject}>Back to exploring</button></>}</dialog>
  </>;
}

