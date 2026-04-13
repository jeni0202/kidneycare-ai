/**
 * KidneyCare AI – Main JavaScript
 * Responsibilities:
 *   1. Responsive hamburger menu toggle
 *   2. Scroll-triggered fade-in animations
 *   3. Navbar scroll shadow
 *   4. Prediction form validation
 *   5. Simulated result display (frontend only – no backend)
 */

'use strict';

// ── DOM ready ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollAnimations();
  initPredictionForm();
});

/* =============================================
   1. NAVBAR – hamburger + scroll shadow
============================================= */
function initNavbar() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  // Hamburger toggle
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });

    // Close menu when a nav link is clicked (mobile UX)
    navLinks.querySelectorAll('.nav-link, .nav-cta-btn').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });

    // Close menu on outside click
    document.addEventListener('click', e => {
      if (!navbar.contains(e.target)) {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Add shadow when scrolled
  window.addEventListener('scroll', () => {
    navbar.style.boxShadow = window.scrollY > 8
      ? '0 4px 16px rgba(37,99,235,.12)'
      : '';
  }, { passive: true });
}

/* =============================================
   2. SCROLL ANIMATIONS – Intersection Observer
============================================= */
function initScrollAnimations() {
  const targets = document.querySelectorAll('.fade-in-up');
  if (!targets.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger siblings in the same parent
        const siblings = entry.target.parentElement
          ? [...entry.target.parentElement.querySelectorAll('.fade-in-up')]
          : [];
        const idx = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = `${idx * 0.1}s`;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  targets.forEach(el => observer.observe(el));
}

/* =============================================
   3. PREDICTION FORM – validation + result
============================================= */
function initPredictionForm() {
  const form = document.getElementById('predictionForm');
  if (!form) return;

  const resetBtn = document.getElementById('resetBtn');

  // ── Validation rules ────────────────────────
  const rules = {
    age: { min: 1, max: 120, label: 'Age', type: 'number' },
    bp: { min: 50, max: 200, label: 'Blood Pressure', type: 'number' },
    sg: { label: 'Specific Gravity', type: 'select' },
    al: { label: 'Albumin', type: 'select' },
    su: { label: 'Sugar', type: 'select' },
    rbc: { label: 'Red Blood Cells', type: 'select' },
    pc: { label: 'Pus Cell', type: 'select' },
    sc: { min: 0.1, max: 50, label: 'Serum Creatinine', type: 'number' },
    hemo: { min: 3, max: 20, label: 'Hemoglobin', type: 'number' },
  };

  // ── Live validation on blur ─────────────────
  Object.keys(rules).forEach(fieldId => {
    const el = document.getElementById(fieldId);
    if (!el) return;
    el.addEventListener('blur', () => validateField(fieldId, rules[fieldId]));
    el.addEventListener('input', () => clearError(fieldId));
  });

  // ── Submit ──────────────────────────────────
  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;

    Object.keys(rules).forEach(fieldId => {
      if (!validateField(fieldId, rules[fieldId])) valid = false;
    });

    if (valid) {
      const values = collectValues();
      displayResult(values);
    } else {
      // Focus first invalid field
      const firstError = form.querySelector('.input-error');
      if (firstError) firstError.focus();
    }
  });

  // ── Reset ────────────────────────────────────
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      // Clear validation states after native reset fires
      setTimeout(() => {
        Object.keys(rules).forEach(clearError);
        hideResult();
      }, 10);
    });
  }
}

/* ── Validate a single field ──────────────── */
function validateField(fieldId, rule) {
  const el = document.getElementById(fieldId);
  const errEl = document.getElementById(`${fieldId}-error`);
  if (!el || !errEl) return true;

  const raw = el.value.trim();
  let error = '';

  if (!raw) {
    error = `${rule.label} is required.`;
  } else if (rule.type === 'number') {
    const val = parseFloat(raw);
    if (isNaN(val)) error = `${rule.label} must be a number.`;
    else if (val < rule.min) error = `${rule.label} must be ≥ ${rule.min}.`;
    else if (val > rule.max) error = `${rule.label} must be ≤ ${rule.max}.`;
  }

  if (error) {
    setError(el, errEl, error);
    return false;
  }

  setValid(el, errEl);
  return true;
}

function setError(el, errEl, msg) {
  el.classList.add('input-error');
  el.classList.remove('input-valid');
  errEl.textContent = msg;
}

function setValid(el, errEl) {
  el.classList.remove('input-error');
  el.classList.add('input-valid');
  errEl.textContent = '';
}

function clearError(fieldId) {
  const el = document.getElementById(fieldId);
  const errEl = document.getElementById(`${fieldId}-error`);
  if (el) { el.classList.remove('input-error', 'input-valid'); }
  if (errEl) { errEl.textContent = ''; }
}

/* ── Collect form values ─────────────────── */
function collectValues() {
  return {
    age: parseFloat(document.getElementById('age').value),
    bp: parseFloat(document.getElementById('bp').value),
    sg: parseFloat(document.getElementById('sg').value),
    al: parseInt(document.getElementById('al').value, 10),
    su: parseInt(document.getElementById('su').value, 10),
    rbc: document.getElementById('rbc').value,
    pc: document.getElementById('pc').value,
    sc: parseFloat(document.getElementById('sc').value),
    hemo: parseFloat(document.getElementById('hemo').value),
  };
}

