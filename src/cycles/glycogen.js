// ============================================================
// GLYCOGEN METABOLISM — synthesis + breakdown
// Liver (glucose homeostasis) & muscle (ATP for contraction)
// English-only from this cycle forward
// ============================================================

const S = {
  glucose:       'OCC1OC(O)C(O)C(O)C1O',
  g1p:           'OCC1OC(OP(O)(O)=O)C(O)C(O)C1O',
  g6p:           'OCC1OC(OP(O)(O)=O)C(O)C(O)C1O',
  udpGlucose:    'OCC1OC(OP(O)(=O)OP(O)(=O)OCC2OC(n3ccc(=O)[nH]c3=O)C(O)C2O)C(O)C(O)C1O',
  glycogen:      'OCC1OC(OCC2OC(O)C(O)C(O)C2O)C(O)C(O)C1O', // simplified 2-glucose representation
  udp:           'OCC1OC(n2ccc(=O)[nH]c2=O)C(O)C1OP(O)(=O)OP(O)(O)=O',
  utp:           'OCC1OC(n2ccc(=O)[nH]c2=O)C(O)C1OP(O)(=O)OP(O)(=O)OP(O)(O)=O',
  pi:            'OP(O)(O)=O',
  ppi:           'OP(O)(=O)OP(O)(O)=O'
};

// Helper to reduce repetition
const noReg = { activators: [], inhibitors: [], summary: { en: 'Not directly regulated; flux determined by substrate availability.' } };

