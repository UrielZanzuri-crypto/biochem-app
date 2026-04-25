// ============================================================
// FATTY ACID SYNTHESIS — cytosolic, 4 repeating steps
// The anabolic counterpart of β-oxidation — inverse logic, NADPH-driven
// ============================================================

const S = {
  acetylCoA:     'CC(=O)S',
  malonylCoA:    'OC(=O)CC(=O)S',
  acpSH:         'CC(C)(COP(O)(=O)O)C(O)C(=O)NCCC(=O)NCCS',  // ACP simplified
  acetylACP:     'CC(=O)S',   // acetyl-ACP
  malonylACP:    'OC(=O)CC(=O)S',  // malonyl-ACP
  acacACP:       'CC(=O)CC(=O)S',  // acetoacetyl-ACP
  hydroxyACP:    'CC(O)CC(=O)S',   // β-hydroxybutyryl-ACP
  enoylACP:      'C/C=C/C(=O)S',   // crotonyl-ACP (trans-enoyl)
  butyrylACP:    'CCCC(=O)S',      // butyryl-ACP (saturated, n+2)
  palmitate:     'CCCCCCCCCCCCCCCC(=O)O',
  // Cofactors
  nadph:         'NC(=O)C1=CN(C=CC1)C2OC(COP(O)(=O)OP(O)(=O)OCC3OC(n4cnc5c(N)ncnc45)C(OP(O)(O)=O)C3O)C(O)C2O',
  nadp:          'NC(=O)c1ccc[n+](c1)C2OC(COP(O)(=O)OP(O)(=O)OCC3OC(n4cnc5c(N)ncnc45)C(OP(O)(O)=O)C3O)C(O)C2O',
  biotin:        'OC(=O)CCCCC1SCC2NC(=O)NC12',
  atp:           'Nc1ncnc2n(cnc12)C3OC(COP(O)(=O)OP(O)(=O)OP(O)(=O)O)C(O)C3O',
  adp:           'Nc1ncnc2n(cnc12)C3OC(COP(O)(=O)OP(O)(=O)O)C(O)C3O',
  co2:           'O=C=O',
  h2o:           'O',
  coa:           'CC(C)(COP(O)(=O)OP(O)(=O)OCC1OC(n2cnc3c(N)ncnc23)C(O)C1OP(O)(O)=O)C(O)C(=O)NCCC(=O)NCCS'
};

const noReg = { activators: [], inhibitors: [], summary: { en: 'Not independently regulated; flux set by acetyl-CoA carboxylase (step 1, rate-limiting).' } };

