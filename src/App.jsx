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
const socials = [
  { name: 'Instagram', handle: '@varellio671', href: 'https://www.instagram.com/varellio671/', icon: 'instagram' },
  { name: 'TikTok', handle: '@varellio671', href: 'https://www.tiktok.com/@varellio671', icon: 'tiktok' },
  { name: 'GitHub', handle: '@Reliaaaa', href: 'https://github.com/Reliaaaa', icon: 'github' },
  { name: 'LinkedIn', handle: 'Varellio Louis Tinangon', href: linkedin, icon: 'linkedin' },
];
const concepts = [
  { number: '01', title: 'A space for what’s next.', description: 'A future home for a project overview, your role, and what you learned.', style: 'orbit' },
  { number: '02', title: 'Ideas, made tangible.', description: 'A place for a real project, its process, and an honest account of the outcome.', style: 'type' },
  { number: '03', title: 'Always in progress.', description: 'A space for an experiment or a personal exploration.', style: 'grid' },
];

const marqueeWords = ['Technology', 'Creative Media', 'Digital Transformation', 'Entrepreneurship'];
const momentPhotos = [
  { src: '/moments/moment-01.jpg', ratio: 4 / 3, alt: 'A group posing together in a school courtyard' },
  { src: '/moments/moment-02.jpg', ratio: 4 / 3, alt: 'A group of students posing on a school basketball court' },
  { src: '/moments/moment-03.jpg', ratio: 1170 / 662, alt: 'A large group gathering in a school hall' },
  { src: '/moments/moment-04.jpg', ratio: 3 / 4, alt: 'Event production laptops at Frateran Cup' },
  { src: '/moments/moment-05.jpg', ratio: 3 / 4, alt: 'A group posing in a school courtyard' },
  { src: '/moments/moment-06.jpg', ratio: 3 / 4, alt: 'Four people posing in a classroom' },
  { src: '/moments/moment-07.jpg', ratio: 922 / 1540, alt: 'Students presenting on a stage' },
  { src: '/moments/moment-08.jpg', ratio: 1, alt: 'A group at the Frateran Cup stage' },
  { src: '/moments/moment-09.jpg', ratio: 1013 / 1351, alt: 'A film editing workstation' },
  { src: '/moments/moment-10.jpg', ratio: 4 / 3, alt: 'A group gathered inside a church' },
  { src: '/moments/moment-11.jpg', ratio: 610 / 1356, alt: 'A Suara Fratorian podcast story' },
];
const momentColumns = [
  { photos: [0, 1], width: 40, offset: 0 },
  { photos: [6], width: 34, offset: 2 },
  { photos: [2, 9], width: 40, offset: 1 },
  { photos: [4], width: 44, offset: 0 },
  { photos: [7, null], width: 29, offset: 3 },
  { photos: [5], width: 42, offset: 1 },
  { photos: [3], width: 43, offset: 2 },
  { photos: [8], width: 42, offset: 0 },
  { photos: [10], width: 26, offset: 2 },
  { photos: [null, null], width: 30, offset: 1 },
  { photos: [null, null], width: 30, offset: 3 },
];
function Marquee() {
  return <div className="hero-marquee" aria-hidden="true">{marqueeWords.map((word, i) => <div className={`marquee-row marquee-row-${i + 1}`} key={word}><div className="marquee-track"><span>{word} · {word} · </span><span>{word} · {word} · </span></div></div>)}</div>;
}

