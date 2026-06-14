import { collectSafetyFlags } from './safety.js';
import { validateDeltaRecord } from './validators.js';

function isoDate(offsetDays = 0) {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return date.toISOString().slice(0, 10);
}

function makeId(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}-${Date.now().toString(36)}`;
}

export function baselineForIntervention(profile, intervention) {
  return profile.signals.filter((signal) => intervention.targetDomains.includes(signal.domain));
}

export function createDeltaCycle(profile, candidate, options = {}) {
  const intervention = candidate.intervention;
  if (intervention.clinicianRequired && !options.allowClinicianPreparationCycle) {
    throw new Error('Clinician-required interventions cannot be started as patient-owned cycles');
  }
  const startDate = options.startDate || isoDate(0);
  return {
    id: makeId('cycle'),
    personId: profile.id,
    interventionId: intervention.id,
    status: 'active',
    startDate,
    plannedReviewDate: options.plannedReviewDate || isoDate(intervention.measurementPlan.reviewAfterDays),
    baseline: baselineForIntervention(profile, intervention),
    rationale: candidate.rationale,
    measurementPlan: intervention.measurementPlan,
    shareScope: options.shareScope || 'private'
  };
}

function numericValue(observation) {
  if (typeof observation.value === 'number') return observation.value;
  const parsed = Number.parseFloat(String(observation.value));
  return Number.isNaN(parsed) ? null : parsed;
}

function adherenceFromObservations(observations) {
  const adherence = observations.find((observation) => /adherence|completion|completed|walks|sessions/i.test(observation.label));
  const value = adherence ? numericValue(adherence) : null;
  if (value === null) return null;
  if (value <= 1) return value * 100;
  return value;
}

function hasAnyOutcomeSignal(outcomes) {
  return outcomes.some((observation) => {
    const note = `${observation.label} ${observation.note}`.toLowerCase();
    return /improved|lower|higher|more consistent|better|reduced|usable|completed|average|trend/i.test(note);
  });
}

export function assessAttribution(cycle, intervention, exposure, outcomes) {
  const reasons = [];
  const adherence = adherenceFromObservations(exposure);

  if (!outcomes.length) {
    return {
      confidence: 'insufficient',
      plainEnglish: 'Not enough follow-up yet to say whether anything moved.',
      reasons: ['No outcome observations were logged.']
    };
  }

  if (adherence !== null) {
    reasons.push(`They stuck to it roughly ${Math.round(adherence)}% of the time.`);
  } else {
    reasons.push('Adherence wasn’t logged clearly, so there is only so much you can read into this.');
  }

  if (hasAnyOutcomeSignal(outcomes)) {
    reasons.push('At least one follow-up measure moved, or gave something useful, inside the review window.');
  } else {
    reasons.push('Nothing in the follow-up has clearly moved yet.');
  }

  reasons.push('None of this is proof. It is a cautious read of timing, how much got done, and whether the story hangs together.');

  if (adherence !== null && adherence >= 70 && hasAnyOutcomeSignal(outcomes) && intervention.learningDesign === 'before-after-review') {
    return {
      confidence: 'plausible',
      plainEnglish: 'The change plausibly tracks the action, but this still isn’t a controlled result.',
      reasons
    };
  }

  if (adherence !== null && adherence >= 50 && hasAnyOutcomeSignal(outcomes)) {
    return {
      confidence: 'temporal',
      plainEnglish: 'Something useful shifted after the action. Whether the action did it is another matter.',
      reasons
    };
  }

  return {
    confidence: 'anecdotal',
    plainEnglish: 'Handy for follow-up, but don’t read it as the action being the reason.',
    reasons
  };
}

export function nextActionFromRecord(intervention, attribution, safetyFlags) {
  const highSafety = safetyFlags.some((flag) => flag.severity === 'high' || flag.requiresClinician);
  if (highSafety) {
    return 'Stop pushing this on your own and get a clinician to look. Take the summary and your notes with you.';
  }
  if (intervention.clinicianRequired) {
    return 'Use this to tee up a chat with a clinician or pharmacist. Don’t change anything clinical without their say-so.';
  }
  if (attribution.confidence === 'plausible') {
    return 'If it’s still manageable, carry on, track it lightly, and decide at the next review whether to hold or push a little further.';
  }
  if (attribution.confidence === 'temporal') {
    return 'Only run it again if it’s low-risk and still realistic. Otherwise rework the action before piling on more tracking.';
  }
  if (attribution.confidence === 'insufficient') {
    return 'Go and get the missing follow-up before deciding whether it helped.';
  }
  return 'Redesign around whatever got in the way, rather than just adding another suggestion.';
}

export function createDeltaRecord(profile, intervention, cycle, exposure = [], outcomes = [], options = {}) {
  const attribution = assessAttribution(cycle, intervention, exposure, outcomes);
  const safety = collectSafetyFlags(intervention, [...exposure, ...outcomes]);
  const nextAction = nextActionFromRecord(intervention, attribution, safety);
  const record = {
    id: makeId('record'),
    personId: profile.id,
    interventionId: intervention.id,
    createdAt: options.createdAt || new Date().toISOString(),
    baseline: cycle.baseline,
    priorEvidence: intervention.evidence,
    rationale: cycle.rationale,
    interventionSummary: intervention.patientFacingAction,
    exposure,
    outcomes,
    attribution,
    safety,
    nextAction,
    shareScope: options.shareScope || cycle.shareScope || 'private'
  };
  return validateDeltaRecord(record);
}

export function sampleObservationsFor(interventionId) {
  const today = isoDate(0);
  if (interventionId === 'home-bp-monitoring') {
    return {
      exposure: [
        { id: 'obs-bp-complete', label: 'Completion', value: 86, unit: '% of planned readings', date: today, note: 'Completed most planned readings across 7 days.' }
      ],
      outcomes: [
        { id: 'obs-bp-average', label: 'Home BP average', value: '134/84', unit: 'mmHg', date: today, note: 'Usable average created for clinician discussion; not a diagnosis.' }
      ]
    };
  }
  if (interventionId === 'walking-after-meals') {
    return {
      exposure: [
        { id: 'obs-walk-complete', label: 'Walk completion', value: 78, unit: '% of planned walks', date: today, note: 'Mostly completed; knee discomfort stayed mild.' }
      ],
      outcomes: [
        { id: 'obs-steps', label: 'Average daily steps', value: 5200, unit: 'steps/day', date: today, note: 'Higher than baseline trend.' },
        { id: 'obs-energy', label: 'Energy rating', value: 6, unit: '/10', date: today, note: 'Improved from self-rated 5/10 baseline.' }
      ]
    };
  }
  if (interventionId === 'sleep-regularity') {
    return {
      exposure: [
        { id: 'obs-wake-time', label: 'Wake time consistency', value: 65, unit: '% of days', date: today, note: 'More consistent on weekdays; weekends still variable.' }
      ],
      outcomes: [
        { id: 'obs-energy-sleep', label: 'Energy rating', value: 6, unit: '/10', date: today, note: 'Slightly better, but evidence remains temporal and uncertain.' }
      ]
    };
  }
  return {
    exposure: [
      { id: 'obs-generic-completion', label: 'Adherence', value: 60, unit: '%', date: today, note: 'Partially completed.' }
    ],
    outcomes: [
      { id: 'obs-generic-outcome', label: 'Follow-up note', value: 'mixed', unit: 'note', date: today, note: 'Some useful information, but no clear causal conclusion.' }
    ]
  };
}