export const fattyAcidSynthCycle = {
  id: 'fa-synth',
  chapter: 'Lipid Biosynthesis',
  chapterOrder: 7,
  order: 1,
  layout: 'circular',
  title: { en: 'Fatty Acid Synthesis', he: 'סינתזת חומצות שומן' },
  subtitle: { en: 'Acetyl-CoA + NADPH → palmitate (cytosolic, 4-step repeating)', he: 'אצטיל-CoA + NADPH → פלמיטט' },

  context: {
    tissue: { en: 'Liver (main), lactating mammary gland, adipose tissue, kidney. Also active in cancer cells (upregulated).' },
    otherTissues: { en: 'NOT in muscle, brain, or most non-biosynthetic tissues.' },
    state: { en: 'FED STATE: high insulin, high glucose. Excess glucose → pyruvate → acetyl-CoA (via PDH) → citrate exported to cytosol → fatty acids.' },
    stateHormonal: { en: 'Insulin ↑↑ (activates ACC via PP1 dephosphorylation, induces FAS transcription, activates PDH). Glucagon ↓↓ (phosphorylates ACC via PKA → inactive). Cortisol/leptin modulation long-term.' },
    turnover: { en: 'Short-term: allosteric (citrate activates ACC; palmitoyl-CoA inhibits). Medium: phosphorylation by PKA/AMPK inactivates ACC. Long-term: insulin induces ACC + FAS + citrate lyase transcription (SREBP-1c).' }
  },

  overview: {
    en: `Fatty acid synthesis builds palmitate (C16:0) from 8 acetyl-CoA units using NADPH as the reducing power. It is cytosolic and catalyzed by a giant multifunctional homodimer — FATTY ACID SYNTHASE (FAS) — that contains 7 active sites plus the ACP (acyl carrier protein) arm. ACC (acetyl-CoA carboxylase) is the rate-limiting step: it commits cytosolic acetyl-CoA by carboxylating it to malonyl-CoA (biotin-dependent). Malonyl-CoA plays TWO roles: (1) the 2C donor for FAS elongation, and (2) a potent INHIBITOR of CPT-1 — coupling synthesis ON ↔ β-oxidation OFF. The FAS cycle repeats 7 times to make C16 (palmitate), each round: condense, reduce (NADPH), dehydrate, reduce (NADPH) — functionally the reverse of β-oxidation. Key differences vs β-ox: cytosol not matrix · NADPH not NAD+/FAD · ACP not CoA · one multienzyme complex not separate enzymes · trans-2,3-enoyl intermediate for both. Once palmitate is released, it can be elongated in ER (to C18+) or desaturated (to oleate, etc.). Source of acetyl-CoA in cytosol: citrate shuttle (mitochondrial citrate → cytosol → citrate lyase → acetyl-CoA + OAA). NADPH comes from PPP + malic enzyme.`
  },

  // ============================================================
  // PEDAGOGY — Plain-English explanations of the high-yield concepts.
  // ============================================================
  pedagogy: [
    {
      title: 'Citrate-Malate Shuttle — Getting acetyl-CoA out of the mitochondrion',
      icon: '🚛',
      body: `Acetyl-CoA is made INSIDE the mitochondrion (from PDH or fatty acid oxidation), but fatty acid synthesis happens in the **cytosol**. Acetyl-CoA can\'t cross the inner membrane on its own. The cell uses a clever workaround: ship it out as **citrate**.

**Step 1 — Inside mitochondrion:** Acetyl-CoA + OAA → **Citrate** (citrate synthase, the first step of TCA). When ATP/citrate is high (fed state), citrate accumulates and the mitochondrial citrate transporter exports it to the cytosol.

**Step 2 — Cytosol:** **Citrate Lyase (CL)** splits citrate using ATP:
   Citrate + ATP + CoA → Acetyl-CoA + OAA + ADP + Pi
The acetyl-CoA can now feed FAS. But what about OAA?

**Step 3 — Cytosolic OAA recycling:** OAA → Malate (cytosolic malate dehydrogenase, NADH used). Then **malic enzyme** decarboxylates malate → Pyruvate + CO₂ + **NADPH**. Pyruvate re-enters mitochondrion, where pyruvate carboxylase regenerates OAA.

**Bonus:** This shuttle PRODUCES NADPH (from malic enzyme) — about half the NADPH needed for FAS. The other half comes from the **pentose phosphate pathway** (G6PD, oxidative branch).

**Net per round trip:** 1 Acetyl-CoA exported, 1 ATP spent, 1 NADPH gained.`
    },
    {
      title: 'ER Elongation — Building C18, C20, C22 fatty acids',
      icon: '🏗️',
      body: `Cytosolic FAS only makes **palmitate (C16:0)** — and stops there. To make longer chains (stearate C18, arachidonate C20, etc.), the cell uses the **endoplasmic reticulum (ER) elongation system**.

**Mechanism:** Same logic as FAS — add 2C from malonyl-CoA per round, reduce with NADPH — but the enzymes are MEMBRANE-BOUND in the ER, not a giant cytosolic complex. The key enzymes are the **ELOVL family (ELOVL1–7)**, with each ELOVL having its own substrate preference and chain-length specificity.

• ELOVL1 — saturated/monounsaturated VLCFAs (very long, ≥C22) → important for skin/myelin
• ELOVL2/5 — polyunsaturated (omega-3, omega-6 elongation)
• ELOVL6 — C16 → C18

Each round: condensation → reduction → dehydration → reduction (4 enzymes per round, separate proteins, each in the ER membrane). Substrate is **acyl-CoA** (not ACP-bound like FAS).

**Clinical:** ELOVL4 mutations cause Stargardt-like macular dystrophy (defective retinal lipids). Inadequate VLCFA synthesis → ichthyosis, neurological defects.`
    },
    {
      title: 'Mitochondrial Elongation — A separate, smaller pathway',
      icon: '🔋',
      body: `In addition to ER elongation, mitochondria can **also elongate fatty acids**, but only for special purposes — mainly building cardiolipin and adjusting membrane composition.

**Mechanism:** Reverse of β-oxidation, almost step-for-step. It uses:
• **MECR** (Mitochondrial trans-2-Enoyl-CoA Reductase) — the dedicated reductase
• **MECR uses NADPH** (just like FAS) — distinguishing it from β-oxidation which uses NAD+/FAD
• Substrate is acetyl-CoA (not malonyl-CoA — different from FAS)

So mitochondrial elongation = β-oxidation enzymes run BACKWARDS using NADPH + acetyl-CoA. Limited capacity, used for membrane lipid maintenance, lipoic acid biosynthesis, etc.

**MEPAN syndrome** (Mitochondrial Enoyl-CoA Reductase Protein-Associated Neurodegeneration): MECR loss → optic atrophy + dystonia in childhood. Recently described, illustrates the pathway\'s clinical relevance.`
    },
    {
      title: 'Desaturation — Adding double bonds',
      icon: '💧',
      body: `Saturated fatty acids (palmitate, stearate) need double bonds to become useful unsaturated FAs. The enzymes are **desaturases** — they live in the ER membrane.

**Δ9 desaturase (SCD1, stearoyl-CoA desaturase):** Adds a cis double bond at position 9. Stearate (C18:0) → **Oleate (C18:1 ω-9)**. Highly active in the fed/insulin state.

**Δ5 and Δ6 desaturases:** Used in ω-6 and ω-3 metabolism (linoleate → arachidonate, etc.).

**The big constraint:** Mammals **cannot introduce double bonds beyond C9** (counting from the COOH end). That is why **linoleic acid (C18:2 ω-6)** and **α-linolenic acid (C18:3 ω-3)** are ESSENTIAL FATTY ACIDS — we have no enzyme to make a double bond at ω-3 or ω-6 positions. Diet must supply them. Deficiency → dermatitis, poor wound healing.

Reaction needs O₂ and cytochrome b5 (the desaturases are mixed-function oxidases).`
    }
  ],

  storyFrame: {
    en: {
      title: 'The Assembly-Line Factory',
      setting: 'In the fed state, the liver is flooded with glucose. It becomes a lipogenic factory. A giant robotic enzyme (FAS) has a flexible arm (ACP) that carries a growing chain through 4 workstations, adding 2 carbons per loop. A toll gate (ACC) at the entrance commits the raw material by carboxylating acetyl-CoA to malonyl-CoA. The same toll (malonyl-CoA) is also a "STOP" sign hanging on the β-oxidation door — when the factory is building fat, the incinerator is locked.',
      characters: [
        { name: 'ACC', role: 'Gate Keeper (commits to synthesis)', icon: '🚧', color: '#dc2626' },
        { name: 'KS/Condens.', role: 'Welder (joins 2 carbons)', icon: '🔗', color: '#ea580c' },
        { name: 'KR/Reduce 1', role: 'First Reducer (NADPH)', icon: '💧', color: '#f59e0b' },
        { name: 'DH/Dehydrate', role: 'Water Remover', icon: '🔥', color: '#65a30d' },
        { name: 'ER/Reduce 2', role: 'Second Reducer (NADPH)', icon: '🧪', color: '#059669' }
      ]
    }
  },

  mnemonic: {
    en: { phrase: 'CRDR: Condense, Reduce, Dehydrate, Reduce. Each cycle: +2C, −2 NADPH.', breakdown: 'ACC commits. Then 7 cycles of CRDR builds palmitate (C16). ACP arm carries the growing chain.' }
  },

  compartments: {
    cyto: { en: 'Cytosol', he: 'ציטוזול', color: '#dbeafe', accent: '#3b82f6' }
  },

  steps: [
    {
      id: 1,
      compartment: 'cyto',
      angle: -90,
      enzyme: {
        abbr: 'ACC',
        name: 'Acetyl-CoA Carboxylase',
        ec: '6.4.1.2',
        class: 'Ligase (biotin-dependent carboxylase)',
        he: 'ACC'
      },
      substrates: [
        { key: 'acetylCoA', name: 'Acetyl-CoA', smiles: S.acetylCoA, isSource: true, stoich: 1 },
        { key: 'co2', name: 'CO₂ (HCO₃⁻)', smiles: S.co2, stoich: 1 }
      ],
      cofactors: [
        { key: 'atp', name: 'ATP', smiles: S.atp, stoich: 1, role: 'consumed' },
        { key: 'adp', name: 'ADP', smiles: S.adp, stoich: 1, role: 'produced' },
        { key: 'biotin', name: 'Biotin (B7)', smiles: S.biotin, stoich: 1, role: 'cofactor' }
      ],
      products: [{ key: 'malonylCoA', name: 'Malonyl-CoA', smiles: S.malonylCoA, label: { en: 'Malonyl-CoA (3C)' }, isMain: true, stoich: 1 }],
      deltaG: 'Irreversible (ATP-driven)',
      reversible: false,
      regulation: {
        activators: [
          { name: 'Citrate', type: 'allosteric', critical: true, note: { en: 'Citrate signals mitochondrial acetyl-CoA overflow (fed state) → polymerizes ACC into active filaments' } },
          { name: 'Insulin', type: 'covalent (via PP1)', critical: true, note: { en: 'Insulin → PP1 → dephosphorylates ACC → ACTIVE' } }
        ],
        inhibitors: [
          { name: 'Palmitoyl-CoA', type: 'feedback', critical: true, note: { en: 'End-product inhibition — when fatty acids are plentiful, stop making more' } },
          { name: 'Glucagon', type: 'covalent (via PKA)', critical: true, note: { en: 'Glucagon → PKA → phosphorylates ACC → INACTIVE' } },
          { name: 'AMPK', type: 'covalent phosphorylation', note: { en: 'Low energy state (high AMP) → AMPK → phosphorylates ACC → inactive' } }
        ],
        summary: { en: 'RATE-LIMITING, COMMITTED STEP of fatty acid synthesis. BIOTIN-DEPENDENT (like pyruvate carboxylase, propionyl-CoA carboxylase). Reciprocally regulated with β-oxidation: its product (malonyl-CoA) inhibits CPT-1.' }
      },
      story: { en: 'THE GATE KEEPER (ACC) makes the key commitment: adding CO₂ to acetyl-CoA (the body\'s "universal 2C currency") to form malonyl-CoA. ATP is spent, biotin is the CO₂ carrier. Malonyl-CoA is the activated 2C donor for every elongation, AND — brilliantly — it simultaneously locks the door to β-oxidation (by inhibiting CPT-1). One molecule, two reciprocal jobs.' },
      clinical: {
        disorder: 'Biotin deficiency',
        inheritance: 'Nutritional (raw egg whites contain avidin — biotin binder; rare with balanced diet)',
        findings: { en: 'Affects all 4 biotin-dependent carboxylases (ACC, PC, PCC, MCC). Alopecia, dermatitis, glossitis, organic aciduria, lactic acidosis, neurologic symptoms.' },
        treatment: { en: 'Oral biotin supplementation (curative).' }
      },
      beats: {
        en: [
          { t: 0, text: 'Fed state: cytosolic acetyl-CoA levels high.', highlight: 'substrate' },
          { t: 2500, text: 'ACC adds CO₂ using biotin + ATP.', highlight: 'enzyme' },
          { t: 5000, text: 'Malonyl-CoA produced — the committed building block.', highlight: 'product' },
          { t: 7500, text: 'Bonus effect: malonyl-CoA inhibits CPT-1, shutting down β-oxidation.', highlight: 'carrier' }
        ]
      }
    },
    {
      id: 2,
      compartment: 'cyto',
      angle: 0,
      enzyme: {
        abbr: 'KS',
        name: 'β-Ketoacyl Synthase (condensing enzyme of FAS)',
        ec: '2.3.1.41',
        class: 'Transferase',
        he: 'KS'
      },
      substrates: [
        { key: 'acetylACP', name: 'Acetyl-ACP (or growing acyl-ACP)', smiles: S.acetylACP, isCarrier: true, stoich: 1 },
        { key: 'malonylACP', name: 'Malonyl-ACP', smiles: S.malonylACP, stoich: 1 }
      ],
      cofactors: [],
      products: [
        { key: 'acacACP', name: 'β-Ketoacyl-ACP', smiles: S.acacACP, label: { en: 'Acetoacetyl-ACP on first cycle (4C)' }, isMain: true, stoich: 1 },
        { key: 'co2', name: 'CO₂ (released!)', smiles: S.co2, label: { en: 'Same CO₂ that ACC added — makes condensation favorable' }, stoich: 1 }
      ],
      deltaG: 'Driven by CO₂ release',
      reversible: false,
      regulation: noReg,
      story: { en: 'THE WELDER joins the acetyl group (or growing chain) to malonyl-ACP, kicking out the CO₂ that ACC originally added. The CO₂ release makes the reaction thermodynamically favorable — it\'s why malonyl-CoA (3C) is used rather than a second acetyl-CoA. Net: chain grows by 2C.' },
      clinical: null,
      beats: {
        en: [
          { t: 0, text: 'Acetyl-ACP (or elongating chain) meets malonyl-ACP.', highlight: 'substrate' },
          { t: 2500, text: 'Decarboxylative condensation — CO₂ released.', highlight: 'enzyme' },
          { t: 5000, text: 'Chain extended by 2C. β-ketoacyl-ACP formed.', highlight: 'product' }
        ]
      }
    },
    {
      id: 3,
      compartment: 'cyto',
      angle: 72,
      enzyme: {
        abbr: 'KR',
        name: 'β-Ketoacyl-ACP Reductase',
        ec: '1.1.1.100',
        class: 'Oxidoreductase',
        he: 'KR'
      },
      substrates: [{ key: 'acacACP', name: 'β-Ketoacyl-ACP', smiles: S.acacACP, stoich: 1 }],
      cofactors: [
        { key: 'nadph', name: 'NADPH', smiles: S.nadph, stoich: 1, role: 'consumed' },
        { key: 'nadp', name: 'NADP⁺', smiles: S.nadp, stoich: 1, role: 'produced' }
      ],
      products: [{ key: 'hydroxyACP', name: 'β-Hydroxyacyl-ACP', smiles: S.hydroxyACP, isMain: true, stoich: 1 }],
      deltaG: 'Favorable',
      reversible: false,
      regulation: noReg,
      story: { en: 'THE FIRST REDUCER uses NADPH to reduce the β-ketone to a β-hydroxyl. This is the exact reverse of step 3 of β-oxidation (3-HA-DH) — but using NADPH instead of NAD+.' },
      clinical: null,
      beats: {
        en: [
          { t: 0, text: 'β-ketoacyl-ACP has a C=O at β position.', highlight: 'substrate' },
          { t: 2500, text: 'NADPH donates hydride — C=O → C-OH.', highlight: 'energy' },
          { t: 5000, text: 'β-hydroxyacyl-ACP ready for dehydration.', highlight: 'product' }
        ]
      }
    },
    {
      id: 4,
      compartment: 'cyto',
      angle: 144,
      enzyme: {
        abbr: 'DH',
        name: 'β-Hydroxyacyl-ACP Dehydratase',
        ec: '4.2.1.59',
        class: 'Lyase',
        he: 'DH'
      },
      substrates: [{ key: 'hydroxyACP', name: 'β-Hydroxyacyl-ACP', smiles: S.hydroxyACP, stoich: 1 }],
      cofactors: [{ key: 'h2o', name: 'H₂O', smiles: S.h2o, stoich: 1, role: 'produced' }],
      products: [{ key: 'enoylACP', name: 'trans-Δ²-Enoyl-ACP', smiles: S.enoylACP, isMain: true, stoich: 1 }],
      deltaG: 'Reversible',
      reversible: true,
      regulation: noReg,
      story: { en: 'THE WATER REMOVER dehydrates β-hydroxyacyl to create a trans-Δ² double bond. Reverse of β-oxidation step 2 (enoyl-CoA hydratase).' },
      clinical: null,
      beats: {
        en: [
          { t: 0, text: 'β-hydroxyacyl-ACP has OH at β-carbon.', highlight: 'substrate' },
          { t: 2500, text: 'Dehydration removes water.', highlight: 'enzyme' },
          { t: 5000, text: 'trans-Δ²-enoyl-ACP formed.', highlight: 'product' }
        ]
      }
    },
    {
      id: 5,
      compartment: 'cyto',
      angle: 216,
      enzyme: {
        abbr: 'ER',
        name: 'Enoyl-ACP Reductase',
        ec: '1.3.1.9',
        class: 'Oxidoreductase',
        he: 'ER'
      },
      substrates: [{ key: 'enoylACP', name: 'trans-Δ²-Enoyl-ACP', smiles: S.enoylACP, stoich: 1 }],
      cofactors: [
        { key: 'nadph', name: 'NADPH', smiles: S.nadph, stoich: 1, role: 'consumed' },
        { key: 'nadp', name: 'NADP⁺', smiles: S.nadp, stoich: 1, role: 'produced' }
      ],
      products: [{ key: 'butyrylACP', name: 'Acyl-ACP (+2C, saturated)', smiles: S.butyrylACP, label: { en: 'Butyryl-ACP (4C) on first cycle' }, isMain: true, isCarrier: true, stoich: 1 }],
      deltaG: 'Favorable',
      reversible: false,
      regulation: noReg,
      story: { en: 'THE SECOND REDUCER uses another NADPH to reduce the double bond, giving a saturated acyl chain 2 carbons longer than we started. If chain < 16C → back to step 2 (condense again). If chain = 16C → release palmitate.' },
      clinical: null,
      beats: {
        en: [
          { t: 0, text: 'Trans-Δ² double bond awaits reduction.', highlight: 'substrate' },
          { t: 2500, text: 'Second NADPH reduces double bond to single.', highlight: 'energy' },
          { t: 5000, text: 'Saturated acyl-ACP — 2 carbons longer than input.', highlight: 'product' },
          { t: 7500, text: 'Repeat from step 2 until chain is 16C (palmitate).', highlight: 'carrier' }
        ]
      }
    }
  ],

  intermediates: [
    { id: 'malonylCoA', afterStep: 1, beforeStep: 2, name: 'Malonyl-CoA', smiles: S.malonylCoA },
    { id: 'acacACP', afterStep: 2, beforeStep: 3, name: 'β-Ketoacyl-ACP', smiles: S.acacACP },
    { id: 'hydroxyACP', afterStep: 3, beforeStep: 4, name: 'β-Hydroxyacyl-ACP', smiles: S.hydroxyACP },
    { id: 'enoylACP', afterStep: 4, beforeStep: 5, name: 'trans-Δ²-Enoyl-ACP', smiles: S.enoylACP },
    { id: 'acylACP', afterStep: 5, beforeStep: 2, name: 'Acyl-ACP (+2C)', smiles: S.butyrylACP, carrier: true }
  ],

  integrations: [
    {
      name: 'Acetyl-CoA source (citrate shuttle)',
      toStep: 1,
      fromCycle: 'Citrate shuttle',
      path: { en: 'Mitochondrial citrate (when TCA overflows) → cytosol → (citrate lyase, ATP) → acetyl-CoA + OAA. Cytosolic acetyl-CoA cannot cross mito membrane directly.' },
      note: { en: 'Citrate is the key "fed state" signal: TCA is full, shuttle fuel to lipogenesis.' }
    },
    {
      name: 'NADPH source — PPP + malic enzyme',
      toStep: 3,
      fromCycle: 'PPP / malic enzyme',
      path: { en: 'Oxidative PPP: G6P → 2 NADPH per G6P. Malic enzyme (cytosol): malate + NADP+ → pyruvate + CO₂ + NADPH. Each palmitate needs 14 NADPH.' },
      note: { en: 'The malic enzyme loop: OAA (from citrate lyase) → malate → pyruvate + NADPH → pyruvate recycled to mito. Elegant balance sheet.' }
    },
    {
      name: 'Reciprocal regulation with β-oxidation',
      toCycle: 'β-Oxidation',
      path: { en: 'Malonyl-CoA (product of step 1 here) INHIBITS CPT-1 (first step of β-ox). Therefore when FA synthesis is ON, β-ox is OFF.' },
      note: { en: 'Elegant: one molecule (malonyl-CoA) is both the committed building block for synthesis AND the switch to turn off breakdown.' }
    },
    {
      name: 'Chain elongation (beyond C16)',
      fromCycle: 'ER elongation system',
      path: { en: 'Palmitate (C16) → ER elongases → C18, C20, C22... (uses malonyl-CoA + NADPH, same chemistry on ER surface).' },
      note: { en: 'Main product of cytosolic FAS is palmitate (C16). Longer chains made in ER.' }
    },
    {
      name: 'Desaturation',
      fromCycle: 'ER desaturases',
      path: { en: 'Stearoyl-CoA desaturase (SCD1, Δ9 desaturase) introduces first double bond. Humans cannot make Δ12 or Δ15 — so linoleate (18:2 ω-6) and linolenate (18:3 ω-3) are ESSENTIAL FAs.' },
      note: { en: 'This is why dietary ω-3 and ω-6 fatty acids matter.' }
    },
    {
      name: 'Hormonal regulation',
      toStep: 1,
      path: { en: 'Insulin → dephosphorylates ACC + PDH → active + SREBP-1c induces ACC/FAS/citrate lyase. Glucagon/Epi → phosphorylates ACC → inactive. AMPK (low energy) → phosphorylates ACC → inactive.' },
      note: { en: 'ACC is a classic "nutrient sensor": reads fed state from insulin + citrate, and starvation/exercise from glucagon + AMPK.' }
    },
    {
      name: 'Clinical: Statin indirect effect',
      path: { en: 'Statins inhibit HMG-CoA reductase (cholesterol synthesis), not FAS. But SREBP-2 regulates both pathways — indirect crosstalk.' },
      note: { en: 'Dedicated FAS inhibitors (orlistat targets gastric lipase, not FAS) — FAS itself is a cancer drug target but no clinical agent yet.' }
    }
  ],

  bigPicture: {
    en: [
      { k: 'Location', v: 'Cytosol (contrast: β-ox = mitochondrial matrix)' },
      { k: 'Main product', v: 'Palmitate (C16:0, fully saturated)' },
      { k: 'Committed step', v: 'Acetyl-CoA carboxylase (ACC) — makes malonyl-CoA. Biotin-dependent. Rate-limiting.' },
      { k: 'Overall reaction', v: '8 Acetyl-CoA + 7 ATP + 14 NADPH → Palmitate + 8 CoA + 6 H₂O + 14 NADP+' },
      { k: 'Per turn of spiral', v: '+2 carbons (from malonyl-CoA, 1 CO₂ released), −2 NADPH' },
      { k: 'Total cost of palmitate', v: '7 ATP (to make 7 malonyl-CoAs) + 14 NADPH — expensive!' },
      { k: 'Carrier for growing chain', v: 'ACP (acyl carrier protein) — within FAS complex. (Contrast: β-ox uses CoA.)' },
      { k: 'Reducing equivalent', v: 'NADPH (contrast: β-ox produces NADH + FADH₂)' },
      { k: 'Four-step cycle', v: 'Condense (with CO₂ release) → Reduce (NADPH) → Dehydrate → Reduce (NADPH). Functionally reverse of β-ox but with different cofactors/sites.' },
      { k: 'ACC activators', v: 'Citrate (allosteric, "fed signal"), Insulin (dephosphorylation via PP1)' },
      { k: 'ACC inhibitors', v: 'Palmitoyl-CoA (feedback), Glucagon (PKA phosphorylation), AMPK (low energy state)' },
      { k: 'Acetyl-CoA source in cytosol', v: 'Citrate shuttle: mito citrate → cyto → citrate lyase → acetyl-CoA + OAA (ATP cost)' },
      { k: 'NADPH source', v: 'PPP (oxidative phase) + malic enzyme + isocitrate dehydrogenase (cytosolic)' },
      { k: 'Reciprocal with β-ox', v: 'Malonyl-CoA INHIBITS CPT-1 → prevents simultaneous synthesis and breakdown' },
      { k: 'Essential FAs', v: 'Linoleate (18:2 ω-6) and α-linolenate (18:3 ω-3) — humans lack Δ12 and Δ15 desaturases' },
      { k: 'Biotin-dependent enzymes mnemonic', v: '"Pyruvate Carboxylase Adds Propionyl" — PC, ACC, PCC, MCC (pyruvate carb, acetyl-CoA carb, propionyl-CoA carb, methylcrotonyl-CoA carb)' }
    ]
  },

  questions: [
    { id: 'fas-q1', difficulty: 'easy', prompt: { en: 'The rate-limiting enzyme of fatty acid synthesis is:', he: '' }, correct: 'Acetyl-CoA carboxylase (ACC)', options: ['Acetyl-CoA carboxylase (ACC)', 'Fatty acid synthase (FAS)', 'Citrate lyase', 'CPT-1'] },
    { id: 'fas-q2', difficulty: 'easy', prompt: { en: 'Fatty acid synthesis occurs in the:', he: '' }, correct: 'Cytosol', options: ['Cytosol', 'Mitochondrial matrix', 'ER lumen', 'Peroxisome'] },
    { id: 'fas-q3', difficulty: 'medium', prompt: { en: 'Which reducing equivalent is used by fatty acid synthase?', he: '' }, correct: 'NADPH', options: ['NADPH', 'NADH', 'FADH₂', 'NADH and FADH₂'] },
    { id: 'fas-q4', difficulty: 'medium', prompt: { en: 'ACC requires which vitamin cofactor?', he: '' }, correct: 'Biotin (B7)', options: ['Biotin (B7)', 'Thiamine (B1)', 'Riboflavin (B2)', 'Pyridoxine (B6)'] },
    { id: 'fas-q5', difficulty: 'hard', prompt: { en: 'Malonyl-CoA has which regulatory effect on β-oxidation?', he: '' }, correct: 'Inhibits CPT-1 (rate-limiting step of β-ox)', options: ['Inhibits CPT-1 (rate-limiting step of β-ox)', 'Activates CPT-1', 'Inhibits thiolase', 'No effect'] },
    { id: 'fas-q6', difficulty: 'medium', prompt: { en: 'The main end product of cytosolic FAS is:', he: '' }, correct: 'Palmitate (C16:0)', options: ['Palmitate (C16:0)', 'Stearate (C18:0)', 'Oleate (C18:1)', 'Acetoacetate'] },
    { id: 'fas-q7', difficulty: 'hard', prompt: { en: 'Each cycle of the FAS spiral produces a chain that is:', he: '' }, correct: '2 carbons longer, using 2 NADPH', options: ['2 carbons longer, using 2 NADPH', '2 carbons longer, using 1 NADH + 1 FADH₂', '1 carbon longer, using 1 NADPH', '4 carbons longer, using 4 NADPH'] },
    { id: 'fas-q8', difficulty: 'hard', prompt: { en: 'Cytosolic acetyl-CoA for FA synthesis comes from:', he: '' }, correct: 'Citrate (exported from mitochondria, cleaved by citrate lyase)', options: ['Citrate (exported from mitochondria, cleaved by citrate lyase)', 'Pyruvate directly', 'Acetoacetate', 'Glucose directly'] },
    { id: 'fas-q9', difficulty: 'medium', prompt: { en: 'ACC is activated allosterically by:', he: '' }, correct: 'Citrate', options: ['Citrate', 'AMP', 'Palmitoyl-CoA', 'ATP'] },
    { id: 'fas-q10', difficulty: 'hard', prompt: { en: 'The carrier of the growing chain in FAS is:', he: '' }, correct: 'ACP (acyl carrier protein)', options: ['ACP (acyl carrier protein)', 'CoA-SH', 'Carnitine', 'Biotin'] },
    { id: 'fas-q11', difficulty: 'medium', prompt: { en: 'Glucagon inhibits ACC by:', he: '' }, correct: 'Promoting PKA phosphorylation of ACC', options: ['Promoting PKA phosphorylation of ACC', 'Allosteric binding', 'Degrading ACC', 'Blocking biotin'] },
    { id: 'fas-q12', difficulty: 'hard', prompt: { en: 'Which fatty acids are essential in human diet?', he: '' }, correct: 'Linoleate (ω-6) and α-linolenate (ω-3)', options: ['Linoleate (ω-6) and α-linolenate (ω-3)', 'Palmitate and stearate', 'Oleate and palmitoleate', 'Arachidate only'] },
    { id: 'fas-q13', difficulty: 'hard', prompt: { en: 'Which reaction step of FAS involves CO₂ release?', he: '' }, correct: 'Condensation (KS) — releases the CO₂ that ACC added', options: ['Condensation (KS) — releases the CO₂ that ACC added', 'Second reduction (ER)', 'Dehydration (DH)', 'First reduction (KR)'] },
    { id: 'fas-q14', difficulty: 'hard', prompt: { en: 'Per palmitate, how many NADPH are consumed?', he: '' }, correct: '14', options: ['14', '7', '8', '16'] }
  ]
};
