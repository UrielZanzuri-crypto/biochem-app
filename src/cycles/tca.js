// ============================================================
// TCA / KREBS / CITRIC ACID CYCLE — 8 steps, mitochondrial matrix
// The central hub of aerobic metabolism
// ============================================================

const S = {
  acetylCoA:     'CC(=O)SCCNC(=O)CCNC(=O)C(O)C(C)(C)COP(O)(=O)OP(O)(=O)OCC1OC(n2cnc3c(N)ncnc23)C(O)C1OP(O)(O)=O',
  oaa:           'OC(=O)CC(=O)C(=O)O',
  citrate:       'OC(=O)CC(O)(C(=O)O)CC(=O)O',
  isocitrate:    'OC(=O)C(O)C(CC(=O)O)C(=O)O',
  alphaKG:       'OC(=O)C(=O)CCC(=O)O',
  succinylCoA:   'CCC(=O)S',  // simplified for display
  succinate:     'OC(=O)CCC(=O)O',
  fumarate:      'OC(=O)/C=C/C(=O)O',
  malate:        'OC(=O)C(O)CC(=O)O',
  // Cofactors
  nad:           'NC(=O)c1ccc[n+](c1)C2OC(CO)C(O)C2O',
  nadh:          'NC(=O)C1=CN(C=CC1)C2OC(CO)C(O)C2O',
  fad:           'Cc1cc2nc3c(=O)[nH]c(=O)n(C4OC(CO)C(O)C4O)c3nc2cc1C',
  fadh2:         'Cc1cc2NC3C(=O)NC(=O)N(C4OC(CO)C(O)C4O)C3=Nc2cc1C',
  gdp:           'Nc1nc2n(cnc2c(=O)[nH]1)C3OC(COP(O)(=O)OP(O)(=O)O)C(O)C3O',
  gtp:           'Nc1nc2n(cnc2c(=O)[nH]1)C3OC(COP(O)(=O)OP(O)(=O)OP(O)(=O)O)C(O)C3O',
  coa:           'CC(C)(COP(O)(=O)OP(O)(=O)OCC1OC(n2cnc3c(N)ncnc23)C(O)C1OP(O)(O)=O)C(O)C(=O)NCCC(=O)NCCS',
  co2:           'O=C=O',
  h2o:           'O'
};

