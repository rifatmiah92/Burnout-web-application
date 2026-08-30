/**
 * Burnout Radar — Client Controller & Inference Engine Integration
 * Implements interactive image uploading, real-time Likert controls,
 * SHAP-weighted calculation, and needle gauge animation.
 */

document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initMobileNav();
  initSliders();
  initSegmentedButtons();
});

// ---------- 0. Tab Navigation Logic ----------
function switchTab(tabId) {
  const panes = document.querySelectorAll('.tab-pane');
  const navBtns = document.querySelectorAll('.nav-link[data-tab]');

  panes.forEach(pane => {
    pane.classList.toggle('active', pane.id === tabId);
  });

  navBtns.forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
  });

  // Close mobile nav drawer if open
  closeMobileNav();

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function initTabs() {
  const navBtns = document.querySelectorAll('.nav-link[data-tab]');
  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');
      if (tabId) switchTab(tabId);
    });
  });
}

// ---------- Mobile Nav Controller ----------
function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const backdrop = document.getElementById('navBackdrop');
  const navLinks = document.getElementById('navLinks');

  if (toggle) {
    toggle.addEventListener('click', () => {
      const isOpen = navLinks && navLinks.classList.contains('mobile-open');
      if (isOpen) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });
  }

  if (backdrop) {
    backdrop.addEventListener('click', () => {
      closeMobileNav();
    });
  }

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMobileNav();
    }
  });

  // Handle window resize
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 900) {
      closeMobileNav();
    }
  });
}

function openMobileNav() {
  const toggle = document.getElementById('navToggle');
  const backdrop = document.getElementById('navBackdrop');
  const navLinks = document.getElementById('navLinks');

  if (navLinks) navLinks.classList.add('mobile-open');
  if (toggle) {
    toggle.classList.add('active');
    toggle.setAttribute('aria-expanded', 'true');
  }
  if (backdrop) backdrop.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeMobileNav() {
  const toggle = document.getElementById('navToggle');
  const backdrop = document.getElementById('navBackdrop');
  const navLinks = document.getElementById('navLinks');

  if (navLinks) navLinks.classList.remove('mobile-open');
  if (toggle) {
    toggle.classList.remove('active');
    toggle.setAttribute('aria-expanded', 'false');
  }
  if (backdrop) backdrop.classList.remove('active');
  document.body.style.overflow = '';
}

window.switchTab = switchTab;
window.openMobileNav = openMobileNav;
window.closeMobileNav = closeMobileNav;

// ---------- 1. Sliders Logic ----------
const sliderMap = {
  study: { suffix: ' h', decimals: 1 },
  cgpa: { suffix: '', decimals: 2 },
  attendance: { suffix: '%', decimals: 0 },
  sleep: { suffix: ' h', decimals: 1 },
  activity: { suffix: ' h', decimals: 2 },
  social: { suffix: ' h', decimals: 1 }
};

function initSliders() {
  Object.keys(sliderMap).forEach(id => {
    const el = document.getElementById(id);
    const out = document.getElementById('v-' + id);
    const cfg = sliderMap[id];
    if (!el || !out) return;

    const update = () => {
      out.textContent = parseFloat(el.value).toFixed(cfg.decimals) + cfg.suffix;
    };
    el.addEventListener('input', update);
    update();
  });
}

// ---------- 3. Segmented Likert Controls ----------
const state = { sleepq: 3, stress: 2, depression: 2, motivation: 3, pressure: 3, workload: 3 };

function initSegmentedButtons() {
  document.querySelectorAll('.seg').forEach(group => {
    const key = group.dataset.group;
    group.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        group.querySelectorAll('button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state[key] = parseFloat(btn.dataset.v);
      });
    });
  });
}

// ---------- 4. SHAP-Informed Feature Weights ----------
const WEIGHTS = {
  acadPerf: 0.1503,
  cgpa: 0.1403,
  screenSleep: 0.1154,
  burnoutVuln: 0.0922,
  social: 0.0784,
  studyRest: 0.0777,
  psychStrain: 0.0642,
  motivDeficit: 0.0630,
  depression: 0.0598,
  stress: 0.0587,
  sleepDep: 0.0500,
  attendance: 0.0499
};

