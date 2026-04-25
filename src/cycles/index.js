// ============================================================
// CYCLE REGISTRY
// To add a new cycle: create a new file in this folder following
// the urea.js schema, then import it here and add to ALL_CYCLES.
// ============================================================

import { ureaCycle } from './urea.js';
import { glycolysisCycle } from './glycolysis.js';
import { tcaCycle } from './tca.js';
import { betaOxidationCycle } from './beta-oxidation.js';
import { gluconeoCycle } from './gluconeogenesis.js';
import { glycogenCycle } from './glycogen.js';
import { pppCycle } from './ppp.js';
import { etcCycle } from './etc.js';
import { fattyAcidSynthCycle } from './fatty-acid-synthesis.js';
import { aaBiosynthCycle } from './aa-biosynthesis.js';
import { pyruvateFatesCycle } from './pyruvate-fates.js';
import { coordRegCycle } from './coord-regulation.js';

export const CHAPTERS = [
  { id: 'carb',    en: 'Carbohydrate Metabolism',                he: 'מטבוליזם פחמימות',        order: 1 },
  { id: 'glycogen',en: 'Glycogen Metabolism',                    he: 'מטבוליזם גליקוגן',         order: 2 },
  { id: 'tca',     en: 'The Citric Acid Cycle',                  he: 'מעגל קרבס',                order: 3 },
  { id: 'fa-cat',  en: 'Fatty Acid Catabolism',                  he: 'פירוק חומצות שומן',        order: 4 },
  { id: 'aa-urea', en: 'Amino Acid Oxidation & Urea Production', he: 'חומצות אמינו ומעגל האוריאה', order: 5 },
  { id: 'oxphos',  en: 'Oxidative Phosphorylation',              he: 'פוספורילציה חמצונית',      order: 6 },
  { id: 'lipid-bs',en: 'Lipid Biosynthesis',                     he: 'ביוסינתזת שומנים',         order: 7 },
  { id: 'aa-bs',   en: 'Biosynthesis of Amino Acids',            he: 'ביוסינתזת חומצות אמינו',  order: 8 }
];

// All registered cycles.
export const ALL_CYCLES = [
  glycolysisCycle,
  pyruvateFatesCycle,
  gluconeoCycle,
  coordRegCycle,
  pppCycle,
  glycogenCycle,
  tcaCycle,
  betaOxidationCycle,
  ureaCycle,
  etcCycle,
  fattyAcidSynthCycle,
  aaBiosynthCycle
];

export const getCyclesByChapter = () => {
  const map = {};
  CHAPTERS.forEach(ch => { map[ch.id] = { chapter: ch, cycles: [] }; });

  ALL_CYCLES.forEach(c => {
    const chapterMap = {
      'Amino Acid Oxidation and the Production of Urea': 'aa-urea',
      'Carbohydrate Metabolism': 'carb',
      'Gluconeogenesis': 'carb',
      'Pentose Phosphate Pathway': 'carb',
      'Glycogen Metabolism': 'glycogen',
      'The Citric Acid Cycle': 'tca',
      'Fatty Acid Catabolism': 'fa-cat',
      'Oxidative Phosphorylation': 'oxphos',
      'Lipid Biosynthesis': 'lipid-bs',
      'Biosynthesis of Amino Acids': 'aa-bs'
    };
    const chId = chapterMap[c.chapter] || 'aa-urea';
    if (map[chId]) map[chId].cycles.push(c);
  });

  return Object.values(map).sort((a, b) => a.chapter.order - b.chapter.order);
};

export const PLACEHOLDER_CYCLES = [];
