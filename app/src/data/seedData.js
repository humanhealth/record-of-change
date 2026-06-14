import { validateInterventions, validatePersonProfile } from '../core/validators.js';

export const demoProfile = validatePersonProfile({
  id: 'demo-person-001',
  displayName: 'Fictional demo adult',
  description: 'A made-up adult in midlife who wants to look after their long-term health, without some elaborate optimisation plan to keep up with.',
  goals: [
    'Work out which health levers actually matter.',
    'Pick one realistic thing to do, instead of five at once.',
    'Walk into appointments with better questions.'
  ],
  preferences: [
    'Simple routines over fiddly protocols.',
    'Things that fit around work without much fuss.',
    'A weekly look, rather than checking numbers every day.'
  ],
  constraints: [
    'Not much spare time on weekdays.',
    'A dodgy knee if exercise ramps up too fast.',
    'Gets anxious when there are too many numbers to track.'
  ],
  safetyConsiderations: [
    'No sudden jumps in exercise.',
    'No sleep restriction or aggressive fasting.',
    'Anything clinical, blood pressure, lipids, medication, symptoms, a diagnosis, goes to a clinician.'
  ],
  signals: [
    {
      id: 'bp-recent',
      label: 'Recent blood pressure',
      domain: 'cardiometabolic',
      value: '136/86',
      unit: 'mmHg',
      dataQuality: 'needs-confirmation',
      note: 'Just one recent reading. A week of home readings would say more.'
    },
    {
      id: 'ldl-recent',
      label: 'LDL cholesterol',
      domain: 'cardiometabolic',
      value: 3.9,
      unit: 'mmol/L',
      dataQuality: 'fresh',
      note: 'Made-up lab value for the demo. What it means clinically depends on overall risk.'
    },
    {
      id: 'hba1c-recent',
      label: 'HbA1c',
      domain: 'metabolic',
      value: 40,
      unit: 'mmol/mol',
      dataQuality: 'fresh',
      note: 'A made-up borderline number. It only means something in context.'
    },
    {
      id: 'waist-current',
      label: 'Waist circumference',
      domain: 'metabolic',
      value: 101,
      unit: 'cm',
      dataQuality: 'self-reported',
      note: 'Worth watching as a trend, if measured the same way each time.'
    },
    {
      id: 'activity-current',
      label: 'Average daily steps',
      domain: 'functional-reserve',
      value: 3500,
      unit: 'steps/day',
      dataQuality: 'self-reported',
      note: 'Low to start with. Step counts are good for a trend, not for judging anyone.'
    },
    {
      id: 'sleep-current',
      label: 'Sleep duration and regularity',
      domain: 'sleep-energy',
      value: '6.2h, irregular timing',
      unit: 'pattern',
      dataQuality: 'self-reported',
      note: 'Keeping the timing steady tends to help energy, and sticking to plans.'
    },
    {
      id: 'alcohol-current',
      label: 'Alcohol intake',
      domain: 'behaviour-context',
      value: 16,
      unit: 'UK units/week',
      dataQuality: 'self-reported',
      note: 'A lever worth pulling, if they want to.'
    },
    {
      id: 'stress-current',
      label: 'Work stress',
      domain: 'behaviour-context',
      value: 'moderate-high',
      unit: 'self-report',
      dataQuality: 'self-reported',
      note: 'Shapes what’s realistic, and how easily a plan gets over-engineered.'
    }
  ]
});

