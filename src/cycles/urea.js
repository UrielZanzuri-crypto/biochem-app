// ============================================================
// UREA CYCLE — v0.3 comprehensive schema
// All layers: structures (SMILES), stoichiometry, cofactors,
// regulation, integration, tissue context
// ============================================================

// SMILES for every molecule in the cycle
const SMILES = {
  // Nitrogen sources / small molecules
  ammonium:      'N',
  bicarbonate:   'OC(=O)[O-]',
  water:         'O',
  urea:          'NC(N)=O',
  // Nucleotides
  atp:           'Nc1ncnc2n(cnc12)C3OC(COP(O)(=O)OP(O)(=O)OP(O)(=O)O)C(O)C3O',
  adp:           'Nc1ncnc2n(cnc12)C3OC(COP(O)(=O)OP(O)(=O)O)C(O)C3O',
  amp:           'Nc1ncnc2n(cnc12)C3OC(COP(O)(=O)O)C(O)C3O',
  pi:            'OP(O)(O)=O',
  ppi:           'OP(O)(=O)OP(O)(O)=O',
  // Urea-cycle intermediates
  carbamoylP:    'NC(=O)OP(O)(O)=O',
  ornithine:     'NCCCC(N)C(=O)O',
  citrulline:    'NC(=O)NCCCC(N)C(=O)O',
  aspartate:     'OC(=O)CC(N)C(=O)O',
  argininosucc:  'OC(=O)CC(NC(=N)NCCCC(N)C(=O)O)C(=O)O',
  arginine:      'N=C(N)NCCCC(N)C(=O)O',
  fumarate:      'OC(=O)/C=C/C(=O)O',
  // Regulator
  nag:           'CC(=O)NC(CCC(=O)O)C(=O)O'
};

