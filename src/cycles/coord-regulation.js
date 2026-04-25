// ============================================================
// COORDINATED REGULATION OF GLYCOLYSIS & GLUCONEOGENESIS
// How opposing pathways avoid futile cycling
// ============================================================

const S = {
  g6p:        'OCC1OC(OP(O)(O)=O)C(O)C(O)C1O',
  f6p:        'OCC1(O)OC(COP(O)(O)=O)C(O)C1O',
  f16bp:      'O=P(O)(O)OCC1OC(OCC)C(O)C1O',
  f26bp:      'O=P(O)(O)OCC1OC(OP(O)(O)=O)C(O)C1O',
  pep:        'OC(=O)C(=C)OP(O)(O)=O',
  pyruvate:   'CC(=O)C(=O)O',
  oaa:        'OC(=O)CC(=O)C(=O)O',
  glucose:    'OCC1OC(O)C(O)C(O)C1O',
  camp:       'Nc1ncnc2n(cnc12)C3OC4COP(=O)(O)OC4C3O',
  atp:        'Nc1ncnc2n(cnc12)C3OC(COP(O)(=O)OP(O)(=O)OP(O)(=O)O)C(O)C3O'
};

const noReg = { activators: [], inhibitors: [], summary: { en: 'Regulation is the point — see each step\'s details.' } };

