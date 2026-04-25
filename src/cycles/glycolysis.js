// ============================================================
// GLYCOLYSIS — 10-step linear pathway
// Full depth: SMILES, isozymes, phases, regulation, clinical
// ============================================================

const S = {
  glucose:      'OCC1OC(O)C(O)C(O)C1O',
  g6p:          'OCC1OC(OP(O)(O)=O)C(O)C(O)C1O', // α-D-glucose-6-phosphate (approximate)
  f6p:          'OCC1(O)OC(COP(O)(O)=O)C(O)C1O', // fructose-6-phosphate (furanose)
  f16bp:        'O=P(O)(O)OCC1OC(OCC)C(O)C1O',   // simplified fructose-1,6-bisphosphate
  dhap:         'OCC(=O)COP(O)(O)=O',             // dihydroxyacetone phosphate
  g3p:          'O=CC(O)COP(O)(O)=O',             // glyceraldehyde-3-phosphate
  bpg13:        'O=C(OP(O)(O)=O)C(O)COP(O)(O)=O', // 1,3-bisphosphoglycerate
  pg3:          'OC(=O)C(O)COP(O)(O)=O',          // 3-phosphoglycerate
  pg2:          'OC(=O)C(OP(O)(O)=O)CO',          // 2-phosphoglycerate
  pep:          'OC(=O)C(=C)OP(O)(O)=O',          // phosphoenolpyruvate
  pyruvate:     'CC(=O)C(=O)O',
  lactate:      'CC(O)C(=O)O',
  acetylcoa:    'CC(=O)S',                        // simplified
  // Cofactors
  atp:          'Nc1ncnc2n(cnc12)C3OC(COP(O)(=O)OP(O)(=O)OP(O)(=O)O)C(O)C3O',
  adp:          'Nc1ncnc2n(cnc12)C3OC(COP(O)(=O)OP(O)(=O)O)C(O)C3O',
  nad:          'NC(=O)c1ccc[n+](c1)C2OC(CO)C(O)C2O', // simplified nicotinamide
  nadh:         'NC(=O)C1=CN(C=CC1)C2OC(CO)C(O)C2O',
  pi:           'OP(O)(O)=O',
  h2o:          'O',
  f26bp:        'O=P(O)(O)OCC1OC(OP(O)(O)=O)C(O)C1O' // fructose-2,6-bisphosphate
};