export default function App() {
  const reducedMotion = useReducedMotion();
  const [intro, setIntro] = useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeProject, setActiveProject] = useState(null);
  const menuRef = useRef(null);
  const dialogRef = useRef(null);
  const photoSectionRef = useRef(null);
  const photoRailRef = useRef(null);
  const lenisRef = useRef(null);

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
    if (reducedMotion || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const lenis = new Lenis({ anchors: { offset: -95 }, syncTouch: false });
    lenis.stop();
    lenisRef.current = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    const tick = time => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    return () => { gsap.ticker.remove(tick); lenis.destroy(); lenisRef.current = null; };
  }, [reducedMotion]);
  useEffect(() => {
    if (intro) lenisRef.current?.stop();
    else lenisRef.current?.start();
  }, [intro, reducedMotion]);
  useLayoutEffect(() => {
    document.documentElement.classList.toggle('intro-lock', intro);
    document.documentElement.classList.toggle('scroll-ready', !intro);
    return () => { document.documentElement.classList.remove('intro-lock', 'scroll-ready'); };
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
  useLayoutEffect(() => {
    if (reducedMotion || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const media = gsap.matchMedia();
    media.add('(min-height: 600px)', () => {
      const overlap = ScrollTrigger.create({ trigger: '#home', start: 'bottom bottom', endTrigger: '#about', end: 'top top', pin: true, pinSpacing: false, invalidateOnRefresh: true });
      return () => overlap.kill();
    });
    return () => media.revert();
  }, [reducedMotion]);
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
    const experience = document.getElementById('experience');
    experience?.classList.add('experience-motion');
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        if (entry.target.classList.contains('timeline-row')) entry.target.classList.add('is-revealed');
        animations.push(entry.target.animate(
          [{ opacity: 0.45, transform: 'translateY(24px)' }, { opacity: 1, transform: 'translateY(0)' }],
          { duration: 850, easing: 'cubic-bezier(.22,1,.36,1)' },
        ));
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.12 });
    document.querySelectorAll('.about-content, .timeline-row, .section-heading, .photo-rail, .project-card, .contact-copy, .contact-socials').forEach(element => observer.observe(element));
    return () => { observer.disconnect(); animations.forEach(animation => animation.cancel()); experience?.classList.remove('experience-motion'); experience?.querySelectorAll('.timeline-row.is-revealed').forEach(row => row.classList.remove('is-revealed')); };
  }, [reducedMotion]);


  useEffect(() => {
    const rail = photoRailRef.current;
    const section = photoSectionRef.current;
    if (!rail || !section || reducedMotion || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const media = gsap.matchMedia();
    media.add('(min-height: 600px)', () => {
      const previous = section.previousElementSibling;
      const previousLayer = previous
        ? ScrollTrigger.create({ trigger: previous, start: 'bottom bottom', endTrigger: section, end: 'top top', pin: true, pinSpacing: false, invalidateOnRefresh: true })
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
        onUpdate: self => { rail.scrollLeft = leadDistance() + self.progress * (distance() - leadDistance()); setCut(Math.max(0, (self.progress - 0.75) / 0.25) * 20); },
      });
      return () => { pinned.kill(); approach.kill(); previousLayer?.kill(); section.style.removeProperty('clip-path'); };
    });
    return () => media.revert();
  }, [reducedMotion]);

  const closeProject = () => { dialogRef.current?.close(); setActiveProject(null); };
  const closeMenuOnBlur = event => { if (!event.currentTarget.contains(event.relatedTarget)) setMenuOpen(false); };
  return <>
    <div className="ambient-bg" aria-hidden="true"><span /><span /><span /></div>
    <a href="#main" className="skip-link" onClick={() => { setIntro(false); document.getElementById('main')?.focus({ preventScroll: true }); }}>Skip to content</a>
    <header className={intro ? "site-header is-intro" : "site-header"} onMouseEnter={() => { if (window.matchMedia('(hover: hover)').matches) setMenuOpen(true); }} onMouseLeave={event => { if (!event.currentTarget.contains(document.activeElement)) setMenuOpen(false); }} onFocus={event => { if (!event.currentTarget.contains(event.relatedTarget) && event.target.matches(':focus-visible')) setMenuOpen(true); }} onBlur={closeMenuOnBlur}>
      <button ref={menuRef} className="notch-trigger" type="button" aria-label="Navigation menu" aria-expanded={menuOpen} aria-controls="main-nav" onClick={() => setMenuOpen(open => !open)}><Menu size={17} /><span>Menu</span><ChevronDown size={16} /></button>
      <nav id="main-nav" className={menuOpen ? 'nav-links is-open' : 'nav-links'} aria-label="Main navigation" aria-hidden={!menuOpen} inert={!menuOpen}>
        <a href="#about" onClick={() => setMenuOpen(false)}>About</a><a href="#experience" onClick={() => setMenuOpen(false)}>Experience</a><a href="#work" onClick={() => setMenuOpen(false)}>Explorations</a><a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
      </nav>
    </header>
    <main id="main" tabIndex={-1}>
      <section id="home" className={intro ? "hero section-wrap is-intro" : "hero section-wrap"}>
        <Marquee />
        <div className="hero-copy"><h1 aria-label="Varellio Louis Tinangon"><span className="hero-name-first" aria-hidden="true">{Array.from('VΛRELLIO LOUIS', (letter, index) => <span className="hero-name-letter" style={{ '--letter-index': index }} key={index}>{letter}</span>)}</span><span className="hero-name-last" aria-hidden="true">{Array.from('TINANGON', (letter, index) => <span className="hero-name-letter" style={{ '--letter-index': index + 14 }} key={index}>{letter}</span>)}</span></h1></div>
        <div className="portrait-stage"><div className="portrait-halo" aria-hidden="true" /><img className="portrait-photo" src="/varellio-portrait.png" alt="Varellio Louis Tinangon" width="1024" height="1536" fetchPriority="high" /></div>
        <div className="hero-ground"><div className="hero-ground-text" aria-hidden="true">Technology · Creativity · Entrepreneur</div><div className="hero-buttons"><a href="#about" className="button button-dark">Explore my interests <ArrowDown size={17} /></a><a className="text-link" href={linkedin} target="_blank" rel="noreferrer">Connect on LinkedIn <ArrowUpRight size={17} /></a></div>
        <div className="hero-bottom"><a href="#about">Scroll to discover <ArrowDown size={16} /></a></div></div>
      </section>
      <section id="about" className="about-section section-wrap">
        <div className="about-visual"><div className="section-index">01 / About</div><div className="about-photo-placeholder"><img className="about-photo" src="/about-portrait.png" alt="Varellio Louis Tinangon in formal attire" width="1080" height="1080" fetchPriority="low" /><span className="about-photo-orbit" aria-hidden="true" /><img className="about-photo about-photo-cutout" src="/about-portrait-cutout.png" alt="" aria-hidden="true" width="1080" height="1080" fetchPriority="low" /></div></div>
        <div className="about-content"><h2>The only way<br />to do great is to<br /><span>love what you do</span></h2><p className="about-quote-credit">— Steve Jobs.</p><div className="about-columns"><p>I’m Varellio, an Informatics student at Petra Christian University, exploring network and cyber security and digital transformation.</p><p>I enjoy discovering how technology, creative media, and entrepreneurship can come together to create meaningful ideas.</p></div><InterestOverlap /></div>
      </section>
      <section id="experience" className="experience-section section-wrap"><div className="experience-inner"><div className="section-index">02 / Experience</div><div><h2>A journey <span>in the making.</span></h2><div className="timeline">
        <article className="timeline-row"><p>Class of 2026</p><div><h3>Graduation Film Production Team</h3><p>Film Editor</p><p>Responsible for editing the graduation film.</p></div></article>
        <article className="timeline-row"><p>2025 – 2026</p><div><h3>Student Council Treasurer</h3><p>Frateran Catholic Senior High School, Surabaya</p><p>Managed event budgets, prepared financial reports, and supported the council’s financial planning.</p></div></article>
        <article className="timeline-row"><p>2025</p><div><h3>Frateran Cup Committee</h3><p>Fundraiser, Event Operator &amp; Treasurer</p><p>Contributed to fundraising, event operations, and financial management.</p></div></article>
        <article className="timeline-row"><div><h3>Frateran Solve the Case (FSC) Committee</h3><p>Event Operator, Question Writer &amp; Supervisor</p><p>Supported event operations and contributed to preparing questions and supervising participants.</p></div></article>
        <article className="timeline-row"><p>2024 – 2025</p><div><h3>Student Council Social &amp; Community Relations Member</h3><p>Frateran Catholic Senior High School, Surabaya</p><p>Participated in community initiatives, fundraising, and production of the Suara Fratorian podcast.</p></div></article>
        <article className="timeline-row"><p>2024</p><div><h3>Suara Fratorian Podcast Production Committee</h3><p>Contributed to the production of the Suara Fratorian podcast.</p></div></article>
        <article className="timeline-row"><div><h3>Berbagi Takjil Ramadan Event</h3><p>Fundraiser</p><p>Contributed to fundraising for the Ramadan event.</p></div></article>
      </div><a className="underlined-link" href={linkedin} target="_blank" rel="noreferrer">View experience on LinkedIn <ArrowUpRight size={16} /></a></div></div></section>
      <section id="moments" ref={photoSectionRef} className="photo-section section-wrap"><div className="section-heading"><div><div className="section-index">03 / Moments</div><h2>Moments <span>in motion.</span></h2></div><p>Snapshots of moments shared along the way.</p></div><div className="photo-toolbar"><p>Scroll down to explore the gallery, or swipe through it. More photographs are coming soon.</p></div><div ref={photoRailRef} className="photo-rail" role="region" aria-label="Photo gallery; scroll horizontally" tabIndex={0}><div className="photo-track">{momentColumns.map((column, columnIndex) => <div className="photo-column" key={columnIndex} style={{ width: `clamp(140px, ${column.width}svh, 600px)`, '--photo-offset': `${column.offset}svh` }}>{column.photos.map((photoIndex, row) => { const photo = photoIndex === null ? null : momentPhotos[photoIndex]; return <div className={photo ? 'photo-placeholder photo-filled' : 'photo-placeholder'} key={row} style={photo ? { aspectRatio: photo.ratio } : { '--placeholder-height': `${row ? 27 : 20}svh` }}>{photo ? <img src={photo.src} alt={photo.alt} fetchPriority="low" /> : <><span>{String(columnIndex * 2 + row + 1).padStart(2, '0')}</span><p>PHOTO PLACEHOLDER</p><small>Coming soon</small></>}</div>; })}</div>)}</div></div></section>
      <section id="work" className="work-section section-wrap"><div className="section-heading"><div><div className="section-index">04 / Explorations</div><h2>Selected <span>possibilities.</span></h2></div><p>A space for ideas and what comes next.</p></div><div className="project-grid">{concepts.map(project => <button key={project.number} className="project-card" onClick={() => setActiveProject(project)} aria-label={`View concept placeholder ${project.number}: ${project.title}`}><div className={`project-art ${project.style}`}><span>EXPLORATION {project.number}</span><span className="concept-symbol" aria-hidden="true">{project.style === 'orbit' ? '◉' : project.style === 'type' ? '↗' : '✳'}</span><span className="placeholder-label">CONCEPT / PLACEHOLDER</span></div><div className="project-info"><span>Concept / Placeholder</span><h3>{project.title}</h3><p>Explore the idea <ArrowUpRight size={15} /></p></div></button>)}</div></section>
      <section id="contact" className="contact-section section-wrap"><div className="contact-copy"><div className="section-index">05 / Contact</div><h2>Let’s stay<br /><span>connected.</span></h2><p>Find me online and let’s start a conversation.</p></div><div className="contact-socials" role="group" aria-label="Social media profiles">{socials.map(social => <a className="contact-social" key={social.name} href={social.href} target="_blank" rel="noreferrer"><span className="contact-social-icon"><img src={`/social/${social.icon}.svg`} alt="" width="24" height="24" /></span><span className="contact-social-label"><strong>{social.name}</strong><small>{social.handle}</small></span><ArrowUpRight className="contact-social-arrow" size={20} aria-hidden="true" /></a>)}</div></section>
    </main>
    <footer className="site-footer section-wrap"><span>© {new Date().getFullYear()} Varellio Louis Tinangon</span><a href={linkedin} target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={14} /></a><a href="#home">Back to top ↑</a></footer>
    <dialog data-lenis-prevent ref={dialogRef} onCancel={closeProject} onClick={e => { if (e.target === e.currentTarget) closeProject(); }} className="project-dialog" aria-labelledby="project-title">{activeProject && <><button className="dialog-close" onClick={closeProject} aria-label="Close project"><X /></button><div className="eyebrow">CONCEPT {activeProject.number} / PLACEHOLDER</div><h2 id="project-title">{activeProject.title}</h2><p>{activeProject.description}</p><p>This is sample portfolio content; no completed project, client relationship, or result is claimed.</p><button className="button button-dark" onClick={closeProject}>Back to exploring</button></>}</dialog>
  </>;
}

