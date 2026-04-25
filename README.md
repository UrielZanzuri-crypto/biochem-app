# Biochem Memory App v0.3 — מבחן ידע לרפואה

Interactive, exam-realistic biochemistry learning app for Israeli medical students. Built around evidence-based memory techniques and designed to scale across the entire biochem syllabus.

## What's new in v0.3

- 🧪 **Real molecular structures** — every molecule has a SMILES string and auto-renders as a proper skeletal formula via SMILES Drawer
- 🎛 **Layer system** — toggle overlays independently on the diagram:
  - Stoichiometry labels on arrows (2 ATP → 2 ADP + Pi)
  - Cofactor clusters (ATP, NADH, etc. around each enzyme)
  - Regulation arrows (green activators, red inhibitors)
  - Integration arrows (dashed exits to other pathways)
  - Tissue/state banner
- 🌊 **Mogmethod-style wavy membrane** — no more half-circles, the mitochondrial membrane is a proper bumpy barrier
- 🔗 **Integration tab** — dedicated view for how each cycle connects to others (aspartate-argininosuccinate shunt, glucose-alanine cycle, polyamines, NO synthesis)
- 🏥 **Tissue & metabolic state context** — where the cycle runs, under what hormonal conditions
- 📚 **More clinical depth** — inheritance patterns, treatments, pathognomonic signs per disorder

## Run locally

```bash
npm install
npm run dev       # http://localhost:5173
npm run build
```

## Deploy to Vercel

Push to GitHub, import at vercel.com/new. Or drag the built folder for one-shot deploy.

---

## The Layer Toggle System (how to use)

The diagram starts minimal. Students reveal complexity as they're ready:

1. **Base layer** (always visible): enzymes + intermediates + cycle arrows
2. **Layer toggles** (off by default, flip on as needed):
   - **Stoichiometry** — numerical detail on arrows
   - **Cofactors** — ATP/NADH/FAD clusters around each enzyme
   - **Regulation** — green + arrows for activators, red − for inhibitors
   - **Integration** — dashed arrows out to connected pathways
   - **Tissue** — context banner showing organ + state
3. **Hide toggles** (for active recall): hide enzymes or intermediates or both
4. **Cinema Mode** — replaces enzyme labels with story character icons, animated molecule flow, timed narration at the bottom
5. **Structures toggle** (in right panel) — show/hide SMILES-rendered molecular structures

**Pedagogical flow:** first pass = Cinema Mode. Second pass = base diagram + story. Third pass = enable all layers. Fourth pass = hide enzymes, quiz mode. Final review = everything on, Big Picture tab.

---

## 🔑 Adding a new cycle

Each cycle = one JS file in `src/cycles/`. Copy `urea.js` as your template (it's the canonical reference). Key structure:

```js
export const myCycle = {
  id, chapter, title, subtitle, overview,
  context: { tissue, state, stateHormonal, ... },
  storyFrame: { en: {...}, he: {...} },
  mnemonic: { en, he },
  compartments: { mito, cyto },
  transporters: [...],
  steps: [{
    id, compartment, angle,
    enzyme: { abbr, name, ec, class, he },
    substrates: [{ name, smiles, label, isSource, isCarrier, stoich }],
    cofactors: [{ name, smiles, stoich, role }],
    products: [{ name, smiles, label, isMain, exportsTo, stoich }],
    deltaG, reversible,
    regulation: {
      activators: [{ name, type, critical, note }],
      inhibitors: [...],
      summary
    },
    story, clinical: { disorder, inheritance, findings, treatment },
    beats: [{ t, text, highlight }]
  }],
  intermediates: [...],
  integrations: [...],
  bigPicture: [...],
  questions: [...]
};
```

### Workflow

1. `cp src/cycles/urea.js src/cycles/glycolysis.js`
2. Fill in all fields (every field has an example in urea.js)
3. Register in `src/cycles/index.js`:
   ```js
   import { glycolysisCycle } from './glycolysis.js';
   export const ALL_CYCLES = [ureaCycle, glycolysisCycle];
   ```
4. Commit, push, auto-deploys via Vercel

### Finding SMILES strings

Every molecule you'd want can be looked up:
- **PubChem** (pubchem.ncbi.nlm.nih.gov) — search molecule name, copy "Canonical SMILES"
- **ChEBI** (ebi.ac.uk/chebi) — same
- **Wikipedia** — often has SMILES in the infobox

The rendering library handles complex structures (sugars, nucleotides, phospholipids) correctly.

---

## Project structure

```
biochem-app/
├── index.html
├── package.json                  # includes smiles-drawer
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── vercel.json
├── public/favicon.svg
└── src/
    ├── main.jsx
    ├── App.jsx                   # layer toggle state lives here
    ├── index.css
    ├── srs.js                    # SM-2 + localStorage per cycle
    ├── cycles/
    │   ├── index.js              # registry + chapter grouping
    │   ├── _TEMPLATE.js          # blank template
    │   └── urea.js               # reference implementation
    └── components/
        ├── Sidebar.jsx           # chapter-grouped nav with mastery %
        ├── CycleDiagram.jsx      # SVG with independent layer rendering
        ├── Molecule.jsx          # SMILES → skeletal formula renderer
        ├── StepDetail.jsx        # exam-realistic step info with structures
        ├── CinemaMode.jsx        # timed narrated walkthrough
        ├── IntegrationView.jsx   # pathway connections tab
        └── Quiz.jsx              # SRS-scheduled MCQ
```

---

## Memory techniques mapped to features

| Technique | Where it lives |
|---|---|
| Spaced repetition (SM-2) | `srs.js` → Quiz tab |
| Active recall | Hide-mode toggles + Quiz |
| Dual coding | Diagram + StepDetail side-by-side |
| Desirable difficulty | Hide enzymes / intermediates / all |
| Narrative encoding | Story tab + Cinema Mode character overlays |
| Method of loci | The cycle spatial diagram = memory palace |
| Chunking | Big Picture + Integration synthesis views |
| Interleaving | Quiz mixes enzyme/compartment/ΔG/clinical questions |
| Elaborative interrogation | Regulation + Clinical cards force "why?" |
| Progressive disclosure | Layer toggle system |

---

## Coming soon

Placeholder cycles in the sidebar are ready to be filled in using urea.js as the template. In approximate exam-prep priority:
- Glycolysis (10 steps, central to carbohydrate metabolism)
- Gluconeogenesis (shares 7 enzymes with glycolysis; good for comparison)
- TCA Cycle (8 steps, central hub)
- Pentose Phosphate Pathway
- Glycogen synthesis & breakdown
- β-Oxidation
- Fatty acid synthesis
- Ketogenesis
- Electron Transport Chain + OxPhos
- Amino acid biosynthesis families
