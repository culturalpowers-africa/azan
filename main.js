import './styles.css';

const inquiryForm = document.querySelector('[data-inquiry-form]');
const formStatus = document.querySelector('[data-form-status]');
const header = document.querySelector('[data-header]');
const heroForm = document.querySelector('[data-hero-form]');

heroForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const question = String(new FormData(heroForm).get('question') || '').trim();
  const text = question
    ? `Hello Ancestral Path, I have a question about ${question}. Please let me know how to begin.`
    : 'Hello Ancestral Path, I would like to begin a guidance conversation.';
  window.open('https://wa.me/27732552543?text=' + encodeURIComponent(text), '_blank', 'noopener,noreferrer');
});

inquiryForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(inquiryForm);
  const topic = data.get('topic');
  const message = String(data.get('message') || '').trim();
  const text = [
    'Hello Ancestral Path, I would like guidance on ' + topic + '.',
    message ? 'Here is a little about my question: ' + message : '',
    'Please let me know how to begin.'
  ].filter(Boolean).join('\n\n');
  const url = 'https://wa.me/27732552543?text=' + encodeURIComponent(text);
  window.open(url, '_blank', 'noopener,noreferrer');
  if (formStatus) formStatus.textContent = 'Your message is ready in WhatsApp — we look forward to hearing from you.';
});

const updateHeader = () => {
  header?.classList.toggle('is-scrolled', window.scrollY > 14);
};
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });
