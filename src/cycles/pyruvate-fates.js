// ============================================================
// FATES OF PYRUVATE — 5 fates from the crossroads molecule
// PDH (acetyl-CoA), LDH (lactate), ALT (alanine), PC (OAA), + ethanol connection
// ============================================================

const S = {
  pyruvate:   'CC(=O)C(=O)O',
  acetylCoA:  'CC(=O)S',
  lactate:    'CC(O)C(=O)O',
  alanine:    'CC(N)C(=O)O',
  oaa:        'OC(=O)CC(=O)C(=O)O',
  ethanol:    'CCO',
  acetaldehyde:'CC=O',
  nadh:       'NC(=O)C1=CN(C=CC1)C2OC(CO)C(O)C2O',
  nad:        'NC(=O)c1ccc[n+](c1)C2OC(CO)C(O)C2O',
  atp:        'Nc1ncnc2n(cnc12)C3OC(COP(O)(=O)OP(O)(=O)OP(O)(=O)O)C(O)C3O',
  adp:        'Nc1ncnc2n(cnc12)C3OC(COP(O)(=O)OP(O)(=O)O)C(O)C3O',
  coa:        'CC(C)(COP(O)(=O)OP(O)(=O)OCC1OC(n2cnc3c(N)ncnc23)C(O)C1OP(O)(O)=O)C(O)C(=O)NCCC(=O)NCCS',
  co2:        'O=C=O'
};

const noReg = { activators: [], inhibitors: [], summary: { en: 'Flux determined by substrate availability.' } };

