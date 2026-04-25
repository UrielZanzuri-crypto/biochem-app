// ============================================================
// PENTOSE PHOSPHATE PATHWAY (PPP / HMP SHUNT)
// Oxidative phase (NADPH) + Non-oxidative phase (R5P interconversion)
// ============================================================

const S = {
  g6p:           'OCC1OC(OP(O)(O)=O)C(O)C(O)C1O',
  gluconolactone:'O=C1OC(COP(O)(O)=O)C(O)C(O)C1O',  // 6-phosphoglucono-δ-lactone
  pgluconate:    'OC(=O)C(O)C(O)C(O)C(O)COP(O)(O)=O',  // 6-phosphogluconate
  ru5p:          'OC(C=O)C(O)C(O)COP(O)(O)=O',  // ribulose-5-phosphate (simplified)
  r5p:           'OCC1OC(OP(O)(O)=O)C(O)C1O',  // ribose-5-phosphate
  xu5p:          'OCC(=O)C(O)C(O)COP(O)(O)=O',  // xylulose-5-phosphate
  s7p:           'OCC(=O)C(O)C(O)C(O)C(O)COP(O)(O)=O',  // sedoheptulose-7-phosphate
  g3p:           'O=CC(O)COP(O)(O)=O',
  e4p:           'O=CC(O)C(O)COP(O)(O)=O',  // erythrose-4-phosphate
  f6p:           'OCC1(O)OC(COP(O)(O)=O)C(O)C1O',
  // Cofactors
  nadp:          'NC(=O)c1ccc[n+](c1)C2OC(COP(O)(=O)OP(O)(=O)OCC3OC(n4cnc5c(N)ncnc45)C(OP(O)(O)=O)C3O)C(O)C2O',
  nadph:         'NC(=O)C1=CN(C=CC1)C2OC(COP(O)(=O)OP(O)(=O)OCC3OC(n4cnc5c(N)ncnc45)C(OP(O)(O)=O)C3O)C(O)C2O',
  co2:           'O=C=O',
  h2o:           'O'
};

const noReg = { activators: [], inhibitors: [], summary: { en: 'Not directly regulated; flux follows substrate availability and downstream demand.' } };

