import './styles.css';
import heroImage from './images/heritage-hero.jpg';
import communityImage from './images/heritage-community.jpg';
import familyImage from './images/heritage-family.jpg';
import portraitImage from './images/heritage-portrait.jpg';
import ritualImage from './images/heritage-ritual.jpg';

const BASE_PREFIX = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
const hasBasePrefix = (path) => BASE_PREFIX && BASE_PREFIX !== '/' && (path === BASE_PREFIX || path.startsWith(`${BASE_PREFIX}/`));
const routeHref = (path) => {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  const cleanPath = stripBase(normalized);
  return `${BASE_PREFIX}${cleanPath}`;
};
const stripBase = (path) => {
  let cleanPath = path;
  while (hasBasePrefix(cleanPath)) cleanPath = cleanPath.slice(BASE_PREFIX.length) || '/';
  return cleanPath;
};
const contentModules = import.meta.glob('./content/pages/**/*.json', { eager: true, query: '?json', import: 'default' });
const contentPages = Object.values(contentModules);
const main = document.querySelector('#main-content');
const homeMarkup = main?.innerHTML || '';
const modal = document.querySelector('#service-modal');
const modalContent = document.querySelector('[data-modal-content]');
const modalClose = document.querySelector('[data-modal-close]');
const announcer = document.querySelector('.route-announcer');
const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('#primary-navigation');
const themeToggle = document.querySelector('.theme-toggle');
let modalTrigger = null;

const assets = {
  dreams: ritualImage,
  love: portraitImage,
  protection: familyImage,
  prosperity: communityImage,
  ancestors: heroImage
};

const services = {
  dreams: {
    eyebrow: 'DREAM INTERPRETATION',
    title: 'Understand what your dreams are asking you to notice.',
    short: 'A reflective reading for symbols, recurring dreams, and the feelings that stay after waking.',
    image: assets.dreams,
    duration: '45–60 minutes',
    details: ['Bring one dream, a recurring pattern, or a question about a person or place that keeps appearing.', 'We explore the emotional and symbolic layers together, then identify a practical reflection you can carry forward.', 'You leave with notes and prompts—not a fixed prediction or a promise of a specific outcome.']
  },
  love: {
    eyebrow: 'LOVE & RELATIONSHIPS',
    title: 'Find a calmer, clearer way to meet what is happening in love.',
    short: 'Support for relationship uncertainty, communication patterns, lost connection, and choosing your next honest step.',
    image: assets.love,
    duration: '45–60 minutes',
    details: ['Use this space for a current relationship, a difficult ending, family tension, or the hope of finding new love.', 'The conversation is centered on clarity, boundaries, communication, and the choices within your control.', 'Guidance does not guarantee another person’s behavior. It helps you hear your own needs more clearly.']
  },
  protection: {
    eyebrow: 'PROTECTION & CLEARING',
    title: 'Create a steadier home, mind, and daily rhythm.',
    short: 'Grounded spiritual support for heavy feelings, unwanted energy, conflict at home, and the need to reset.',
    image: assets.protection,
    duration: '60 minutes',
    details: ['We begin with what feels heavy or disruptive, without fear-based language or pressure to purchase materials.', 'The session may include simple grounding, home-care, journaling, and reflective practices that fit your beliefs.', 'If you feel unsafe or unwell, professional medical, mental-health, or emergency support comes first.']
  },
  prosperity: {
    eyebrow: 'PROSPERITY & PURPOSE',
    title: 'Make room for practical momentum and a more focused path.',
    short: 'Support for business owners, career transitions, blocked plans, and the desire to welcome new opportunities.',
    image: assets.prosperity,
    duration: '45–60 minutes',
    details: ['Bring a business decision, a stalled project, or a question about where to place your energy next.', 'We combine reflective insight with practical next steps, so spiritual language stays connected to real life.', 'No outcome is guaranteed. Progress is built through informed decisions, consistent action, and support.']
  },
  ancestors: {
    eyebrow: 'ANCESTRAL CONNECTION',
    title: 'Listen for the wisdom behind you without losing your footing today.',
    short: 'A respectful conversation for family memory, lineage, grief, belonging, and the stories that shape your future.',
    image: assets.ancestors,
    duration: '60 minutes',
    details: ['Bring a family story, a question about your roots, or a feeling of being called back to a tradition.', 'We make room for memory and meaning while staying grounded in your present-day choices and relationships.', 'This is a reflective spiritual service, not a replacement for grief counseling or professional care.']
  }
};