export const glycogenCycle = {
  id: 'glycogen',
  chapter: 'Glycogen Metabolism',
  chapterOrder: 2,
  order: 1,
  layout: 'linear',
  title: { en: 'Glycogen Metabolism', he: 'מטבוליזם גליקוגן' },
  subtitle: { en: 'Synthesis (glycogenesis) and breakdown (glycogenolysis)', he: 'סינתזת ופירוק גליקוגן' },

  context: {
    tissue: { en: 'Liver (glucose homeostasis for blood) and skeletal muscle (local ATP for contraction).', he: 'כבד (רמת גלוקוז) ושריר (ATP מקומי).' },
    otherTissues: { en: 'Small amounts: kidney, brain (minor), heart.', he: 'כמויות קטנות: כליה, מוח, לב.' },
    state: { en: 'SYNTHESIS: fed state (insulin high). BREAKDOWN: fasting (glucagon, epinephrine) or exercise (epinephrine, Ca²⁺).', he: 'סינתזה: שובע. פירוק: צום או מאמץ.' },
    stateHormonal: { en: 'Insulin → glycogen synthesis (dephosphorylates enzymes via PP1). Glucagon (liver) / Epinephrine (muscle) → breakdown via cAMP/PKA cascade.', he: 'אינסולין → סינתזה. גלוקגון/אפינפרין → פירוק.' },
    turnover: { en: 'Seconds-to-minutes via covalent phosphorylation cascade. Key: same PKA phosphorylation ACTIVATES glycogen phosphorylase AND INACTIVATES glycogen synthase — reciprocal by design.', he: 'שניות-דקות דרך קסקדת פוספורילציה.' }
  },

  overview: {
    en: `Glycogen is a branched polymer of glucose used as rapid-access energy storage. Liver glycogen buffers blood glucose (released via G6Pase); muscle glycogen fuels local contraction (no G6Pase — stays in muscle). The two opposing pathways — glycogenesis (synthesis) and glycogenolysis (breakdown) — are reciprocally regulated by a single cAMP/PKA cascade, ensuring they never run simultaneously. Synthesis: glucose → G6P → G1P → UDP-glucose → chain extension by glycogen synthase (α-1,4 bonds) + branching enzyme (α-1,6 bonds every ~10 residues). Breakdown: glycogen phosphorylase cleaves α-1,4 bonds (phosphorolysis → G1P, no ATP spent!); debranching enzyme handles α-1,6 linkages. The rate-limiting steps are glycogen synthase (synthesis) and glycogen phosphorylase (breakdown). Glycogen storage diseases (GSDs) each disrupt a specific step with a characteristic clinical pattern.`
  },

  storyFrame: {
    en: {
      title: 'The Glucose Warehouse',
      setting: 'Imagine glycogen as a branched warehouse tree — each branch can be lengthened (stocked) or shortened (withdrawn) at its tips. Workers on the left STOCK: adding UDP-glucose units to lengthen branches, with a special foreman adding new branches every 10 units. Workers on the right WITHDRAW: phosphorolytically cleaving glucose off the tips. Crucially, one alarm bell (PKA) stops the stockers AND wakes the withdrawers at the same time — the cell never does both.',
      characters: [
        { name: 'HK/GK', role: 'The Gate', icon: '🚪', color: '#dc2626' },
        { name: 'PGM', role: 'The Position Shifter', icon: '🔀', color: '#ea580c' },
        { name: 'UGP', role: 'The Activator', icon: '🔋', color: '#f59e0b' },
        { name: 'GS', role: 'The Chain Lengthener', icon: '🔗', color: '#ca8a04' },
        { name: 'Brancher', role: 'The Branch Builder', icon: '🌳', color: '#65a30d' },
        { name: 'GP', role: 'The Phosphorolyzer', icon: '✂️', color: '#059669' },
        { name: 'Debrancher', role: 'The Branch Eraser', icon: '🧹', color: '#0891b2' }
      ]
    }
  },

  mnemonic: {
    en: { phrase: 'GSD mnemonic "Viagra Pompei Cori McArdle Hers Tarui": I-Ia Von Gierke, II Pompe, III Cori, V McArdle, VI Hers, VII Tarui', breakdown: 'I=G6Pase, II=α-glucosidase, III=debrancher, IV=brancher, V=muscle phosphorylase, VI=liver phosphorylase, VII=muscle PFK-1' }
  },

  compartments: {
    cyto: { en: 'Cytosol', he: 'ציטוזול', color: '#dbeafe', accent: '#3b82f6' }
  },

  steps: [
    {
      id: 1,
      compartment: 'cyto',
      phase: 'synthesis',
      linearPos: 0,
      enzyme: { abbr: 'HK/GK', name: 'Hexokinase / Glucokinase', ec: '2.7.1.1', class: 'Transferase', he: 'הקסוקינאז' },
      substrates: [{ key: 'glucose', name: 'Glucose', smiles: S.glucose, isSource: true, stoich: 1 }],
      cofactors: [
        { key: 'atp', name: 'ATP', smiles: 'Nc1ncnc2n(cnc12)C3OC(COP(O)(=O)OP(O)(=O)OP(O)(=O)O)C(O)C3O', stoich: 1, role: 'consumed' },
        { key: 'adp', name: 'ADP', smiles: 'Nc1ncnc2n(cnc12)C3OC(COP(O)(=O)OP(O)(=O)O)C(O)C3O', stoich: 1, role: 'produced' }
      ],
      products: [{ key: 'g6p', name: 'G6P', smiles: S.g6p, isMain: true, stoich: 1 }],
      deltaG: '−16.7 kJ/mol',
      reversible: false,
      regulation: { activators: [], inhibitors: [], summary: { en: 'Traps glucose in cell. See Glycolysis for details on isozymes.' } },
      story: { en: 'THE GATE traps incoming glucose with a phosphate — same first step as glycolysis. Now G6P can be routed to glycolysis OR glycogen synthesis.' },
      clinical: null,
      beats: {
        en: [
          { t: 0, text: 'Glucose enters the cell. Same first step as glycolysis.', highlight: 'substrate' },
          { t: 2500, text: 'Phosphorylated to G6P — now committed to intracellular fate.', highlight: 'product' }
        ]
      }
    },
    {
      id: 2,
      compartment: 'cyto',
      phase: 'synthesis',
      linearPos: 1,
      enzyme: { abbr: 'PGM', name: 'Phosphoglucomutase', ec: '5.4.2.2', class: 'Isomerase', he: 'PGM' },
      substrates: [{ key: 'g6p', name: 'G6P', smiles: S.g6p, stoich: 1 }],
      cofactors: [],
      products: [{ key: 'g1p', name: 'G1P', smiles: S.g1p, label: { en: 'Glucose-1-phosphate' }, isMain: true, stoich: 1 }],
      deltaG: '+7.1 kJ/mol (reversible; pulled forward by next step)',
      reversible: true,
      regulation: noReg,
      story: { en: 'THE POSITION SHIFTER moves the phosphate from carbon 6 to carbon 1. This is also the EXIT point from glycogenolysis — G1P made by breakdown is converted here to G6P for glycolysis/gluconeogenesis.' },
      clinical: null,
      beats: {
        en: [
          { t: 0, text: 'G6P has phosphate at C6; glycogen-building needs it at C1.', highlight: 'substrate' },
          { t: 2500, text: 'PGM shifts the phosphate — reversibly (works in both directions).', highlight: 'enzyme' },
          { t: 5000, text: 'G1P ready for activation.', highlight: 'product' }
        ]
      }
    },
    {
      id: 3,
      compartment: 'cyto',
      phase: 'synthesis',
      linearPos: 2,
      enzyme: { abbr: 'UGP', name: 'UDP-Glucose Pyrophosphorylase', ec: '2.7.7.9', class: 'Transferase', he: 'UDP-גלוקוז פירופוספורילאז' },
      substrates: [{ key: 'g1p', name: 'G1P', smiles: S.g1p, stoich: 1 }],
      cofactors: [
        { key: 'utp', name: 'UTP', smiles: S.utp, stoich: 1, role: 'consumed' },
        { key: 'ppi', name: 'PPi', smiles: S.ppi, stoich: 1, role: 'produced', note: { en: 'Rapidly hydrolyzed to 2 Pi — pulls reaction forward irreversibly' } }
      ],
      products: [{ key: 'udpGlucose', name: 'UDP-glucose', smiles: S.udpGlucose, label: { en: 'UDP-glucose (activated donor)' }, isMain: true, stoich: 1 }],
      deltaG: 'Irreversible (due to PPi hydrolysis)',
      reversible: false,
      regulation: noReg,
      story: { en: 'THE ACTIVATOR attaches UDP to G1P. UDP-glucose is the "high-energy" glucose form — ready to donate its glucose to the growing glycogen chain. Cost: one UTP. PPi hydrolysis makes the step irreversible.' },
      clinical: null,
      beats: {
        en: [
          { t: 0, text: 'G1P needs to be activated before addition to glycogen.', highlight: 'substrate' },
          { t: 2500, text: 'UTP + G1P → UDP-glucose + PPi.', highlight: 'enzyme' },
          { t: 5000, text: 'PPi is hydrolyzed to 2 Pi (irreversible step).', highlight: 'energy' },
          { t: 7500, text: 'UDP-glucose is the activated glucose donor.', highlight: 'product' }
        ]
      }
    },
    {
      id: 4,
      compartment: 'cyto',
      phase: 'synthesis',
      linearPos: 3,
      enzyme: { abbr: 'GS', name: 'Glycogen Synthase', ec: '2.4.1.11', class: 'Transferase', he: 'גליקוגן סינתאז' },
      substrates: [
        { key: 'udpGlucose', name: 'UDP-glucose', smiles: S.udpGlucose, stoich: 1 },
        { key: 'glycogen_n', name: 'Glycogen (n residues)', smiles: S.glycogen, isCarrier: true, stoich: 1 }
      ],
      cofactors: [
        { key: 'udp', name: 'UDP', smiles: S.udp, stoich: 1, role: 'produced' }
      ],
      products: [{ key: 'glycogen_n1', name: 'Glycogen (n+1)', smiles: S.glycogen, label: { en: 'Glycogen extended by 1 glucose (α-1,4 bond)' }, isMain: true, stoich: 1 }],
      deltaG: '−13.4 kJ/mol',
      reversible: false,
      regulation: {
        activators: [
          { name: 'Insulin (via PP1)', type: 'covalent (dephosphorylation)', critical: true, note: { en: 'Insulin → activates PP1 → dephosphorylates GS → ACTIVE form (GS-a)' } },
          { name: 'G6P', type: 'allosteric', note: { en: 'High G6P signals glucose abundance; also allosterically activates the phosphorylated (inactive) form' } }
        ],
        inhibitors: [
          { name: 'Glucagon / Epinephrine (via PKA)', type: 'covalent phosphorylation', critical: true, note: { en: 'PKA phosphorylates GS → INACTIVE form (GS-b). Same signal that ACTIVATES glycogen phosphorylase (reciprocal).' } }
        ],
        summary: { en: 'RATE-LIMITING for glycogen synthesis. Covalently regulated: active when DEPHOSPHORYLATED (opposite of glycogen phosphorylase!). Uses "glycogenin" as primer for new glycogen molecules.' }
      },
      story: { en: 'THE CHAIN LENGTHENER takes UDP-glucose and attaches the glucose to the growing glycogen chain via an α-1,4 bond. Rate-limiting for synthesis. KEY REGULATION: active when DEPHOSPHORYLATED (insulin state) — opposite of glycogen phosphorylase, which is active when phosphorylated. This is how the cell ensures synthesis and breakdown never run together.' },
      clinical: null,
      beats: {
        en: [
          { t: 0, text: 'Fed state: insulin active, GS is dephosphorylated (active).', highlight: 'substrate' },
          { t: 2500, text: 'UDP-glucose donates its glucose to the glycogen tip.', highlight: 'enzyme' },
          { t: 5000, text: 'α-1,4 bond formed. UDP released (recycled to UTP).', highlight: 'product' },
          { t: 7500, text: 'Chain is 1 glucose longer. Repeat.', highlight: 'carrier' }
        ]
      }
    },
    {
      id: 5,
      compartment: 'cyto',
      phase: 'synthesis',
      linearPos: 4,
      enzyme: { abbr: 'Brancher', name: 'Branching Enzyme (amylo-α-1,4→α-1,6-transferase)', ec: '2.4.1.18', class: 'Transferase', he: 'אנזים הסתעפות' },
      substrates: [{ key: 'glycogen_linear', name: 'Linear glycogen chain', smiles: S.glycogen, stoich: 1 }],
      cofactors: [],
      products: [{ key: 'glycogen_branched', name: 'Branched glycogen', smiles: S.glycogen, label: { en: 'With new α-1,6 branch point' }, isMain: true, stoich: 1 }],
      deltaG: 'Thermodynamically neutral (transfer)',
      reversible: false,
      regulation: { activators: [], inhibitors: [], summary: { en: 'Not regulated. Introduces α-1,6 branches every ~8-10 residues. Branching increases solubility + creates more ends for faster mobilization.' } },
      story: { en: 'THE BRANCH BUILDER takes a block of ~7 glucoses from the end of a chain and reattaches them at a new branch point via α-1,6 linkage. Branches every 8-10 residues give glycogen its tree-like structure. More branches = more ends = faster mobilization.' },
      clinical: {
        disorder: 'Andersen Disease (GSD IV)',
        he: 'מחלת אנדרסן (GSD IV)',
        inheritance: 'Autosomal recessive',
        findings: { en: 'Branching enzyme deficiency → abnormal glycogen with very long unbranched chains (resembles amylopectin). Cirrhosis + hepatosplenomegaly + failure to thrive → usually fatal by age 5.' },
        treatment: { en: 'Liver transplantation for hepatic form.' }
      },
      beats: {
        en: [
          { t: 0, text: 'A linear chain reaches ~11 residues.', highlight: 'substrate' },
          { t: 2500, text: 'Brancher cleaves 7 residues and reattaches them via α-1,6.', highlight: 'enzyme' },
          { t: 5000, text: 'New branch created — tree grows.', highlight: 'product' }
        ]
      }
    },
    {
      id: 6,
      compartment: 'cyto',
      phase: 'breakdown',
      linearPos: 5,
      enzyme: { abbr: 'GP', name: 'Glycogen Phosphorylase', ec: '2.4.1.1', class: 'Transferase', he: 'גליקוגן פוספורילאז' },
      substrates: [
        { key: 'glycogen_n', name: 'Glycogen (n residues)', smiles: S.glycogen, stoich: 1 },
        { key: 'pi', name: 'Pi', smiles: S.pi, label: { en: 'Inorganic phosphate (free, not ATP!)' }, stoich: 1 }
      ],
      cofactors: [],
      products: [
        { key: 'g1p', name: 'G1P', smiles: S.g1p, label: { en: 'Glucose-1-P — no ATP spent!' }, isMain: true, stoich: 1 },
        { key: 'glycogen_n-1', name: 'Glycogen (n−1)', smiles: S.glycogen, isCarrier: true, stoich: 1 }
      ],
      deltaG: '+3 kJ/mol (near equilibrium; driven by high [Pi])',
      reversible: true,
      regulation: {
        activators: [
          { name: 'Glucagon (liver) / Epinephrine (muscle) via PKA', type: 'covalent phosphorylation', critical: true, note: { en: 'PKA → phosphorylase kinase → phosphorylates GP → ACTIVE (GP-a). Same cascade that inactivates GS.' } },
          { name: 'AMP (muscle GP only)', type: 'allosteric', critical: true, note: { en: 'Muscle GP is activated by AMP allosterically — instant response to energy demand. Liver GP does NOT respond to AMP.' } },
          { name: 'Ca²⁺ (muscle)', type: 'allosteric via calmodulin', note: { en: 'Contraction directly activates phosphorylase kinase via Ca²⁺/calmodulin' } }
        ],
        inhibitors: [
          { name: 'Insulin (via PP1)', type: 'covalent dephosphorylation', critical: true, note: { en: 'Insulin → PP1 → dephosphorylates GP → INACTIVE (GP-b)' } },
          { name: 'ATP, G6P, glucose (liver)', type: 'allosteric', note: { en: 'High energy / high glucose = stop breakdown' } }
        ],
        summary: { en: 'RATE-LIMITING for glycogen breakdown. Uses PHOSPHOROLYSIS (not hydrolysis) — produces G1P directly WITHOUT SPENDING ATP. Requires pyridoxal phosphate (PLP, vitamin B6). Active when PHOSPHORYLATED. Cleaves α-1,4 bonds only — stops 4 residues from a branch point.' }
      },
      story: { en: 'THE PHOSPHOROLYZER cleaves glucose off the ends of glycogen chains using INORGANIC PHOSPHATE instead of water — producing G1P directly. This is brilliant: no ATP spent! The product is already phosphorylated. This enzyme is the rate-limiting step of breakdown and the master regulatory target — active when phosphorylated (opposite of glycogen synthase). Uses vitamin B6 (PLP) as cofactor. STOPS 4 residues from an α-1,6 branch — debranching enzyme takes over there.' },
      clinical: {
        disorder: 'McArdle Disease (GSD V) / Hers Disease (GSD VI)',
        he: 'מחלת מקארדל (GSD V) / הרס (GSD VI)',
        inheritance: 'Autosomal recessive',
        findings: { en: 'McArdle (GSD V): MUSCLE phosphorylase deficiency → exercise intolerance, painful cramps, myoglobinuria (brown urine after exercise), "second wind" phenomenon (FA oxidation kicks in). Normal intelligence + liver. Hers (GSD VI): LIVER phosphorylase deficiency → mild fasting hypoglycemia + hepatomegaly, generally milder than Von Gierke.' },
        treatment: { en: 'McArdle: exercise restriction + creatine + sucrose before exercise. Hers: frequent feeding, mild.' }
      },
      beats: {
        en: [
          { t: 0, text: 'Fasting/exercise: PKA has phosphorylated GP (active).', highlight: 'enzyme' },
          { t: 2500, text: 'Free Pi attacks the α-1,4 bond at the end of a chain.', highlight: 'substrate' },
          { t: 5000, text: 'G1P is released — phosphorylated, ready for use. No ATP spent!', highlight: 'product' },
          { t: 7500, text: 'Enzyme stops 4 residues from an α-1,6 branch.', highlight: 'carrier' }
        ]
      }
    },
    {
      id: 7,
      compartment: 'cyto',
      phase: 'breakdown',
      linearPos: 6,
      enzyme: { abbr: 'Debrancher', name: 'Debranching Enzyme (4-α-glucanotransferase + α-1,6-glucosidase)', ec: '2.4.1.25 + 3.2.1.33', class: 'Bifunctional', he: 'אנזים חיתוך הסתעפות' },
      substrates: [{ key: 'glycogen_branched', name: 'Branched glycogen limit dextrin', smiles: S.glycogen, stoich: 1 }],
      cofactors: [{ key: 'h2o', name: 'H₂O', smiles: 'O', stoich: 1, role: 'consumed' }],
      products: [
        { key: 'glucose', name: 'Free glucose', smiles: S.glucose, label: { en: 'Free glucose (~10% of glycogen output)' }, isMain: true, stoich: 1 },
        { key: 'glycogen_linear', name: 'Linear glycogen', smiles: S.glycogen, isCarrier: true, stoich: 1 }
      ],
      deltaG: 'Irreversible',
      reversible: false,
      regulation: { activators: [], inhibitors: [], summary: { en: 'Not directly regulated. Bifunctional enzyme: (1) transferase moves 3 of the 4 remaining branch residues to another chain, (2) α-1,6-glucosidase hydrolyzes the remaining single residue to FREE GLUCOSE. So ~90% of glycogen breakdown → G1P; ~10% → free glucose.' } },
      story: { en: 'THE BRANCH ERASER has TWO jobs. First, transferase: it lifts 3 of the 4 residues remaining at a branch stump and reattaches them to a nearby chain end. Then, α-1,6-glucosidase: it hydrolyzes the single glucose remaining at the branch point, releasing FREE glucose (the only free glucose produced by glycogen breakdown — the rest is G1P). Now the chain is linear again — glycogen phosphorylase resumes.' },
      clinical: {
        disorder: 'Cori Disease (GSD III)',
        he: 'מחלת קורי (GSD III)',
        inheritance: 'Autosomal recessive',
        findings: { en: 'Debrancher deficiency → abnormal glycogen with short outer branches ("limit dextrin"). Fasting hypoglycemia + hepatomegaly + muscle weakness. MILDER than Von Gierke (no lactic acidosis, normal uric acid) because gluconeogenesis is intact.' },
        treatment: { en: 'High-protein diet (for gluconeogenesis substrates), frequent feeding.' }
      },
      beats: {
        en: [
          { t: 0, text: 'GP has stopped, leaving a branch stump with 4 residues.', highlight: 'substrate' },
          { t: 2500, text: 'Transferase activity moves 3 of the 4 to another chain end.', highlight: 'enzyme' },
          { t: 5000, text: 'α-1,6-glucosidase hydrolyzes the remaining 1 → FREE glucose.', highlight: 'product' },
          { t: 7500, text: 'Chain is now linear. GP resumes.', highlight: 'carrier' }
        ]
      }
    }
  ],

  intermediates: [
    { id: 'g6p', afterStep: 1, beforeStep: 2, name: 'G6P', smiles: S.g6p },
    { id: 'g1p', afterStep: 2, beforeStep: 3, name: 'G1P', smiles: S.g1p },
    { id: 'udpGlucose', afterStep: 3, beforeStep: 4, name: 'UDP-glucose', smiles: S.udpGlucose },
    { id: 'linear_glycogen', afterStep: 4, beforeStep: 5, name: 'Linear glycogen', smiles: S.glycogen },
    { id: 'mature_glycogen', afterStep: 5, beforeStep: 6, name: 'Branched glycogen', smiles: S.glycogen, carrier: true },
    { id: 'limit_dextrin', afterStep: 6, beforeStep: 7, name: 'Limit dextrin', smiles: S.glycogen }
  ],

  integrations: [
    {
      name: 'G1P → Glycolysis / Gluconeogenesis (via PGM)',
      toCycle: 'Glycolysis / Gluconeogenesis',
      fromStep: 6,
      path: { en: 'G1P (from breakdown) ↔ G6P (PGM) → glycolysis (muscle) OR → glucose via G6Pase (liver)' },
      note: { en: 'Liver glycogen → blood glucose (via G6Pase). Muscle glycogen → local glycolysis only (no G6Pase).' }
    },
    {
      name: 'G6P → PPP',
      toCycle: 'Pentose Phosphate Pathway',
      path: { en: 'G6P can branch into PPP for NADPH + ribose-5-P.' }
    },
    {
      name: 'Hormonal cascade — cAMP/PKA',
      toCycle: 'Signal transduction',
      path: { en: 'Glucagon/Epi → Gs → adenylyl cyclase → cAMP → PKA → phosphorylase kinase → GP-a AND GS-b' },
      note: { en: 'Single cascade activates breakdown and inhibits synthesis simultaneously — reciprocal by design. Insulin → PP1 → dephosphorylates both → opposite state.' }
    },
    {
      name: 'Calcium signaling (muscle)',
      toCycle: 'Muscle contraction',
      path: { en: 'Ca²⁺ (from SR during contraction) → calmodulin → phosphorylase kinase → GP-a' },
      note: { en: 'Muscle contraction itself activates glycogenolysis — no hormone needed.' }
    },
    {
      name: 'Fed → Fasting transition',
      toCycle: 'Whole-body metabolism',
      path: { en: '0-4h fed: glycogenesis. 4-24h post-meal: liver glycogenolysis (bulk of blood glucose). >24h: gluconeogenesis dominates.' },
      note: { en: 'Liver glycogen lasts ~12-24 hours of fasting. Muscle glycogen lasts ~1 hour of intense exercise.' }
    }
  ],

  bigPicture: {
    en: [
      { k: 'Structure', v: 'Branched polymer: α-1,4 linear linkages + α-1,6 branches every 8-10 residues. Primed by glycogenin.' },
      { k: 'Liver vs muscle', v: 'Liver: blood glucose buffer (has G6Pase → releases free glucose). Muscle: local fuel (no G6Pase → keeps glucose).' },
      { k: 'Synthesis enzymes', v: 'HK/GK → PGM → UGP → Glycogen Synthase (rate-limiting) → Branching enzyme' },
      { k: 'Breakdown enzymes', v: 'Glycogen Phosphorylase (rate-limiting) → Debranching enzyme (bifunctional) → PGM → G6Pase (liver only)' },
      { k: 'Key ATP saving', v: 'Glycogen phosphorylase uses Pi, not H₂O → produces G1P directly, NO ATP spent on breakdown' },
      { k: 'Products of breakdown', v: '~90% G1P (from α-1,4 phosphorolysis) + ~10% free glucose (from α-1,6 hydrolysis by debrancher)' },
      { k: 'Reciprocal regulation', v: 'Same PKA phosphorylation: ACTIVATES phosphorylase (breakdown) + INACTIVATES synthase (synthesis). One switch, opposite effects.' },
      { k: 'Hormonal activators of breakdown', v: 'Glucagon (liver only — no glucagon receptors in muscle!), Epinephrine (liver + muscle), Ca²⁺ (muscle contraction)' },
      { k: 'Hormonal activator of synthesis', v: 'Insulin (via PP1 phosphatase → dephosphorylates both GS and GP)' },
      { k: 'AMP activation', v: 'Muscle GP only (NOT liver GP) — allosterically activated by AMP for instant response to energy demand' },
      { k: 'Vitamin cofactor', v: 'Glycogen phosphorylase uses PLP (vitamin B6)' },
      { k: 'GSD I (Von Gierke)', v: 'G6Pase — severe fasting hypoglycemia, hepatomegaly, lactic acidosis' },
      { k: 'GSD II (Pompe)', v: 'Lysosomal α-glucosidase — cardiomyopathy, hypotonia ("floppy baby"), only GSD affecting lysosomes' },
      { k: 'GSD III (Cori)', v: 'Debrancher — milder Von Gierke (no lactic acidosis)' },
      { k: 'GSD V (McArdle)', v: 'Muscle phosphorylase — exercise intolerance, cramps, myoglobinuria, second wind' },
      { k: 'GSD VII (Tarui)', v: 'Muscle PFK-1 (this is a glycolysis defect but affects muscle glycogen use) — similar to McArdle + hemolytic anemia' }
    ]
  },

  questions: [
    { id: 'glyc-q1', difficulty: 'easy', prompt: { en: 'The rate-limiting enzyme of glycogen synthesis is:', he: '' }, correct: 'Glycogen synthase', options: ['Glycogen synthase', 'UDP-glucose pyrophosphorylase', 'Branching enzyme', 'Phosphoglucomutase'] },
    { id: 'glyc-q2', difficulty: 'easy', prompt: { en: 'The rate-limiting enzyme of glycogen breakdown is:', he: '' }, correct: 'Glycogen phosphorylase', options: ['Glycogen phosphorylase', 'Debranching enzyme', 'PGM', 'G6Pase'] },
    { id: 'glyc-q3', difficulty: 'medium', prompt: { en: 'PKA phosphorylation of glycogen phosphorylase and glycogen synthase:', he: '' }, correct: 'Activates phosphorylase, inactivates synthase', options: ['Activates phosphorylase, inactivates synthase', 'Activates both', 'Inactivates both', 'Activates synthase, inactivates phosphorylase'] },
    { id: 'glyc-q4', difficulty: 'hard', prompt: { en: 'Why does glycogen phosphorylase not spend ATP?', he: '' }, correct: 'Uses phosphorolysis (Pi) instead of hydrolysis', options: ['Uses phosphorolysis (Pi) instead of hydrolysis', 'Uses GTP instead', 'Energy comes from NADH', 'It is coupled to ATP synthesis'] },
    { id: 'glyc-q5', difficulty: 'medium', prompt: { en: 'Which GSD is caused by debranching enzyme deficiency?', he: '' }, correct: 'GSD III (Cori disease)', options: ['GSD III (Cori disease)', 'GSD I (Von Gierke)', 'GSD V (McArdle)', 'GSD VII (Tarui)'] },
    { id: 'glyc-q6', difficulty: 'medium', prompt: { en: 'McArdle disease (GSD V) results from deficiency of:', he: '' }, correct: 'Muscle glycogen phosphorylase', options: ['Muscle glycogen phosphorylase', 'Liver glycogen phosphorylase', 'Debranching enzyme', 'Branching enzyme'] },
    { id: 'glyc-q7', difficulty: 'hard', prompt: { en: 'Muscle glycogen phosphorylase (but NOT liver) is allosterically activated by:', he: '' }, correct: 'AMP', options: ['AMP', 'ADP', 'Citrate', 'NADH'] },
    { id: 'glyc-q8', difficulty: 'easy', prompt: { en: 'Glycogen phosphorylase uses which vitamin as a cofactor?', he: '' }, correct: 'B6 (PLP)', options: ['B6 (PLP)', 'B1 (thiamine)', 'B12 (cobalamin)', 'B7 (biotin)'] },
    { id: 'glyc-q9', difficulty: 'hard', prompt: { en: 'Why does muscle not release free glucose from glycogen?', he: '' }, correct: 'Muscle lacks glucose-6-phosphatase', options: ['Muscle lacks glucose-6-phosphatase', 'Muscle lacks phosphorylase', 'Muscle lacks glycogen', 'Muscle lacks glucagon receptors'] },
    { id: 'glyc-q10', difficulty: 'medium', prompt: { en: 'The activated glucose donor for glycogen synthesis is:', he: '' }, correct: 'UDP-glucose', options: ['UDP-glucose', 'ADP-glucose', 'GDP-glucose', 'Free glucose'] },
    { id: 'glyc-q11', difficulty: 'hard', prompt: { en: 'Pompe disease (GSD II) affects which organelle?', he: '' }, correct: 'Lysosome', options: ['Lysosome', 'Mitochondrion', 'Peroxisome', 'ER'] },
    { id: 'glyc-q12', difficulty: 'medium', prompt: { en: 'Approximately what fraction of glycogen breakdown yields free glucose (vs G1P)?', he: '' }, correct: '~10% (from α-1,6 branch points)', options: ['~10% (from α-1,6 branch points)', '~50%', '~90%', '0%'] },
    { id: 'glyc-q13', difficulty: 'hard', prompt: { en: 'A patient has exercise-induced muscle cramps, myoglobinuria, and "second wind" phenomenon. Diagnosis?', he: '' }, correct: 'McArdle disease (GSD V)', options: ['McArdle disease (GSD V)', 'Von Gierke (GSD I)', 'Pompe (GSD II)', 'Cori (GSD III)'] },
    { id: 'glyc-q14', difficulty: 'medium', prompt: { en: 'Why does liver lack glucagon response in muscle?', he: '' }, correct: 'Muscle lacks glucagon receptors', options: ['Muscle lacks glucagon receptors', 'Muscle has no cAMP', 'Muscle phosphorylase is different', 'Muscle has no glycogen'] }
  ]
};
