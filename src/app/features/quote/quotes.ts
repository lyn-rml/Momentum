import { Category, categoryNames } from '../../core/preferences/preferences';

const quotes: Record<Category, readonly string[]> = {
  Discipline: [
    'You don’t have to see the whole path to take the next small step.',
    'Give the small promise you made yourself a place in today.',
    'Progress begins again each time you choose to show up.',
  ],
  Study: [
    'One question understood is a step beyond a hundred answers memorized.',
    'Let curiosity carry you through the part you do not understand yet.',
    'Make room for one new idea, then give it time to settle.',
  ],
  Career: [
    'Build something useful today. Let the next opportunity meet you moving.',
    'A skill grows quietly before it opens a door.',
    'The work you care about starts with the care you bring to this task.',
  ],
  Confidence: [
    'You can begin before you feel ready and learn to trust yourself along the way.',
    'Let one brave little choice be enough for today.',
    'Give yourself the patience you would offer someone learning.',
  ],
  Fitness: [
    'Meet your body where it is today, and take one kind step forward.',
    'A little movement is still movement. Let it count.',
    'Build a rhythm you can return to, with room for rest.',
  ],
  Coding: [
    'Make one small thing work. Understanding grows from there.',
    'A clear question can move your code further than another hurried change.',
    'Every problem you understand makes the next one a little less unfamiliar.',
  ],
};

export function quoteForDate(category: Category, date: Date): string {
  const day = Math.floor(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000,
  );
  const collection = quotes[category];
  return collection[((day % collection.length) + collection.length) % collection.length];
}

export function dailyQuote(
  categories: readonly Category[],
  date: Date,
  offset = 0,
): { category: Category; text: string } {
  const selected = categoryNames.filter((category) => categories.includes(category));
  if (!selected.length) selected.push('Discipline');
  const day = Math.floor(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000,
  );
  const position = day + offset;
  const category = selected[((position % selected.length) + selected.length) % selected.length];
  const collection = quotes[category];
  const cycle = Math.floor(position / selected.length);
  return {
    category,
    text: collection[((cycle % collection.length) + collection.length) % collection.length],
  };
}