const serviceCatalog = [
  { id: 'dreams', category: 'Reflection', icon: '◔', title: 'Dream interpretation', summary: 'Explore recurring images, feelings, symbols, and memories without a one-size-fits-all dictionary.' },
  { id: 'love-clarity', category: 'Relationships', icon: '♧', title: 'Love and relationship clarity', summary: 'Create space for honest communication, boundaries, healing, and your next grounded choice.' },
  { id: 'marriage-support', category: 'Relationships', icon: '∞', title: 'Marriage and partnership support', summary: 'Reflect on distance, conflict, trust, and the conversations that may help you reconnect.' },
  { id: 'family-peace', category: 'Relationships', icon: '⌂', title: 'Family and in-law peace', summary: 'Work through family tension with boundaries, perspective, and practical communication.' },
  { id: 'ancestral-connection', category: 'Ancestral work', icon: '✣', title: 'Ancestral connection', summary: 'Make room for lineage, memory, belonging, grief, and the wisdom you carry forward.' },
  { id: 'business-growth', category: 'Purpose', icon: '◫', title: 'Business and purpose', summary: 'Bring a stalled plan or decision and leave with clearer priorities and practical next steps.' },
  { id: 'protection-grounding', category: 'Grounding', icon: '⌁', title: 'Protection and grounding', summary: 'Build calmer daily and home practices without fear, dependency, or pressure to buy materials.' },
  { id: 'luck-opportunity', category: 'Purpose', icon: '✧', title: 'Opportunity and momentum', summary: 'Reflect on new doors, readiness, and the real actions that turn possibility into movement.' },
  { id: 'release-patterns', category: 'Grounding', icon: '↝', title: 'Release harmful patterns', summary: 'Name what keeps repeating and choose supportive boundaries, habits, and sources of care.' },
  { id: 'confidence', category: 'Reflection', icon: '◇', title: 'Spiritual confidence', summary: 'Reconnect with your values, intuition, and agency without fixed-fate predictions.' },
  { id: 'new-love', category: 'Relationships', icon: '♡', title: 'New love and readiness', summary: 'Clarify what you want, what you will not repeat, and how to approach connection with care.' },
  { id: 'home-peace', category: 'Grounding', icon: '⌂', title: 'Peace in the home', summary: 'Create a steadier atmosphere through simple rituals, communication, and practical care.' },
  { id: 'jealousy-conflict', category: 'Relationships', icon: '≋', title: 'Jealousy and conflict', summary: 'Understand the pattern, protect your boundaries, and prepare a calmer conversation.' },
  { id: 'future-direction', category: 'Purpose', icon: '→', title: 'Future direction', summary: 'Turn a broad question about your future into one honest, manageable next step.' }
];

const serviceCatalogCard = (service) => `<article class="catalog-card" data-catalog-card data-category="${service.category}"><div class="catalog-icon" aria-hidden="true">${service.icon}</div><div><p class="eyebrow">${service.category.toUpperCase()}</p><h3>${service.title}</h3><p>${service.summary}</p><a class="text-button" href="/contact?topic=${encodeURIComponent(service.title.toLowerCase())}">Explore this path <span aria-hidden="true">→</span></a></div></article>`;

const carePromises = [
  { title: 'Respect before interpretation', body: 'We listen to your language, family context, beliefs, and boundaries before offering reflection.' },
  { title: 'Your story remains yours', body: 'You choose what to share, what to keep private, and what action—if any—you take next.' },
  { title: 'Tradition with humility', body: 'Cultural and ancestral language is approached with care, not spectacle, shame, or invented authority.' },
  { title: 'No fear-based pressure', body: 'We will not tell you that you are doomed, demand urgent payment, or make you dependent on repeated sessions.' },
  { title: 'Honest limits', body: 'We do not promise to control another person, guarantee money or love, diagnose illness, or replace professional care.' },
  { title: 'A grounded close', body: 'Every conversation returns to a practical reflection, boundary, resource, or next step you can choose.' }
];
const carePromisesMarkup = () => `<section class="care-promises" aria-labelledby="care-promises-title"><div><p class="eyebrow">OUR REAL PROMISES</p><h2 id="care-promises-title">Culture held with care.<br /><em>Clarity held with you.</em></h2><p class="care-promises-intro">A traditional practice can be meaningful without making claims it cannot keep. These are the standards we can promise in every conversation.</p></div><div class="promise-grid">${carePromises.map((promise, index) => `<article class="promise-card"><span>0${index + 1}</span><h3>${promise.title}</h3><p>${promise.body}</p></article>`).join('')}</div></section>`;

