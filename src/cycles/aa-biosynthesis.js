// ============================================================
// AMINO ACID BIOSYNTHESIS — survey of the 6 precursor families
// Focus: which AAs are essential, which are made from what, key clinical
// ============================================================

const S = {
  alphaKG:    'OC(=O)C(=O)CCC(=O)O',
  glutamate:  'OC(=O)C(N)CCC(=O)O',
  glutamine:  'OC(=O)C(N)CCC(=O)N',
  oaa:        'OC(=O)CC(=O)C(=O)O',
  aspartate:  'OC(=O)C(N)CC(=O)O',
  asparagine: 'OC(=O)C(N)CC(=O)N',
  pyruvate:   'CC(=O)C(=O)O',
  alanine:    'CC(N)C(=O)O',
  g3p:        'O=CC(O)COP(O)(O)=O',
  pg3:        'OC(=O)C(O)COP(O)(O)=O',
  serine:     'OC(=O)C(N)CO',
  glycine:    'OC(=O)CN',
  cysteine:   'OC(=O)C(N)CS',
  proline:    'OC(=O)C1CCCN1',
  arginine:   'OC(=O)C(N)CCCNC(=N)N',
  phe:        'OC(=O)C(N)Cc1ccccc1',
  tyr:        'OC(=O)C(N)Cc1ccc(O)cc1',
  trp:        'OC(=O)C(N)Cc1c[nH]c2ccccc12',
  his:        'OC(=O)C(N)Cc1[nH]cnc1'
};

const noReg = { activators: [], inhibitors: [], summary: { en: 'End-product feedback inhibition is the dominant mode for each AA pathway.' } };

