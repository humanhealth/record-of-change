# The record of change — page copy (plain text)

Edit here by hand. This mirrors index.html.

---

## Hero

Eyebrow: The record of change · a strategy brief

Headline: Health AI gives better answers. We still need to know whether anything changed.

Subheadline: Google has the models, the research, the consumer surfaces and the data pipes. Turning that capability into better health, and into equity you can actually measure, needs one more layer: a structured record of what was tried and what changed.

Human line: Frontier capability is mostly here. This is how it becomes health, for the people it usually reaches last.

---

## Strategy map

### Research and capability
- AlphaFold — science discovery
- Gemini — general reasoning, orchestration
- MedGemma — medical text and image
- AMIE — diagnostic conversation
- Imaging and diagnostics — research focus area
- Mobile sensing — personal health models
- Medical speech — clinical speech to text
- Public health tools — population research

### The missing layer
Change record (Delta Record)
What was tried. What happened. Who benefited. Who did not. Why.

Fields: Baseline → Attempt → Follow-through → Observed change → Barrier → Next action

Caveat: Not a replacement for electronic records, trials, PROMs or clinical judgement. It is the linked layer between an attempt and its outcome.

### Surfaces where it creates value

Patient — value before any clinician is involved
- See what you tried and what changed.
- One safe next action.
- Works with wearables, symptom and medication notes, goals and follow-up prompts.
- A memory of what happened, not just advice.

Clinician — value even when patient use is partial
- A short baseline, action, response and barrier summary.
- Less noise from patient data, because it is structured around an attempt.
- Follow-up that asks the right question.
- Supports shared decisions, without claiming to diagnose on its own.

System / population — value once aggregated
- Shows where follow-up breaks.
- Shows which barriers recur.
- Shows who got advice but not benefit.
- Supports service redesign, outreach and equity measurement.
- Turns "advice given" into "benefit reached, or not".

Research — value over time
- Observational patterns first.
- Hypotheses about who responds and who does not.
- Better outcome definitions.
- In time, n-of-1, pragmatic or point-of-care randomised designs where appropriate.
- A practical unit of learning for a learning health system.

### Impact
Caption: This is the bottom of the translation: where frontier capability turns into health, and where the equity gaps stop being invisible.

- Better individual follow-up
- Better use of Google's health surfaces
- More useful AI health coaching
- Better clinical decision support
- Measured equity gaps
- Stronger real-world evidence
- Health impact that can be seen, not assumed

---

## What already exists

Medicine records a great deal of what was done: prescriptions, referrals, tests, scans, diagnoses, procedures, follow-ups. Some outcomes are captured too. Repeat biomarkers, patient-reported measures, registry data. So it is not true that outcomes are never written down. The problem is that they are scattered. They sit in different systems, often in free text, often tied to one pathway, and they are rarely linked back to the specific attempt that was meant to move them. That is not really an accident. The record was built for billing, handover, safety and the courts, not to tell you whether someone got better. So it does not.

Google has built much of the hard machinery nearby. Research is run as a model embedded with clinical, product and engineering teams, across imaging and diagnostics, genomics, mobile sensing and public health [1]. MedGemma offers open models for medical text and image comprehension, which Google is explicit should be validated before use in any specific setting [2]. AMIE is a conversational diagnostic system, now tested in a real outpatient clinic with Beth Israel Deaconess Medical Center [3]. There are medical speech models [4], general reasoning and orchestration in Gemini [5], and science discovery upstream in AlphaFold [6]. People can hold their own data in Health Connect, whose Medical Records feature carries basic clinical data in FHIR format with the person's permission [7]. Google's consumer health and Fitbit surfaces sit alongside this [8].

That is a lot of capability. What it does not yet add up to is a record of whether an attempt changed anything.

## What is missing

There is no small, consistent unit that says, for one person and one attempt: this is what was true before, this is what we tried, this is whether it actually happened, this is what changed, this is what got in the way, this is what to try next.

Call it a change record, or a Delta Record. It is observational to start with. With a single person you cannot see the counterfactual, so you do not claim the attempt caused the result. You record the attempt and what followed. That alone is more than most systems keep.

## What the change record adds

It links the attempt to what came after. One person, one attempt, six fields: baseline, attempt, follow-through, observed change, barrier, next action.

It is not a new electronic record, a trial, a PROM, or a substitute for clinical judgement. It is the thin layer between an attempt and its outcome, which today mostly goes unwritten.

## Why it works without full system adoption

It is modular, and that is the point. One person can keep a change record and get something from it before any clinician is involved: a memory of what they tried and what changed, and one safe next step. One clinic can use it without full patient uptake, building the record from ordinary notes, tests, PROMs and, where the person shares it, Health Connect data in FHIR. One pathway can use it on its own.

It is worth more as these join up. But it does not need all of them at once, and it does not need a hospital to commit before a patient sees value.

## Why it matters for equity

Put many change records together and some things become visible that are hard to see now. Where follow-up breaks. Which barriers keep recurring. Who was given advice and never reached the benefit.

Two people get the same advice. One can act on it. The other cannot: cost, pain, night shifts, no money, fear. Record only what was said and they look identical. Record what changed and you can see who was left behind, while there is still time to do something about it.

This does not fix inequity. It makes visible where benefit fails to arrive, which is the first condition for doing anything about it.

## How it matures into stronger evidence

Begin observational. Patterns first. Then questions about why people respond differently. Then better outcome definitions. Then, where a setting is mature enough and it is safe, stronger designs: n-of-1, pragmatic trials, point-of-care randomisation.

Randomisation is not the foundation. The hard part was never the method, it was following people up, which is what made good evidence slow, costly, and rarest for the people who needed it most. A cheap, structured record of what was tried and what followed is the foundation. It gives a learning health system a small, concrete thing to learn from, and it is what the stronger designs were always waiting on.

## What it is not

- Not another diagnostic model.
- Not an autonomous doctor.
- Not a claim of causal proof from one person.
- Not a replacement for electronic records, trials or PROMs.
- Not dependent on every hospital adopting it first.

## Theory of change

1. Capture the attempted change. One person, one attempt, recorded as a small structured unit.
2. Structure the follow-up. Turn scattered notes, tests and patient data into a baseline, an action, a response and a barrier.
3. Return value to the person and the clinician. A memory and a next step for the patient; a clean summary for the clinician.
4. Aggregate patterns across groups. See where follow-up breaks and where benefit does not arrive.
5. Use mature data for better causal questions. Where it is safe and earned, move from observed to tested.

## Closing

The scarce thing is no longer only the answer. It is the record of whether the answer became health.
