export function assertObject(value, name) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`${name} must be an object`);
  }
}

export function assertString(value, name) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`${name} must be a non-empty string`);
  }
}

export function assertNumber(value, name, min = Number.NEGATIVE_INFINITY, max = Number.POSITIVE_INFINITY) {
  if (typeof value !== 'number' || Number.isNaN(value) || value < min || value > max) {
    throw new Error(`${name} must be a number between ${min} and ${max}`);
  }
}

export function assertArray(value, name) {
  if (!Array.isArray(value)) {
    throw new Error(`${name} must be an array`);
  }
}

const allowedEvidence = new Set(['high', 'moderate', 'low', 'speculative']);
const allowedBurden = new Set(['low', 'medium', 'high']);
const allowedRisk = new Set(['low', 'medium', 'high']);
const allowedLearning = new Set([
  'routine-tracking',
  'before-after-review',
  'clinician-supervised-review',
  'n-of-1-not-phase-0'
]);

export function validatePersonProfile(profile) {
  assertObject(profile, 'PersonProfile');
  assertString(profile.id, 'PersonProfile.id');
  assertString(profile.displayName, 'PersonProfile.displayName');
  assertArray(profile.goals, 'PersonProfile.goals');
  assertArray(profile.preferences, 'PersonProfile.preferences');
  assertArray(profile.constraints, 'PersonProfile.constraints');
  assertArray(profile.safetyConsiderations, 'PersonProfile.safetyConsiderations');
  assertArray(profile.signals, 'PersonProfile.signals');
  profile.signals.forEach((signal, index) => validateHealthSignal(signal, `PersonProfile.signals[${index}]`));
  return profile;
}

export function validateHealthSignal(signal, name = 'HealthSignal') {
  assertObject(signal, name);
  assertString(signal.id, `${name}.id`);
  assertString(signal.label, `${name}.label`);
  assertString(signal.domain, `${name}.domain`);
  assertString(signal.unit, `${name}.unit`);
  assertString(signal.dataQuality, `${name}.dataQuality`);
  return signal;
}

export function validateIntervention(intervention) {
  assertObject(intervention, 'Intervention');
  assertString(intervention.id, 'Intervention.id');
  assertString(intervention.title, 'Intervention.title');
  assertArray(intervention.targetDomains, 'Intervention.targetDomains');
  if (!intervention.evidence || !allowedEvidence.has(intervention.evidence.level)) {
    throw new Error(`Intervention ${intervention.id} must have a valid evidence level`);
  }
  if (!allowedBurden.has(intervention.burden)) {
    throw new Error(`Intervention ${intervention.id} has invalid burden`);
  }
  if (!allowedRisk.has(intervention.risk)) {
    throw new Error(`Intervention ${intervention.id} has invalid risk`);
  }
  assertNumber(intervention.feasibility, 'Intervention.feasibility', 1, 5);
  assertNumber(intervention.modifiability, 'Intervention.modifiability', 1, 5);
  if (typeof intervention.clinicianRequired !== 'boolean') {
    throw new Error(`Intervention ${intervention.id} clinicianRequired must be boolean`);
  }
  if (!allowedLearning.has(intervention.learningDesign)) {
    throw new Error(`Intervention ${intervention.id} has invalid learning design`);
  }
  assertObject(intervention.measurementPlan, 'Intervention.measurementPlan');
  assertArray(intervention.measurementPlan.baselineMeasures, 'Intervention.measurementPlan.baselineMeasures');
  assertArray(intervention.measurementPlan.followUpMeasures, 'Intervention.measurementPlan.followUpMeasures');
  assertNumber(intervention.measurementPlan.reviewAfterDays, 'Intervention.measurementPlan.reviewAfterDays', 1, 365);
  assertString(intervention.patientFacingAction, 'Intervention.patientFacingAction');
  return intervention;
}

export function validateInterventions(interventions) {
  assertArray(interventions, 'interventions');
  interventions.forEach(validateIntervention);
  return interventions;
}

export function validateDeltaRecord(record) {
  assertObject(record, 'DeltaRecord');
  assertString(record.id, 'DeltaRecord.id');
  assertString(record.personId, 'DeltaRecord.personId');
  assertString(record.interventionId, 'DeltaRecord.interventionId');
  assertArray(record.baseline, 'DeltaRecord.baseline');
  assertObject(record.priorEvidence, 'DeltaRecord.priorEvidence');
  assertArray(record.rationale, 'DeltaRecord.rationale');
  assertString(record.interventionSummary, 'DeltaRecord.interventionSummary');
  assertArray(record.exposure, 'DeltaRecord.exposure');
  assertArray(record.outcomes, 'DeltaRecord.outcomes');
  assertObject(record.attribution, 'DeltaRecord.attribution');
  assertArray(record.safety, 'DeltaRecord.safety');
  assertString(record.nextAction, 'DeltaRecord.nextAction');
  assertString(record.shareScope, 'DeltaRecord.shareScope');
  return record;
}
