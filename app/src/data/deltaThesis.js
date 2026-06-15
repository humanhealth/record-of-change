// Content for the /deepmind pointer page in the prototype.
// Strings live here so test/copy.test.mjs can walk them and prove nothing
// introduces a forbidden medical claim. Rendering lives in src/app.js.

export const deltaThesis = {
  meta: {
    title: 'The record of change',
    description: 'A working demo of the record-of-change idea, alongside the strategy brief.'
  },
  hero: {
    headline: 'You can always find what was done. What happened after is a mess.',
    sub: 'Most health AI is about knowing more. This is the other half: writing down what was tried for one person, and what actually changed. The working demo is here. The full argument is the strategy brief.'
  }
};

export function collectThesisText(node = deltaThesis) {
  if (typeof node === 'string') return [node];
  if (Array.isArray(node)) return node.flatMap((item) => collectThesisText(item));
  if (node && typeof node === 'object') return Object.values(node).flatMap((value) => collectThesisText(value));
  return [];
}