export const glycolysisCycle = {
  id: 'glycolysis',
  chapter: 'Carbohydrate Metabolism',
  chapterOrder: 1,
  order: 1,
  layout: 'linear',
  title: { en: 'Glycolysis', he: 'גליקוליזה' },
  subtitle: { en: 'Glucose → Pyruvate, net 2 ATP + 2 NADH', he: 'גלוקוז → פירובט, נטו 2 ATP + 2 NADH' },

  context: {
    tissue: { en: 'All tissues (universal). Essential: RBCs, brain, renal medulla (no mitochondria / O₂-limited)', he: 'כל הרקמות. הכרחי: כדוריות אדומות, מוח, חלק המיתוך של הכליה' },
    otherTissues: { en: 'Particularly active in muscle (anaerobic burst), liver (regulatory hub), cancer cells (Warburg effect)', he: 'פעיל בעיקר בשריר (פרץ אנאירובי), כבד, תאי סרטן (אפקט ורבורג)' },
    state: { en: 'Fed state → glucose uptake ↑. Fasting → suppressed in liver (gluconeogenesis dominates)', he: 'מצב שובע → עליית קליטת גלוקוז. צום → מדוכא בכבד' },
    stateHormonal: { en: 'Insulin ↑ (induces glucokinase, PFK-1 activity via F2,6BP); Glucagon ↓ (opposite)', he: 'אינסולין מעלה; גלוקגון מוריד' },
    turnover: { en: 'Glucokinase induced over hours by insulin; PFK-1 regulated in seconds by allosteric effectors', he: 'גלוקוקינאז מושרה ע"י אינסולין תוך שעות; PFK-1 מווסת בשניות' }
  },

  overview: {
    en: `Glycolysis converts one glucose (6C) to two pyruvate (3C) in ten cytosolic steps. It is the only ATP-producing pathway that does not require oxygen, making it essential for tissues without mitochondria (RBCs) or during anaerobic effort (muscle). Net yield: 2 ATP + 2 NADH + 2 pyruvate per glucose. Divided into an INVESTMENT phase (steps 1–5, costs 2 ATP, produces two G3P) and a PAYOFF phase (steps 6–10, each of the two G3P generates 2 ATP + 1 NADH). Three steps are irreversible and regulated: hexokinase/glucokinase, PFK-1 (the key control point), and pyruvate kinase. Downstream, pyruvate has three fates: acetyl-CoA (aerobic → TCA), lactate (anaerobic), or alanine (transamination).`,
    he: `גליקוליזה ממירה גלוקוז אחד (6C) לשני פירובט (3C) ב־10 שלבים ציטוזוליים. המסלול היחיד המייצר ATP ללא חמצן — הכרחי לרקמות ללא מיטוכונדריה ולמאמץ אנאירובי. תשואה נטו: 2 ATP + 2 NADH + 2 פירובט לגלוקוז. מתחלק לשלב השקעה (1–5) ושלב רווח (6–10).`
  },

  storyFrame: {
    en: {
      title: 'The Energy Factory Production Line',
      setting: 'A 10-station assembly line. The first half is the "investment phase" — you spend 2 ATP to prepare the raw material (glucose) and split it in two. The second half is the "payoff phase" — running twice (once per half), each half-product is oxidized and sold for energy. Net profit: 2 ATP + 2 NADH per glucose.',
      characters: [
        { name: 'Hexokinase', role: 'The Bouncer', icon: '🚪', color: '#dc2626' },
        { name: 'PGI', role: 'The Twister', icon: '🔄', color: '#ea580c' },
        { name: 'PFK-1', role: 'The Manager', icon: '🎛️', color: '#f59e0b' },
        { name: 'Aldolase', role: 'The Chef', icon: '🔪', color: '#ca8a04' },
        { name: 'TPI', role: 'The Balancer', icon: '⚖️', color: '#65a30d' },
        { name: 'GAPDH', role: 'The Oxidizer', icon: '⚡', color: '#059669' },
        { name: 'PGK', role: 'First Cashier', icon: '💰', color: '#0891b2' },
        { name: 'PGM', role: 'The Shuffler', icon: '🔀', color: '#0284c7' },
        { name: 'Enolase', role: 'The Dehydrator', icon: '💧', color: '#2563eb' },
        { name: 'PK', role: 'Second Cashier', icon: '💵', color: '#7c3aed' }
      ]
    },
    he: {
      title: 'קו הייצור של מפעל האנרגיה',
      setting: 'קו ייצור בן 10 תחנות. המחצית הראשונה היא שלב השקעה — מוציאים 2 ATP להכנת החומר הגולמי. המחצית השנייה היא שלב הרווח — כל מחצית-תוצר מחומצן ונמכר לאנרגיה.',
      characters: [
        { name: 'Hexokinase', role: 'הסדרן', icon: '🚪', color: '#dc2626' },
        { name: 'PGI', role: 'המסובב', icon: '🔄', color: '#ea580c' },
        { name: 'PFK-1', role: 'המנהל', icon: '🎛️', color: '#f59e0b' },
        { name: 'Aldolase', role: 'הטבח', icon: '🔪', color: '#ca8a04' },
        { name: 'TPI', role: 'המאזן', icon: '⚖️', color: '#65a30d' },
        { name: 'GAPDH', role: 'המחמצן', icon: '⚡', color: '#059669' },
        { name: 'PGK', role: 'קופאי ראשון', icon: '💰', color: '#0891b2' },
        { name: 'PGM', role: 'המעביר', icon: '🔀', color: '#0284c7' },
        { name: 'Enolase', role: 'המייבש', icon: '💧', color: '#2563eb' },
        { name: 'PK', role: 'קופאי שני', icon: '💵', color: '#7c3aed' }
      ]
    }
  },

  mnemonic: {
    en: { phrase: 'Goodness Gracious, Father Franklin Did Go By Picking Pumpkins (to) Prepare Pies', breakdown: 'Glucose → G6P → F6P → F1,6BP → DHAP/G3P → 1,3-BPG → 3-PG → 2-PG → PEP → Pyruvate' },
    he: { phrase: 'גלו-גו-פרו-פרו-דיה-13-3-2-פא-פירו', breakdown: 'גלוקוז → G6P → F6P → F1,6BP → DHAP/G3P → 1,3-BPG → 3-PG → 2-PG → PEP → פירובט' }
  },

  compartments: {
    cyto: { en: 'Cytosol', he: 'ציטוזול', color: '#dbeafe', accent: '#3b82f6' }
  },

  // ============================================================
  // 10 STEPS
  // ============================================================
  steps: [
    {
      id: 1,
      compartment: 'cyto',
      phase: 'investment',
      linearPos: 0,
      enzyme: {
        abbr: 'Hexokinase',
        name: 'Hexokinase (I-III) / Glucokinase (IV)',
        ec: '2.7.1.1 / 2.7.1.2',
        class: 'Transferase',
        he: 'הקסוקינאז / גלוקוקינאז'
      },
      substrates: [
        { key: 'glucose', name: 'Glucose', smiles: S.glucose, isSource: true, stoich: 1 }
      ],
      cofactors: [
        { key: 'atp', name: 'ATP', smiles: S.atp, stoich: 1, role: 'consumed' },
        { key: 'adp', name: 'ADP', smiles: S.adp, stoich: 1, role: 'produced' }
      ],
      products: [
        { key: 'g6p', name: 'Glucose-6-P', smiles: S.g6p, label: { en: 'G6P (trapped)', he: 'G6P (לכוד)' }, isMain: true, stoich: 1 }
      ],
      deltaG: '−16.7 kJ/mol',
      reversible: false,
      isozymes: [
        { name: 'Hexokinase I-III', tissue: 'All tissues except liver', km: 'Low (~0.1 mM)', vmax: 'Low', regulation: 'Inhibited by product (G6P)', note: { en: 'High affinity = active even at low blood glucose. Quickly saturated.', he: 'זיקה גבוהה = פעיל גם בגלוקוז נמוך. מגיע לרוויה מהר.' } },
        { name: 'Glucokinase (Hexokinase IV)', tissue: 'Liver, pancreatic β-cells', km: 'High (~10 mM)', vmax: 'High, no saturation at physiologic [glucose]', regulation: 'NOT inhibited by G6P. Induced by insulin. Inhibited by glucokinase regulatory protein (GKRP) + fructose-6-P.', note: { en: 'Low affinity = only active when blood glucose is high (post-meal). Acts as glucose sensor in β-cells.', he: 'זיקה נמוכה = פעיל רק כשגלוקוז בדם גבוה (אחרי ארוחה). חיישן גלוקוז בתאי β.' } }
      ],
      regulation: {
        activators: [],
        inhibitors: [
          { name: 'Glucose-6-P', type: 'feedback (HK I-III only)', note: { en: 'Product inhibition on hexokinase; glucokinase is NOT inhibited by G6P', he: 'עיכוב תוצר על הקסוקינאז; גלוקוקינאז לא מעוכב' } }
        ],
        summary: { en: 'Traps glucose in the cell (charged, cannot cross membrane). Glucokinase in liver allows glucose uptake only when blood sugar is high.', he: 'לוכד גלוקוז בתא. גלוקוקינאז בכבד מאפשר קליטה רק בסוכר גבוה.' }
      },
      story: {
        en: 'THE BOUNCER stamps glucose with a phosphate the moment it enters. Phosphorylated glucose can\'t leave — it\'s trapped inside the cell. In most tissues, the bouncer works constantly (low Km). In liver & pancreas, he only works at parties (high blood sugar) — that\'s glucokinase, the glucose sensor.',
        he: 'הסדרן מחתים גלוקוז בפוספט ברגע הכניסה. פוספורילציה = לא יכול לצאת — לכוד בתא. ברוב הרקמות הסדרן עובד כל הזמן. בכבד ובלבלב — רק במסיבות (סוכר גבוה).'
      },
      clinical: {
        disorder: 'MODY 2 (Glucokinase deficiency)',
        he: 'MODY 2 (חסר גלוקוקינאז)',
        inheritance: 'Autosomal dominant',
        findings: { en: 'Maturity-Onset Diabetes of the Young type 2. Mild stable hyperglycemia from birth. β-cell "thermostat" set higher. Usually no complications, rarely needs treatment.', he: 'סכרת צעירים MODY סוג 2. היפרגליקמיה קלה יציבה מלידה. לרוב ללא סיבוכים.' },
        treatment: { en: 'Often no treatment. Lifestyle. Not typically insulin-dependent.', he: 'לרוב ללא טיפול. סגנון חיים.' }
      },
      beats: {
        en: [
          { t: 0, text: 'Glucose enters the cell via GLUT transporters.', highlight: 'substrate' },
          { t: 2500, text: 'Hexokinase adds a phosphate — ATP spent.', highlight: 'enzyme' },
          { t: 5000, text: 'G6P is now trapped: charged, can\'t cross the membrane back out.', highlight: 'product' }
        ],
        he: [
          { t: 0, text: 'גלוקוז נכנס לתא דרך מובילי GLUT.', highlight: 'substrate' },
          { t: 2500, text: 'הקסוקינאז מוסיף פוספט — ATP מוצא.', highlight: 'enzyme' },
          { t: 5000, text: 'G6P לכוד: טעון, לא יכול לצאת.', highlight: 'product' }
        ]
      }
    },
    {
      id: 2,
      compartment: 'cyto',
      phase: 'investment',
      linearPos: 1,
      enzyme: { abbr: 'PGI', name: 'Phosphoglucose Isomerase', ec: '5.3.1.9', class: 'Isomerase', he: 'פוספוגלוקוז איזומראז' },
      substrates: [{ key: 'g6p', name: 'G6P', smiles: S.g6p, stoich: 1 }],
      cofactors: [],
      products: [{ key: 'f6p', name: 'F6P', smiles: S.f6p, label: { en: 'Fructose-6-P', he: 'פרוקטוז-6-P' }, isMain: true, stoich: 1 }],
      deltaG: '+1.7 kJ/mol (near equilibrium)',
      reversible: true,
      regulation: { activators: [], inhibitors: [], summary: { en: 'Not regulated. Simple aldose→ketose isomerization.', he: 'לא מווסת. איזומריזציה פשוטה.' } },
      story: {
        en: 'THE TWISTER rearranges the sugar from aldose (glucose) to ketose (fructose). Why? The next step (PFK-1) needs a CH₂OH group at C1 to phosphorylate, which fructose has.',
        he: 'המסובב מארגן מחדש מאלדוז (גלוקוז) לקטוז (פרוקטוז). השלב הבא (PFK-1) צריך CH₂OH ב-C1.'
      },
      clinical: null,
      beats: {
        en: [
          { t: 0, text: 'G6P needs to become F6P before it can be phosphorylated again.', highlight: 'substrate' },
          { t: 2500, text: 'PGI rearranges the ring: aldose → ketose.', highlight: 'enzyme' },
          { t: 5000, text: 'F6P is ready for the next phosphorylation.', highlight: 'product' }
        ],
        he: [
          { t: 0, text: 'G6P צריך להפוך ל-F6P לפני הפוספורילציה הבאה.', highlight: 'substrate' },
          { t: 2500, text: 'PGI מארגן מחדש: אלדוז → קטוז.', highlight: 'enzyme' },
          { t: 5000, text: 'F6P מוכן לפוספורילציה הבאה.', highlight: 'product' }
        ]
      }
    },
    {
      id: 3,
      compartment: 'cyto',
      phase: 'investment',
      linearPos: 2,
      enzyme: { abbr: 'PFK-1', name: 'Phosphofructokinase-1', ec: '2.7.1.11', class: 'Transferase', he: 'פוספופרוקטוקינאז-1' },
      substrates: [{ key: 'f6p', name: 'F6P', smiles: S.f6p, stoich: 1 }],
      cofactors: [
        { key: 'atp', name: 'ATP', smiles: S.atp, stoich: 1, role: 'consumed' },
        { key: 'adp', name: 'ADP', smiles: S.adp, stoich: 1, role: 'produced' }
      ],
      products: [{ key: 'f16bp', name: 'F1,6BP', smiles: S.f16bp, label: { en: 'Fructose-1,6-BP', he: 'פרוקטוז-1,6-BP' }, isMain: true, stoich: 1 }],
      deltaG: '−14.2 kJ/mol',
      reversible: false,
      regulation: {
        activators: [
          { name: 'AMP', type: 'allosteric', note: { en: 'Low energy signal — when ATP is depleted, AMP rises', he: 'סימן אנרגיה נמוכה' } },
          { name: 'Fructose-2,6-BP (F2,6BP)', type: 'allosteric', critical: true, note: { en: 'MOST POTENT activator. Made by PFK-2 when insulin/glucagon ratio is high (fed state)', he: 'האקטיבטור החזק ביותר. מיוצר ע"י PFK-2' } },
          { name: 'F6P', type: 'substrate', note: { en: 'Forward feed-forward activation', he: 'הפעלה קדימה' } }
        ],
        inhibitors: [
          { name: 'ATP', type: 'allosteric', critical: true, note: { en: 'High energy signal — at high [ATP], PFK-1 is strongly inhibited (allosteric, distinct from catalytic site)', he: 'סימן אנרגיה גבוהה — מעכב חזק' } },
          { name: 'Citrate', type: 'allosteric', note: { en: 'High citrate = TCA full = slow down glycolysis (cross-pathway regulation)', he: 'ציטראט גבוה = TCA מלא = האטה' } },
          { name: 'H⁺ (low pH)', type: 'pH', note: { en: 'Prevents excessive lactate buildup during anaerobic glycolysis', he: 'מונע הצטברות לקטט יתר באנאירוביה' } }
        ],
        summary: { en: 'THE MOST IMPORTANT REGULATORY STEP IN GLYCOLYSIS. Rate-limiting. Committed step — no going back. Integrates energy status (ATP/AMP), TCA status (citrate), pH, and hormonal state (F2,6BP).', he: 'השלב המווסת החשוב ביותר. מגביל־קצב. שלב מחייב. משלב מצב אנרגיה, מצב TCA, pH והורמונים.' }
      },
      story: {
        en: 'THE MANAGER is the key decision-maker. He adds another phosphate, committing the molecule to glycolysis. His switchboard reads every signal: ATP level (reject if full), AMP (accept if hungry), citrate (reject if TCA is loaded), F2,6BP (fed-state green light). Once he says yes, there\'s no going back.',
        he: 'המנהל הוא מקבל ההחלטות. מוסיף פוספט נוסף ומחייב את המולקולה לגליקוליזה. הוא קורא כל סימן: ATP, AMP, ציטראט, F2,6BP. ברגע שאמר כן — אין חזרה.'
      },
      clinical: {
        disorder: 'PFK-1 deficiency (Tarui disease, GSD VII)',
        he: 'מחלת טאורי (GSD VII)',
        inheritance: 'Autosomal recessive',
        findings: { en: 'Muscle glycogen storage disease type VII. Exercise intolerance, cramps, myoglobinuria. Similar to McArdle but also hemolytic anemia (RBC PFK also affected).', he: 'GSD VII. אי סבילות למאמץ, כיווצים, מיוגלובינוריה. גם אנמיה המוליטית.' },
        treatment: { en: 'Avoid strenuous exercise. High-protein diet.', he: 'הימנעות ממאמץ. דיאטה עתירת חלבון.' }
      },
      beats: {
        en: [
          { t: 0, text: 'F6P arrives at the most critical checkpoint in glycolysis.', highlight: 'substrate' },
          { t: 2500, text: 'PFK-1 weighs cellular signals: ATP? Citrate? AMP? F2,6BP?', highlight: 'enzyme' },
          { t: 5000, text: 'Green light: another ATP is spent. Phase 1 investment complete.', highlight: 'energy' },
          { t: 7500, text: 'F1,6BP — the committed intermediate. No going back.', highlight: 'product' }
        ],
        he: [
          { t: 0, text: 'F6P מגיע לצ\'ק-פוינט הקריטי ביותר.', highlight: 'substrate' },
          { t: 2500, text: 'PFK-1 שוקל אותות: ATP? ציטראט? AMP? F2,6BP?', highlight: 'enzyme' },
          { t: 5000, text: 'אור ירוק: ATP נוסף מוצא.', highlight: 'energy' },
          { t: 7500, text: 'F1,6BP — הביניים המחייב.', highlight: 'product' }
        ]
      }
    },
    {
      id: 4,
      compartment: 'cyto',
      phase: 'investment',
      linearPos: 3,
      enzyme: { abbr: 'Aldolase', name: 'Aldolase (A/B/C)', ec: '4.1.2.13', class: 'Lyase', he: 'אלדולאז' },
      substrates: [{ key: 'f16bp', name: 'F1,6BP', smiles: S.f16bp, stoich: 1 }],
      cofactors: [],
      products: [
        { key: 'dhap', name: 'DHAP', smiles: S.dhap, label: { en: 'Dihydroxyacetone-P', he: 'דיהידרוקסיאצטון-P' }, isMain: true, stoich: 1 },
        { key: 'g3p', name: 'G3P', smiles: S.g3p, label: { en: 'Glyceraldehyde-3-P', he: 'גליצראלדהיד-3-P' }, isMain: true, stoich: 1 }
      ],
      deltaG: '+23.8 kJ/mol (but pulled forward by downstream)',
      reversible: true,
      isozymes: [
        { name: 'Aldolase A', tissue: 'Muscle, RBC', km: '—', vmax: '—', regulation: 'Constitutive' },
        { name: 'Aldolase B', tissue: 'Liver, kidney, small intestine', km: '—', vmax: '—', regulation: 'Can also cleave fructose-1-P (fructose metabolism)' },
        { name: 'Aldolase C', tissue: 'Brain', km: '—', vmax: '—', regulation: 'Constitutive' }
      ],
      regulation: { activators: [], inhibitors: [], summary: { en: 'Not allosterically regulated. Aldolase B is clinically important — cleaves fructose-1-P.', he: 'לא מווסת. אלדולאז B חשוב קלינית.' } },
      story: {
        en: 'THE CHEF cleanly splits the 6-carbon sugar in half. Now there are two 3-carbon molecules: DHAP and G3P. Only G3P continues — so DHAP must be converted (next step).',
        he: 'הטבח חוצה את הסוכר בן 6 הפחמנים בדיוק באמצע. כעת שתי מולקולות של 3 פחמנים: DHAP ו-G3P.'
      },
      clinical: {
        disorder: 'Hereditary Fructose Intolerance (HFI — Aldolase B deficiency)',
        he: 'אי־סבילות תורשתית לפרוקטוז',
        inheritance: 'Autosomal recessive',
        findings: { en: 'Triggered by fructose/sucrose ingestion. Fructose-1-P accumulates, traps phosphate → liver ATP depletion → hypoglycemia, vomiting, jaundice, hepatomegaly. Lab: hypoglycemia + fructosuria + ↑ urate (ATP breakdown → hypoxanthine → urate).', he: 'מופעלת ע"י פרוקטוז/סוכרוז. F1P מצטבר, לוכד פוספט → היפוגליקמיה, הקאות, צהבת, הגדלת כבד.' },
        treatment: { en: 'Strict avoidance of fructose, sucrose, sorbitol. Often spontaneous aversion to sweets develops.', he: 'הימנעות קפדנית מפרוקטוז, סוכרוז, סורביטול.' }
      },
      beats: {
        en: [
          { t: 0, text: 'F1,6BP is now 6 carbons with a phosphate on each end.', highlight: 'substrate' },
          { t: 2500, text: 'Aldolase makes a clean cut in the middle.', highlight: 'enzyme' },
          { t: 5000, text: 'Two 3-carbon pieces: DHAP and G3P.', highlight: 'product' }
        ],
        he: [
          { t: 0, text: 'F1,6BP עם פוספט בכל קצה.', highlight: 'substrate' },
          { t: 2500, text: 'אלדולאז חותך נקי באמצע.', highlight: 'enzyme' },
          { t: 5000, text: 'שתי חתיכות בנות 3 פחמנים: DHAP ו-G3P.', highlight: 'product' }
        ]
      }
    },
    {
      id: 5,
      compartment: 'cyto',
      phase: 'investment',
      linearPos: 4,
      enzyme: { abbr: 'TPI', name: 'Triose Phosphate Isomerase', ec: '5.3.1.1', class: 'Isomerase', he: 'טריוז פוספט איזומראז' },
      substrates: [{ key: 'dhap', name: 'DHAP', smiles: S.dhap, stoich: 1 }],
      cofactors: [],
      products: [{ key: 'g3p', name: 'G3P', smiles: S.g3p, label: { en: 'Glyceraldehyde-3-P', he: 'גליצראלדהיד-3-P' }, isMain: true, stoich: 1 }],
      deltaG: '+7.5 kJ/mol (equilibrium favors DHAP but G3P is pulled forward)',
      reversible: true,
      regulation: { activators: [], inhibitors: [], summary: { en: 'Not regulated. Considered the "most perfect enzyme" — diffusion-limited.', he: 'לא מווסת. נחשב "האנזים המושלם".' } },
      story: {
        en: 'THE BALANCER converts DHAP (the useless half) to G3P (the usable half). Now you have TWO G3Ps from the original glucose. All downstream steps run TWICE per glucose molecule.',
        he: 'המאזן ממיר DHAP (החצי הלא שמיש) ל-G3P (החצי השמיש). כעת יש שני G3P מכל גלוקוז. כל השלבים הבאים רצים פעמיים.'
      },
      clinical: {
        disorder: 'TPI deficiency',
        he: 'חסר TPI',
        inheritance: 'Autosomal recessive',
        findings: { en: 'Rare. Hemolytic anemia + progressive neurodegeneration + cardiomyopathy. DHAP accumulates and is converted to toxic methylglyoxal.', he: 'נדיר. אנמיה המוליטית + ניוון עצבי + קרדיומיופתיה.' },
        treatment: { en: 'Supportive. No specific treatment.', he: 'תומך.' }
      },
      beats: {
        en: [
          { t: 0, text: 'DHAP is a dead end — can\'t continue in glycolysis as-is.', highlight: 'substrate' },
          { t: 2500, text: 'TPI isomerizes it to G3P.', highlight: 'enzyme' },
          { t: 5000, text: 'End of investment phase. Two G3P molecules per glucose.', highlight: 'product' }
        ],
        he: [
          { t: 0, text: 'DHAP הוא מבוי סתום.', highlight: 'substrate' },
          { t: 2500, text: 'TPI ממיר ל-G3P.', highlight: 'enzyme' },
          { t: 5000, text: 'סוף שלב ההשקעה. שני G3P לגלוקוז.', highlight: 'product' }
        ]
      }
    },
    {
      id: 6,
      compartment: 'cyto',
      phase: 'payoff',
      linearPos: 5,
      enzyme: { abbr: 'GAPDH', name: 'Glyceraldehyde-3-P Dehydrogenase', ec: '1.2.1.12', class: 'Oxidoreductase', he: 'גליצראלדהיד-3-P דהידרוגנאז' },
      substrates: [
        { key: 'g3p', name: 'G3P', smiles: S.g3p, stoich: 1 },
        { key: 'pi', name: 'Pi', smiles: S.pi, label: { en: 'Inorganic phosphate', he: 'פוספט אי-אורגני' }, stoich: 1 }
      ],
      cofactors: [
        { key: 'nad', name: 'NAD⁺', smiles: S.nad, stoich: 1, role: 'consumed' },
        { key: 'nadh', name: 'NADH', smiles: S.nadh, stoich: 1, role: 'produced' }
      ],
      products: [{ key: 'bpg13', name: '1,3-BPG', smiles: S.bpg13, label: { en: '1,3-Bisphosphoglycerate', he: '1,3-ביספוספוגליצראט' }, isMain: true, stoich: 1 }],
      deltaG: '+6.3 kJ/mol (pulled forward by PGK)',
      reversible: true,
      regulation: { activators: [], inhibitors: [{ name: 'Arsenate (As)', type: 'toxic', note: { en: 'Arsenate replaces Pi → produces 1-arseno-3-PG which spontaneously hydrolyzes → no ATP made at step 7', he: 'ארסנאט מחליף Pi → לא נוצר ATP בשלב 7' } }], summary: { en: 'First oxidation step. Captures energy as NADH + a high-energy acyl-phosphate bond (1,3-BPG).', he: 'שלב חמצון ראשון. לוכד אנרגיה כ-NADH וקשר פוספט עתיר אנרגיה.' } },
      story: {
        en: 'THE OXIDIZER performs the first revenue-generating act. He removes two electrons (making NADH) AND slaps on a second phosphate — this time without spending ATP, using free Pi. The product, 1,3-BPG, now holds a super-high-energy phosphate bond — hotter than ATP.',
        he: 'המחמצן מבצע את הפעולה הראשונה המייצרת הכנסה. מסיר שני אלקטרונים (NADH) ומוסיף פוספט שני — הפעם בלי ATP, בעזרת Pi חופשי.'
      },
      clinical: null,
      beats: {
        en: [
          { t: 0, text: 'Payoff phase begins. G3P ready for oxidation.', highlight: 'substrate' },
          { t: 2500, text: 'GAPDH oxidizes G3P → NAD⁺ becomes NADH.', highlight: 'energy' },
          { t: 5000, text: 'Free phosphate is added — no ATP spent!', highlight: 'enzyme' },
          { t: 7500, text: '1,3-BPG carries a super-high-energy phosphate bond.', highlight: 'product' }
        ],
        he: [
          { t: 0, text: 'שלב הרווח מתחיל.', highlight: 'substrate' },
          { t: 2500, text: 'GAPDH מחמצן G3P → NAD⁺ הופך ל-NADH.', highlight: 'energy' },
          { t: 5000, text: 'Pi חופשי מתווסף — בלי ATP!', highlight: 'enzyme' },
          { t: 7500, text: '1,3-BPG נושא קשר עתיר אנרגיה.', highlight: 'product' }
        ]
      }
    },
    {
      id: 7,
      compartment: 'cyto',
      phase: 'payoff',
      linearPos: 6,
      enzyme: { abbr: 'PGK', name: 'Phosphoglycerate Kinase', ec: '2.7.2.3', class: 'Transferase', he: 'פוספוגליצראט קינאז' },
      substrates: [{ key: 'bpg13', name: '1,3-BPG', smiles: S.bpg13, stoich: 1 }],
      cofactors: [
        { key: 'adp', name: 'ADP', smiles: S.adp, stoich: 1, role: 'consumed' },
        { key: 'atp', name: 'ATP', smiles: S.atp, stoich: 1, role: 'produced' }
      ],
      products: [{ key: 'pg3', name: '3-PG', smiles: S.pg3, label: { en: '3-Phosphoglycerate', he: '3-פוספוגליצראט' }, isMain: true, stoich: 1 }],
      deltaG: '−18.8 kJ/mol',
      reversible: false,
      regulation: { activators: [], inhibitors: [], summary: { en: 'Substrate-level phosphorylation: first ATP made in glycolysis. Not allosterically regulated.', he: 'פוספורילציה ברמת מצע: ה-ATP הראשון בגליקוליזה.' } },
      story: {
        en: 'THE FIRST CASHIER takes the hot phosphate off 1,3-BPG and transfers it to ADP → ATP! First ATP is made. Because this happens TWICE per glucose (2 G3Ps), this step makes 2 ATP, exactly paying back the investment phase.',
        he: 'הקופאי הראשון לוקח את הפוספט החם ומעביר ל-ADP → ATP! זה קורה פעמיים לגלוקוז = 2 ATP.'
      },
      clinical: {
        disorder: 'PGK deficiency',
        he: 'חסר PGK',
        inheritance: 'X-linked',
        findings: { en: 'Rare. Hemolytic anemia + myopathy + CNS dysfunction.', he: 'נדיר. אנמיה המוליטית + מיופתיה + CNS.' },
        treatment: { en: 'Supportive.', he: 'תומך.' }
      },
      beats: {
        en: [
          { t: 0, text: '1,3-BPG\'s high-energy phosphate is ready to go.', highlight: 'substrate' },
          { t: 2500, text: 'PGK transfers it to ADP.', highlight: 'enzyme' },
          { t: 5000, text: 'FIRST ATP! Investment phase paid back (2 ATP × 2 halves).', highlight: 'product' }
        ],
        he: [
          { t: 0, text: 'הפוספט עתיר האנרגיה מוכן.', highlight: 'substrate' },
          { t: 2500, text: 'PGK מעביר ל-ADP.', highlight: 'enzyme' },
          { t: 5000, text: 'ATP ראשון! שלב ההשקעה הוחזר.', highlight: 'product' }
        ]
      }
    },
    {
      id: 8,
      compartment: 'cyto',
      phase: 'payoff',
      linearPos: 7,
      enzyme: { abbr: 'PGM', name: 'Phosphoglycerate Mutase', ec: '5.4.2.11', class: 'Isomerase', he: 'פוספוגליצראט מוטאז' },
      substrates: [{ key: 'pg3', name: '3-PG', smiles: S.pg3, stoich: 1 }],
      cofactors: [],
      products: [{ key: 'pg2', name: '2-PG', smiles: S.pg2, label: { en: '2-Phosphoglycerate', he: '2-פוספוגליצראט' }, isMain: true, stoich: 1 }],
      deltaG: '+4.4 kJ/mol',
      reversible: true,
      regulation: { activators: [], inhibitors: [], summary: { en: 'Not regulated. Moves phosphate from C3 to C2 position.', he: 'לא מווסת. מעביר פוספט מ-C3 ל-C2.' } },
      story: {
        en: 'THE SHUFFLER simply moves the phosphate from position 3 to position 2. Why? To set up the next step — creating a high-energy phosphate requires the OH and phosphate in specific positions.',
        he: 'המעביר פשוט מעביר את הפוספט מ-C3 ל-C2, להכין את השלב הבא.'
      },
      clinical: null,
      beats: {
        en: [
          { t: 0, text: '3-PG has the phosphate on carbon 3.', highlight: 'substrate' },
          { t: 2500, text: 'PGM shifts it to carbon 2.', highlight: 'enzyme' },
          { t: 5000, text: '2-PG is ready for the dehydration step.', highlight: 'product' }
        ],
        he: [
          { t: 0, text: '3-PG עם פוספט ב-C3.', highlight: 'substrate' },
          { t: 2500, text: 'PGM מעביר ל-C2.', highlight: 'enzyme' },
          { t: 5000, text: '2-PG מוכן לייבוש.', highlight: 'product' }
        ]
      }
    },
    {
      id: 9,
      compartment: 'cyto',
      phase: 'payoff',
      linearPos: 8,
      enzyme: { abbr: 'Enolase', name: 'Enolase', ec: '4.2.1.11', class: 'Lyase', he: 'אנולאז' },
      substrates: [{ key: 'pg2', name: '2-PG', smiles: S.pg2, stoich: 1 }],
      cofactors: [{ key: 'h2o', name: 'H₂O', smiles: S.h2o, stoich: 1, role: 'produced' }],
      products: [{ key: 'pep', name: 'PEP', smiles: S.pep, label: { en: 'Phosphoenolpyruvate', he: 'פוספואנולפירובט' }, isMain: true, stoich: 1 }],
      deltaG: '+7.5 kJ/mol',
      reversible: true,
      regulation: { activators: [], inhibitors: [{ name: 'Fluoride (F⁻)', type: 'toxic', note: { en: 'Fluoride inhibits enolase — used in lab to stop glycolysis in blood tubes', he: 'פלואוריד מעכב — שימוש במעבדה לעצור גליקוליזה בדם' } }], summary: { en: 'Dehydration creates PEP with a super-high-energy phosphate (ΔG of hydrolysis: −62 kJ/mol, highest in biology).', he: 'ייבוש יוצר פוספט עתיר אנרגיה עצום.' } },
      story: {
        en: 'THE DEHYDRATOR removes one water molecule. This simple act creates PEP — whose phosphate bond is the HIGHEST-ENERGY phosphate bond in all of biochemistry (ΔG of hydrolysis: −62 kJ/mol). The molecule is now coiled like a loaded spring.',
        he: 'המייבש מסיר מים אחד, ויוצר PEP — עם קשר הפוספט עתיר האנרגיה ביותר בביוכימיה כולה.'
      },
      clinical: null,
      beats: {
        en: [
          { t: 0, text: '2-PG has the pieces but lacks the energy.', highlight: 'substrate' },
          { t: 2500, text: 'Enolase pulls out a water molecule.', highlight: 'enzyme' },
          { t: 5000, text: 'PEP — a loaded spring, waiting to release.', highlight: 'product' }
        ],
        he: [
          { t: 0, text: '2-PG עם כל החלקים אבל בלי אנרגיה.', highlight: 'substrate' },
          { t: 2500, text: 'אנולאז מושך החוצה מולקולת מים.', highlight: 'enzyme' },
          { t: 5000, text: 'PEP — קפיץ דרוך, מחכה לשחרור.', highlight: 'product' }
        ]
      }
    },
    {
      id: 10,
      compartment: 'cyto',
      phase: 'payoff',
      linearPos: 9,
      enzyme: { abbr: 'PK', name: 'Pyruvate Kinase (L/M types)', ec: '2.7.1.40', class: 'Transferase', he: 'פירובט קינאז' },
      substrates: [{ key: 'pep', name: 'PEP', smiles: S.pep, stoich: 1 }],
      cofactors: [
        { key: 'adp', name: 'ADP', smiles: S.adp, stoich: 1, role: 'consumed' },
        { key: 'atp', name: 'ATP', smiles: S.atp, stoich: 1, role: 'produced' }
      ],
      products: [{ key: 'pyruvate', name: 'Pyruvate', smiles: S.pyruvate, label: { en: 'Pyruvate (final)', he: 'פירובט (סופי)' }, isMain: true, isFinal: true, stoich: 1 }],
      deltaG: '−31.4 kJ/mol',
      reversible: false,
      isozymes: [
        { name: 'PK-L (liver)', tissue: 'Liver', km: '—', vmax: '—', regulation: 'Covalently regulated: Glucagon → PKA → phosphorylates PK-L → INACTIVE (prevents liver from consuming the glucose it\'s making). Activated by F1,6BP (feed-forward).', note: { en: 'Hormonally regulated so liver doesn\'t break down the glucose it\'s making for the body during fasting.', he: 'מווסת הורמונלית — הכבד לא יפרק את הגלוקוז שהוא מייצר בצום.' } },
        { name: 'PK-M (muscle, brain)', tissue: 'Muscle, RBC, brain', km: '—', vmax: '—', regulation: 'Not phosphorylated. Constitutively active.', note: { en: 'Muscle always wants ATP — no hormonal brake.', he: 'שריר תמיד רוצה ATP — אין בלם הורמונלי.' } }
      ],
      regulation: {
        activators: [{ name: 'F1,6BP', type: 'allosteric (feed-forward)', note: { en: 'If upstream PFK-1 is firing, push the end too', he: 'אם PFK-1 פעיל — דחוף גם את הסוף' } }],
        inhibitors: [
          { name: 'ATP', type: 'allosteric', note: { en: 'High energy = no need to make more', he: 'אנרגיה גבוהה = אין צורך' } },
          { name: 'Alanine', type: 'allosteric', note: { en: 'Alanine signals sufficient protein catabolism intermediates', he: 'אלנין מסמן מספיק תוצרי פירוק חלבון' } },
          { name: 'Glucagon/PKA (PK-L only)', type: 'covalent phosphorylation', critical: true, note: { en: 'Inactivates liver PK during fasting — prevents futile cycling', he: 'משבית PK כבד בצום' } }
        ],
        summary: { en: 'Second substrate-level phosphorylation — second ATP made. Irreversible. PK-L uniquely hormonally regulated for liver physiology.', he: 'פוספורילציה שנייה ברמת מצע. PK-L מווסת הורמונלית.' }
      },
      story: {
        en: 'THE SECOND CASHIER takes the ultra-hot phosphate from PEP and slaps it onto ADP → ATP! Second ATP per half-glucose (= 2 per glucose, making 4 total in payoff). Pyruvate is released — glycolysis ends. In liver, glucagon can phosphorylate this cashier to shut him down (so liver doesn\'t eat the glucose it\'s exporting).',
        he: 'הקופאי השני לוקח את הפוספט מ-PEP ומעביר ל-ADP → ATP! בכבד, גלוקגון יכול לכבות אותו.'
      },
      clinical: {
        disorder: 'Pyruvate Kinase (PK-R) deficiency',
        he: 'חסר פירובט קינאז',
        inheritance: 'Autosomal recessive',
        findings: { en: 'SECOND MOST COMMON enzymatic cause of hemolytic anemia (after G6PD). RBCs are entirely dependent on glycolysis. PK deficiency → ATP depletion → rigid RBCs → extravascular hemolysis. Labs: hemolytic anemia, ↑ 2,3-BPG (useful: shifts O₂ curve right, compensates).', he: 'הגורם האנזימטי השני בשכיחותו לאנמיה המוליטית. תאים אדומים תלויים בגליקוליזה.' },
        treatment: { en: 'Supportive: transfusions, folate. Splenectomy for severe cases. Mitapivat (PK activator) — new treatment.', he: 'תומך: עירויים, חומצה פולית. כריתת טחול במקרים חמורים. מיטאפיבט.' }
      },
      beats: {
        en: [
          { t: 0, text: 'PEP holds the highest-energy phosphate in biology.', highlight: 'substrate' },
          { t: 2500, text: 'PK transfers it to ADP — another ATP made!', highlight: 'enzyme' },
          { t: 5000, text: 'Pyruvate is released. Glycolysis complete.', highlight: 'product' },
          { t: 7500, text: 'Net yield per glucose: 2 ATP + 2 NADH + 2 pyruvate.', highlight: 'carrier' }
        ],
        he: [
          { t: 0, text: 'PEP מחזיק את הפוספט עתיר האנרגיה ביותר.', highlight: 'substrate' },
          { t: 2500, text: 'PK מעביר ל-ADP — ATP נוסף!', highlight: 'enzyme' },
          { t: 5000, text: 'פירובט משתחרר. גליקוליזה מסתיימת.', highlight: 'product' },
          { t: 7500, text: 'נטו לגלוקוז: 2 ATP + 2 NADH + 2 פירובט.', highlight: 'carrier' }
        ]
      }
    }
  ],

  intermediates: [
    { id: 'g6p', afterStep: 1, beforeStep: 2, name: 'G6P', he: 'G6P', smiles: S.g6p },
    { id: 'f6p', afterStep: 2, beforeStep: 3, name: 'F6P', he: 'F6P', smiles: S.f6p },
    { id: 'f16bp', afterStep: 3, beforeStep: 4, name: 'F1,6BP', he: 'F1,6BP', smiles: S.f16bp },
    { id: 'triose', afterStep: 4, beforeStep: 5, name: 'DHAP + G3P', he: 'DHAP + G3P', smiles: S.g3p },
    { id: 'g3p', afterStep: 5, beforeStep: 6, name: 'G3P (×2)', he: 'G3P (×2)', smiles: S.g3p },
    { id: 'bpg13', afterStep: 6, beforeStep: 7, name: '1,3-BPG', he: '1,3-BPG', smiles: S.bpg13 },
    { id: 'pg3', afterStep: 7, beforeStep: 8, name: '3-PG', he: '3-PG', smiles: S.pg3 },
    { id: 'pg2', afterStep: 8, beforeStep: 9, name: '2-PG', he: '2-PG', smiles: S.pg2 },
    { id: 'pep', afterStep: 9, beforeStep: 10, name: 'PEP', he: 'PEP', smiles: S.pep }
  ],

  integrations: [
    {
      name: 'Pyruvate → Acetyl-CoA → TCA',
      he: 'פירובט → אצטיל-CoA → TCA',
      fromStep: 10, fromMolecule: 'pyruvate',
      toCycle: 'TCA',
      path: { en: 'Pyruvate → (pyruvate dehydrogenase, mitochondria) → Acetyl-CoA + CO₂ + NADH → citrate (citrate synthase)', he: 'פירובט → אצטיל-CoA → ציטראט' },
      note: { en: 'Aerobic fate: 25-30 ATP per glucose via full oxidation.', he: 'גורל אירובי: 25-30 ATP לגלוקוז.' }
    },
    {
      name: 'Pyruvate → Lactate (anaerobic)',
      he: 'פירובט → לקטט (אנאירובי)',
      fromStep: 10, fromMolecule: 'pyruvate',
      toCycle: 'Lactate fermentation',
      path: { en: 'Pyruvate + NADH → (lactate dehydrogenase) → Lactate + NAD⁺', he: 'פירובט + NADH → לקטט + NAD⁺' },
      note: { en: 'Regenerates NAD⁺ so glycolysis can continue without O₂. Essential in RBCs (no mitochondria) and exercising muscle.', he: 'מחדש NAD⁺. הכרחי בתאים אדומים ובשריר פעיל.' }
    },
    {
      name: 'Pyruvate → Alanine (transamination)',
      he: 'פירובט → אלנין',
      fromStep: 10, fromMolecule: 'pyruvate',
      toCycle: 'Glucose-Alanine cycle',
      path: { en: 'Pyruvate + Glutamate → (ALT) → Alanine + α-KG', he: 'פירובט + גלוטמט → אלנין + α-KG' },
      note: { en: 'Muscle exports alanine to liver during fasting; liver converts back to pyruvate → gluconeogenesis.', he: 'שריר מייצא אלנין לכבד בצום.' }
    },
    {
      name: 'G6P → Pentose Phosphate Pathway',
      he: 'G6P → מסלול פנטוז פוספט',
      fromMolecule: 'g6p',
      toCycle: 'PPP',
      path: { en: 'G6P → (G6PDH) → 6-phosphogluconate → ... → Ribose-5-P + NADPH', he: 'G6P → 6-פוספוגלוקונט → ריבוז-5-P + NADPH' },
      note: { en: 'Alternative fate of G6P: makes NADPH (for biosynthesis, antioxidant defense) and R5P (for nucleotides).', he: 'גורל חלופי: מייצר NADPH וריבוז-5-P.' }
    },
    {
      name: 'G6P → Glycogen',
      he: 'G6P → גליקוגן',
      fromMolecule: 'g6p',
      toCycle: 'Glycogenesis',
      path: { en: 'G6P → G1P → UDP-glucose → Glycogen', he: 'G6P → G1P → UDP-גלוקוז → גליקוגן' },
      note: { en: 'Storage fate in liver and muscle during fed state.', he: 'גורל אחסון בכבד ובשריר במצב שובע.' }
    },
    {
      name: 'F6P → Hexosamine Pathway',
      he: 'F6P → מסלול הקסוזאמין',
      fromMolecule: 'f6p',
      toCycle: 'Glycoprotein synthesis',
      path: { en: 'F6P + Gln → GlcN-6-P → ... → UDP-GlcNAc', he: 'F6P + Gln → GlcN-6-P → UDP-GlcNAc' },
      note: { en: 'Makes the building blocks for glycoproteins and proteoglycans.', he: 'לבני הבניין לגליקופרוטאינים ופרוטאוגליקנים.' }
    }
  ],

  bigPicture: {
    en: [
      { k: 'Overall equation', v: 'Glucose + 2 NAD⁺ + 2 ADP + 2 Pi → 2 Pyruvate + 2 NADH + 2 ATP + 2 H₂O + 2 H⁺' },
      { k: 'Net ATP yield', v: '+2 ATP per glucose (4 made in payoff − 2 spent in investment)' },
      { k: 'Net NADH yield', v: '+2 NADH per glucose (if aerobic → ~5 ATP via ETC)' },
      { k: 'Pyruvate fates', v: 'Aerobic: → Acetyl-CoA → TCA · Anaerobic: → Lactate · Transamination: → Alanine · Gluconeogenic: → OAA' },
      { k: 'Three irreversible steps', v: 'Hexokinase/Glucokinase (step 1), PFK-1 (step 3), Pyruvate Kinase (step 10)' },
      { k: 'Rate-limiting step', v: 'PFK-1 — integrates ATP, AMP, citrate, F2,6BP, pH signals' },
      { k: 'F2,6BP', v: 'Most potent allosteric activator of PFK-1. Made by PFK-2 (bifunctional enzyme). Insulin ↑ · Glucagon ↓.' },
      { k: 'Hexokinase vs Glucokinase', v: 'HK: low Km, inhibited by G6P, all tissues. GK: high Km, not inhibited by G6P, liver/β-cells, glucose sensor.' },
      { k: 'PK-L vs PK-M', v: 'PK-L: liver, hormonally regulated (glucagon inactivates). PK-M: muscle/brain, constitutively active.' },
      { k: 'RBC glycolysis', v: 'RBCs are entirely glycolysis-dependent. PK deficiency → 2nd most common cause of hemolytic anemia.' },
      { k: 'Anaerobic yield', v: 'In anaerobic conditions: 2 ATP net (NADH recycled to NAD⁺ by making lactate). Sufficient for RBCs and brief muscle bursts.' },
      { k: 'Warburg effect', v: 'Cancer cells preferentially use glycolysis even in presence of O₂ — fast ATP + biosynthetic intermediates.' },
      { k: 'Toxins', v: 'Arsenate: blocks GAPDH ATP production. Fluoride: inhibits enolase (used in lab blood tubes).' }
    ],
    he: [
      { k: 'משוואה כללית', v: 'גלוקוז + 2 NAD⁺ + 2 ADP + 2 Pi → 2 פירובט + 2 NADH + 2 ATP' },
      { k: 'תשואת ATP נטו', v: '+2 ATP לגלוקוז' },
      { k: 'תשואת NADH נטו', v: '+2 NADH לגלוקוז (אירובי → ~5 ATP)' },
      { k: 'גורלות פירובט', v: 'אירובי → אצטיל-CoA · אנאירובי → לקטט · טרנסאמינציה → אלנין' },
      { k: '3 שלבים בלתי הפיכים', v: 'הקסוקינאז (1), PFK-1 (3), PK (10)' },
      { k: 'שלב מגביל־קצב', v: 'PFK-1' },
      { k: 'F2,6BP', v: 'האקטיבטור האלוסטרי החזק ביותר של PFK-1' },
      { k: 'הקסוקינאז מול גלוקוקינאז', v: 'HK: Km נמוך, מעוכב ע"י G6P. GK: Km גבוה, כבד/β-לבלב.' },
      { k: 'חסר PK', v: 'הגורם האנזימטי השני בשכיחותו לאנמיה המוליטית' },
      { k: 'אפקט ורבורג', v: 'תאי סרטן מעדיפים גליקוליזה גם בחמצן' }
    ]
  },

  questions: [
    { id: 'gly-q1', difficulty: 'easy', prompt: { en: 'How many ATP are generated net per glucose in glycolysis?', he: 'כמה ATP נטו מיוצרים לגלוקוז בגליקוליזה?' }, correct: '2', options: ['2', '4', '6', '38'] },
    { id: 'gly-q2', difficulty: 'medium', prompt: { en: 'The rate-limiting enzyme of glycolysis is:', he: 'האנזים מגביל־הקצב של גליקוליזה:' }, correct: 'PFK-1', options: ['PFK-1', 'Hexokinase', 'Pyruvate kinase', 'GAPDH'] },
    { id: 'gly-q3', difficulty: 'medium', prompt: { en: 'The most potent allosteric activator of PFK-1 is:', he: 'האקטיבטור האלוסטרי החזק ביותר של PFK-1:' }, correct: 'Fructose-2,6-BP', options: ['Fructose-2,6-BP', 'AMP', 'ATP', 'Citrate'] },
    { id: 'gly-q4', difficulty: 'hard', prompt: { en: 'Which hexokinase isozyme has a high Km and is not inhibited by G6P?', he: 'איזה איזוזים של הקסוקינאז עם Km גבוה ולא מעוכב ע"י G6P?' }, correct: 'Glucokinase (HK IV)', options: ['Glucokinase (HK IV)', 'Hexokinase I', 'Hexokinase II', 'Hexokinase III'] },
    { id: 'gly-q5', difficulty: 'medium', prompt: { en: 'Hereditary fructose intolerance results from deficiency of:', he: 'אי־סבילות תורשתית לפרוקטוז נובעת מחסר ב:' }, correct: 'Aldolase B', options: ['Aldolase B', 'Aldolase A', 'Fructokinase', 'TPI'] },
    { id: 'gly-q6', difficulty: 'easy', prompt: { en: 'Which step produces NADH?', he: 'איזה שלב מייצר NADH?' }, correct: 'GAPDH (step 6)', options: ['GAPDH (step 6)', 'PGK (step 7)', 'PK (step 10)', 'Enolase (step 9)'] },
    { id: 'gly-q7', difficulty: 'hard', prompt: { en: 'Arsenate poisoning blocks ATP production at which step?', he: 'הרעלת ארסנאט חוסמת ייצור ATP באיזה שלב?' }, correct: 'Step 7 (PGK)', options: ['Step 7 (PGK)', 'Step 10 (PK)', 'Step 3 (PFK-1)', 'Step 1 (Hexokinase)'] },
    { id: 'gly-q8', difficulty: 'medium', prompt: { en: 'Which enzyme is inhibited by fluoride (used to preserve blood glucose in tubes)?', he: 'איזה אנזים מעוכב ע"י פלואוריד?' }, correct: 'Enolase', options: ['Enolase', 'GAPDH', 'Hexokinase', 'PK'] },
    { id: 'gly-q9', difficulty: 'hard', prompt: { en: 'Pyruvate kinase deficiency primarily affects:', he: 'חסר פירובט קינאז משפיע בעיקר על:' }, correct: 'Red blood cells (hemolytic anemia)', options: ['Red blood cells (hemolytic anemia)', 'Liver', 'Muscle', 'Brain'] },
    { id: 'gly-q10', difficulty: 'medium', prompt: { en: 'During fasting, glucagon inactivates PK-L by:', he: 'בצום, גלוקגון משבית PK-L ע"י:' }, correct: 'PKA-mediated phosphorylation', options: ['PKA-mediated phosphorylation', 'Allosteric binding', 'Transcriptional downregulation', 'Proteolysis'] },
    { id: 'gly-q11', difficulty: 'easy', prompt: { en: 'How many steps are in glycolysis?', he: 'כמה שלבים בגליקוליזה?' }, correct: '10', options: ['10', '8', '12', '9'] },
    { id: 'gly-q13', difficulty: 'medium', prompt: { en: 'Net per glucose: how many NADH are produced?', he: 'נטו לגלוקוז: כמה NADH מיוצרים?' }, correct: '2', options: ['2', '1', '4', '6'] },
    { id: 'gly-q14', difficulty: 'hard', prompt: { en: 'Which molecule has the highest-energy phosphate bond?', he: 'לאיזו מולקולה יש קשר פוספט בעל האנרגיה הגבוהה ביותר?' }, correct: 'PEP', options: ['PEP', 'ATP', '1,3-BPG', 'Creatine phosphate'] }
  ]
};
