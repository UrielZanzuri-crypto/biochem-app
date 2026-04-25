// ============================================================
// ELECTRON TRANSPORT CHAIN + OXIDATIVE PHOSPHORYLATION
// Inner mitochondrial membrane — 4 complexes + ATP synthase
// ============================================================

// Note: SMILES omitted for most ETC components — they're iron-sulfur clusters,
// membrane-embedded complexes, or quinones where a 2D structure adds little.
// Kept for the few small molecules (O2, H2O, ubiquinone core).

const S = {
  nadh:     'NC(=O)C1=CN(C=CC1)C2OC(CO)C(O)C2O',
  nad:      'NC(=O)c1ccc[n+](c1)C2OC(CO)C(O)C2O',
  fadh2:    'Cc1cc2NC3C(=O)NC(=O)N(C4OC(CO)C(O)C4O)C3=Nc2cc1C',
  fad:      'Cc1cc2nc3c(=O)[nH]c(=O)n(C4OC(CO)C(O)C4O)c3nc2cc1C',
  ubiquinone:      'CC1=C(C)C(=O)C(C)=C(CC=C(C)CCC=C(C)C)C1=O',  // simplified CoQ
  ubiquinol:       'OC1=C(C)C(O)=C(CC=C(C)CCC=C(C)C)C(=C1C)O',
  o2:       'O=O',
  h2o:      'O',
  atp:      'Nc1ncnc2n(cnc12)C3OC(COP(O)(=O)OP(O)(=O)OP(O)(=O)O)C(O)C3O',
  adp:      'Nc1ncnc2n(cnc12)C3OC(COP(O)(=O)OP(O)(=O)O)C(O)C3O',
  pi:       'OP(O)(O)=O'
};

const noReg = { activators: [], inhibitors: [], summary: { en: 'Regulated by the overall [NADH]/[NAD+] ratio and the proton-motive force (backpressure inhibits electron flow).' } };