const routeMeta = {
  '/': { title: 'Ancestral Path — Home', description: 'Reflective spiritual guidance, cultural learning, and practical care from Ancestral Path.' },
  '/guidance': { title: 'Ancestral Path — Guidance', description: 'Explore grounded, reflective guidance for dreams, relationships, protection, prosperity, and ancestral connection.' },
  '/dreams': { title: 'Ancestral Path — Dream Interpretation', description: 'Explore dreams through memory, emotion, symbols, and practical reflection.' },
  '/approach': { title: 'Ancestral Path — Our Approach', description: 'Learn how Ancestral Path keeps spiritual reflection respectful, grounded, and centered on your agency.' },
  '/contact': { title: 'Ancestral Path — Contact', description: 'Begin a private conversation with Ancestral Path and choose the contact path that works for you.' },
  '/services/dreams': { title: 'Ancestral Path — Dream Interpretation Service', description: 'A grounded dream interpretation conversation for recurring dreams, symbols, feelings, and reflection.' },
  '/services/love': { title: 'Ancestral Path — Love & Relationship Guidance', description: 'Reflective support for relationship uncertainty, communication, boundaries, and your next honest step.' },
  '/services/protection': { title: 'Ancestral Path — Protection & Clearing', description: 'Grounded spiritual support for heavy feelings, home-care, daily rhythm, and practical wellbeing.' },
  '/services/prosperity': { title: 'Ancestral Path — Prosperity & Purpose', description: 'Reflective support for business decisions, career transitions, purpose, and practical momentum.' },
  '/services/ancestors': { title: 'Ancestral Path — Ancestral Connection', description: 'A respectful conversation about family memory, lineage, belonging, grief, and present-day choices.' }
};
contentPages.forEach((page) => { routeMeta[page.path] = { title: `Ancestral Path — ${page.title}`, description: page.intro }; });

const serviceCard = (key, service) => `
  <article class="route-service-card">
    <div class="route-service-image" style="background-image:url('${service.image}')"></div>
    <div class="route-service-body"><p class="eyebrow">${service.eyebrow}</p><h3>${service.title}</h3><p>${service.short}</p><div class="service-actions"><a class="text-button" href="/services/${key}">Full service page <span aria-hidden="true">↗</span></a><button class="text-button" type="button" data-service-popout="${key}">Quick view <span aria-hidden="true">＋</span></button></div></div>
  </article>`;

const detailPage = (key) => {
  const service = services[key];
  return `<section class="route-page service-detail-page">
    <div class="detail-hero" style="background-image:linear-gradient(90deg, rgba(8,9,9,.95), rgba(8,9,9,.52) 55%, rgba(8,9,9,.1)), url('${service.image}')">
      <div class="detail-hero-copy"><a class="back-link" href="/guidance">← All guidance</a><p class="eyebrow">${service.eyebrow}</p><h1>${service.title}</h1><p>${service.short}</p><a class="gold-button inline-button" href="/contact?topic=${key}">Ask about this service <span>↗</span></a></div>
    </div>
    <div class="detail-layout"><div class="detail-main"><p class="eyebrow">WHAT TO EXPECT</p><h2>A considered conversation, shaped around your question.</h2><div class="detail-notes">${service.details.map((item, index) => `<div class="detail-note"><span>0${index + 1}</span><p>${item}</p></div>`).join('')}</div></div><aside class="detail-aside"><span class="aside-label">Typical session</span><strong>${service.duration}</strong><span class="aside-rule"></span><span class="aside-label">Held with care</span><p>Private, respectful, and grounded in your lived experience. You decide what you are ready to share.</p><a class="outline-button" href="/contact?topic=${key}">Start a conversation <span>→</span></a></aside></div>
  </section>`;
};