export const aaBiosynthCycle = {
  id: 'aa-bs',
  chapter: 'Biosynthesis of Amino Acids',
  chapterOrder: 8,
  order: 1,
  layout: 'network',
  title: { en: 'Amino Acid Biosynthesis', he: 'ביוסינתזת חומצות אמינו' },
  subtitle: { en: 'Six precursor families for 20 amino acids; 9 are essential', he: '6 משפחות מבשרים ל-20 חומצות אמינו' },

  context: {
    tissue: { en: 'Nonessential AA synthesis: most tissues (liver dominant for transamination). Essential AA synthesis: does NOT occur in humans — must come from diet.' },
    otherTissues: { en: 'Liver is the main site of integration with nitrogen metabolism (urea cycle).' },
    state: { en: 'Active in fed state (carbon skeletons from glucose metabolism abundant). In fasting, AAs are catabolized instead.' },
    stateHormonal: { en: 'Insulin stimulates AA uptake and protein synthesis. Glucagon/cortisol promote proteolysis and AA oxidation.' },
    turnover: { en: 'Fast: minute-to-minute transamination equilibria. Slow: transcriptional control of committed enzymes under dietary stress.' }
  },

  overview: {
    en: `Amino acid biosynthesis in humans covers only the 11 NONESSENTIAL amino acids — the other 9 must come from the diet (phenylalanine, valine, threonine, tryptophan, isoleucine, methionine, histidine, leucine, lysine — mnemonic: "PVT TIM HaLL"). The 20 AAs are built from just SIX PRECURSORS, each coming from central metabolism: (1) α-ketoglutarate → Glu, Gln, Pro, Arg. (2) Oxaloacetate → Asp, Asn, + (essential) Met/Thr/Lys/Ile. (3) Pyruvate → Ala, Val, Leu. (4) 3-Phosphoglycerate → Ser, Gly, Cys. (5) PEP + E4P → aromatic ring (Phe, Tyr, Trp — all essential except Tyr which is made from Phe). (6) Ribose-5-P → His. The core chemistry is TRANSAMINATION: aminotransferases (ALT, AST, etc.) swap an α-amino group from glutamate onto an α-keto acid backbone — glutamate is the universal amino donor. Glutamate dehydrogenase (GDH) fixes ammonia by reductively aminating α-KG → glutamate (the entry of inorganic N into organic metabolism). Clinically key: PKU (Phe→Tyr block), maple syrup urine disease (branched-chain AA catabolism), homocystinuria (Met pathway), alkaptonuria (Tyr catabolism).`
  },

  // ============================================================
  // NETWORK MAP — branching pathway from precursors to amino acids.
  // Each hub is a central metabolite. Each enzyme is the named reaction
  // that converts the hub's keto-acid skeleton into the amino acid.
  // Each end is the resulting amino acid. The `hint` on each enzyme is
  // a short pedagogical explanation suitable for medical students.
  // ============================================================
  network: {
    viewBox: [0, 0, 1200, 1100],
    hubs: [
      { id: 'akg',   label: 'α-Ketoglutarate', sublabel: 'TCA',          x: 130, y: 165, color: '#dc2626' },
      { id: 'oaa',   label: 'Oxaloacetate',    sublabel: 'TCA',          x: 130, y: 540, color: '#ea580c' },
      { id: 'pyr',   label: 'Pyruvate',        sublabel: 'glycolysis',   x: 130, y: 900, color: '#f59e0b' },
      { id: 'pg3',   label: '3-Phosphoglycerate', sublabel: 'glycolysis', x: 700, y: 165, color: '#65a30d' },
      { id: 'pep',   label: 'PEP + Erythrose-4-P', sublabel: 'glyc + PPP', x: 700, y: 540, color: '#059669' },
      { id: 'r5p',   label: 'Ribose-5-P',      sublabel: 'PPP',          x: 700, y: 900, color: '#2563eb' }
    ],
    enzymes: [
      // α-KG family (4 branches, top-left)
      { id: 'gdh',         fromHubId: 'akg', label: 'GDH',
        fullName: 'Glutamate Dehydrogenase',
        hint: { en: 'GDH grabs free ammonia (NH₄⁺) and slaps it onto α-ketoglutarate to make glutamate. This is how inorganic nitrogen enters organic metabolism — NH₄⁺ + α-KG + NADPH → Glu + NADP⁺ + H₂O. Glutamate is then the central "amino donor" for everything else.' } },
      { id: 'gluSyn',      fromHubId: 'akg', label: 'Gln Synthetase',
        fullName: 'Glutamine Synthetase',
        hint: { en: 'Adds a SECOND amine to glutamate, this time at the side-chain carboxyl. Costs 1 ATP. Glutamine is the body\'s safe non-toxic carrier for ammonia in the blood (high NH₃ → encephalopathy).' } },
      { id: 'proSyn',      fromHubId: 'akg', label: 'P5C synthase',
        fullName: 'Δ¹-pyrroline-5-carboxylate synthase',
        hint: { en: 'Cyclizes glutamate into the proline ring. Cost: 1 ATP + 1 NADPH. Proline is unique — its amine is part of a ring, breaking α-helices in proteins.' } },
      { id: 'argSyn',      fromHubId: 'akg', label: 'Urea cycle',
        fullName: 'Arginine via the urea cycle',
        hint: { en: 'Arginine is BOTH a urea-cycle intermediate AND a proteinogenic amino acid. The urea cycle "leaks" arginine for protein synthesis. Conditionally essential in children (their demand outpaces urea-cycle output).' } },
      // OAA family (3 branches, mid-left)
      { id: 'ast',         fromHubId: 'oaa', label: 'AST',
        fullName: 'Aspartate Aminotransferase',
        hint: { en: 'AST transfers an amino group from glutamate to oxaloacetate, turning it into aspartate. This is a transamination — the keto group of OAA gets the amine, glutamate becomes α-KG. Cofactor: PLP (vitamin B6). Clinical: AST elevation marks liver/heart damage.' } },
      { id: 'asnSyn',      fromHubId: 'oaa', label: 'Asn Synthetase',
        fullName: 'Asparagine Synthetase',
        hint: { en: 'Adds an amide to aspartate using glutamine as the N-source (and ATP). Asparagine is critical in cancer therapy: ALL leukemia cells lack this enzyme — give L-asparaginase drug, they starve while normal cells make their own.' } },
      { id: 'metPath',     fromHubId: 'oaa', label: 'Met pathway',
        fullName: 'Methionine pathway (essential)',
        hint: { en: 'Methionine and threonine come from aspartate via several steps in PLANTS and MICROBES — but humans LACK this pathway. We cannot make methionine. Thus Met (and Thr, Lys, Ile from related branches) are ESSENTIAL.' } },
      // Pyruvate family (2 branches, lower-left)
      { id: 'alt',         fromHubId: 'pyr', label: 'ALT',
        fullName: 'Alanine Aminotransferase',
        hint: { en: 'ALT swaps an amine from glutamate onto pyruvate, giving alanine. Just like AST but with pyruvate as the recipient. Cofactor: PLP. ALT elevation is more liver-specific than AST. Used in the alanine cycle: muscle exports nitrogen as Ala to liver.' } },
      { id: 'bcaaPath',    fromHubId: 'pyr', label: 'BCAA pathway',
        fullName: 'Branched-chain amino acid pathway (essential)',
        hint: { en: 'Valine and leucine branch off pyruvate metabolism — but only in plants/microbes. In humans these are ESSENTIAL. Their breakdown failure causes Maple Syrup Urine Disease (sweet-smelling urine, lethal if untreated).' } },
      // 3-PG family (3 branches, top-right)
      { id: 'phgdh',       fromHubId: 'pg3', label: 'PHGDH',
        fullName: 'Phosphoglycerate Dehydrogenase',
        hint: { en: 'Strips a hydroxyl off 3-phosphoglycerate, then several steps yield serine. Serine\'s side-chain hydroxyl is a target for phosphorylation in signaling proteins (Ser/Thr kinases). Cancer cells often upregulate PHGDH for serine.' } },
      { id: 'shmt',        fromHubId: 'pg3', label: 'SHMT',
        fullName: 'Serine Hydroxymethyltransferase',
        hint: { en: 'Chops the hydroxymethyl group off serine, leaving glycine. The carbon goes onto tetrahydrofolate (THF) — this is the MAIN source of one-carbon units for nucleotide synthesis, methylation, etc.' } },
      { id: 'cbs',         fromHubId: 'pg3', label: 'CBS',
        fullName: 'Cystathionine β-Synthase',
        hint: { en: 'Cysteine sulfur comes from methionine (via homocysteine), but the carbon backbone comes from serine. CBS combines them into cystathionine (then split to cysteine). Needs B6. CBS deficiency = homocystinuria (lens dislocation, marfanoid).' } },
      // PEP+E4P family (2 branches, mid-right)
      { id: 'shikimate',   fromHubId: 'pep', label: 'Shikimate path',
        fullName: 'Shikimate pathway (plants/microbes only)',
        hint: { en: 'The shikimate pathway combines PEP + erythrose-4-P (from PPP) to build the AROMATIC RING. Plants and microbes only. Glyphosate (Roundup) kills plants by blocking this pathway — safe for humans because we don\'t have it. Phe and Trp are ESSENTIAL.' } },
      { id: 'pah',         fromHubId: 'pep', label: 'PAH',
        fullName: 'Phenylalanine Hydroxylase',
        hint: { en: 'PAH adds an -OH to phenylalanine\'s ring, making tyrosine. So Tyr is "conditionally essential" — only essential if PAH fails (PKU). Cofactor: BH₄ (tetrahydrobiopterin). PKU = newborn-screened, lifelong low-Phe diet.' } },
      // R5P family (1 branch, lower-right)
      { id: 'hisPath',     fromHubId: 'r5p', label: 'His pathway',
        fullName: 'Histidine pathway (essential)',
        hint: { en: 'Histidine is built from PRPP (from R5P) plus an N from ATP — only in plants/microbes. Humans cannot make it. ESSENTIAL in adults; conditionally essential in infants. Imidazole side chain → important for enzyme catalysis (acts as proton donor/acceptor at physiological pH).' } }
    ],
    ends: [
      // α-KG family — y=80, 160, 240, 320 (4 amino acids spaced 80 apart)
      { id: 'glu',  fromEnzymeId: 'gdh',     label: 'Glu', sublabel: 'Glutamate', x: 540, y: 50,  color: '#dc2626' },
      { id: 'gln',  fromEnzymeId: 'gluSyn',  label: 'Gln', sublabel: 'Glutamine', x: 540, y: 130, color: '#dc2626' },
      { id: 'pro',  fromEnzymeId: 'proSyn',  label: 'Pro', sublabel: 'Proline',   x: 540, y: 210, color: '#dc2626' },
      { id: 'arg',  fromEnzymeId: 'argSyn',  label: 'Arg', sublabel: 'Arginine',  x: 540, y: 290, color: '#dc2626' },
      // OAA family — y=460, 540, 620 (3 amino acids)
      { id: 'asp',  fromEnzymeId: 'ast',     label: 'Asp', sublabel: 'Aspartate', x: 540, y: 460, color: '#ea580c' },
      { id: 'asn',  fromEnzymeId: 'asnSyn',  label: 'Asn', sublabel: 'Asparagine', x: 540, y: 540, color: '#ea580c' },
      { id: 'met',  fromEnzymeId: 'metPath', label: 'Met', sublabel: 'Methionine', x: 540, y: 620, color: '#ea580c', essential: true },
      // Pyruvate family — y=860, 940 (2 amino acids)
      { id: 'ala',  fromEnzymeId: 'alt',      label: 'Ala', sublabel: 'Alanine',  x: 540, y: 860, color: '#f59e0b' },
      { id: 'val',  fromEnzymeId: 'bcaaPath', label: 'Val', sublabel: 'Valine',   x: 540, y: 940, color: '#f59e0b', essential: true },
      // 3-PG family — y=85, 165, 245 (3 amino acids)
      { id: 'ser',  fromEnzymeId: 'phgdh',   label: 'Ser', sublabel: 'Serine',    x: 1110, y: 85,  color: '#65a30d' },
      { id: 'gly',  fromEnzymeId: 'shmt',    label: 'Gly', sublabel: 'Glycine',   x: 1110, y: 165, color: '#65a30d' },
      { id: 'cys',  fromEnzymeId: 'cbs',     label: 'Cys', sublabel: 'Cysteine',  x: 1110, y: 245, color: '#65a30d' },
      // PEP/E4P family — y=500, 580 (2 amino acids)
      { id: 'phe',  fromEnzymeId: 'shikimate', label: 'Phe', sublabel: 'Phenylalanine', x: 1110, y: 500, color: '#059669', essential: true },
      { id: 'tyr',  fromEnzymeId: 'pah',     label: 'Tyr', sublabel: 'Tyrosine',  x: 1110, y: 580, color: '#059669' },
      // R5P family — y=900 (1 amino acid)
      { id: 'his',  fromEnzymeId: 'hisPath', label: 'His', sublabel: 'Histidine', x: 1110, y: 900, color: '#2563eb', essential: true }
    ]
  },

  storyFrame: {
    en: {
      title: 'The Six Tributaries',
      setting: 'Imagine central metabolism as a great river. Six tributaries branch off — each feeding a family of amino acids. Nitrogen enters as NH₄⁺ and is "grabbed" onto α-KG to form glutamate (the central nitrogen currency). From glutamate, nitrogen is "handed off" to keto acid skeletons via transamination. Some skeletons the cell can build itself (nonessential); others must arrive pre-made in food (essential — 9 of them).'
    }
  },

  mnemonic: {
    en: { phrase: 'Essential AAs: "PVT TIM HaLL" — Phe, Val, Thr, Trp, Ile, Met, His, Leu, Lys', breakdown: 'Tyrosine is CONDITIONALLY essential (made from Phe — if PKU, it becomes essential).' }
  },

  compartments: {
    cyto: { en: 'Cytosol / Mitochondria', he: 'ציטוזול / מיטוכונדריה', color: '#dbeafe', accent: '#3b82f6' }
  },

  steps: [
    {
      id: 1,
      compartment: 'cyto',
      angle: -90,
      enzyme: {
        abbr: 'GDH + AST',
        name: 'Glutamate Dehydrogenase + Aspartate Aminotransferase (entry of N)',
        ec: '1.4.1.3 / 2.6.1.1',
        class: 'Oxidoreductase / Transferase',
        he: ''
      },
      substrates: [
        { key: 'alphaKG', name: 'α-Ketoglutarate', smiles: S.alphaKG, isSource: true, stoich: 1 }
      ],
      cofactors: [
        { key: 'nh4', name: 'NH₄⁺', smiles: 'N', stoich: 1, role: 'consumed' },
        { key: 'nadph', name: 'NADPH', smiles: '', stoich: 1, role: 'consumed' }
      ],
      products: [
        { key: 'glutamate', name: 'Glutamate', smiles: S.glutamate, label: { en: 'Glutamate — "central N currency"' }, isMain: true, stoich: 1 },
        { key: 'glutamine', name: '→ Glutamine, Proline, Arginine', smiles: S.glutamine, stoich: 1 }
      ],
      deltaG: 'Reversible (GDH can run both ways)',
      reversible: true,
      regulation: {
        activators: [{ name: 'ADP/GDP', type: 'allosteric', note: { en: 'Low energy → catabolize AAs' } }],
        inhibitors: [{ name: 'ATP/GTP', type: 'allosteric', note: { en: 'High energy → make AAs' } }],
        summary: { en: 'α-KG FAMILY: GDH is the ONLY enzyme that can fix inorganic ammonia onto an α-keto acid using NADPH. The product glutamate is the universal amino donor. Glu → Gln (glutamine synthetase, uses ATP). Glu → Pro (via cyclization). Glu → Arg (requires urea cycle intermediates; see urea cycle).' }
      },
      story: { en: 'GDH fixes inorganic ammonia (NH₄⁺) onto α-KG to form GLUTAMATE — the central nitrogen hub. Once glutamate exists, its amino group can be passed to virtually any other keto acid via transamination. Glutamate also gives rise to glutamine (via glutamine synthetase, ATP), proline (cyclization), and arginine (multiple steps through the urea cycle precursors).' },
      clinical: null,
      beats: {
        en: [
          { t: 0, text: 'α-KG (TCA intermediate) accepts ammonia.', highlight: 'substrate' },
          { t: 2500, text: 'GDH reductively aminates: α-KG + NH₄⁺ + NADPH → glutamate.', highlight: 'enzyme' },
          { t: 5000, text: 'Glutamate serves as N donor for all transaminations.', highlight: 'product' }
        ]
      }
    },
    {
      id: 2,
      compartment: 'cyto',
      angle: -30,
      enzyme: {
        abbr: 'AST family',
        name: 'Aspartate Aminotransferase (AST/GOT)',
        ec: '2.6.1.1',
        class: 'Transferase',
        he: ''
      },
      substrates: [
        { key: 'oaa', name: 'Oxaloacetate', smiles: S.oaa, stoich: 1 },
        { key: 'glutamate', name: 'Glutamate (N donor)', smiles: S.glutamate, stoich: 1 }
      ],
      cofactors: [{ key: 'plp', name: 'PLP (B6)', smiles: '', stoich: 1, role: 'cofactor' }],
      products: [
        { key: 'aspartate', name: 'Aspartate', smiles: S.aspartate, isMain: true, stoich: 1 },
        { key: 'asparagine', name: '→ Asparagine (via Asn synthetase + Gln)', smiles: S.asparagine, stoich: 1 }
      ],
      deltaG: 'Reversible',
      reversible: true,
      regulation: noReg,
      story: { en: 'OAA FAMILY: AST transaminates OAA ↔ aspartate. Asparagine is made from Asp by Asn synthetase (uses Gln as N donor, ATP). From aspartate branch in humans, the ESSENTIAL AAs Met, Thr, Lys, Ile are NOT made (we get them from diet). All transaminations use PLP (vitamin B6).' },
      clinical: {
        disorder: 'AST / ALT in liver injury',
        inheritance: 'Acquired',
        findings: { en: 'AST and ALT are the classic "liver enzymes". Hepatocyte injury releases them: AST > ALT suggests alcoholic hepatitis (AST:ALT > 2); ALT > AST suggests viral hepatitis. ALT is more liver-specific; AST also in heart/muscle/kidney.' },
        treatment: { en: 'Treat underlying liver disease.' }
      },
      beats: {
        en: [
          { t: 0, text: 'OAA (TCA intermediate) available.', highlight: 'substrate' },
          { t: 2500, text: 'AST swaps glutamate\'s amino group onto OAA → aspartate.', highlight: 'enzyme' },
          { t: 5000, text: 'Aspartate is precursor for asparagine and (via ATP) for nucleotides.', highlight: 'product' }
        ]
      }
    },
    {
      id: 3,
      compartment: 'cyto',
      angle: 30,
      enzyme: {
        abbr: 'ALT family',
        name: 'Alanine Aminotransferase (ALT/GPT)',
        ec: '2.6.1.2',
        class: 'Transferase',
        he: ''
      },
      substrates: [
        { key: 'pyruvate', name: 'Pyruvate', smiles: S.pyruvate, stoich: 1 },
        { key: 'glutamate', name: 'Glutamate (N donor)', smiles: S.glutamate, stoich: 1 }
      ],
      cofactors: [{ key: 'plp', name: 'PLP (B6)', smiles: '', stoich: 1, role: 'cofactor' }],
      products: [{ key: 'alanine', name: 'Alanine', smiles: S.alanine, isMain: true, stoich: 1 }],
      deltaG: 'Reversible',
      reversible: true,
      regulation: noReg,
      story: { en: 'PYRUVATE FAMILY: ALT makes alanine. In humans, the essential branched-chain AAs Val and Leu are NOT synthesized (dietary). Alanine is also the key N carrier from muscle to liver (glucose-alanine cycle).' },
      clinical: {
        disorder: 'Maple Syrup Urine Disease (MSUD)',
        inheritance: 'Autosomal recessive',
        findings: { en: 'Branched-chain α-ketoacid dehydrogenase (BCKAD) deficiency — affects CATABOLISM of Val, Leu, Ile (not synthesis, but worth knowing). Neonatal encephalopathy, maple-syrup-smelling urine, seizures. Leucine is most toxic.' },
        treatment: { en: 'BCAA-restricted diet. Thiamine (B1) trial (cofactor of BCKAD).' }
      },
      beats: {
        en: [
          { t: 0, text: 'Pyruvate (from glycolysis).', highlight: 'substrate' },
          { t: 2500, text: 'ALT transfers Glu\'s amino group → alanine.', highlight: 'enzyme' },
          { t: 5000, text: 'Alanine travels to liver in the glucose-alanine cycle.', highlight: 'product' }
        ]
      }
    },
    {
      id: 4,
      compartment: 'cyto',
      angle: 90,
      enzyme: {
        abbr: 'PHGDH family',
        name: '3-Phosphoglycerate Dehydrogenase',
        ec: '1.1.1.95',
        class: 'Oxidoreductase',
        he: ''
      },
      substrates: [{ key: 'pg3', name: '3-Phosphoglycerate (from glycolysis)', smiles: S.pg3, stoich: 1 }],
      cofactors: [],
      products: [
        { key: 'serine', name: 'Serine', smiles: S.serine, isMain: true, stoich: 1 },
        { key: 'glycine', name: '→ Glycine (via SHMT, releases 1C to THF)', smiles: S.glycine, stoich: 1 },
        { key: 'cysteine', name: '→ Cysteine (requires Met as S donor!)', smiles: S.cysteine, stoich: 1 }
      ],
      deltaG: 'Irreversible',
      reversible: false,
      regulation: noReg,
      story: { en: '3-PG FAMILY: PHGDH starts the serine pathway from glycolysis. Ser → Gly (SHMT, releases 1-carbon unit to tetrahydrofolate — key for 1C metabolism!). Ser → Cys requires METHIONINE as the sulfur source (via homocysteine + cystathionine). So Cys is "conditionally essential" — only if Met is plentiful.' },
      clinical: {
        disorder: 'Homocystinuria',
        inheritance: 'Autosomal recessive',
        findings: { en: 'Cystathionine β-synthase (CBS) deficiency → homocysteine accumulates. Marfanoid (ectopia lentis DOWN/IN vs Marfan UP/OUT), intellectual disability, thrombosis, fair skin, premature atherosclerosis. CBS uses B6 (PLP).' },
        treatment: { en: 'Low-Met diet + Cys supplementation + betaine (alternative homocysteine→Met pathway) + B6 (some forms respond).' }
      },
      beats: {
        en: [
          { t: 0, text: '3-PG (glycolysis) is the entry to serine biosynthesis.', highlight: 'substrate' },
          { t: 2500, text: 'PHGDH + transaminase + phosphatase → serine.', highlight: 'enzyme' },
          { t: 5000, text: 'Ser → Gly + methylene-THF (1C metabolism).', highlight: 'product' },
          { t: 7500, text: 'Ser + homocysteine → cystathionine → cysteine.', highlight: 'carrier' }
        ]
      }
    },
    {
      id: 5,
      compartment: 'cyto',
      angle: 150,
      enzyme: {
        abbr: 'PAH',
        name: 'Phenylalanine Hydroxylase (Phe → Tyr)',
        ec: '1.14.16.1',
        class: 'Oxidoreductase',
        he: ''
      },
      substrates: [{ key: 'phe', name: 'Phenylalanine (essential, dietary)', smiles: S.phe, stoich: 1 }],
      cofactors: [
        { key: 'bh4', name: 'BH₄ (tetrahydrobiopterin)', smiles: '', stoich: 1, role: 'cofactor', note: { en: 'Also needed for tyrosine hydroxylase (→ dopa → dopamine), tryptophan hydroxylase (→ serotonin), and NO synthase' } },
        { key: 'o2', name: 'O₂', smiles: 'O=O', stoich: 1, role: 'consumed' }
      ],
      products: [
        { key: 'tyr', name: 'Tyrosine', smiles: S.tyr, label: { en: 'Tyrosine — conditionally essential' }, isMain: true, stoich: 1 },
        { key: 'phe_note', name: 'Phe and Trp are fully essential; Tyr is made from Phe', smiles: '', stoich: 1 }
      ],
      deltaG: 'Irreversible',
      reversible: false,
      regulation: noReg,
      story: { en: 'AROMATIC FAMILY: Humans cannot build the aromatic ring. Phe and Trp are essential. Tyr is made from Phe by PAH — so Tyr is "conditionally essential" (becomes essential if PAH is absent = PKU). BH₄ is the key cofactor (also for dopamine, serotonin, NO synthesis). Downstream: Tyr → dopa → dopamine → norepinephrine → epinephrine (catecholamines); Tyr → melanin; Tyr → thyroid hormones. Trp → serotonin, melatonin, niacin.' },
      clinical: {
        disorder: 'Phenylketonuria (PKU)',
        inheritance: 'Autosomal recessive (1:10,000 — most common AA disorder)',
        findings: { en: 'PAH deficiency → Phe accumulates, Tyr deficient. Intellectual disability (severe if untreated), musty body odor, light skin/hair (no melanin), eczema, seizures. Newborn screening catches it at birth. Variant forms: BH₄ deficiency (needs BH₄ supplement; also affects neurotransmitters).' },
        treatment: { en: 'Strict low-Phe diet (avoid aspartame — contains Phe!) + Tyr supplementation for life. BH₄-responsive forms: sapropterin. Maternal PKU: strict diet during pregnancy to prevent fetal damage.' }
      },
      beats: {
        en: [
          { t: 0, text: 'Phenylalanine (dietary) is the aromatic precursor.', highlight: 'substrate' },
          { t: 2500, text: 'PAH uses BH₄ + O₂ to add OH.', highlight: 'enzyme' },
          { t: 5000, text: 'Tyrosine made. Feeds catecholamine, melanin, thyroid synthesis.', highlight: 'product' }
        ]
      }
    },
    {
      id: 6,
      compartment: 'cyto',
      angle: 210,
      enzyme: {
        abbr: '(Dietary)',
        name: 'Histidine — essential, from diet',
        ec: '',
        class: '',
        he: ''
      },
      substrates: [{ key: 'diet', name: 'Dietary histidine', smiles: S.his, isSource: true, stoich: 1 }],
      cofactors: [],
      products: [{ key: 'his', name: 'Histidine', smiles: S.his, isMain: true, stoich: 1 }],
      deltaG: '—',
      reversible: false,
      regulation: noReg,
      story: { en: 'R5P FAMILY: In bacteria, His is made from ribose-5-phosphate + ATP in a 10-step pathway. Humans do NOT have this pathway → His is ESSENTIAL. Clinical note: His → histamine (via histidine decarboxylase, PLP) — immune and gastric functions.' },
      clinical: null,
      beats: {
        en: [
          { t: 0, text: 'Histidine arrives from food — humans cannot synthesize it.', highlight: 'substrate' },
          { t: 2500, text: 'Incorporated into proteins.', highlight: 'enzyme' },
          { t: 5000, text: 'His → Histamine (HDC, PLP-dependent).', highlight: 'product' }
        ]
      }
    }
  ],

  intermediates: [
    { id: 'glu', afterStep: 1, beforeStep: 2, name: 'Glutamate (shared N donor)', smiles: S.glutamate, carrier: true },
    { id: 'asp', afterStep: 2, beforeStep: 3, name: 'Aspartate', smiles: S.aspartate },
    { id: 'ala', afterStep: 3, beforeStep: 4, name: 'Alanine', smiles: S.alanine },
    { id: 'ser', afterStep: 4, beforeStep: 5, name: 'Ser / Gly / Cys', smiles: S.serine },
    { id: 'tyr', afterStep: 5, beforeStep: 6, name: 'Tyr / Phe / Trp', smiles: S.tyr },
    { id: 'his', afterStep: 6, beforeStep: 1, name: 'His (essential)', smiles: S.his }
  ],

  integrations: [
    {
      name: 'α-KG ↔ Glu',
      fromStep: 1,
      toCycle: 'TCA cycle',
      path: { en: 'α-KG (TCA) ↔ Glutamate. The critical entry/exit point for N.' },
      note: { en: 'This is how AAs enter the urea cycle and how ammonia gets fixed into organic form.' }
    },
    {
      name: 'Asp → Urea Cycle',
      fromStep: 2,
      toCycle: 'Urea cycle',
      path: { en: 'Aspartate + citrulline → argininosuccinate (urea cycle step 3). Aspartate donates the 2nd N of urea.' },
      note: { en: 'Key integration: transamination generates Asp → second N of urea.' }
    },
    {
      name: 'Ala → Gluconeogenesis (glucose-alanine cycle)',
      fromStep: 3,
      toCycle: 'Gluconeogenesis',
      path: { en: 'Muscle: AA → Ala (via pyruvate) → blood → liver: Ala → pyruvate + NH₄⁺ → urea + gluconeogenesis.' },
      note: { en: 'Dual-purpose cycle — nitrogen transport + glucose precursor.' }
    },
    {
      name: 'Gly → Heme / Purines',
      fromStep: 4,
      toCycle: 'Heme synthesis / Purine synthesis',
      path: { en: 'Glycine + succinyl-CoA → ALA (heme pathway start). Glycine → purine ring (1 N + 2 C of purines).' },
      note: { en: 'Glycine is the smallest AA but one of the most synthetically prolific precursors.' }
    },
    {
      name: 'Ser ↔ Gly + 1C units',
      fromStep: 4,
      toCycle: '1-Carbon metabolism',
      path: { en: 'Ser → Gly + methylene-THF (SHMT). THF-1C units → purine/pyrimidine synthesis, methylation.' },
      note: { en: 'Folate + B12 are critical for this. Deficiency → megaloblastic anemia.' }
    },
    {
      name: 'Tyr → Catecholamines, Melanin, Thyroid',
      fromStep: 5,
      toCycle: 'Neurotransmitters / Pigment / Hormones',
      path: { en: 'Tyr → DOPA → Dopamine → NE → Epi. Tyr → melanin (via tyrosinase). Tyr + I₂ → T3/T4.' },
      note: { en: 'Albinism = tyrosinase deficiency. Alkaptonuria = homogentisate oxidase deficiency (dark urine).' }
    },
    {
      name: 'Trp → Serotonin / Melatonin / Niacin',
      fromStep: 5,
      toCycle: 'Neurotransmitters / Vitamins',
      path: { en: 'Trp → 5-HTP → serotonin → melatonin. Trp → niacin (NAD) via the kynurenine pathway (requires B6).' },
      note: { en: 'Pellagra (niacin deficiency): 3 D\'s — dermatitis, diarrhea, dementia. Seen in corn-heavy diets (corn protein is niacin-bound and Trp-poor).' }
    },
    {
      name: 'Glu → GABA',
      fromStep: 1,
      toCycle: 'Neurotransmitters',
      path: { en: 'Glutamate → GABA (via GAD, PLP-dependent). GABA is the main inhibitory neurotransmitter.' },
      note: { en: 'Vitamin B6 deficiency → seizures (impaired GABA production).' }
    },
    {
      name: 'Met → SAM (universal methyl donor)',
      toCycle: '1-Carbon / methylation',
      path: { en: 'Met + ATP → SAM (S-adenosylmethionine) → methylates DNA, proteins, lipids → SAH → homocysteine → Met (B12 + folate) OR → Cys (B6).' },
      note: { en: 'Methylation cycle. B12 deficiency → hyperhomocysteinemia + megaloblastic anemia + neuro symptoms.' }
    }
  ],

  bigPicture: {
    en: [
      { k: 'Nonessential AAs (11)', v: 'Ala, Asn, Asp, Glu, Gln, Gly, Pro, Ser, Cys*, Tyr*, Arg* (*conditionally essential)' },
      { k: 'Essential AAs (9) — must come from diet', v: '"PVT TIM HaLL" — Phe, Val, Thr, Trp, Ile, Met, His, Leu, Lys' },
      { k: 'Conditionally essential', v: 'Tyr (made from Phe — if PKU, essential), Cys (Met as sulfur donor), Arg (inadequate synthesis in infants + severe stress)' },
      { k: 'Six precursor families', v: '1. α-KG → Glu, Gln, Pro, Arg. 2. OAA → Asp, Asn. 3. Pyruvate → Ala. 4. 3-PG → Ser, Gly, Cys. 5. PEP+E4P → Tyr (Phe + Trp essential). 6. R5P → His (essential).' },
      { k: 'Universal N donor', v: 'Glutamate — formed from α-KG + NH₄⁺ by GDH (using NADPH)' },
      { k: 'Universal chemistry', v: 'Transamination via aminotransferases (ALT, AST, etc.) — all require PLP (vitamin B6)' },
      { k: 'AST vs ALT clinically', v: 'ALT = liver-specific. AST also in heart/muscle. AST>ALT ratio suggests alcoholic liver disease; ALT>AST in viral hepatitis.' },
      { k: 'PKU', v: 'Phenylalanine hydroxylase (PAH) deficiency. Most common AA disorder. Newborn screening. Low-Phe diet for life. Avoid aspartame.' },
      { k: 'Albinism', v: 'Tyrosinase deficiency → no melanin. Tyr → DOPA → melanin pathway.' },
      { k: 'Alkaptonuria', v: 'Homogentisate oxidase deficiency. Black urine on standing, black cartilage (ochronosis).' },
      { k: 'Maple Syrup Urine Disease', v: 'BCKAD (branched-chain α-keto acid DH) deficiency — affects Val/Leu/Ile catabolism. Thiamine (B1) as cofactor.' },
      { k: 'Homocystinuria', v: 'Cystathionine β-synthase (CBS) deficiency. PLP (B6). Marfanoid features, thrombosis.' },
      { k: 'Tyr gives rise to', v: 'DOPA → dopamine → NE → Epi (catecholamines); Melanin; Thyroid hormones T3/T4' },
      { k: 'Trp gives rise to', v: 'Serotonin → melatonin; Niacin (NAD) via kynurenine pathway' },
      { k: 'Glu gives rise to', v: 'GABA (inhibitory neurotransmitter, via GAD/PLP)' },
      { k: 'Met → SAM', v: 'SAM is the universal methyl donor. Links Met → homocysteine → Met cycle (B12, folate) or → Cys (B6).' },
      { k: 'BH₄ cofactor uses', v: 'PAH (Phe→Tyr), tyrosine hydroxylase (Tyr→DOPA), tryptophan hydroxylase (Trp→5-HTP), NO synthase. BH₄ deficiency mimics PKU PLUS neurotransmitter deficits.' },
      { k: 'B6 (PLP) cofactor', v: 'All transaminases, decarboxylases (GAD, HDC, DOPA decarboxylase), CBS (homocystinuria), glycogen phosphorylase, ALA synthase. Deficiency → seizures + sideroblastic anemia.' }
    ]
  },

  questions: [
    { id: 'aab-q1', difficulty: 'easy', prompt: { en: 'How many amino acids are essential in humans?', he: '' }, correct: '9', options: ['9', '11', '10', '20'] },
    { id: 'aab-q2', difficulty: 'medium', prompt: { en: 'Which of the following is NOT essential in humans?', he: '' }, correct: 'Alanine', options: ['Alanine', 'Lysine', 'Tryptophan', 'Leucine'] },
    { id: 'aab-q3', difficulty: 'medium', prompt: { en: 'The "universal amino donor" in transamination is:', he: '' }, correct: 'Glutamate', options: ['Glutamate', 'Glutamine', 'Aspartate', 'Alanine'] },
    { id: 'aab-q4', difficulty: 'medium', prompt: { en: 'All aminotransferases require which cofactor?', he: '' }, correct: 'PLP (vitamin B6)', options: ['PLP (vitamin B6)', 'TPP (vitamin B1)', 'Biotin (B7)', 'FAD (B2)'] },
    { id: 'aab-q5', difficulty: 'hard', prompt: { en: 'PKU is caused by deficiency of:', he: '' }, correct: 'Phenylalanine hydroxylase (PAH)', options: ['Phenylalanine hydroxylase (PAH)', 'Tyrosinase', 'Homogentisate oxidase', 'Branched-chain ketoacid DH'] },
    { id: 'aab-q6', difficulty: 'medium', prompt: { en: 'Tyrosine becomes essential when:', he: '' }, correct: 'PAH is deficient (PKU)', options: ['PAH is deficient (PKU)', 'Insulin is low', 'Met is abundant', 'Dietary glycine is low'] },
    { id: 'aab-q7', difficulty: 'hard', prompt: { en: 'Maple syrup urine disease affects catabolism of:', he: '' }, correct: 'Branched-chain amino acids (Val, Leu, Ile)', options: ['Branched-chain amino acids (Val, Leu, Ile)', 'Aromatic AAs (Phe, Tyr, Trp)', 'Sulfur AAs (Cys, Met)', 'Basic AAs (Lys, Arg, His)'] },
    { id: 'aab-q8', difficulty: 'hard', prompt: { en: 'Homocystinuria classically results from deficiency of:', he: '' }, correct: 'Cystathionine β-synthase (B6-dependent)', options: ['Cystathionine β-synthase (B6-dependent)', 'Methionine synthase', 'PAH', 'Tyrosine aminotransferase'] },
    { id: 'aab-q9', difficulty: 'medium', prompt: { en: 'Which AA is the precursor of melanin, catecholamines, and thyroid hormones?', he: '' }, correct: 'Tyrosine', options: ['Tyrosine', 'Tryptophan', 'Phenylalanine', 'Histidine'] },
    { id: 'aab-q10', difficulty: 'hard', prompt: { en: 'Pellagra (dermatitis, diarrhea, dementia) results from deficiency of niacin, which is synthesized from:', he: '' }, correct: 'Tryptophan', options: ['Tryptophan', 'Tyrosine', 'Histidine', 'Methionine'] },
    { id: 'aab-q11', difficulty: 'medium', prompt: { en: 'Which amino acid gives rise to GABA?', he: '' }, correct: 'Glutamate', options: ['Glutamate', 'Glycine', 'Aspartate', 'Alanine'] },
    { id: 'aab-q12', difficulty: 'hard', prompt: { en: 'SAM (S-adenosylmethionine) is the universal:', he: '' }, correct: 'Methyl donor', options: ['Methyl donor', 'Amino donor', 'Carboxyl donor', 'Sulfhydryl donor'] },
    { id: 'aab-q13', difficulty: 'medium', prompt: { en: 'AST > ALT ratio is classically associated with:', he: '' }, correct: 'Alcoholic liver disease', options: ['Alcoholic liver disease', 'Viral hepatitis', 'Muscular dystrophy', 'Hemolysis'] },
    { id: 'aab-q14', difficulty: 'hard', prompt: { en: 'Albinism is caused by deficiency of:', he: '' }, correct: 'Tyrosinase', options: ['Tyrosinase', 'PAH', 'Homogentisate oxidase', 'DOPA decarboxylase'] },
    { id: 'aab-q15', difficulty: 'hard', prompt: { en: 'The cofactor BH₄ (tetrahydrobiopterin) is required by ALL EXCEPT:', he: '' }, correct: 'Glutamate dehydrogenase', options: ['Glutamate dehydrogenase', 'Phenylalanine hydroxylase', 'Tyrosine hydroxylase', 'Nitric oxide synthase'] }
  ]
};
