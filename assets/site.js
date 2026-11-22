/* Blu Petroleum mock-up: shared behavior. No external dependencies. */
(function () {
  var body = document.body;

  // Mobile menu
  var toggle = document.querySelector('.menu-toggle');
  if (toggle) toggle.addEventListener('click', function () { body.classList.toggle('menu-open'); });
  document.querySelectorAll('.nav-item > button').forEach(function (b) {
    b.addEventListener('click', function () {
      var item = b.parentElement;
      var open = item.classList.contains('open');
      document.querySelectorAll('.nav-item.open').forEach(function (i) { i.classList.remove('open'); });
      if (!open) item.classList.add('open');
    });
  });
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.nav-item')) document.querySelectorAll('.nav-item.open').forEach(function (i) { i.classList.remove('open'); });
  });

  // Images that fail to load fall back to a branded gradient
  document.querySelectorAll('img[data-fallback]').forEach(function (img) {
    function fail() { img.style.visibility = 'hidden'; if (img.parentElement) img.parentElement.classList.add('img-fallback'); }
    if (img.complete && img.naturalWidth === 0) fail();
    img.addEventListener('error', fail);
  });

  // Walkthrough notes toggle (remembered between pages)
  var nt = document.querySelector('.notes-toggle');
  try { if (localStorage.getItem('bluNotes') === '1') body.classList.add('notes-on'); } catch (e) {}
  if (nt) nt.addEventListener('click', function () {
    body.classList.toggle('notes-on');
    try { localStorage.setItem('bluNotes', body.classList.contains('notes-on') ? '1' : '0'); } catch (e) {}
  });

  // Read query params (for pre-filling the quote form)
  var params = new URLSearchParams(window.location.search);

  // Generic validation helper for mock HubSpot forms
  function validate(scope) {
    var ok = true, first = null;
    scope.querySelectorAll('[data-required]').forEach(function (field) {
      var wrap = field.closest('.hs-form-field');
      var valid;
      if (field.classList.contains('opt-grid')) {
        valid = field.querySelectorAll('input:checked').length > 0;
      } else if (field.type === 'email') {
        valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim());
      } else if (field.type === 'checkbox') {
        valid = field.checked;
      } else {
        valid = field.value.trim() !== '';
      }
      if (wrap) wrap.classList.toggle('hs-error', !valid);
      if (!valid) { ok = false; if (!first) first = field; }
    });
    if (first) {
      var top = (first.closest('.hs-form-field') || first).getBoundingClientRect().top + window.scrollY - 140;
      window.scrollTo({ top: top, behavior: 'smooth' });
    }
    return ok;
  }
  document.addEventListener('input', function (e) {
    var wrap = e.target.closest && e.target.closest('.hs-error');
    if (wrap) wrap.classList.remove('hs-error');
  });
  document.addEventListener('change', function (e) {
    var wrap = e.target.closest && e.target.closest('.hs-error');
    if (wrap) wrap.classList.remove('hs-error');
  });

  function refNumber(prefix) {
    return prefix + '-' + Math.floor(10000 + Math.random() * 89999);
  }

  // ---------- Quote form (2 steps) ----------
  var qf = document.getElementById('quote-form');
  if (qf) {
    var s1 = qf.querySelector('[data-step="1"]');
    var s2 = qf.querySelector('[data-step="2"]');
    var bars = document.querySelectorAll('.form-progress div');

    // Pre-fill from URL (?fuel=diesel&zip=60060&gallons=1000-5000&service=tank-monitoring&industry=construction)
    var fuel = params.get('fuel');
    if (fuel) fuel.split(',').forEach(function (f) { var el = qf.querySelector('input[name="fuel_types"][value="' + f + '"]'); if (el) el.checked = true; });
    var svc = params.get('service');
    if (svc) svc.split(',').forEach(function (s) { var el = qf.querySelector('input[name="services"][value="' + s + '"]'); if (el) el.checked = true; });
    var zip = params.get('zip'); if (zip && qf.zip) qf.zip.value = zip;
    var gal = params.get('gallons'); if (gal && qf.monthly_gallons) qf.monthly_gallons.value = gal;
    var ind = params.get('industry'); if (ind && qf.industry) qf.industry.value = ind;
    if (params.get('source')) { var src = qf.querySelector('input[name="quote_source_page"]'); if (src) src.value = params.get('source'); }
    var pageField = qf.querySelector('input[name="conversion_page"]'); if (pageField) pageField.value = document.referrer || '(direct)';

    function go(step) {
      s1.hidden = step !== 1; s2.hidden = step !== 2;
      bars.forEach(function (b, i) { b.classList.toggle('on', i < step); });
      var lbl = document.getElementById('step-label'); if (lbl) lbl.textContent = 'Step ' + step + ' of 2';
      var top = document.querySelector('.form-shell').getBoundingClientRect().top + window.scrollY - 110;
      window.scrollTo({ top: top, behavior: 'smooth' });
    }
    qf.querySelector('[data-next]').addEventListener('click', function () { if (validate(s1)) go(2); });
    qf.querySelector('[data-back]').addEventListener('click', function () { go(1); });
    qf.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validate(s2)) return;
      var name = (qf.firstname.value || '').trim();
      var fuels = Array.prototype.map.call(qf.querySelectorAll('input[name="fuel_types"]:checked'), function (i) { return i.parentElement.textContent.trim(); });
      document.getElementById('qs-name').textContent = name;
      document.getElementById('qs-fuels').textContent = fuels.join(', ');
      document.getElementById('qs-ref').textContent = refNumber('BLU-Q');
      qf.hidden = true;
      document.querySelector('.form-head').hidden = true;
      document.getElementById('quote-success').classList.add('show');
      var top = document.querySelector('.form-shell').getBoundingClientRect().top + window.scrollY - 110;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  }

  // ---------- Contact form ----------
  var cf = document.getElementById('contact-form');
  if (cf) {
    cf.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validate(cf)) return;
      document.getElementById('cs-ref').textContent = refNumber('BLU-C');
      cf.hidden = true;
      document.getElementById('contact-success').classList.add('show');
    });
  }

  // ---------- Simple single-step forms (BluLock, Blu App, newsletter) ----------
  document.querySelectorAll('form[data-simple]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validate(f)) return;
      f.hidden = true;
      var s = f.parentElement.querySelector('.form-success'); if (s) s.classList.add('show');
    });
  });

  // ---------- Hero quick-quote: carry values into the full form ----------
  var qq = document.getElementById('quick-quote');
  if (qq) {
    qq.addEventListener('submit', function (e) {
      e.preventDefault();
      var q = new URLSearchParams();
      if (qq.fuel.value) q.set('fuel', qq.fuel.value);
      if (qq.zip.value) q.set('zip', qq.zip.value);
      if (qq.gallons.value) q.set('gallons', qq.gallons.value);
      q.set('source', 'homepage-quick-quote');
      window.location.href = qq.getAttribute('action') + '?' + q.toString();
    });
  }
})();