const guidancePage = () => `<section class="route-page services-hub"><div class="route-intro"><a class="back-link" href="/">← Home</a><p class="eyebrow">PRIVATE SPIRITUAL GUIDANCE</p><h1>Choose the question<br /><em>that is calling you.</em></h1><p>Browse the full catalogue and choose a conversation that keeps your cultural context and agency at the centre.</p></div><div class="services-hub-layout"><div class="catalog-panel"><p class="catalog-status">14 cultural service pathways · choose the one that speaks to your question</p><div class="catalog-grid">${serviceCatalog.map(serviceCatalogCard).join('')}</div></div><aside class="campaign-panel"><div class="campaign-visual" aria-hidden="true"><span>ANCESTRAL<br />PATH</span><b>✣</b><small>ROOTS · SPIRIT · FUTURE</small></div><div><p class="eyebrow">CAMPAIGN ARTWORK</p><h2>Start with the question you can say out loud.</h2><p>Bring only what feels comfortable. This is a reflective service, not a promise to control another person or guarantee an outcome.</p><a class="gold-button inline-button" href="/contact">Start a private conversation <span aria-hidden="true">↗</span></a></div></aside></div>${carePromisesMarkup()}<div class="route-callout"><p class="eyebrow">A NOTE ON CARE</p><h2>You stay in charge of your story.</h2><p>We will never tell you that you are doomed, demand urgent payment, or replace medical, legal, or mental-health care with spiritual language.</p><a class="outline-button" href="/contact">Ask a question <span>→</span></a></div></section>`;

const dreamsPage = () => `<section class="route-page editorial-route"><div class="route-intro"><a class="back-link" href="/">← Home</a><p class="eyebrow">THE LANGUAGE OF NIGHT</p><h1>Dreams leave clues<br /><em>in the morning.</em></h1><p>Start with the dream you remember most clearly. A dream reading gives you a grounded way to explore symbols, emotion, memory, and the choices waiting underneath.</p></div><div class="dream-feature" style="background-image:linear-gradient(90deg, rgba(8,9,9,.92), rgba(8,9,9,.3)), url('${assets.dreams}')"><div><p class="eyebrow">DREAM INTERPRETATION SESSION</p><h2>Bring the image<br />that stayed with you.</h2><a class="gold-button inline-button" href="/contact?topic=dreams">Book a dream conversation <span>↗</span></a></div></div><div class="three-column-notes"><div><span>01</span><h3>Remember</h3><p>Write down the scene, feeling, people, colors, and what happened immediately before waking.</p></div><div><span>02</span><h3>Explore</h3><p>We look for personal meaning rather than applying a one-size-fits-all dream dictionary.</p></div><div><span>03</span><h3>Carry forward</h3><p>Leave with a question or next step you can bring into your everyday life.</p></div></div></section>`;

const approachPage = () => `<section class="route-page editorial-route"><div class="route-intro"><a class="back-link" href="/">← Home</a><p class="eyebrow">OUR APPROACH</p><h1>Warm guidance.<br /><em>Clear boundaries.</em></h1><p>Spiritual work can be beautiful without being vague. Our approach is reflective, culturally respectful, and connected to practical life.</p></div><div class="principles-route"><div class="principle-route"><span>01</span><h2>Listen first.</h2><p>Your lived experience sets the direction. We ask questions before we offer interpretation.</p></div><div class="principle-route"><span>02</span><h2>Stay grounded.</h2><p>Insight should help you make a clearer decision, not make you more afraid or dependent.</p></div><div class="principle-route"><span>03</span><h2>Respect your agency.</h2><p>You can pause, question, or say no. No service is more important than your wellbeing.</p></div></div><div class="route-callout warm-callout"><p class="eyebrow">A SIMPLE PROMISE</p><h2>No fear. No fixed fate. No pressure.</h2><p>Just a private space to reflect on what you are carrying and choose what to do with it next.</p><a class="gold-button inline-button" href="/contact">Talk with us <span>↗</span></a></div></section>`;

