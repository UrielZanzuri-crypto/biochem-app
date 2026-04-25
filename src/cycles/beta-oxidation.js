// ============================================================
// β-OXIDATION — 4 repeating steps, mitochondrial matrix
// The "fatty acid spiral" — each turn shortens the FA by 2 carbons
// ============================================================

const S = {
  // Generic fatty acyl-CoA (represent with palmitate backbone as example)
  fattyAcid:     'CCCCCCCCCCCCCCCC(=O)O',  // palmitate (16:0)
  faCoA:         'CCCCCCCCCCCCCCCC(=O)S',   // acyl-CoA (simplified)
  transEnoyl:    'CCCCCCCCCCCCC/C=C/C(=O)S', // trans-Δ²-enoyl-CoA
  hydroxy:       'CCCCCCCCCCCCCC(O)CC(=O)S', // L-3-hydroxyacyl-CoA
  ketoacyl:      'CCCCCCCCCCCCCC(=O)CC(=O)S', // 3-ketoacyl-CoA
  shortFaCoA:    'CCCCCCCCCCCCCC(=O)S',       // shorter fatty acyl-CoA (n-2)
  acetylCoA:     'CC(=O)S',
  carnitine:     'C[N+](C)(C)CC(O)CC(=O)[O-]',
  palmCarnitine: 'CCCCCCCCCCCCCCCC(=O)OC(CC(=O)[O-])C[N+](C)(C)C',
  // Cofactors
  fad:           'Cc1cc2nc3c(=O)[nH]c(=O)n(C4OC(CO)C(O)C4O)c3nc2cc1C',
  fadh2:         'Cc1cc2NC3C(=O)NC(=O)N(C4OC(CO)C(O)C4O)C3=Nc2cc1C',
  nad:           'NC(=O)c1ccc[n+](c1)C2OC(CO)C(O)C2O',
  nadh:          'NC(=O)C1=CN(C=CC1)C2OC(CO)C(O)C2O',
  coa:           'CC(C)(COP(O)(=O)OP(O)(=O)OCC1OC(n2cnc3c(N)ncnc23)C(O)C1OP(O)(O)=O)C(O)C(=O)NCCC(=O)NCCS',
  h2o:           'O',
  atp:           'Nc1ncnc2n(cnc12)C3OC(COP(O)(=O)OP(O)(=O)OP(O)(=O)O)C(O)C3O',
  amp:           'Nc1ncnc2n(cnc12)C3OC(COP(O)(=O)O)C(O)C3O'
};