export const interventions = validateInterventions([
  {
    id: 'home-bp-monitoring',
    title: 'Confirm blood pressure with home readings',
    shortDescription: 'Get a cleaner baseline before reading too much into one blood pressure number.',
    targetDomains: ['cardiometabolic'],
    evidence: {
      sourceType: 'guideline',
      level: 'high',
      summary: 'Readings taken at home are a normal way to confirm and follow a blood pressure pattern. Here it is only used for measuring and prepping a clinician chat, not for treatment.',
      citationLabel: 'Guideline-type evidence; add local guideline citation in clinical version.'
    },
    burden: 'low',
    risk: 'low',
    feasibility: 5,
    modifiability: 4,
    clinicianRequired: false,
    redFlags: [
      'Seek urgent medical help for severe symptoms such as chest pain, severe breathlessness, fainting, stroke-like symptoms, or sudden severe headache.',
      'Very high repeated readings should be reviewed by a clinician promptly.'
    ],
    learningDesign: 'routine-tracking',
    measurementPlan: {
      baselineMeasures: ['Morning and evening blood pressure readings for 7 days', 'Notes on caffeine, alcohol, sleep and stress during readings'],
      followUpMeasures: ['Average home BP after excluding day one if clinically appropriate', 'Any symptoms or concerning readings'],
      reviewAfterDays: 7,
      successSignal: 'A usable home BP summary that can inform a clinician conversation if needed.',
      stopOrEscalateIf: 'Severe symptoms, repeated very high readings, fainting, chest pain or neurological symptoms.'
    },
    patientFacingAction: 'Measure blood pressure at home in a calm, consistent way for 7 days and use the summary to decide whether clinician review is needed.',
    clinicianFacingNote: 'Patient has collected home BP readings to support a BP/lipid risk discussion. No medication advice was provided by the prototype.'
  },
  {
    id: 'walking-after-meals',
    title: 'Walk after one meal most days',
    shortDescription: 'A low-friction habit, not an ambitious training plan.',
    targetDomains: ['functional-reserve', 'metabolic', 'sleep-energy'],
    evidence: {
      sourceType: 'meta-analysis',
      level: 'high',
      summary: 'Regular activity tracks strongly with better heart, metabolic and functional health. What is used here is a gentle walking habit, not an athletic programme.',
      citationLabel: 'Physical activity guideline/meta-analysis type evidence; add precise citations in clinical version.'
    },
    burden: 'low',
    risk: 'low',
    feasibility: 4,
    modifiability: 4,
    clinicianRequired: false,
    redFlags: [
      'Stop and seek medical advice for chest pain, fainting, severe breathlessness, or new neurological symptoms.',
      'Reduce intensity or pause if knee pain worsens.'
    ],
    learningDesign: 'before-after-review',
    measurementPlan: {
      baselineMeasures: ['Current daily steps', 'Energy rating', 'Knee discomfort rating', 'Sleep timing'],
      followUpMeasures: ['Walk completion count', 'Average daily steps', 'Energy rating', 'Knee discomfort rating', 'Sleep timing'],
      reviewAfterDays: 28,
      successSignal: 'The habit was completed on most planned days without worsening pain, and activity or energy moved in a useful direction.',
      stopOrEscalateIf: 'Chest pain, fainting, severe breathlessness, or worsening injury symptoms.'
    },
    patientFacingAction: 'Walk for 10 to 20 minutes after lunch or dinner on at least 4 days each week for 4 weeks.',
    clinicianFacingNote: 'Patient attempted a low-risk walking habit and tracked adherence, energy and knee discomfort.'
  },
  {
    id: 'sleep-regularity',
    title: 'Stabilise sleep timing',
    shortDescription: 'Aim for a steady wake time and a wind-down, not strict sleep restriction.',
    targetDomains: ['sleep-energy', 'behaviour-context'],
    evidence: {
      sourceType: 'consensus',
      level: 'moderate',
      summary: 'Keeping sleep timing regular, with a simple wind-down, often helps. It is not offered here as treatment for a sleep disorder.',
      citationLabel: 'Sleep behaviour guidance; add clinical sleep source in clinical version.'
    },
    burden: 'medium',
    risk: 'low',
    feasibility: 3,
    modifiability: 3,
    clinicianRequired: false,
    redFlags: [
      'Discuss with a clinician if there is loud snoring, witnessed pauses in breathing, severe daytime sleepiness, or insomnia causing major impairment.',
      'Do not use aggressive sleep restriction in this prototype.'
    ],
    learningDesign: 'before-after-review',
    measurementPlan: {
      baselineMeasures: ['Usual bedtime and wake time', 'Energy rating', 'Caffeine and alcohol timing'],
      followUpMeasures: ['Wake time consistency', 'Energy rating', 'Number of late screens/alcohol evenings'],
      reviewAfterDays: 21,
      successSignal: 'Wake time became more consistent and energy or adherence improved without anxiety about tracking.',
      stopOrEscalateIf: 'Severe insomnia, suspected sleep apnoea, or worsening mood.'
    },
    patientFacingAction: 'Choose one consistent wake time for weekdays and create a short wind-down boundary for 3 weeks.',
    clinicianFacingNote: 'Patient tried a low-risk sleep regularity routine. No diagnosis or treatment for sleep disorder was provided.'
  },
  {
    id: 'alcohol-reduction',
    title: 'Reduce alcohol by a small measured amount',
    shortDescription: 'Pick a specific cut rather than a vague “drink less”.',
    targetDomains: ['cardiometabolic', 'sleep-energy', 'behaviour-context'],
    evidence: {
      sourceType: 'guideline',
      level: 'moderate',
      summary: 'Cutting back on alcohol can help sleep, blood pressure and weight for some people. This prototype does not handle dependence or withdrawal.',
      citationLabel: 'Public health/guideline type evidence; add local alcohol guidance in clinical version.'
    },
    burden: 'medium',
    risk: 'medium',
    feasibility: 3,
    modifiability: 3,
    clinicianRequired: false,
    redFlags: [
      'Seek clinical support before reducing alcohol suddenly if there may be dependence, withdrawal symptoms, seizures, or daily heavy drinking.',
      'This prototype is not an addiction treatment service.'
    ],
    learningDesign: 'before-after-review',
    measurementPlan: {
      baselineMeasures: ['Current units per week', 'Sleep quality', 'Evening triggers'],
      followUpMeasures: ['Units per week', 'Alcohol-free days', 'Sleep quality', 'Mood or craving concerns'],
      reviewAfterDays: 28,
      successSignal: 'Units reduced safely, with sleep or energy moving in a useful direction.',
      stopOrEscalateIf: 'Withdrawal symptoms, loss of control, severe mood change, or safety concerns.'
    },
    patientFacingAction: 'Choose two alcohol-free evenings each week or reduce by 3 to 5 units weekly for 4 weeks, only if safe.',
    clinicianFacingNote: 'Patient attempted a modest alcohol reduction and tracked sleep, units and any safety concerns.'
  },
  {
    id: 'resistance-training-habit',
    title: 'Start a very small resistance-training habit',
    shortDescription: 'A small strength habit that won’t set off an injury or tip you into over-tracking.',
    targetDomains: ['functional-reserve', 'metabolic'],
    evidence: {
      sourceType: 'meta-analysis',
      level: 'high',
      summary: 'Strength work supports muscle and everyday function. What is here is a cautious habit, not a performance plan.',
      citationLabel: 'Physical activity/resistance training evidence; add precise citations in clinical version.'
    },
    burden: 'medium',
    risk: 'medium',
    feasibility: 3,
    modifiability: 4,
    clinicianRequired: false,
    redFlags: [
      'Stop and seek advice for chest pain, fainting, severe breathlessness, or acute injury.',
      'Consider professional input if there is significant pain, instability, or complex medical history.'
    ],
    learningDesign: 'before-after-review',
    measurementPlan: {
      baselineMeasures: ['Current strength routine', 'Pain or injury concerns', 'Energy rating'],
      followUpMeasures: ['Completed sessions', 'Pain rating', 'Perceived strength/function', 'Energy rating'],
      reviewAfterDays: 28,
      successSignal: 'Two short sessions most weeks without worsening pain, with improved confidence or function.',
      stopOrEscalateIf: 'Pain worsens, injury occurs, or concerning symptoms appear.'
    },
    patientFacingAction: 'Do two 15-minute beginner resistance sessions each week for 4 weeks, keeping effort easy at first.',
    clinicianFacingNote: 'Patient tried a conservative resistance-training habit and tracked adherence and pain.'
  },
  {
    id: 'clinician-bp-lipids-discussion',
    title: 'Prepare a BP and lipids discussion with a clinician',
    shortDescription: 'Turn scattered readings into one focused question for the appointment.',
    targetDomains: ['cardiometabolic'],
    evidence: {
      sourceType: 'guideline',
      level: 'high',
      summary: 'Managing blood pressure and lipids is well-established prevention. This only helps you prepare the conversation; it does not suggest medication or rate your risk.',
      citationLabel: 'Cardiovascular prevention guideline type evidence; add local guideline citation in clinical version.'
    },
    burden: 'low',
    risk: 'low',
    feasibility: 4,
    modifiability: 5,
    clinicianRequired: true,
    redFlags: [
      'Clinical interpretation of BP, lipid results, symptoms and medicine suitability requires clinician review.',
      'Do not start, stop or change medicines based on this prototype.'
    ],
    learningDesign: 'clinician-supervised-review',
    measurementPlan: {
      baselineMeasures: ['Home BP summary if available', 'Recent lipid results', 'Family history and smoking status if known'],
      followUpMeasures: ['Clinician advice received', 'Agreed plan', 'Follow-up measurements requested'],
      reviewAfterDays: 30,
      successSignal: 'A clinician-reviewed prevention plan or clear next test/review is agreed.',
      stopOrEscalateIf: 'Symptoms or very high readings require more urgent clinical advice.'
    },
    patientFacingAction: 'Prepare a concise clinician question about blood pressure and lipids. Do not alter medicines without clinician advice.',
    clinicianFacingNote: 'Patient requests clinician review of BP/lipid risk and preventive options. Prototype did not recommend treatment.'
  },
  {
    id: 'medication-adherence-discussion',
    title: 'Medication adherence discussion prompt',
    shortDescription: 'For people already on medicines: line up the barriers and side effects to talk through.',
    targetDomains: ['medication-review', 'behaviour-context'],
    evidence: {
      sourceType: 'consensus',
      level: 'moderate',
      summary: 'Side effects and the everyday friction of taking medicines are common reasons plans fall apart. This only helps you prepare for a clinician or pharmacist.',
      citationLabel: 'Medication review/adherence evidence; add precise source in clinical version.'
    },
    burden: 'low',
    risk: 'low',
    feasibility: 2,
    modifiability: 3,
    clinicianRequired: true,
    redFlags: [
      'Do not stop or change prescribed medicines without clinician or pharmacist advice.',
      'Urgent symptoms should be assessed urgently.'
    ],
    learningDesign: 'clinician-supervised-review',
    measurementPlan: {
      baselineMeasures: ['Current medicines', 'Missed doses', 'Side effects or concerns'],
      followUpMeasures: ['Clinician/pharmacist advice', 'Agreed changes if any', 'Ongoing barriers'],
      reviewAfterDays: 30,
      successSignal: 'Medication concerns are clarified with a qualified professional.',
      stopOrEscalateIf: 'Severe side effects or urgent symptoms.'
    },
    patientFacingAction: 'List medication questions and barriers for a clinician or pharmacist. Do not change medicines yourself.',
    clinicianFacingNote: 'Patient is seeking review of medication barriers or side effects. Prototype did not recommend medication changes.'
  }
]);