const contactPage = () => `<section class="route-page contact-route"><div class="route-intro"><a class="back-link" href="/">← Home</a><p class="eyebrow">BEGIN YOUR CONVERSATION</p><h1>A simple hello<br /><em>is enough.</em></h1><p>Choose a topic, share only what feels comfortable, and prepare a private WhatsApp message in one step.</p></div><div class="contact-route-grid"><div class="contact-route-image" style="background-image:url('${assets.ancestors}')"></div><div class="contact-route-card"><form class="inquiry-form" data-inquiry-form><label for="topic">What would you like guidance on?</label><div class="select-wrap"><select id="topic" name="topic"><option value="dream interpretation">Dream interpretation</option><option value="love or relationships">Love or relationships</option><option value="protection and clearing">Protection and clearing</option><option value="prosperity and purpose">Prosperity and purpose</option><option value="ancestral connection">Ancestral connection</option></select><span>⌄</span></div><label for="message">A little about your question <small>(optional)</small></label><textarea id="message" name="message" rows="6" placeholder="Share only what feels comfortable..."></textarea><button class="gold-button" type="submit"><span data-submit-label>Prepare my WhatsApp message</span><span aria-hidden="true">↗</span></button><p class="form-notice">This opens WhatsApp in a new tab. Please do not send medical records, passwords, or information you would not want processed by Meta.</p><p class="form-status" data-form-status role="status" aria-live="polite"></p></form><div class="contact-route-number"><small>WhatsApp directly</small><a href="https://wa.me/27732552543" target="_blank" rel="noreferrer">+27 73 255 2543</a></div></div></div></section>`;

const imageForPage = (page) => assets[page.imageKey] || assets.ancestors;

const genericPage = (page) => {
  const sections = page.sections.map((section, index) => `<article class="content-section-card"><span>${String(index + 1).padStart(2, '0')}</span><div><h2>${section.heading}</h2><p>${section.body}</p></div></article>`).join('');
  const related = (page.links || []).map((link) => `<a class="outline-button" href="${link.path}">${link.label} <span>→</span></a>`).join('');
  const faq = page.kind === 'faq' ? `<div class="faq-list">${page.sections.map((section) => `<details><summary>${section.heading}<span>＋</span></summary><p>${section.body}</p></details>`).join('')}</div>` : '';
  const directory = page.kind === 'directory' ? `<div class="library-tools"><label for="library-search">Search the library</label><input id="library-search" data-library-search type="search" placeholder="Try dreams, home, relationships..." aria-describedby="library-results" /><p id="library-results" class="library-results" data-library-count role="status" aria-live="polite"></p></div><div class="library-empty" data-library-empty hidden>No pages match that search yet. Try a broader phrase.</div><div class="library-grid">${contentPages.filter((item) => item.path !== '/resources').map((item) => `<a class="library-card" data-library-card href="${item.path}"><span>${item.eyebrow}</span><strong>${item.title}</strong><small>${item.intro}</small></a>`).join('')}</div>` : '';
  return `<section class="route-page content-page"><div class="content-hero" style="background-image:linear-gradient(90deg, rgba(8,9,9,.96), rgba(8,9,9,.57) 58%, rgba(8,9,9,.12)), url('${imageForPage(page)}')"><div class="route-intro"><a class="back-link" href="/">← Home</a><p class="eyebrow">${page.eyebrow}</p><h1>${page.title}</h1><p>${page.intro}</p></div></div>${directory}${faq || `<div class="content-sections">${sections}</div>`}<div class="content-actions">${related}</div></section>`;
};

const routeContent = (path) => {
  if (path === '/guidance') return guidancePage();
  if (path === '/dreams') return dreamsPage();
  if (path === '/approach') return approachPage();
  if (path === '/contact') return contactPage();
  const serviceKey = Object.keys(services).find((key) => path === `/services/${key}`);
  if (serviceKey) return detailPage(serviceKey);
  const contentPage = contentPages.find((page) => page.path === path);
  if (contentPage) return genericPage(contentPage);
  return `<section class="route-page route-not-found"><p class="eyebrow">404 · PAGE NOT FOUND</p><h1>That path has<br /><em>gone quiet.</em></h1><p>Try returning to the home page or begin with guidance.</p><a class="gold-button inline-button" href="/">Return home <span aria-hidden="true">→</span></a></section>`;
};

const setActiveNav = (path) => {
  document.querySelectorAll('.site-nav a').forEach((link) => {
    const target = stripBase(new URL(link.href).pathname);
    const isGuidanceDetail = target === '/guidance' && path.startsWith('/services/');
    link.classList.toggle('is-active', target === path || isGuidanceDetail || (path === '/' && target === '/'));
  });
};