export const etcCycle = {
  id: 'etc',
  chapter: 'Oxidative Phosphorylation',
  chapterOrder: 6,
  order: 1,
  layout: 'linear',
  title: { en: 'Electron Transport Chain & Oxidative Phosphorylation', he: 'שרשרת העברת אלקטרונים' },
  subtitle: { en: 'NADH/FADH₂ → O₂ via 4 complexes → proton gradient → ATP', he: 'NADH/FADH₂ → חמצן → גרדיאנט פרוטונים → ATP' },

  context: {
    tissue: { en: 'All aerobic tissues. Highest density: heart (~35% of cell volume = mitochondria), skeletal muscle (oxidative fibers), liver, brain, kidney.' },
    otherTissues: { en: 'NOT in RBCs (no mitochondria). Low: white adipose (brown adipose is opposite — packed with uncoupled mitochondria for heat).' },
    state: { en: 'Active whenever the cell has fuel and oxygen. Rate is controlled by ADP availability: high [ADP] (low energy) drives electron flow; high [ATP] (full charge) stalls it via the proton gradient backpressure.' },
    stateHormonal: { en: 'Thyroid hormone (T3) → increases mitochondrial mass + expression of uncoupling proteins → raises basal metabolic rate (hyperthyroidism = heat intolerance).' },
    turnover: { en: 'Millisecond response: electron flow slows within seconds as ATP rises (via ΔμH+ backpressure = "respiratory control").' }
  },

  overview: {
    en: `The electron transport chain (ETC) and oxidative phosphorylation together account for ~90% of the ATP made from glucose and nearly 100% of ATP from fatty acids. NADH and FADH₂ (from glycolysis, TCA, β-oxidation, PDH) deliver electrons to the inner mitochondrial membrane. Four complexes pass those electrons down an energy gradient until they reduce O₂ to H₂O. Three complexes (I, III, IV) couple this flow to PUMPING PROTONS from the matrix into the intermembrane space, creating an electrochemical gradient (proton-motive force, ΔμH+). ATP synthase (complex V) lets protons flow back down the gradient through its rotor, coupling that to ADP + Pi → ATP synthesis (chemiosmotic theory, Peter Mitchell 1961, Nobel 1978). Stoichiometry: 1 NADH → ~2.5 ATP (enters at Complex I). 1 FADH₂ → ~1.5 ATP (enters at Complex II, bypasses I, so fewer protons pumped). Key clinical: cyanide poisoning (Complex IV), rotenone (Complex I), antimycin (Complex III), oligomycin (Complex V), 2,4-DNP uncoupling (drug + industrial poison, makes mitochondria "leaky" → heat not ATP), aspirin overdose (mild uncoupler → hyperthermia). Brown adipose tissue: physiologic uncoupling via UCP1 (thermogenin) to generate heat.`
  },

  // ============================================================
  // PEDAGOGY — Plain-English explanations of the high-yield concepts.
  // ============================================================
  pedagogy: [
    {
      title: 'Hypoxia and HIF-1α — How the cell senses low O₂',
      icon: '🫁',
      body: `O₂ is the FINAL electron acceptor at Complex IV. Without it, electrons back up — NADH/FADH₂ stay reduced, the TCA cycle stalls, and the cell can\'t make ATP from oxidative phosphorylation.

**HIF-1α (Hypoxia Inducible Factor-1α)** is the master sensor. It is a transcription factor whose stability depends on O₂:

• **Normoxia (O₂ adequate):** HIF-prolyl hydroxylases (PHDs, **need O₂ + α-ketoglutarate + Fe²⁺**) hydroxylate HIF-1α → recognized by VHL → ubiquitinated → degraded. So normally there is NO HIF-1α around.

• **Hypoxia (O₂ low):** PHDs cannot work without O₂ → HIF-1α is NOT hydroxylated → escapes degradation → translocates to nucleus → dimerizes with HIF-1β → turns on hypoxic genes:
  – **EPO** (erythropoietin) → more red blood cells
  – **VEGF** → new blood vessels
  – **GLUT-1, GLUT-3** → more glucose uptake
  – **All glycolytic enzymes** → push the cell toward anaerobic ATP
  – **PDK1** (pyruvate dehydrogenase kinase) → INHIBITS PDH → diverts pyruvate to lactate, away from TCA

**Cancer angle (Warburg effect):** Many tumors keep HIF-1α high even in normoxia (\"pseudohypoxia\") — explains why cancer cells favor glycolysis even with O₂ around. **VHL disease** = constant HIF-1α activation → renal cell carcinoma, hemangioblastomas. The 2019 Nobel Prize was for this oxygen-sensing pathway.`
    },
    {
      title: 'Complex I bypass — Electrons that skip the first complex',
      icon: '↩️',
      body: `Complex I is the entry point for **NADH-derived electrons**. But not all electrons go through Complex I:

**Complex II (succinate dehydrogenase)** is the entry point for **FADH₂-derived electrons**. It\'s actually the same enzyme that does step 6 of TCA (succinate → fumarate). FADH₂ is bound inside the enzyme; electrons flow from FADH₂ → Fe-S clusters → ubiquinone (Q). Complex II does NOT pump protons — that\'s why FADH₂ yields less ATP (~1.5) than NADH (~2.5).

**ETF-Q oxidoreductase (β-oxidation entry):** In β-oxidation, the first step uses an FAD attached to Acyl-CoA dehydrogenase. The FADH₂ formed there can\'t directly reduce Q. Instead, electrons go to **Electron Transferring Flavoprotein (ETF)** → ETF-Q oxidoreductase → ubiquinone. Like Complex II, this bypasses Complex I.

**Glycerol-3-phosphate shuttle (cytosolic NADH bypass):** Cytosolic NADH (from glycolysis) can\'t cross the inner membrane. The G3P shuttle uses a cytosolic enzyme + a mitochondrial enzyme (mtG3PDH) to dump the electrons directly onto an FAD inside the mt-membrane → Q. The cost: cytosolic NADH (would yield 2.5 ATP) becomes mitochondrial FADH₂-like (yields only 1.5 ATP). Used in muscle/brain.

**Malate-aspartate shuttle (the better one):** Used in heart, liver, kidney. Cytosolic NADH reduces OAA → malate → enters mitochondrion → re-oxidized to OAA → makes mitochondrial NADH (preserves the full 2.5 ATP). Why hearts use this shuttle: heart needs every last ATP.`
    },
    {
      title: 'Complex II bypass — Other paths to Q',
      icon: '⚡',
      body: `Complex II isn\'t a bypass per se — it IS the FADH₂ entry point. But the reverse question is: can other things skip Complex II? Yes, several flavoproteins reduce ubiquinone independently:

• **DHODH (dihydroorotate dehydrogenase)** — pyrimidine synthesis enzyme on the inner membrane. Donates electrons to Q. **Leflunomide and teriflunomide** (autoimmune drugs) inhibit DHODH → blocks pyrimidine synthesis in proliferating lymphocytes.

• **G3P-DH-2 (mitochondrial glycerol-3-phosphate dehydrogenase)** — the "middle man" of the G3P shuttle, sits in the inner membrane facing the intermembrane space, with FAD. Reduces Q.

• **ETF-Q oxidoreductase** — receives electrons from β-oxidation FADs (see Complex I bypass above). Multiple Acyl-CoA Dehydrogenase Deficiency (MADD/glutaric acidemia type II) is the disease.

The point: Q is a "common pool" that many flavoproteins feed into. This is why SIRS/sepsis or inherited mitochondrial diseases can affect multiple metabolic outputs at once — they share Q.`
    },
    {
      title: 'Why FADH₂ yields less ATP than NADH (the math)',
      icon: '🧮',
      body: `Each H⁺ pumped is "stored energy" that ATP synthase will later convert to ATP (about 4 H⁺ per ATP made).

NADH path (Complex I → III → IV): 4 + 4 + 2 = **10 H⁺ pumped** → ~2.5 ATP

FADH₂ path (Complex II → III → IV): 0 + 4 + 2 = **6 H⁺ pumped** → ~1.5 ATP

Complex II doesn\'t pump protons — that\'s the entire reason FADH₂ "costs" 1 ATP-equivalent less than NADH. The energy gap between FADH₂ and Q is too small to power proton pumping.

This is also why mitochondrial encephalopathies that block Complex I (Leigh syndrome, MELAS) preserve FADH₂-driven function (succinate, β-oxidation can still work) but cripple anything NADH-dependent (TCA, glycolysis-fed energy). Treatment hint: high-fat / ketogenic diets in some Complex I disorders shift to FADH₂-rich substrates.`
    }
  ],

  storyFrame: {
    en: {
      title: 'The Proton Dam',
      setting: 'Imagine a hydroelectric dam. Electrons tumbling from NADH/FADH₂ down an energy slope are the turbines at three stations (Complexes I, III, IV), each pumping water (protons) up over the dam. Behind the dam, water (protons) accumulate — that is the proton-motive force, stored energy. At one controlled gate (ATP synthase), water rushes back down through a waterwheel that spins and couples its rotation to ATP synthesis. Poisons can plug the turbines (block electron flow, no ATP + no heat), or drill a hole in the dam (uncouplers — water drains back through without powering the wheel → heat without ATP).',
      characters: [
        { name: 'Complex I', role: 'NADH gate (pumps 4 H+)', icon: '🔌', color: '#dc2626' },
        { name: 'Complex II', role: 'FADH₂ gate (no pumping)', icon: '🔄', color: '#ea580c' },
        { name: 'Complex III', role: 'Q → cyt c (pumps 4 H+)', icon: '⚡', color: '#f59e0b' },
        { name: 'Complex IV', role: 'O₂ → H₂O (pumps 2 H+)', icon: '💨', color: '#0891b2' },
        { name: 'ATP Synthase', role: 'The Waterwheel', icon: '🔁', color: '#059669' }
      ]
    }
  },

  mnemonic: {
    en: { phrase: '"Can I Keep Selling Over Priced Apple Cider?" — Complex I (rotenone), II (malonate), III (antimycin), IV (CN/CO/azide), V (oligomycin). Uncouplers: 2,4-DNP, aspirin, thermogenin.', breakdown: 'I = NADH DH. II = Succinate DH. III = Cyt b-c1. IV = Cytochrome oxidase. V = ATP synthase.' }
  },

  compartments: {
    mito: { en: 'Inner Mitochondrial Membrane', he: 'ממברנה פנימית', color: '#fef3c7', accent: '#f59e0b' }
  },

  steps: [
    {
      id: 1,
      compartment: 'mito',
      phase: 'etc',
      linearPos: 0,
      enzyme: { abbr: 'Complex I', name: 'NADH:Ubiquinone Oxidoreductase (NADH DH)', ec: '7.1.1.2', class: 'Oxidoreductase', he: 'קומפלקס I' },
      substrates: [{ key: 'nadh', name: 'NADH', smiles: S.nadh, isSource: true, stoich: 1 }],
      cofactors: [
        { key: 'ubiquinone', name: 'Ubiquinone (Q)', smiles: S.ubiquinone, stoich: 1, role: 'consumed' },
        { key: 'ubiquinol', name: 'Ubiquinol (QH₂)', smiles: S.ubiquinol, stoich: 1, role: 'produced' },
        { key: 'nad', name: 'NAD⁺', smiles: S.nad, stoich: 1, role: 'produced', note: { en: 'Returned to TCA / glycolysis / β-ox' } }
      ],
      products: [{ key: 'hplus', name: '4 H⁺ pumped', smiles: '', label: { en: 'Matrix → intermembrane space' }, isMain: true, stoich: 4 }],
      deltaG: '−69 kJ/mol (highly exergonic)',
      reversible: false,
      regulation: {
        activators: [],
        inhibitors: [
          { name: 'Rotenone', type: 'toxic', critical: true, note: { en: 'Fish poison / insecticide. Classic Complex I inhibitor. Causes Parkinson-like features in rats (used as animal model).' } },
          { name: 'Amytal (amobarbital)', type: 'drug', note: { en: 'Barbiturate — inhibits Complex I' } },
          { name: 'MPP+ (from MPTP)', type: 'toxic', critical: true, note: { en: 'MPTP (contaminant of synthetic heroin) → MPP+ → Complex I inhibition → selective dopaminergic neuron death → parkinsonism. Gave crucial insight into Parkinson\'s disease pathogenesis.' } }
        ],
        summary: { en: 'The major entry point for electrons from NADH. Pumps 4 H+ per NADH. Largest ETC complex (~45 subunits). Contains FMN + 8 Fe-S clusters. Its inhibition is linked to parkinsonism.' }
      },
      story: { en: 'COMPLEX I receives 2 electrons from NADH (via FMN, then Fe-S clusters) and passes them to ubiquinone (Q), reducing it to QH₂. The energy of this electron drop is used to pump 4 protons from matrix to intermembrane space. Rotenone blocks this — electrons pile up, NAD+ is not regenerated, TCA stalls.' },
      clinical: {
        disorder: 'Complex I deficiency / MPTP-induced parkinsonism',
        inheritance: 'Mitochondrial or autosomal, or acquired (MPTP)',
        findings: { en: 'Most common cause of inherited mitochondrial disease. Leigh syndrome in infants (brainstem/basal ganglia necrosis), lactic acidosis. MPTP → MPP+ selectively kills substantia nigra neurons (Parkinson-like) — demonstrated that Complex I dysfunction may play a role in idiopathic Parkinson\'s disease.' },
        treatment: { en: 'Supportive. CoQ10 and riboflavin supplements sometimes tried. Avoid known Complex I inhibitors.' }
      },
      beats: {
        en: [
          { t: 0, text: 'NADH delivers 2 electrons to Complex I.', highlight: 'substrate' },
          { t: 2500, text: 'Electrons flow through FMN → Fe-S clusters → ubiquinone.', highlight: 'enzyme' },
          { t: 5000, text: '4 protons pumped to intermembrane space.', highlight: 'energy' },
          { t: 7500, text: 'QH₂ (reduced Q) carries electrons sideways to Complex III.', highlight: 'product' }
        ]
      }
    },
    {
      id: 2,
      compartment: 'mito',
      phase: 'etc',
      linearPos: 1,
      enzyme: { abbr: 'Complex II', name: 'Succinate Dehydrogenase (SDH)', ec: '1.3.5.1', class: 'Oxidoreductase', he: 'קומפלקס II' },
      substrates: [{ key: 'fadh2', name: 'FADH₂ (bound)', smiles: S.fadh2, stoich: 1, note: { en: 'FADH₂ is an internal cofactor — it\'s generated BY Complex II when succinate → fumarate during TCA' } }],
      cofactors: [
        { key: 'ubiquinone', name: 'Ubiquinone (Q)', smiles: S.ubiquinone, stoich: 1, role: 'consumed' },
        { key: 'ubiquinol', name: 'Ubiquinol (QH₂)', smiles: S.ubiquinol, stoich: 1, role: 'produced' }
      ],
      products: [{ key: 'no_pump', name: 'NO protons pumped', smiles: '', label: { en: 'Just electron transfer' }, isMain: true, stoich: 0 }],
      deltaG: 'Near zero (electron transfer only)',
      reversible: false,
      regulation: {
        activators: [],
        inhibitors: [
          { name: 'Malonate', type: 'competitive', critical: true, note: { en: 'Classic competitive inhibitor of succinate dehydrogenase — structural analog of succinate' } },
          { name: 'SDH mutations (SDHB, SDHC, SDHD)', type: 'genetic', critical: true, note: { en: 'Inherited paraganglioma / pheochromocytoma syndromes' } }
        ],
        summary: { en: 'Also TCA enzyme 6. Transfers electrons from FADH₂ (made when succinate → fumarate) to Q. CRITICAL: pumps NO protons — that\'s why FADH₂-derived ATP yield (~1.5) is less than NADH (~2.5). Embedded in inner membrane (unlike the other TCA enzymes, all in matrix).' }
      },
      story: { en: 'COMPLEX II is the ONLY TCA enzyme in the inner membrane — and it IS part of the ETC. Unlike Complex I, it pumps NO protons. It\'s the "side entrance" for FADH₂-derived electrons, which is why FADH₂ gives less ATP than NADH.' },
      clinical: {
        disorder: 'SDH mutations',
        inheritance: 'Autosomal dominant',
        findings: { en: 'Paraganglioma / pheochromocytoma syndromes (especially SDHB → high malignancy). Accumulated succinate is an oncometabolite (like fumarate and 2-HG).' },
        treatment: { en: 'Surgical resection, family screening, long-term surveillance imaging.' }
      },
      beats: {
        en: [
          { t: 0, text: 'Succinate → Fumarate (TCA). Electrons pass into FADH₂ (bound).', highlight: 'substrate' },
          { t: 2500, text: 'Electrons move through Fe-S clusters to ubiquinone.', highlight: 'enzyme' },
          { t: 5000, text: 'NO protons pumped — this is why FADH₂ yields less ATP.', highlight: 'product' }
        ]
      }
    },
    {
      id: 3,
      compartment: 'mito',
      phase: 'etc',
      linearPos: 2,
      enzyme: { abbr: 'Complex III', name: 'Cytochrome bc₁ Complex / Ubiquinol:Cyt c Reductase', ec: '7.1.1.8', class: 'Oxidoreductase', he: 'קומפלקס III' },
      substrates: [{ key: 'ubiquinol', name: 'QH₂', smiles: S.ubiquinol, stoich: 1 }],
      cofactors: [
        { key: 'cytc_ox', name: 'Cytochrome c (ox)', smiles: '', stoich: 2, role: 'consumed', note: { en: 'Small soluble protein in intermembrane space — shuttles electrons to Complex IV' } },
        { key: 'cytc_red', name: 'Cytochrome c (red)', smiles: '', stoich: 2, role: 'produced' }
      ],
      products: [
        { key: 'ubiquinone', name: 'Q (reoxidized)', smiles: S.ubiquinone, stoich: 1 },
        { key: 'hplus', name: '4 H⁺ pumped', smiles: '', label: { en: 'Q-cycle: 4 H+ per QH₂' }, isMain: true, stoich: 4 }
      ],
      deltaG: '−37 kJ/mol',
      reversible: false,
      regulation: {
        activators: [],
        inhibitors: [
          { name: 'Antimycin A', type: 'toxic', critical: true, note: { en: 'Classic Complex III inhibitor — piscicide' } }
        ],
        summary: { en: 'Transfers electrons from QH₂ to cytochrome c via the Q-cycle mechanism. Pumps 4 H+ per QH₂. Cytochrome c (tiny soluble protein) shuttles electrons across the intermembrane space to Complex IV. Cytochrome c released to cytosol = apoptosis signal.' }
      },
      story: { en: 'COMPLEX III runs the Q-CYCLE: QH₂ is oxidized at one site while Q is reduced at another, with the net result of 4 H+ pumped per QH₂. Electrons are handed to cytochrome c (a soluble courier protein in the intermembrane space). Released cytochrome c into the cytosol triggers apoptosis — a key pathway in mitochondrial cell death.' },
      clinical: null,
      beats: {
        en: [
          { t: 0, text: 'QH₂ arrives with 2 electrons.', highlight: 'substrate' },
          { t: 2500, text: 'Q-cycle: sequential oxidation/reduction + 4 H+ pumped.', highlight: 'enzyme' },
          { t: 5000, text: 'Electrons transferred to cytochrome c (2 molecules, 1 e each).', highlight: 'product' }
        ]
      }
    },
    {
      id: 4,
      compartment: 'mito',
      phase: 'etc',
      linearPos: 3,
      enzyme: { abbr: 'Complex IV', name: 'Cytochrome c Oxidase', ec: '7.1.1.9', class: 'Oxidoreductase', he: 'קומפלקס IV' },
      substrates: [
        { key: 'cytc_red', name: 'Cytochrome c (red)', smiles: '', stoich: 4 },
        { key: 'o2', name: 'O₂', smiles: S.o2, label: { en: 'THE final electron acceptor' }, stoich: 1 }
      ],
      cofactors: [],
      products: [
        { key: 'h2o', name: '2 H₂O', smiles: S.h2o, isMain: true, stoich: 2 },
        { key: 'hplus', name: '2 H⁺ pumped', smiles: '', label: { en: 'Per O₂ reduced' }, isMain: true, stoich: 2 }
      ],
      deltaG: '−112 kJ/mol (largest drop)',
      reversible: false,
      regulation: {
        activators: [],
        inhibitors: [
          { name: 'Cyanide (CN⁻)', type: 'toxic', critical: true, note: { en: 'Binds Fe³⁺ of cytochrome a3 → electron transport halts → cells suffocate even with O₂ present. "Histotoxic hypoxia". Treatment: amyl/sodium nitrite → methemoglobin (binds CN); hydroxocobalamin; sodium thiosulfate.' } },
          { name: 'Carbon monoxide (CO)', type: 'toxic', critical: true, note: { en: 'Binds Fe²⁺ (reduced heme). Also binds hemoglobin with 200× affinity of O2 → both tissue hypoxia AND ETC block. Treatment: 100% O₂ or hyperbaric.' } },
          { name: 'Sodium azide (N₃⁻)', type: 'toxic', note: { en: 'Lab/industrial poison; similar to cyanide mechanism' } },
          { name: 'Hydrogen sulfide (H₂S)', type: 'toxic', note: { en: 'At high concentrations — same mechanism' } }
        ],
        summary: { en: 'The TERMINAL oxidase — where electrons finally meet O₂. Reduces O₂ → 2 H₂O using 4 electrons. Pumps 2 H+ per O₂. Contains hemes a, a3 and two copper centers. The 4-electron reduction is kinetically controlled to avoid generating ROS.' }
      },
      story: { en: 'COMPLEX IV is the final bottleneck. 4 cytochrome c deliver 4 electrons, and 1 O₂ accepts them all at once (4e reduction), producing 2 H₂O — this is the reason we BREATHE OXYGEN. Cyanide/CO block this step completely → tissues suffocate even if blood is O₂-rich. Classic test question: "cherry-red skin" in CO poisoning vs. blue in respiratory failure.' },
      clinical: {
        disorder: 'Cyanide / Carbon Monoxide poisoning',
        inheritance: 'Acquired (toxic exposure)',
        findings: { en: 'Cyanide: bitter almond smell, cherry-red skin, seizures, arrhythmias, lactic acidosis, venous O₂ high (tissues can\'t extract). Sources: combustion products, industry, amygdalin. CO: headache, confusion, cherry-red skin, pulse ox FALSELY NORMAL (reads COHb as O₂Hb). Sources: faulty heaters, car exhaust, smoke inhalation.' },
        treatment: { en: 'Cyanide: sodium nitrite + thiosulfate + hydroxocobalamin. CO: 100% O₂, hyperbaric O₂ if severe/pregnant/cardiac symptoms.' }
      },
      beats: {
        en: [
          { t: 0, text: '4 cytochrome c bring 4 electrons.', highlight: 'substrate' },
          { t: 2500, text: 'Electrons delivered to O₂ in a controlled 4e reduction.', highlight: 'enzyme' },
          { t: 5000, text: '2 H₂O produced; 2 H+ pumped.', highlight: 'product' },
          { t: 7500, text: 'This is where cyanide stops the show.', highlight: 'carrier' }
        ]
      }
    },
    {
      id: 5,
      compartment: 'mito',
      phase: 'oxphos',
      linearPos: 4,
      enzyme: { abbr: 'ATP Synthase', name: 'ATP Synthase (Complex V / F₀F₁)', ec: '7.1.2.2', class: 'Ligase/rotary motor', he: 'ATP סינתאז' },
      substrates: [
        { key: 'adp', name: 'ADP', smiles: S.adp, stoich: 1 },
        { key: 'pi', name: 'Pi', smiles: S.pi, stoich: 1 },
        { key: 'hplus_in', name: 'H⁺ (flowing BACK into matrix)', smiles: '', label: { en: '~3-4 H+ per ATP' }, isSource: true, stoich: 4 }
      ],
      cofactors: [],
      products: [{ key: 'atp', name: 'ATP', smiles: S.atp, isMain: true, isFinal: true, stoich: 1 }],
      deltaG: '−30.5 kJ/mol (standard) but driven by proton gradient',
      reversible: true,
      regulation: {
        activators: [],
        inhibitors: [
          { name: 'Oligomycin', type: 'toxic', critical: true, note: { en: 'Classic ATP synthase inhibitor. Blocks proton flow through F0 → ETC stops (backpressure) → electrons pile up unless an uncoupler is added.' } }
        ],
        summary: { en: 'The rotary molecular motor. F0 (membrane-embedded) is a proton channel + rotor. F1 (matrix-facing) has 3 catalytic sites that bind ADP+Pi → ATP as the rotor turns. ~3-4 H+ per ATP synthesized. Reversible: under some conditions it runs backward and HYDROLYZES ATP to pump protons.' }
      },
      story: { en: 'ATP SYNTHASE is the waterwheel. Protons rushing back into the matrix through F0 spin a rotor connected to F1\'s 3 catalytic sites. Each 120° turn cycles a site through ADP binding → ATP formation → release. The elegant "binding change" mechanism (Boyer, Nobel 1997). One complete revolution = 3 ATP. Oligomycin jams the rotor; uncouplers let protons leak around it.' },
      clinical: null,
      beats: {
        en: [
          { t: 0, text: 'Protons are pressurized in the intermembrane space.', highlight: 'substrate' },
          { t: 2500, text: 'They flow back through F0 → the rotor spins.', highlight: 'enzyme' },
          { t: 5000, text: 'F1 catalytic sites cycle: ADP+Pi → ATP released.', highlight: 'product' },
          { t: 7500, text: '~3-4 H+ per ATP. Roughly 2.5 ATP per NADH, 1.5 per FADH₂.', highlight: 'carrier' }
        ]
      }
    }
  ],

  intermediates: [
    { id: 'qh2_1', afterStep: 1, beforeStep: 3, name: 'QH₂ (from NADH route)', smiles: S.ubiquinol },
    { id: 'qh2_2', afterStep: 2, beforeStep: 3, name: 'QH₂ (from FADH₂ route)', smiles: S.ubiquinol },
    { id: 'cytc', afterStep: 3, beforeStep: 4, name: 'Cytochrome c', smiles: '' },
    { id: 'gradient', afterStep: 4, beforeStep: 5, name: 'H⁺ gradient (10 H+ per NADH total)', smiles: '' }
  ],

  integrations: [
    {
      name: 'NADH sources → Complex I',
      toStep: 1,
      fromCycle: 'Glycolysis / TCA / β-oxidation / PDH',
      path: { en: '2 NADH from glycolysis (need shuttle!) + 2 from PDH + 6 from TCA + varying from β-oxidation' },
      note: { en: 'Cytosolic NADH (glycolysis) must use a shuttle to enter mitochondria: malate-aspartate (heart, liver — preserves NADH) or glycerol-3-P (brain, muscle — converts to FADH₂, loses 1 ATP/NADH).' }
    },
    {
      name: 'FADH₂ sources → Complex II',
      toStep: 2,
      fromCycle: 'TCA (step 6) / β-oxidation',
      path: { en: 'Succinate → Fumarate (TCA) + each β-ox cycle generates 1 FADH₂' },
      note: { en: 'FADH₂ enters at Complex II — skips Complex I — so fewer H+ pumped → fewer ATP.' }
    },
    {
      name: 'Cytosolic NADH shuttles',
      toStep: 1,
      fromCycle: 'Shuttle systems',
      path: { en: 'Malate-aspartate shuttle: NADH-in → NADH-in-matrix (lossless). Glycerol-3-P shuttle: NADH-in → FADH₂-in-matrix (loses 1 ATP equivalent).' },
      note: { en: 'The inner mitochondrial membrane is impermeable to NADH. Which shuttle a tissue uses affects its net ATP yield from glycolysis.' }
    },
    {
      name: 'Uncoupling → Heat generation',
      fromStep: 5,
      toCycle: 'Thermogenesis',
      path: { en: 'UCP1 (thermogenin) in brown adipose lets H+ flow back without ATP synthesis → energy released as heat. Also: 2,4-DNP, aspirin overdose, some fevers.' },
      note: { en: 'Brown fat is the physiologic example (infants, cold-adapted adults). 2,4-DNP was used as diet pill in 1930s — killed people by hyperthermia.' }
    },
    {
      name: 'ROS generation',
      fromCycle: 'ROS/oxidative stress',
      path: { en: '~1-2% of electrons leak at Complexes I and III → superoxide (O₂⁻) → H₂O₂ → hydroxyl radical. Detoxified by SOD, catalase, glutathione peroxidase, PPP-derived NADPH.' },
      note: { en: 'Mitochondrial ROS damage is implicated in aging, neurodegeneration, ischemia-reperfusion injury.' }
    },
    {
      name: 'ATP export + Pi import',
      fromStep: 5,
      toCycle: 'ANT / PiC transporters',
      path: { en: 'ANT (adenine nucleotide translocase): ATP out, ADP in (1:1). PiC: Pi in with H+ (uses 1 H+ per Pi).' },
      note: { en: 'Makes true stoichiometry: each ATP exported costs ~4 H+ through ATP synthase + 1 H+ for Pi import = ~4 total.' }
    },
    {
      name: 'Apoptosis',
      fromStep: 3,
      toCycle: 'Mitochondrial apoptosis',
      path: { en: 'Cytochrome c released into cytosol → activates caspase-9 → intrinsic apoptotic pathway' },
      note: { en: 'Mitochondrial outer membrane permeabilization (MOMP) is the point of no return for most apoptotic cells.' }
    }
  ],

  bigPicture: {
    en: [
      { k: 'Location', v: 'Inner mitochondrial membrane (complexes) + matrix (TCA, β-ox fuel)' },
      { k: 'The four complexes', v: 'I: NADH DH (pumps 4 H+). II: SDH (pumps 0). III: cyt bc1 (pumps 4 H+). IV: cyt c oxidase (pumps 2 H+, reduces O₂).' },
      { k: 'Complex V (ATP synthase)', v: 'Uses H+ gradient: ~3-4 H+ in per ATP synthesized (plus 1 H+ for Pi import)' },
      { k: 'ATP yield per NADH', v: '~2.5 ATP (via Complex I entry — 10 H+ pumped, 4 H+/ATP)' },
      { k: 'ATP yield per FADH₂', v: '~1.5 ATP (via Complex II entry — 6 H+ pumped, bypasses Complex I)' },
      { k: 'Glucose total ATP (aerobic)', v: '~30-32 ATP per glucose (was historically taught as 36-38; modern count uses ~2.5/NADH not 3)' },
      { k: 'Palmitate total ATP', v: '~106 ATP (vs ~32 from glucose — fats are energy-dense)' },
      { k: 'Inhibitor I', v: 'Rotenone, amobarbital, MPP+' },
      { k: 'Inhibitor II', v: 'Malonate' },
      { k: 'Inhibitor III', v: 'Antimycin A' },
      { k: 'Inhibitor IV', v: 'Cyanide (CN⁻), CO, azide (N₃⁻), H₂S' },
      { k: 'Inhibitor V', v: 'Oligomycin' },
      { k: 'Uncouplers', v: '2,4-DNP (industrial poison, old diet pill), aspirin overdose (mild), thermogenin/UCP1 (physiologic in brown fat)' },
      { k: 'Uncoupling effect', v: 'Electron transport continues (O₂ consumed), but NO ATP made → energy released as HEAT → hyperthermia' },
      { k: 'Chemiosmotic theory', v: 'Peter Mitchell 1961. Electron flow and ATP synthesis are COUPLED VIA the proton gradient — not a direct chemical intermediate. Initially controversial, Nobel 1978.' },
      { k: 'Binding change mechanism', v: 'Boyer/Walker Nobel 1997. ATP synthase is a rotary motor with 3 cooperative catalytic sites.' },
      { k: 'Cytosolic NADH shuttles', v: 'Malate-aspartate (lossless): heart, liver. Glycerol-3-P (loses 1 ATP): brain, muscle.' },
      { k: 'Cytochrome c release', v: 'Mitochondrial intermembrane space → cytosol → activates caspase-9 → apoptosis (intrinsic pathway).' },
      { k: 'Brown adipose tissue', v: 'UCP1 (thermogenin) physiologically uncouples ETC → heat production. Active in infants and cold-adapted adults.' }
    ]
  },

  questions: [
    { id: 'etc-q1', difficulty: 'easy', prompt: { en: 'The final electron acceptor in the ETC is:', he: '' }, correct: 'O₂ (reduced to H₂O at Complex IV)', options: ['O₂ (reduced to H₂O at Complex IV)', 'NADH', 'Cytochrome c', 'Ubiquinone'] },
    { id: 'etc-q2', difficulty: 'easy', prompt: { en: 'Which complex does NOT pump protons?', he: '' }, correct: 'Complex II (SDH)', options: ['Complex II (SDH)', 'Complex I', 'Complex III', 'Complex IV'] },
    { id: 'etc-q3', difficulty: 'medium', prompt: { en: 'Cyanide inhibits the ETC by blocking:', he: '' }, correct: 'Complex IV (cytochrome c oxidase)', options: ['Complex IV (cytochrome c oxidase)', 'Complex I', 'Complex III', 'ATP synthase'] },
    { id: 'etc-q4', difficulty: 'medium', prompt: { en: 'Per NADH, approximately how many ATP are made?', he: '' }, correct: '~2.5', options: ['~2.5', '~1.5', '3', '1'] },
    { id: 'etc-q5', difficulty: 'medium', prompt: { en: 'Why does FADH₂ yield less ATP than NADH?', he: '' }, correct: 'Enters at Complex II — bypasses Complex I, fewer protons pumped', options: ['Enters at Complex II — bypasses Complex I, fewer protons pumped', 'FADH₂ carries fewer electrons', 'FADH₂ cannot reduce O₂', 'FADH₂ is degraded faster'] },
    { id: 'etc-q6', difficulty: 'hard', prompt: { en: 'Rotenone inhibits:', he: '' }, correct: 'Complex I', options: ['Complex I', 'Complex II', 'Complex III', 'Complex IV'] },
    { id: 'etc-q7', difficulty: 'hard', prompt: { en: 'Oligomycin blocks which step?', he: '' }, correct: 'ATP synthase (Complex V)', options: ['ATP synthase (Complex V)', 'Complex I', 'Complex III', 'Complex IV'] },
    { id: 'etc-q8', difficulty: 'hard', prompt: { en: 'An uncoupler like 2,4-DNP causes:', he: '' }, correct: 'Heat production without ATP synthesis', options: ['Heat production without ATP synthesis', 'Increased ATP synthesis', 'Halt of electron transport', 'Increased NADH oxidation stops'] },
    { id: 'etc-q9', difficulty: 'medium', prompt: { en: 'The physiologic uncoupler in brown adipose is:', he: '' }, correct: 'UCP1 (thermogenin)', options: ['UCP1 (thermogenin)', 'ANT', 'Complex II', 'Cytochrome c'] },
    { id: 'etc-q10', difficulty: 'hard', prompt: { en: 'Chemiosmotic theory (Mitchell) states that:', he: '' }, correct: 'Electron transport creates a proton gradient that drives ATP synthesis', options: ['Electron transport creates a proton gradient that drives ATP synthesis', 'Direct chemical bond stores energy', 'NADH directly phosphorylates ADP', 'ATP is made by substrate-level phosphorylation'] },
    { id: 'etc-q11', difficulty: 'hard', prompt: { en: 'Carbon monoxide has two toxic effects: it binds Hb AND it:', he: '' }, correct: 'Inhibits Complex IV', options: ['Inhibits Complex IV', 'Inhibits Complex I', 'Uncouples ATP synthase', 'Disrupts ATP synthase'] },
    { id: 'etc-q12', difficulty: 'hard', prompt: { en: 'Cytochrome c release into cytosol triggers:', he: '' }, correct: 'Apoptosis (via caspase-9)', options: ['Apoptosis (via caspase-9)', 'Increased ATP synthesis', 'Autophagy only', 'Necrosis always'] },
    { id: 'etc-q13', difficulty: 'medium', prompt: { en: 'The malate-aspartate shuttle moves _____ into mitochondria.', he: '' }, correct: 'Electrons from cytosolic NADH (as NADH in matrix)', options: ['Electrons from cytosolic NADH (as NADH in matrix)', 'ATP', 'Oxygen', 'FADH₂'] },
    { id: 'etc-q14', difficulty: 'hard', prompt: { en: 'MPTP causes parkinsonism by metabolite MPP+ inhibiting:', he: '' }, correct: 'Complex I in dopaminergic neurons', options: ['Complex I in dopaminergic neurons', 'Complex IV', 'Dopamine receptors', 'ATP synthase'] }
  ]
};
