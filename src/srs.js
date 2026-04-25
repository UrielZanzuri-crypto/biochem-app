// SM-2 inspired spaced repetition scheduler
export const grade = (card, quality) => {
  let { ef = 2.5, interval = 0, reps = 0 } = card;
  if (quality < 3) {
    reps = 0; interval = 1;
  } else {
    reps += 1;
    if (reps === 1) interval = 1;
    else if (reps === 2) interval = 3;
    else interval = Math.round(interval * ef);
    ef = Math.max(1.3, ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
  }
  return { ef, interval, reps, due: Date.now() + interval * 60 * 1000 };
};

// localStorage helpers — keyed per cycle
const STORAGE_KEY = 'biochem_srs_v1';

export const loadAll = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
};

export const saveAll = (data) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
};

export const loadCycle = (cycleId) => {
  const all = loadAll();
  return all[cycleId] || {};
};

export const saveCycle = (cycleId, cards) => {
  const all = loadAll();
  all[cycleId] = cards;
  saveAll(all);
};

// Compute mastery percentage across a cycle's questions
export const computeMastery = (cycle, cards) => {
  const total = cycle.questions.length;
  if (total === 0) return { total: 0, reviewed: 0, strong: 0, pct: 0 };
  const reviewed = cycle.questions.filter(q => cards[q.id]).length;
  const strong = cycle.questions.filter(q => (cards[q.id]?.reps || 0) >= 2).length;
  return { total, reviewed, strong, pct: Math.round((strong / total) * 100) };
};

export const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