export const betaOxidationCycle = {
  id: 'beta-ox',
  chapter: 'Fatty Acid Catabolism',
  chapterOrder: 4,
  order: 1,
  layout: 'circular',
  title: { en: 'β-Oxidation (Fatty Acid Spiral)', he: 'β-אוקסידציה (ספירלת חומצות שומן)' },
  subtitle: { en: 'Repeating 4-step cycle: each turn yields Acetyl-CoA + FADH₂ + NADH', he: 'מעגל חוזר של 4 שלבים: כל סיבוב — אצטיל-CoA + FADH₂ + NADH' },

  context: {
    tissue: { en: 'Liver (main ketogenic), muscle (ATP production), heart (preferred fuel)', he: 'כבד (קטוגנזה), שריר, לב (דלק מועדף)' },
    otherTissues: { en: 'NOT in brain (fatty acids don\'t cross BBB) or RBCs (no mitochondria)', he: 'לא במוח (FA לא חוצים BBB) וגם לא בכדוריות אדומות' },
    state: { en: 'FASTING STATE: glucagon → lipolysis → FA released from adipose → β-oxidation in liver/muscle', he: 'צום: גלוקגון → ליפוליזה → FA לכבד/שריר' },
    stateHormonal: { en: 'Glucagon/epinephrine ↑ (activate hormone-sensitive lipase → release FA). Insulin ↓ (blocks lipolysis)', he: 'גלוקגון/אפינפרין מעלה; אינסולין מוריד' },
    turnover: { en: 'Seconds-to-minutes regulation via malonyl-CoA inhibition of CPT-1 (coordinates with fatty acid synthesis)', he: 'ויסות שניות-דקות דרך עיכוב CPT-1 ע"י מלוניל-CoA' }
  },

  overview: {
    en: `β-oxidation systematically breaks down fatty acids (typically 16C palmitate) into 2-carbon acetyl-CoA units for entry into the TCA cycle. Each "turn" of the spiral shortens the FA by 2 carbons and produces 1 FADH₂ + 1 NADH + 1 Acetyl-CoA. For palmitate (16:0): 7 turns → 8 Acetyl-CoA + 7 FADH₂ + 7 NADH → ~106 ATP (vs. 2 ATP spent in activation; net ~104 ATP — massive compared to 32 ATP from glucose). Long-chain FAs require the CARNITINE SHUTTLE to enter the mitochondrion (CPT-1 is rate-limiting and inhibited by malonyl-CoA — the key integration between FA synthesis and oxidation). Four enzymatic steps repeat: oxidation (FAD), hydration (H₂O), oxidation (NAD⁺), thiolysis (CoA). Disorders of β-oxidation (MCAD, LCHAD, etc.) present with fasting hypoglycemia, hypoketotic coma, cardiomyopathy.`,
    he: `β-אוקסידציה מפרקת חומצות שומן ל-2C אצטיל-CoA לכניסה ל-TCA. כל סיבוב מקצר ב-2 פחמנים ומייצר FADH₂ + NADH + אצטיל-CoA. לפלמיטט (16C): 7 סיבובים → 8 אצטיל-CoA + 7 FADH₂ + 7 NADH → ~106 ATP (מול 32 מגלוקוז). דורש מעבורת קרניטין לכניסה. 4 שלבים חוזרים: חמצון, הידרציה, חמצון, תיוליזה.`
  },

  // ============================================================
  // PEDAGOGY — Plain-English explanations of the high-yield concepts.
  // Rendered as hint cards in the Explore tab.
  // ============================================================
  pedagogy: [
    {
      title: 'The Carnitine Shuttle — How fatty acids enter the mitochondrion',
      icon: '🚚',
      body: `Long-chain fatty acids (>12 carbons) cannot cross the inner mitochondrial membrane on their own. They use a 3-step shuttle:

• Step 1 — CPT-1 (outer membrane): Swaps CoA for carnitine on the fatty acid. Acyl-CoA → Acyl-carnitine. **CPT-1 is the RATE-LIMITING step** of β-oxidation and is **inhibited by malonyl-CoA** (the first product of fatty acid synthesis) — this is the brilliant logic that prevents the cell from making and burning fat at the same time.

• Step 2 — CACT (translocase): Antiporter that swaps acyl-carnitine (in) for free carnitine (out) across the inner membrane.

• Step 3 — CPT-2 (matrix side): Swaps carnitine back for CoA. Acyl-carnitine → Acyl-CoA inside the matrix, ready for β-oxidation.

CPT-2 deficiency: muscle pain on prolonged exercise/fasting, myoglobinuria. CPT-1 deficiency: severe hypoglycemia, no muscle weakness (CPT-1 isn't expressed there). Primary carnitine deficiency: low plasma carnitine, treat with oral carnitine.`
    },
    {
      title: 'Odd-chain fatty acids — Why they\'re different',
      icon: '🔢',
      body: `Most dietary fatty acids have an even number of carbons (palmitic 16C, stearic 18C). β-oxidation chops 2C at a time, so an even-chain FA ends cleanly with the last cycle making 2 Acetyl-CoA.

**Odd-chain FAs end differently** — the final round produces 1 Acetyl-CoA (2C) PLUS **propionyl-CoA (3C)**, not another acetyl-CoA. Propionyl-CoA cannot enter the TCA directly. It goes through:

• Propionyl-CoA carboxylase (needs **biotin/B7**) → D-methylmalonyl-CoA
• Methylmalonyl-CoA mutase (needs **B12 / cobalamin**) → Succinyl-CoA → enters TCA

Clinical: B12 deficiency causes methylmalonic acidemia (high MMA in urine — actually a sensitive lab marker for B12 deficiency). Methylmalonic acidemia (genetic) and propionic acidemia present with vomiting, hypotonia, ketosis in newborns. Note: this is the only way fatty acids can be slightly anaplerotic (feed the TCA pool with carbons), since succinyl-CoA replenishes oxaloacetate.`
    },
    {
      title: 'α-Oxidation — For branched fatty acids',
      icon: '🌿',
      body: `Some fatty acids (especially **phytanic acid** from dairy and ruminant fat) have a methyl branch at C3 — the β-position. β-oxidation cannot start because the β-carbon is blocked by a methyl group.

**α-oxidation** is the workaround:
• Removes ONE carbon from the α-position (not 2 like β-ox)
• Happens in **peroxisomes**, NOT mitochondria
• Key enzyme: **phytanoyl-CoA hydroxylase**
• After α-oxidation, the methyl branch ends up on the new α-carbon (no longer β) so normal β-oxidation can proceed

**Refsum disease**: deficiency of phytanoyl-CoA hydroxylase. Phytanic acid accumulates → retinitis pigmentosa, peripheral neuropathy, cerebellar ataxia, ichthyosis. Treatment: dietary restriction of phytanic acid (avoid dairy, ruminant fat).

Note also: Very-long-chain FAs (>22C) start their β-oxidation in **peroxisomes** (not mitochondria) until shortened to ~C8, then move to mitochondria. Defect: X-linked adrenoleukodystrophy (Lorenzo's Oil).`
    },
    {
      title: 'Energy yield — the big numbers',
      icon: '⚡',
      body: `**Palmitate (16C) full β-oxidation:**
• 7 cycles of β-oxidation → 7 FADH₂ + 7 NADH + 8 Acetyl-CoA
• 8 Acetyl-CoA × TCA → 8 × (3 NADH + 1 FADH₂ + 1 GTP) = 24 NADH + 8 FADH₂ + 8 GTP
• Total: 31 NADH + 15 FADH₂ + 8 GTP
• Using 2.5 ATP/NADH and 1.5 ATP/FADH₂: 31×2.5 + 15×1.5 + 8 = 77.5 + 22.5 + 8 = **108 ATP**
• Subtract 2 ATP for fatty acid activation (Acyl-CoA Synthetase consumes ATP→AMP, equivalent to 2 ATP) = **~106 ATP net per palmitate**

Compare glucose: ~32 ATP per glucose (6C). Per carbon, fatty acids are ~2× more energy-dense than carbohydrates.`
    }
  ],

  storyFrame: {
    en: {
      title: 'The Fatty Acid Shredder',
      setting: 'A 4-station disassembly line in the mitochondrial matrix. Long fatty acid chains are fed in through the carnitine shuttle. At each turn of the spiral, exactly 2 carbons are chopped off the end as Acetyl-CoA, while FADH₂ and NADH are harvested. The shortened chain re-enters the spiral. A 16-carbon palmitate runs the spiral 7 times before it\'s gone.',
      characters: [
        { name: 'Acyl-DH', role: 'The First Oxidizer', icon: '⚡', color: '#f59e0b' },
        { name: 'Hydratase', role: 'The Water Adder', icon: '💧', color: '#3b82f6' },
        { name: '3-HA-DH', role: 'The Second Oxidizer', icon: '⚡', color: '#8b5cf6' },
        { name: 'Thiolase', role: 'The Chopper', icon: '🔪', color: '#10b981' }
      ]
    },
    he: {
      title: 'מגרסת חומצות השומן',
      setting: 'קו פירוק בן 4 תחנות במטריקס המיטוכונדריה. שרשראות חומצות שומן ארוכות נכנסות דרך מעבורת קרניטין. בכל סיבוב בדיוק 2 פחמנים נחתכים מהקצה כאצטיל-CoA.',
      characters: [
        { name: 'Acyl-DH', role: 'המחמצן הראשון', icon: '⚡', color: '#f59e0b' },
        { name: 'Hydratase', role: 'מוסיף המים', icon: '💧', color: '#3b82f6' },
        { name: '3-HA-DH', role: 'המחמצן השני', icon: '⚡', color: '#8b5cf6' },
        { name: 'Thiolase', role: 'החותך', icon: '🔪', color: '#10b981' }
      ]
    }
  },

  mnemonic: {
    en: { phrase: 'Oxidize, Hydrate, Oxidize, Cleave — Fatty Acids Get Shorter', breakdown: 'Acyl-CoA DH → Enoyl-CoA hydratase → 3-OH-acyl-CoA DH → Thiolase' },
    he: { phrase: 'חמצן, מים, חמצן, חתוך', breakdown: 'Acyl-CoA DH → אנואיל הידרטאז → 3-OH DH → תיולאז' }
  },

  compartments: {
    mito: { en: 'Mitochondrial Matrix', he: 'מטריקס מיטוכונדריאלי', color: '#fef3c7', accent: '#f59e0b' }
  },

  // Transport is crucial for this cycle
  transporters: [
    {
      id: 'cpt1',
      name: 'CPT-1 (Carnitine Palmitoyl Transferase 1)',
      he: 'CPT-1',
      imports: 'Acyl-CoA + Carnitine',
      exports: 'Acyl-carnitine',
      note: { en: 'RATE-LIMITING for β-oxidation. Inhibited by malonyl-CoA (first product of FA synthesis) — prevents simultaneous synthesis and breakdown. Located on outer mitochondrial membrane.', he: 'שלב מגביל־קצב ל-β-אוקסידציה. מעוכב ע"י מלוניל-CoA — מונע סינתזה ופירוק במקביל.' }
    },
    {
      id: 'cact',
      name: 'CACT (Carnitine-Acylcarnitine Translocase)',
      he: 'CACT',
      imports: 'Acyl-carnitine',
      exports: 'Carnitine',
      note: { en: 'Inner mitochondrial membrane transporter. Swaps acyl-carnitine in for free carnitine out.', he: 'טרנסלוקאז בממברנה הפנימית.' }
    },
    {
      id: 'cpt2',
      name: 'CPT-2',
      he: 'CPT-2',
      imports: 'Acyl-carnitine',
      exports: 'Acyl-CoA + Carnitine',
      note: { en: 'Inside the matrix: regenerates acyl-CoA. Free carnitine returns via CACT. CPT-2 deficiency — most common adult form — presents with exercise-induced myoglobinuria.', he: 'בתוך המטריקס: מחדש acyl-CoA. חסר CPT-2 — הצורה הנפוצה למבוגר.' }
    }
  ],

  steps: [
    {
      id: 1,
      compartment: 'mito',
      angle: -90,
      enzyme: {
        abbr: 'Acyl-DH',
        name: 'Acyl-CoA Dehydrogenase',
        ec: '1.3.8.x',
        class: 'Oxidoreductase',
        he: 'Acyl-CoA דהידרוגנאז'
      },
      substrates: [
        { key: 'faCoA', name: 'Acyl-CoA', smiles: S.faCoA, label: { en: 'Fatty Acyl-CoA (Cₙ)', he: 'Acyl-CoA (Cₙ)' }, isSource: true, stoich: 1 }
      ],
      cofactors: [
        { key: 'fad', name: 'FAD', smiles: S.fad, stoich: 1, role: 'consumed' },
        { key: 'fadh2', name: 'FADH₂', smiles: S.fadh2, stoich: 1, role: 'produced' }
      ],
      products: [
        { key: 'transEnoyl', name: 'trans-Δ²-Enoyl-CoA', smiles: S.transEnoyl, isMain: true, stoich: 1 }
      ],
      deltaG: '−15 kJ/mol',
      reversible: false,
      isozymes: [
        { name: 'VLCAD (Very Long Chain)', tissue: 'Mitochondrial membrane', km: 'Long chain (C14-C20)', vmax: '—', regulation: 'Substrate specificity', note: { en: 'Deficiency → VLCAD deficiency: cardiomyopathy, hypoketotic hypoglycemia', he: 'חסר → קרדיומיופתיה, היפוגליקמיה היפוקטוטית' } },
        { name: 'MCAD (Medium Chain)', tissue: 'Matrix', km: 'C6-C12', vmax: '—', regulation: 'Substrate specificity', note: { en: 'MCAD deficiency = MOST COMMON fatty acid oxidation defect. Infant fasting hypoglycemia, low ketones, SIDS-like presentation', he: 'חסר MCAD — ההפרעה הנפוצה ביותר בחמצון שומנים. היפוגליקמיה בצום, קטונים נמוכים' } },
        { name: 'SCAD (Short Chain)', tissue: 'Matrix', km: 'C4-C6', vmax: '—', regulation: 'Substrate specificity' },
        { name: 'LCAD (Long Chain)', tissue: 'Matrix', km: 'C12-C18', vmax: '—', regulation: 'Substrate specificity' }
      ],
      regulation: {
        activators: [], inhibitors: [],
        summary: { en: 'Four isozymes with chain-length specificity. Uses ETF (electron transferring flavoprotein) to pass electrons to Q in ETC — different entry point than NADH.', he: 'ארבעה איזוזימים לפי אורך שרשרת. משתמש ב-ETF להעברה ל-ETC.' }
      },
      story: {
        en: 'THE FIRST OXIDIZER removes 2 hydrogens from the fatty acid, creating a double bond between C2 and C3 (α-β positions). FADH₂ is formed. The enzyme comes in 4 flavors (VLCAD, LCAD, MCAD, SCAD) for different chain lengths — the baton is passed as chains shrink.',
        he: 'המחמצן הראשון מסיר 2 מימנים, יוצר קשר כפול בין C2 ל-C3. FADH₂ נוצר. 4 איזוזימים לפי אורך שרשרת.'
      },
      clinical: {
        disorder: 'MCAD Deficiency',
        he: 'חסר MCAD',
        inheritance: 'Autosomal recessive',
        findings: { en: 'MOST COMMON β-oxidation defect (~1:15,000). Infants can fast normally at first, but during extended fasting (illness, weaning) they can\'t break down medium-chain FAs → hypoketotic hypoglycemia, encephalopathy, SIDS-like death. Labs: ↓ glucose, LOW ketones (inappropriate), ↑ C8-C10 acylcarnitines in blood spot. Newborn screening detects it.', he: 'הפרעת חמצון שומנים הנפוצה ביותר. תינוקות בצום ממושך — היפוגליקמיה היפוקטוטית, מוות דמוי SIDS. סקר ילוד מגלה.' },
        treatment: { en: 'Avoid fasting (>10-12h). Frequent carbohydrate feeds. IV glucose during illness. L-carnitine sometimes. Generally good prognosis with management.', he: 'להימנע מצום. פחמימות תכופות. גלוקוז IV במחלות.' }
      },
      beats: {
        en: [
          { t: 0, text: 'Fatty acyl-CoA (Cₙ) arrives for step 1 of the spiral.', highlight: 'substrate' },
          { t: 2500, text: 'Acyl-CoA DH uses FAD to remove 2 hydrogens.', highlight: 'enzyme' },
          { t: 5000, text: 'FADH₂ captured; double bond forms at C2-C3.', highlight: 'energy' },
          { t: 7500, text: 'trans-Δ²-Enoyl-CoA ready for hydration.', highlight: 'product' }
        ],
        he: [
          { t: 0, text: 'Acyl-CoA (Cₙ) מגיע לשלב 1.', highlight: 'substrate' },
          { t: 2500, text: 'Acyl-CoA DH משתמש ב-FAD להסרת 2 מימנים.', highlight: 'enzyme' },
          { t: 5000, text: 'FADH₂ נלכד; קשר כפול ב-C2-C3.', highlight: 'energy' },
          { t: 7500, text: 'trans-Δ²-Enoyl-CoA מוכן להידרציה.', highlight: 'product' }
        ]
      }
    },
    {
      id: 2,
      compartment: 'mito',
      angle: 0,
      enzyme: {
        abbr: 'Hydratase',
        name: 'Enoyl-CoA Hydratase',
        ec: '4.2.1.17',
        class: 'Lyase',
        he: 'אנואיל-CoA הידרטאז'
      },
      substrates: [
        { key: 'transEnoyl', name: 'trans-Δ²-Enoyl-CoA', smiles: S.transEnoyl, stoich: 1 }
      ],
      cofactors: [
        { key: 'h2o', name: 'H₂O', smiles: S.h2o, stoich: 1, role: 'consumed' }
      ],
      products: [
        { key: 'hydroxy', name: 'L-3-Hydroxyacyl-CoA', smiles: S.hydroxy, isMain: true, stoich: 1 }
      ],
      deltaG: '−4 kJ/mol',
      reversible: true,
      regulation: {
        activators: [], inhibitors: [],
        summary: { en: 'Stereospecific addition of water: produces L-3-hydroxy form only. Simple but mandatory setup for next oxidation.', he: 'הוספת מים סטריאוספציפית: יוצר רק L-3-hydroxy.' }
      },
      story: {
        en: 'THE WATER ADDER hydrates the double bond, placing an OH on carbon 3. Strictly L-stereochemistry. Parallels fumarase in TCA — both add water across a trans double bond.',
        he: 'מוסיף המים מלחלח את הקשר הכפול, שם OH על C3. אנלוגי לפומראז ב-TCA.'
      },
      clinical: null,
      beats: {
        en: [
          { t: 0, text: 'The double bond is set up for hydration.', highlight: 'substrate' },
          { t: 2500, text: 'Water is added across the trans double bond.', highlight: 'enzyme' },
          { t: 5000, text: 'L-3-hydroxyacyl-CoA — set up for the second oxidation.', highlight: 'product' }
        ],
        he: [
          { t: 0, text: 'הקשר הכפול מוכן להידרציה.', highlight: 'substrate' },
          { t: 2500, text: 'מים מתווספים.', highlight: 'enzyme' },
          { t: 5000, text: 'L-3-hydroxyacyl-CoA מוכן לחמצון.', highlight: 'product' }
        ]
      }
    },
    {
      id: 3,
      compartment: 'mito',
      angle: 90,
      enzyme: {
        abbr: '3-HA-DH',
        name: '3-Hydroxyacyl-CoA Dehydrogenase',
        ec: '1.1.1.35',
        class: 'Oxidoreductase',
        he: '3-הידרוקסי Acyl-CoA דהידרוגנאז'
      },
      substrates: [
        { key: 'hydroxy', name: 'L-3-Hydroxyacyl-CoA', smiles: S.hydroxy, stoich: 1 }
      ],
      cofactors: [
        { key: 'nad', name: 'NAD⁺', smiles: S.nad, stoich: 1, role: 'consumed' },
        { key: 'nadh', name: 'NADH', smiles: S.nadh, stoich: 1, role: 'produced' }
      ],
      products: [
        { key: 'ketoacyl', name: '3-Ketoacyl-CoA', smiles: S.ketoacyl, isMain: true, stoich: 1 }
      ],
      deltaG: '+16 kJ/mol (pulled forward by thiolase)',
      reversible: true,
      regulation: {
        activators: [],
        inhibitors: [{ name: 'NADH', type: 'product inhibition', note: { en: 'High [NADH]/[NAD⁺] ratio stalls β-oxidation at this step', he: 'יחס NADH/NAD⁺ גבוה עוצר כאן' } }],
        summary: { en: 'Oxidizes the hydroxyl to a ketone. Captures 2nd pair of electrons as NADH.', he: 'מחמצן הידרוקסיל לקטון. NADH שני.' }
      },
      story: {
        en: 'THE SECOND OXIDIZER takes the OH and oxidizes it to a C=O ketone. NADH is captured. The β-carbon is now a carbonyl — ready to be cleaved.',
        he: 'המחמצן השני לוקח את ה-OH ומחמצן לקטון. NADH נלכד. פחמן β מוכן לחיתוך.'
      },
      clinical: {
        disorder: 'LCHAD Deficiency',
        he: 'חסר LCHAD',
        inheritance: 'Autosomal recessive',
        findings: { en: 'Long-chain 3-hydroxyacyl-CoA dehydrogenase deficiency. Severe presentation: hypoketotic hypoglycemia + cardiomyopathy + retinopathy + peripheral neuropathy. Also: associated with MATERNAL HELLP/AFLP during pregnancy (fetal LCHAD deficiency → toxic metabolites in mother).', he: 'חסר LCHAD. היפוגליקמיה היפוקטוטית + קרדיומיופתיה + רטינופתיה. קשור ל-HELLP/AFLP אמהי.' },
        treatment: { en: 'Avoid fasting, MCT oil (medium chain FAs bypass the defect), carnitine supplementation.', he: 'להימנע מצום, שמן MCT, תוסף קרניטין.' }
      },
      beats: {
        en: [
          { t: 0, text: 'The OH group sits waiting for oxidation.', highlight: 'substrate' },
          { t: 2500, text: '3-HA-DH uses NAD⁺ — second round of electrons captured.', highlight: 'energy' },
          { t: 5000, text: '3-Ketoacyl-CoA: C3 is now a carbonyl.', highlight: 'product' }
        ],
        he: [
          { t: 0, text: 'ה-OH ממתין לחמצון.', highlight: 'substrate' },
          { t: 2500, text: '3-HA-DH משתמש ב-NAD⁺.', highlight: 'energy' },
          { t: 5000, text: '3-Ketoacyl-CoA: C3 הפך לקרבוניל.', highlight: 'product' }
        ]
      }
    },
    {
      id: 4,
      compartment: 'mito',
      angle: 180,
      enzyme: {
        abbr: 'Thiolase',
        name: 'β-Ketothiolase (Acetyl-CoA Acyltransferase)',
        ec: '2.3.1.16',
        class: 'Transferase',
        he: 'תיולאז'
      },
      substrates: [
        { key: 'ketoacyl', name: '3-Ketoacyl-CoA', smiles: S.ketoacyl, stoich: 1 }
      ],
      cofactors: [
        { key: 'coa', name: 'CoA-SH', smiles: S.coa, stoich: 1, role: 'consumed' }
      ],
      products: [
        { key: 'shortFaCoA', name: 'Acyl-CoA (Cₙ₋₂)', smiles: S.shortFaCoA, label: { en: 'Shorter Acyl-CoA → back to step 1', he: 'Acyl-CoA קצר יותר → חזרה לשלב 1' }, isCarrier: true, isMain: true, stoich: 1 },
        { key: 'acetylCoA', name: 'Acetyl-CoA', smiles: S.acetylCoA, label: { en: 'Acetyl-CoA → TCA', he: 'אצטיל-CoA → TCA' }, isMain: true, isFinal: true, exportsTo: 'tca', stoich: 1 }
      ],
      deltaG: '−28 kJ/mol',
      reversible: false,
      regulation: {
        activators: [],
        inhibitors: [{ name: 'Acetyl-CoA', type: 'product inhibition', note: { en: 'High [acetyl-CoA] slows further β-oxidation — especially when TCA is saturated', he: 'אצטיל-CoA גבוה מאט חמצון נוסף' } }],
        summary: { en: 'Thiolytic cleavage: CoA attacks the β-carbonyl, releasing acetyl-CoA and a fatty acyl-CoA 2 carbons shorter. The shorter chain re-enters step 1 — the SPIRAL.', he: 'חיתוך תיוליטי: CoA תוקף את הקרבוניל β, משחרר אצטיל-CoA ושרשרת קצרה יותר ב-2 פחמנים. מתחילה מחדש.' }
      },
      story: {
        en: 'THE CHOPPER performs the final cleavage. CoA attacks the β-carbonyl, breaking the C2-C3 bond. Two carbons (as acetyl-CoA) are released — ready for TCA. The remaining chain is now 2 carbons shorter and re-enters step 1 as a new acyl-CoA. The spiral repeats until the chain is fully consumed.',
        he: 'החותך מבצע את החיתוך הסופי. CoA תוקף את C3, שובר C2-C3. אצטיל-CoA משתחרר; השרשרת הנותרת קצרה ב-2 וחוזרת לשלב 1.'
      },
      clinical: {
        disorder: 'β-Ketothiolase Deficiency',
        he: 'חסר תיולאז',
        inheritance: 'Autosomal recessive',
        findings: { en: 'Rare. Episodic ketoacidosis especially during illness/fasting. Can also affect isoleucine metabolism. Labs: ketones elevated, urinary organic acids.', he: 'נדיר. חמצת קטוטית אפיזודית במחלות/צום.' },
        treatment: { en: 'Avoid fasting, protein restriction during illness.', he: 'להימנע מצום, הגבלת חלבון במחלות.' }
      },
      beats: {
        en: [
          { t: 0, text: 'CoA attacks the β-ketone — it\'s the final cleavage.', highlight: 'substrate' },
          { t: 2500, text: 'Thiolase splits the chain. 2 carbons come off.', highlight: 'enzyme' },
          { t: 5000, text: 'Acetyl-CoA → TCA. Shortened chain → back to step 1.', highlight: 'product' },
          { t: 7500, text: 'The spiral continues until the fatty acid is fully shredded.', highlight: 'carrier' }
        ],
        he: [
          { t: 0, text: 'CoA תוקף את הקטון β.', highlight: 'substrate' },
          { t: 2500, text: 'תיולאז חוצה את השרשרת.', highlight: 'enzyme' },
          { t: 5000, text: 'אצטיל-CoA → TCA. שרשרת קצרה יותר → שלב 1.', highlight: 'product' },
          { t: 7500, text: 'הספירלה ממשיכה.', highlight: 'carrier' }
        ]
      }
    }
  ],

  intermediates: [
    { id: 'transEnoyl', afterStep: 1, beforeStep: 2, name: 'trans-Δ²-Enoyl-CoA', he: 'trans-Δ²-Enoyl-CoA', smiles: S.transEnoyl },
    { id: 'hydroxy', afterStep: 2, beforeStep: 3, name: 'L-3-Hydroxyacyl-CoA', he: 'L-3-Hydroxy-CoA', smiles: S.hydroxy },
    { id: 'ketoacyl', afterStep: 3, beforeStep: 4, name: '3-Ketoacyl-CoA', he: '3-Ketoacyl-CoA', smiles: S.ketoacyl },
    { id: 'shortFaCoA', afterStep: 4, beforeStep: 1, name: 'Acyl-CoA (Cₙ₋₂)', he: 'Acyl-CoA (Cₙ₋₂)', smiles: S.shortFaCoA, carrier: true }
  ],

  integrations: [
    {
      name: 'Activation: FA → Acyl-CoA (Acyl-CoA Synthetase)',
      he: 'הפעלה: FA → Acyl-CoA',
      toStep: 1,
      fromCycle: 'Fatty acid activation',
      path: { en: 'FA + CoA + ATP → Acyl-CoA + AMP + PPi (on outer mito membrane). Costs 2 ATP equivalents.', he: 'FA + CoA + ATP → Acyl-CoA + AMP + PPi. עלות: 2 ATP.' },
      note: { en: 'One-time cost per fatty acid (not per cycle turn).', he: 'חד־פעמי לכל חומצת שומן.' }
    },
    {
      name: 'Carnitine Shuttle (CPT-1/CPT-2)',
      he: 'מעבורת קרניטין',
      toStep: 1,
      fromCycle: 'Carnitine shuttle',
      path: { en: 'Acyl-CoA + Carnitine → (CPT-1, outer) → Acyl-carnitine → (CACT) → matrix → (CPT-2) → Acyl-CoA + Carnitine', he: 'Acyl-CoA + קרניטין → CPT-1 → Acyl-carnitine → CACT → CPT-2 → Acyl-CoA' },
      note: { en: 'Required for long-chain FAs (>12C). CPT-1 is RATE-LIMITING and inhibited by malonyl-CoA (reciprocal regulation with FA synthesis).', he: 'דרוש לשרשראות ארוכות. CPT-1 מגביל־קצב, מעוכב ע"י מלוניל-CoA.' }
    },
    {
      name: 'Acetyl-CoA → TCA Cycle',
      he: 'אצטיל-CoA → TCA',
      fromStep: 4, fromMolecule: 'acetylCoA',
      toCycle: 'TCA',
      path: { en: 'Acetyl-CoA + OAA → Citrate (CS) → TCA → ~10 ATP per Acetyl-CoA', he: 'אצטיל-CoA + OAA → ציטראט → TCA → ~10 ATP' },
      note: { en: 'Main energy payoff. Requires OAA availability — if OAA is low (carbohydrate restriction), acetyl-CoA diverts to ketogenesis.', he: 'התגמול האנרגטי העיקרי. דורש OAA. אם OAA נמוך — קטוגנזה.' }
    },
    {
      name: 'Acetyl-CoA → Ketogenesis (fasting)',
      he: 'אצטיל-CoA → קטוגנזה (צום)',
      fromStep: 4, fromMolecule: 'acetylCoA',
      toCycle: 'Ketogenesis',
      path: { en: 'Acetyl-CoA × 2 → Acetoacetyl-CoA → HMG-CoA → Acetoacetate → β-hydroxybutyrate (+ acetone). In liver mitochondria only.', he: 'אצטיל-CoA × 2 → אצטואצטיל-CoA → HMG-CoA → אצטואצטט → β-הידרוקסיבוטיראט' },
      note: { en: 'During prolonged fasting, liver overflows with acetyl-CoA from β-oxidation but OAA is used for gluconeogenesis → acetyl-CoA diverted to ketones. Brain uses ketones after ~3 days fasting.', he: 'בצום ממושך, OAA לגלוקונאוגנזה → אצטיל-CoA עובר לקטונים. מוח משתמש אחרי ~3 ימים.' }
    },
    {
      name: 'FADH₂ & NADH → ETC',
      he: 'FADH₂ ו-NADH → ETC',
      toCycle: 'Electron Transport Chain',
      path: { en: 'FADH₂ → Complex II/ETF (~1.5 ATP). NADH → Complex I (~2.5 ATP). Per turn: 4 ATP.', he: 'FADH₂ → קומפלקס II (~1.5 ATP). NADH → קומפלקס I (~2.5 ATP).' },
      note: { en: 'Each turn yields 4 ATP from reduced cofactors + 10 from acetyl-CoA TCA = 14 ATP per 2C removed.', he: 'כל סיבוב: 4 ATP מהקופקטורים + 10 מ-TCA = 14 ATP.' }
    },
    {
      name: 'Reciprocal regulation with FA Synthesis',
      he: 'ויסות הדדי עם סינתזת שומן',
      toCycle: 'Fatty Acid Synthesis',
      path: { en: 'Malonyl-CoA (1st product of FAS) → inhibits CPT-1 → blocks β-oxidation. Prevents futile cycling.', he: 'מלוניל-CoA (תוצר ראשון של סינתזה) מעכב CPT-1 → חוסם β-אוקסידציה.' },
      note: { en: 'This is the central control that determines whether cells burn or store fat. Insulin activates FAS → malonyl-CoA ↑ → β-oxidation off.', he: 'הבקרה המרכזית לשריפה או איחסון. אינסולין → מלוניל-CoA → β-אוקסידציה דלוקה.' }
    }
  ],

  bigPicture: {
    en: [
      { k: 'Repeating 4 steps', v: 'Oxidation (FAD) → Hydration (H₂O) → Oxidation (NAD⁺) → Thiolysis (CoA)' },
      { k: 'Per turn yield', v: '1 Acetyl-CoA + 1 FADH₂ + 1 NADH (chain shortens by 2 carbons)' },
      { k: 'Palmitate (C16) full oxidation', v: '7 turns → 8 Acetyl-CoA + 7 FADH₂ + 7 NADH → ~106 ATP (minus 2 ATP for activation = ~104 net)' },
      { k: 'Rate-limiting step', v: 'CPT-1 (carnitine shuttle, NOT any β-oxidation enzyme itself)' },
      { k: 'Key regulator', v: 'Malonyl-CoA inhibits CPT-1 → reciprocal with FA synthesis' },
      { k: 'Activation cost', v: 'FA → Acyl-CoA: costs 1 ATP → AMP + PPi (= 2 ATP equivalents). One-time.' },
      { k: 'Carnitine shuttle', v: 'Required for long-chain (>12C) FAs. CPT-1 (outer) → CACT → CPT-2 (inner).' },
      { k: 'Acyl-CoA DH isozymes', v: 'VLCAD, LCAD, MCAD, SCAD — different chain lengths. MCAD deficiency = MOST COMMON FAO disorder.' },
      { k: 'Odd-chain FAs', v: 'Final round gives propionyl-CoA (3C) → succinyl-CoA (via B12-dependent methylmalonyl-CoA mutase) → TCA' },
      { k: 'Unsaturated FAs', v: 'Need extra enzymes: enoyl-CoA isomerase (cis→trans) and 2,4-dienoyl-CoA reductase' },
      { k: 'NOT in', v: 'Brain (no FA transport across BBB — uses glucose or ketones), RBCs (no mitochondria)' },
      { k: 'Clinical common finding', v: 'Hypoketotic hypoglycemia during fasting = classic FA oxidation defect signature' },
      { k: 'Treatment principle', v: 'Avoid fasting + provide alternative fuel (carbs, MCT oil bypasses long-chain defects)' }
    ],
    he: [
      { k: '4 שלבים חוזרים', v: 'חמצון (FAD) → הידרציה → חמצון (NAD⁺) → תיוליזה' },
      { k: 'תשואה לסיבוב', v: 'אצטיל-CoA + FADH₂ + NADH' },
      { k: 'פלמיטט (C16) — חמצון מלא', v: '7 סיבובים → 8 אצטיל-CoA + 7 FADH₂ + 7 NADH → ~106 ATP' },
      { k: 'שלב מגביל־קצב', v: 'CPT-1 (לא אנזים של β-אוקסידציה עצמו)' },
      { k: 'ויסות מפתח', v: 'מלוניל-CoA מעכב CPT-1' },
      { k: 'עלות הפעלה', v: 'FA → Acyl-CoA: ATP → AMP + PPi (= 2 ATP).' },
      { k: 'מעבורת קרניטין', v: 'CPT-1 → CACT → CPT-2' },
      { k: 'איזוזימים', v: 'VLCAD, LCAD, MCAD, SCAD. חסר MCAD = הנפוץ ביותר.' },
      { k: 'שרשראות אי-זוגיות', v: 'נותנות פרופיוניל-CoA → סוקצינאציל-CoA (דורש B12)' },
      { k: 'רקמות שלא', v: 'מוח (אין FA ב-BBB), כדוריות אדומות' },
      { k: 'ממצא קליני קלאסי', v: 'היפוגליקמיה היפוקטוטית בצום' }
    ]
  },

  questions: [
    { id: 'box-q1', difficulty: 'easy', prompt: { en: 'Each turn of β-oxidation produces:', he: 'כל סיבוב של β-אוקסידציה מייצר:' }, correct: '1 Acetyl-CoA + 1 FADH₂ + 1 NADH', options: ['1 Acetyl-CoA + 1 FADH₂ + 1 NADH', '2 Acetyl-CoA + 1 FADH₂', '1 Acetyl-CoA + 2 NADH', '1 ATP + 1 FADH₂'] },
    { id: 'box-q2', difficulty: 'medium', prompt: { en: 'The rate-limiting step of β-oxidation is:', he: 'השלב המגביל־קצב של β-אוקסידציה:' }, correct: 'CPT-1 (carnitine shuttle)', options: ['CPT-1 (carnitine shuttle)', 'Acyl-CoA DH', 'Thiolase', 'Hydratase'] },
    { id: 'box-q3', difficulty: 'medium', prompt: { en: 'CPT-1 is inhibited by:', he: 'CPT-1 מעוכב ע"י:' }, correct: 'Malonyl-CoA', options: ['Malonyl-CoA', 'Acetyl-CoA', 'Citrate', 'NADH'] },
    { id: 'box-q4', difficulty: 'medium', prompt: { en: 'Palmitate (C16) full β-oxidation yields approximately:', he: 'חמצון מלא של פלמיטט נותן בערך:' }, correct: '~106 ATP', options: ['~106 ATP', '~32 ATP', '~60 ATP', '~150 ATP'] },
    { id: 'box-q5', difficulty: 'hard', prompt: { en: 'MCAD deficiency classically presents with:', he: 'חסר MCAD מציג קלאסית:' }, correct: 'Hypoketotic hypoglycemia during fasting', options: ['Hypoketotic hypoglycemia during fasting', 'Severe ketoacidosis', 'Cardiomyopathy at birth', 'Spastic diplegia'] },
    { id: 'box-q6', difficulty: 'hard', prompt: { en: 'Why don\'t brain cells use fatty acids for energy?', he: 'מדוע תאי מוח לא משתמשים ב-FA לאנרגיה?' }, correct: 'Fatty acids don\'t cross the blood-brain barrier', options: ['Fatty acids don\'t cross the blood-brain barrier', 'Brain has no mitochondria', 'Brain lacks β-oxidation enzymes', 'FA are too slow'] },
    { id: 'box-q7', difficulty: 'hard', prompt: { en: 'Odd-chain fatty acids generate ____ in the final round, which enters TCA via ____:', he: 'שרשראות אי-זוגיות מייצרות ____ שנכנס ל-TCA דרך:' }, correct: 'Propionyl-CoA; succinyl-CoA (via B12)', options: ['Propionyl-CoA; succinyl-CoA (via B12)', 'Acetyl-CoA; citrate', 'Lactate; pyruvate', 'Glycerol; fumarate'] },
    { id: 'box-q8', difficulty: 'medium', prompt: { en: 'What 2 TCA-related cofactors are made each cycle turn?', he: 'אילו 2 קופקטורים נוצרים לכל סיבוב?' }, correct: '1 FADH₂ + 1 NADH', options: ['1 FADH₂ + 1 NADH', '2 NADH', '2 FADH₂', '1 NADH + 1 GTP'] },
    { id: 'box-q9', difficulty: 'easy', prompt: { en: 'β-Oxidation occurs in:', he: 'β-אוקסידציה מתרחשת ב:' }, correct: 'Mitochondrial matrix', options: ['Mitochondrial matrix', 'Cytosol', 'Peroxisomes only', 'Endoplasmic reticulum'] },
    { id: 'box-q10', difficulty: 'medium', prompt: { en: 'How many ATP does FA activation cost?', he: 'כמה ATP עולה הפעלת FA?' }, correct: '2 (ATP → AMP + PPi)', options: ['2 (ATP → AMP + PPi)', '1', '4', '0'] },
    { id: 'box-q11', difficulty: 'hard', prompt: { en: 'LCHAD deficiency in fetus is associated with what maternal complication?', he: 'חסר LCHAD בעובר קשור לאיזו סיבוך אמהי?' }, correct: 'HELLP syndrome / AFLP', options: ['HELLP syndrome / AFLP', 'Gestational diabetes', 'Pre-eclampsia only', 'Placenta previa'] },
    { id: 'box-q12', difficulty: 'hard', prompt: { en: 'Which condition triggers ketogenesis from β-oxidation?', he: 'מה מעורר קטוגנזה מ-β-אוקסידציה?' }, correct: 'Prolonged fasting (OAA depleted for gluconeogenesis)', options: ['Prolonged fasting (OAA depleted for gluconeogenesis)', 'Fed state', 'High insulin', 'Exercise only'] }
  ]
};
