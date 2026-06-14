const evidenceWeight = {
  high: 5,
  moderate: 3.5,
  low: 2,
  speculative: 0
};

const burdenPenalty = {
  low: 0.5,
  medium: 1.5,
  high: 3
};

const riskPenalty = {
  low: 0.5,
  medium: 1.5,
  high: 3
};

const domainBaseRisk = {
  cardiometabolic: 4.5,
  metabolic: 4,
  'functional-reserve': 3.5,
  'sleep-energy': 3,
  'behaviour-context': 2.5,
  'medication-review': 0.5
};

function profileDomainWeight(profile, domain) {
  const hasSignal = profile.signals.some((signal) => signal.domain === domain);
  const base = domainBaseRisk[domain] ?? 1;
  const preferenceBoost = profile.preferences.some((preference) => preference.toLowerCase().includes('simple')) ? 0.2 : 0;
  return hasSignal ? base + preferenceBoost : base * 0.5;
}

function timeToFeedbackBonus(days) {
  if (days <= 7) return 1.4;
  if (days <= 21) return 1;
  if (days <= 30) return 0.8;
  return 0.4;
}

function preferenceFit(profile, intervention) {
  let score = 0;
  const text = `${intervention.shortDescription} ${intervention.patientFacingAction}`.toLowerCase();
  if (text.includes('low-friction') || text.includes('simple') || text.includes('small')) score += 0.7;
  if (profile.constraints.some((constraint) => constraint.toLowerCase().includes('knee')) && text.includes('walk')) score -= 0.3;
  if (profile.constraints.some((constraint) => constraint.toLowerCase().includes('anxious')) && text.includes('track')) score -= 0.2;
  if (intervention.clinicianRequired) score += 0.3;
  return score;
}

function relevance(profile, intervention) {
  if (!intervention.targetDomains.length) return 0;
  const raw = intervention.targetDomains.reduce((sum, domain) => sum + profileDomainWeight(profile, domain), 0);
  return raw / intervention.targetDomains.length;
}

export function scoreIntervention(profile, intervention) {
  const components = {
    evidence: evidenceWeight[intervention.evidence.level] ?? 0,
    relevance: relevance(profile, intervention),
    modifiability: intervention.modifiability,
    feasibility: intervention.feasibility,
    timeToFeedback: timeToFeedbackBonus(intervention.measurementPlan.reviewAfterDays),
    preferenceFit: preferenceFit(profile, intervention),
    burdenPenalty: -burdenPenalty[intervention.burden],
    safetyPenalty: -riskPenalty[intervention.risk],
    clinicianLinkValue: intervention.clinicianRequired ? -0.1 : 0
  };

  const score =
    components.evidence * 1.4 +
    components.relevance * 1.1 +
    components.modifiability * 0.8 +
    components.feasibility * 0.8 +
    components.timeToFeedback +
    components.preferenceFit +
    components.burdenPenalty +
    components.safetyPenalty +
    components.clinicianLinkValue;

  return Number(score.toFixed(2));
}

export function buildRationale(profile, intervention, scoreComponents) {
  const rationale = [];
  if (scoreComponents.evidence >= 5) {
    rationale.push('Solid evidence behind this one, so it’s a fair place to start.');
  } else if (scoreComponents.evidence >= 3.5) {
    rationale.push('Decent evidence. Worth it if it fits the person and you can actually measure it.');
  } else {
    rationale.push('Weaker evidence, so it shouldn’t push ahead of stronger options.');
  }

  if (scoreComponents.relevance >= 3.5) {
    rationale.push('It lines up with signals already in the profile.');
  }

  if (intervention.feasibility >= 4) {
    rationale.push('Should be doable without rebuilding the person’s whole life.');
  }

  if (intervention.clinicianRequired) {
    rationale.push('Clinician-linked: you can prepare the information, but the clinical calls need a professional.');
  } else {
    rationale.push('Safe enough to run yourself, inside the limits shown.');
  }

  if (profile.constraints.some((constraint) => constraint.toLowerCase().includes('anxious'))) {
    rationale.push('Keep the tracking light here, since this profile tips into over-tracking.');
  }

  return rationale;
}

export function buildCandidates(profile, interventions) {
  return interventions
    .map((intervention) => {
      const score = scoreIntervention(profile, intervention);
      const scoreComponents = {
        evidence: evidenceWeight[intervention.evidence.level] ?? 0,
        relevance: Number(relevance(profile, intervention).toFixed(2)),
        modifiability: intervention.modifiability,
        feasibility: intervention.feasibility,
        timeToFeedback: timeToFeedbackBonus(intervention.measurementPlan.reviewAfterDays),
        preferenceFit: Number(preferenceFit(profile, intervention).toFixed(2)),
        burdenPenalty: -burdenPenalty[intervention.burden],
        safetyPenalty: -riskPenalty[intervention.risk],
        clinicianLinkValue: intervention.clinicianRequired ? -0.1 : 0
      };
      return {
        intervention,
        score,
        scoreComponents,
        rationale: buildRationale(profile, intervention, scoreComponents),
        safetyNotes: intervention.redFlags,
        canStartPatientOwnedCycle: !intervention.clinicianRequired && intervention.evidence.level !== 'speculative'
      };
    })
    .sort((a, b) => b.score - a.score || a.intervention.title.localeCompare(b.intervention.title));
}

export function getTopPatientOwnedCandidate(profile, interventions) {
  return buildCandidates(profile, interventions).find((candidate) => candidate.canStartPatientOwnedCycle);
}
