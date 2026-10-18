import './styles.css';

const BASE_PREFIX = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
const routeHref = (path) => `${BASE_PREFIX}${path}`;
const stripBase = (path) => (BASE_PREFIX && path.startsWith(BASE_PREFIX) ? path.slice(BASE_PREFIX.length) || '/' : path);
const contentModules = import.meta.glob('./content/pages/**/*.json', { eager: true, query: '?json', import: 'default' });
const contentPages = Object.values(contentModules);
const main = document.querySelector('#main-content');
const homeMarkup = main?.innerHTML || '';
const modal = document.querySelector('#service-modal');
const modalContent = document.querySelector('[data-modal-content]');
const modalClose = document.querySelector('[data-modal-close]');

const assets = {
  dreams: '/manus-storage/async-images/Ni9X3hloFGU2ijEpWMsda8/image-1.webp',
  love: '/manus-storage/async-images/Ni9X3hloFGU2ijEpWMsda8/image-2.webp',
  protection: '/manus-storage/async-images/Ni9X3hloFGU2ijEpWMsda8/image-3.webp',
  prosperity: '/manus-storage/async-images/Ni9X3hloFGU2ijEpWMsda8/image-4.webp',
  ancestors: '/manus-storage/async-images/Ni9X3hloFGU2ijEpWMsda8/image-5.webp'
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

const guidancePage = () => `<section class="route-page"><div class="route-intro"><a class="back-link" href="/">← Home</a><p class="eyebrow">PRIVATE SPIRITUAL GUIDANCE</p><h1>Choose the question<br /><em>that is calling you.</em></h1><p>These services are designed as reflective conversations: practical, personal, and free from guarantees or fear-based pressure.</p></div><div class="route-service-grid">${Object.entries(services).map(([key, service]) => serviceCard(key, service)).join('')}</div><div class="route-callout"><p class="eyebrow">A NOTE ON CARE</p><h2>You stay in charge of your story.</h2><p>We will never tell you that you are doomed, demand urgent payment, or replace medical, legal, or mental-health care with spiritual language.</p><a class="outline-button" href="/contact">Ask a question <span>→</span></a></div></section>`;

const dreamsPage = () => `<section class="route-page editorial-route"><div class="route-intro"><a class="back-link" href="/">← Home</a><p class="eyebrow">THE LANGUAGE OF NIGHT</p><h1>Dreams leave clues<br /><em>in the morning.</em></h1><p>Start with the dream you remember most clearly. A dream reading gives you a grounded way to explore symbols, emotion, memory, and the choices waiting underneath.</p></div><div class="dream-feature" style="background-image:linear-gradient(90deg, rgba(8,9,9,.92), rgba(8,9,9,.3)), url('${assets.dreams}')"><div><p class="eyebrow">DREAM INTERPRETATION SESSION</p><h2>Bring the image<br />that stayed with you.</h2><a class="gold-button inline-button" href="/contact?topic=dreams">Book a dream conversation <span>↗</span></a></div></div><div class="three-column-notes"><div><span>01</span><h3>Remember</h3><p>Write down the scene, feeling, people, colors, and what happened immediately before waking.</p></div><div><span>02</span><h3>Explore</h3><p>We look for personal meaning rather than applying a one-size-fits-all dream dictionary.</p></div><div><span>03</span><h3>Carry forward</h3><p>Leave with a question or next step you can bring into your everyday life.</p></div></div></section>`;

const approachPage = () => `<section class="route-page editorial-route"><div class="route-intro"><a class="back-link" href="/">← Home</a><p class="eyebrow">OUR APPROACH</p><h1>Warm guidance.<br /><em>Clear boundaries.</em></h1><p>Spiritual work can be beautiful without being vague. Our approach is reflective, culturally respectful, and connected to practical life.</p></div><div class="principles-route"><div class="principle-route"><span>01</span><h2>Listen first.</h2><p>Your lived experience sets the direction. We ask questions before we offer interpretation.</p></div><div class="principle-route"><span>02</span><h2>Stay grounded.</h2><p>Insight should help you make a clearer decision, not make you more afraid or dependent.</p></div><div class="principle-route"><span>03</span><h2>Respect your agency.</h2><p>You can pause, question, or say no. No service is more important than your wellbeing.</p></div></div><div class="route-callout warm-callout"><p class="eyebrow">A SIMPLE PROMISE</p><h2>No fear. No fixed fate. No pressure.</h2><p>Just a private space to reflect on what you are carrying and choose what to do with it next.</p><a class="gold-button inline-button" href="/contact">Talk with us <span>↗</span></a></div></section>`;

const contactPage = () => `<section class="route-page contact-route"><div class="route-intro"><a class="back-link" href="/">← Home</a><p class="eyebrow">BEGIN YOUR CONVERSATION</p><h1>A simple hello<br /><em>is enough.</em></h1><p>Choose a topic, share only what feels comfortable, and prepare a private WhatsApp message in one step.</p></div><div class="contact-route-grid"><div class="contact-route-image" style="background-image:url('${assets.ancestors}')"></div><div class="contact-route-card"><form class="inquiry-form" data-inquiry-form><label for="topic">What would you like guidance on?</label><div class="select-wrap"><select id="topic" name="topic"><option value="dream interpretation">Dream interpretation</option><option value="love or relationships">Love or relationships</option><option value="protection and clearing">Protection and clearing</option><option value="prosperity and purpose">Prosperity and purpose</option><option value="ancestral connection">Ancestral connection</option></select><span>⌄</span></div><label for="message">A little about your question <small>(optional)</small></label><textarea id="message" name="message" rows="6" placeholder="Share only what feels comfortable..."></textarea><button class="gold-button" type="submit">Prepare my WhatsApp message <span>↗</span></button><p class="form-status" data-form-status role="status" aria-live="polite"></p></form><div class="contact-route-number"><small>WhatsApp directly</small><a href="https://wa.me/27732552543" target="_blank" rel="noreferrer">+27 73 255 2543</a></div></div></div></section>`;

const imageForPage = (page) => assets[page.imageKey] || assets.ancestors;

const genericPage = (page) => {
  const sections = page.sections.map((section, index) => `<article class="content-section-card"><span>${String(index + 1).padStart(2, '0')}</span><div><h2>${section.heading}</h2><p>${section.body}</p></div></article>`).join('');
  const related = (page.links || []).map((link) => `<a class="outline-button" href="${link.path}">${link.label} <span>→</span></a>`).join('');
  const faq = page.kind === 'faq' ? `<div class="faq-list">${page.sections.map((section) => `<details><summary>${section.heading}<span>＋</span></summary><p>${section.body}</p></details>`).join('')}</div>` : '';
  const directory = page.kind === 'directory' ? `<div class="library-tools"><label for="library-search">Search the library</label><input id="library-search" data-library-search type="search" placeholder="Try dreams, home, relationships..." /></div><div class="library-grid">${contentPages.filter((item) => item.path !== '/resources').map((item) => `<a class="library-card" data-library-card href="${item.path}"><span>${item.eyebrow}</span><strong>${item.title}</strong><small>${item.intro}</small></a>`).join('')}</div>` : '';
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
  return homeMarkup;
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
  input.addEventListener('input', () => {
    const query = input.value.trim().toLowerCase();
    document.querySelectorAll('[data-library-card]').forEach((card) => {
      card.hidden = query && !card.textContent.toLowerCase().includes(query);
    });
  });
};

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
      if (submitButton) { submitButton.disabled = true; submitButton.querySelector('span:first-child').textContent = 'Opening WhatsApp…'; }
      window.open('https://wa.me/27732552543?text=' + encodeURIComponent(text), '_blank', 'noopener,noreferrer');
      if (status) status.textContent = 'Your message is ready in WhatsApp — we look forward to hearing from you.';
      window.setTimeout(() => { if (submitButton) { submitButton.disabled = false; submitButton.querySelector('span:first-child').textContent = 'Prepare my WhatsApp message'; } }, 1400);
    });
  });
};