const LABELS = {
  acadPerf: 'Academic Performance Index',
  cgpa: 'CGPA Standing Level',
  screenSleep: 'Screen-to-Sleep Ratio (SSDR)',
  burnoutVuln: 'Burnout Vulnerability Index (BVI)',
  social: 'Social Media Screen Time',
  studyRest: 'Study-to-Rest Ratio',
  psychStrain: 'Psychological Strain Index',
  motivDeficit: 'Motivation Deficit Score',
  depression: 'Depressive Affect / Despair',
  stress: 'Perceived Academic Stress',
  sleepDep: 'Sleep Deprivation Index',
  attendance: 'Class Attendance Rate'
};

function clip01(x) {
  return Math.max(0, Math.min(1, x));
}

// ---------- 5. Risk Calculation & Visual Rendering ----------
function calculateRisk() {
  const study = parseFloat(document.getElementById('study').value);
  const sleep = parseFloat(document.getElementById('sleep').value);
  const social = parseFloat(document.getElementById('social').value);
  const activity = parseFloat(document.getElementById('activity').value);
  const attendance = parseFloat(document.getElementById('attendance').value);
  const cgpa = parseFloat(document.getElementById('cgpa').value);
  const { stress, depression, motivation, sleepq, pressure, workload } = state;

  // Domain Mathematical Composite Formulas from Paper
  const psychStrainRaw = stress + depression;
  const acadPressureIdx = pressure + workload;
  const burnoutVulnRaw = (psychStrainRaw * acadPressureIdx) / (motivation + sleepq + 0.1);
  const sleepDepRaw = Math.max(0, (8 - sleep) * (4 - sleepq));
  const screenSleepRaw = social / (sleep + 0.1);
  const studyRestRaw = (study + social) / (sleep + activity + 0.1);
  const acadPerfRaw = (cgpa / 4) * (attendance / 100);
  const motivDeficitRaw = (4 - motivation) * stress;

  const n = {
    acadPerf: clip01(1 - acadPerfRaw),
    cgpa: clip01((4 - cgpa) / 4),
    screenSleep: clip01(screenSleepRaw / 2.5),
    burnoutVuln: clip01(burnoutVulnRaw / 7.5),
    social: clip01(social / 10),
    studyRest: clip01(studyRestRaw / 5),
    psychStrain: clip01((psychStrainRaw - 2) / 6),
    motivDeficit: clip01(motivDeficitRaw / 10),
    depression: clip01((depression - 1) / 3),
    stress: clip01((stress - 1) / 3),
    sleepDep: clip01(sleepDepRaw / 12),
    attendance: clip01((100 - attendance) / 100)
  };

  let raw = 0;
  const contributions = [];
  Object.keys(WEIGHTS).forEach(k => {
    const c = WEIGHTS[k] * n[k];
    raw += c;
    contributions.push({ key: k, contrib: c, value: n[k] });
  });

  const score = Math.round(raw * 100);
  contributions.sort((a, b) => b.contrib - a.contrib);

  renderResult(score, contributions.slice(0, 5), {
    screenSleepRaw,
    sleep,
    social,
    stress,
    depression,
    cgpa
  });
}

function tierFor(score) {
  if (score < 35) {
    return {
      label: 'Low Risk',
      color: 'var(--coral)',
      blurb: 'Your current behavioural pattern looks close to what the study classified as Low Burnout — sleep duration, academic workload, and digital screen habits appear well-balanced and sustainable.'
    };
  }
  if (score < 65) {
    return {
      label: 'Moderate At-Risk',
      color: 'var(--rose)',
      blurb: 'Several psychological and lifestyle demand factors are pulling in the same direction. In the study cohort, students in this threshold benefited most from immediate micro-adjustments to sleep hygiene and screen time.'
    };
  }
  return {
    label: 'High Burnout Risk',
    color: 'var(--plum)',
    blurb: 'Your profile resembles the High Burnout cluster flagged most confidently by our champion Random Forest classifier — academic pressure, sleep displacement, and psychological strain are compounding each other.'
  };
}