const normalizeInternalLinks = () => {
  document.querySelectorAll('a[href^="/"]').forEach((link) => {
    const raw = link.getAttribute('href');
    if (raw.startsWith('//') || raw.startsWith('/manus-storage')) return;
    link.setAttribute('href', routeHref(raw));
  });
};

const bindLibrarySearch = () => {
  const input = document.querySelector('[data-library-search]');
  if (!input) return;
  const cards = [...document.querySelectorAll('[data-library-card]')];
  const count = document.querySelector('[data-library-count]');
  const empty = document.querySelector('[data-library-empty]');
  const update = () => {
    const query = input.value.trim().toLowerCase();
    const visible = cards.filter((card) => {
      const matches = !query || card.textContent.toLowerCase().includes(query);
      card.hidden = !matches;
      return matches;
    });
    if (count) count.textContent = `${visible.length} ${visible.length === 1 ? 'resource' : 'resources'} shown`;
    if (empty) empty.hidden = visible.length !== 0;
  };
  input.addEventListener('input', update);
  update();
};

const prepareMotionTargets = () => {
  const targets = document.querySelectorAll('main > section, .feature-card, .story-panel, .topic-card, .content-section-card, .detail-note, .principle-route, .library-card');
  targets.forEach((target, index) => {
    target.classList.add('reveal-target');
    target.style.setProperty('--reveal-delay', `${Math.min(index % 6, 5) * 45}ms`);
  });
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
    targets.forEach((target) => target.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.filter((entry) => entry.isIntersecting).forEach((entry) => {
      entry.target.classList.add('is-visible');
      currentObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  targets.forEach((target) => observer.observe(target));
};

const applyTheme = (theme) => {
  document.documentElement.dataset.theme = theme;
  if (!themeToggle) return;
  const light = theme === 'light';
  themeToggle.setAttribute('aria-pressed', String(light));
  themeToggle.setAttribute('aria-label', light ? 'Switch to dark theme' : 'Switch to light theme');
};
const storedTheme = (() => { try { return localStorage.getItem('azan-theme'); } catch { return null; } })();
applyTheme(storedTheme || 'dark');
themeToggle?.addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
  applyTheme(next);
  try { localStorage.setItem('azan-theme', next); } catch {}
});

const bindInquiryForms = () => {
  document.querySelectorAll('[data-inquiry-form]').forEach((inquiryForm) => {
    const requestedTopic = new URLSearchParams(window.location.search).get('topic');
    const topicSelect = inquiryForm.querySelector('select[name="topic"]');
    if (requestedTopic && topicSelect && [...topicSelect.options].some((option) => option.value === requestedTopic)) topicSelect.value = requestedTopic;
    inquiryForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const data = new FormData(inquiryForm);
      const submitButton = inquiryForm.querySelector('button[type="submit"]');
      const status = inquiryForm.querySelector('[data-form-status]');
      const topic = data.get('topic');
      const message = String(data.get('message') || '').trim();
      const text = [`Hello Ancestral Path, I would like guidance on ${topic}.`, message ? `Here is a little about my question: ${message}` : '', 'Please let me know how to begin.'].filter(Boolean).join('\n\n');
      if (submitButton) { submitButton.disabled = true; submitButton.setAttribute('aria-busy', 'true'); const label = submitButton.querySelector('[data-submit-label]'); if (label) label.textContent = 'Opening WhatsApp…'; }
      const popup = window.open('https://wa.me/27732552543?text=' + encodeURIComponent(text), '_blank', 'noopener,noreferrer');
      if (status) status.textContent = popup ? 'Your message is ready in WhatsApp — we look forward to hearing from you.' : 'Your browser blocked the new tab. Use the WhatsApp link below to continue.';
      window.setTimeout(() => { if (submitButton) { submitButton.disabled = false; submitButton.removeAttribute('aria-busy'); const label = submitButton.querySelector('[data-submit-label]'); if (label) label.textContent = 'Prepare my WhatsApp message'; } }, 1400);
    });
  });
};

