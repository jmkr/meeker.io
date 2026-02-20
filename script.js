// ── Copyright year ────────────────────────────────────────────
document.getElementById('year').textContent = new Date().getFullYear();

// ── Mouse-tracking spotlight glow ─────────────────────────────
document.addEventListener('mousemove', function (e) {
  document.documentElement.style.setProperty('--mx', e.clientX + 'px');
  document.documentElement.style.setProperty('--my', e.clientY + 'px');
});

// ── Sticky nav ────────────────────────────────────────────────
var nav = document.getElementById('site-nav');
window.addEventListener('scroll', function () {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// ── Parallax on hero bg image ─────────────────────────────────
var landing = document.querySelector('.landing');
window.addEventListener('scroll', function () {
  if (window.scrollY < window.innerHeight) {
    landing.style.backgroundPositionY = (window.scrollY * 0.35) + 'px';
  }
}, { passive: true });

// ── Text scramble effect ──────────────────────────────────────
var SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$&';

function scramble(el, finalText, onComplete) {
  var frame = 0;
  var totalFrames = finalText.length * 2;

  el.classList.add('scrambling');

  (function tick() {
    var resolved = Math.floor(frame / 5);
    el.textContent = finalText.split('').map(function (char, i) {
      if (char === ' ') return ' ';
      if (i < resolved) return char;
      return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
    }).join('');

    frame++;
    if (frame <= totalFrames) {
      requestAnimationFrame(tick);
    } else {
      el.textContent = finalText;
      el.classList.remove('scrambling');
      if (onComplete) onComplete();
    }
  })();
}

// ── Hero reveal ───────────────────────────────────────────────
var heroContent = document.getElementById('hero-content');
var heroHeading = document.getElementById('hero-heading');
var heroSub     = document.querySelector('.hero-sub');
var scrollCue   = document.querySelector('.scroll-cue');

// Start subtitle and scroll cue invisible; fade them in after scramble
heroSub.style.opacity     = '0';
scrollCue.style.opacity   = '0';
scrollCue.style.transition = 'opacity 0.6s ease';

var img = new Image();
img.src = 'assets/images/bgRailsColor.png';

function revealHero() {
  heroContent.classList.add('loaded');
  setTimeout(function () {
    scramble(heroHeading, 'In theory, there is no difference between theory and practice. In practice, there is.', function () {
      heroSub.style.opacity   = '1';
      scrollCue.style.opacity = '0.75';
    });
  }, 250);
}

img.onload  = function () {
  landing.style.backgroundImage = "url('" + img.src + "')";
  revealHero();
};
img.onerror = revealHero; // show hero even if bg fails

// ── Smooth scroll on chevron ──────────────────────────────────
scrollCue.addEventListener('click', function (e) {
  e.preventDefault();
  document.querySelector('#about').scrollIntoView({ behavior: 'smooth' });
});

// ── Scroll-reveal for about / work sections ───────────────────
var revealObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(function (el) {
  revealObserver.observe(el);
});

// ── Staggered app icon reveal ─────────────────────────────────
var appsGrid = document.getElementById('apps-grid');
new IntersectionObserver(function (entries) {
  if (entries[0].isIntersecting) {
    Array.from(appsGrid.querySelectorAll('li')).forEach(function (li, i) {
      setTimeout(function () {
        li.style.opacity   = '1';
        li.style.transform = 'none';
      }, i * 70);
    });
    this.unobserve(appsGrid);
  }
}, { threshold: 0.1 }).observe(appsGrid);
