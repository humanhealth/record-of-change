import { demoProfile, interventions } from './data/seedData.js';
import { buildCandidates } from './core/scoring.js';
import { actionMode, buildGlobalSafetyNotice, patientActionLabel, safetyStatus } from './core/safety.js';
import { createDeltaCycle, createDeltaRecord, sampleObservationsFor } from './core/deltaRecords.js';
import { generateClinicianSummary } from './core/clinicianSummary.js';
import { deltaThesis } from './data/deltaThesis.js';

const app = document.getElementById('app');
const candidates = buildCandidates(demoProfile, interventions);

const storage = {
  get(key) {
    try {
      return JSON.parse(localStorage.getItem(key));
    } catch {
      return null;
    }
  },
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  remove(key) {
    localStorage.removeItem(key);
  }
};

const routes = [
  ['/', 'Thesis'],
  ['/state', 'Health state'],
  ['/interventions', 'Interventions'],
  ['/cycle', 'Delta cycle'],
  ['/track', 'Track'],
  ['/review', 'Review'],
  ['/clinician-summary', 'Clinician summary'],
  ['/evidence-safety', 'Evidence & safety'],
  ['/deepmind', 'The argument']
];

function currentPath() {
  const h = location.hash.replace(/^#/, '');
  return h || '/';
}

function navigate(path) {
  if (currentPath() === path) {
    render();
  } else {
    location.hash = path;
  }
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', render);

function html(strings, ...values) {
  return strings.reduce((acc, string, index) => acc + string + (values[index] ?? ''), '');
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function badge(text, type = '') {
  return `<span class="badge ${type}">${escapeHtml(text)}</span>`;
}

function layout(content) {
  const current = currentPath();
  return html`
    <div class="gbar"><i></i><i></i><i></i><i></i></div>
    <div class="app-shell">
      <aside class="sidebar">
        <a class="homelink" href="../">← The record of change</a>
        <div class="brand">Delta Record prototype</div>
        <div class="brand-sub">A small demo of the Delta Record idea. Made-up data only.</div>
        <nav class="nav">
          ${routes.map(([path, label]) => `<a href="#${path}" class="${current === path ? 'active' : ''}" data-link>${label}</a>`).join('')}
        </nav>
        <div class="footer-note">
          A local research prototype. It doesn’t diagnose, treat, prevent or cure anything.
        </div>
      </aside>
      <main class="main">${content}</main>
    </div>
  `;
}

function safetyNotice() {
  return html`
    <div class="notice warn">
      <strong>Safety boundary</strong>
      <ul class="list">
        ${buildGlobalSafetyNotice().map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
      </ul>
    </div>
  `;
}

function renderHome() {
  return html`
    <section class="hero">
      <div class="kicker">Phase 0 · a working sketch</div>
      <h1>The medical record remembers what happened. The Delta Record remembers what was tried.</h1>
      <p class="lede">One idea, made concrete. When someone tries to improve their health, write the attempt down: why this action, how you’ll know if it helped, what actually happened, how unsure you still are, and what to do next.</p>
    </section>
    ${safetyNotice()}
    <section class="grid">
      <div class="card big">
        <h2>What this is</h2>
        <p>One loop, run from the patient’s side. Start with a made-up profile, rank a handful of evidence-backed actions, pick one, log what happens over a few weeks, and end up with a summary you could hand a clinician.</p>
      </div>
      <div class="card big">
        <h2>What this is not</h2>
        <p>It is not a doctor, a diagnosis, an emergency service, a treatment recommender, a pill manager or a longevity score. It’s a prototype, running on demo data.</p>
      </div>
      <div class="card big">
        <h2>The core loop</h2>
        <p>Where things stand → a possible action → how to measure it → what actually moved → how sure we are → what next.</p>
      </div>
    </section>
    <section class="card big" style="margin-top:16px">
      <h2>Why bother</h2>
      <p>Advice is everywhere. What’s rare is keeping honest track of whether acting on it changed anything. So this stays small on purpose. Get the Delta Record right first, then worry about real records, clinicians and whole health systems.</p>
      <div class="button-row">
        <a class="btn" href="/state" data-link>See the demo health state</a>
        <a class="btn secondary" href="/evidence-safety" data-link>Evidence and safety</a>
        <a class="btn ghost" href="../">Read the strategy brief</a>
      </div>
    </section>
  `;
}

function renderState() {
  const domainMap = new Map();
  demoProfile.signals.forEach((signal) => {
    if (!domainMap.has(signal.domain)) domainMap.set(signal.domain, []);
    domainMap.get(signal.domain).push(signal);
  });
  return html`
    <section class="hero">
      <div class="kicker">Where things stand</div>
      <h1>What we actually know</h1>
      <p class="lede">The profile is invented. The point is to show how the quality of the data, plus what the person wants and can manage, ends up shaping which action makes sense next.</p>
    </section>
    <div class="grid">
      <div class="card">
        <h2>${escapeHtml(demoProfile.displayName)}</h2>
        <p>${escapeHtml(demoProfile.description)}</p>
        <h3>Goals</h3>
        <ul class="list">${demoProfile.goals.map((goal) => `<li>${escapeHtml(goal)}</li>`).join('')}</ul>
      </div>
      <div class="card">
        <h2>Preferences and constraints</h2>
        <ul class="list">${[...demoProfile.preferences, ...demoProfile.constraints].map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
      </div>
      <div class="card">
        <h2>Safety considerations</h2>
        <ul class="list">${demoProfile.safetyConsiderations.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
      </div>
    </div>
    <section class="stack" style="margin-top:16px">
      ${Array.from(domainMap.entries()).map(([domain, signals]) => html`
        <div class="card">
          <div class="row">
            <h2>${escapeHtml(domain.replaceAll('-', ' '))}</h2>
            ${badge(`${signals.length} signal${signals.length === 1 ? '' : 's'}`)}
          </div>
          <table class="table">
            <thead><tr><th>Signal</th><th>Value</th><th>Quality</th><th>Note</th></tr></thead>
            <tbody>
              ${signals.map((signal) => html`
                <tr>
                  <td>${escapeHtml(signal.label)}</td>
                  <td><strong>${escapeHtml(signal.value)} ${escapeHtml(signal.unit)}</strong></td>
                  <td>${badge(signal.dataQuality, signal.dataQuality === 'fresh' ? 'ok' : 'warn')}</td>
                  <td class="meta">${escapeHtml(signal.note)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `).join('')}
    </section>
    <div class="button-row">
      <a class="btn" href="/interventions" data-link>Rank the possible actions</a>
    </div>
  `;
}

function scoreGrid(candidate) {
  return html`
    <div class="score-grid">
      ${Object.entries(candidate.scoreComponents).map(([key, value]) => html`
        <div class="score-item"><span>${escapeHtml(key)}</span><strong>${escapeHtml(value)}</strong></div>
      `).join('')}
    </div>
  `;
}

function interventionCard(candidate, index) {
  const intervention = candidate.intervention;
  const mode = actionMode(intervention);
  const canStart = candidate.canStartPatientOwnedCycle;
  const evidenceBadgeType = intervention.evidence.level === 'high' ? 'ok' : intervention.evidence.level === 'moderate' ? 'warn' : 'danger';
  return html`
    <article class="card big">
      <div class="row">
        <div>
          <div class="kicker">Rank ${index + 1} · score ${candidate.score}</div>
          <h2>${escapeHtml(intervention.title)}</h2>
        </div>
        <div>${badge(intervention.evidence.level + ' evidence', evidenceBadgeType)} ${badge(mode, intervention.clinicianRequired ? 'warn' : 'ok')}</div>
      </div>
      <p>${escapeHtml(intervention.shortDescription)}</p>
      <p><strong>Patient-facing action:</strong> ${escapeHtml(intervention.patientFacingAction)}</p>
      <p class="meta"><strong>Safety status:</strong> ${escapeHtml(safetyStatus(intervention))}</p>
      <details>
        <summary>Why it landed here</summary>
        <ul class="list">${candidate.rationale.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
        ${scoreGrid(candidate)}
      </details>
      <details>
        <summary>How to measure it, and when to stop</summary>
        <p><strong>Review after:</strong> ${intervention.measurementPlan.reviewAfterDays} days</p>
        <p><strong>Success signal:</strong> ${escapeHtml(intervention.measurementPlan.successSignal)}</p>
        <p><strong>Stop or escalate if:</strong> ${escapeHtml(intervention.measurementPlan.stopOrEscalateIf)}</p>
      </details>
      <div class="button-row">
        <button class="btn" data-start-cycle="${intervention.id}" ${canStart ? '' : 'disabled'}>${escapeHtml(patientActionLabel(intervention))}</button>
        ${!canStart ? `<a class="btn secondary" href="/clinician-summary" data-link>Take it to a clinician instead</a>` : ''}
      </div>
    </article>
  `;
}

function renderInterventions() {
  return html`
    <section class="hero">
      <div class="kicker">The options</div>
      <h1>Ranked actions, not vague advice</h1>
      <p class="lede">The score is open to inspection, and it is not clinically validated. It is here to show the working: how evidence, fit, effort, safety and how soon you’d learn anything all pull on the order.</p>
    </section>
    <div class="notice">
      <strong>One distinction up front:</strong> some of these you can run yourself as a tracking cycle. Others are tied to a clinician, and all they should do here is help you prepare for a conversation or a review.
    </div>
    <section class="stack">
      ${candidates.map(interventionCard).join('')}
    </section>
  `;
}

function getActiveCycleBundle() {
  const cycle = storage.get('activeCycle');
  if (!cycle) return null;
  const intervention = interventions.find((item) => item.id === cycle.interventionId);
  const candidate = candidates.find((item) => item.intervention.id === cycle.interventionId);
  return { cycle, intervention, candidate };
}

function renderCycle() {
  const bundle = getActiveCycleBundle();
  if (!bundle) {
    const top = candidates.find((candidate) => candidate.canStartPatientOwnedCycle);
    return html`
      <section class="hero">
        <div class="kicker">Delta cycle</div>
        <h1>Nothing running yet</h1>
        <p class="lede">Pick one action you can own. The idea is to learn from a single attempt, not to fix everything at once.</p>
      </section>
      <div class="card big">
        <h2>A sensible first one</h2>
        <p><strong>${escapeHtml(top.intervention.title)}</strong></p>
        <p>${escapeHtml(top.intervention.patientFacingAction)}</p>
        <div class="button-row"><button class="btn" data-start-cycle="${top.intervention.id}">Start this one</button><a class="btn secondary" href="/interventions" data-link>Pick a different one</a></div>
      </div>
    `;
  }
  const { cycle, intervention } = bundle;
  return html`
    <section class="hero">
      <div class="kicker">Active Delta Cycle</div>
      <h1>${escapeHtml(intervention.title)}</h1>
      <p class="lede">This is the attempt, written down: what you’re trying, how it gets measured, and when to come back and look.</p>
    </section>
    <div class="grid">
      <div class="card">
        <h2>Action</h2>
        <p>${escapeHtml(intervention.patientFacingAction)}</p>
        <p>${badge(actionMode(intervention), intervention.clinicianRequired ? 'warn' : 'ok')}</p>
      </div>
      <div class="card">
        <h2>Timing</h2>
        <p><strong>Started:</strong> ${escapeHtml(cycle.startDate)}</p>
        <p><strong>Planned review:</strong> ${escapeHtml(cycle.plannedReviewDate)}</p>
      </div>
      <div class="card">
        <h2>Evidence</h2>
        <p>${badge(intervention.evidence.level + ' evidence', intervention.evidence.level === 'high' ? 'ok' : 'warn')}</p>
        <p class="meta">${escapeHtml(intervention.evidence.summary)}</p>
      </div>
    </div>
    <div class="card big" style="margin-top:16px">
      <h2>Measurement plan</h2>
      <h3>Baseline</h3>
      <ul class="list">${intervention.measurementPlan.baselineMeasures.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
      <h3>Follow-up</h3>
      <ul class="list">${intervention.measurementPlan.followUpMeasures.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
      <div class="notice warn"><strong>Stop/escalate if:</strong> ${escapeHtml(intervention.measurementPlan.stopOrEscalateIf)}</div>
      <div class="button-row"><a class="btn" href="/track" data-link>Log what happened</a><button class="btn ghost" data-reset-cycle>Start over</button></div>
    </div>
  `;
}

function renderTrack() {
  const bundle = getActiveCycleBundle();
  if (!bundle) return renderCycle();
  const saved = storage.get('observations') || sampleObservationsFor(bundle.intervention.id);
  return html`
    <section class="hero">
      <div class="kicker">Tracking</div>
      <h1>Write down what actually happened</h1>
      <p class="lede">For now these are demo numbers. In a real version this is where typed-in notes, wearable data and, later on, proper integrations would all meet.</p>
    </section>
    <div class="card big">
      <h2>${escapeHtml(bundle.intervention.title)}</h2>
      <p class="meta">Aim for useful follow-up, not airtight proof.</p>
      <div class="button-row">
        <button class="btn" data-load-sample>Load sample observations</button>
        <button class="btn secondary" data-save-observations>Save observations</button>
      </div>
      <div class="form-grid">
        <label>Exposure/adherence observations<textarea id="exposureInput" rows="7">${escapeHtml(JSON.stringify(saved.exposure, null, 2))}</textarea></label>
        <label>Outcome observations<textarea id="outcomesInput" rows="7">${escapeHtml(JSON.stringify(saved.outcomes, null, 2))}</textarea></label>
      </div>
      <div class="button-row"><a class="btn" href="/review" data-link>See what changed</a></div>
    </div>
  `;
}

function buildRecordFromStorage() {
  const bundle = getActiveCycleBundle();
  if (!bundle) return null;
  const observations = storage.get('observations') || sampleObservationsFor(bundle.intervention.id);
  const record = createDeltaRecord(demoProfile, bundle.intervention, bundle.cycle, observations.exposure, observations.outcomes, { shareScope: 'care-team' });
  storage.set('latestRecord', record);
  return { ...bundle, observations, record };
}

function renderReview() {
  const bundle = buildRecordFromStorage();
  if (!bundle) return renderCycle();
  const { record, intervention } = bundle;
  return html`
    <section class="hero">
      <div class="kicker">Delta review</div>
      <h1>What changed?</h1>
      <p class="lede">The confidence label stays cautious on purpose. Something useful happening is not the same as the action being the reason.</p>
    </section>
    <div class="grid">
      <div class="card">
        <h2>Attribution confidence</h2>
        <p>${badge(record.attribution.confidence, record.attribution.confidence === 'plausible' ? 'ok' : 'warn')}</p>
        <p>${escapeHtml(record.attribution.plainEnglish)}</p>
      </div>
      <div class="card">
        <h2>Next action</h2>
        <p>${escapeHtml(record.nextAction)}</p>
      </div>
      <div class="card">
        <h2>Evidence prior</h2>
        <p>${badge(intervention.evidence.level + ' evidence', intervention.evidence.level === 'high' ? 'ok' : 'warn')}</p>
        <p class="meta">${escapeHtml(intervention.evidence.summary)}</p>
      </div>
    </div>
    <section class="grid" style="margin-top:16px">
      <div class="card">
        <h2>Exposure</h2>
        <ul class="list">${record.exposure.map((obs) => `<li><strong>${escapeHtml(obs.label)}:</strong> ${escapeHtml(obs.value)} ${escapeHtml(obs.unit)}. <span class="meta">${escapeHtml(obs.note)}</span></li>`).join('')}</ul>
      </div>
      <div class="card">
        <h2>Outcomes</h2>
        <ul class="list">${record.outcomes.map((obs) => `<li><strong>${escapeHtml(obs.label)}:</strong> ${escapeHtml(obs.value)} ${escapeHtml(obs.unit)}. <span class="meta">${escapeHtml(obs.note)}</span></li>`).join('')}</ul>
      </div>
      <div class="card">
        <h2>Safety</h2>
        <ul class="list">${record.safety.map((flag) => `<li>${badge(flag.severity, flag.severity === 'high' ? 'danger' : 'warn')} ${escapeHtml(flag.message)}</li>`).join('')}</ul>
      </div>
    </section>
    <div class="card big" style="margin-top:16px">
      <h2>Why this counts as a Delta Record</h2>
      <p>Everything is here in one place: where things started, the evidence behind the choice, why this action, what was actually done, what moved, how sure we are, the safety flags, what to do next, and who gets to see it.</p>
      <div class="button-row"><a class="btn" href="/clinician-summary" data-link>Make the clinician summary</a></div>
    </div>
  `;
}

function renderClinicianSummary() {
  const bundle = buildRecordFromStorage();
  if (!bundle) return renderCycle();
  const summary = generateClinicianSummary(demoProfile, bundle.intervention, bundle.record);
  return html`
    <section class="hero">
      <div class="kicker">The shareable bit</div>
      <h1>Clinician summary</h1>
      <p class="lede">The first thing a clinician actually sees: a short, honest account of what was tried and what moved. No integration with their systems required.</p>
    </section>
    <div class="notice warn">A demo summary built from made-up data. Don’t use it for real care.</div>
    <pre class="summary">${escapeHtml(summary)}</pre>
    <div class="button-row"><button class="btn secondary" data-copy-summary>Copy it</button></div>
  `;
}

function renderEvidenceSafety() {
  return html`
    <section class="hero">
      <div class="kicker">Evidence and safety</div>
      <h1>Useful early, careful about what it claims</h1>
      <p class="lede">The order matters. Organise and track low-risk things first. Clinician-supervised decisions come much later, once they’ve been earned.</p>
    </section>
    ${safetyNotice()}
    <section class="grid">
      <div class="card big">
        <h2>How evidence is graded</h2>
        <p><strong>The published evidence is the starting point.</strong> A person’s own response tells you whether it fits. Pooled experience across many records is for later, not now.</p>
        <ul class="list">
          <li>High: a strong guideline, trial or settled public-health finding.</li>
          <li>Moderate: useful, but it depends on the context.</li>
          <li>Low: plausible but thin, and shouldn’t outrank something stronger.</li>
          <li>Speculative: not offered as a patient action here at all.</li>
        </ul>
      </div>
      <div class="card big">
        <h2>Where it sits with regulators</h2>
        <p>At this stage it just organises information, supports low-risk habits, and helps you get ready for a conversation. It stays clear of diagnosis, treatment, medication changes, urgent triage and any disease-prevention claim.</p>
      </div>
      <div class="card big">
        <h2>Why not run an experiment on everything?</h2>
        <p>Most care shouldn’t turn into self-experiment. Here we only use routine tracking and a before-and-after look. The more formal methods belong to a narrow set of safe, reversible, measurable questions, handled with proper oversight.</p>
      </div>
    </section>
    <section class="card big" style="margin-top:16px">
      <h2>Implementation path</h2>
      <table class="table">
        <thead><tr><th>Stage</th><th>Surface</th><th>Claim</th></tr></thead>
        <tbody>
          <tr><td>0</td><td>Patient-owned demo</td><td>Organise, prioritise, track and prepare conversations.</td></tr>
          <tr><td>1</td><td>Patient product</td><td>Evidence-informed low-risk health actions with explicit safety boundaries.</td></tr>
          <tr><td>2</td><td>Clinician pack</td><td>Better intake, follow-up and adherence visibility.</td></tr>
          <tr><td>3</td><td>Clinician-supervised decision support</td><td>Requires clinical safety case, evaluation and likely regulatory pathway.</td></tr>
          <tr><td>4</td><td>Population learning</td><td>Governed aggregate learning about what works for whom.</td></tr>
        </tbody>
      </table>
    </section>
  `;
}

function renderDeepmind() {
  const T = deltaThesis;
  return html`
    <section class="hero">
      <div class="kicker">The argument</div>
      <h1>${escapeHtml(T.hero.headline)}</h1>
      <p class="lede">${escapeHtml(T.hero.sub)}</p>
    </section>
    <div class="card big accent">
      <h2>The full case lives in the strategy brief</h2>
      <p>This prototype is the working demo: one attempt, recorded and reviewed. The full written argument, framed for the Google DeepMind Health Impact Accelerator, is the strategy brief.</p>
      <div class="button-row"><a class="btn" href="../">Read the strategy brief</a></div>
    </div>
  `;
}

function routeContent() {
  switch (currentPath()) {
    case '/': return renderHome();
    case '/state': return renderState();
    case '/interventions': return renderInterventions();
    case '/cycle': return renderCycle();
    case '/track': return renderTrack();
    case '/review': return renderReview();
    case '/clinician-summary': return renderClinicianSummary();
    case '/evidence-safety': return renderEvidenceSafety();
    case '/deepmind': return renderDeepmind();
    default: return renderHome();
  }
}

const pageTitles = {
  '/deepmind': `${deltaThesis.meta.title} — Delta Record prototype`
};

function syncPageMeta() {
  document.title = pageTitles[currentPath()] || 'Delta Record prototype';
}

function attachHandlers() {
  document.querySelectorAll('[data-link]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      navigate(link.getAttribute('href').replace(/^#/, ''));
    });
  });

  document.querySelectorAll('[data-start-cycle]').forEach((button) => {
    button.addEventListener('click', () => {
      const id = button.getAttribute('data-start-cycle');
      const candidate = candidates.find((item) => item.intervention.id === id);
      if (!candidate || !candidate.canStartPatientOwnedCycle) return;
      const cycle = createDeltaCycle(demoProfile, candidate);
      storage.set('activeCycle', cycle);
      storage.remove('observations');
      storage.remove('latestRecord');
      navigate('/cycle');
    });
  });

  const reset = document.querySelector('[data-reset-cycle]');
  if (reset) {
    reset.addEventListener('click', () => {
      storage.remove('activeCycle');
      storage.remove('observations');
      storage.remove('latestRecord');
      render();
    });
  }

  const loadSample = document.querySelector('[data-load-sample]');
  if (loadSample) {
    loadSample.addEventListener('click', () => {
      const bundle = getActiveCycleBundle();
      if (!bundle) return;
      const sample = sampleObservationsFor(bundle.intervention.id);
      document.getElementById('exposureInput').value = JSON.stringify(sample.exposure, null, 2);
      document.getElementById('outcomesInput').value = JSON.stringify(sample.outcomes, null, 2);
      storage.set('observations', sample);
    });
  }

  const saveObservations = document.querySelector('[data-save-observations]');
  if (saveObservations) {
    saveObservations.addEventListener('click', () => {
      try {
        const exposure = JSON.parse(document.getElementById('exposureInput').value);
        const outcomes = JSON.parse(document.getElementById('outcomesInput').value);
        storage.set('observations', { exposure, outcomes });
        alert('Observations saved for local demo review.');
      } catch (error) {
        alert(`Could not parse JSON observations: ${error.message}`);
      }
    });
  }

  const copySummary = document.querySelector('[data-copy-summary]');
  if (copySummary) {
    copySummary.addEventListener('click', async () => {
      const text = document.querySelector('pre.summary')?.innerText || '';
      try {
        await navigator.clipboard.writeText(text);
        alert('Summary copied.');
      } catch {
        alert('Copy failed. Select the text manually.');
      }
    });
  }
}

function render() {
  app.innerHTML = layout(routeContent());
  attachHandlers();
  syncPageMeta();
}

render();
