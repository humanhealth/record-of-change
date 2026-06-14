// Content for the /deepmind research note page.
// All prose lives here as plain strings so test/copy.test.mjs can walk every
// value and prove the page never introduces a forbidden medical claim.
// Keep this file copy-only. Rendering lives in src/app.js.

export const deltaThesis = {
  meta: {
    title: 'The Delta Layer for Medicine',
    description:
      'A note on the missing evidence layer between medical records, AI reasoning and real-world outcomes.'
  },

  hero: {
    kicker: 'Research note · not a medical product',
    headline: 'The medical record remembers what happened. The Delta Record remembers what worked.',
    sub:
      'Medical AI is improving quickly. The models are sharper, the records are bigger, the chatbots are more fluent. Almost none of it remembers whether a particular attempt to help a particular person changed anything. Someone tried something. It helped, or it didn’t, or nobody could really tell. That last part keeps going missing.',
    honesty:
      'A fair objection: “worked” is doing a lot of work in that sentence. Whether something worked, for one person, is genuinely hard to know. So a Delta Record doesn’t pretend to settle it. It writes the attempt down well enough that cause can be weighed later, and it stays honest about how shaky that judgement usually is.',
    note:
      'This is an argument, not a finished system. The prototype is here to make the idea concrete, nothing more.',
    ctaPrimary: { label: 'View the prototype loop', href: '/interventions' },
    ctaSecondary: { label: 'Read the evidence model', href: '/evidence-safety' }
  },

  gap: {
    kicker: 'The gap',
    heading: 'The missing piece is not another chatbot',
    body: [
      'You can already hand an AI your records and get a reasonable answer back: what a result means, what to ask your GP, what some abbreviation stands for. That is genuinely useful. It also steps around the harder problem.',
      'A medical record is mostly a log. Blood pressure was high. A drug was prescribed. A test came back. A clinic was attended. What it almost never holds is the attempt itself, the effort to change where someone is heading.'
    ],
    missing: [
      'Why this action and not another.',
      'What evidence sat behind it.',
      'Whether the person actually did it.',
      'What shifted afterwards, and what stayed the same.',
      'Whether the action had anything to do with the shift.',
      'What to do next.'
    ],
    after:
      'None of this is exotic. It is the ordinary substance of trying to help someone, and we throw most of it away. The thing we keep losing is what I am calling a Delta Record.',
    pullQuote: 'A record tells you what happened to a person. A Delta Record tells you what they tried to change.'
  },

  landscape: {
    kicker: 'Where things stand',
    heading: 'Three layers already exist. The fourth does not.',
    cards: [
      {
        title: 'Records of state',
        text:
          'Portals, electronic records and uploaded documents tell you what was measured, diagnosed, prescribed or reported. We need them. They were just never built to learn from each attempt to improve.'
      },
      {
        title: 'Guidelines for the average',
        text:
          'Trials, guidelines and risk scores tell you what tends to help, and how strong the evidence is. That is the right place to start. But an average still has to land on one person, in one messy life.'
      },
      {
        title: 'Models that predict and explain',
        text:
          'Medical AI keeps getting better at summarising, answering questions, reasoning toward a diagnosis, holding a clinical conversation. Real progress. Also not the same as noticing whether an action changed what came next.'
      }
    ],
    missingCard: {
      title: 'The layer that is missing: records of change',
      text:
        'The Delta Layer is the part that joins these up. Start from the evidence, apply it to one person, write down what was tried and whether they could stick to it, watch what moves, say how sure you are, then decide the next step.'
    }
  },

  record: {
    kicker: 'The unit',
    heading: 'What a Delta Record is',
    body: [
      'A Delta Record is one attempt to improve someone’s health, written down properly. It is allowed to be uncertain. It should wear that uncertainty on its face.',
      'Nobody is claiming a before-and-after change proves anything on its own. The aim is narrower: stop binning the information that sits in the gap between the advice and the outcome.'
    ],
    fields: [
      ['Baseline', 'Where things stood before: signals, symptoms, constraints, risks, preferences, and how good the data was.'],
      ['Prior evidence', 'Why this was worth a try at all: a guideline, a trial, a review, weaker observational signal, clinical hunch.'],
      ['Rationale', 'Why this action, for this person, now.'],
      ['Intervention', 'What was actually tried: dose, timing, duration, the boundaries around it.'],
      ['Exposure', 'What the person actually did. An action not taken is a different thing from an action that failed.'],
      ['Outcomes', 'What moved: a biomarker, a symptom, function, behaviour, quality of life, a side effect, how they said they felt.'],
      ['Attribution', 'How much weight the change really deserves, rather than whether it merely came afterwards.'],
      ['Next action', 'Carry on, stop, adjust, escalate, refer, measure again, or try something else.'],
      ['Shareability', 'Theirs alone, shared with a clinician, consented for research, or only ever moving as aggregate.']
    ],
    pullQuote: 'It isn’t a new kind of advice. It’s a new kind of memory.'
  },

  loop: {
    kicker: 'The loop',
    heading: 'The loop is the actual product',
    body:
      'To a patient it might look like a calm health app. To a clinician, like follow-up support. To a researcher, like a causal-evidence system. Same machine underneath, dressed differently.',
    steps: [
      ['Prior evidence', 'What should help here, going on what we already know?'],
      ['Person context', 'What is true about this biology, this behaviour, these risks and constraints?'],
      ['Intervention', 'What is the safest, most measurable next thing to try?'],
      ['Exposure', 'Did it actually happen?'],
      ['Response', 'What moved, what didn’t, over what stretch of time?'],
      ['Attribution', 'How much should we trust that the action caused it?'],
      ['Next action', 'Given all that, what now?'],
      ['Shared learning', 'What can be learned privately, with a clinician, or across a governed group?']
    ],
    footer: 'The chatbot, if there is one, is just the front door. The loop is the building.'
  },

  evidence: {
    kicker: 'Evidence',
    heading: 'The existing evidence is the starting point, not the rival',
    body: [
      'This should not try to rediscover medicine from scratch. Trials, guidelines, epidemiology, risk models, plain clinical judgement: those mark out the boundaries and tell you which way benefit is likely to run.',
      'The individual layer asks a smaller question on top. Did this reasonable, evidence-backed action actually fit this person, and did the numbers that matter move?'
    ],
    formula: [
      'The published evidence sets the starting odds.',
      'The person’s own response tells you whether it fits.',
      'Pooled experience, handled carefully, sharpens the matching next time.'
    ],
    cards: [
      ['Established evidence', 'Guidelines, trials and clinical standards mark out what is reasonable, safe and worth a try.'],
      ['The person’s own response', 'Their data shows whether they stuck with it, tolerated it, hit friction, felt any different, in the short run.'],
      ['Pooled experience', 'Gathered across many Delta Records, under proper governance, this can show who tends to benefit, when, and where the benefit never turns up.']
    ]
  },

  methods: {
    kicker: 'Strength of evidence',
    heading: 'Not everything deserves an experiment',
    body:
      'Push this too far and every patient turns into a lab rat running trials on themselves. That is both unsafe and bad science. The job is to match the method to the stakes, and usually to reach for the lightest one that is still good enough.',
    rows: [
      ['Routine tracking', 'Blood pressure, sleep, activity, adherence, symptoms.', 'Fine for follow-up, weak for cause.'],
      ['Before-and-after review', 'Low-risk lifestyle or routine changes over a few weeks.', 'Easily fooled by time, context and expectation.'],
      ['N-of-1 comparison', 'Reversible, repeated, measurable things: some pain, migraine, sleep questions.', 'Wrong tool for anything urgent, irreversible or high-stakes.'],
      ['Micro-randomisation', 'Low-risk nudges: when to prompt, how, with what message.', 'Not for choosing a clinical treatment.'],
      ['Clinician-supervised support', 'Medication, diagnosis, disease management, escalation.', 'Needs regulation, a safety case, a named accountable professional.']
    ],
    bottomLine: 'So the Delta Layer doesn’t turn medicine into one long experiment. It just asks each decision to carry the kind of evidence it can actually bear.'
  },

  patientFirst: {
    kicker: 'Order of play',
    heading: 'It has to be useful before the hospital is involved',
    body: [
      'Version one should not wait on a hospital integration or access to the record. Someone should be able to pick it up on their own: pull their information together, see the handful of levers that actually matter, choose one safe action, track what happens, and walk into an appointment with a clean summary instead of a shoebox of screenshots.',
      'Part principle, part realism. Integration takes years, and anything that only works once a whole system has adopted it will reach almost nobody for a long time.'
    ],
    standalone: {
      title: 'Stands on its own for the person',
      items: [
        'What do we actually know?',
        'What is missing?',
        'What matters most right now?',
        'What is safe to try?',
        'What should be measured?',
        'What would make this a clinician’s problem, not mine?',
        'What changed?',
        'What do I bring to my next appointment?'
      ]
    },
    withClinician: {
      title: 'Better once a clinician is in the loop',
      items: [
        'A cleaner history.',
        'Follow-up that holds together.',
        'Adherence you can actually see.',
        'Earlier escalation when it matters.',
        'Less vague patient-generated noise.',
        'Continuity from one visit to the next.'
      ]
    }
  },

  deepmind: {
    kicker: 'Why DeepMind',
    heading: 'Why this belongs in a conversation with DeepMind',
    body: [
      'DeepMind’s best work tends to do one thing: take a problem people had written off as stuck, and make it move. AlphaFold did that for protein structure. Google’s AMIE is poking at diagnostic reasoning and the clinical conversation.',
      'This sits slightly to the side of both.'
    ],
    questions: [
      ['Diagnosis asks', 'What is going on here?'],
      ['Discovery asks', 'What new biology or treatment is out there to find?'],
      ['This asks', 'We chose an action. Did the person’s path actually change?']
    ],
    capabilitiesIntro: 'It leans on much of what these groups are already good at:',
    capabilities: [
      'multimodal reasoning',
      'uncertainty-aware modelling',
      'longitudinal memory',
      'causal inference',
      'human-AI interaction',
      'clinical safety',
      'privacy-preserving learning',
      'scientific evaluation',
      'model governance',
      'deployment discipline'
    ],
    caveat:
      'None of this is a dig at DeepMind, and none of it is new under the sun. Learning health systems, causal inference, real-world evidence: all of it already exists. The narrower point is that the attempt-and-response layer deserves a name and a shape of its own. It is not enough for medical AI to reason about what might be true. It should help the system find out what actually changed.'
  },

  programme: {
    kicker: 'Before any product',
    heading: 'The research underneath',
    cards: [
      ['Evidence graph', 'A structured map of actions: what each one targets, how strong the evidence is, how long it takes to show, the risks and contraindications, how it gets measured, and whether it needs a clinician.'],
      ['Person-state model', 'A cautious read of where someone is right now: signals, risks, goals, constraints, and how far the data can be trusted. Not a lifespan prediction.'],
      ['Intervention matching', 'An open ranking of actions by evidence, fit, feasibility, safety, effort, and how quickly you would learn anything from trying.'],
      ['Attribution model', 'A way to grade how much a change is worth: a hunch, came-afterwards, plausible, repeated, controlled, seen across similar people, backed by a trial.'],
      ['Governed learning', 'Hard walls between what stays private, what a clinician sees, what is consented for research, and what only ever moves in aggregate.']
    ]
  },

  roadmap: {
    kicker: 'The path',
    heading: 'Earn each stronger claim',
    stages: [
      ['Stage 1 · A personal Delta journal', 'Organise information, pick low-risk evidence-backed actions, track them, hand a clinician a clean summary. No diagnosis, no treatment calls, no medication changes.'],
      ['Stage 2 · Personalised support', 'More tailored plans for everyday health behaviours, with clear limits and prompts to escalate.'],
      ['Stage 3 · Clinician-supervised support', 'A clinician-facing view for follow-up, adherence, risk conversations and planning. A higher bar of evidence and regulation.'],
      ['Stage 4 · A learning health-system layer', 'Delta Records pooled under governance to find what helps, for whom, and where the benefit goes missing.'],
      ['Stage 5 · An adaptive, regulated system', 'Once the model changes over time, or touches higher-risk calls, it needs the full apparatus: quality systems, safety cases, validation, monitoring, regulators in the room.']
    ],
    bottomLine: 'The plan is not to dodge regulation. It is to earn the right to say more, one stage at a time.'
  },

  notList: {
    kicker: 'Limits',
    heading: 'What this is not',
    items: [
      'Not an autonomous clinician, and not a substitute for clinical judgement.',
      'Not a diagnosis engine.',
      'Not a replacement for a doctor.',
      'Not a biological-age score.',
      'Not a promise of more years of life.',
      'Not a supplement recommender.',
      'Not yet another wellness dashboard.',
      'Not an argument that everyone should experiment on themselves.',
      'Not an argument that the existing evidence is obsolete.',
      'Not a claim that the prototype has been clinically validated.'
    ],
    close: 'What it is: a name for a missing object, and a sketch of the infrastructure that would sit around it.'
  },

  progress: {
    kicker: 'What would count',
    heading: 'What progress actually looks like',
    body: 'The first proof isn’t a big rollout. It is one small loop that clearly does something.',
    slices: [
      ['First', 'A person can see where they stand, look at evidence-graded options, pick one safe action, track whether they did it and what happened, end up with a Delta Record and a summary worth handing to a clinician, and still see what nobody is sure about.'],
      ['Then', 'Clinicians find that summary helpful rather than one more thing to read.'],
      ['Then', 'In some defined group, the thing measurably improves follow-up, adherence, the quality of what gets measured, or what gets prioritised.']
    ],
    longTerm: 'The real test takes years. Does any of this help people, and systems, learn which actions change outcomes?'
  },

  close: {
    kicker: 'Close',
    heading: 'The question worth remembering',
    body: 'Healthcare already writes a great deal down. The next move is not to write more. It is to start remembering a different kind of thing.',
    notJust: ['What was the diagnosis?', 'What was prescribed?', 'What was measured?'],
    butAlso: ['What were we trying to change?', 'Why that action?', 'Did it happen?', 'What moved?', 'How sure are we?', 'What now?'],
    finalLine: 'The medical record remembers what happened. The Delta Record remembers what worked.'
  },

  sources: {
    kicker: 'Source notes',
    heading: 'Where this draws from',
    note:
      'This is a position piece. It leans on public work in learning health systems, digital-health evidence standards, wellness regulation, medical conversational AI and AI for biological discovery. It does not claim the Delta Layer has been validated.',
    references: [
      ['AHRQ — Learning Health Systems', 'The idea that a health system can fold its own data and experience back in alongside external evidence, and keep checking outcomes in a loop.', 'https://www.ahrq.gov/'],
      ['NICE — Evidence Standards Framework for Digital Health Technologies', 'Digital tools sit at different risk tiers by purpose; guidance and clinical-management support are held to different evidence.', 'https://www.nice.org.uk/'],
      ['FDA — General Wellness: Policy for Low Risk Devices', 'The line between low-risk wellness support and software that claims to diagnose, treat, prevent or manage disease.', 'https://www.fda.gov/'],
      ['Google Research — AMIE', 'Serious public work on diagnostic reasoning and medical conversation, which is a different thing from learning what changed.', 'https://research.google/'],
      ['Nobel Prize 2024, Chemistry', 'AlphaFold, and the wider moment of AI moving into biological discovery.', 'https://www.nobelprize.org/']
    ]
  }
};

// Recursively collect every string value in the thesis content for safety checks.
export function collectThesisText(node = deltaThesis) {
  if (typeof node === 'string') return [node];
  if (Array.isArray(node)) return node.flatMap((item) => collectThesisText(item));
  if (node && typeof node === 'object') return Object.values(node).flatMap((value) => collectThesisText(value));
  return [];
}
