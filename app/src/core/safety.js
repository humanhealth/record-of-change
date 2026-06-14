const forbiddenDirectActionPhrases = [
  'start medication',
  'stop medication',
  'change medication',
  'treat your disease',
  'diagnose you',
  'diagnosis is',
  'you have ',
  'prevent your disease',
  'will prevent',
  'cure',
  'guaranteed',
  'adds years',
  'add years',
  'live longer by',
  'biological age',
  'age-reversal guarantee',
  'ai doctor'
];

export function actionMode(intervention) {
  return intervention.clinicianRequired ? 'clinician-linked' : 'patient-owned';
}

export function patientActionLabel(intervention) {
  if (intervention.clinicianRequired) {
    return 'Prepare for clinician review';
  }
  return 'Start patient-owned Delta Cycle';
}

export function safetyStatus(intervention) {
  if (intervention.clinicianRequired) {
    return 'Needs a clinician. You can gather your questions and notes, but this isn’t something to act on alone.';
  }
  if (intervention.risk === 'medium') {
    return 'You can run this one yourself, but only within the stop conditions, and build up slowly.';
  }
  return 'Low-risk to run yourself, with the red flags still in plain sight.';
}

export function assertNoForbiddenMedicalClaims(text, context = 'text') {
  const lower = String(text).toLowerCase();
  const hit = forbiddenDirectActionPhrases.find((phrase) => lower.includes(phrase));
  if (hit) {
    throw new Error(`${context} contains forbidden claim or phrase: ${hit}`);
  }
  const exactYears = /\b(adds?|gain|extend|increase)\s+\d+(\.\d+)?\s+(healthy\s+)?years?\b/i;
  if (exactYears.test(text)) {
    throw new Error(`${context} contains exact healthspan/lifespan-year claim`);
  }
  return true;
}

export function assertInterventionSafeForDisplay(intervention) {
  assertNoForbiddenMedicalClaims(intervention.patientFacingAction, `${intervention.id}.patientFacingAction`);
  if (intervention.clinicianRequired && /start patient-owned|self-directed treatment|take this treatment/i.test(intervention.patientFacingAction)) {
    throw new Error(`${intervention.id} is clinician-required but framed as self-directed treatment`);
  }
  return true;
}

export function buildGlobalSafetyNotice() {
  return [
    'This prototype doesn’t diagnose, treat, prevent or cure anything.',
    'What it does: organise information, help you pick a low-risk, evidence-backed action, and get you ready for a clinician.',
    'Don’t start, stop or change any medication on the back of it.',
    'For sudden, severe or frightening symptoms, get urgent medical help.'
  ];
}

export function collectSafetyFlags(intervention, observations = []) {
  const flags = intervention.redFlags.map((message) => ({
    severity: message.toLowerCase().includes('urgent') || message.toLowerCase().includes('severe') ? 'high' : 'medium',
    message,
    requiresClinician: intervention.clinicianRequired || /urgent|severe|clinician|medical/i.test(message)
  }));

  observations.forEach((observation) => {
    const note = `${observation.label} ${observation.note}`.toLowerCase();
    if (/chest pain|faint|stroke|severe|urgent|worsening/i.test(note)) {
      flags.push({
        severity: 'high',
        message: `Observation needs clinician review: ${observation.label}`,
        requiresClinician: true
      });
    }
  });

  return flags;
}