export const pyruvateFatesCycle = {
  id: 'pyruvate-fates',
  chapter: 'Carbohydrate Metabolism',
  chapterOrder: 1,
  order: 4,
  layout: 'circular',
  title: { en: 'Fates of Pyruvate', he: 'גורלות הפירובט' },
  subtitle: { en: 'The crossroads: pyruvate → acetyl-CoA / lactate / alanine / OAA / ethanol', he: 'פירובט כצומת דרכים' },

  context: {
    tissue: { en: 'All tissues generate pyruvate. The fate depends on: (a) O₂ availability, (b) tissue enzyme expression, (c) metabolic state.' },
    otherTissues: { en: 'Aerobic tissues → acetyl-CoA (via PDH). RBCs / hypoxic muscle → lactate. Muscle in fasting → alanine (to liver). Liver fasting → OAA (gluconeogenesis).' },
    state: { en: 'FED aerobic: pyruvate → acetyl-CoA → TCA. FASTING/ANAEROBIC: pyruvate → lactate (RBC, muscle). FASTING muscle → alanine export. LIVER fasting → OAA for gluconeogenesis.' },
    stateHormonal: { en: 'Insulin activates PDH (dephosphorylated by PDH phosphatase). Glucagon & starvation → PDH kinase phosphorylates and INACTIVATES PDH (keeps pyruvate available for gluconeogenesis).' },
    turnover: { en: 'Seconds via phosphorylation of PDH. Minutes via acetyl-CoA/NADH feedback.' }
  },

  overview: {
    en: `Pyruvate sits at a central crossroads of metabolism with FIVE major fates, each selected by tissue and metabolic state: (1) ACETYL-COA via the PDH complex — irreversible entry into TCA for aerobic ATP. PDH is a massive multienzyme complex (E1, E2, E3) requiring FIVE cofactors: TPP (B1), lipoate, CoA (B5), FAD (B2), NAD+ (B3). Rate-regulated by phosphorylation: insulin/Ca²⁺/pyruvate dephosphorylate (activate); acetyl-CoA/NADH/ATP phosphorylate (inactivate). (2) LACTATE via LDH — anaerobic fate that regenerates NAD+ so glycolysis can continue. Essential in RBCs (no mitochondria) and sprinting muscle. Liver recycles it (Cori cycle). (3) ALANINE via ALT transamination — muscle exports nitrogen + carbon to liver during fasting. (4) OXALOACETATE via pyruvate carboxylase (biotin) — the anaplerotic and gluconeogenic entry point. (5) ETHANOL connection — ethanol metabolism (via ADH → acetaldehyde → ALDH → acetate → acetyl-CoA) generates NADH that shifts pyruvate toward lactate (causing alcoholic lactic acidosis + hypoglycemia). Clinically critical: PDH deficiency (X-linked) → lactic acidosis + neurologic dysfunction; thiamine deficiency → Wernicke-Korsakoff; arsenic poisoning (binds lipoate); fomepizole for methanol/ethylene glycol poisoning (blocks ADH).`
  },

  storyFrame: {
    en: {
      title: 'The Crossroads',
      setting: 'Pyruvate stands at a 5-way intersection. Its direction depends on which signals are loudest. "Mitochondria aerobic + fed" → turn into PDH → acetyl-CoA for TCA. "No oxygen" → turn into LDH → lactate. "Fasting muscle" → ALT → alanine to liver. "Fasting liver" → PC → OAA for gluconeogenesis. "Alcohol in the blood" → NADH floods → forced into lactate → acidosis.',
      characters: [
        { name: 'PDH', role: 'Aerobic Gatekeeper', icon: '🚪', color: '#dc2626' },
        { name: 'LDH', role: 'Anaerobic Recycler', icon: '🔄', color: '#ea580c' },
        { name: 'ALT', role: 'N Carrier', icon: '📮', color: '#f59e0b' },
        { name: 'PC', role: 'Gluconeo Gate', icon: '⚗️', color: '#65a30d' },
        { name: 'ADH/ALDH', role: 'Ethanol Route', icon: '🍷', color: '#7c3aed' }
      ]
    }
  },

  mnemonic: {
    en: { phrase: 'PDH cofactors "Tender Loving Care For Nancy": TPP, Lipoate, CoA, FAD, NAD+ (= B1, B5, B2, B3 — like α-KGDH!)', breakdown: '5 fates: Aerobic (PDH→AcCoA) · Anaerobic (LDH→lactate) · Fasting muscle (ALT→Ala) · Fasting liver (PC→OAA) · Ethanol (forces lactate via NADH)' }
  },

  compartments: {
    mito: { en: 'Mitochondria', he: 'מיטוכונדריה', color: '#fef3c7', accent: '#f59e0b' },
    cyto: { en: 'Cytosol', he: 'ציטוזול', color: '#dbeafe', accent: '#3b82f6' }
  },

  steps: [
    {
      id: 1,
      compartment: 'mito',
      angle: -90,
      enzyme: {
        abbr: 'PDH',
        name: 'Pyruvate Dehydrogenase Complex (E1 + E2 + E3)',
        ec: '1.2.4.1 + 2.3.1.12 + 1.8.1.4',
        class: 'Oxidoreductase / Transferase / Oxidoreductase',
        he: 'PDH'
      },
      substrates: [{ key: 'pyruvate', name: 'Pyruvate', smiles: S.pyruvate, isSource: true, stoich: 1 }],
      cofactors: [
        { key: 'nad', name: 'NAD⁺', smiles: S.nad, stoich: 1, role: 'consumed' },
        { key: 'coa', name: 'CoA', smiles: S.coa, stoich: 1, role: 'consumed' },
        { key: 'nadh', name: 'NADH', smiles: S.nadh, stoich: 1, role: 'produced' },
        { key: 'co2', name: 'CO₂', smiles: S.co2, stoich: 1, role: 'produced' }
      ],
      products: [{ key: 'acetylCoA', name: 'Acetyl-CoA', smiles: S.acetylCoA, label: { en: 'Acetyl-CoA → TCA' }, isMain: true, exportsTo: 'tca', stoich: 1 }],
      deltaG: 'Irreversible (strongly exergonic)',
      reversible: false,
      regulation: {
        activators: [
          { name: 'Insulin', type: 'covalent (dephosphorylation)', critical: true, note: { en: 'Fed state → PDH phosphatase → PDH dephosphorylated → ACTIVE' } },
          { name: 'Ca²⁺', type: 'allosteric', note: { en: 'Muscle contraction signal — activates PDH phosphatase' } },
          { name: 'Pyruvate, ADP', type: 'substrate / low energy', note: { en: 'High substrate or low energy both drive flux' } }
        ],
        inhibitors: [
          { name: 'Acetyl-CoA', type: 'product', critical: true, note: { en: 'End-product inhibition — activates PDH kinase' } },
          { name: 'NADH', type: 'product', critical: true, note: { en: 'High NADH → PDH kinase active → PDH off' } },
          { name: 'ATP', type: 'allosteric', note: { en: 'High energy → no need for more acetyl-CoA' } }
        ],
        summary: { en: 'Pyruvate Dehydrogenase is a MASSIVE 3-enzyme complex (E1/E2/E3). Requires FIVE cofactors: TPP (B1), lipoate, CoA (B5), FAD (B2), NAD⁺ (B3). Mnemonic: "Tender Loving Care For Nancy". Mechanism identical to α-KGDH and BCKAD (all 3 use the same cofactor set). Regulated by PDH kinase (inactivates via phosphorylation) and PDH phosphatase (activates).' }
      },
      story: { en: 'PDH is the IRREVERSIBLE entry from glycolysis to TCA. One pyruvate + CoA + NAD+ → acetyl-CoA + CO₂ + NADH. Requires 5 cofactors (TPP, lipoate, CoA, FAD, NAD+). PDH phosphorylation is the master switch: phosphorylated = OFF (fasting); dephosphorylated = ON (fed). Tightly suppressed by its own products (acetyl-CoA, NADH) and by ATP — the cell stops making acetyl-CoA when it already has plenty.' },
      clinical: {
        disorder: 'PDH Deficiency / Thiamine Deficiency / Arsenic Poisoning',
        inheritance: 'X-linked (E1α most common); nutritional (B1); acquired (arsenic)',
        findings: { en: 'PDH deficiency: neonatal LACTIC ACIDOSIS + neurologic dysfunction (seizures, hypotonia, developmental delay). Brain relies on glucose → acetyl-CoA → can\'t make it → lactate piles up. Thiamine (B1) deficiency: Beriberi + Wernicke-Korsakoff (also impairs α-KGDH, transketolase, BCKAD). Arsenic (As³⁺) irreversibly binds lipoate → inhibits PDH + α-KGDH + BCKAD (all 3 use lipoate).' },
        treatment: { en: 'PDH deficiency: ketogenic diet (provides fuel independent of glucose/PDH). Thiamine supplementation. Dichloroacetate (DCA) inhibits PDH kinase → activates residual PDH (experimental). Arsenic: dimercaprol chelation.' }
      },
      beats: {
        en: [
          { t: 0, text: 'Pyruvate arrives at the mitochondrial gate.', highlight: 'substrate' },
          { t: 2500, text: 'PDH complex engages: TPP, lipoate, CoA, FAD, NAD⁺.', highlight: 'enzyme' },
          { t: 5000, text: 'CO₂ released, NADH made, acetyl group attached to CoA.', highlight: 'energy' },
          { t: 7500, text: 'Acetyl-CoA — irreversibly committed to TCA or lipogenesis.', highlight: 'product' }
        ]
      }
    },
    {
      id: 2,
      compartment: 'cyto',
      angle: -18,
      enzyme: {
        abbr: 'LDH',
        name: 'Lactate Dehydrogenase',
        ec: '1.1.1.27',
        class: 'Oxidoreductase',
        he: 'LDH'
      },
      substrates: [{ key: 'pyruvate', name: 'Pyruvate', smiles: S.pyruvate, stoich: 1 }],
      cofactors: [
        { key: 'nadh', name: 'NADH', smiles: S.nadh, stoich: 1, role: 'consumed' },
        { key: 'nad', name: 'NAD⁺', smiles: S.nad, stoich: 1, role: 'produced', note: { en: 'CRITICAL — regenerates NAD⁺ so glycolysis can continue' } }
      ],
      products: [{ key: 'lactate', name: 'Lactate', smiles: S.lactate, label: { en: 'Lactate → blood → liver (Cori cycle)' }, isMain: true, stoich: 1 }],
      deltaG: '−25 kJ/mol (favored direction in anaerobic tissue)',
      reversible: true,
      regulation: {
        activators: [{ name: 'Pyruvate', type: 'substrate' }],
        inhibitors: [],
        summary: { en: 'Reduces pyruvate → lactate using NADH, REGENERATING NAD⁺. This is the whole point: NAD+ is recycled so glycolysis (which consumes NAD+ at GAPDH) can keep running. Isozymes: LDH-1 (heart, oxidative — prefers lactate→pyruvate direction); LDH-5 (muscle, liver — prefers pyruvate→lactate).' }
      },
      story: { en: 'LDH is the emergency NAD+ regenerator. In anaerobic conditions (RBC — no mito; sprinting muscle — O₂ insufficient), the ETC can\'t reoxidize NADH. Without NAD+, GAPDH halts, glycolysis stops, no ATP. LDH solves this by reducing pyruvate → lactate, re-oxidizing NADH → NAD+. Lactate then travels to liver for the Cori cycle. The liver does the expensive work of converting it back to glucose.' },
      clinical: {
        disorder: 'Lactic Acidosis',
        inheritance: 'Acquired',
        findings: { en: 'Type A: TISSUE HYPOXIA — shock, severe anemia, CO poisoning, cardiac arrest (↑ anaerobic lactate). Type B: METABOLIC — metformin, ethanol (NADH excess forces pyruvate→lactate), PDH deficiency, G6Pase deficiency (Von Gierke), thiamine deficiency. Lab: anion gap metabolic acidosis + lactate > 4 mmol/L.' },
        treatment: { en: 'Treat underlying cause. Supportive: O₂, fluids, pressors. Thiamine if deficient.' }
      },
      beats: {
        en: [
          { t: 0, text: 'Anaerobic: NADH piles up, GAPDH will stall.', highlight: 'substrate' },
          { t: 2500, text: 'LDH reduces pyruvate → lactate, regenerating NAD⁺.', highlight: 'enzyme' },
          { t: 5000, text: 'Glycolysis can continue. Lactate exported to blood.', highlight: 'product' }
        ]
      }
    },
    {
      id: 3,
      compartment: 'cyto',
      angle: 54,
      enzyme: {
        abbr: 'ALT',
        name: 'Alanine Aminotransferase',
        ec: '2.6.1.2',
        class: 'Transferase (PLP-dependent)',
        he: 'ALT'
      },
      substrates: [
        { key: 'pyruvate', name: 'Pyruvate', smiles: S.pyruvate, stoich: 1 },
        { key: 'glutamate', name: 'Glutamate (amino donor)', smiles: 'OC(=O)C(N)CCC(=O)O', stoich: 1 }
      ],
      cofactors: [{ key: 'plp', name: 'PLP (B6)', smiles: '', stoich: 1, role: 'cofactor' }],
      products: [{ key: 'alanine', name: 'Alanine', smiles: S.alanine, label: { en: 'Alanine → blood → liver (glucose-alanine cycle)' }, isMain: true, stoich: 1 }],
      deltaG: 'Reversible',
      reversible: true,
      regulation: noReg,
      story: { en: 'ALT is the nitrogen-export route. In fasting muscle, AAs are catabolized for energy; their amino groups are "packaged" onto pyruvate → alanine, which is sent to the liver. Liver runs ALT in reverse: alanine → pyruvate (for gluconeogenesis) + glutamate (donates N to urea cycle). Classic "kill two birds" biology: dispose of muscle nitrogen AND feed glucose synthesis.' },
      clinical: null,
      beats: {
        en: [
          { t: 0, text: 'Fasting muscle: protein breakdown releases AAs.', highlight: 'substrate' },
          { t: 2500, text: 'ALT swaps glu\'s amino group onto pyruvate → alanine.', highlight: 'enzyme' },
          { t: 5000, text: 'Alanine → blood → liver.', highlight: 'product' }
        ]
      }
    },
    {
      id: 4,
      compartment: 'mito',
      angle: 126,
      enzyme: {
        abbr: 'PC',
        name: 'Pyruvate Carboxylase (anaplerotic)',
        ec: '6.4.1.1',
        class: 'Ligase (biotin-dependent)',
        he: 'PC'
      },
      substrates: [
        { key: 'pyruvate', name: 'Pyruvate', smiles: S.pyruvate, stoich: 1 },
        { key: 'co2', name: 'CO₂ (HCO₃⁻)', smiles: S.co2, stoich: 1 }
      ],
      cofactors: [
        { key: 'atp', name: 'ATP', smiles: S.atp, stoich: 1, role: 'consumed' },
        { key: 'biotin', name: 'Biotin (B7)', smiles: '', stoich: 1, role: 'cofactor' }
      ],
      products: [{ key: 'oaa', name: 'OAA', smiles: S.oaa, label: { en: 'OAA → gluconeogenesis OR TCA' }, isMain: true, exportsTo: 'gluconeogenesis', stoich: 1 }],
      deltaG: 'Irreversible',
      reversible: false,
      regulation: {
        activators: [{ name: 'Acetyl-CoA', type: 'allosteric', critical: true, note: { en: 'Signature: high acetyl-CoA = pyruvate → OAA (anaplerotic/gluconeogenic)' } }],
        inhibitors: [{ name: 'ATP', type: 'allosteric', note: { en: 'High ATP = energy sufficient, less need for OAA from pyruvate' } }],
        summary: { en: 'Mitochondrial. Biotin-dependent. Fulfills two roles: (1) ANAPLEROTIC — replenishes TCA intermediates drained by biosynthesis; (2) GLUCONEOGENIC first step — pyruvate → OAA → (PEPCK) → PEP → glucose. Activated by acetyl-CoA (high acetyl-CoA signals fasting).' }
      },
      story: { en: 'PC is the bridge from pyruvate to gluconeogenesis AND the top-off valve for TCA. When acetyl-CoA is high (fasting, plenty of β-oxidation), it allosterically activates PC — diverting pyruvate to OAA instead of acetyl-CoA. This feeds either gluconeogenesis (liver) or replenishes TCA intermediates drained for biosynthesis.' },
      clinical: null,
      beats: {
        en: [
          { t: 0, text: 'Fasting liver: acetyl-CoA high (from β-oxidation).', highlight: 'substrate' },
          { t: 2500, text: 'PC activated. Adds CO₂ (biotin) + ATP.', highlight: 'enzyme' },
          { t: 5000, text: 'OAA → PEP (via PEPCK) → glucose.', highlight: 'product' }
        ]
      }
    },
    {
      id: 5,
      compartment: 'cyto',
      angle: 198,
      enzyme: {
        abbr: 'ADH+ALDH',
        name: 'Ethanol metabolism (alcohol + aldehyde dehydrogenases)',
        ec: '1.1.1.1 / 1.2.1.3',
        class: 'Oxidoreductases',
        he: ''
      },
      substrates: [{ key: 'ethanol', name: 'Ethanol', smiles: S.ethanol, isSource: true, stoich: 1 }],
      cofactors: [
        { key: 'nad', name: '2 NAD⁺', smiles: S.nad, stoich: 2, role: 'consumed' },
        { key: 'nadh', name: '2 NADH', smiles: S.nadh, stoich: 2, role: 'produced', note: { en: 'FLOODS the cell with NADH — key to ethanol\'s pathology' } }
      ],
      products: [
        { key: 'acetate', name: 'Acetate → Acetyl-CoA', smiles: 'CC(=O)O', isMain: true, exportsTo: 'tca', stoich: 1 },
        { key: 'acetaldehyde', name: '(intermediate: acetaldehyde — toxic)', smiles: S.acetaldehyde, stoich: 1 }
      ],
      deltaG: 'Irreversible',
      reversible: false,
      regulation: {
        activators: [],
        inhibitors: [
          { name: 'Fomepizole', type: 'drug', critical: true, note: { en: 'Blocks ADH — used for methanol/ethylene glycol poisoning' } },
          { name: 'Disulfiram', type: 'drug', note: { en: 'Blocks ALDH → acetaldehyde accumulates → aversive reaction. Used for alcohol abstinence therapy.' } }
        ],
        summary: { en: 'Ethanol → (ADH, cytosol) → Acetaldehyde → (ALDH, mito) → Acetate → Acetyl-CoA. Each step consumes NAD+ and produces NADH. The NADH surge is the reason ethanol causes so many metabolic problems: (1) Shifts pyruvate → LACTATE (lactic acidosis), (2) Shifts OAA → MALATE → gluconeogenesis inhibited (fasting HYPOGLYCEMIA in alcoholics), (3) Shifts DHAP → glycerol-3-P → triglyceride synthesis (FATTY LIVER).' }
      },
      story: { en: 'Ethanol doesn\'t directly touch pyruvate but RULES pyruvate\'s fate through NADH. 2 NADH are made per ethanol (ADH, then ALDH). The [NADH]/[NAD+] ratio spikes — pushing LDH toward lactate (lactic acidosis), blocking gluconeogenesis (hypoglycemia), and favoring fat synthesis (fatty liver). Chronic alcohol = classic triad: hypoglycemia + lactic acidosis + hepatic steatosis.' },
      clinical: {
        disorder: 'Alcohol Metabolism + Disulfiram / Methanol / Ethylene Glycol',
        inheritance: 'Acquired',
        findings: { en: 'Asian flush: ALDH2*2 variant → slow acetaldehyde clearance → flushing, tachycardia, nausea. Disulfiram mimics this pharmacologically (aversion therapy). Methanol: ADH converts it to formaldehyde → formic acid → BLINDNESS + metabolic acidosis. Ethylene glycol: ADH makes glycolate/oxalate → renal failure + Ca-oxalate crystals. Treat both with fomepizole (blocks ADH) + dialysis.' },
        treatment: { en: 'Fomepizole for methanol/ethylene glycol. Ethanol as competitive substrate (older). Dialysis for severe toxicity. Thiamine supplementation in alcoholics BEFORE glucose.' }
      },
      beats: {
        en: [
          { t: 0, text: 'Ethanol reaches the liver.', highlight: 'substrate' },
          { t: 2500, text: 'ADH: ethanol + NAD⁺ → acetaldehyde + NADH.', highlight: 'enzyme' },
          { t: 5000, text: 'ALDH: acetaldehyde + NAD⁺ → acetate + NADH.', highlight: 'energy' },
          { t: 7500, text: 'Net: NADH floods cell → lactate, fatty liver, hypoglycemia.', highlight: 'carrier' }
        ]
      }
    }
  ],

  intermediates: [
    { id: 'acetylCoA_fate', afterStep: 1, beforeStep: 2, name: 'Acetyl-CoA', smiles: S.acetylCoA, carrier: true },
    { id: 'lactate_fate', afterStep: 2, beforeStep: 3, name: 'Lactate', smiles: S.lactate },
    { id: 'alanine_fate', afterStep: 3, beforeStep: 4, name: 'Alanine', smiles: S.alanine },
    { id: 'oaa_fate', afterStep: 4, beforeStep: 5, name: 'OAA', smiles: S.oaa },
    { id: 'ethanol_fate', afterStep: 5, beforeStep: 1, name: 'Ethanol → Acetyl-CoA', smiles: S.ethanol, carrier: true }
  ],

  integrations: [
    {
      name: 'Acetyl-CoA → TCA',
      fromStep: 1,
      toCycle: 'TCA',
      path: { en: 'Acetyl-CoA + OAA → Citrate → TCA (~10 ATP per acetyl-CoA)' },
      note: { en: 'The aerobic main route. PDH activation links glycolysis to full oxidative metabolism.' }
    },
    {
      name: 'Acetyl-CoA → Ketogenesis',
      fromStep: 1,
      toCycle: 'Ketogenesis',
      path: { en: 'Excess acetyl-CoA (prolonged fasting, DKA) → HMG-CoA → acetoacetate / β-OH-butyrate / acetone' },
      note: { en: 'When OAA is diverted to gluconeogenesis, acetyl-CoA overflows into ketones.' }
    },
    {
      name: 'Acetyl-CoA → Fatty Acid / Cholesterol synthesis',
      fromStep: 1,
      toCycle: 'Lipogenesis',
      path: { en: 'Cytosolic acetyl-CoA (via citrate shuttle) → fatty acids / cholesterol' },
      note: { en: 'Fed state: PDH active, TCA saturated, citrate exports → lipogenesis.' }
    },
    {
      name: 'Lactate → Cori cycle',
      fromStep: 2,
      toCycle: 'Gluconeogenesis',
      path: { en: 'Muscle lactate → blood → liver → pyruvate (LDH reverse) → glucose → back to muscle' },
      note: { en: 'Burns 4 ATP net per cycle in the body (2 in muscle glycolysis vs 6 in liver gluconeogenesis).' }
    },
    {
      name: 'Alanine → Glucose-alanine cycle',
      fromStep: 3,
      toCycle: 'Gluconeogenesis + Urea',
      path: { en: 'Muscle: AA-N → Ala → liver → pyruvate + Glu → urea + gluconeogenesis' },
      note: { en: 'Dual-purpose: moves nitrogen AND carbon from muscle to liver.' }
    },
    {
      name: 'OAA → Gluconeogenesis',
      fromStep: 4,
      toCycle: 'Gluconeogenesis',
      path: { en: 'Pyruvate → (PC) → OAA → (PEPCK) → PEP → gluconeogenesis' },
      note: { en: 'The "bypass" of glycolysis step 10 — requires 2 enzymes (PC + PEPCK) to reverse PK irreversibility.' }
    },
    {
      name: 'Ethanol → Alcoholic metabolic derangements',
      fromStep: 5,
      toCycle: 'Multiple',
      path: { en: 'NADH excess → pyruvate→lactate (acidosis), OAA→malate (blocks gluconeogenesis → hypoglycemia), DHAP→glycerol-3P (fatty liver)' },
      note: { en: 'Always consider in acutely intoxicated patient with unexplained acidosis + hypoglycemia.' }
    }
  ],

  bigPicture: {
    en: [
      { k: 'Five fates', v: '1. Acetyl-CoA (PDH) · 2. Lactate (LDH) · 3. Alanine (ALT) · 4. OAA (PC) · 5. Ethanol connection (via NADH effect)' },
      { k: 'PDH cofactors (FIVE)', v: 'TPP (B1), Lipoate, CoA (B5), FAD (B2), NAD⁺ (B3) — "Tender Loving Care For Nancy"' },
      { k: 'Cofactor identity', v: 'PDH uses the SAME cofactors as α-KGDH and BCKAD (all 3 are α-keto acid dehydrogenases with identical chemistry)' },
      { k: 'PDH activators', v: 'Insulin (dephosphorylates), Ca²⁺, pyruvate, ADP, NAD⁺' },
      { k: 'PDH inhibitors', v: 'Acetyl-CoA, NADH, ATP (via PDH kinase). Glucagon indirectly (fasting state).' },
      { k: 'PDH deficiency', v: 'X-linked (E1α common). Lactic acidosis + neurologic dysfunction. Tx: ketogenic diet.' },
      { k: 'Thiamine (B1) deficiency', v: 'Affects PDH, α-KGDH, transketolase, BCKAD — all TPP-dependent. Beriberi + Wernicke-Korsakoff. Give thiamine BEFORE glucose in alcoholics.' },
      { k: 'Arsenic poisoning', v: 'As³⁺ binds lipoate → inhibits PDH + α-KGDH + BCKAD. Treatment: dimercaprol.' },
      { k: 'LDH isozymes', v: 'LDH-1 (H4 — heart, prefers lactate→pyruvate). LDH-5 (M4 — muscle/liver, prefers pyruvate→lactate).' },
      { k: 'Lactic acidosis types', v: 'Type A: hypoxia (shock, CO, severe anemia). Type B: metabolic (metformin, ethanol, PDH def, Von Gierke, thiamine def).' },
      { k: 'PC activator', v: 'Acetyl-CoA (high acetyl-CoA = fasting = make glucose)' },
      { k: 'Biotin-dependent enzymes', v: 'PC, ACC, PCC, MCC. Raw egg whites (avidin) → biotin deficiency (rare).' },
      { k: 'Ethanol metabolism', v: 'Ethanol → (ADH) → Acetaldehyde → (ALDH) → Acetate → Acetyl-CoA. Each step: +1 NADH.' },
      { k: 'Ethanol effects via NADH', v: '(1) Lactate↑ (acidosis) · (2) Gluconeogenesis↓ (hypoglycemia) · (3) Fat synthesis↑ (fatty liver). Classic triad.' },
      { k: 'Methanol poisoning', v: 'ADH → formaldehyde → formic acid → BLINDNESS + acidosis. Tx: fomepizole + dialysis.' },
      { k: 'Ethylene glycol', v: 'ADH → glycoaldehyde → oxalate → RENAL FAILURE + Ca-oxalate crystals (envelope shape). Tx: fomepizole + dialysis.' },
      { k: 'Disulfiram', v: 'Inhibits ALDH → acetaldehyde accumulates → flushing, tachycardia, nausea. Aversion therapy for alcoholism.' },
      { k: 'ALDH2*2 (Asian flush)', v: 'Variant with reduced activity → partial disulfiram-like reaction to alcohol. ~40% of East Asians.' }
    ]
  },

  questions: [
    { id: 'pyr-q1', difficulty: 'easy', prompt: { en: 'The irreversible conversion of pyruvate to acetyl-CoA is catalyzed by:', he: '' }, correct: 'PDH complex', options: ['PDH complex', 'LDH', 'PC', 'ALT'] },
    { id: 'pyr-q2', difficulty: 'medium', prompt: { en: 'PDH requires how many cofactors?', he: '' }, correct: '5 (TPP, lipoate, CoA, FAD, NAD⁺)', options: ['5 (TPP, lipoate, CoA, FAD, NAD⁺)', '3', '4', '6'] },
    { id: 'pyr-q3', difficulty: 'medium', prompt: { en: 'Arsenic poisoning inhibits PDH by binding:', he: '' }, correct: 'Lipoate', options: ['Lipoate', 'TPP', 'CoA', 'FAD'] },
    { id: 'pyr-q4', difficulty: 'hard', prompt: { en: 'In anaerobic conditions, LDH converts pyruvate to lactate primarily to:', he: '' }, correct: 'Regenerate NAD⁺ for glycolysis', options: ['Regenerate NAD⁺ for glycolysis', 'Make ATP directly', 'Produce CO₂', 'Make acetyl-CoA'] },
    { id: 'pyr-q5', difficulty: 'medium', prompt: { en: 'Pyruvate carboxylase is allosterically activated by:', he: '' }, correct: 'Acetyl-CoA', options: ['Acetyl-CoA', 'Citrate', 'ATP', 'NADH'] },
    { id: 'pyr-q6', difficulty: 'hard', prompt: { en: 'PDH is INACTIVE (phosphorylated) under all EXCEPT:', he: '' }, correct: 'High insulin + high pyruvate', options: ['High insulin + high pyruvate', 'High acetyl-CoA', 'High NADH', 'High ATP'] },
    { id: 'pyr-q7', difficulty: 'hard', prompt: { en: 'The glucose-alanine cycle transports from muscle to liver:', he: '' }, correct: 'Nitrogen (and carbon)', options: ['Nitrogen (and carbon)', 'ATP', 'Oxygen', 'Glycogen'] },
    { id: 'pyr-q8', difficulty: 'medium', prompt: { en: 'Chronic alcohol causes lactic acidosis primarily because:', he: '' }, correct: 'Ethanol metabolism generates NADH, pushing pyruvate → lactate', options: ['Ethanol metabolism generates NADH, pushing pyruvate → lactate', 'Direct inhibition of LDH', 'Loss of NAD⁺ through urine', 'Ethanol stimulates PDH'] },
    { id: 'pyr-q9', difficulty: 'medium', prompt: { en: 'Pyruvate carboxylase uses which vitamin?', he: '' }, correct: 'Biotin (B7)', options: ['Biotin (B7)', 'Thiamine (B1)', 'Pyridoxine (B6)', 'Riboflavin (B2)'] },
    { id: 'pyr-q10', difficulty: 'hard', prompt: { en: 'Methanol poisoning causes blindness because methanol is converted to:', he: '' }, correct: 'Formic acid (damages optic nerve)', options: ['Formic acid (damages optic nerve)', 'Acetaldehyde', 'Lactate', 'Oxalate'] },
    { id: 'pyr-q11', difficulty: 'medium', prompt: { en: 'Fomepizole treats methanol/ethylene glycol poisoning by:', he: '' }, correct: 'Inhibiting alcohol dehydrogenase (ADH)', options: ['Inhibiting alcohol dehydrogenase (ADH)', 'Inhibiting ALDH', 'Activating PDH', 'Binding methanol'] },
    { id: 'pyr-q12', difficulty: 'hard', prompt: { en: 'Disulfiram causes aversive reaction to alcohol by:', he: '' }, correct: 'Inhibiting ALDH → acetaldehyde accumulates', options: ['Inhibiting ALDH → acetaldehyde accumulates', 'Inhibiting ADH', 'Blocking PDH', 'Activating the GABA system'] },
    { id: 'pyr-q13', difficulty: 'hard', prompt: { en: 'PDH deficiency is typically treated with:', he: '' }, correct: 'Ketogenic diet', options: ['Ketogenic diet', 'High-carb diet', 'Low-protein diet', 'Insulin'] },
    { id: 'pyr-q14', difficulty: 'medium', prompt: { en: 'Which fate of pyruvate dominates in RBCs?', he: '' }, correct: 'Lactate (no mitochondria)', options: ['Lactate (no mitochondria)', 'Acetyl-CoA', 'OAA', 'Alanine'] }
  ]
};
