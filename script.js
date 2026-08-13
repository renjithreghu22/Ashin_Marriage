/* ==========================================================================
   Ashin & Vrindha Wedding Website JavaScript Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Navbar Scroll Effect
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile Navigation Drawer
  const openDrawerBtn = document.getElementById('openDrawerBtn');
  const closeDrawerBtn = document.getElementById('closeDrawerBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  function openDrawer() {
    mobileDrawer.classList.add('open');
    drawerBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    mobileDrawer.classList.remove('open');
    drawerBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (openDrawerBtn) openDrawerBtn.addEventListener('click', openDrawer);
  if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeDrawer);
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);
  mobileNavLinks.forEach(link => link.addEventListener('click', closeDrawer));

  // Countdown Timer Logic
  // Target Date: 6th September 2026 00:00:00 IST
  const targetDate = new Date('2026-09-06T00:00:00+05:30').getTime();

  const daysVal = document.getElementById('daysVal');
  const hoursVal = document.getElementById('hoursVal');
  const minutesVal = document.getElementById('minutesVal');
  const secondsVal = document.getElementById('secondsVal');

  function updateCountdown() {
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference <= 0) {
      if (daysVal) daysVal.textContent = '00';
      if (hoursVal) hoursVal.textContent = '00';
      if (minutesVal) minutesVal.textContent = '00';
      if (secondsVal) secondsVal.textContent = '00';
      return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    if (daysVal) daysVal.textContent = String(days).padStart(2, '0');
    if (hoursVal) hoursVal.textContent = String(hours).padStart(2, '0');
    if (minutesVal) minutesVal.textContent = String(minutes).padStart(2, '0');
    if (secondsVal) secondsVal.textContent = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // Scroll Reveal Animations
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  document.querySelectorAll('.scroll-reveal').forEach(el => revealObserver.observe(el));

  // Lightbox Logic
  window.openLightbox = function(src, alt) {
    const modal = document.getElementById('lightboxModal');
    const img = document.getElementById('lightboxImg');
    if (modal && img) {
      img.src = src;
      img.alt = alt || 'Gallery photo';
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  };

  window.closeLightbox = function() {
    const modal = document.getElementById('lightboxModal');
    if (modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  };

  // Guestbook / Wishes Management
  const initialWishes = [
    {
      author: 'Unnikrishnan & Family',
      text: 'Wishing Ashin and Vrindha a blessed, joyous, and wonderful life together. May your home be filled with endless happiness!',
      date: '12 August 2026'
    },
    {
      author: 'Anjali & Vivek',
      text: 'Heartiest congratulations to the lovely couple! So happy for both of you as you embark on this beautiful journey.',
      date: '10 August 2026'
    }
  ];

  function getStoredWishes() {
    const stored = localStorage.getItem('ashin_vrindha_wishes');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return initialWishes;
      }
    }
    return initialWishes;
  }

  function saveWishes(wishes) {
    localStorage.setItem('ashin_vrindha_wishes', JSON.stringify(wishes));
  }

  function renderWishes() {
    const wishesFeed = document.getElementById('wishesFeed');
    if (!wishesFeed) return;

    const wishes = getStoredWishes();
    wishesFeed.innerHTML = wishes.map(wish => `
      <div class="wish-item">
        <h4 class="wish-author">${escapeHtml(wish.author)}</h4>
        <p class="wish-text">${escapeHtml(wish.text)}</p>
        <p class="wish-date">Submitted on ${escapeHtml(wish.date)}</p>
      </div>
    `).join('');
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  const wishForm = document.getElementById('wishForm');
  if (wishForm) {
    wishForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const authorInput = document.getElementById('authorInput');
      const messageInput = document.getElementById('messageInput');

      const author = authorInput.value.trim();
      const text = messageInput.value.trim();

      if (!author || !text) return;

      const newWish = {
        author: author,
        text: text,
        date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
      };

      const currentWishes = getStoredWishes();
      currentWishes.unshift(newWish);
      saveWishes(currentWishes);
      renderWishes();

      // Clear Form
      authorInput.value = '';
      messageInput.value = '';

      // Trigger Confetti Celebration Effect
      if (typeof confetti === 'function') {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#b8913a', '#7c2d3e', '#f6bc35', '#ffffff']
        });
      }
    });
  }

  // Initial render of wishes
  renderWishes();
});
