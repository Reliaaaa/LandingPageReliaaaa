import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
import { ArrowUpRight, ArrowDown, ArrowRight, Sun, Moon, Menu, X, Link, CheckCircle2, Plus } from 'lucide-react';

const linkedin = 'https://www.linkedin.com/in/varellio-louis-tinangon-4172702a0/';
const projects = [
  { number: '01', title: 'A space for what’s next.', category: 'PROJECT PLACEHOLDER', type: 'Your first featured project', style: 'orbit', description: 'A future home for a project overview, your role, the process, and what you learned.' },
  { number: '02', title: 'Ideas, made tangible.', category: 'PROJECT PLACEHOLDER', type: 'Your second featured project', style: 'type', description: 'Add a real project here with images, the problem you explored, and an honest account of the outcome.' },
  { number: '03', title: 'Always in progress.', category: 'PROJECT PLACEHOLDER', type: 'Your third featured project', style: 'grid', description: 'A place for an experiment, a personal exploration, or something you are still building.' },
];

function Reveal({ children, className = '', delay = 0 }) {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial={reduced ? false : { opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>;
}

export default function App() {
  const [dark, setDark] = useState(() => { try { return localStorage.getItem('portfolio-theme') === 'dark'; } catch { return false; } });
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeProject, setActiveProject] = useState(null);
  const [status, setStatus] = useState({ kind: 'idle', message: '' });
  const [form, setForm] = useState({ name: '', email: '', message: '', company: '' });
  const artRef = useRef(null);
  const menuRef = useRef(null);
  const dialogRef = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => { fetch('/api/analytics', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ event: 'page_view', path: window.location.pathname }) }).catch(() => {}); }, []);
  useEffect(() => { document.documentElement.dataset.theme = dark ? 'dark' : 'light'; try { localStorage.setItem('portfolio-theme', dark ? 'dark' : 'light'); } catch { /* Theme persistence is optional when storage is unavailable. */ } }, [dark]);
  useEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('.art-orbit', { rotate: -18, scale: 0.92 }, { rotate: 0, scale: 1, duration: 1.8, ease: 'power3.out' });
      gsap.to('.art-orbit', { y: 35, ease: 'none', scrollTrigger: { trigger: artRef.current, start: 'top top', end: 'bottom top', scrub: 1 } });
      gsap.to('.art-spark', { rotate: 180, duration: 28, ease: 'none', repeat: -1 });
    }, artRef);
    return () => ctx.revert();
  }, [reduced]);
  useEffect(() => { if (!menuOpen) return; const onKey = e => { if (e.key === 'Escape') { setMenuOpen(false); menuRef.current?.focus(); } }; window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey); }, [menuOpen]);
  useEffect(() => { if (activeProject) dialogRef.current?.showModal(); }, [activeProject]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (status.kind === 'sending') return;
    setStatus({ kind: 'sending', message: 'Sending your message…' });
    try {
      const response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Your message couldn’t be sent. Please try again or connect on LinkedIn.');
      fetch('/api/analytics', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ event: 'contact_submit', path: window.location.pathname }) }).catch(() => {});
      setStatus({ kind: 'success', message: 'Message sent. Thank you for getting in touch!' });
      setForm({ name: '', email: '', message: '', company: '' });
    } catch (error) { setStatus({ kind: 'error', message: error.message || 'Something went wrong. Please try again.' }); }
  }

  const closeProject = () => { dialogRef.current?.close(); setActiveProject(null); };
  return <>
    <a href="#main" className="skip-link">Skip to content</a>
    <header className="site-header">
      <a href="#home" className="brand" aria-label="Varellio home">vlt</a>
      <nav id="main-nav" className={menuOpen ? 'nav-links is-open' : 'nav-links'} aria-label="Main navigation">
        <a href="#about" onClick={() => setMenuOpen(false)}>About</a><a href="#experience" onClick={() => setMenuOpen(false)}>Experience</a><a href="#work" onClick={() => setMenuOpen(false)}>Explorations</a><a href="#contact" onClick={() => setMenuOpen(false)}>Contact <ArrowUpRight size={14} /></a>
      </nav>
      <div className="header-actions"><button className="theme-button" onClick={() => setDark(!dark)} aria-label={`Switch to ${dark ? 'light' : 'dark'} mode`}>{dark ? <Sun size={18} /> : <Moon size={18} />}</button><button ref={menuRef} className="menu-button" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} aria-controls="main-nav" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button></div>
    </header>

    <main id="main">
      <section id="home" className="hero section-wrap">
        <div className="hero-copy"><Reveal><div className="eyebrow"><span className="status-dot" /> INFORMATICS STUDENT · SURABAYA</div></Reveal>
          <Reveal delay={0.07}><h1>Varellio Louis<br /><span>Tinangon.</span></h1></Reveal>
          <Reveal delay={0.13}><p className="hero-intro">Exploring technology, creative media, and community.<br />Informatics student at Petra Christian University.</p></Reveal>
          <Reveal delay={0.2}><div className="hero-buttons"><a href="#work" className="button button-dark">Explore my interests <ArrowUpRight size={18} /></a><a href={linkedin} target="_blank" rel="noreferrer" className="text-link">Let’s connect <ArrowUpRight size={16} /></a></div></Reveal>
        </div>
        <Reveal className="hero-visual" delay={0.15}><div className="art-card" ref={artRef} aria-label="Abstract artwork: a vibrant orange orbital sculpture"><div className="art-top"><span>THE ART OF BECOMING</span><span>VOL. 01 — 2026</span></div><div className="art-orbit"><div className="orbit-ring ring-one" /><div className="orbit-ring ring-two" /><div className="orbit-ring ring-three" /><div className="orbit-ring ring-four" /></div><span className="art-spark">✳</span><div className="art-bottom"><span>A WORK IN<br /><b>PROGRESS.</b></span><span className="art-coordinate">∞ POSSIBILITIES<br />ONE PERSPECTIVE</span></div></div><div className="art-caption"><span>01 / AN OPEN-ENDED EXPLORATION</span><span>SCROLL TO DISCOVER <ArrowDown size={12} /></span></div></Reveal>
        <div className="hero-bottom"><span>VARELLIO LOUIS TINANGON</span><span>STAY CURIOUS. KEEP GOING.</span><a href="#about" aria-label="Scroll to about"><ArrowDown size={17} /></a></div>
      </section>

      <section id="about" className="about-section section-wrap">
        <Reveal className="section-index"><span className="tiny-square" /> 01 / THE PERSON</Reveal>
        <div className="about-content"><Reveal><h2>More than a name.<br /><span>A story taking shape.</span></h2></Reveal><Reveal><div className="about-columns"><p>I am an Informatics student at Petra Christian University, interested in network and cyber security, digital transformation, entrepreneurship, and creative media.</p><div><p>For the latest on my background, interests, and experience, find me on LinkedIn. I’d love to make a new connection.</p><a className="underlined-link" href={linkedin} target="_blank" rel="noreferrer">Get to know me <ArrowUpRight size={17} /></a></div></div></Reveal><Reveal><div className="about-note"><span>✳</span><p><b>A note on this space</b><br />The project cards below are placeholders, ready to become real stories.</p></div></Reveal></div>
      </section>

      <section id="experience" className="experience-section section-wrap"><Reveal><div className="experience-inner"><div className="section-index"><span className="tiny-square" /> EXPERIENCE</div><div><h2>A journey <span>in the making.</span></h2><p><strong>Mar 2025 – Feb 2026 · Student Council Treasurer</strong><br />Frateran Catholic Senior High School — budgets and financial reports.<br /><br /><strong>Feb 2024 – Feb 2025 · Social & Community Relations</strong><br />Supported community events and the Suara Fratorian podcast.</p><a className="underlined-link" href={linkedin} target="_blank" rel="noreferrer">View experience on LinkedIn <ArrowUpRight size={17} /></a></div><span className="experience-label">LEADERSHIP<br />& COMMUNITY</span></div></Reveal></section>

      <section id="work" className="work-section section-wrap">
        <Reveal><div className="section-heading"><div><div className="section-index"><span className="tiny-square" /> 02 / ROOM FOR IDEAS</div><h2>Selected <span>possibilities.</span></h2></div><p>Every good thing starts somewhere.<br />Here’s space for what’s coming next.</p></div></Reveal>
        <div className="project-grid">{projects.map((project, i) => <Reveal key={project.number} delay={i * 0.07}><button className="project-card" onClick={() => setActiveProject(project)} aria-label={`View ${project.type} placeholder`}><div className={`project-art ${project.style}`}><div className="project-art-top"><span>EXPLORATION {project.number}</span><ArrowUpRight size={19} /></div>{project.style === 'orbit' ? <div className="mini-orbits"><i /><i /><i /></div> : project.style === 'type' ? <div className="idea-type">a new<br /><em>angle.</em><span>↗</span></div> : <div className="grid-shape"><i /><i /><i /><i /></div>}<span className="placeholder-label">CONCEPT VISUAL / PLACEHOLDER</span></div><div className="project-info"><div><span className="project-category">{project.category}</span><h3>{project.title}</h3><p>{project.type}</p></div><span className="project-plus"><Plus size={18} /></span></div></button></Reveal>)}</div>
      </section>

      <section id="contact" className="contact-section section-wrap"><div className="contact-copy"><Reveal><div className="section-index"><span className="tiny-square" /> 03 / SAY HELLO</div><h2>Good things start<br />with a <span>conversation.</span></h2><p>A question, an idea, or just a hello.<br />There’s always room for a new connection.</p><a href={linkedin} className="linkedin-link" target="_blank" rel="noreferrer"><Link size={18} /> Find me on LinkedIn <ArrowUpRight size={16} /></a></Reveal></div><Reveal className="contact-form-wrap"><form onSubmit={handleSubmit}><div className="form-row"><label>Your name<input name="name" autoComplete="name" placeholder="How should I call you?" value={form.name} required minLength={2} maxLength={100} onChange={e => setForm({ ...form, name: e.target.value })} /></label><label>Email address<input name="email" type="email" autoComplete="email" placeholder="you@example.com" value={form.email} required maxLength={254} onChange={e => setForm({ ...form, email: e.target.value })} /></label></div><label>What’s on your mind?<textarea name="message" placeholder="Tell me a little about it…" rows={4} required minLength={10} maxLength={4000} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} /></label><div className="honeypot" aria-hidden="true"><label>Company<input name="company" tabIndex={-1} autoComplete="off" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} /></label></div><div className="form-footer"><span>Let’s see where it goes.</span><button className="button button-dark" type="submit" disabled={status.kind === 'sending'}>{status.kind === 'sending' ? 'Sending…' : 'Send a message'}{status.kind === 'success' ? <CheckCircle2 size={16} /> : <ArrowUpRight size={17} />}</button></div><p className={`form-status ${status.kind}`} role="status" aria-live="polite">{status.message}</p></form></Reveal></section>
    </main>
    <footer className="site-footer section-wrap"><div className="footer-top"><a href="#home" className="brand">vlt</a><p>A little curiosity goes a long way.</p><a href="#home" className="back-top">BACK TO TOP <ArrowUpRight size={15} /></a></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Varellio Louis Tinangon</span><span>MADE WITH INTENTION. ALWAYS EVOLVING.</span><a href={linkedin} target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={12} /></a></div></footer>
    <dialog ref={dialogRef} onCancel={closeProject} onClick={e => { if (e.target === e.currentTarget) closeProject(); }} className="project-dialog" aria-labelledby="project-title">{activeProject && <><button className="dialog-close" onClick={closeProject} aria-label="Close project"><X /></button><div className="eyebrow">PROJECT {activeProject.number} / PLACEHOLDER</div><h2 id="project-title">{activeProject.title}</h2><p>{activeProject.description}</p><div className="dialog-note">This is sample portfolio content. No completed project, client relationship, or professional result is claimed.</div><button className="button button-dark" onClick={closeProject}>Back to exploring <ArrowRight size={17} /></button></>}</dialog>
  </>;
}