export const pppCycle = {
  id: 'ppp',
  chapter: 'Carbohydrate Metabolism',
  chapterOrder: 1,
  order: 3,
  layout: 'linear',
  title: { en: 'Pentose Phosphate Pathway', he: 'מסלול פנטוז-פוספט' },
  subtitle: { en: 'NADPH + Ribose-5-P production from G6P', he: 'ייצור NADPH וריבוז-5-P מ-G6P' },

  context: {
    tissue: { en: 'High activity: liver, adrenal cortex, lactating mammary gland, adipose, RBCs, gonads (cholesterol/steroid synthesis). Low activity: muscle (needs ATP, not NADPH).' },
    otherTissues: { en: 'RBCs: NADPH is CRITICAL (no other pathway in RBCs makes it) — regenerates glutathione to neutralize H₂O₂.' },
    state: { en: 'Oxidative phase active whenever NADPH is needed (biosynthesis, antioxidant defense, phagocyte respiratory burst). Non-oxidative adjusts R5P vs G6P flux based on demand.' },
    stateHormonal: { en: 'Insulin induces G6PD transcription (fed state, biosynthetic state). Not acutely hormonally regulated.' },
    turnover: { en: 'Regulated primarily by [NADP+]/[NADPH] ratio at G6PD. When NADPH is consumed → [NADP+] rises → G6PD activated.' }
  },

  overview: {
    en: `The pentose phosphate pathway (PPP) runs parallel to glycolysis, producing two critical products: (1) NADPH — the reducing power used for lipid/steroid biosynthesis, glutathione regeneration (antioxidant defense), CYP450 reactions, and the phagocyte respiratory burst; (2) Ribose-5-phosphate — the sugar backbone of nucleotides (DNA, RNA, ATP, NAD, CoA). PPP has TWO distinct phases. OXIDATIVE PHASE (irreversible, steps 1-3): G6P → Ribulose-5-P, producing 2 NADPH + 1 CO₂. Rate-limiting enzyme: G6PD (glucose-6-phosphate dehydrogenase), activated by high [NADP+]/[NADPH]. NON-OXIDATIVE PHASE (reversible, steps 4-7): interconverts 3-, 4-, 5-, 6-, 7-carbon sugars via transketolase (needs thiamine/TPP!) and transaldolase, allowing the cell to balance NADPH vs R5P production based on demand. When NADPH is needed but R5P isn't, R5P is shuffled back into glycolysis as F6P + G3P. Clinical: G6PD deficiency is the MOST COMMON enzyme deficiency worldwide — RBCs can't make NADPH → oxidative hemolysis (especially with fava beans, antimalarials, infections).`
  },

  storyFrame: {
    en: {
      title: 'The Biosynthesis Supply Depot',
      setting: 'A two-wing factory. The LEFT WING (oxidative) takes G6P, burns off one carbon as CO₂, and generates 2 packets of NADPH — the reducing fuel for every biosynthetic and antioxidant process. The RIGHT WING (non-oxidative) is a carbon-shuffling yard where 3-, 4-, 5-, 6-, and 7-carbon sugars are rearranged to balance supply. If the cell needs lots of R5P but not NADPH — shuffle G6P into R5P directly. If it needs NADPH but not R5P — run oxidative phase, then shuffle the R5P back into glycolysis.',
      characters: [
        { name: 'G6PD', role: 'The Gatekeeper', icon: '🔐', color: '#dc2626' },
        { name: '6PGL', role: 'The Opener', icon: '✂️', color: '#ea580c' },
        { name: '6PGD', role: 'The Decarboxylator', icon: '💨', color: '#f59e0b' },
        { name: 'Isomerase', role: 'The Rearranger', icon: '🔄', color: '#ca8a04' },
        { name: 'Epimerase', role: 'The Flipper', icon: '🔀', color: '#65a30d' },
        { name: 'Transketolase', role: 'The 2-C Mover', icon: '✌️', color: '#059669' },
        { name: 'Transaldolase', role: 'The 3-C Mover', icon: '🫱', color: '#0891b2' }
      ]
    }
  },

  mnemonic: {
    en: { phrase: 'G6PD: "Hemolytic when you eat BEANS (Bactrim, Ethanol, Aspirin, Naphthalene, Sulfa)"', breakdown: 'Oxidative: G6P → 6PGL → 6PG → Ru5P. Non-oxidative: Ru5P ↔ R5P / Xu5P → S7P + G3P → F6P + E4P → ...' }
  },

  compartments: {
    cyto: { en: 'Cytosol', he: 'ציטוזול', color: '#dbeafe', accent: '#3b82f6' }
  },

  steps: [
    {
      id: 1,
      compartment: 'cyto',
      phase: 'oxidative',
      linearPos: 0,
      enzyme: { abbr: 'G6PD', name: 'Glucose-6-Phosphate Dehydrogenase', ec: '1.1.1.49', class: 'Oxidoreductase', he: 'G6PD' },
      substrates: [{ key: 'g6p', name: 'G6P', smiles: S.g6p, isSource: true, stoich: 1 }],
      cofactors: [
        { key: 'nadp', name: 'NADP⁺', smiles: S.nadp, stoich: 1, role: 'consumed' },
        { key: 'nadph', name: 'NADPH', smiles: S.nadph, stoich: 1, role: 'produced' }
      ],
      products: [{ key: 'gluconolactone', name: '6-Phosphoglucono-δ-lactone', smiles: S.gluconolactone, isMain: true, stoich: 1 }],
      deltaG: '−17 kJ/mol (irreversible)',
      reversible: false,
      regulation: {
        activators: [{ name: 'NADP⁺', type: 'substrate (cofactor)', critical: true, note: { en: 'PRIMARY regulation: when NADPH is consumed, [NADP+]/[NADPH] rises → G6PD activated. Exquisitely sensitive to redox state.' } }],
        inhibitors: [{ name: 'NADPH', type: 'product (cofactor)', critical: true, note: { en: 'High NADPH inhibits G6PD — the cell has enough reducing power, don\'t make more.' } }],
        summary: { en: 'RATE-LIMITING step of PPP. Committed step for the oxidative phase. Regulated purely by the [NADP+]/[NADPH] ratio — it IS the redox sensor. Also induced transcriptionally by insulin (fed state).' }
      },
      story: { en: 'THE GATEKEEPER decides whether to commit G6P to the PPP. She reads one signal only: how much NADPH is around. When NADPH is low (biosynthesis running, oxidative stress), she opens the gate. High NADPH keeps her closed. In RBCs, she\'s the ONLY source of NADPH — that\'s why G6PD deficiency causes hemolysis under oxidative stress.' },
      clinical: {
        disorder: 'G6PD Deficiency',
        inheritance: 'X-linked recessive',
        findings: { en: 'MOST COMMON enzyme deficiency worldwide (~400 million people). Protective against malaria (selection pressure). RBCs cannot regenerate reduced glutathione → oxidative damage → acute hemolytic anemia under stress: FAVA BEANS (favism), antimalarials (primaquine), sulfa drugs, nitrofurantoin, dapsone, infections. Blood smear: HEINZ BODIES (denatured Hb) + BITE CELLS (macrophages remove Heinz bodies). Most variants episodic; severe variants (Mediterranean) chronic.' },
        treatment: { en: 'Avoid triggers (list of oxidant drugs + fava beans). Supportive transfusion during crisis. Genetic counseling.' }
      },
      beats: {
        en: [
          { t: 0, text: 'G6P enters the PPP. NADP+ waits as the electron acceptor.', highlight: 'substrate' },
          { t: 2500, text: 'G6PD oxidizes C1 — the aldehyde-like carbon becomes a lactone.', highlight: 'enzyme' },
          { t: 5000, text: 'First NADPH generated — reducing power for biosynthesis.', highlight: 'energy' },
          { t: 7500, text: '6-Phosphogluconolactone — unstable, spontaneously hydrolyzes.', highlight: 'product' }
        ]
      }
    },
    {
      id: 2,
      compartment: 'cyto',
      phase: 'oxidative',
      linearPos: 1,
      enzyme: { abbr: '6PGL', name: '6-Phosphogluconolactonase', ec: '3.1.1.31', class: 'Hydrolase', he: '6PGL' },
      substrates: [{ key: 'gluconolactone', name: '6-Phosphoglucono-δ-lactone', smiles: S.gluconolactone, stoich: 1 }],
      cofactors: [{ key: 'h2o', name: 'H₂O', smiles: S.h2o, stoich: 1, role: 'consumed' }],
      products: [{ key: 'pgluconate', name: '6-Phosphogluconate', smiles: S.pgluconate, isMain: true, stoich: 1 }],
      deltaG: '−21 kJ/mol (irreversible)',
      reversible: false,
      regulation: noReg,
      story: { en: 'THE OPENER simply hydrolyzes the lactone ring, opening it to the free 6-phosphogluconate. Spontaneous slow; this enzyme speeds it up.' },
      clinical: null,
      beats: {
        en: [
          { t: 0, text: 'The lactone is a cyclic ester — unstable.', highlight: 'substrate' },
          { t: 2500, text: 'Water opens it into an open-chain 6-phosphogluconate.', highlight: 'enzyme' },
          { t: 5000, text: 'Ready for the second oxidation + decarboxylation.', highlight: 'product' }
        ]
      }
    },
    {
      id: 3,
      compartment: 'cyto',
      phase: 'oxidative',
      linearPos: 2,
      enzyme: { abbr: '6PGD', name: '6-Phosphogluconate Dehydrogenase', ec: '1.1.1.44', class: 'Oxidoreductase', he: '6PGD' },
      substrates: [{ key: 'pgluconate', name: '6-Phosphogluconate', smiles: S.pgluconate, stoich: 1 }],
      cofactors: [
        { key: 'nadp', name: 'NADP⁺', smiles: S.nadp, stoich: 1, role: 'consumed' },
        { key: 'nadph', name: 'NADPH', smiles: S.nadph, stoich: 1, role: 'produced' },
        { key: 'co2', name: 'CO₂', smiles: S.co2, stoich: 1, role: 'produced' }
      ],
      products: [{ key: 'ru5p', name: 'Ribulose-5-P', smiles: S.ru5p, label: { en: 'Ribulose-5-P (5C)' }, isMain: true, stoich: 1 }],
      deltaG: 'Irreversible',
      reversible: false,
      regulation: noReg,
      story: { en: 'THE DECARBOXYLATOR removes carbon 1 as CO₂ and generates the SECOND NADPH. The molecule goes from 6 carbons (G6P) to 5 carbons (ribulose-5-P). End of the oxidative phase.' },
      clinical: null,
      beats: {
        en: [
          { t: 0, text: '6-phosphogluconate meets the decarboxylator.', highlight: 'substrate' },
          { t: 2500, text: 'Oxidative decarboxylation: CO₂ released, NADPH made.', highlight: 'energy' },
          { t: 5000, text: 'Ribulose-5-P (5C) — end of oxidative phase.', highlight: 'product' },
          { t: 7500, text: 'Total so far: 2 NADPH + 1 CO₂ per G6P.', highlight: 'carrier' }
        ]
      }
    },
    {
      id: 4,
      compartment: 'cyto',
      phase: 'non-oxidative',
      linearPos: 3,
      enzyme: { abbr: 'Isomerase', name: 'Ribose-5-Phosphate Isomerase', ec: '5.3.1.6', class: 'Isomerase', he: 'ribose-5-P איזומראז' },
      substrates: [{ key: 'ru5p', name: 'Ribulose-5-P', smiles: S.ru5p, stoich: 1 }],
      cofactors: [],
      products: [{ key: 'r5p', name: 'Ribose-5-P', smiles: S.r5p, label: { en: 'R5P → nucleotide synthesis' }, isMain: true, exportsTo: 'nucleotides', stoich: 1 }],
      deltaG: 'Reversible',
      reversible: true,
      regulation: noReg,
      story: { en: 'THE REARRANGER converts ribulose (ketose) to RIBOSE-5-P (aldose) — the direct precursor for nucleotide synthesis (DNA, RNA, ATP, NAD, CoA). One of the two key exits from PPP.' },
      clinical: null,
      beats: {
        en: [
          { t: 0, text: 'Ribulose-5-P: ketose form.', highlight: 'substrate' },
          { t: 2500, text: 'Isomerase rearranges to ribose-5-P: aldose form.', highlight: 'enzyme' },
          { t: 5000, text: 'R5P exits to build nucleotides.', highlight: 'product' }
        ]
      }
    },
    {
      id: 5,
      compartment: 'cyto',
      phase: 'non-oxidative',
      linearPos: 4,
      enzyme: { abbr: 'Epimerase', name: 'Ribulose-5-Phosphate 3-Epimerase', ec: '5.1.3.1', class: 'Isomerase', he: 'אפימראז' },
      substrates: [{ key: 'ru5p', name: 'Ribulose-5-P', smiles: S.ru5p, stoich: 1 }],
      cofactors: [],
      products: [{ key: 'xu5p', name: 'Xylulose-5-P', smiles: S.xu5p, isMain: true, stoich: 1 }],
      deltaG: 'Reversible',
      reversible: true,
      regulation: noReg,
      story: { en: 'THE FLIPPER epimerizes ribulose-5-P at C3 to form xylulose-5-P. This is the substrate that transketolase will use.' },
      clinical: null,
      beats: {
        en: [
          { t: 0, text: 'Ribulose-5-P can go two ways: to R5P (isomerase) or Xu5P (epimerase).', highlight: 'substrate' },
          { t: 2500, text: 'Epimerase flips the stereochemistry at C3.', highlight: 'enzyme' },
          { t: 5000, text: 'Xu5P ready for the shuffling dance.', highlight: 'product' }
        ]
      }
    },
    {
      id: 6,
      compartment: 'cyto',
      phase: 'non-oxidative',
      linearPos: 5,
      enzyme: { abbr: 'Transketolase', name: 'Transketolase', ec: '2.2.1.1', class: 'Transferase', he: 'טרנסקטולאז' },
      substrates: [
        { key: 'xu5p', name: 'Xylulose-5-P (5C)', smiles: S.xu5p, stoich: 1 },
        { key: 'r5p', name: 'Ribose-5-P (5C)', smiles: S.r5p, stoich: 1 }
      ],
      cofactors: [],
      products: [
        { key: 's7p', name: 'Sedoheptulose-7-P (7C)', smiles: S.s7p, isMain: true, stoich: 1 },
        { key: 'g3p', name: 'G3P (3C)', smiles: S.g3p, isMain: true, exportsTo: 'glycolysis', stoich: 1 }
      ],
      deltaG: 'Reversible',
      reversible: true,
      regulation: {
        activators: [],
        inhibitors: [{ name: 'Thiamine deficiency (B1)', type: 'cofactor', critical: true, note: { en: 'Transketolase REQUIRES TPP (thiamine pyrophosphate). B1 deficiency impairs PPP — red cell transketolase activity is a direct clinical test for thiamine status.' } }],
        summary: { en: 'Transfers a 2-carbon unit from a ketose to an aldose. TPP-dependent (vitamin B1!). Acts TWICE in the non-oxidative phase (steps 6 and 8 in linear representation; they are the same enzyme).' }
      },
      story: { en: 'THE 2-CARBON MOVER takes 2 carbons off the top of Xu5P (5C) and transfers them onto R5P (5C), making S7P (7C) + G3P (3C). Requires thiamine (B1) as TPP cofactor — this is why alcoholics with B1 deficiency have impaired PPP. Red cell transketolase activity is the gold-standard test for thiamine deficiency.' },
      clinical: {
        disorder: 'Thiamine (B1) deficiency — Wernicke-Korsakoff',
        inheritance: 'Nutritional (alcoholism, malnutrition)',
        findings: { en: 'Transketolase needs TPP. B1 deficiency also affects pyruvate DH, α-KGDH, branched-chain ketoacid DH. Clinical: Wernicke\'s triad (confusion + ataxia + ophthalmoplegia), Korsakoff psychosis (amnesia + confabulation). Wet beriberi (cardiac). Dry beriberi (neuropathy). CRITICAL: give thiamine BEFORE glucose in suspected cases.' },
        treatment: { en: 'IV thiamine immediately. Then supplement orally. Treat underlying alcoholism/malnutrition.' }
      },
      beats: {
        en: [
          { t: 0, text: 'Xu5P (5C) and R5P (5C) meet at transketolase.', highlight: 'substrate' },
          { t: 2500, text: '2-carbon unit transferred — requires TPP (B1).', highlight: 'enzyme' },
          { t: 5000, text: 'S7P (7C) and G3P (3C) formed.', highlight: 'product' }
        ]
      }
    },
    {
      id: 7,
      compartment: 'cyto',
      phase: 'non-oxidative',
      linearPos: 6,
      enzyme: { abbr: 'Transaldolase', name: 'Transaldolase', ec: '2.2.1.2', class: 'Transferase', he: 'טרנסאלדולאז' },
      substrates: [
        { key: 's7p', name: 'Sedoheptulose-7-P (7C)', smiles: S.s7p, stoich: 1 },
        { key: 'g3p', name: 'G3P (3C)', smiles: S.g3p, stoich: 1 }
      ],
      cofactors: [],
      products: [
        { key: 'f6p', name: 'F6P (6C)', smiles: S.f6p, isMain: true, exportsTo: 'glycolysis', stoich: 1 },
        { key: 'e4p', name: 'Erythrose-4-P (4C)', smiles: S.e4p, isMain: true, stoich: 1 }
      ],
      deltaG: 'Reversible',
      reversible: true,
      regulation: noReg,
      story: { en: 'THE 3-CARBON MOVER takes 3 carbons off S7P (7C) and transfers them onto G3P (3C), making F6P (6C) + E4P (4C). No vitamin cofactor needed. F6P exits to glycolysis — the non-oxidative phase can "recycle" sugars back into the main carb metabolism when R5P is not needed.' },
      clinical: null,
      beats: {
        en: [
          { t: 0, text: 'S7P (7C) and G3P (3C) arrive.', highlight: 'substrate' },
          { t: 2500, text: '3-carbon unit transferred.', highlight: 'enzyme' },
          { t: 5000, text: 'F6P (6C) → can go back to glycolysis. E4P (4C) used for aromatic AA synthesis.', highlight: 'product' }
        ]
      }
    }
  ],

  intermediates: [
    { id: 'gluconolactone', afterStep: 1, beforeStep: 2, name: '6-P-glucono-δ-lactone', smiles: S.gluconolactone },
    { id: 'pgluconate', afterStep: 2, beforeStep: 3, name: '6-P-gluconate', smiles: S.pgluconate },
    { id: 'ru5p', afterStep: 3, beforeStep: 4, name: 'Ribulose-5-P', smiles: S.ru5p },
    { id: 'r5p', afterStep: 4, beforeStep: 5, name: 'Ribose-5-P', smiles: S.r5p },
    { id: 'xu5p', afterStep: 5, beforeStep: 6, name: 'Xylulose-5-P', smiles: S.xu5p },
    { id: 's7p_g3p', afterStep: 6, beforeStep: 7, name: 'S7P + G3P', smiles: S.s7p }
  ],

  integrations: [
    {
      name: 'NADPH → Glutathione regeneration (RBC antioxidant)',
      fromStep: 1,
      toCycle: 'Glutathione system',
      path: { en: '2 GSH + H₂O₂ → GSSG + 2 H₂O (glutathione peroxidase). GSSG + NADPH → 2 GSH + NADP+ (glutathione reductase)' },
      note: { en: 'CRITICAL for RBCs — PPP is the only NADPH source. G6PD deficiency → oxidative hemolysis.' }
    },
    {
      name: 'NADPH → Phagocyte respiratory burst',
      fromStep: 1,
      toCycle: 'Phagocyte NADPH oxidase',
      path: { en: 'NADPH oxidase: 2 O₂ + NADPH → 2 O₂⁻ (superoxide) → H₂O₂ → HOCl (myeloperoxidase)' },
      note: { en: 'How neutrophils kill bacteria. CGD (chronic granulomatous disease) = NADPH oxidase defect, not PPP defect — but requires NADPH.' }
    },
    {
      name: 'NADPH → Fatty acid / steroid / cholesterol synthesis',
      fromStep: 1,
      toCycle: 'Lipogenesis',
      path: { en: 'Fatty acid synthase needs NADPH for each elongation cycle. Adrenal/gonad steroidogenesis needs NADPH.' },
      note: { en: 'Why PPP is highly active in liver, adipose, adrenal cortex, lactating mammary gland.' }
    },
    {
      name: 'NADPH → CYP450 (drug metabolism)',
      fromStep: 1,
      toCycle: 'Drug metabolism',
      path: { en: 'Hepatic cytochrome P450 enzymes need NADPH for phase I drug oxidation' },
      note: { en: 'Why liver PPP activity matters for drug clearance.' }
    },
    {
      name: 'Ribose-5-P → Nucleotide synthesis',
      fromStep: 4,
      toCycle: 'Nucleotide biosynthesis',
      path: { en: 'R5P + ATP → (PRPP synthetase) → PRPP → purine/pyrimidine nucleotides' },
      note: { en: 'R5P is the sugar backbone of ALL nucleotides (DNA, RNA, ATP, GTP, NAD+, FAD, CoA).' }
    },
    {
      name: 'Non-oxidative phase ↔ Glycolysis',
      toCycle: 'Glycolysis',
      path: { en: 'F6P ↔ fructose-6-P (glycolysis step 2). G3P ↔ glyceraldehyde-3-P (glycolysis step 6).' },
      note: { en: 'The non-oxidative phase is fully reversible and interchangeable with glycolysis — allows cells to match PPP output to NADPH vs R5P demand.' }
    },
    {
      name: 'Erythrose-4-P → Aromatic AAs / vitamin E',
      fromStep: 7,
      toCycle: 'Aromatic AA synthesis (in plants/bacteria)',
      path: { en: 'E4P + PEP → shikimate pathway → Phe, Tyr, Trp' },
      note: { en: 'Humans cannot synthesize aromatic AAs — this pathway exists in plants and bacteria. Glyphosate targets this.' }
    }
  ],

  bigPicture: {
    en: [
      { k: 'Two products', v: '(1) NADPH — reducing power. (2) Ribose-5-phosphate — nucleotide sugar.' },
      { k: 'Per G6P (oxidative)', v: '1 G6P → 2 NADPH + 1 CO₂ + 1 Ribulose-5-P' },
      { k: 'Two phases', v: 'OXIDATIVE (irreversible, makes NADPH): G6PD → 6PGL → 6PGD. NON-OXIDATIVE (reversible, shuffles sugars): Isomerase, Epimerase, Transketolase, Transaldolase.' },
      { k: 'Rate-limiting step', v: 'G6PD — regulated by [NADP+]/[NADPH] ratio' },
      { k: 'G6PD induction', v: 'Insulin induces G6PD transcription (fed/biosynthetic state)' },
      { k: 'Non-oxidative direction', v: 'Reversible! Adjusts based on demand: need R5P (nucleotides) → run oxidative then isomerase. Need only NADPH → oxidative + shuffle R5P back into glycolysis as F6P + G3P.' },
      { k: 'Transketolase cofactor', v: 'THIAMINE (TPP, vitamin B1). Erythrocyte transketolase activity = classic test for thiamine deficiency.' },
      { k: 'Transaldolase cofactor', v: 'NONE (Schiff base mechanism with lysine)' },
      { k: 'NADPH uses', v: 'Fatty acid synthesis · Cholesterol/steroid synthesis · Glutathione regeneration (antioxidant) · Phagocyte respiratory burst · CYP450 drug metabolism · Maintenance of reduced protein thiols' },
      { k: 'G6PD deficiency', v: 'Most common enzyme deficiency worldwide. X-linked. Protective against malaria. Hemolysis with oxidant stress (fava beans, primaquine, sulfa, dapsone, nitrofurantoin, infections). Heinz bodies + bite cells.' },
      { k: 'Tissues with high PPP activity', v: 'Liver, lactating mammary gland, adrenal cortex, adipose, RBCs, gonads (all synthesize fats/steroids or fight oxidation)' },
      { k: 'Tissues with low PPP activity', v: 'Skeletal muscle — muscle needs ATP (glycolysis), not NADPH (no biosynthesis)' },
      { k: 'Does NOT produce', v: 'ATP (PPP is not an energy pathway)' },
      { k: 'CGD connection', v: 'Chronic granulomatous disease = NADPH oxidase defect (not PPP defect), but the oxidase consumes PPP-made NADPH to make superoxide. Patients get catalase-positive infections (S aureus, Aspergillus).' }
    ]
  },

  questions: [
    { id: 'ppp-q1', difficulty: 'easy', prompt: { en: 'The rate-limiting enzyme of the PPP is:', he: '' }, correct: 'Glucose-6-phosphate dehydrogenase', options: ['Glucose-6-phosphate dehydrogenase', 'Transketolase', '6-Phosphogluconate dehydrogenase', 'Transaldolase'] },
    { id: 'ppp-q2', difficulty: 'easy', prompt: { en: 'Per G6P entering the oxidative phase, how many NADPH are produced?', he: '' }, correct: '2', options: ['2', '1', '3', '4'] },
    { id: 'ppp-q3', difficulty: 'medium', prompt: { en: 'G6PD activity is primarily regulated by:', he: '' }, correct: '[NADP+]/[NADPH] ratio', options: ['[NADP+]/[NADPH] ratio', '[ATP]/[ADP] ratio', 'Cortisol', 'Glucagon via PKA'] },
    { id: 'ppp-q4', difficulty: 'hard', prompt: { en: 'Transketolase requires which vitamin cofactor?', he: '' }, correct: 'B1 (thiamine/TPP)', options: ['B1 (thiamine/TPP)', 'B6 (PLP)', 'B12 (cobalamin)', 'B7 (biotin)'] },
    { id: 'ppp-q5', difficulty: 'medium', prompt: { en: 'G6PD deficiency is inherited in a pattern of:', he: '' }, correct: 'X-linked recessive', options: ['X-linked recessive', 'Autosomal recessive', 'Autosomal dominant', 'Mitochondrial'] },
    { id: 'ppp-q6', difficulty: 'hard', prompt: { en: 'Heinz bodies and bite cells on a blood smear suggest:', he: '' }, correct: 'G6PD deficiency', options: ['G6PD deficiency', 'Pyruvate kinase deficiency', 'Iron deficiency', 'Lead poisoning'] },
    { id: 'ppp-q7', difficulty: 'medium', prompt: { en: 'NADPH is required for all EXCEPT:', he: '' }, correct: 'Glycolysis', options: ['Glycolysis', 'Fatty acid synthesis', 'Glutathione regeneration', 'Phagocyte respiratory burst'] },
    { id: 'ppp-q8', difficulty: 'hard', prompt: { en: 'A cell needs lots of ribose-5-P but not NADPH. Which phase(s) are active?', he: '' }, correct: 'Non-oxidative only (in reverse)', options: ['Non-oxidative only (in reverse)', 'Oxidative only', 'Both phases equally', 'PPP is not used for R5P'] },
    { id: 'ppp-q9', difficulty: 'medium', prompt: { en: 'Which molecule is directly a precursor for nucleotide biosynthesis?', he: '' }, correct: 'Ribose-5-phosphate', options: ['Ribose-5-phosphate', 'Ribulose-5-phosphate', 'Erythrose-4-P', 'Sedoheptulose-7-P'] },
    { id: 'ppp-q10', difficulty: 'hard', prompt: { en: 'Why do RBCs especially depend on the PPP?', he: '' }, correct: 'Only source of NADPH for glutathione', options: ['Only source of NADPH for glutathione', 'Only source of ATP', 'Only source of R5P', 'Required for heme synthesis'] },
    { id: 'ppp-q11', difficulty: 'medium', prompt: { en: 'Which of these drugs can trigger hemolysis in G6PD deficiency?', he: '' }, correct: 'Primaquine', options: ['Primaquine', 'Acetaminophen', 'Metformin', 'Omeprazole'] },
    { id: 'ppp-q12', difficulty: 'hard', prompt: { en: 'In the non-oxidative phase, the ONLY products that re-enter glycolysis are:', he: '' }, correct: 'F6P and G3P', options: ['F6P and G3P', 'R5P and Xu5P', 'S7P and E4P', 'G6P and F1,6BP'] },
    { id: 'ppp-q13', difficulty: 'medium', prompt: { en: 'PPP activity is LOWEST in which tissue?', he: '' }, correct: 'Skeletal muscle', options: ['Skeletal muscle', 'Liver', 'Adrenal cortex', 'RBCs'] },
    { id: 'ppp-q14', difficulty: 'hard', prompt: { en: 'Chronic granulomatous disease (CGD) is caused by defects in:', he: '' }, correct: 'NADPH oxidase (not PPP itself)', options: ['NADPH oxidase (not PPP itself)', 'G6PD', 'Transketolase', 'Glutathione peroxidase'] }
  ]
};