function renderResult(score, top, metrics) {
  const result = document.getElementById('result');
  if (!result) return;
  result.classList.add('show');

  // 1. Score Number & Tier Label
  const scoreNum = document.getElementById('scoreNum');
  const tierLabel = document.getElementById('tierLabel');
  const resultBlurb = document.getElementById('resultBlurb');

  if (scoreNum) scoreNum.textContent = score + '%';
  const tier = tierFor(score);

  if (tierLabel) {
    tierLabel.textContent = tier.label;
    tierLabel.style.color = tier.color;
  }

  if (resultBlurb) {
    resultBlurb.textContent = tier.blurb;
  }

  // 2. Animate Speedometer Needle (-90deg to +90deg)
  const needle = document.getElementById('needle');
  if (needle) {
    const angle = -90 + (score / 100) * 180;
    needle.style.transform = `rotate(${angle}deg)`;
  }

  // 3. Top Contributing Factors Progress Bars
  const list = document.getElementById('contribList');
  if (list) {
    list.innerHTML = '';
    const maxContrib = top[0] ? top[0].contrib : 1;

    top.forEach(item => {
      const pct = Math.round((item.contrib / maxContrib) * 100);
      const intensityPct = Math.round(item.value * 100);
      const row = document.createElement('div');
      row.className = 'contrib';
      row.innerHTML = `
        <div class="contrib-top">
          <span class="name">${LABELS[item.key] || item.key}</span>
          <span class="pct mono">${intensityPct}% Strain</span>
        </div>
        <div class="contrib-bar">
          <span style="width:${pct}%; background:linear-gradient(90deg, var(--coral), var(--rose), var(--plum));"></span>
        </div>
      `;
      list.appendChild(row);
    });
  }

  // 4. Tailored Coping Steps
  const recsContainer = document.getElementById('recsList');
  if (recsContainer) {
    let recsHtml = '';
    if (metrics.screenSleepRaw > 0.7) {
      recsHtml += `<div class="rec-item"><strong>Digital Detachment:</strong> Your screen time (${metrics.social}h) is displacing nighttime sleep. Turn off social feeds 45 minutes before bed.</div>`;
    }
    if (metrics.sleep < 6.5) {
      recsHtml += `<div class="rec-item"><strong>Circadian Sleep Extension:</strong> Increase sleep from ${metrics.sleep}h to at least 7.5h to clear biological adenosine fatigue.</div>`;
    }
    if (metrics.stress >= 3 || metrics.depression >= 3) {
      recsHtml += `<div class="rec-item"><strong>Counseling Support:</strong> Connect with university student welfare or dial free emotional support at <a href="tel:+8801779554391" style="color:var(--plum); font-weight:700;">+880 1779 554391</a>.</div>`;
    }
    recsHtml += `<div class="rec-item"><strong>Pomodoro Pacing:</strong> Study in 25-minute focused blocks with 5-minute restorative breathers to mitigate cognitive burnout.</div>`;

    recsContainer.innerHTML = recsHtml;
  }

  // Smooth scroll into result card
  result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Make calculateRisk globally accessible
window.calculateRisk = calculateRisk;

// ---------------- LIGHTBOX FIGURE MODAL ----------------
function openFigureModal(src, title) {
  const modal = document.getElementById('figureModal');
  const img = document.getElementById('figModalImg');
  const titleEl = document.getElementById('figModalTitle');
  if (modal && img) {
    img.src = src;
    if (titleEl) titleEl.textContent = title || 'Research Figure Visualization';
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeFigureModal(event) {
  const modal = document.getElementById('figureModal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeFigureModal();
});

window.openFigureModal = openFigureModal;
window.closeFigureModal = closeFigureModal;

