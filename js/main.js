/* ============================================================
   LUMÉ — Main JavaScript
   File: js/main.js
   ============================================================ */

'use strict';

/* ════════════════════════════════════════
   1. NAV — scroll state
════════════════════════════════════════ */
const nav = document.getElementById('nav');

function handleNavScroll() {
  if (window.scrollY > 40) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', handleNavScroll, { passive: true });
handleNavScroll();


/* ════════════════════════════════════════
   2. SCROLL REVEAL
════════════════════════════════════════ */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger siblings inside same parent
        const siblings = entry.target.parentElement.querySelectorAll('.reveal');
        let delay = 0;
        siblings.forEach((sib, idx) => {
          if (sib === entry.target) delay = idx * 80;
        });
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

revealEls.forEach(el => revealObserver.observe(el));


/* ════════════════════════════════════════
   3. BOTTOM NAV — active link on scroll
════════════════════════════════════════ */
const bottomNavItems = document.querySelectorAll('.bottom-nav__item');
const sections = document.querySelectorAll('section[id]');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        bottomNavItems.forEach(item => {
          item.classList.remove('active');
          if (item.getAttribute('href') === `#${id}`) {
            item.classList.add('active');
          }
        });
      }
    });
  },
  { threshold: 0.4 }
);

sections.forEach(s => sectionObserver.observe(s));


/* ════════════════════════════════════════
   4. BOOKING FORM — WhatsApp submit
════════════════════════════════════════ */
const bookingForm = document.getElementById('bookingForm');

if (bookingForm) {
  // Set date min to today
  const dateInput = document.getElementById('date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  bookingForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const name    = document.getElementById('name').value.trim();
    const phone   = document.getElementById('phone').value.trim();
    const email   = document.getElementById('email').value.trim();
    const service = document.getElementById('service').value;
    const date    = document.getElementById('date').value;
    const message = document.getElementById('message').value.trim();

    // Basic validation
    if (!name || !phone || !email || !service || !date) {
      showFormFeedback('Please fill in all required fields.', 'error');
      return;
    }

    const text = [
      `✦ LUMÉ Booking Request`,
      ``,
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Email: ${email}`,
      `Service: ${service}`,
      `Preferred Date: ${date}`,
      message ? `Note: ${message}` : '',
    ].filter(Boolean).join('\n');

    const waNumber = '2340000000000'; // ← replace with real number
    const waURL = `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`;

    window.open(waURL, '_blank', 'noopener');
    showFormFeedback('Opening WhatsApp… We\'ll confirm within 2 hours ✦', 'success');
    bookingForm.reset();
  });
}

function showFormFeedback(msg, type) {
  const existing = document.querySelector('.form-feedback');
  if (existing) existing.remove();

  const el = document.createElement('p');
  el.className = 'form-feedback';
  el.textContent = msg;
  el.style.cssText = `
    text-align: center;
    font-size: 0.8rem;
    font-weight: 500;
    letter-spacing: 0.05em;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    margin-top: 0.5rem;
    background: ${type === 'success' ? 'rgba(196,144,154,0.15)' : 'rgba(180,40,40,0.08)'};
    color: ${type === 'success' ? '#2D0A2E' : '#b42828'};
    border: 1px solid ${type === 'success' ? 'rgba(196,144,154,0.4)' : 'rgba(180,40,40,0.2)'};
  `;

  bookingForm.appendChild(el);
  setTimeout(() => el.remove(), 5000);
}


/* ════════════════════════════════════════
   5. FAQ — smooth answer animation
════════════════════════════════════════ */
const faqItems = document.querySelectorAll('.faq__item');

faqItems.forEach(item => {
  item.addEventListener('toggle', function () {
    if (this.open) {
      // Close all others
      faqItems.forEach(other => {
        if (other !== this && other.open) other.open = false;
      });
    }
  });
});


/* ════════════════════════════════════════
   6. HERO — trigger reveals on load
════════════════════════════════════════ */
window.addEventListener('load', () => {
  const heroReveals = document.querySelectorAll('.hero .reveal');
  heroReveals.forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), 300 + i * 150);
  });
});


/* ════════════════════════════════════════
   7. SMOOTH SCROLL — offset for fixed nav
════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = nav ? nav.offsetHeight : 72;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});