const openModal = (key) => {
  const service = services[key];
  if (!modal || !modalContent || !service) return;
  modalTrigger = document.activeElement;
  modalContent.innerHTML = `<div class="modal-image" style="background-image:url('${service.image}')"></div><div class="modal-copy"><p class="eyebrow">${service.eyebrow}</p><h2 id="service-modal-title">${service.title}</h2><p>${service.short}</p><a class="gold-button inline-button" href="/contact?topic=${key}">Ask about this service <span>↗</span></a></div>`;
  modal.showModal();
  window.requestAnimationFrame(() => modal.classList.add('is-entering'));
  modal.querySelector('.modal-close')?.focus();
};

const closeModal = () => {
  if (!modal) return;
  modal.classList.remove('is-entering');
  modal.close();
  modalTrigger?.focus?.();
  modalTrigger = null;
};

const renderRoute = (path, push = false) => {
  const cleanPath = path.split('?')[0].replace(/\/$/, '') || '/';
  if (push) window.history.pushState({}, '', routeHref(path));
  if (main) main.innerHTML = routeContent(cleanPath);
  const metadata = routeMeta[cleanPath] || { title: 'Ancestral Path — Page not found', description: 'The page you requested could not be found.' };
  document.title = metadata.title;
  document.querySelector('meta[name="description"]')?.setAttribute('content', metadata.description);
  document.querySelector('link[rel="canonical"]')?.setAttribute('href', window.location.href.split('?')[0]);
  normalizeInternalLinks();
  setActiveNav(cleanPath);
  bindInquiryForms();
  bindHeroForm();
  bindLibrarySearch();
  prepareMotionTargets();
  window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  const heading = main?.querySelector('h1');
  if (heading) { heading.setAttribute('tabindex', '-1'); heading.focus({ preventScroll: true }); }
  if (announcer) announcer.textContent = metadata.title;
  closeMenu();
};

document.addEventListener('click', (event) => {
  const serviceTrigger = event.target.closest('[data-service-popout]');
  if (serviceTrigger) { event.preventDefault(); openModal(serviceTrigger.dataset.servicePopout); return; }
  const link = event.target.closest('a');
  if (!link || link.target === '_blank' || link.origin !== window.location.origin) return;
  if (link.hash && stripBase(link.pathname) === stripBase(window.location.pathname)) return;
  const path = stripBase(link.pathname);
  if (!path.startsWith('/')) return;
  event.preventDefault(); renderRoute(path + link.search, true);
});

modalClose?.addEventListener('click', closeModal);
modal?.addEventListener('click', (event) => { if (event.target === modal) closeModal(); });
const canonicalizeBrowserPath = () => {
  const cleanPath = stripBase(window.location.pathname);
  const canonicalPath = routeHref(cleanPath);
  if (window.location.pathname !== canonicalPath) window.history.replaceState({}, '', `${canonicalPath}${window.location.search}${window.location.hash}`);
  return cleanPath;
};
window.addEventListener('popstate', () => renderRoute(canonicalizeBrowserPath()));

const bindHeroForm = () => document.querySelector('[data-hero-form]')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const heroForm = event.currentTarget;
  const question = String(new FormData(heroForm).get('question') || '').trim();
  const text = question ? `Hello Ancestral Path, I have a question about ${question}. Please let me know how to begin.` : 'Hello Ancestral Path, I would like to begin a guidance conversation.';
  window.open('https://wa.me/27732552543?text=' + encodeURIComponent(text), '_blank', 'noopener,noreferrer');
});

const closeMenu = () => {
  if (!menuToggle || !siteNav) return;
  menuToggle.setAttribute('aria-expanded', 'false');
  siteNav.classList.remove('is-open');
  menuToggle.querySelector('.menu-toggle-label').textContent = 'Menu';
};
menuToggle?.addEventListener('click', () => {
  const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!expanded));
  siteNav?.classList.toggle('is-open', !expanded);
  if (!expanded) siteNav?.querySelector('a')?.focus();
  menuToggle.querySelector('.menu-toggle-label').textContent = expanded ? 'Menu' : 'Close';
});
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeMenu(); });

bindInquiryForms();
bindHeroForm();
normalizeInternalLinks();
bindLibrarySearch();
prepareMotionTargets();
const initialPath = canonicalizeBrowserPath();
if (initialPath !== '/') renderRoute(initialPath);
