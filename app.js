// ── State ──────────────────────────────────────────────
let currentScreen = 1;
let selectedDate = '';
let selectedTime = '';
let selectedFood = '';
let noPresses = 0;

// ── Init ───────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  createFloatingHearts();
  positionNoBtn();

  // Set min date to today
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('datePicker').min = today;
});

// ── Screen navigation ──────────────────────────────────
function goToScreen(n) {
  document.getElementById(`screen${currentScreen}`).classList.remove('active');
  currentScreen = n;
  const next = document.getElementById(`screen${n}`);
  next.classList.add('active');
  next.style.animation = 'none';
  requestAnimationFrame(() => {
    next.style.animation = 'fadeSlideIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards';
  });

  // Update progress dots
  document.querySelectorAll('.dot').forEach((dot, i) => {
    dot.classList.toggle('active', i + 1 === n);
  });

  if (n === 6) {
    launchConfetti();
    buildSummary();
  }
}

// ── NO button runs away ────────────────────────────────
function positionNoBtn() {
  const btn = document.getElementById('noBtn');
  if (!btn) return;
  btn.style.position = 'absolute';
  btn.style.left = '65%';
  btn.style.top  = '82%';
}

function runAway() {
  const btn = document.getElementById('noBtn');
  const card = btn.closest('.card');
  if (!btn || !card) return;

  noPresses++;
  const cardRect = card.getBoundingClientRect();
  const margin = 70;
  const maxX = cardRect.width  - margin;
  const maxY = cardRect.height - margin;

  const x = Math.random() * maxX;
  const y = Math.random() * maxY;

  btn.style.left = x + 'px';
  btn.style.top  = y + 'px';

  // Get sassier with each attempt
  const messages = [
    'no 🐾', 'nope 🙅', 'nice try 😏', 'lol no 💅', 'never 🏃',
    'catch me if u can 🐕', 'lmao 😂', 'STOP 😭', 'fine say yes already 🌸'
  ];
  btn.textContent = messages[Math.min(noPresses - 1, messages.length - 1)];

  // Shake the yes button after many attempts
  if (noPresses > 3) {
    const yesBtn = document.getElementById('yesBtn');
    yesBtn.style.animation = 'none';
    requestAnimationFrame(() => {
      yesBtn.style.animation = 'petWiggle 0.4s ease infinite';
    });
  }
}

// ── Date validation ────────────────────────────────────
function validateDate() {
  const dateVal = document.getElementById('datePicker').value;
  const timeVal = document.getElementById('timePicker').value;

  if (!dateVal) {
    shakeInput('datePicker');
    return;
  }
  if (!timeVal) {
    shakeInput('timePicker');
    return;
  }

  selectedDate = dateVal;
  selectedTime = timeVal;
  goToScreen(4);
}

function shakeInput(id) {
  const el = document.getElementById(id);
  el.style.borderColor = '#e91e8c';
  el.style.animation = 'none';
  requestAnimationFrame(() => {
    el.style.animation = 'shakeEl 0.4s ease';
  });
  setTimeout(() => {
    el.style.borderColor = '';
    el.style.animation = '';
  }, 600);
}

// Inject shake keyframe dynamically
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
@keyframes shakeEl {
  0%,100% { transform: translateX(0); }
  20%      { transform: translateX(-8px); }
  40%      { transform: translateX(8px); }
  60%      { transform: translateX(-5px); }
  80%      { transform: translateX(5px); }
}`;
document.head.appendChild(shakeStyle);

// ── Food selection ─────────────────────────────────────
function selectFood(btn, food) {
  document.querySelectorAll('.food-card').forEach(c => c.classList.remove('selected'));
  btn.classList.add('selected');
  selectedFood = food;

  const nextBtn = document.getElementById('foodNextBtn');
  nextBtn.disabled = false;
  nextBtn.style.opacity = '1';
  nextBtn.style.animation = 'none';
  requestAnimationFrame(() => {
    nextBtn.style.animation = 'popIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)';
  });
}

// ── Summary builder ────────────────────────────────────
function buildSummary() {
  const el = document.getElementById('dateSummary');
  const dateObj = selectedDate ? new Date(selectedDate + 'T12:00:00') : null;
  const dateStr = dateObj ? dateObj.toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  }) : '—';

  el.innerHTML = `
    <p><span class="label">📅</span> ${dateStr}</p>
    <p><span class="label">⏰</span> ${selectedTime || '—'}</p>
    <p><span class="label">🍽</span> ${selectedFood || '—'}</p>
  `;
}

// ── Confetti ───────────────────────────────────────────
function launchConfetti() {
  const container = document.getElementById('confettiContainer');
  const colors = ['#e91e8c', '#c2185b', '#f48fb1', '#ce93d8', '#ffb3c1', '#fff176', '#aed6f1'];
  const shapes = ['🌸', '💕', '✨', '🎊', '💝', '⭐', '🌟'];

  for (let i = 0; i < 60; i++) {
    setTimeout(() => {
      const el = document.createElement('div');
      el.classList.add('confetti-piece');
      el.textContent = shapes[Math.floor(Math.random() * shapes.length)];
      el.style.cssText = `
        left: ${Math.random() * 100}%;
        font-size: ${0.8 + Math.random() * 1.2}rem;
        background: none;
        width: auto; height: auto;
        border-radius: 0;
        animation-duration: ${2 + Math.random() * 2}s;
        animation-delay: ${Math.random() * 0.8}s;
      `;
      container.appendChild(el);
      setTimeout(() => el.remove(), 4000);
    }, i * 40);
  }
}

// ── Floating hearts background ─────────────────────────
function createFloatingHearts() {
  const container = document.getElementById('heartsBg');
  const hearts = ['💕', '🌸', '✨', '💖', '🤍', '💝', '🌷', '⭐'];

  function spawnHeart() {
    const el = document.createElement('div');
    el.classList.add('floating-heart');
    el.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    el.style.cssText = `
      left: ${Math.random() * 100}%;
      font-size: ${0.8 + Math.random() * 1}rem;
      animation-duration: ${8 + Math.random() * 10}s;
      animation-delay: ${Math.random() * 2}s;
    `;
    container.appendChild(el);
    setTimeout(() => el.remove(), 20000);
  }

  // Initial burst
  for (let i = 0; i < 12; i++) setTimeout(spawnHeart, i * 300);
  // Keep spawning
  setInterval(spawnHeart, 1500);
}

// ── Reset ──────────────────────────────────────────────
function resetApp() {
  selectedDate = '';
  selectedTime = '';
  selectedFood = '';
  noPresses = 0;

  document.getElementById('datePicker').value = '';
  document.getElementById('timePicker').value = '';
  document.querySelectorAll('.food-card').forEach(c => c.classList.remove('selected'));
  const nextBtn = document.getElementById('foodNextBtn');
  nextBtn.disabled = true;
  nextBtn.style.opacity = '0.5';

  const yesBtn = document.getElementById('yesBtn');
  yesBtn.style.animation = '';
  positionNoBtn();
  const noBtn = document.getElementById('noBtn');
  if (noBtn) noBtn.textContent = 'no 🐾';

  goToScreen(1);
}
