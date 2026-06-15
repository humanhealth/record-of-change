/**
 * Domain model reference for the record-of-change prototype.
 * These are JSDoc typedefs so the repo runs without a TypeScript build step.
 * A future Next.js/TypeScript version can lift these into .ts interfaces.
 */

/** @typedef {'high'|'moderate'|'low'|'speculative'} EvidenceLevel */
/** @typedef {'guideline'|'rct'|'meta-analysis'|'observational'|'consensus'|'user-preference'|'unknown'} EvidenceSourceType */
/** @typedef {'low'|'medium'|'high'} BurdenLevel */
/** @typedef {'low'|'medium'|'high'} RiskLevel */
/** @typedef {'private'|'care-team'|'consented-research'|'aggregate-only'} ShareScope */
/** @typedef {'routine-tracking'|'before-after-review'|'clinician-supervised-review'|'n-of-1-not-phase-0'} LearningDesign */
/** @typedef {'insufficient'|'anecdotal'|'temporal'|'plausible'|'repeated-signal'|'controlled'} AttributionConfidence */

/**
 * @typedef {Object} HealthSignal
 * @property {string} id
 * @property {string} label
 * @property {string} domain
 * @property {number|string} value
 * @property {string} unit
 * @property {'fresh'|'needs-confirmation'|'stale'|'self-reported'} dataQuality
 * @property {string} note
 */

/**
 * @typedef {Object} PersonProfile
 * @property {string} id
 * @property {string} displayName
 * @property {string} description
 * @property {string[]} goals
 * @property {string[]} preferences
 * @property {string[]} constraints
 * @property {string[]} safetyConsiderations
 * @property {HealthSignal[]} signals
 */

/**
 * @typedef {Object} EvidenceSource
 * @property {EvidenceSourceType} sourceType
 * @property {EvidenceLevel} level
 * @property {string} summary
 * @property {string} citationLabel
 */

/**
 * @typedef {Object} MeasurementPlan
 * @property {string[]} baselineMeasures
 * @property {string[]} followUpMeasures
 * @property {number} reviewAfterDays
 * @property {string} successSignal
 * @property {string} stopOrEscalateIf
 */

/**
 * @typedef {Object} Intervention
 * @property {string} id
 * @property {string} title
 * @property {string} shortDescription
 * @property {string[]} targetDomains
 * @property {EvidenceSource} evidence
 * @property {BurdenLevel} burden
 * @property {RiskLevel} risk
 * @property {number} feasibility
 * @property {number} modifiability
 * @property {boolean} clinicianRequired
 * @property {string[]} redFlags
 * @property {LearningDesign} learningDesign
 * @property {MeasurementPlan} measurementPlan
 * @property {string} patientFacingAction
 * @property {string} clinicianFacingNote
 */

/**
 * @typedef {Object} InterventionCandidate
 * @property {Intervention} intervention
 * @property {number} score
 * @property {Object.<string, number>} scoreComponents
 * @property {string[]} rationale
 * @property {string[]} safetyNotes
 * @property {boolean} canStartPatientOwnedCycle
 */

/**
 * @typedef {Object} Observation
 * @property {string} id
 * @property {string} label
 * @property {string|number} value
 * @property {string} unit
 * @property {string} date
 * @property {string} note
 */

/**
 * @typedef {Object} DeltaCycle
 * @property {string} id
 * @property {string} personId
 * @property {string} interventionId
 * @property {string} status
 * @property {string} startDate
 * @property {string} plannedReviewDate
 * @property {HealthSignal[]} baseline
 * @property {string[]} rationale
 * @property {MeasurementPlan} measurementPlan
 * @property {ShareScope} shareScope
 */

/**
 * @typedef {Object} AttributionAssessment
 * @property {AttributionConfidence} confidence
 * @property {string} plainEnglish
 * @property {string[]} reasons
 */

/**
 * @typedef {Object} SafetyFlag
 * @property {string} severity
 * @property {string} message
 * @property {boolean} requiresClinician
 */

/**
 * @typedef {Object} DeltaRecord
 * @property {string} id
 * @property {string} personId
 * @property {string} interventionId
 * @property {string} createdAt
 * @property {HealthSignal[]} baseline
 * @property {EvidenceSource} priorEvidence
 * @property {string[]} rationale
 * @property {string} interventionSummary
 * @property {Observation[]} exposure
 * @property {Observation[]} outcomes
 * @property {AttributionAssessment} attribution
 * @property {SafetyFlag[]} safety
 * @property {string} nextAction
 * @property {ShareScope} shareScope
 */

export const TYPE_FILE_LOADED = true;
