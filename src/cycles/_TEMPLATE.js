// ============================================================
// CYCLE TEMPLATE — copy this file to create a new cycle
// Rename to e.g. glycolysis.js, fill in all fields, then
// register in ./index.js
// ============================================================

export const TEMPLATE_CYCLE = {
  id: 'UNIQUE_ID',                    // e.g. 'glycolysis'
  chapter: 'CHAPTER_NAME',            // must match a chapter in ./index.js chapterMap
  chapterOrder: 1,
  order: 1,
  title: { en: 'English Title', he: 'כותרת עברית' },
  subtitle: { en: 'One-line subtitle', he: 'כותרת משנה' },

  overview: {
    en: 'A paragraph explaining what this cycle does, why it exists, and where it happens. Should read like a textbook intro.',
    he: 'פסקה המסבירה מה המעגל עושה, למה הוא קיים והיכן הוא מתרחש.'
  },

  storyFrame: {
    en: {
      title: 'The story title',
      setting: 'A descriptive paragraph that sets up the metaphor/world for the cycle. This is what students "see" when they close their eyes to recall.',
      characters: [
        // ONE CHARACTER PER ENZYME STEP. Order matches steps[] order.
        { name: 'ENZYME_ABBR', role: 'Character Role', icon: '🔐', color: '#f59e0b' }
      ]
    },
    he: {
      title: 'כותרת סיפור',
      setting: 'פסקה מתארת שקובעת את המטאפורה/העולם של המעגל.',
      characters: [
        { name: 'ENZYME_ABBR', role: 'תפקיד הדמות', icon: '🔐', color: '#f59e0b' }
      ]
    }
  },

  mnemonic: {
    en: { phrase: 'Mnemonic phrase', breakdown: 'Word1 · Word2 · Word3' },
    he: { phrase: 'ביטוי מנמוני', breakdown: 'מילה1 · מילה2 · מילה3' }
  },

  compartments: {
    // Define only the compartments this cycle uses
    mito: { en: 'Mitochondrial Matrix', he: 'מטריקס מיטוכונדריאלי', color: '#fef3c7', accent: '#f59e0b' },
    cyto: { en: 'Cytosol', he: 'ציטוזול', color: '#dbeafe', accent: '#3b82f6' }
  },

  steps: [
    {
      id: 1,
      compartment: 'mito',              // key matching compartments above
      angle: -90,                        // degrees; -90=top, 0=right, 90=bottom, 180=left
      enzyme: {
        abbr: 'ABBR',
        name: 'Full Enzyme Name',
        ec: '0.0.0.0',
        class: 'Ligase | Transferase | Hydrolase | Lyase | Isomerase | Oxidoreductase',
        he: 'שם בעברית'
      },
      substrates: [
        { name: 'Molecule', label: { en: 'Description', he: 'תיאור' }, isSource: false, isEnergy: false, isCarrier: false }
      ],
      products: [
        { name: 'Molecule', label: { en: 'Description', he: 'תיאור' }, isMain: true, isWaste: false, isFinal: false, exportsTo: null }
      ],
      deltaG: '−XX kJ/mol (irreversible | reversible)',
      regulation: {
        en: 'Regulation details — activators, inhibitors, allosteric, covalent modification',
        he: 'פרטי ויסות'
      },
      story: {
        en: 'One-paragraph story beat — what this character does and why it matters.',
        he: 'פסקת סיפור'
      },
      clinical: {
        disorder: 'Disorder name',
        he: 'שם ההפרעה',
        findings: {
          en: 'Presentation, lab findings, treatment.',
          he: 'מצג, ממצאי מעבדה, טיפול.'
        }
      },
      beats: {
        en: [
          { t: 0, text: 'First narration line (what arrives)', highlight: 'substrate' },
          { t: 2500, text: 'Second line (the enzyme acts)', highlight: 'enzyme' },
          { t: 5000, text: 'Third line (what is produced)', highlight: 'product' }
        ],
        he: [
          { t: 0, text: 'שורת קריינות ראשונה', highlight: 'substrate' }
        ]
      }
    }
    // ...more steps
  ],

  intermediates: [
    // Molecules that sit BETWEEN enzyme steps (on the arrow arcs)
    { id: 'unique-id', afterStep: 1, beforeStep: 2, name: 'Molecule', he: 'עברית', carrier: false, crossesMembrane: false }
  ],

  bigPicture: {
    en: [
      { k: 'Overall equation', v: 'Substrates → Products' },
      { k: 'Total energy', v: 'N ATP equivalents' },
      { k: 'Rate-limiting step', v: 'Enzyme name' }
    ],
    he: [
      { k: 'משוואה', v: 'מצעים → תוצרים' }
    ]
  },

  questions: [
    // 8-15 multiple choice questions
    {
      id: 'cycleId-q1',
      difficulty: 'easy | medium | hard',
      prompt: { en: 'Question text?', he: 'טקסט השאלה?' },
      correct: 'Correct answer text',
      options: ['Correct answer text', 'Distractor 1', 'Distractor 2', 'Distractor 3']
    }
  ]
};
