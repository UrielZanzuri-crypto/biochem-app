// ============================================================
// GLUCONEOGENESIS — 11 steps (reverse of glycolysis with 4 bypass enzymes)
// Liver + kidney cortex, active during fasting
// ============================================================

const S = {
  pyruvate:      'CC(=O)C(=O)O',
  oaa:           'OC(=O)CC(=O)C(=O)O',
  pep:           'OC(=O)C(=C)OP(O)(O)=O',
  pg2:           'OC(=O)C(OP(O)(O)=O)CO',
  pg3:           'OC(=O)C(O)COP(O)(O)=O',
  bpg13:         'O=C(OP(O)(O)=O)C(O)COP(O)(O)=O',
  g3p:           'O=CC(O)COP(O)(O)=O',
  dhap:          'OCC(=O)COP(O)(O)=O',
  f16bp:         'O=P(O)(O)OCC1OC(OCC)C(O)C1O',
  f6p:           'OCC1(O)OC(COP(O)(O)=O)C(O)C1O',
  g6p:           'OCC1OC(OP(O)(O)=O)C(O)C(O)C1O',
  glucose:       'OCC1OC(O)C(O)C(O)C1O',
  lactate:       'CC(O)C(=O)O',
  alanine:       'CC(N)C(=O)O',
  glycerol:      'OCC(O)CO',
  // Cofactors
  atp:           'Nc1ncnc2n(cnc12)C3OC(COP(O)(=O)OP(O)(=O)OP(O)(=O)O)C(O)C3O',
  adp:           'Nc1ncnc2n(cnc12)C3OC(COP(O)(=O)OP(O)(=O)O)C(O)C3O',
  gtp:           'Nc1nc2n(cnc2c(=O)[nH]1)C3OC(COP(O)(=O)OP(O)(=O)OP(O)(=O)O)C(O)C3O',
  gdp:           'Nc1nc2n(cnc2c(=O)[nH]1)C3OC(COP(O)(=O)OP(O)(=O)O)C(O)C3O',
  nad:           'NC(=O)c1ccc[n+](c1)C2OC(CO)C(O)C2O',
  nadh:          'NC(=O)C1=CN(C=CC1)C2OC(CO)C(O)C2O',
  co2:           'O=C=O',
  pi:            'OP(O)(O)=O',
  h2o:           'O'
};