/* ── Fetch Real Prediction from Flask API ────── */
async function displayResult(values) {
  const section = document.getElementById('resultSection');
  const card = document.getElementById('resultCard');
  if (!section || !card) return;

  // 1. Show loading state
  section.hidden = false;
  section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  card.className = 'result-card fade-in';
  card.innerHTML = `
    <div style="text-align:center; padding: 20px;">
      <div class="logo-icon" style="justify-content:center; margin-bottom:15px; animation: pulse 1.5s infinite;">
         <svg width="64" height="64" viewBox="0 0 32 32" fill="none"><ellipse cx="11" cy="16" rx="7" ry="11" fill="#3B82F6" opacity="0.6"/><ellipse cx="21" cy="16" rx="5" ry="9" fill="#2563EB" opacity="0.4"/></svg>
      </div>
      <p style="font-weight:600; color:var(--grey-600);">AI is analyzing clinical biomarkers...</p>
    </div>
  `;

  try {
    // 2. Determine API endpoint (Localhost during development, Render/Railway after deployment)
    const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname === ''
      ? 'http://127.0.0.1:5000'
      : 'https://kidney-api.onrender.com'; // REPLACE THIS WITH YOUR ACTUAL DEPLOYED API URL

    const payload = {
      "Age": values.age,
      "Blood_Pressure": values.bp,
      "Specific_Gravity": values.sg,
      "Albumin": values.al,
      "Sugar": values.su,
      "Red_Blood_Cells": values.rbc,
      "Pus_Cells": values.pc,
      "Serum_Creatinine": values.sc,
      "Hemoglobin": values.hemo
    };

    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!response.ok) throw new Error(result.error || 'Prediction failed');

    const isPositive = result.prediction.toLowerCase().includes('ckd') && !result.prediction.toLowerCase().includes('not');
    const confidence = result.probabilities
      ? Math.round(result.probabilities[result.prediction] * 100)
      : 85; // Fallback if proba not available

    // 3. Render real results
    card.className = `result-card ${isPositive ? 'ckd-positive' : 'ckd-negative'}`;
    card.innerHTML = `
      <div class="result-header">
        <div class="result-icon">${isPositive ? '⚠️' : '✅'}</div>
        <div>
          <div class="result-title">
            ${isPositive ? 'CKD Risk Detected' : 'Low CKD Risk'}
          </div>
          <div class="result-subtitle">
            ${isPositive
        ? 'Our AI model has identified clinical markers associated with Chronic Kidney Disease.'
        : 'Our AI model classifies these parameters as low risk for Chronic Kidney Disease.'}
          </div>
        </div>
      </div>

      <div class="result-body">
        <div class="result-confidence-wrap">
          <span class="result-confidence-label">
            Model Confidence: <strong>${confidence}%</strong>
            &nbsp;|&nbsp; Status: <strong>${result.prediction.toUpperCase()}</strong>
          </span>
          <div class="confidence-bar" role="progressbar" aria-valuenow="${confidence}" aria-valuemin="0" aria-valuemax="100">
            <div class="confidence-fill ${isPositive ? 'low' : 'high'}" style="width:0%" data-target="${confidence}"></div>
          </div>
        </div>

        <div class="result-advice">
          ${isPositive
        ? '⚕️ <strong>Recommendation:</strong> Please consult a nephrologist promptly. Early detection is key to managing CKD and preventing progression.'
        : '🎉 <strong>Recommendation:</strong> Results indicate low risk. Continue maintaining a healthy diet, stay active, and stay hydrated.'}
        </div>

        <div class="result-actions">
          <button class="btn btn-primary" onclick="window.print()" aria-label="Print results">
            🖨️ Print Results
          </button>
          <button class="btn btn-outline" onclick="location.reload()" aria-label="Start a new assessment">
            🔄 New Assessment
          </button>
        </div>
      </div>
    `;

    // Animate bar
    setTimeout(() => {
      const fill = card.querySelector('.confidence-fill');
      if (fill) fill.style.width = `${fill.dataset.target}%`;
    }, 100);

  } catch (error) {
    console.error("API Error:", error);
    card.className = 'result-card';
    card.innerHTML = `
      <div class="result-header">
        <div class="result-icon">❌</div>
        <div>
          <div class="result-title">System Error</div>
          <div class="result-subtitle">Could not connect to the Prediction AI.</div>
        </div>
      </div>
      <div class="result-body">
        <div class="result-advice" style="border-left-color: var(--red-500);">
          <strong>Error Details:</strong> ${error.message}<br><br>
          Please ensure the Flask backend is running (<code>python app.py</code>) and that you are using a browser that allows local CORS requests.
        </div>
        <button class="btn btn-primary" onclick="location.reload()">Retry Assessment</button>
      </div>
    `;
  }
}

function hideResult() {
  const section = document.getElementById('resultSection');
  if (section) section.hidden = true;
}