export const tcaCycle = {
  id: 'tca',
  chapter: 'The Citric Acid Cycle',
  chapterOrder: 3,
  order: 1,
  layout: 'circular',
  title: { en: 'The Citric Acid Cycle (TCA / Krebs)', he: 'מעגל קרבס (TCA)' },
  subtitle: { en: 'Complete oxidation of acetyl-CoA → 3 NADH + FADH₂ + GTP + 2 CO₂', he: 'חמצון מלא של אצטיל-CoA → 3 NADH + FADH₂ + GTP + 2 CO₂' },

  context: {
    tissue: { en: 'All aerobic tissues — universally expressed', he: 'כל הרקמות האירוביות' },
    otherTissues: { en: 'Highest activity: heart, skeletal muscle (exercise), liver, kidney', he: 'פעילות גבוהה ביותר: לב, שריר, כבד, כליה' },
    state: { en: 'Active whenever mitochondria need ATP. Suppressed during hypoxia or NADH accumulation.', he: 'פעיל כאשר מיטוכונדריות צריכות ATP. מדוכא בהיפוקסיה או הצטברות NADH.' },
    stateHormonal: { en: 'Indirectly regulated via PDH (pyruvate dehydrogenase): insulin ↑ PDH activity; glucagon/fasting ↓', he: 'מווסת עקיפין דרך PDH: אינסולין מעלה; גלוקגון/צום מוריד' },
    turnover: { en: 'Responds in seconds via [NADH]/[NAD⁺] and [ATP]/[ADP] ratios; allosteric regulation of 3 key enzymes.', he: 'מגיב בשניות ליחסי [NADH]/[NAD⁺] ו-[ATP]/[ADP].' }
  },

  overview: {
    en: `The TCA cycle (also called Krebs cycle or citric acid cycle) is the central hub of aerobic metabolism. Each turn takes one acetyl-CoA (2C) and fully oxidizes it to 2 CO₂, capturing the energy as 3 NADH + 1 FADH₂ + 1 GTP. These reduced cofactors feed the electron transport chain, yielding ~10 ATP per acetyl-CoA total. The cycle runs in the mitochondrial matrix and is amphibolic — providing both energy (catabolic) and biosynthetic precursors (anabolic): citrate → fatty acids, α-KG → amino acids, succinyl-CoA → heme, OAA → gluconeogenesis/aspartate. Three enzymes are irreversible and regulated: citrate synthase, isocitrate dehydrogenase (rate-limiting), and α-KG dehydrogenase. Since OAA is regenerated at the end, the cycle is truly catalytic for the acetyl groups.`,
    he: `מעגל ה-TCA (או מעגל קרבס) הוא מרכז המטבוליזם האירובי. כל סיבוב לוקח אצטיל-CoA (2C) ומחמצן אותו לחלוטין ל-2 CO₂, לוכד את האנרגיה כ-3 NADH + FADH₂ + GTP. הקו-פקטורים המחוזרים מזינים את שרשרת העברת האלקטרונים ליצירת ~10 ATP סה"כ. המעגל ציר חשוב גם ביוסינתטית.`
  },

  storyFrame: {
    en: {
      title: 'The Central Power Station',
      setting: 'A circular 8-station power plant in the mitochondrial matrix. Acetyl-CoA (2 carbons of energy) is fed in; it meets OAA (4 carbons) and together they become citrate (6 carbons). Over 8 stations, two CO₂ atoms are released and the cycle harvests every remaining electron as NADH, FADH₂, and one GTP. At the end, OAA is regenerated — ready to pick up another acetyl-CoA.',
      characters: [
        { name: 'CS', role: 'The Greeter', icon: '🤝', color: '#dc2626' },
        { name: 'Aconitase', role: 'The Juggler', icon: '🤹', color: '#ea580c' },
        { name: 'IDH', role: 'The Judge', icon: '⚖️', color: '#f59e0b' },
        { name: 'α-KGDH', role: 'The Foreman', icon: '👷', color: '#ca8a04' },
        { name: 'SCS', role: 'The Paymaster', icon: '💵', color: '#65a30d' },
        { name: 'SDH', role: 'The Electrician', icon: '⚡', color: '#059669' },
        { name: 'Fumarase', role: 'The Waterboy', icon: '💧', color: '#0891b2' },
        { name: 'MDH', role: 'The Finisher', icon: '🔄', color: '#2563eb' }
      ]
    },
    he: {
      title: 'תחנת הכוח המרכזית',
      setting: 'מפעל כוח מעגלי בן 8 תחנות במטריקס המיטוכונדריה. אצטיל-CoA נכנס; פוגש OAA ויחד הופכים לציטראט. לאורך 8 תחנות, שני CO₂ משתחררים והמעגל אוסף כל אלקטרון כ-NADH, FADH₂ ו-GTP. בסוף, OAA מחודש.',
      characters: [
        { name: 'CS', role: 'המקבל פנים', icon: '🤝', color: '#dc2626' },
        { name: 'Aconitase', role: 'הלהטוטן', icon: '🤹', color: '#ea580c' },
        { name: 'IDH', role: 'השופט', icon: '⚖️', color: '#f59e0b' },
        { name: 'α-KGDH', role: 'המנהל', icon: '👷', color: '#ca8a04' },
        { name: 'SCS', role: 'הגזבר', icon: '💵', color: '#65a30d' },
        { name: 'SDH', role: 'החשמלאי', icon: '⚡', color: '#059669' },
        { name: 'Fumarase', role: 'מוסיף המים', icon: '💧', color: '#0891b2' },
        { name: 'MDH', role: 'המשלים', icon: '🔄', color: '#2563eb' }
      ]
    }
  },

  mnemonic: {
    en: { phrase: 'Citrate Is Krebs\' Starting Substrate For Making Oxaloacetate', breakdown: 'Citrate → Isocitrate → α-Ketoglutarate → Succinyl-CoA → Succinate → Fumarate → Malate → Oxaloacetate' },
    he: { phrase: 'צי-איזו-אלפא-סוצי-סוק-פומ-מל-OAA', breakdown: 'ציטראט → איזוציטראט → α-KG → סוקצינאציל-CoA → סוקצינאט → פומרט → מלאט → OAA' }
  },

  compartments: {
    mito: { en: 'Mitochondrial Matrix', he: 'מטריקס מיטוכונדריאלי', color: '#fef3c7', accent: '#f59e0b' }
  },

  steps: [
    {
      id: 1,
      compartment: 'mito',
      angle: -90,
      enzyme: { abbr: 'CS', name: 'Citrate Synthase', ec: '2.3.3.1', class: 'Transferase', he: 'ציטראט סינתאז' },
      substrates: [
        { key: 'acetylCoA', name: 'Acetyl-CoA', smiles: S.acetylCoA, isSource: true, label: { en: 'Acetyl-CoA (2C, from PDH/β-oxidation)', he: 'אצטיל-CoA (2C)' }, stoich: 1 },
        { key: 'oaa', name: 'OAA', smiles: S.oaa, label: { en: 'Oxaloacetate (4C, regenerated)', he: 'אוקסלאצטט (4C)' }, isCarrier: true, stoich: 1 }
      ],
      cofactors: [
        { key: 'h2o', name: 'H₂O', smiles: S.h2o, stoich: 1, role: 'consumed' },
        { key: 'coa', name: 'CoA-SH', smiles: S.coa, stoich: 1, role: 'produced' }
      ],
      products: [{ key: 'citrate', name: 'Citrate', smiles: S.citrate, label: { en: 'Citrate (6C)', he: 'ציטראט (6C)' }, isMain: true, stoich: 1 }],
      deltaG: '−32.2 kJ/mol (highly favorable)',
      reversible: false,
      regulation: {
        activators: [],
        inhibitors: [
          { name: 'Citrate', type: 'product inhibition', note: { en: 'Feedback — prevents accumulation', he: 'משוב שלילי' } },
          { name: 'NADH', type: 'allosteric', note: { en: 'High [NADH] = energy full, slow down', he: 'NADH גבוה = אנרגיה מלאה' } },
          { name: 'Succinyl-CoA', type: 'allosteric', note: { en: 'Downstream product feedback', he: 'משוב תוצר במורד המסלול' } },
          { name: 'ATP', type: 'allosteric', note: { en: 'Energy-status signal', he: 'סימן מצב אנרגיה' } }
        ],
        summary: { en: 'Regulated by substrate availability (OAA levels) and product feedback. The "entry point" of the cycle.', he: 'מווסת על־ידי זמינות המצע ומשוב תוצרים.' }
      },
      story: {
        en: 'THE GREETER welcomes acetyl-CoA to the cycle by marrying it with OAA to form citrate. CoA-SH is released and recycled. This is the condensation step — the starting point where 2C (acetyl) + 4C (OAA) = 6C (citrate).',
        he: 'המקבל פנים מקבל את אצטיל-CoA ומחבר אותו ל-OAA ליצירת ציטראט. CoA-SH משוחרר ומוחזר.'
      },
      clinical: null,
      beats: {
        en: [
          { t: 0, text: 'Acetyl-CoA arrives from PDH (or β-oxidation).', highlight: 'substrate' },
          { t: 2500, text: 'OAA waits as the cycle\'s carrier molecule.', highlight: 'substrate' },
          { t: 5000, text: 'Citrate synthase fuses them. CoA leaves.', highlight: 'enzyme' },
          { t: 7500, text: 'Citrate (6C) is the entry product — cycle begins.', highlight: 'product' }
        ],
        he: [
          { t: 0, text: 'אצטיל-CoA מגיע מ-PDH או מ-β-אוקסידציה.', highlight: 'substrate' },
          { t: 2500, text: 'OAA ממתין כנשא של המעגל.', highlight: 'substrate' },
          { t: 5000, text: 'ציטראט סינתאז מחבר אותם. CoA עוזב.', highlight: 'enzyme' },
          { t: 7500, text: 'ציטראט (6C) — המעגל מתחיל.', highlight: 'product' }
        ]
      }
    },
    {
      id: 2,
      compartment: 'mito',
      angle: -45,
      enzyme: { abbr: 'Aconitase', name: 'Aconitase', ec: '4.2.1.3', class: 'Lyase (isomerase)', he: 'אקוניטאז' },
      substrates: [{ key: 'citrate', name: 'Citrate', smiles: S.citrate, stoich: 1 }],
      cofactors: [],
      products: [{ key: 'isocitrate', name: 'Isocitrate', smiles: S.isocitrate, label: { en: 'Isocitrate', he: 'איזוציטראט' }, isMain: true, stoich: 1 }],
      deltaG: '+13.3 kJ/mol (reversible; pulled forward by IDH)',
      reversible: true,
      regulation: {
        activators: [],
        inhibitors: [{ name: 'Fluoroacetate', type: 'toxic', note: { en: 'Pesticide — converted to fluorocitrate in vivo, blocks aconitase ("lethal synthesis")', he: 'חומר הדברה — הופך לפלואורוציטראט ב-in vivo, חוסם אקוניטאז' } }],
        summary: { en: 'Isomerizes citrate (tertiary alcohol, non-oxidizable) to isocitrate (secondary alcohol, oxidizable). Requires Fe-S cluster.', he: 'איזומריזציה של ציטראט לאיזוציטראט. דורש אשכול Fe-S.' }
      },
      story: {
        en: 'THE JUGGLER shuffles a hydroxyl group from one position to another — a subtle but essential move. Now the OH is on a carbon that CAN be oxidized. Without this twist, the cycle stalls.',
        he: 'הלהטוטן מעביר הידרוקסיל ממיקום אחד לשני — פעולה עדינה אך חיונית.'
      },
      clinical: {
        disorder: 'Fluoroacetate poisoning',
        he: 'הרעלת פלואורואצטט',
        inheritance: 'Acquired (toxin)',
        findings: { en: 'Found in "1080" pesticide. Converted to fluorocitrate which irreversibly inhibits aconitase → citrate accumulates, TCA halts → cellular energy failure. Seizures, cardiac arrhythmias, death.', he: 'נמצא בחומר הדברה "1080". הופך לפלואורוציטראט, מעכב אקוניטאז בלתי הפיך. פרכוסים, הפרעות קצב, מוות.' },
        treatment: { en: 'No specific antidote. Supportive; glyceryl monoacetate may help if given early.', he: 'אין נוגד ספציפי. תומך; גליצריל מונואצטט עשוי לעזור מוקדם.' }
      },
      beats: {
        en: [
          { t: 0, text: 'Citrate\'s -OH group is in the wrong spot for oxidation.', highlight: 'substrate' },
          { t: 2500, text: 'Aconitase isomerizes: OH shifts position.', highlight: 'enzyme' },
          { t: 5000, text: 'Isocitrate is ready to be oxidized next.', highlight: 'product' }
        ],
        he: [
          { t: 0, text: 'ה-OH של ציטראט במיקום הלא נכון.', highlight: 'substrate' },
          { t: 2500, text: 'אקוניטאז מעביר את ה-OH.', highlight: 'enzyme' },
          { t: 5000, text: 'איזוציטראט מוכן לחמצון.', highlight: 'product' }
        ]
      }
    },
    {
      id: 3,
      compartment: 'mito',
      angle: 0,
      enzyme: { abbr: 'IDH', name: 'Isocitrate Dehydrogenase', ec: '1.1.1.41', class: 'Oxidoreductase', he: 'איזוציטראט דהידרוגנאז' },
      substrates: [{ key: 'isocitrate', name: 'Isocitrate', smiles: S.isocitrate, stoich: 1 }],
      cofactors: [
        { key: 'nad', name: 'NAD⁺', smiles: S.nad, stoich: 1, role: 'consumed' },
        { key: 'nadh', name: 'NADH', smiles: S.nadh, stoich: 1, role: 'produced' },
        { key: 'co2', name: 'CO₂', smiles: S.co2, stoich: 1, role: 'produced' }
      ],
      products: [{ key: 'alphaKG', name: 'α-KG', smiles: S.alphaKG, label: { en: 'α-Ketoglutarate (5C)', he: 'α-קטוגלוטראט (5C)' }, isMain: true, stoich: 1 }],
      deltaG: '−8.4 kJ/mol',
      reversible: false,
      regulation: {
        activators: [
          { name: 'ADP', type: 'allosteric', note: { en: 'Low energy signal — speed up', he: 'סימן אנרגיה נמוכה' } },
          { name: 'Ca²⁺', type: 'allosteric', note: { en: 'Muscle contraction signal (exercise)', he: 'סימן התכווצות שריר' } }
        ],
        inhibitors: [
          { name: 'ATP', type: 'allosteric', critical: true, note: { en: 'High energy = slow down', he: 'אנרגיה גבוהה = להאט' } },
          { name: 'NADH', type: 'allosteric', critical: true, note: { en: 'High reduced cofactor = no acceptors left', he: 'NADH גבוה = אין מקבלים' } }
        ],
        summary: { en: 'RATE-LIMITING STEP of the TCA cycle. The main regulatory enzyme. First oxidative decarboxylation — loses one CO₂ and gains NADH.', he: 'שלב מגביל־קצב של TCA. האנזים הרגולטורי הראשי. דקרבוקסילציה חמצונית ראשונה.' }
      },
      story: {
        en: 'THE JUDGE is the key regulator. He decides how fast the cycle runs based on energy need (ATP/ADP ratio) and redox state (NADH level). When he says go, isocitrate is oxidized AND loses a CO₂ — the first carbon of acetyl-CoA is released as waste gas. NADH is captured.',
        he: 'השופט הוא הרגולטור המרכזי. מחליט על קצב המעגל לפי צרכי אנרגיה. איזוציטראט מחומצן ומאבד CO₂. NADH נלכד.'
      },
      clinical: {
        disorder: 'IDH1/IDH2 mutations',
        he: 'מוטציות IDH1/IDH2',
        inheritance: 'Somatic (cancer)',
        findings: { en: 'Mutations in gliomas, AML, chondrosarcomas. Mutant enzyme produces 2-hydroxyglutarate (2-HG), an oncometabolite that alters DNA methylation. Diagnostic + therapeutic target (ivosidenib, enasidenib).', he: 'מוטציות בגליומות, AML. האנזים המוטנטי מייצר 2-HG, אונקומטבוליט. מטרה טיפולית.' },
        treatment: { en: 'Targeted inhibitors: ivosidenib (IDH1), enasidenib (IDH2).', he: 'מעכבים ממוקדים: איווסידניב, אנאסידניב.' }
      },
      beats: {
        en: [
          { t: 0, text: 'Isocitrate meets the judge — IDH.', highlight: 'substrate' },
          { t: 2500, text: 'Reading signals: ATP? NADH? Ca²⁺? ADP?', highlight: 'enzyme' },
          { t: 5000, text: 'Oxidative decarboxylation: 1st NADH made, 1st CO₂ released.', highlight: 'energy' },
          { t: 7500, text: 'α-Ketoglutarate (5C) — one carbon lighter.', highlight: 'product' }
        ],
        he: [
          { t: 0, text: 'איזוציטראט פוגש את השופט.', highlight: 'substrate' },
          { t: 2500, text: 'קורא אותות: ATP? NADH? Ca²⁺?', highlight: 'enzyme' },
          { t: 5000, text: 'NADH ראשון נוצר, CO₂ ראשון משתחרר.', highlight: 'energy' },
          { t: 7500, text: 'α-KG (5C) — פחמן אחד פחות.', highlight: 'product' }
        ]
      }
    },
    {
      id: 4,
      compartment: 'mito',
      angle: 45,
      enzyme: { abbr: 'α-KGDH', name: 'α-Ketoglutarate Dehydrogenase Complex', ec: '1.2.4.2', class: 'Oxidoreductase', he: 'α-KG דהידרוגנאז' },
      substrates: [{ key: 'alphaKG', name: 'α-KG', smiles: S.alphaKG, stoich: 1 }],
      cofactors: [
        { key: 'nad', name: 'NAD⁺', smiles: S.nad, stoich: 1, role: 'consumed' },
        { key: 'coa', name: 'CoA-SH', smiles: S.coa, stoich: 1, role: 'consumed' },
        { key: 'nadh', name: 'NADH', smiles: S.nadh, stoich: 1, role: 'produced' },
        { key: 'co2', name: 'CO₂', smiles: S.co2, stoich: 1, role: 'produced' }
      ],
      products: [{ key: 'succinylCoA', name: 'Succinyl-CoA', smiles: S.succinylCoA, label: { en: 'Succinyl-CoA (4C + CoA)', he: 'סוקצינאציל-CoA (4C + CoA)' }, isMain: true, stoich: 1 }],
      deltaG: '−30 kJ/mol (irreversible)',
      reversible: false,
      regulation: {
        activators: [{ name: 'Ca²⁺', type: 'allosteric' }],
        inhibitors: [
          { name: 'NADH', type: 'allosteric', critical: true },
          { name: 'Succinyl-CoA', type: 'product inhibition', critical: true },
          { name: 'ATP', type: 'allosteric' }
        ],
        summary: { en: 'Multi-enzyme complex analogous to pyruvate dehydrogenase. Requires 5 cofactors: TPP, lipoate, CoA, FAD, NAD⁺. Second oxidative decarboxylation.', he: 'קומפלקס רב-אנזימי הדומה ל-PDH. דורש 5 קופקטורים: TPP, ליפוט, CoA, FAD, NAD⁺.' }
      },
      story: {
        en: 'THE FOREMAN runs a big operation — a 3-enzyme complex with 5 cofactors. Another oxidative decarboxylation: second CO₂ out, second NADH made. A CoA is attached, giving succinyl-CoA a high-energy thioester bond that will pay out next step.',
        he: 'המנהל מפעיל מתחם גדול — קומפלקס בן 3 אנזימים עם 5 קופקטורים. דקרבוקסילציה חמצונית שנייה.'
      },
      clinical: {
        disorder: 'Thiamine (B1) deficiency',
        he: 'חסר תיאמין (B1)',
        inheritance: 'Nutritional',
        findings: { en: 'α-KGDH uses TPP (thiamine pyrophosphate). B1 deficiency affects α-KGDH, PDH, and branched-chain α-ketoacid DH → impaired TCA, lactic acidosis. Causes: Beriberi (wet/dry), Wernicke-Korsakoff (alcoholism).', he: 'α-KGDH משתמש ב-TPP. חסר B1 פוגע ב-α-KGDH, PDH, BCKAD → TCA פגוע, חמצת לקטית. ברי-ברי, ורניקה-קורסקוף.' },
        treatment: { en: 'Thiamine supplementation. CRITICAL: give thiamine BEFORE glucose in suspected cases, otherwise glucose load worsens encephalopathy.', he: 'תוסף תיאמין. קריטי: לתת תיאמין לפני גלוקוז במקרים חשודים.' }
      },
      beats: {
        en: [
          { t: 0, text: 'α-KG arrives at the α-KGDH complex.', highlight: 'substrate' },
          { t: 2500, text: 'TPP, lipoate, CoA, FAD, NAD⁺ all engage.', highlight: 'enzyme' },
          { t: 5000, text: '2nd CO₂ released, 2nd NADH made.', highlight: 'energy' },
          { t: 7500, text: 'Succinyl-CoA — a loaded high-energy thioester.', highlight: 'product' }
        ],
        he: [
          { t: 0, text: 'α-KG מגיע לקומפלקס.', highlight: 'substrate' },
          { t: 2500, text: '5 קופקטורים מופעלים.', highlight: 'enzyme' },
          { t: 5000, text: 'CO₂ שני, NADH שני.', highlight: 'energy' },
          { t: 7500, text: 'סוקצינאציל-CoA — תיואסטר עתיר אנרגיה.', highlight: 'product' }
        ]
      }
    },
    {
      id: 5,
      compartment: 'mito',
      angle: 90,
      enzyme: { abbr: 'SCS', name: 'Succinyl-CoA Synthetase (Succinate Thiokinase)', ec: '6.2.1.4', class: 'Ligase', he: 'סוקצינאציל-CoA סינתטאז' },
      substrates: [
        { key: 'succinylCoA', name: 'Succinyl-CoA', smiles: S.succinylCoA, stoich: 1 },
        { key: 'gdp', name: 'GDP', smiles: S.gdp, stoich: 1 }
      ],
      cofactors: [
        { key: 'pi', name: 'Pi', smiles: 'OP(O)(O)=O', stoich: 1, role: 'consumed' },
        { key: 'coa', name: 'CoA-SH', smiles: S.coa, stoich: 1, role: 'produced' }
      ],
      products: [
        { key: 'succinate', name: 'Succinate', smiles: S.succinate, isMain: true, stoich: 1 },
        { key: 'gtp', name: 'GTP', smiles: S.gtp, label: { en: 'GTP (= ATP equivalent)', he: 'GTP (= ATP)' }, isMain: true, stoich: 1 }
      ],
      deltaG: '−2.9 kJ/mol',
      reversible: true,
      regulation: {
        activators: [], inhibitors: [],
        summary: { en: 'Substrate-level phosphorylation: only ATP/GTP made directly in TCA. Not allosterically regulated.', he: 'פוספורילציה ברמת מצע: ה-ATP/GTP היחיד הנוצר ישירות ב-TCA.' }
      },
      story: {
        en: 'THE PAYMASTER cashes in the high-energy thioester bond of succinyl-CoA to directly make GTP (equivalent to ATP). This is substrate-level phosphorylation — the only place in TCA where nucleotide triphosphate is made directly (not via ETC).',
        he: 'הגזבר פורע את הקשר עתיר האנרגיה של סוקצינאציל-CoA ליצירת GTP. פוספורילציה ברמת מצע — היחידה ב-TCA.'
      },
      clinical: null,
      beats: {
        en: [
          { t: 0, text: 'Succinyl-CoA holds a high-energy thioester.', highlight: 'substrate' },
          { t: 2500, text: 'SCS cleaves it, phosphate transfers to GDP.', highlight: 'enzyme' },
          { t: 5000, text: 'GTP is made — the only substrate-level ATP equivalent.', highlight: 'product' }
        ],
        he: [
          { t: 0, text: 'סוקצינאציל-CoA עם קשר עתיר אנרגיה.', highlight: 'substrate' },
          { t: 2500, text: 'SCS חוצה אותו, פוספט עובר ל-GDP.', highlight: 'enzyme' },
          { t: 5000, text: 'GTP נוצר — ה-ATP היחיד ברמת מצע.', highlight: 'product' }
        ]
      }
    },
    {
      id: 6,
      compartment: 'mito',
      angle: 135,
      enzyme: { abbr: 'SDH', name: 'Succinate Dehydrogenase (Complex II)', ec: '1.3.5.1', class: 'Oxidoreductase', he: 'סוקצינאט דהידרוגנאז' },
      substrates: [{ key: 'succinate', name: 'Succinate', smiles: S.succinate, stoich: 1 }],
      cofactors: [
        { key: 'fad', name: 'FAD', smiles: S.fad, stoich: 1, role: 'consumed' },
        { key: 'fadh2', name: 'FADH₂', smiles: S.fadh2, stoich: 1, role: 'produced' }
      ],
      products: [{ key: 'fumarate', name: 'Fumarate', smiles: S.fumarate, isMain: true, stoich: 1 }],
      deltaG: '~0 kJ/mol',
      reversible: true,
      regulation: {
        activators: [],
        inhibitors: [{ name: 'Malonate', type: 'competitive', note: { en: 'Classic competitive inhibitor of SDH (structural analog of succinate)', he: 'מעכב תחרותי קלאסי — אנלוג מבני של סוקצינאט' } }],
        summary: { en: 'UNIQUE: the only TCA enzyme embedded in the inner mitochondrial membrane. IT IS ALSO COMPLEX II of the ETC — FADH₂ passes electrons directly to ubiquinone. No NADH made here.', he: 'ייחודי: האנזים היחיד ב-TCA המעוגן בממברנה הפנימית. הוא גם קומפלקס II בשרשרת העברת האלקטרונים.' }
      },
      story: {
        en: 'THE ELECTRICIAN is the only TCA worker embedded in the mitochondrial membrane — because he IS Complex II of the ETC. He strips 2 electrons from succinate (creating a double bond → fumarate) and hands them straight to FAD. No NADH this time — FADH₂ is worth slightly less (~1.5 ATP vs 2.5).',
        he: 'החשמלאי הוא היחיד המעוגן בממברנה — הוא גם קומפלקס II של שרשרת האלקטרונים. מוציא 2 אלקטרונים מסוקצינאט, יוצר FADH₂.'
      },
      clinical: {
        disorder: 'SDH mutations — paragangliomas / pheochromocytomas',
        he: 'מוטציות SDH',
        inheritance: 'Autosomal dominant (SDHB, SDHC, SDHD)',
        findings: { en: 'SDHx mutations → hereditary paraganglioma/pheochromocytoma syndromes. SDHB mutations in particular have high malignant potential.', he: 'מוטציות SDH גורמות לתסמונות פראגנגליומה/פאוכרומוציטומה תורשתיות.' },
        treatment: { en: 'Surgical resection; screening of family members; imaging surveillance.', he: 'כריתה כירורגית; סקר משפחתי; מעקב דימות.' }
      },
      beats: {
        en: [
          { t: 0, text: 'Succinate meets SDH — embedded in the inner membrane.', highlight: 'substrate' },
          { t: 2500, text: 'SDH removes 2 electrons, creating a C=C double bond.', highlight: 'enzyme' },
          { t: 5000, text: 'FADH₂ is formed and feeds ETC Complex II directly.', highlight: 'energy' },
          { t: 7500, text: 'Fumarate produced — no NADH this round.', highlight: 'product' }
        ],
        he: [
          { t: 0, text: 'סוקצינאט פוגש את SDH בממברנה הפנימית.', highlight: 'substrate' },
          { t: 2500, text: 'SDH מסיר 2 אלקטרונים, יוצר קשר כפול.', highlight: 'enzyme' },
          { t: 5000, text: 'FADH₂ נוצר ומזין את קומפלקס II.', highlight: 'energy' },
          { t: 7500, text: 'פומרט — בלי NADH הפעם.', highlight: 'product' }
        ]
      }
    },
    {
      id: 7,
      compartment: 'mito',
      angle: 180,
      enzyme: { abbr: 'Fumarase', name: 'Fumarase (Fumarate Hydratase)', ec: '4.2.1.2', class: 'Lyase', he: 'פומראז' },
      substrates: [{ key: 'fumarate', name: 'Fumarate', smiles: S.fumarate, stoich: 1 }],
      cofactors: [{ key: 'h2o', name: 'H₂O', smiles: S.h2o, stoich: 1, role: 'consumed' }],
      products: [{ key: 'malate', name: 'Malate', smiles: S.malate, label: { en: 'L-Malate', he: 'L-מלאט' }, isMain: true, stoich: 1 }],
      deltaG: '−3.8 kJ/mol',
      reversible: true,
      regulation: { activators: [], inhibitors: [], summary: { en: 'Not regulated. Stereospecific addition of water across the C=C double bond (L-malate only).', he: 'לא מווסת. הוספת מים סטריאוספציפית על הקשר הכפול.' } },
      story: {
        en: 'THE WATERBOY simply adds a molecule of water across the fumarate double bond — hydration. Produces L-malate (strict stereochemistry). Simple but essential.',
        he: 'מוסיף המים פשוט מוסיף מים על הקשר הכפול של פומרט ליצירת L-מלאט.'
      },
      clinical: {
        disorder: 'Fumarase deficiency / HLRCC',
        he: 'חסר פומראז / HLRCC',
        inheritance: 'Autosomal dominant (HLRCC) or recessive (neurodegenerative)',
        findings: { en: 'HLRCC: Hereditary Leiomyomatosis and Renal Cell Carcinoma. Germline FH mutations → cutaneous/uterine leiomyomas + aggressive papillary RCC type 2. Tumors accumulate fumarate → inhibit prolyl hydroxylases → HIF-1α stabilization (pseudohypoxia).', he: 'HLRCC: ליומיומטוזיס תורשתי וסרטן כליה. מוטציות FH → לאומיומות + RCC פפילרי סוג 2.' },
        treatment: { en: 'Surgical excision of renal tumors; surveillance MRI; genetic counseling.', he: 'כריתה כירורגית; מעקב MRI; ייעוץ גנטי.' }
      },
      beats: {
        en: [
          { t: 0, text: 'Fumarate has a trans C=C double bond.', highlight: 'substrate' },
          { t: 2500, text: 'Fumarase adds water across the double bond.', highlight: 'enzyme' },
          { t: 5000, text: 'L-malate forms — ready for final oxidation.', highlight: 'product' }
        ],
        he: [
          { t: 0, text: 'לפומרט יש קשר כפול טרנס.', highlight: 'substrate' },
          { t: 2500, text: 'פומראז מוסיף מים.', highlight: 'enzyme' },
          { t: 5000, text: 'L-מלאט נוצר.', highlight: 'product' }
        ]
      }
    },
    {
      id: 8,
      compartment: 'mito',
      angle: 225,
      enzyme: { abbr: 'MDH', name: 'Malate Dehydrogenase', ec: '1.1.1.37', class: 'Oxidoreductase', he: 'מלאט דהידרוגנאז' },
      substrates: [{ key: 'malate', name: 'Malate', smiles: S.malate, stoich: 1 }],
      cofactors: [
        { key: 'nad', name: 'NAD⁺', smiles: S.nad, stoich: 1, role: 'consumed' },
        { key: 'nadh', name: 'NADH', smiles: S.nadh, stoich: 1, role: 'produced' }
      ],
      products: [{ key: 'oaa', name: 'OAA', smiles: S.oaa, label: { en: 'Oxaloacetate (regenerated!)', he: 'OAA (מחודש!)' }, isMain: true, isCarrier: true, stoich: 1 }],
      deltaG: '+29.7 kJ/mol (unfavorable; driven by OAA removal in step 1)',
      reversible: true,
      regulation: {
        activators: [], inhibitors: [],
        summary: { en: 'Equilibrium heavily favors malate. Reaction proceeds only because OAA is immediately consumed by citrate synthase (step 1) — Le Chatelier.', he: 'שיווי המשקל בעד מלאט. התגובה מתקדמת כי OAA נצרך מיד.' }
      },
      story: {
        en: 'THE FINISHER oxidizes malate back to OAA, generating the third NADH. The cycle is now ready to start again — OAA greets a new acetyl-CoA. This is why the cycle is catalytic: OAA is never used up, just borrowed.',
        he: 'המשלים מחמצן מלאט ל-OAA, יוצר NADH שלישי. המעגל מוכן להתחיל שוב — OAA לא נצרך אף פעם.'
      },
      clinical: null,
      beats: {
        en: [
          { t: 0, text: 'Malate is the last substrate.', highlight: 'substrate' },
          { t: 2500, text: 'MDH oxidizes it — 3rd NADH captured!', highlight: 'energy' },
          { t: 5000, text: 'OAA is regenerated. The cycle begins again.', highlight: 'carrier' }
        ],
        he: [
          { t: 0, text: 'מלאט — המצע האחרון.', highlight: 'substrate' },
          { t: 2500, text: 'MDH מחמצן — NADH שלישי!', highlight: 'energy' },
          { t: 5000, text: 'OAA מחודש. המעגל מתחיל שוב.', highlight: 'carrier' }
        ]
      }
    }
  ],

  intermediates: [
    { id: 'citrate', afterStep: 1, beforeStep: 2, name: 'Citrate', he: 'ציטראט', smiles: S.citrate },
    { id: 'isocitrate', afterStep: 2, beforeStep: 3, name: 'Isocitrate', he: 'איזוציטראט', smiles: S.isocitrate },
    { id: 'alphaKG', afterStep: 3, beforeStep: 4, name: 'α-KG', he: 'α-KG', smiles: S.alphaKG },
    { id: 'succinylCoA', afterStep: 4, beforeStep: 5, name: 'Succinyl-CoA', he: 'סוקצינאציל-CoA', smiles: S.succinylCoA },
    { id: 'succinate', afterStep: 5, beforeStep: 6, name: 'Succinate', he: 'סוקצינאט', smiles: S.succinate },
    { id: 'fumarate', afterStep: 6, beforeStep: 7, name: 'Fumarate', he: 'פומרט', smiles: S.fumarate },
    { id: 'malate', afterStep: 7, beforeStep: 8, name: 'Malate', he: 'מלאט', smiles: S.malate },
    { id: 'oaa', afterStep: 8, beforeStep: 1, name: 'OAA', he: 'OAA', smiles: S.oaa, carrier: true }
  ],

  integrations: [
    {
      name: 'Acetyl-CoA input (from PDH)',
      he: 'כניסת אצטיל-CoA',
      toStep: 1,
      fromCycle: 'Glycolysis (via PDH)',
      path: { en: 'Pyruvate + CoA + NAD⁺ → (PDH) → Acetyl-CoA + CO₂ + NADH', he: 'פירובט + CoA + NAD⁺ → אצטיל-CoA + CO₂ + NADH' },
      note: { en: 'Irreversible entry point — PDH regulated by phosphorylation (PDH kinase/phosphatase). PDH deficiency causes lactic acidosis + neurologic symptoms.', he: 'כניסה בלתי הפיכה. חסר PDH גורם לחמצת לקטית וסימנים נוירולוגיים.' }
    },
    {
      name: 'Acetyl-CoA input (from β-oxidation)',
      he: 'כניסת אצטיל-CoA מ-β-אוקסידציה',
      toStep: 1,
      fromCycle: 'β-Oxidation',
      path: { en: 'Fatty acid → (β-ox) → Acetyl-CoA (repeated)', he: 'חומצת שומן → אצטיל-CoA (חוזר)' },
      note: { en: 'Each β-oxidation cycle produces 1 acetyl-CoA + 1 NADH + 1 FADH₂. Fuels TCA during fasting.', he: 'כל סיבוב מייצר אצטיל-CoA + NADH + FADH₂.' }
    },
    {
      name: 'Citrate → Fatty Acid Synthesis',
      he: 'ציטראט → סינתזת חומצות שומן',
      fromMolecule: 'citrate',
      toCycle: 'Lipogenesis',
      path: { en: 'Citrate (high → export to cytosol) → Acetyl-CoA + OAA (citrate lyase) → Fatty acids', he: 'ציטראט → ציטוזול → אצטיל-CoA + OAA → חומצות שומן' },
      note: { en: 'When TCA intermediates accumulate (high ATP, well-fed), citrate exports to cytosol for lipogenesis.', he: 'במצב שובע ו-ATP גבוה, ציטראט עובר לסינתזת שומן.' }
    },
    {
      name: 'α-KG ↔ Glutamate (transamination)',
      he: 'α-KG ↔ גלוטמט',
      fromMolecule: 'alphaKG',
      toCycle: 'Amino acid metabolism',
      path: { en: 'α-KG + amino acid ↔ Glutamate + α-keto acid (transaminase). Glutamate → (GDH) → α-KG + NH₄⁺ (feeds urea cycle)', he: 'α-KG + חומצת אמינו ↔ גלוטמט + α-קטו חומצה' },
      note: { en: 'Anaplerotic input from amino acid catabolism. Glutamate dehydrogenase links AA catabolism to urea cycle.', he: 'כניסה אנפלרוטית מפירוק חומצות אמינו. מחבר ל-מעגל האוריאה.' }
    },
    {
      name: 'Succinyl-CoA → Heme Synthesis',
      he: 'סוקצינאציל-CoA → סינתזת המה',
      fromMolecule: 'succinylCoA',
      toCycle: 'Heme biosynthesis',
      path: { en: 'Succinyl-CoA + Glycine → (ALA synthase) → δ-aminolevulinate → ... → Heme', he: 'סוקצינאציל-CoA + גליצין → ALA → המה' },
      note: { en: 'First and rate-limiting step of heme synthesis. ALA synthase inhibited by heme (feedback).', he: 'השלב הראשון והמגביל בסינתזת המה.' }
    },
    {
      name: 'Fumarate ← Urea Cycle',
      he: 'פומרט ← מעגל אוריאה',
      toCycle: 'Urea cycle',
      fromCycle: 'Urea cycle (ASL)',
      path: { en: 'Argininosuccinate → Arginine + Fumarate (aspartate-argininosuccinate shunt)', he: 'ארגינינוסוקצינט → ארגינין + פומרט' },
      note: { en: 'Fumarate from urea cycle enters TCA here — links nitrogen disposal to energy metabolism.', he: 'פומרט ממעגל האוריאה נכנס ל-TCA. מחבר סילוק חנקן לאנרגיה.' }
    },
    {
      name: 'Malate → Gluconeogenesis',
      he: 'מלאט → גלוקונאוגנזה',
      fromMolecule: 'malate',
      toCycle: 'Gluconeogenesis',
      path: { en: 'Malate → (cytosol export via malate shuttle) → OAA → PEP → gluconeogenesis', he: 'מלאט → ציטוזול → OAA → PEP → גלוקונאוגנזה' },
      note: { en: 'Malate-aspartate shuttle moves reducing equivalents; also feeds gluconeogenic OAA in liver during fasting.', he: 'מעבורת מלאט-אספרטט.' }
    },
    {
      name: 'OAA → Aspartate / Gluconeogenesis',
      he: 'OAA → אספרטט / גלוקונאוגנזה',
      fromMolecule: 'oaa',
      toCycle: 'Multiple',
      path: { en: 'OAA + Glu ↔ Asp + α-KG (AST). OAA → PEP (PEPCK) → gluconeogenesis.', he: 'OAA + גלוטמט ↔ אספרטט + α-KG' },
      note: { en: 'OAA is the most branched TCA intermediate — feeds aspartate, gluconeogenesis, malate shuttle.', he: 'OAA הוא הביניים המסועף ביותר.' }
    },
    {
      name: 'Pyruvate carboxylase anaplerosis',
      he: 'אנפלרוזיס על־ידי פירובט קרבוקסילאז',
      toCycle: 'Anaplerotic reaction',
      path: { en: 'Pyruvate + CO₂ + ATP → OAA (pyruvate carboxylase, mito, biotin-dependent)', he: 'פירובט + CO₂ + ATP → OAA' },
      note: { en: 'CRITICAL anaplerotic reaction — replenishes OAA when TCA intermediates are drained (for biosynthesis). Activated by acetyl-CoA.', he: 'תגובה אנפלרוטית קריטית — מחדשת OAA. מופעלת ע"י אצטיל-CoA.' }
    }
  ],

  bigPicture: {
    en: [
      { k: 'Overall equation', v: 'Acetyl-CoA + 3 NAD⁺ + FAD + GDP + Pi + 2 H₂O → 2 CO₂ + 3 NADH + FADH₂ + GTP + CoA-SH + 3 H⁺' },
      { k: 'Yield per acetyl-CoA', v: '3 NADH + 1 FADH₂ + 1 GTP + 2 CO₂' },
      { k: 'ATP equivalents (via ETC)', v: '3 NADH × 2.5 + 1 FADH₂ × 1.5 + 1 GTP ≈ 10 ATP per acetyl-CoA' },
      { k: 'Per glucose (2 pyruvates × 1 acetyl-CoA each)', v: '2 cycles × 10 ATP = 20 ATP from TCA alone (plus 5 from 2 PDH NADH + 2 from glycolysis + 5 from glycolysis NADH = ~30-32 total)' },
      { k: 'Rate-limiting step', v: 'Isocitrate dehydrogenase (IDH) — activated by ADP, Ca²⁺; inhibited by ATP, NADH' },
      { k: 'Three regulated enzymes', v: 'Citrate synthase (step 1), IDH (step 3, rate-limiting), α-KGDH (step 4)' },
      { k: 'Two oxidative decarboxylations', v: 'Step 3 (IDH) and Step 4 (α-KGDH) — each loses CO₂ and makes NADH' },
      { k: 'One substrate-level phosphorylation', v: 'Step 5 (SCS) — makes GTP directly (= ATP equivalent)' },
      { k: 'SDH (step 6) is unique', v: 'Only TCA enzyme in the inner membrane. IS Complex II of ETC. Produces FADH₂, not NADH.' },
      { k: 'OAA is regenerated', v: 'Not consumed overall — the cycle is catalytic for the 2-carbon acetyl unit.' },
      { k: 'Anaplerotic', v: 'Pyruvate carboxylase replenishes OAA (biotin-dependent, activated by acetyl-CoA)' },
      { k: 'Amphibolic', v: 'Both catabolic (energy) AND anabolic (biosynthesis of FA, AA, heme, glucose)' },
      { k: 'Inhibitors to know', v: 'Fluoroacetate → aconitase · Arsenite → α-KGDH (binds lipoate) · Malonate → SDH competitive · IDH1/2 mutations → cancer (2-HG)' },
      { k: 'Thiamine (B1) dependence', v: 'α-KGDH uses TPP. B1 deficiency → Beriberi, Wernicke-Korsakoff. Always give B1 BEFORE glucose in alcoholics.' }
    ],
    he: [
      { k: 'משוואה כללית', v: 'Acetyl-CoA + 3 NAD⁺ + FAD + GDP + Pi → 2 CO₂ + 3 NADH + FADH₂ + GTP + CoA-SH' },
      { k: 'תשואה לאצטיל-CoA', v: '3 NADH + 1 FADH₂ + 1 GTP + 2 CO₂' },
      { k: 'שווי ATP', v: '~10 ATP לאצטיל-CoA (דרך ETC)' },
      { k: 'שלב מגביל־קצב', v: 'IDH — מופעל ע"י ADP, Ca²⁺; מעוכב ע"י ATP, NADH' },
      { k: '3 אנזימים מווסתים', v: 'CS (1), IDH (3), α-KGDH (4)' },
      { k: '2 דקרבוקסילציות חמצוניות', v: 'IDH ו-α-KGDH — כל אחד מאבד CO₂ ומייצר NADH' },
      { k: 'פוספורילציה ברמת מצע', v: 'SCS (שלב 5) — מייצר GTP' },
      { k: 'SDH ייחודי', v: 'האנזים היחיד בממברנה הפנימית. הוא גם קומפלקס II.' },
      { k: 'OAA מחודש', v: 'לא נצרך. המעגל קטליטי.' },
      { k: 'אנפלרוטי', v: 'פירובט קרבוקסילאז מחדש OAA' },
      { k: 'אמפיבולי', v: 'קטבולי ואנבולי' },
      { k: 'מעכבים', v: 'פלואורואצטט → אקוניטאז · ארסניט → α-KGDH · מלונאט → SDH' },
      { k: 'תיאמין', v: 'α-KGDH משתמש ב-TPP. חסר B1 → ברי-ברי, ורניקה-קורסקוף.' }
    ]
  },

  questions: [
    { id: 'tca-q1', difficulty: 'easy', prompt: { en: 'How many NADH are produced per acetyl-CoA in TCA?', he: 'כמה NADH מיוצרים לאצטיל-CoA ב-TCA?' }, correct: '3', options: ['3', '2', '4', '1'] },
    { id: 'tca-q2', difficulty: 'medium', prompt: { en: 'The rate-limiting enzyme of the TCA cycle is:', he: 'האנזים מגביל־הקצב ב-TCA:' }, correct: 'Isocitrate dehydrogenase', options: ['Isocitrate dehydrogenase', 'Citrate synthase', 'α-KGDH', 'SDH'] },
    { id: 'tca-q3', difficulty: 'hard', prompt: { en: 'Which TCA enzyme is also part of the electron transport chain?', he: 'איזה אנזים ב-TCA הוא גם חלק משרשרת האלקטרונים?' }, correct: 'Succinate dehydrogenase (Complex II)', options: ['Succinate dehydrogenase (Complex II)', 'Citrate synthase', 'IDH', 'Fumarase'] },
    { id: 'tca-q4', difficulty: 'medium', prompt: { en: 'Which step produces GTP (substrate-level phosphorylation)?', he: 'איזה שלב מייצר GTP?' }, correct: 'Succinyl-CoA synthetase (step 5)', options: ['Succinyl-CoA synthetase (step 5)', 'IDH (step 3)', 'MDH (step 8)', 'SDH (step 6)'] },
    { id: 'tca-q5', difficulty: 'hard', prompt: { en: 'Fluoroacetate poisoning inhibits:', he: 'הרעלת פלואורואצטט מעכבת:' }, correct: 'Aconitase', options: ['Aconitase', 'Citrate synthase', 'SDH', 'MDH'] },
    { id: 'tca-q6', difficulty: 'medium', prompt: { en: 'Succinyl-CoA is a precursor for:', he: 'סוקצינאציל-CoA הוא מבשר של:' }, correct: 'Heme', options: ['Heme', 'Cholesterol', 'Glucose', 'Urea'] },
    { id: 'tca-q7', difficulty: 'hard', prompt: { en: 'Thiamine deficiency most directly impairs:', he: 'חסר תיאמין פוגע ישירות ביותר ב:' }, correct: 'α-Ketoglutarate dehydrogenase', options: ['α-Ketoglutarate dehydrogenase', 'Succinate dehydrogenase', 'Fumarase', 'Malate dehydrogenase'] },
    { id: 'tca-q8', difficulty: 'hard', prompt: { en: 'Mutations in IDH1/IDH2 are found in:', he: 'מוטציות IDH1/IDH2 נמצאות ב:' }, correct: 'Gliomas and AML', options: ['Gliomas and AML', 'Pheochromocytoma', 'Renal cell carcinoma', 'Lung adenocarcinoma'] },
    { id: 'tca-q9', difficulty: 'easy', prompt: { en: 'How many ATP equivalents per acetyl-CoA (through TCA + ETC)?', he: 'כמה שווי ATP לאצטיל-CoA?' }, correct: '~10', options: ['~10', '~5', '~15', '~4'] },
    { id: 'tca-q10', difficulty: 'medium', prompt: { en: 'Pyruvate carboxylase is activated by:', he: 'פירובט קרבוקסילאז מופעל ע"י:' }, correct: 'Acetyl-CoA', options: ['Acetyl-CoA', 'Citrate', 'ATP', 'NADH'] },
    { id: 'tca-q11', difficulty: 'medium', prompt: { en: 'Malonate inhibits which enzyme?', he: 'מלונאט מעכב איזה אנזים?' }, correct: 'Succinate dehydrogenase', options: ['Succinate dehydrogenase', 'Aconitase', 'α-KGDH', 'Fumarase'] },
    { id: 'tca-q12', difficulty: 'hard', prompt: { en: 'HLRCC (hereditary leiomyomatosis) is caused by mutations in:', he: 'HLRCC נגרם ממוטציות ב:' }, correct: 'Fumarate hydratase (fumarase)', options: ['Fumarate hydratase (fumarase)', 'SDH', 'IDH', 'Citrate synthase'] },
    { id: 'tca-q13', difficulty: 'medium', prompt: { en: 'Why does the cycle continue despite MDH\'s unfavorable ΔG?', he: 'מדוע המעגל ממשיך למרות ΔG לא טוב של MDH?' }, correct: 'OAA is immediately consumed by citrate synthase (Le Chatelier)', options: ['OAA is immediately consumed by citrate synthase (Le Chatelier)', 'MDH uses ATP', 'Reaction is reversed', 'Malate inhibits MDH'] },
    { id: 'tca-q14', difficulty: 'hard', prompt: { en: 'Which 5 cofactors does α-KGDH require?', he: 'אילו 5 קופקטורים ל-α-KGDH?' }, correct: 'TPP, lipoate, CoA, FAD, NAD⁺', options: ['TPP, lipoate, CoA, FAD, NAD⁺', 'NADPH, FAD, CoA, biotin, Mg²⁺', 'TPP, biotin, PLP, NAD⁺, FAD', 'NAD⁺, FAD, CoA, Mg²⁺, Mn²⁺'] }
  ]
};