export const gluconeoCycle = {
  id: 'gluconeo',
  chapter: 'Carbohydrate Metabolism',
  chapterOrder: 1,
  order: 2,
  layout: 'linear',
  title: { en: 'Gluconeogenesis', he: 'גלוקונאוגנזה' },
  subtitle: { en: 'De novo glucose synthesis from pyruvate/lactate/alanine/glycerol', he: 'סינתזת גלוקוז דה-נובו מפירובט/לקטט/אלנין/גליצרול' },

  context: {
    tissue: { en: 'Liver (90%) and kidney cortex (10%). Minor: small intestine epithelium.', he: 'כבד (90%) וקורטקס הכליה (10%). מינורי: אפיתל מעי דק.' },
    otherTissues: { en: 'NEVER in muscle (lacks G6Pase — can\'t release free glucose to blood)', he: 'אף פעם בשריר (חסר G6Pase)' },
    state: { en: 'FASTING/STARVATION: activated after glycogen depletion (~12-16h fast). Critical: maintains blood glucose for brain & RBCs.', he: 'צום/רעב: פעיל אחרי דלדול גליקוגן (~12-16 שעות). קריטי לרמת גלוקוז במוח ובכדוריות אדומות.' },
    stateHormonal: { en: 'Glucagon ↑↑ (via cAMP/PKA), cortisol ↑ (long-term induction), epinephrine ↑. Insulin ↓↓ (opposite of glycolysis).', he: 'גלוקגון מעלה מאוד; קורטיזול מעלה; אינסולין מוריד.' },
    turnover: { en: 'Short-term: allosteric (F2,6BP). Long-term: transcriptional induction of PEPCK by glucagon/cortisol (hours-days).', he: 'טווח קצר: אלוסטרי (F2,6BP). טווח ארוך: אינדוקציה של PEPCK.' }
  },

  overview: {
    en: `Gluconeogenesis synthesizes glucose from non-carbohydrate precursors (pyruvate, lactate, alanine, glycerol, odd-chain FA carbons). It is essential during fasting to maintain blood glucose (brain and RBCs are obligate glucose users). The pathway is mostly the REVERSE of glycolysis, using 7 shared reversible enzymes, BUT three irreversible glycolysis steps require bypasses: (1) pyruvate kinase bypass = pyruvate carboxylase + PEPCK; (2) PFK-1 bypass = fructose-1,6-bisphosphatase; (3) hexokinase/glucokinase bypass = glucose-6-phosphatase. Reciprocal regulation with glycolysis ensures they don't run simultaneously (futile cycling). Cost: 6 high-energy bonds per glucose (2 pyruvate → 1 glucose: 4 ATP + 2 GTP + 2 NADH). Cori cycle: muscle lactate → liver gluconeogenesis → blood glucose → muscle. Alanine cycle: muscle alanine → liver pyruvate + NH₄⁺ (→ urea).`,
    he: `גלוקונאוגנזה מסנתזת גלוקוז ממבשרים שאינם פחמימות. חיונית בצום לשמירת רמת גלוקוז למוח וכדוריות אדומות. בעיקר הפוך מגליקוליזה (7 אנזימים משותפים), אבל 3 שלבים בלתי הפיכים דורשים מעקפים: PK → PC+PEPCK; PFK-1 → F1,6-BPase; HK → G6Pase. עלות: 6 קשרים עתירי אנרגיה לגלוקוז.`
  },

  storyFrame: {
    en: {
      title: 'The Glucose Rebuild Factory',
      setting: 'In fasting, the liver reverses glycolysis to rebuild glucose. Most steps simply run backward — same workers, opposite direction. But three glycolysis steps were one-way streets. At those points, special BYPASS workers take over: one pair at the start (Carboxylator + Phosphoenolator) to reverse pyruvate kinase, a Phosphatase to reverse PFK-1, and a Glucose-Releaser to reverse hexokinase. The last worker releases free glucose into the bloodstream — only liver and kidney can do this.',
      characters: [
        { name: 'PC', role: 'The Carboxylator', icon: '⚗️', color: '#dc2626' },
        { name: 'PEPCK', role: 'The Phosphoenolator', icon: '🔋', color: '#ea580c' },
        { name: 'Enolase', role: 'The Rehydrator', icon: '💧', color: '#f59e0b' },
        { name: 'PGM', role: 'The Shuffler', icon: '🔀', color: '#ca8a04' },
        { name: 'PGK', role: 'Reverse Cashier', icon: '💸', color: '#65a30d' },
        { name: 'GAPDH', role: 'Reverse Oxidizer', icon: '🔄', color: '#059669' },
        { name: 'TPI/Aldolase', role: 'Balancer + Welder', icon: '⚖️', color: '#0d9488' },
        { name: 'F1,6-BPase', role: 'The Phosphatase', icon: '✂️', color: '#0284c7' },
        { name: 'PGI', role: 'The Twister', icon: '🔄', color: '#2563eb' },
        { name: 'G6Pase', role: 'The Liberator', icon: '🔓', color: '#7c3aed' }
      ]
    },
    he: {
      title: 'מפעל שחזור הגלוקוז',
      setting: 'בצום, הכבד הופך את הגליקוליזה ומשחזר גלוקוז. רוב השלבים פשוט רצים אחורה — אותם עובדים בכיוון הפוך. אבל 3 שלבים בגליקוליזה היו חד-כיווניים. שם, עובדי מעקף מיוחדים משתלטים.',
      characters: [
        { name: 'PC', role: 'המקרבקסל', icon: '⚗️', color: '#dc2626' },
        { name: 'PEPCK', role: 'הפוספואנולטור', icon: '🔋', color: '#ea580c' },
        { name: 'Enolase', role: 'מוסיף מים', icon: '💧', color: '#f59e0b' },
        { name: 'PGM', role: 'המעביר', icon: '🔀', color: '#ca8a04' },
        { name: 'PGK', role: 'קופאי הפוך', icon: '💸', color: '#65a30d' },
        { name: 'GAPDH', role: 'מחמצן הפוך', icon: '🔄', color: '#059669' },
        { name: 'TPI/Aldolase', role: 'המאזן והמחבר', icon: '⚖️', color: '#0d9488' },
        { name: 'F1,6-BPase', role: 'הפוספטאז', icon: '✂️', color: '#0284c7' },
        { name: 'PGI', role: 'המסובב', icon: '🔄', color: '#2563eb' },
        { name: 'G6Pase', role: 'המשחרר', icon: '🔓', color: '#7c3aed' }
      ]
    }
  },

  mnemonic: {
    en: { phrase: 'Pathway Produces Precious Plasma Glucose (PC, PEPCK, F1,6BPase, G6Pase)', breakdown: '4 bypass enzymes: Pyruvate Carboxylase → PEPCK → F1,6-BPase → G6Pase' },
    he: { phrase: '4 מעקפים: PC, PEPCK, F1,6-BPase, G6Pase', breakdown: 'פירובט קרבוקסילאז → PEPCK → F1,6-BPase → G6Pase' }
  },

  compartments: {
    mito: { en: 'Mitochondrial Matrix', he: 'מטריקס מיטוכונדריאלי', color: '#fef3c7', accent: '#f59e0b' },
    cyto: { en: 'Cytosol / ER', he: 'ציטוזול / ER', color: '#dbeafe', accent: '#3b82f6' }
  },

  steps: [
    {
      id: 1,
      compartment: 'mito',
      phase: 'bypass',
      linearPos: 0,
      enzyme: { abbr: 'PC', name: 'Pyruvate Carboxylase', ec: '6.4.1.1', class: 'Ligase', he: 'פירובט קרבוקסילאז' },
      substrates: [
        { key: 'pyruvate', name: 'Pyruvate', smiles: S.pyruvate, isSource: true, stoich: 1 },
        { key: 'co2', name: 'CO₂', smiles: S.co2, label: { en: 'HCO₃⁻', he: 'ביקרבונט' }, stoich: 1 }
      ],
      cofactors: [
        { key: 'atp', name: 'ATP', smiles: S.atp, stoich: 1, role: 'consumed' },
        { key: 'adp', name: 'ADP', smiles: S.adp, stoich: 1, role: 'produced' }
      ],
      products: [{ key: 'oaa', name: 'OAA', smiles: S.oaa, label: { en: 'Oxaloacetate', he: 'אוקסלאצטט' }, isMain: true, stoich: 1 }],
      deltaG: '−2.1 kJ/mol',
      reversible: false,
      regulation: {
        activators: [
          { name: 'Acetyl-CoA', type: 'allosteric', critical: true, note: { en: 'SIGNATURE: high acetyl-CoA (from β-oxidation) signals fasting → activate PC → fuel gluconeogenesis. ALSO anaplerotic.', he: 'חתימה: אצטיל-CoA גבוה מסמן צום → מפעיל PC' } }
        ],
        inhibitors: [],
        summary: { en: 'BYPASS #1 (part 1 of 2). Mitochondrial. Biotin-dependent. Replenishes OAA for gluconeogenesis AND anaplerotic for TCA. Acetyl-CoA is the key activator — biochemically signals fasting state.', he: 'מעקף #1 (חלק 1). מיטוכונדריאלי. תלוי ביוטין. אצטיל-CoA מפעיל.' }
      },
      story: {
        en: 'THE CARBOXYLATOR adds a CO₂ to pyruvate to make OAA. Biotin (B7) is the cofactor. This happens in the mitochondrial matrix — OAA can\'t cross membranes, so the next step handles export.',
        he: 'המקרבקסל מוסיף CO₂ לפירובט ויוצר OAA. ביוטין הוא הקופקטור. מתרחש במיטוכונדריה.'
      },
      clinical: {
        disorder: 'Pyruvate Carboxylase Deficiency / Biotin Deficiency',
        he: 'חסר פירובט קרבוקסילאז / חסר ביוטין',
        inheritance: 'Autosomal recessive (PC); nutritional (biotin)',
        findings: { en: 'PC deficiency: severe lactic acidosis, hypoglycemia, developmental delay. Biotin deficiency: alopecia, dermatitis, organic aciduria (affects all 4 biotin-dependent carboxylases).', he: 'חסר PC: חמצת לקטית קשה, היפוגליקמיה. חסר ביוטין: התקרחות, דרמטיטיס.' },
        treatment: { en: 'Biotin supplementation (curative for biotin deficiency). Supportive + frequent feeding for PC deficiency.', he: 'תוסף ביוטין.' }
      },
      beats: {
        en: [
          { t: 0, text: 'Fasting: pyruvate (from lactate/alanine) needs to become glucose.', highlight: 'substrate' },
          { t: 2500, text: 'Pyruvate carboxylase adds CO₂ — biotin is the cofactor.', highlight: 'enzyme' },
          { t: 5000, text: 'ATP is spent. OAA is born in the mitochondrion.', highlight: 'energy' },
          { t: 7500, text: 'Acetyl-CoA activated this step — fasting signal.', highlight: 'product' }
        ],
        he: [
          { t: 0, text: 'בצום: פירובט צריך להפוך לגלוקוז.', highlight: 'substrate' },
          { t: 2500, text: 'PC מוסיף CO₂ — ביוטין הקופקטור.', highlight: 'enzyme' },
          { t: 5000, text: 'ATP מוצא. OAA נוצר.', highlight: 'energy' },
          { t: 7500, text: 'אצטיל-CoA הפעיל — סימן צום.', highlight: 'product' }
        ]
      }
    },
    {
      id: 2,
      compartment: 'cyto',
      phase: 'bypass',
      linearPos: 1,
      enzyme: { abbr: 'PEPCK', name: 'PEP Carboxykinase', ec: '4.1.1.32', class: 'Lyase', he: 'PEP קרבוקסיקינאז' },
      substrates: [{ key: 'oaa', name: 'OAA', smiles: S.oaa, stoich: 1 }],
      cofactors: [
        { key: 'gtp', name: 'GTP', smiles: S.gtp, stoich: 1, role: 'consumed' },
        { key: 'gdp', name: 'GDP', smiles: S.gdp, stoich: 1, role: 'produced' },
        { key: 'co2', name: 'CO₂', smiles: S.co2, stoich: 1, role: 'produced' }
      ],
      products: [{ key: 'pep', name: 'PEP', smiles: S.pep, label: { en: 'Phosphoenolpyruvate', he: 'פוספואנולפירובט' }, isMain: true, stoich: 1 }],
      deltaG: '+0.7 kJ/mol (near equilibrium but driven)',
      reversible: false,
      regulation: {
        activators: [],
        inhibitors: [],
        summary: { en: 'BYPASS #1 (part 2 of 2). Cytosolic. Long-term regulation by TRANSCRIPTIONAL INDUCTION: glucagon/cortisol ↑↑ PEPCK mRNA over hours-days. Insulin ↓↓. No major acute allosteric regulation.', he: 'מעקף #1 (חלק 2). ציטוזולי. ויסות ע"י אינדוקציה תעתיקית: גלוקגון מעלה, אינסולין מוריד.' }
      },
      story: {
        en: 'THE PHOSPHOENOLATOR converts OAA to PEP — releasing a CO₂ in the process (the same CO₂ that was added by PC! Net: just a phosphate swap). GTP is spent. This bypasses the irreversible pyruvate kinase step. Long-term control is by gene expression, not allostery.',
        he: 'הפוספואנולטור הופך OAA ל-PEP — משחרר CO₂ (אותו שהתווסף ב-PC!). GTP מוצא. ויסות ארוך טווח ע"י ביטוי גנים.'
      },
      clinical: {
        disorder: 'PEPCK deficiency',
        he: 'חסר PEPCK',
        inheritance: 'Autosomal recessive',
        findings: { en: 'Rare. Severe fasting hypoglycemia, hepatomegaly, lactic acidosis. Often fatal in infancy.', he: 'נדיר. היפוגליקמיה חמורה בצום, הגדלת כבד.' },
        treatment: { en: 'Frequent feeding; high-carbohydrate diet.', he: 'האכלה תכופה.' }
      },
      beats: {
        en: [
          { t: 0, text: 'OAA reaches the cytosol (via malate shuttle).', highlight: 'substrate' },
          { t: 2500, text: 'PEPCK swaps out the CO₂ for a phosphate.', highlight: 'enzyme' },
          { t: 5000, text: 'GTP spent. PEP is ready to go up the pathway.', highlight: 'product' }
        ],
        he: [
          { t: 0, text: 'OAA מגיע לציטוזול.', highlight: 'substrate' },
          { t: 2500, text: 'PEPCK מחליף CO₂ בפוספט.', highlight: 'enzyme' },
          { t: 5000, text: 'GTP מוצא. PEP מוכן.', highlight: 'product' }
        ]
      }
    },
    {
      id: 3,
      compartment: 'cyto',
      phase: 'reverse',
      linearPos: 2,
      enzyme: { abbr: 'Enolase', name: 'Enolase (reverse)', ec: '4.2.1.11', class: 'Lyase', he: 'אנולאז (הפוך)' },
      substrates: [{ key: 'pep', name: 'PEP', smiles: S.pep, stoich: 1 }],
      cofactors: [{ key: 'h2o', name: 'H₂O', smiles: S.h2o, stoich: 1, role: 'consumed' }],
      products: [{ key: 'pg2', name: '2-PG', smiles: S.pg2, isMain: true, stoich: 1 }],
      deltaG: '−7.5 kJ/mol (reverse of glycolysis)',
      reversible: true,
      regulation: { activators: [], inhibitors: [], summary: { en: 'Shared with glycolysis — runs in reverse. Not regulated.', he: 'משותף עם גליקוליזה — הפוך.' } },
      story: {
        en: 'THE REHYDRATOR reverses step 9 of glycolysis. Water is added back to PEP → 2-PG. From here, the rest of the pathway runs in the glycolysis-reverse direction.',
        he: 'משחזר את שלב 9 של גליקוליזה. מים מתווספים ל-PEP.'
      },
      clinical: null,
      beats: {
        en: [
          { t: 0, text: 'PEP is the highest-energy phosphate — ready to release energy.', highlight: 'substrate' },
          { t: 2500, text: 'Enolase runs in reverse: water is added back.', highlight: 'enzyme' },
          { t: 5000, text: '2-PG formed.', highlight: 'product' }
        ],
        he: [
          { t: 0, text: 'PEP.', highlight: 'substrate' },
          { t: 2500, text: 'אנולאז הפוך: מים מתווספים.', highlight: 'enzyme' },
          { t: 5000, text: '2-PG.', highlight: 'product' }
        ]
      }
    },
    {
      id: 4,
      compartment: 'cyto',
      phase: 'reverse',
      linearPos: 3,
      enzyme: { abbr: 'PGM', name: 'Phosphoglycerate Mutase', ec: '5.4.2.11', class: 'Isomerase', he: 'PGM' },
      substrates: [{ key: 'pg2', name: '2-PG', smiles: S.pg2, stoich: 1 }],
      cofactors: [],
      products: [{ key: 'pg3', name: '3-PG', smiles: S.pg3, isMain: true, stoich: 1 }],
      deltaG: '−4.4 kJ/mol',
      reversible: true,
      regulation: { activators: [], inhibitors: [], summary: { en: 'Shared, reverse. Not regulated.', he: 'משותף, הפוך.' } },
      story: {
        en: 'THE SHUFFLER moves the phosphate from C2 back to C3.',
        he: 'מעביר פוספט מ-C2 ל-C3.'
      },
      clinical: null,
      beats: {
        en: [{ t: 0, text: '2-PG → 3-PG by phosphate shift.', highlight: 'enzyme' }],
        he: [{ t: 0, text: '2-PG → 3-PG.', highlight: 'enzyme' }]
      }
    },
    {
      id: 5,
      compartment: 'cyto',
      phase: 'reverse',
      linearPos: 4,
      enzyme: { abbr: 'PGK', name: 'Phosphoglycerate Kinase (reverse)', ec: '2.7.2.3', class: 'Transferase', he: 'PGK (הפוך)' },
      substrates: [{ key: 'pg3', name: '3-PG', smiles: S.pg3, stoich: 1 }],
      cofactors: [
        { key: 'atp', name: 'ATP', smiles: S.atp, stoich: 1, role: 'consumed' },
        { key: 'adp', name: 'ADP', smiles: S.adp, stoich: 1, role: 'produced' }
      ],
      products: [{ key: 'bpg13', name: '1,3-BPG', smiles: S.bpg13, isMain: true, stoich: 1 }],
      deltaG: '+18.8 kJ/mol (driven by [ATP]/[ADP] ratio)',
      reversible: true,
      regulation: { activators: [], inhibitors: [], summary: { en: 'Shared, reverse. ATP is SPENT here (in glycolysis, ATP was made). Net: gluconeogenesis pays back the ATP.', he: 'משותף הפוך. ATP מוצא (בגליקוליזה נוצר).' } },
      story: {
        en: 'THE REVERSE CASHIER PAYS — unlike in glycolysis where PGK earned ATP, here it costs ATP to push 3-PG back up to 1,3-BPG.',
        he: 'הקופאי הפוך משלם — ATP נדרש לדחוף 3-PG חזרה.'
      },
      clinical: null,
      beats: {
        en: [
          { t: 0, text: '3-PG needs a phosphate to become 1,3-BPG.', highlight: 'substrate' },
          { t: 2500, text: 'ATP is spent to add the phosphate (reverse of glycolysis payoff).', highlight: 'energy' },
          { t: 5000, text: '1,3-BPG is now loaded with a high-energy bond again.', highlight: 'product' }
        ],
        he: [
          { t: 0, text: '3-PG צריך פוספט.', highlight: 'substrate' },
          { t: 2500, text: 'ATP מוצא.', highlight: 'energy' },
          { t: 5000, text: '1,3-BPG.', highlight: 'product' }
        ]
      }
    },
    {
      id: 6,
      compartment: 'cyto',
      phase: 'reverse',
      linearPos: 5,
      enzyme: { abbr: 'GAPDH', name: 'GAPDH (reverse)', ec: '1.2.1.12', class: 'Oxidoreductase', he: 'GAPDH (הפוך)' },
      substrates: [{ key: 'bpg13', name: '1,3-BPG', smiles: S.bpg13, stoich: 1 }],
      cofactors: [
        { key: 'nadh', name: 'NADH', smiles: S.nadh, stoich: 1, role: 'consumed' },
        { key: 'nad', name: 'NAD⁺', smiles: S.nad, stoich: 1, role: 'produced' },
        { key: 'pi', name: 'Pi', smiles: S.pi, stoich: 1, role: 'produced' }
      ],
      products: [{ key: 'g3p', name: 'G3P', smiles: S.g3p, isMain: true, stoich: 1 }],
      deltaG: '−6.3 kJ/mol (reverse direction)',
      reversible: true,
      regulation: { activators: [], inhibitors: [], summary: { en: 'Shared, reverse. NADH is CONSUMED (glycolysis produces NADH; gluconeogenesis uses it).', he: 'משותף הפוך. NADH נצרך.' } },
      story: {
        en: 'THE REVERSE OXIDIZER uses NADH to reduce 1,3-BPG back to G3P. Pi is released.',
        he: 'מחזר 1,3-BPG ל-G3P תוך שימוש ב-NADH.'
      },
      clinical: null,
      beats: {
        en: [{ t: 0, text: 'NADH is spent to reduce 1,3-BPG → G3P. Pi released.', highlight: 'energy' }],
        he: [{ t: 0, text: 'NADH נצרך להחזרת 1,3-BPG → G3P.', highlight: 'energy' }]
      }
    },
    {
      id: 7,
      compartment: 'cyto',
      phase: 'reverse',
      linearPos: 6,
      enzyme: { abbr: 'TPI / Aldolase', name: 'TPI & Aldolase', ec: '5.3.1.1 / 4.1.2.13', class: 'Isomerase / Lyase', he: 'TPI ואלדולאז' },
      substrates: [{ key: 'g3p', name: 'G3P + DHAP', smiles: S.g3p, label: { en: '2× G3P combined', he: '2 G3P משולבים' }, stoich: 2 }],
      cofactors: [],
      products: [{ key: 'f16bp', name: 'F1,6-BP', smiles: S.f16bp, label: { en: 'Fructose-1,6-BP', he: 'פרוקטוז-1,6-BP' }, isMain: true, stoich: 1 }],
      deltaG: '−23.8 kJ/mol (reverse; favorable direction)',
      reversible: true,
      regulation: { activators: [], inhibitors: [], summary: { en: 'Shared, reverse. TPI equilibrates G3P↔DHAP; aldolase combines them into F1,6BP. Two 3-carbon molecules become one 6-carbon.', he: 'משותף הפוך. שתי מולקולות 3C הופכות לאחת 6C.' } },
      story: {
        en: 'THE BALANCER and THE WELDER combine forces: TPI makes one G3P into a DHAP, then aldolase welds one G3P + one DHAP into F1,6-BP. Six carbons reunited.',
        he: 'TPI ו-אלדולאז: שתי G3P הופכות ל-F1,6-BP.'
      },
      clinical: null,
      beats: {
        en: [
          { t: 0, text: 'Two G3P molecules are needed.', highlight: 'substrate' },
          { t: 2500, text: 'TPI converts one to DHAP; aldolase welds them.', highlight: 'enzyme' },
          { t: 5000, text: 'F1,6-BP reformed.', highlight: 'product' }
        ],
        he: [
          { t: 0, text: 'שתי G3P.', highlight: 'substrate' },
          { t: 2500, text: 'TPI + אלדולאז.', highlight: 'enzyme' },
          { t: 5000, text: 'F1,6-BP.', highlight: 'product' }
        ]
      }
    },
    {
      id: 8,
      compartment: 'cyto',
      phase: 'bypass',
      linearPos: 7,
      enzyme: { abbr: 'F1,6-BPase', name: 'Fructose-1,6-Bisphosphatase', ec: '3.1.3.11', class: 'Hydrolase', he: 'פרוקטוז-1,6-ביספוספטאז' },
      substrates: [{ key: 'f16bp', name: 'F1,6-BP', smiles: S.f16bp, stoich: 1 }],
      cofactors: [
        { key: 'h2o', name: 'H₂O', smiles: S.h2o, stoich: 1, role: 'consumed' },
        { key: 'pi', name: 'Pi', smiles: S.pi, stoich: 1, role: 'produced' }
      ],
      products: [{ key: 'f6p', name: 'F6P', smiles: S.f6p, isMain: true, stoich: 1 }],
      deltaG: '−16.7 kJ/mol',
      reversible: false,
      regulation: {
        activators: [{ name: 'Citrate', type: 'allosteric', note: { en: 'TCA full = make glucose', he: 'TCA מלא = ייצר גלוקוז' } }],
        inhibitors: [
          { name: 'F2,6BP', type: 'allosteric', critical: true, note: { en: 'RECIPROCAL with PFK-1: F2,6BP activates PFK-1 but INHIBITS F1,6-BPase. Insulin ↑ F2,6BP → glycolysis on, gluconeo off. Glucagon ↓ F2,6BP → opposite.', he: 'הדדי עם PFK-1: F2,6BP מפעיל PFK-1 ומעכב F1,6-BPase.' } },
          { name: 'AMP', type: 'allosteric', note: { en: 'Low energy = don\'t make glucose', he: 'אנרגיה נמוכה' } }
        ],
        summary: { en: 'BYPASS #2. RATE-LIMITING step of gluconeogenesis. The master regulator: F2,6BP mediates reciprocal control with glycolysis.', he: 'מעקף #2. שלב מגביל־קצב. F2,6BP מתווך ויסות הדדי.' }
      },
      story: {
        en: 'THE PHOSPHATASE chops off a phosphate — removing F1,6-BP\'s phosphate at carbon 1 to make F6P. This is the RATE-LIMITING step and the master regulatory point. F2,6BP is the hormonal dial: insulin raises it (inhibits this enzyme, promotes glycolysis); glucagon lowers it (activates this enzyme, promotes gluconeogenesis).',
        he: 'הפוספטאז חותך פוספט מ-F1,6-BP. שלב מגביל־קצב. F2,6BP הוא הווסת ההורמונלי המרכזי.'
      },
      clinical: {
        disorder: 'Fructose-1,6-Bisphosphatase Deficiency',
        he: 'חסר F1,6-BPase',
        inheritance: 'Autosomal recessive',
        findings: { en: 'Gluconeogenesis blocked at this step. Severe fasting hypoglycemia + LACTIC ACIDOSIS (lactate can\'t be converted to glucose). Vomiting, hyperventilation, seizures. Fructose ingestion worsens it.', he: 'גלוקונאוגנזה חסומה. היפוגליקמיה בצום + חמצת לקטית חמורה.' },
        treatment: { en: 'Avoid fasting (frequent meals). Avoid fructose and sucrose. IV glucose during episodes.', he: 'להימנע מצום ופרוקטוז.' }
      },
      beats: {
        en: [
          { t: 0, text: 'F1,6-BP meets the rate-limiting gatekeeper.', highlight: 'substrate' },
          { t: 2500, text: 'Is F2,6BP low? Is glucagon high? OK — proceed.', highlight: 'enzyme' },
          { t: 5000, text: 'Phosphate cleaved. F6P is formed — past the critical point.', highlight: 'product' }
        ],
        he: [
          { t: 0, text: 'F1,6-BP מגיע לשומר הסף.', highlight: 'substrate' },
          { t: 2500, text: 'F2,6BP נמוך? גלוקגון גבוה? המשך.', highlight: 'enzyme' },
          { t: 5000, text: 'F6P נוצר.', highlight: 'product' }
        ]
      }
    },
    {
      id: 9,
      compartment: 'cyto',
      phase: 'reverse',
      linearPos: 8,
      enzyme: { abbr: 'PGI', name: 'Phosphoglucose Isomerase', ec: '5.3.1.9', class: 'Isomerase', he: 'PGI' },
      substrates: [{ key: 'f6p', name: 'F6P', smiles: S.f6p, stoich: 1 }],
      cofactors: [],
      products: [{ key: 'g6p', name: 'G6P', smiles: S.g6p, isMain: true, stoich: 1 }],
      deltaG: '−1.7 kJ/mol (reverse direction)',
      reversible: true,
      regulation: { activators: [], inhibitors: [], summary: { en: 'Shared, reverse. Not regulated.', he: 'משותף הפוך.' } },
      story: {
        en: 'THE TWISTER converts fructose-6-P back to glucose-6-P. Ketose → aldose.',
        he: 'הופך F6P ל-G6P. קטוז → אלדוז.'
      },
      clinical: null,
      beats: {
        en: [{ t: 0, text: 'F6P → G6P by isomerization.', highlight: 'enzyme' }],
        he: [{ t: 0, text: 'F6P → G6P.', highlight: 'enzyme' }]
      }
    },
    {
      id: 10,
      compartment: 'cyto',
      phase: 'bypass',
      linearPos: 9,
      enzyme: { abbr: 'G6Pase', name: 'Glucose-6-Phosphatase', ec: '3.1.3.9', class: 'Hydrolase', he: 'גלוקוז-6-פוספטאז' },
      substrates: [{ key: 'g6p', name: 'G6P', smiles: S.g6p, stoich: 1 }],
      cofactors: [
        { key: 'h2o', name: 'H₂O', smiles: S.h2o, stoich: 1, role: 'consumed' },
        { key: 'pi', name: 'Pi', smiles: S.pi, stoich: 1, role: 'produced' }
      ],
      products: [{ key: 'glucose', name: 'Glucose', smiles: S.glucose, label: { en: 'Free glucose → blood', he: 'גלוקוז חופשי → דם' }, isMain: true, isFinal: true, stoich: 1 }],
      deltaG: '−13.8 kJ/mol',
      reversible: false,
      regulation: {
        activators: [],
        inhibitors: [],
        summary: { en: 'BYPASS #3. LOCATED IN ER MEMBRANE (unique!). ONLY in liver & kidney (& some enterocytes). MUSCLE LACKS G6Pase — that\'s why muscle glycogen stays in muscle. Final step that releases free glucose.', he: 'מעקף #3. בממברנת ER (ייחודי). רק בכבד וכליה. שריר חסר G6Pase.' }
      },
      story: {
        en: 'THE LIBERATOR performs the final step. G6P is dephosphorylated to FREE GLUCOSE inside the ER lumen (the enzyme is in the ER membrane, substrates shuttled in via G6P-T1 transporter). Only liver and kidney have this enzyme — that\'s why only liver/kidney can release glucose to the bloodstream. Muscle keeps its glucose for itself.',
        he: 'המשחרר — השלב הסופי. G6P → גלוקוז חופשי בלומן ה-ER. רק בכבד וכליה.'
      },
      clinical: {
        disorder: 'Von Gierke Disease (GSD Type Ia — G6Pase deficiency)',
        he: 'מחלת פון גירקה (GSD Ia)',
        inheritance: 'Autosomal recessive',
        findings: { en: 'MOST COMMON glycogen storage disease. Classic triad: severe fasting hypoglycemia + hepatomegaly (glycogen + fat) + LACTIC ACIDOSIS. Also: hyperuricemia (gout) + hypertriglyceridemia + doll-like face. Type Ib: G6P transporter deficiency — similar + neutropenia.', he: 'מחלת אגירת הגליקוגן הנפוצה ביותר. היפוגליקמיה חמורה + הגדלת כבד + חמצת לקטית.' },
        treatment: { en: 'Frequent cornstarch feeds (slow-release glucose). Avoid fasting completely. Allopurinol for gout. Possible liver transplant in severe cases.', he: 'האכלות תכופות של עמילן תירס. הימנעות מצום.' }
      },
      beats: {
        en: [
          { t: 0, text: 'G6P arrives at the ER membrane.', highlight: 'substrate' },
          { t: 2500, text: 'G6Pase cleaves the phosphate.', highlight: 'enzyme' },
          { t: 5000, text: 'Free glucose — released to the blood.', highlight: 'product' },
          { t: 7500, text: 'Only liver & kidney can do this. Muscle cannot.', highlight: 'carrier' }
        ],
        he: [
          { t: 0, text: 'G6P ל-ER.', highlight: 'substrate' },
          { t: 2500, text: 'G6Pase חותך פוספט.', highlight: 'enzyme' },
          { t: 5000, text: 'גלוקוז חופשי לדם.', highlight: 'product' },
          { t: 7500, text: 'רק כבד וכליה.', highlight: 'carrier' }
        ]
      }
    }
  ],

  intermediates: [
    { id: 'oaa', afterStep: 1, beforeStep: 2, name: 'OAA', he: 'OAA', smiles: S.oaa, crossesMembrane: true },
    { id: 'pep', afterStep: 2, beforeStep: 3, name: 'PEP', he: 'PEP', smiles: S.pep },
    { id: 'pg2', afterStep: 3, beforeStep: 4, name: '2-PG', he: '2-PG', smiles: S.pg2 },
    { id: 'pg3', afterStep: 4, beforeStep: 5, name: '3-PG', he: '3-PG', smiles: S.pg3 },
    { id: 'bpg13', afterStep: 5, beforeStep: 6, name: '1,3-BPG', he: '1,3-BPG', smiles: S.bpg13 },
    { id: 'g3p', afterStep: 6, beforeStep: 7, name: 'G3P (×2)', he: 'G3P (×2)', smiles: S.g3p },
    { id: 'f16bp', afterStep: 7, beforeStep: 8, name: 'F1,6-BP', he: 'F1,6-BP', smiles: S.f16bp },
    { id: 'f6p', afterStep: 8, beforeStep: 9, name: 'F6P', he: 'F6P', smiles: S.f6p },
    { id: 'g6p', afterStep: 9, beforeStep: 10, name: 'G6P', he: 'G6P', smiles: S.g6p }
  ],

  integrations: [
    {
      name: 'Lactate → Pyruvate (Cori Cycle)',
      he: 'לקטט → פירובט (מעגל קורי)',
      toStep: 1,
      fromCycle: 'Cori cycle (muscle)',
      path: { en: 'Muscle lactate → blood → liver → (LDH) → pyruvate → gluconeogenesis → glucose → back to muscle', he: 'לקטט שריר → דם → כבד → פירובט → גלוקוז → שריר' },
      note: { en: 'Recycles anaerobic muscle lactate. Critical during exercise. The liver does the "work" of gluconeogenesis.', he: 'מחזר לקטט שריר אנאירובי. קריטי במאמץ.' }
    },
    {
      name: 'Alanine → Pyruvate (Glucose-Alanine Cycle)',
      he: 'אלנין → פירובט',
      toStep: 1,
      fromCycle: 'Glucose-alanine cycle',
      path: { en: 'Muscle: amino acid → alanine (ALT, transamination) → blood → liver: alanine → pyruvate + glutamate → NH₄⁺ → urea cycle', he: 'שריר: חומצות אמינו → אלנין → כבד → פירובט + חנקן לאוריאה' },
      note: { en: 'Dual purpose: nitrogen transport from muscle to liver (→ urea) AND carbon for gluconeogenesis.', he: 'מטרה כפולה: העברת חנקן והפקת פחמן לגלוקוז.' }
    },
    {
      name: 'Glycerol → DHAP',
      he: 'גליצרול → DHAP',
      toStep: 7,
      fromCycle: 'Triglyceride breakdown',
      path: { en: 'Glycerol → (glycerol kinase, liver only) → glycerol-3-P → (G3P dehydrogenase) → DHAP → gluconeogenesis', he: 'גליצרול → גליצרול-3-P → DHAP' },
      note: { en: 'From adipose lipolysis during fasting. Only the glycerol backbone of TG contributes to glucose — FAs can\'t be converted to glucose in humans.', he: 'גליצרול של טריגליצרידים — FA לא יכולות להפוך לגלוקוז בבני אדם.' }
    },
    {
      name: 'Propionyl-CoA → Succinyl-CoA → OAA',
      he: 'פרופיוניל-CoA → סוקצינאציל-CoA → OAA',
      toStep: 1,
      fromCycle: 'Odd-chain FA oxidation',
      path: { en: 'Odd-chain FA → ... → Propionyl-CoA → Methylmalonyl-CoA (B12!) → Succinyl-CoA → TCA → OAA → gluconeogenesis', he: 'חומצות שומן אי-זוגיות → פרופיוניל-CoA → סוקצינאציל-CoA' },
      note: { en: 'One of the few ways FA carbons enter gluconeogenesis — only the odd-chain tail. Also from Val/Ile/Met/Thr.', he: 'אחת הדרכים הבודדות של פחמני FA לגלוקוז.' }
    },
    {
      name: 'Reciprocal regulation with Glycolysis',
      he: 'ויסות הדדי עם גליקוליזה',
      toCycle: 'Glycolysis',
      path: { en: 'F2,6BP: activates PFK-1 (glycolysis) + inhibits F1,6-BPase (gluconeogenesis). Insulin ↑ F2,6BP → glycolysis ON. Glucagon ↓ F2,6BP → gluconeogenesis ON.', he: 'F2,6BP: מפעיל PFK-1 ומעכב F1,6-BPase.' },
      note: { en: 'Prevents simultaneous futile cycling. Controlled by PFK-2/FBPase-2 bifunctional enzyme (phosphorylated by glucagon/PKA).', he: 'מונע רצייה סרק. מווסת ע"י PFK-2/FBPase-2.' }
    },
    {
      name: 'Ketogenic vs. Glucogenic Amino Acids',
      he: 'חומצות אמינו גלוקוגניות וקטוגניות',
      toStep: 1,
      fromCycle: 'Amino acid catabolism',
      path: { en: 'Glucogenic AAs → pyruvate / TCA intermediates → gluconeogenesis. Purely ketogenic: only Leu and Lys.', he: 'רוב חומצות האמינו גלוקוגניות. רק לאוצין וליזין קטוגניות בלבד.' },
      note: { en: 'Most amino acids can be converted to glucose (except pure ketogenic Leu, Lys). This is a major source during prolonged fasting — at the cost of muscle protein breakdown.', he: 'רוב ה-AA יכולות להפוך לגלוקוז (חוץ מלאוצין וליזין).' }
    }
  ],

  bigPicture: {
    en: [
      { k: 'Purpose', v: 'Maintain blood glucose during fasting (brain & RBCs are obligate glucose users)' },
      { k: 'Net equation', v: '2 Pyruvate + 4 ATP + 2 GTP + 2 NADH + 6 H₂O → Glucose + 4 ADP + 2 GDP + 6 Pi + 2 NAD⁺' },
      { k: 'Energy cost', v: '6 high-energy bonds per glucose (4 ATP + 2 GTP) — gluconeogenesis is ENERGY-EXPENSIVE' },
      { k: 'Location', v: 'Liver (90%), kidney cortex (10%). NOT in muscle (no G6Pase).' },
      { k: 'Four bypass enzymes', v: '(1) Pyruvate carboxylase (mito) + (2) PEPCK (cyto) — bypass PK. (3) F1,6-BPase — bypass PFK-1. (4) G6Pase (ER) — bypass hexokinase/GK.' },
      { k: 'Rate-limiting step', v: 'F1,6-BPase — regulated by F2,6BP (reciprocal with PFK-1)' },
      { k: 'Pyruvate carboxylase activator', v: 'Acetyl-CoA (critical: signals fasting via β-oxidation)' },
      { k: 'Hormonal regulation', v: 'Glucagon ↑↑ (PEPCK transcription, ↓F2,6BP). Cortisol ↑ (long-term). Insulin ↓↓.' },
      { k: 'Substrates', v: 'Lactate (Cori), alanine + other glucogenic AAs (glucose-alanine), glycerol (from TGs), propionyl-CoA (odd-chain FAs, Val/Ile/Met/Thr)' },
      { k: 'NOT a substrate', v: 'Even-chain fatty acids! Acetyl-CoA cannot become glucose (pyruvate → acetyl-CoA is irreversible). Pure ketogenic AAs: Leu, Lys only.' },
      { k: 'Cori cycle', v: 'Muscle lactate → liver → glucose → muscle. Net: muscle saves 2 ATP per cycle, liver spends 6 ATP. Net cost to body: 4 ATP per glucose.' },
      { k: 'Clinical pearl — Von Gierke', v: 'G6Pase deficiency = most common GSD (Ia). Fasting hypoglycemia + hepatomegaly + lactic acidosis + hyperuricemia. Tx: cornstarch feeds.' },
      { k: 'Clinical pearl — F1,6-BPase def.', v: 'Fasting hypoglycemia + lactic acidosis (similar to Von Gierke but no hyperuricemia/hepatomegaly severity). Worsened by fructose.' }
    ],
    he: [
      { k: 'מטרה', v: 'לשמור רמת גלוקוז בצום' },
      { k: 'משוואה נטו', v: '2 פירובט + 4 ATP + 2 GTP + 2 NADH → גלוקוז' },
      { k: 'עלות', v: '6 קשרי אנרגיה לגלוקוז' },
      { k: 'מיקום', v: 'כבד (90%), כליה. לא בשריר.' },
      { k: '4 אנזימי מעקף', v: 'PC + PEPCK, F1,6-BPase, G6Pase' },
      { k: 'שלב מגביל', v: 'F1,6-BPase (מווסת ע"י F2,6BP)' },
      { k: 'אקטיבטור PC', v: 'אצטיל-CoA (סימן צום)' },
      { k: 'הורמונלי', v: 'גלוקגון מעלה; אינסולין מוריד' },
      { k: 'מצעים', v: 'לקטט, אלנין, גליצרול, פרופיוניל-CoA' },
      { k: 'לא מצע', v: 'FA זוגיות! אצטיל-CoA לא יכול להפוך לגלוקוז.' },
      { k: 'מעגל קורי', v: 'לקטט שריר → כבד → גלוקוז → שריר' },
      { k: 'פון גירקה', v: 'חסר G6Pase — GSD Ia. היפוגליקמיה + הגדלת כבד + חמצת.' }
    ]
  },

  questions: [
    { id: 'gng-q1', difficulty: 'easy', prompt: { en: 'How many high-energy bonds are spent per glucose in gluconeogenesis?', he: 'כמה קשרים עתירי אנרגיה מוצאים לגלוקוז?' }, correct: '6 (4 ATP + 2 GTP)', options: ['6 (4 ATP + 2 GTP)', '2', '4', '8'] },
    { id: 'gng-q2', difficulty: 'medium', prompt: { en: 'The rate-limiting enzyme of gluconeogenesis is:', he: 'האנזים מגביל־הקצב:' }, correct: 'Fructose-1,6-bisphosphatase', options: ['Fructose-1,6-bisphosphatase', 'PEPCK', 'Pyruvate carboxylase', 'Glucose-6-phosphatase'] },
    { id: 'gng-q3', difficulty: 'medium', prompt: { en: 'Pyruvate carboxylase is allosterically activated by:', he: 'פירובט קרבוקסילאז מופעל ע"י:' }, correct: 'Acetyl-CoA', options: ['Acetyl-CoA', 'ATP', 'Citrate', 'F2,6BP'] },
    { id: 'gng-q4', difficulty: 'hard', prompt: { en: 'Why can muscle NOT release glucose to blood?', he: 'מדוע שריר לא יכול לשחרר גלוקוז לדם?' }, correct: 'Muscle lacks glucose-6-phosphatase', options: ['Muscle lacks glucose-6-phosphatase', 'Muscle lacks hexokinase', 'Muscle lacks PEPCK', 'Muscle has no glycogen'] },
    { id: 'gng-q5', difficulty: 'hard', prompt: { en: 'Von Gierke disease (GSD Ia) is deficiency of:', he: 'מחלת פון גירקה (GSD Ia):' }, correct: 'Glucose-6-phosphatase', options: ['Glucose-6-phosphatase', 'F1,6-BPase', 'Pyruvate carboxylase', 'PEPCK'] },
    { id: 'gng-q6', difficulty: 'medium', prompt: { en: 'Which is NOT a gluconeogenic substrate?', he: 'איזה לא מצע גלוקונאוגני?' }, correct: 'Even-chain fatty acids', options: ['Even-chain fatty acids', 'Lactate', 'Alanine', 'Glycerol'] },
    { id: 'gng-q7', difficulty: 'medium', prompt: { en: 'F2,6BP has what effect on gluconeogenesis?', he: 'F2,6BP משפיע על גלוקונאוגנזה כך:' }, correct: 'Inhibits (by inhibiting F1,6-BPase)', options: ['Inhibits (by inhibiting F1,6-BPase)', 'Activates F1,6-BPase', 'Activates G6Pase', 'No effect'] },
    { id: 'gng-q8', difficulty: 'hard', prompt: { en: 'Which vitamin deficiency impairs pyruvate carboxylase?', he: 'חסר איזה ויטמין פוגע ב-PC?' }, correct: 'Biotin (B7)', options: ['Biotin (B7)', 'Thiamine (B1)', 'Folate (B9)', 'Cobalamin (B12)'] },
    { id: 'gng-q9', difficulty: 'hard', prompt: { en: 'The Cori cycle transfers _____ from muscle to liver.', he: 'מעגל קורי מעביר _____ משריר לכבד.' }, correct: 'Lactate', options: ['Lactate', 'Pyruvate', 'Glucose', 'Alanine'] },
    { id: 'gng-q10', difficulty: 'medium', prompt: { en: 'Which tissues express gluconeogenesis enzymes?', he: 'באילו רקמות יש אנזימי גלוקונאוגנזה?' }, correct: 'Liver and kidney cortex', options: ['Liver and kidney cortex', 'Muscle and heart', 'Brain and RBCs', 'Adipose tissue'] },
    { id: 'gng-q11', difficulty: 'hard', prompt: { en: 'G6Pase is unique because it is located in:', he: 'G6Pase ייחודי כי ממוקם ב:' }, correct: 'Endoplasmic reticulum membrane', options: ['Endoplasmic reticulum membrane', 'Cytosol', 'Mitochondrial matrix', 'Plasma membrane'] },
    { id: 'gng-q12', difficulty: 'medium', prompt: { en: 'Long-term induction of PEPCK is stimulated by:', he: 'אינדוקציה ארוכת טווח של PEPCK ע"י:' }, correct: 'Glucagon and cortisol', options: ['Glucagon and cortisol', 'Insulin', 'F2,6BP', 'AMP'] }
  ]
};
