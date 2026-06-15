import { assertNoForbiddenMedicalClaims } from './safety.js';
import { collectThesisText } from '../data/deltaThesis.js';

export const appCopyBlocks = [
  'You can always find what was done. This adds what was tried, what changed, how confident we are, and what should happen next.',
  'This prototype is not a doctor, diagnostic service, treatment plan or medical device.',
  'It supports evidence-informed health actions, tracking and clinician conversation preparation.',
  'The first slice uses demo cardiometabolic and functional-reserve data only.'
];

export function checkAppCopy() {
  appCopyBlocks.forEach((block, index) => assertNoForbiddenMedicalClaims(block, `appCopyBlocks[${index}]`));
  return true;
}

export function checkThesisCopy() {
  collectThesisText().forEach((block, index) => assertNoForbiddenMedicalClaims(block, `deltaThesis[${index}]`));
  return true;
}