const openModal = (key) => {
  const service = services[key];
  if (!modal || !modalContent || !service) return;
  modalContent.innerHTML = `<div class="modal-image" style="background-image:url('${service.image}')"></div><div class="modal-copy"><p class="eyebrow">${service.eyebrow}</p><h2 id="service-modal-title">${service.title}</h2><p>${service.short}</p><a class="gold-button inline-button" href="/contact?topic=${key}">Ask about this service <span>↗</span></a></div>`;
  modal.showModal();
};

const closeModal = () => modal?.close();

const renderRoute = (path, push = false) => {
  const cleanPath = path.split('?')[0].replace(/\/$/, '') || '/';
  if (push) window.history.pushState({}, '', routeHref(path));
  if (main) main.innerHTML = routeContent(cleanPath);
  normalizeInternalLinks();
  setActiveNav(cleanPath);
  bindInquiryForms();
  bindLibrarySearch();
  window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
};

document.addEventListener('click', (event) => {
  const serviceTrigger = event.target.closest('[data-service-popout]');
  if (serviceTrigger) { event.preventDefault(); openModal(serviceTrigger.dataset.servicePopout); return; }
  const link = event.target.closest('a');
  if (!link || link.target === '_blank' || link.origin !== window.location.origin) return;
  const path = stripBase(link.pathname);
  if (!path.startsWith('/')) return;
  event.preventDefault(); renderRoute(path + link.search, true);
});

modalClose?.addEventListener('click', closeModal);
modal?.addEventListener('click', (event) => { if (event.target === modal) closeModal(); });
window.addEventListener('popstate', () => renderRoute(stripBase(window.location.pathname)));

const heroForm = document.querySelector('[data-hero-form]');
heroForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const question = String(new FormData(heroForm).get('question') || '').trim();
  const text = question ? `Hello Ancestral Path, I have a question about ${question}. Please let me know how to begin.` : 'Hello Ancestral Path, I would like to begin a guidance conversation.';
  window.open('https://wa.me/27732552543?text=' + encodeURIComponent(text), '_blank', 'noopener,noreferrer');
});

bindInquiryForms();
normalizeInternalLinks();
bindLibrarySearch();
const initialPath = stripBase(window.location.pathname);
if (initialPath !== '/') renderRoute(initialPath);