export const coordRegCycle = {
  id: 'coord-reg',
  chapter: 'Carbohydrate Metabolism',
  chapterOrder: 1,
  order: 5,
  layout: 'linear',
  title: { en: 'Coordinated Regulation (Glycolysis ↔ Gluconeogenesis)', he: 'ויסות מתואם' },
  subtitle: { en: 'How the cell toggles between burning glucose and making it', he: 'כיצד התא עובר בין פירוק גלוקוז וייצורו' },

  context: {
    tissue: { en: 'Liver is the main site where both pathways coexist — the hepatocyte must decide which to run based on whole-body fuel state.' },
    otherTissues: { en: 'Muscle lacks gluconeogenesis enzymes (G6Pase, PEPCK, F1,6-BPase) — always only glycolysis. Brain always needs glycolysis.' },
    state: { en: 'FED (post-meal): glycolysis ON, gluconeogenesis OFF. FASTING (>4h): gluconeogenesis ON, glycolysis OFF in liver. EXERCISE: glycolysis up in muscle, gluconeogenesis up in liver (Cori cycle).' },
    stateHormonal: { en: 'Insulin → fed state → glycolysis ON. Glucagon (liver-only!) + Epinephrine (liver + muscle) → fasting/stress state → gluconeogenesis ON in liver, glycogenolysis in both. Cortisol → long-term gluconeogenic induction.' },
    turnover: { en: 'Seconds: allosteric (F2,6BP, AMP, ATP, citrate). Minutes: covalent (PKA phosphorylation of enzymes). Hours-days: transcriptional (insulin/glucagon change enzyme levels).' }
  },

  overview: {
    en: `Glycolysis and gluconeogenesis share 7 reversible enzymes but differ at 3 irreversible steps, each bypassed by specific gluconeogenesis enzymes. This creates 4 reciprocally-regulated enzyme pairs (or triples) where simultaneous activation would be FUTILE CYCLING (ATP wasted with no net flux). The cell uses layered regulation to ensure only one direction runs at a time. (1) HEXOKINASE/GLUCOKINASE ↔ GLUCOSE-6-PHOSPHATASE: in liver, glucokinase is induced by insulin (fed) and responds to high glucose; G6Pase is induced by glucagon/cortisol. (2) PFK-1 ↔ FRUCTOSE-1,6-BISPHOSPHATASE: the MASTER switch via FRUCTOSE-2,6-BISPHOSPHATE. F2,6BP activates PFK-1 and inhibits F1,6-BPase. F2,6BP is made/degraded by the bifunctional enzyme PFK-2/FBPase-2: glucagon → PKA phosphorylates it → FBPase activity dominates → F2,6BP drops → gluconeogenesis wins. Insulin → PP1 dephosphorylates → PFK-2 active → F2,6BP rises → glycolysis wins. (3) PYRUVATE KINASE ↔ PYRUVATE CARBOXYLASE + PEPCK: liver PK is phosphorylated/inactivated by glucagon/PKA (so liver doesn't eat the glucose it's making); PC is activated by acetyl-CoA (signal of fasting β-oxidation); PEPCK is transcriptionally induced by glucagon/cortisol. (4) The net result: a tight integration where one hormonal signal (insulin or glucagon) flips multiple enzymes at once — ensuring glucose is either being BURNED or MADE, never both wastefully.`
  },

  storyFrame: {
    en: {
      title: 'The Reciprocal Switch',
      setting: 'Imagine four 3-way switches along a single corridor. Each switch connects an opposing enzyme pair. One master control (insulin vs glucagon) flips all four switches in lockstep — either all toward glycolysis (fed) or all toward gluconeogenesis (fasting). The most elegant switch is F2,6BP: one tiny molecule that activates PFK-1 AND inhibits F1,6-BPase at the same time.',
      characters: [
        { name: 'HK/GK ↔ G6Pase', role: 'Gate switch (entry/exit)', icon: '🚪', color: '#dc2626' },
        { name: 'PFK-1 ↔ F1,6-BPase', role: 'Master switch (F2,6BP)', icon: '🎛️', color: '#f59e0b' },
        { name: 'PK ↔ PC+PEPCK', role: 'Commitment switch', icon: '💡', color: '#65a30d' },
        { name: 'F2,6BP', role: 'The molecular toggle', icon: '⚡', color: '#2563eb' }
      ]
    }
  },

  mnemonic: {
    en: { phrase: 'Hormones → F2,6BP → everything: Insulin↑F2,6BP↑→PFK-1 ON, F1,6BPase OFF → glycolysis. Glucagon↓F2,6BP↓→opposite', breakdown: '3 irreversible steps in each direction. 4 reciprocal pairs. 1 master regulator: F2,6BP.' }
  },

  compartments: {
    cyto: { en: 'Hepatocyte', he: 'תא כבד', color: '#dbeafe', accent: '#3b82f6' }
  },

  steps: [
    {
      id: 1,
      compartment: 'cyto',
      phase: 'entry',
      linearPos: 0,
      enzyme: {
        abbr: 'HK/GK vs G6Pase',
        name: 'Hexokinase/Glucokinase vs Glucose-6-Phosphatase',
        ec: '2.7.1.1 / 2.7.1.2 vs 3.1.3.9',
        class: 'Reciprocal pair',
        he: ''
      },
      substrates: [{ key: 'glucose', name: 'Glucose ⇌ G6P', smiles: S.glucose, isSource: true, stoich: 1 }],
      cofactors: [],
      products: [{ key: 'g6p', name: 'G6P (or free glucose out)', smiles: S.g6p, isMain: true, stoich: 1 }],
      deltaG: 'Each direction irreversible in its own pathway',
      reversible: false,
      regulation: {
        activators: [
          { name: 'Insulin (induces GK)', type: 'transcriptional', critical: true },
          { name: 'Fructose-1-P (releases GK from GKRP — Glucokinase Regulatory Protein)', type: 'allosteric' }
        ],
        inhibitors: [
          { name: 'Glucagon (suppresses GK, induces G6Pase)', type: 'transcriptional', critical: true }
        ],
        summary: { en: 'Switch #1 (ENTRY/EXIT): Glucokinase (liver) phosphorylates glucose when blood is high (post-meal) — has high Km, not inhibited by G6P. G6Pase runs in the opposite direction, releasing free glucose to blood. G6Pase is located in the ER membrane (unique!) and is ONLY in liver + kidney cortex. Muscle cannot dephosphorylate G6P → muscle keeps its glucose.' }
      },
      story: { en: 'At the entry/exit of carbohydrate metabolism, GK and G6Pase face opposite directions. Insulin induces GK (fed: trap glucose inside the cell). Glucagon suppresses GK and induces G6Pase (fasting: release glucose to blood). Transcriptional time-scale regulation (hours-days), layered onto faster allosteric signals (F1-P, GKRP).' },
      clinical: {
        disorder: 'Von Gierke disease (GSD Ia) — G6Pase deficiency',
        inheritance: 'Autosomal recessive',
        findings: { en: 'Severe fasting hypoglycemia + hepatomegaly + lactic acidosis + hyperuricemia + hypertriglyceridemia. Liver cannot release glucose from glycogen OR gluconeogenesis.' },
        treatment: { en: 'Frequent cornstarch feedings to prevent hypoglycemia. Avoid fasting completely.' }
      },
      beats: {
        en: [
          { t: 0, text: 'Fed state: blood glucose high.', highlight: 'substrate' },
          { t: 2500, text: 'Insulin induces GK transcription; glucose → G6P.', highlight: 'enzyme' },
          { t: 5000, text: 'Fasting: glucagon/cortisol induce G6Pase; G6P → glucose → blood.', highlight: 'product' }
        ]
      }
    },
    {
      id: 2,
      compartment: 'cyto',
      phase: 'master',
      linearPos: 1,
      enzyme: {
        abbr: 'PFK-1 vs F1,6-BPase',
        name: 'PFK-1 vs Fructose-1,6-bisphosphatase (THE master switch)',
        ec: '2.7.1.11 vs 3.1.3.11',
        class: 'Reciprocal pair',
        he: ''
      },
      substrates: [{ key: 'f6p', name: 'F6P ⇌ F1,6BP', smiles: S.f6p, stoich: 1 }],
      cofactors: [],
      products: [{ key: 'f16bp', name: 'F1,6BP (glycolysis) OR F6P (gluconeogenesis)', smiles: S.f16bp, isMain: true, stoich: 1 }],
      deltaG: '—',
      reversible: false,
      regulation: {
        activators: [
          { name: 'F2,6BP (activates PFK-1, inhibits F1,6-BPase)', type: 'MASTER', critical: true, note: { en: 'THE key integration molecule. Made by PFK-2, destroyed by FBPase-2 (same bifunctional enzyme).' } },
          { name: 'AMP (activates PFK-1)', type: 'allosteric' },
          { name: 'Citrate (activates F1,6-BPase)', type: 'allosteric', note: { en: 'High citrate = TCA full = make glucose, not burn it' } }
        ],
        inhibitors: [
          { name: 'ATP + Citrate (inhibit PFK-1)', type: 'allosteric' },
          { name: 'F2,6BP + AMP (inhibit F1,6-BPase)', type: 'allosteric', critical: true }
        ],
        summary: { en: 'Switch #2 (MASTER): F2,6BP is the central regulator. Insulin → PFK-2 dephosphorylated → F2,6BP made → PFK-1 active, F1,6-BPase inhibited → glycolysis. Glucagon → PKA phosphorylates PFK-2/FBPase-2 → FBPase-2 activity dominates → F2,6BP destroyed → opposite. One molecule, two reciprocal effects.' }
      },
      story: { en: 'This is THE switch. PFK-1 (glycolysis) vs F1,6-BPase (gluconeogenesis). The master dial is F2,6BP — a unique regulatory molecule that simultaneously TURNS ON PFK-1 AND TURNS OFF F1,6-BPase. F2,6BP is made by PFK-2 and destroyed by FBPase-2, but those two activities live in a SINGLE bifunctional enzyme. Glucagon-PKA phosphorylates the enzyme → it switches from kinase (making F2,6BP) to phosphatase (destroying F2,6BP). One hormone, one phosphorylation event, two pathways flipped.' },
      clinical: {
        disorder: 'Fructose-1,6-bisphosphatase Deficiency',
        inheritance: 'Autosomal recessive',
        findings: { en: 'Gluconeogenesis blocked. Fasting hypoglycemia + LACTIC ACIDOSIS (lactate piles up, can\'t become glucose). Worse with fructose intake.' },
        treatment: { en: 'Avoid fasting and fructose. Frequent carbohydrate feeds.' }
      },
      beats: {
        en: [
          { t: 0, text: 'The liver senses the fed/fasting state.', highlight: 'substrate' },
          { t: 2500, text: 'Insulin: PFK-2 active → F2,6BP high → PFK-1 ON, F1,6-BPase OFF.', highlight: 'enzyme' },
          { t: 5000, text: 'Glucagon: PKA phosphorylates → F2,6BP low → gluconeogenesis wins.', highlight: 'energy' },
          { t: 7500, text: 'One molecule (F2,6BP) controls both enzymes reciprocally.', highlight: 'product' }
        ]
      }
    },
    {
      id: 3,
      compartment: 'cyto',
      phase: 'commit',
      linearPos: 2,
      enzyme: {
        abbr: 'PK vs PC+PEPCK',
        name: 'Pyruvate Kinase vs Pyruvate Carboxylase + PEPCK',
        ec: '2.7.1.40 vs 6.4.1.1 + 4.1.1.32',
        class: 'Reciprocal triad',
        he: ''
      },
      substrates: [{ key: 'pep', name: 'PEP ⇌ Pyruvate', smiles: S.pep, stoich: 1 }],
      cofactors: [],
      products: [{ key: 'pyruvate', name: 'Pyruvate (glycolysis) OR PEP via OAA (gluconeogenesis)', smiles: S.pyruvate, isMain: true, stoich: 1 }],
      deltaG: '—',
      reversible: false,
      regulation: {
        activators: [
          { name: 'F1,6BP (activates PK)', type: 'feed-forward', note: { en: 'If upstream PFK-1 is on, push PK too' } },
          { name: 'Insulin (dephosphorylates PK, activates)', type: 'covalent', critical: true },
          { name: 'Acetyl-CoA (activates PC)', type: 'allosteric', critical: true, note: { en: 'Fasting signal: β-ox generates acetyl-CoA → activates PC → gluconeogenesis' } },
          { name: 'Glucagon/cortisol (induce PEPCK)', type: 'transcriptional', critical: true }
        ],
        inhibitors: [
          { name: 'Glucagon/PKA (phosphorylates PK-L, inactivates)', type: 'covalent', critical: true, note: { en: 'Liver-only! Prevents liver from eating the glucose it\'s making' } },
          { name: 'ATP, alanine (inhibit PK)', type: 'allosteric' }
        ],
        summary: { en: 'Switch #3 (COMMITMENT): PK (forward) is inactivated in liver by glucagon-PKA phosphorylation — classic example of tissue-specific regulation. Meanwhile, PC is activated by acetyl-CoA (fasting signal from β-oxidation) and PEPCK is transcriptionally induced by glucagon/cortisol over hours. Together: pyruvate → OAA → PEP → glucose.' }
      },
      story: { en: 'The final commitment. In muscle, PK is always active (no hormonal brake — muscle always wants ATP). In LIVER, PK-L is uniquely phosphorylated by glucagon-PKA → OFF — so the liver doesn\'t eat the glucose it\'s making for everyone else. On the other side, PC sees high acetyl-CoA (from β-oxidation in fasting) and switches on, while PEPCK is induced transcriptionally. Three enzymes, one coordinated outcome.' },
      clinical: {
        disorder: 'PEPCK deficiency; Pyruvate Kinase deficiency (hemolytic anemia)',
        inheritance: 'Autosomal recessive',
        findings: { en: 'PEPCK: severe fasting hypoglycemia, lactic acidosis, hepatomegaly. PK (RBC isoform): 2nd most common enzymatic hemolytic anemia — RBCs depend on glycolysis for ATP.' },
        treatment: { en: 'PEPCK: frequent feeding. PK deficiency: transfusions, splenectomy; mitapivat (PK activator).' }
      },
      beats: {
        en: [
          { t: 0, text: 'Fed: insulin → PK dephosphorylated → active → glycolysis finishes.', highlight: 'substrate' },
          { t: 2500, text: 'Fasting: glucagon-PKA phosphorylates PK-L → OFF.', highlight: 'enzyme' },
          { t: 5000, text: 'Acetyl-CoA (from β-ox) activates PC → pyruvate → OAA.', highlight: 'energy' },
          { t: 7500, text: 'PEPCK (induced by glucagon) → PEP → glucose.', highlight: 'product' }
        ]
      }
    },
    {
      id: 4,
      compartment: 'cyto',
      phase: 'integration',
      linearPos: 3,
      enzyme: {
        abbr: 'F2,6BP System',
        name: 'PFK-2/FBPase-2 — the bifunctional enzyme',
        ec: '2.7.1.105 / 3.1.3.46',
        class: 'Bifunctional',
        he: ''
      },
      substrates: [{ key: 'f6p_fbp', name: 'F6P ⇌ F2,6BP', smiles: S.f6p, stoich: 1 }],
      cofactors: [],
      products: [{ key: 'f26bp', name: 'F2,6BP — master regulatory molecule', smiles: S.f26bp, isMain: true, stoich: 1 }],
      deltaG: '—',
      reversible: true,
      regulation: {
        activators: [{ name: 'Insulin (dephosphorylates PFK-2)', type: 'covalent', critical: true }],
        inhibitors: [{ name: 'Glucagon-PKA (phosphorylates)', type: 'covalent', critical: true }],
        summary: { en: 'This IS the regulation. Single polypeptide with BOTH a kinase (PFK-2, makes F2,6BP) and phosphatase (FBPase-2, destroys F2,6BP) domain. Phosphorylation by PKA flips which domain is active: dephospho = kinase dominates (insulin/fed); phospho = phosphatase dominates (glucagon/fasting). F2,6BP then enacts reciprocal control on PFK-1 and F1,6-BPase.' }
      },
      story: { en: 'The true master is this bifunctional enzyme. Two catalytic domains — one makes F2,6BP, one destroys it — on the same polypeptide. PKA phosphorylation flips which domain wins. Tissue-specific isoforms: liver (L-type, hormonally regulated), heart (H-type, always active — heart needs glucose), muscle (M-type, activated by fructose-6-P). Liver\'s F2,6BP fluctuations set the body\'s metabolic tone.' },
      clinical: null,
      beats: {
        en: [
          { t: 0, text: 'Insulin rising (fed state).', highlight: 'substrate' },
          { t: 2500, text: 'PP1 dephosphorylates PFK-2/FBPase-2 → kinase domain wins.', highlight: 'enzyme' },
          { t: 5000, text: 'F2,6BP accumulates → PFK-1 activated, F1,6-BPase inhibited.', highlight: 'energy' },
          { t: 7500, text: 'Glucagon reverses: PKA phosphorylates → phosphatase wins → F2,6BP falls.', highlight: 'product' }
        ]
      }
    },
    {
      id: 5,
      compartment: 'cyto',
      phase: 'whole-body',
      linearPos: 4,
      enzyme: {
        abbr: 'Whole-body',
        name: 'Integration Across Organs',
        ec: '',
        class: 'Inter-organ',
        he: ''
      },
      substrates: [{ key: 'integration', name: 'Whole-body fuel economy', smiles: '', stoich: 1 }],
      cofactors: [],
      products: [{ key: 'homeostasis', name: 'Blood glucose homeostasis', smiles: '', isMain: true, stoich: 1 }],
      deltaG: '—',
      reversible: false,
      regulation: { activators: [], inhibitors: [], summary: { en: 'This "step" summarizes inter-organ integration.' } },
      story: { en: 'Liver orchestrates; tissues consume. Muscle does glycolysis (→ lactate or alanine when stressed). Brain is obligate glucose consumer (~120g/day). RBCs are obligate glycolytic (→ lactate). Adipose stores FA. During fasting, liver becomes the factory: breaks glycogen → makes glucose from lactate (Cori), alanine (glucose-alanine), glycerol (from TG), and odd-chain FA → feeds brain. During fed state, reverses: stores glycogen, makes TG, shuts down gluconeogenesis.' },
      clinical: {
        disorder: 'Whole-body fuel handling disorders',
        inheritance: 'Variable',
        findings: { en: 'Untreated Type 1 diabetes: no insulin → liver treats every moment as "fasting" → gluconeogenesis + ketogenesis + glycogenolysis all ON → hyperglycemia + DKA. Type 2 diabetes: hepatic insulin resistance → liver continues to make glucose despite high insulin.' },
        treatment: { en: 'Insulin replacement (Type 1). Metformin (suppresses hepatic gluconeogenesis) + lifestyle ± sulfonylureas / GLP-1 / SGLT2 etc. (Type 2).' }
      },
      beats: {
        en: [
          { t: 0, text: 'Liver reads insulin/glucagon ratio.', highlight: 'substrate' },
          { t: 2500, text: 'Fed: store (glycogen + fat), consume glucose locally.', highlight: 'enzyme' },
          { t: 5000, text: 'Fasting: release glucose, make more, fuel brain.', highlight: 'energy' },
          { t: 7500, text: 'All orchestrated by the 4 reciprocal switches above.', highlight: 'carrier' }
        ]
      }
    }
  ],

  intermediates: [
    { id: 'g6p_cr', afterStep: 1, beforeStep: 2, name: 'G6P', smiles: S.g6p },
    { id: 'fbp_cr', afterStep: 2, beforeStep: 3, name: 'F1,6BP / F6P', smiles: S.f16bp },
    { id: 'pyr_cr', afterStep: 3, beforeStep: 4, name: 'Pyruvate / PEP', smiles: S.pyruvate },
    { id: 'f26bp_cr', afterStep: 4, beforeStep: 5, name: 'F2,6BP (master signal)', smiles: S.f26bp, carrier: true }
  ],

  integrations: [
    {
      name: 'Link to Glycolysis',
      toCycle: 'Glycolysis',
      path: { en: 'Insulin → F2,6BP ↑ → PFK-1 ON → full glycolytic flux' },
      note: { en: 'See Glycolysis cycle for enzyme details.' }
    },
    {
      name: 'Link to Gluconeogenesis',
      toCycle: 'Gluconeogenesis',
      path: { en: 'Glucagon → F2,6BP ↓ + PEPCK induction → gluconeogenesis' },
      note: { en: 'See Gluconeogenesis cycle for enzyme details.' }
    },
    {
      name: 'Cori cycle (lactate shuttle)',
      toCycle: 'Gluconeogenesis',
      path: { en: 'Muscle lactate → liver glucose → muscle. Net: 4 ATP cost to the body per turn.' },
      note: { en: 'Active during intense exercise.' }
    },
    {
      name: 'Glucose-alanine cycle (N shuttle)',
      toCycle: 'Gluconeogenesis + Urea',
      path: { en: 'Muscle alanine (carries N) → liver pyruvate + glutamate → urea + glucose.' },
      note: { en: 'Dual-purpose: nitrogen disposal + glucose source during prolonged fasting.' }
    },
    {
      name: 'Acetyl-CoA as the fasting signal',
      toCycle: 'β-oxidation',
      path: { en: 'Fasting → β-ox active → high acetyl-CoA → activates PC (gluconeogenesis) + inhibits PDH (preserves pyruvate)' },
      note: { en: 'Elegant: one signal molecule pushes metabolism toward glucose synthesis.' }
    },
    {
      name: 'F2,6BP tissue isoforms',
      toCycle: 'Other tissues',
      path: { en: 'Liver PFK-2/FBPase-2: hormonally regulated (opposite state). Heart: always active (never fasts). Muscle: activated by F6P (substrate-driven).' },
      note: { en: 'Explains why heart never does gluconeogenesis and muscle glycolysis responds to substrate.' }
    },
    {
      name: 'Type 2 diabetes connection',
      toCycle: 'Clinical',
      path: { en: 'Hepatic insulin resistance → F2,6BP fails to rise after meals → gluconeogenesis persists → hyperglycemia.' },
      note: { en: 'Metformin\'s main action: suppress hepatic gluconeogenesis (partial mechanism via AMPK activation).' }
    }
  ],

  bigPicture: {
    en: [
      { k: 'Core concept', v: 'Glycolysis and gluconeogenesis share 7 enzymes but differ at 3 irreversible steps. Reciprocal regulation prevents futile cycling.' },
      { k: '3 irreversible glycolysis steps', v: 'Hexokinase/GK, PFK-1, PK' },
      { k: '4 gluconeogenesis bypasses', v: 'PC + PEPCK (bypass PK), F1,6-BPase (bypass PFK-1), G6Pase (bypass HK/GK)' },
      { k: '4 reciprocal switches', v: '(1) HK/GK ↔ G6Pase. (2) PFK-1 ↔ F1,6-BPase. (3) PK ↔ PC+PEPCK. (4) F2,6BP master system.' },
      { k: 'Master regulator', v: 'F2,6BP — activates PFK-1, inhibits F1,6-BPase simultaneously.' },
      { k: 'F2,6BP is made/destroyed by', v: 'PFK-2/FBPase-2 — a bifunctional enzyme. Phosphorylation by PKA flips which domain is active.' },
      { k: 'Insulin effect on F2,6BP', v: 'PP1 dephosphorylates PFK-2 → kinase active → F2,6BP ↑ → glycolysis' },
      { k: 'Glucagon effect on F2,6BP', v: 'PKA phosphorylates PFK-2 → phosphatase (FBPase-2) active → F2,6BP ↓ → gluconeogenesis' },
      { k: 'Acetyl-CoA as fasting signal', v: '↑ from β-oxidation → activates PC (gluconeogenesis) + inhibits PDH (saves pyruvate). Integrates fat catabolism with glucose production.' },
      { k: 'Liver PK (unique)', v: 'PK-L is phosphorylated/inactivated by glucagon-PKA. Prevents liver from eating the glucose it makes. Muscle PK is NOT regulated this way.' },
      { k: 'Tissue specificity', v: 'Liver = both pathways. Muscle = only glycolysis (no G6Pase, PEPCK, F1,6-BPase). Brain = always glycolysis. Kidney cortex = also does gluconeogenesis.' },
      { k: 'Cori cycle', v: 'Muscle lactate → liver → glucose → muscle. Net 4 ATP cost to body per cycle.' },
      { k: 'Glucose-alanine cycle', v: 'Muscle alanine → liver → pyruvate + glutamate → urea + glucose.' },
      { k: 'Metformin', v: 'Suppresses hepatic gluconeogenesis (partial via AMPK). Lactic acidosis is rare but serious side effect.' },
      { k: 'Type 1 diabetes pathophysiology', v: 'No insulin → hepatic gluconeogenesis unrestrained + ketogenesis → hyperglycemia + DKA' },
      { k: 'Type 2 diabetes pathophysiology', v: 'Hepatic insulin resistance → liver keeps producing glucose despite high insulin/glucose → fasting hyperglycemia' },
      { k: 'Clinical pearl', v: 'In evaluating hypoglycemia + lactic acidosis, think: Von Gierke, F1,6-BPase def, ethanol, thiamine def, sepsis. All share NADH redox or gluconeogenesis block.' }
    ]
  },

  questions: [
    { id: 'cr-q1', difficulty: 'easy', prompt: { en: 'The master regulatory molecule for glycolysis/gluconeogenesis reciprocal control is:', he: '' }, correct: 'Fructose-2,6-bisphosphate (F2,6BP)', options: ['Fructose-2,6-bisphosphate (F2,6BP)', 'Citrate', 'AMP', 'ATP'] },
    { id: 'cr-q2', difficulty: 'medium', prompt: { en: 'F2,6BP has what effect on PFK-1 and F1,6-BPase?', he: '' }, correct: 'Activates PFK-1, inhibits F1,6-BPase', options: ['Activates PFK-1, inhibits F1,6-BPase', 'Inhibits both', 'Activates both', 'Inhibits PFK-1, activates F1,6-BPase'] },
    { id: 'cr-q3', difficulty: 'medium', prompt: { en: 'Glucagon\'s effect on hepatic F2,6BP levels is:', he: '' }, correct: 'Decreases F2,6BP (via PKA → phosphorylates PFK-2/FBPase-2 → phosphatase dominates)', options: ['Decreases F2,6BP (via PKA → phosphorylates PFK-2/FBPase-2 → phosphatase dominates)', 'Increases F2,6BP', 'No effect', 'Increases F1,6BP'] },
    { id: 'cr-q4', difficulty: 'hard', prompt: { en: 'The bifunctional enzyme that makes and destroys F2,6BP is:', he: '' }, correct: 'PFK-2/FBPase-2', options: ['PFK-2/FBPase-2', 'PFK-1', 'F1,6-BPase', 'Aldolase'] },
    { id: 'cr-q5', difficulty: 'medium', prompt: { en: 'Acetyl-CoA allosterically activates:', he: '' }, correct: 'Pyruvate carboxylase (and inhibits PDH)', options: ['Pyruvate carboxylase (and inhibits PDH)', 'PFK-1', 'PK', 'G6Pase'] },
    { id: 'cr-q6', difficulty: 'hard', prompt: { en: 'Why is liver PK (PK-L) uniquely regulated by glucagon-PKA phosphorylation?', he: '' }, correct: 'To prevent the liver from consuming the glucose it is making for the body', options: ['To prevent the liver from consuming the glucose it is making for the body', 'Because liver has no PK', 'To make PK more efficient', 'Because muscle is different'] },
    { id: 'cr-q7', difficulty: 'medium', prompt: { en: 'Muscle cannot perform gluconeogenesis because it lacks:', he: '' }, correct: 'G6Pase, PEPCK, F1,6-BPase', options: ['G6Pase, PEPCK, F1,6-BPase', 'Pyruvate carboxylase only', 'Glucokinase', 'PK'] },
    { id: 'cr-q8', difficulty: 'hard', prompt: { en: 'Metformin\'s main glucose-lowering mechanism is:', he: '' }, correct: 'Suppression of hepatic gluconeogenesis', options: ['Suppression of hepatic gluconeogenesis', 'Increased insulin secretion', 'Increased renal glucose excretion', 'Blockade of intestinal glucose absorption'] },
    { id: 'cr-q9', difficulty: 'medium', prompt: { en: 'The Cori cycle transfers which molecule from muscle to liver?', he: '' }, correct: 'Lactate', options: ['Lactate', 'Pyruvate', 'Glucose', 'Alanine'] },
    { id: 'cr-q10', difficulty: 'hard', prompt: { en: 'A fasting patient develops high acetyl-CoA. This will:', he: '' }, correct: 'Activate pyruvate carboxylase and inhibit PDH', options: ['Activate pyruvate carboxylase and inhibit PDH', 'Activate PDH', 'Inhibit PC', 'Activate PK-L'] },
    { id: 'cr-q11', difficulty: 'easy', prompt: { en: 'In the fed state, which pathway is ON?', he: '' }, correct: 'Glycolysis', options: ['Glycolysis', 'Gluconeogenesis', 'Both', 'Neither'] },
    { id: 'cr-q12', difficulty: 'hard', prompt: { en: 'The glucose-alanine cycle\'s dual purpose is:', he: '' }, correct: 'Moves nitrogen from muscle to liver AND provides carbon for gluconeogenesis', options: ['Moves nitrogen from muscle to liver AND provides carbon for gluconeogenesis', 'Moves ATP between tissues', 'Regenerates NAD⁺ in muscle', 'Makes glycogen'] }
  ]
};