export const ureaCycle = {
  id: 'urea',
  chapter: 'Amino Acid Oxidation and the Production of Urea',
  chapterOrder: 5,
  order: 1,
  title: { en: 'The Urea Cycle', he: 'מעגל האוריאה' },
  subtitle: { en: 'Hepatic disposal of ammonia nitrogen', he: 'סילוק חנקן אמוניה בכבד' },

  // ============================================================
  // TISSUE & METABOLIC STATE CONTEXT
  // ============================================================
  context: {
    tissue: { en: 'Liver (hepatocytes)', he: 'כבד (הפטוציטים)' },
    otherTissues: { en: 'Minor activity in kidney, small intestine', he: 'פעילות משנית בכליה ובמעי דק' },
    state: { en: 'Active during protein catabolism, fasting, high-protein diet', he: 'פעיל בפירוק חלבון, צום, דיאטה עתירת חלבון' },
    stateHormonal: { en: 'Glucagon ↑ induces enzymes; insulin ↓ suppresses', he: 'גלוקגון מעלה; אינסולין מדכא' },
    turnover: { en: 'Enzyme levels adapt over hours-days to protein intake', he: 'רמות אנזימים מסתגלות לאורך שעות־ימים לצריכת חלבון' }
  },

  overview: {
    en: `The urea cycle disposes of ammonia (NH₄⁺) — a neurotoxic product of amino acid catabolism — by converting it into water-soluble urea for renal excretion. It is unique to the liver, spans mitochondrial matrix and cytosol, costs the equivalent of 4 ATP per urea, and integrates tightly with the TCA cycle via the aspartate-argininosuccinate shunt. Two nitrogen atoms enter urea: one as free NH₄⁺ (largely from glutamate dehydrogenase), the second from aspartate (transaminated from glutamate). Total stoichiometry: 2 NH₄⁺ + HCO₃⁻ + 3 ATP + Asp + 2 H₂O → Urea + 2 ADP + 2 Pi + AMP + PPi + Fumarate.`,
    he: `מעגל האוריאה מסלק אמוניה (NH₄⁺) — תוצר נוירוטוקסי של פירוק חומצות אמינו — על ידי המרתה לאוריאה מסיסה להפרשה כלייתית. ייחודי לכבד, פרוש על פני מטריקס מיטוכונדריאלי וציטוזול, עלותו כ־4 ATP לכל אוריאה, ומשולב הדוק עם מעגל קרבס דרך מעקף אספרטט־ארגינינוסוקצינט. שני אטומי חנקן נכנסים לאוריאה: אחד מ־NH₄⁺ חופשי (בעיקר מגלוטמט דהידרוגנאז), השני מאספרטט (מטרנסאמינציה מגלוטמט).`
  },

  // ============================================================
  // PEDAGOGY — How nitrogen gets to the urea cycle from amino acid breakdown.
  // ============================================================
  pedagogy: [
    {
      title: 'How nitrogen reaches the urea cycle — Step 1: Transamination',
      icon: '🔁',
      body: `When the body breaks down protein, each amino acid carries an **α-amino group** that needs to be removed BEFORE the carbon skeleton can be used for energy or gluconeogenesis. The very first step is **transamination**:

   Amino Acid #1 (with -NH₃⁺) + α-Ketoglutarate → α-Keto Acid (no -NH₃⁺) + **Glutamate**

The amino group is moved from the amino acid onto α-ketoglutarate, producing **glutamate**. The amino acid itself becomes a keto acid (which can now enter glycolysis, TCA, ketogenesis, etc.).

**Key transaminases (aminotransferases):**
• **AST (Aspartate Aminotransferase)** — moves NH₃⁺ between aspartate ↔ glutamate
• **ALT (Alanine Aminotransferase)** — moves NH₃⁺ between alanine ↔ glutamate
• Many others, each specific to a particular amino acid

**Critical cofactor — PLP (Pyridoxal Phosphate / Vitamin B6):**
Every transaminase REQUIRES PLP as a cofactor. PLP forms a transient **Schiff base** with the amino group during transfer (it acts like a "molecular shuttle" for the -NH₃⁺). Without PLP, no transamination → no nitrogen flow to urea cycle.

• **B6 deficiency** → impaired AA catabolism, sideroblastic anemia (PLP also needed for heme synthesis), peripheral neuropathy, seizures (PLP needed for GABA synthesis)
• **Isoniazid (TB drug)** depletes B6 → must co-administer B6 to prevent neuropathy
• AST and ALT are **standard liver function tests** because their release into blood signals hepatocyte damage

**The funnel principle:** Most amino groups DON\'T go directly to the urea cycle. They\'re first concentrated onto glutamate (the "central nitrogen currency"). This way the cell only needs ONE machine to release free ammonia — see step 2.`
    },
    {
      title: 'How nitrogen reaches the urea cycle — Step 2: Oxidative deamination',
      icon: '💧',
      body: `After many transaminations, glutamate has accumulated all the nitrogen from various amino acids. Now **glutamate dehydrogenase (GDH)** in the mitochondrial matrix releases it as free ammonia — the only enzyme capable of this:

   Glutamate + NAD(P)⁺ + H₂O → α-Ketoglutarate + **NH₄⁺** + NAD(P)H

This is **oxidative deamination** — unlike transamination, the nitrogen actually leaves as a free ion. Two key features:

• **Reversible:** GDH can run forward (releasing NH₄⁺) or reverse (fixing NH₄⁺ onto α-KG to MAKE glutamate). The direction depends on metabolic state.

• **Uses NAD⁺ OR NADP⁺:** This is unusual — most enzymes prefer one. GDH uses NAD⁺ when the cell needs to RELEASE ammonia (high protein meal, fasting). It uses NADPH when fixing ammonia (anabolic state).

• **Allosteric regulation:** ADP/GDP activate (low energy → break down protein for fuel). ATP/GTP inhibit (high energy → don\'t deaminate). Steroid hormones can promote.

**The full picture:**

   AA₁ + α-KG ─┐ (AST)
   AA₂ + α-KG ─┼─→ all collected as Glutamate ─┐
   AA₃ + α-KG ─┘ (ALT, etc.)                     │
                                                 ↓ GDH (in mitochondrion)
                                          α-KG + **NH₄⁺**
                                                 │
                                                 ↓ enters urea cycle
                                       (Step 1: CPS-I + HCO₃⁻ + 2 ATP)

**Genetic GDH gain-of-function** (HHS — Hyperinsulinism-Hyperammonemia Syndrome): GDH never gets turned off → constant ammonia release + constant α-KG drain → hyperammonemia + hypoglycemia (mechanism unclear for the hypoglycemia, possibly via insulin secretion).`
    },
    {
      title: 'The second nitrogen — Aspartate (not free ammonia!)',
      icon: '2️⃣',
      body: `Each urea molecule has **TWO nitrogen atoms**. Where does each one come from?

**Nitrogen #1:** Free NH₄⁺, fixed by **CPS-I** in mitochondrial matrix (rate-limiting step, needs 2 ATP and N-acetylglutamate as obligate activator). This becomes carbamoyl phosphate, then citrulline, then exits to cytosol.

**Nitrogen #2:** Comes from **aspartate**, NOT free ammonia. Aspartate is made in the mitochondrion from oxaloacetate via AST (using glutamate). So nitrogen #2 also originally came from glutamate, just funneled through aspartate.

The cytosolic urea cycle steps then "merge" the aspartate nitrogen with citrulline:
• Argininosuccinate Synthetase: Citrulline + Aspartate + ATP → Argininosuccinate
• Argininosuccinate Lyase: Argininosuccinate → Arginine + **Fumarate** (the carbon skeleton of aspartate is liberated as fumarate)

**The aspartate-argininosuccinate shunt:**
The fumarate released here is the same fumarate from TCA. It re-enters TCA → malate → OAA → re-transaminated to aspartate → ready for next cycle. This means **the urea cycle and TCA are tightly linked**. A defect in either disrupts the other.

**Why two N-sources?** Because the cell can convert MANY different amino-acid nitrogens into glutamate via transamination, but only some of that glutamate is deaminated to NH₄⁺ — the rest stays as glutamate or is shuttled to aspartate. Both routes deliver nitrogen to urea, just through different doors.`
    },
    {
      title: 'Hyperammonemia — Why high ammonia is so dangerous',
      icon: '⚠️',
      body: `Free ammonia is **acutely neurotoxic** at concentrations >100 μM (normal <35 μM). Why?

**Mechanism #1 — TCA depletion:** Ammonia enters astrocytes → glutamine synthetase combines NH₄⁺ with glutamate → glutamine. As glutamate is consumed, the brain runs out of α-KG (its precursor) → TCA stalls → energy crisis.

**Mechanism #2 — Cerebral edema:** Glutamine accumulation in astrocytes draws in water osmotically → astrocyte swelling → increased ICP → seizures, coma.

**Mechanism #3 — Excitotoxicity:** Disrupted glutamate signaling → NMDA over-activation.

**Causes of hyperammonemia:**
• **Inherited urea cycle defects** — OTC deficiency (X-linked, most common), CPS-I, ASL, ASS1. Present in newborns or after high-protein challenge.
• **Liver failure** — hepatic encephalopathy (ammonia made by gut bacteria can\'t be cleared).
• **Reye syndrome** — aspirin in viral illness in children → mitochondrial damage → urea cycle failure.
• **Valproate** — depletes carnitine and inhibits CPS-I.

**Treatments:**
• **Lactulose** (oral) — acidifies gut, traps NH₄⁺
• **Rifaximin** — kills urea-producing gut flora
• **Sodium benzoate / phenylbutyrate** — covalently bind glycine/glutamine, excreted in urine, alternative N-disposal route
• **Hemodialysis** in severe cases
• Restrict protein, give arginine (essential when urea cycle is impaired upstream of arginine)`
    }
  ],

  storyFrame: {
    en: {
      title: 'The Liver Detox Factory',
      setting: 'A factory with two rooms separated by a wavy membrane. Dangerous ammonia arrives at the inner room. Five workers process it in sequence, each with a distinct job. The empty carrier shuttles between rooms forever.',
      characters: [
        { name: 'CPS-I', role: 'The Gatekeeper', icon: '🔐', color: '#f59e0b' },
        { name: 'OTC', role: 'The Matchmaker', icon: '💍', color: '#f97316' },
        { name: 'ASS', role: 'The Welder', icon: '⚡', color: '#3b82f6' },
        { name: 'ASL', role: 'The Splitter', icon: '✂️', color: '#8b5cf6' },
        { name: 'Arginase', role: 'The Delivery Agent', icon: '📦', color: '#10b981' }
      ]
    },
    he: {
      title: 'מפעל הניקוי של הכבד',
      setting: 'מפעל עם שני חדרים המופרדים על־ידי קרום גלי. אמוניה מסוכנת מגיעה לחדר הפנימי. חמישה עובדים מעבדים אותה ברצף, כל אחד עם תפקיד מובהק.',
      characters: [
        { name: 'CPS-I', role: 'שומר הסף', icon: '🔐', color: '#f59e0b' },
        { name: 'OTC', role: 'השדכן', icon: '💍', color: '#f97316' },
        { name: 'ASS', role: 'הרַתָּך', icon: '⚡', color: '#3b82f6' },
        { name: 'ASL', role: 'המפצל', icon: '✂️', color: '#8b5cf6' },
        { name: 'Arginase', role: 'שליח המסירה', icon: '📦', color: '#10b981' }
      ]
    }
  },

  mnemonic: {
    en: { phrase: 'Ordinarily, Careless Crappers Are Also Frivolous About Urination', breakdown: 'Ornithine · Carbamoyl-P · Citrulline · Aspartate · Argininosuccinate · Fumarate · Arginine · Urea' },
    he: { phrase: 'או־קָ־צִי־אַ־אַר־פוּ־אַר־אוּ', breakdown: 'אורניתין · קרבמואיל-P · ציטרולין · אספרטט · ארגינינוסוקצינט · פומרט · ארגינין · אוריאה' }
  },

  compartments: {
    mito: { en: 'Mitochondrial Matrix', he: 'מטריקס מיטוכונדריאלי', color: '#fef3c7', accent: '#f59e0b' },
    cyto: { en: 'Cytosol', he: 'ציטוזול', color: '#dbeafe', accent: '#3b82f6' }
  },

  // ============================================================
  // MEMBRANE TRANSPORTERS
  // ============================================================
  transporters: [
    {
      id: 'orn-cit',
      name: 'Ornithine/Citrulline Antiporter',
      he: 'אנטיפורטר אורניתין/ציטרולין',
      imports: 'ornithine',
      exports: 'citrulline',
      note: { en: 'SLC25A15 (ORNT1). Defect causes HHH syndrome: Hyperornithinemia, Hyperammonemia, Homocitrullinuria.', he: 'SLC25A15 (ORNT1). פגם גורם לתסמונת HHH.' }
    }
  ],

  // ============================================================
  // STEPS
  // ============================================================
  steps: [
    {
      id: 1,
      compartment: 'mito',
      angle: -90,
      enzyme: {
        abbr: 'CPS-I',
        name: 'Carbamoyl Phosphate Synthetase I',
        ec: '6.3.4.16',
        class: 'Ligase',
        he: 'קרבמואיל פוספט סינתטאז I'
      },
      substrates: [
        { key: 'ammonium', name: 'NH₄⁺', smiles: SMILES.ammonium, label: { en: 'Ammonium (1st N)', he: 'אמוניום (חנקן #1)' }, isSource: true, stoich: 1 },
        { key: 'bicarbonate', name: 'HCO₃⁻', smiles: SMILES.bicarbonate, label: { en: 'Bicarbonate', he: 'ביקרבונט' }, stoich: 1 }
      ],
      cofactors: [
        { key: 'atp', name: '2 ATP', smiles: SMILES.atp, stoich: 2, role: 'consumed' },
        { key: 'adp', name: '2 ADP', smiles: SMILES.adp, stoich: 2, role: 'produced' },
        { key: 'pi', name: 'Pi', smiles: SMILES.pi, stoich: 1, role: 'produced' }
      ],
      products: [
        { key: 'carbamoylP', name: 'Carbamoyl-P', smiles: SMILES.carbamoylP, label: { en: 'Carbamoyl Phosphate', he: 'קרבמואיל פוספט' }, isMain: true, stoich: 1 }
      ],
      deltaG: '−70 kJ/mol',
      reversible: false,
      regulation: {
        activators: [
          { name: 'N-Acetylglutamate (NAG)', he: 'N־אצטילגלוטמט', type: 'allosteric', critical: true, note: { en: 'Absolute requirement — CPS-I has no activity without NAG.', he: 'דרישה מוחלטת — CPS-I לא פעיל ללא NAG.' } }
        ],
        inhibitors: [],
        summary: { en: 'RATE-LIMITING. Activated only by NAG, which is synthesized by NAG synthase (NAGS) when arginine levels are high (signals protein catabolism).', he: 'שלב מגביל־קצב. מופעל רק ע"י NAG, המסונתז ע"י NAGS כאשר רמות ארגינין גבוהות.' }
      },
      story: {
        en: "THE GATEKEEPER locks ammonia into the cycle using two ATP keys. Once the lock clicks, there's no going back — this step is irreversible. His supervisor NAG only hands over the keys when dietary protein is flooding the liver (arginine rising).",
        he: 'שומר הסף נועל את האמוניה במעגל באמצעות שני מפתחות ATP. ברגע שהמנעול ננעל — אין חזרה. המפקח NAG מוסר את המפתחות רק כשחלבון מציף את הכבד.'
      },
      clinical: {
        disorder: 'CPS-I Deficiency',
        he: 'חסר CPS-I',
        inheritance: 'Autosomal recessive',
        findings: {
          en: 'Severe hyperammonemia in first 24-72h of life. Low plasma citrulline + low BUN + normal orotic acid. Distinguishable from OTC deficiency by normal orotic acid.',
          he: 'היפראמונמיה חמורה ב-24-72 שעות ראשונות. ציטרולין נמוך + BUN נמוך + אורוטית תקין. מבחין מ־OTC ע"י אורוטית תקין.'
        },
        treatment: { en: 'Protein restriction, sodium benzoate + phenylbutyrate (NH₃ scavengers), arginine supplementation.', he: 'הגבלת חלבון, סודיום בנזואט + פניל-בוטיראט, תוסף ארגינין.' }
      },
      beats: {
        en: [
          { t: 0, text: 'Toxic ammonia arrives in the matrix.', highlight: 'substrate' },
          { t: 2500, text: 'Bicarbonate joins it. CPS-I seizes both.', highlight: 'enzyme' },
          { t: 5000, text: 'Two ATP are burned — the irreversible double-lock.', highlight: 'energy' },
          { t: 7500, text: 'Carbamoyl Phosphate emerges, safely contained.', highlight: 'product' }
        ],
        he: [
          { t: 0, text: 'אמוניה רעילה מגיעה למטריקס.', highlight: 'substrate' },
          { t: 2500, text: 'ביקרבונט מצטרף. CPS-I תופס את שניהם.', highlight: 'enzyme' },
          { t: 5000, text: 'שני ATP נשרפים — המנעול הכפול הבלתי־הפיך.', highlight: 'energy' },
          { t: 7500, text: 'קרבמואיל־פוספט נוצר, כלוא בבטחה.', highlight: 'product' }
        ]
      }
    },
    {
      id: 2,
      compartment: 'mito',
      angle: -18,
      enzyme: {
        abbr: 'OTC',
        name: 'Ornithine Transcarbamoylase',
        ec: '2.1.3.3',
        class: 'Transferase',
        he: 'אורניתין טרנסקרבמואילאז'
      },
      substrates: [
        { key: 'carbamoylP', name: 'Carbamoyl-P', smiles: SMILES.carbamoylP, stoich: 1 },
        { key: 'ornithine', name: 'Ornithine', smiles: SMILES.ornithine, label: { en: 'Ornithine (imported)', he: 'אורניתין (יובא)' }, isCarrier: true, stoich: 1 }
      ],
      cofactors: [
        { key: 'pi', name: 'Pi', smiles: SMILES.pi, stoich: 1, role: 'produced' }
      ],
      products: [
        { key: 'citrulline', name: 'Citrulline', smiles: SMILES.citrulline, label: { en: 'Citrulline (exported)', he: 'ציטרולין (מיוצא)' }, isMain: true, exportsTo: 'cyto', stoich: 1 }
      ],
      deltaG: 'Highly favorable',
      reversible: false,
      regulation: {
        activators: [], inhibitors: [],
        summary: { en: 'Not regulated allosterically. Substrate availability drives flow.', he: 'לא מווסת אלוסטרית. זמינות מצע קובעת קצב.' }
      },
      story: {
        en: 'THE MATCHMAKER weds returning Ornithine to Carbamoyl Phosphate. Their child, Citrulline, is exported through the ornithine/citrulline antiporter to the cytosol.',
        he: 'השדכן משיא את אורניתין ששב לקרבמואיל־פוספט. צאצאם, ציטרולין, מיוצא לציטוזול דרך האנטיפורטר.'
      },
      clinical: {
        disorder: 'OTC Deficiency',
        he: 'חסר OTC',
        inheritance: 'X-linked',
        findings: {
          en: 'MOST COMMON urea cycle disorder. Hyperammonemia + ↑ orotic acid + ↑ uracil in urine (Carbamoyl-P spills into pyrimidine synthesis). Males severely affected; heterozygous females variable.',
          he: 'ההפרעה הנפוצה ביותר במעגל האוריאה. היפראמונמיה + אורוטית גבוה + אורציל בשתן. זכרים נפגעים קשות; הטרוזיגוטיות משתנה.'
        },
        treatment: { en: 'Low-protein diet, ammonia scavengers, citrulline supplement, liver transplant in severe cases.', he: 'דיאטה דלת חלבון, סופחי אמוניה, תוסף ציטרולין, השתלת כבד במקרים חמורים.' }
      },
      beats: {
        en: [
          { t: 0, text: 'Ornithine slides in from cytosol through the antiporter.', highlight: 'substrate' },
          { t: 2500, text: 'OTC joins it with Carbamoyl Phosphate.', highlight: 'enzyme' },
          { t: 5000, text: 'Citrulline exits to the cytosol.', highlight: 'product' }
        ],
        he: [
          { t: 0, text: 'אורניתין נכנס מהציטוזול דרך האנטיפורטר.', highlight: 'substrate' },
          { t: 2500, text: 'OTC מחבר אותו עם קרבמואיל־פוספט.', highlight: 'enzyme' },
          { t: 5000, text: 'ציטרולין יוצא לציטוזול.', highlight: 'product' }
        ]
      }
    },
    {
      id: 3,
      compartment: 'cyto',
      angle: 54,
      enzyme: {
        abbr: 'ASS',
        name: 'Argininosuccinate Synthetase',
        ec: '6.3.4.5',
        class: 'Ligase',
        he: 'ארגינינוסוקצינט סינתטאז'
      },
      substrates: [
        { key: 'citrulline', name: 'Citrulline', smiles: SMILES.citrulline, stoich: 1 },
        { key: 'aspartate', name: 'Aspartate', smiles: SMILES.aspartate, label: { en: 'Aspartate (2nd N)', he: 'אספרטט (חנקן #2)' }, isSource: true, stoich: 1 }
      ],
      cofactors: [
        { key: 'atp', name: 'ATP', smiles: SMILES.atp, stoich: 1, role: 'consumed' },
        { key: 'amp', name: 'AMP', smiles: SMILES.amp, stoich: 1, role: 'produced' },
        { key: 'ppi', name: 'PPi', smiles: SMILES.ppi, stoich: 1, role: 'produced', note: { en: 'Hydrolyzed to 2 Pi — pulls equilibrium forward (= 2 ATP equivalents total)', he: 'נהידרולז ל־2 Pi — מושך שיווי משקל קדימה (שווה ל־2 ATP)' } }
      ],
      products: [
        { key: 'argininosucc', name: 'Argininosuccinate', smiles: SMILES.argininosucc, isMain: true, stoich: 1 }
      ],
      deltaG: 'Highly favorable (PPi hydrolysis drives forward)',
      reversible: false,
      regulation: {
        activators: [], inhibitors: [],
        summary: { en: 'Rate-limiting in cytosol. Intermediate: Citrullyl-AMP (activated form).', he: 'מגביל־קצב בציטוזול. ביניים: Citrullyl-AMP.' }
      },
      story: {
        en: 'THE WELDER fuses Citrulline with Aspartate. Costs one ATP split all the way to AMP + PPi (two high-energy bonds). Aspartate smuggles in the second nitrogen.',
        he: 'הרַתָּך מאחה ציטרולין עם אספרטט. עולה ATP שנשבר עד AMP + PPi (שני קשרים עתירי אנרגיה). אספרטט מבריח פנימה את החנקן השני.'
      },
      clinical: {
        disorder: 'Citrullinemia Type I',
        he: 'ציטרולינמיה סוג I',
        inheritance: 'Autosomal recessive',
        findings: { en: 'Massively elevated plasma citrulline (pathognomonic). Hyperammonemia. Mildly elevated orotic acid.', he: 'ציטרולין מוגבר מאוד בדם (פתוגנומוני). היפראמונמיה.' },
        treatment: { en: 'Protein restriction, arginine supplement (regenerates ornithine), ammonia scavengers.', he: 'הגבלת חלבון, תוסף ארגינין, סופחי אמוניה.' }
      },
      beats: {
        en: [
          { t: 0, text: 'Citrulline emerges into the cytosol. Aspartate awaits.', highlight: 'substrate' },
          { t: 2500, text: 'ATP is spent — all the way to AMP.', highlight: 'energy' },
          { t: 5000, text: 'The Welder fuses them. The 2nd nitrogen is in.', highlight: 'enzyme' },
          { t: 7500, text: 'Argininosuccinate carries both nitrogens forward.', highlight: 'product' }
        ],
        he: [
          { t: 0, text: 'ציטרולין יוצא לציטוזול. אספרטט ממתין.', highlight: 'substrate' },
          { t: 2500, text: 'ATP מוצא — כל הדרך עד AMP.', highlight: 'energy' },
          { t: 5000, text: 'הרַתָּך מאחד אותם. החנקן השני בפנים.', highlight: 'enzyme' },
          { t: 7500, text: 'ארגינינוסוקצינט נושא שני החנקנים הלאה.', highlight: 'product' }
        ]
      }
    },
    {
      id: 4,
      compartment: 'cyto',
      angle: 126,
      enzyme: {
        abbr: 'ASL',
        name: 'Argininosuccinate Lyase',
        ec: '4.3.2.1',
        class: 'Lyase',
        he: 'ארגינינוסוקצינאז'
      },
      substrates: [
        { key: 'argininosucc', name: 'Argininosuccinate', smiles: SMILES.argininosucc, stoich: 1 }
      ],
      cofactors: [],
      products: [
        { key: 'arginine', name: 'Arginine', smiles: SMILES.arginine, label: { en: 'Arginine (keeps both N)', he: 'ארגינין (שומר 2 החנקנים)' }, isMain: true, stoich: 1 },
        { key: 'fumarate', name: 'Fumarate', smiles: SMILES.fumarate, label: { en: 'Fumarate → TCA', he: 'פומרט → קרבס' }, exportsTo: 'tca', stoich: 1 }
      ],
      deltaG: 'Near equilibrium (~0 kJ/mol)',
      reversible: true,
      regulation: {
        activators: [], inhibitors: [],
        summary: { en: 'Not regulated. Critical link to TCA via fumarate (aspartate-argininosuccinate shunt).', he: 'לא מווסת. חיבור קריטי ל־TCA דרך פומרט.' }
      },
      story: {
        en: 'THE SPLITTER cleaves the molecule. Arginine keeps both nitrogens; Fumarate slips into the TCA cycle. Nitrogen disposal and energy metabolism hold hands.',
        he: 'המפצל חוצה את המולקולה. ארגינין שומר את 2 החנקנים; פומרט מחליק ל־TCA.'
      },
      clinical: {
        disorder: 'Argininosuccinic Aciduria',
        he: 'ארגינינוסוקציניק אצידוריה',
        inheritance: 'Autosomal recessive',
        findings: { en: 'Argininosuccinate elevated in blood/urine/CSF. Hyperammonemia. Trichorrhexis nodosa (brittle, fragile hair) — pathognomonic.', he: 'ארגינינוסוקצינט מוגבר. היפראמונמיה. טריכורקסיס נודוזה (שיער שביר) — פתוגנומוני.' },
        treatment: { en: 'Responds well to arginine supplementation (bypasses block, regenerates ornithine).', he: 'מגיב היטב לתוסף ארגינין.' }
      },
      beats: {
        en: [
          { t: 0, text: 'Argininosuccinate ready to split.', highlight: 'substrate' },
          { t: 2500, text: 'ASL cleaves — arginine keeps the nitrogens.', highlight: 'enzyme' },
          { t: 5000, text: 'Fumarate escapes to the TCA cycle.', highlight: 'product' }
        ],
        he: [
          { t: 0, text: 'ארגינינוסוקצינט מוכן להתפצל.', highlight: 'substrate' },
          { t: 2500, text: 'ASL חוצה — ארגינין שומר החנקנים.', highlight: 'enzyme' },
          { t: 5000, text: 'פומרט בורח ל־TCA.', highlight: 'product' }
        ]
      }
    },
    {
      id: 5,
      compartment: 'cyto',
      angle: 198,
      enzyme: {
        abbr: 'Arginase',
        name: 'Arginase 1',
        ec: '3.5.3.1',
        class: 'Hydrolase',
        he: 'ארגינאז 1'
      },
      substrates: [
        { key: 'arginine', name: 'Arginine', smiles: SMILES.arginine, stoich: 1 },
        { key: 'water', name: 'H₂O', smiles: SMILES.water, stoich: 1 }
      ],
      cofactors: [],
      products: [
        { key: 'urea', name: 'Urea', smiles: SMILES.urea, label: { en: 'Urea → kidneys', he: 'אוריאה → כליות' }, isMain: true, isFinal: true, stoich: 1 },
        { key: 'ornithine', name: 'Ornithine', smiles: SMILES.ornithine, label: { en: 'Ornithine (recycled)', he: 'אורניתין (ממוחזר)' }, isCarrier: true, exportsTo: 'mito', stoich: 1 }
      ],
      deltaG: 'Irreversible',
      reversible: false,
      regulation: {
        activators: [], inhibitors: [],
        summary: { en: 'Arginase 1 = liver, cytosolic. Arginase 2 = mitochondrial, non-hepatic (prolines, polyamines).', he: 'ארגינאז 1 = כבד, ציטוזולי. ארגינאז 2 = מיטוכונדריאלי, חוץ־כבדי.' }
      },
      story: {
        en: 'THE DELIVERY AGENT splits arginine with water. Urea is handed to the blood; Ornithine rides the antiporter back to the mitochondrion — cycle resets.',
        he: 'שליח המסירה מפצל ארגינין במים. אוריאה נמסרת לדם; אורניתין חוזר למיטוכונדריה.'
      },
      clinical: {
        disorder: 'Arginase Deficiency (Argininemia)',
        he: 'חסר ארגינאז',
        inheritance: 'Autosomal recessive',
        findings: { en: 'UNIQUE: no acute neonatal hyperammonemia. Instead: progressive spastic diplegia, seizures, developmental delay. Arginine accumulates. Mildest of the 5 disorders clinically.', he: 'ייחודי: ללא היפראמונמיה ניאונטלית חריפה. במקום: ספסטיק דיפלגיה מתקדמת, פרכוסים. הקל ביותר מבין 5 החסרים.' },
        treatment: { en: 'Low-protein + low-arginine diet. Ammonia scavengers during crises.', he: 'דיאטה דלת חלבון ודלת ארגינין. סופחי אמוניה במשברים.' }
      },
      beats: {
        en: [
          { t: 0, text: 'Arginine plus water — the final reaction.', highlight: 'substrate' },
          { t: 2500, text: 'The Delivery Agent splits them.', highlight: 'enzyme' },
          { t: 5000, text: 'Urea to the kidneys. Ornithine recycles home.', highlight: 'carrier' }
        ],
        he: [
          { t: 0, text: 'ארגינין ומים — התגובה האחרונה.', highlight: 'substrate' },
          { t: 2500, text: 'שליח המסירה מפצל אותם.', highlight: 'enzyme' },
          { t: 5000, text: 'אוריאה לכליות. אורניתין ממוחזר הביתה.', highlight: 'carrier' }
        ]
      }
    }
  ],

  intermediates: [
    { id: 'ornithine', afterStep: 5, beforeStep: 1, name: 'Ornithine', he: 'אורניתין', smiles: SMILES.ornithine, carrier: true, crossesMembrane: true },
    { id: 'carbamoylP', afterStep: 1, beforeStep: 2, name: 'Carbamoyl-P', he: 'קרבמואיל-P', smiles: SMILES.carbamoylP },
    { id: 'citrulline', afterStep: 2, beforeStep: 3, name: 'Citrulline', he: 'ציטרולין', smiles: SMILES.citrulline, crossesMembrane: true },
    { id: 'argininosucc', afterStep: 3, beforeStep: 4, name: 'Argininosuccinate', he: 'ארגינינוסוקצינט', smiles: SMILES.argininosucc },
    { id: 'arginine', afterStep: 4, beforeStep: 5, name: 'Arginine', he: 'ארגינין', smiles: SMILES.arginine }
  ],

  // ============================================================
  // INTEGRATION with other pathways
  // ============================================================
  integrations: [
    {
      name: 'Aspartate-Argininosuccinate Shunt',
      he: 'מעקף אספרטט־ארגינינוסוקצינט',
      fromStep: 4, fromMolecule: 'fumarate',
      toCycle: 'TCA',
      path: { en: 'Fumarate → Malate (fumarase) → OAA (malate DH, +NADH) → Aspartate (transamination from glutamate)', he: 'פומרט → מלאט → OAA → אספרטט' },
      note: { en: 'Links urea disposal to energy production: each turn generates 1 NADH in TCA side.', he: 'מחבר סילוק חנקן לייצור אנרגיה.' }
    },
    {
      name: 'Nitrogen Delivery from Muscle',
      he: 'הובלת חנקן מהשריר',
      fromCycle: 'Glucose-Alanine Cycle',
      toStep: 1,
      path: { en: 'Muscle: AA → Alanine → blood → Liver: Alanine → Pyruvate + Glutamate → NH₄⁺ (GDH) → CPS-I', he: 'שריר: AA → אלנין → דם → כבד: אלנין → פירובט + גלוטמט → NH₄⁺' },
      note: { en: 'How nitrogen from peripheral tissues reaches the urea cycle.', he: 'כיצד חנקן מרקמות היקף מגיע למעגל האוריאה.' }
    },
    {
      name: 'Ornithine → Polyamines / Proline',
      he: 'אורניתין → פוליאמינים / פרולין',
      fromMolecule: 'ornithine',
      toCycle: 'Polyamine synthesis',
      path: { en: 'Ornithine decarboxylase → Putrescine → Spermidine → Spermine', he: 'אורניתין דקרבוקסילאז → פוטרסין → ספרמידין → ספרמין' },
      note: { en: 'Branch point — ornithine is also used for polyamine biosynthesis.', he: 'נקודת הסתעפות — אורניתין גם לייצור פוליאמינים.' }
    },
    {
      name: 'Arginine → Nitric Oxide',
      he: 'ארגינין → חנקן דו־חמצני',
      fromMolecule: 'arginine',
      toCycle: 'NO signaling',
      path: { en: 'Nitric oxide synthase (NOS) → NO + Citrulline. Citrulline can be recycled to arginine.', he: 'NOS → NO + ציטרולין. ציטרולין יכול לחזור לארגינין.' },
      note: { en: 'Arginine-citrulline cycle in vascular endothelium and immune cells.', he: 'מעגל ארגינין־ציטרולין באנדותל וכדוריות לבנות.' }
    }
  ],

  // ============================================================
  // BIG PICTURE
  // ============================================================
  bigPicture: {
    en: [
      { k: 'Overall equation', v: '2 NH₄⁺ + HCO₃⁻ + 3 ATP + Asp + 2 H₂O → Urea + 2 ADP + 2 Pi + AMP + PPi + Fumarate' },
      { k: 'Energy cost', v: '4 high-energy phosphate bonds per urea (3 ATP used, one goes ATP → AMP + PPi = 2 equivalents)' },
      { k: 'Energy recovery', v: 'Fumarate → TCA → ~2.5 ATP via NADH + ~1 ATP from substrate-level → net cost is much less than 4' },
      { k: 'N source #1', v: 'Free NH₄⁺ — mostly glutamate dehydrogenase (Glu → α-KG + NH₄⁺) in liver' },
      { k: 'N source #2', v: 'Aspartate amino group — transaminated from glutamate (AST: Glu + OAA → α-KG + Asp)' },
      { k: 'Rate-limiting step', v: 'CPS-I, allosterically activated by N-acetylglutamate' },
      { k: 'NAG synthase activator', v: 'Arginine (feed-forward: ↑Arg signals ↑protein catabolism → activate cycle)' },
      { k: 'Long-term regulation', v: 'Enzyme induction by glucagon, glucocorticoids, high-protein diet (hours-days)' },
      { k: 'Compartments', v: 'Steps 1-2 mitochondrial matrix · Steps 3-5 cytosol · Ornithine/Citrulline antiporter' },
      { k: 'Hyperammonemia Rx', v: 'Restrict protein · Na benzoate → hippurate · Na phenylbutyrate → phenylacetylglutamine · Arginine/citrulline supplements · Hemodialysis in crisis' },
      { k: 'Clinical pearl', v: 'Hyperammonemia + ↑orotic acid + normal BUN → OTC (X-linked, most common)' }
    ],
    he: [
      { k: 'משוואה כללית', v: '2 NH₄⁺ + HCO₃⁻ + 3 ATP + Asp + 2 H₂O → אוריאה + 2 ADP + 2 Pi + AMP + PPi + פומרט' },
      { k: 'עלות אנרגטית', v: '4 קשרי פוספט עתירי אנרגיה (3 ATP, אחד עד AMP + PPi = 2 שווי־ערך)' },
      { k: 'החזר אנרגטי', v: 'פומרט → TCA → ~2.5 ATP דרך NADH' },
      { k: 'מקור חנקן #1', v: 'NH₄⁺ חופשי — בעיקר מגלוטמט דהידרוגנאז' },
      { k: 'מקור חנקן #2', v: 'קבוצת אמינו של אספרטט' },
      { k: 'שלב מגביל־קצב', v: 'CPS-I, מופעל אלוסטרית ע"י NAG' },
      { k: 'אקטיבטור NAG סינתאז', v: 'ארגינין (הפעלה קדימה)' },
      { k: 'ויסות לטווח ארוך', v: 'אינדוקציה ע"י גלוקגון, גלוקוקורטיקואידים, דיאטה עתירת חלבון' },
      { k: 'תאיות', v: 'שלבים 1-2 מיטוכונדריה · 3-5 ציטוזול · אנטיפורטר אורניתין/ציטרולין' },
      { k: 'טיפול בהיפראמונמיה', v: 'הגבלת חלבון · Na benzoate · Na phenylbutyrate · תוספי ארגינין/ציטרולין' },
      { k: 'פנינה קלינית', v: 'היפראמונמיה + אורוטית גבוה + BUN תקין → OTC' }
    ]
  },

  questions: [
    { id: 'urea-q1', difficulty: 'easy', prompt: { en: 'The rate-limiting enzyme of the urea cycle is:', he: 'האנזים מגביל־הקצב במעגל האוריאה:' }, correct: 'CPS-I', options: ['CPS-I', 'OTC', 'ASS', 'Arginase'] },
    { id: 'urea-q2', difficulty: 'medium', prompt: { en: 'Hyperammonemia + ↑orotic acid + normal BUN suggests:', he: 'היפראמונמיה + אורוטית מוגבר + BUN תקין מרמזים על:' }, correct: 'OTC deficiency', options: ['CPS-I deficiency', 'OTC deficiency', 'ASS deficiency', 'Arginase deficiency'] },
    { id: 'urea-q3', difficulty: 'easy', prompt: { en: 'The allosteric activator of CPS-I is:', he: 'האקטיבטור האלוסטרי של CPS-I:' }, correct: 'N-acetylglutamate', options: ['N-acetylglutamate', 'Citrate', 'AMP', 'Glutamate'] },
    { id: 'urea-q4', difficulty: 'medium', prompt: { en: 'Which molecule links urea cycle to TCA?', he: 'איזו מולקולה מחברת מעגל האוריאה ל־TCA?' }, correct: 'Fumarate', options: ['Fumarate', 'Citrate', 'Succinate', 'α-Ketoglutarate'] },
    { id: 'urea-q5', difficulty: 'hard', prompt: { en: 'The second nitrogen of urea originates from:', he: 'החנקן השני של אוריאה מקורו ב:' }, correct: 'Aspartate', options: ['Aspartate', 'Glutamate', 'Alanine', 'NH₄⁺'] },
    { id: 'urea-q6', difficulty: 'hard', prompt: { en: 'Child with progressive spastic diplegia, no neonatal hyperammonemia:', he: 'ילד עם ספסטיק דיפלגיה מתקדמת ללא היפראמונמיה ניאונטלית:' }, correct: 'Arginase deficiency', options: ['Arginase deficiency', 'OTC deficiency', 'CPS-I deficiency', 'Citrullinemia'] },
    { id: 'urea-q7', difficulty: 'medium', prompt: { en: 'Total high-energy bonds spent per urea:', he: 'סהכ קשרי אנרגיה עתירי־אנרגיה לאוריאה אחת:' }, correct: '4', options: ['4', '2', '6', '3'] },
    { id: 'urea-q8', difficulty: 'easy', prompt: { en: 'Which enzyme is mitochondrial?', he: 'איזה אנזים מיטוכונדריאלי?' }, correct: 'OTC', options: ['OTC', 'ASS', 'ASL', 'Arginase'] },
    { id: 'urea-q9', difficulty: 'hard', prompt: { en: 'The carrier shuttling between mitochondrion and cytosol:', he: 'הנשא הנע בין מיטוכונדריה לציטוזול:' }, correct: 'Ornithine', options: ['Ornithine', 'Citrulline', 'Arginine', 'Aspartate'] },
    { id: 'urea-q10', difficulty: 'medium', prompt: { en: 'Which urea cycle disorder is X-linked?', he: 'איזה חסר במעגל האוריאה X-linked?' }, correct: 'OTC deficiency', options: ['OTC deficiency', 'CPS-I deficiency', 'Citrullinemia', 'Arginase deficiency'] },
    { id: 'urea-q11', difficulty: 'medium', prompt: { en: 'Sodium benzoate treats hyperammonemia by:', he: 'סודיום בנזואט מטפל בהיפראמונמיה ע"י:' }, correct: 'Conjugating with glycine → hippurate (excreted)', options: ['Conjugating with glycine → hippurate (excreted)', 'Inhibiting CPS-I', 'Blocking gut bacteria NH₃ production', 'Activating arginase'] },
    { id: 'urea-q12', difficulty: 'hard', prompt: { en: 'Trichorrhexis nodosa is characteristic of:', he: 'טריכורקסיס נודוזה אופייני ל:' }, correct: 'Argininosuccinic aciduria (ASL deficiency)', options: ['Argininosuccinic aciduria (ASL deficiency)', 'OTC deficiency', 'Citrullinemia', 'Arginase deficiency'] }
  ]
};
