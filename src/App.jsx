import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Brain, Target, Zap, GitBranch, ChevronRight
} from 'lucide-react';
import CycleDiagram from './components/CycleDiagram.jsx';
import Quiz from './components/Quiz.jsx';
import ActiveRecall from './components/ActiveRecall.jsx';
import IntegrationView from './components/IntegrationView.jsx';
import { ALL_CYCLES, getCyclesByChapter } from './cycles/index.js';
import { computeMastery, loadCycle } from './srs.js';

// Standard medical-textbook notation helpers
const ENERGY_MOLECULES = new Set(['ATP', 'ADP', 'AMP', 'GTP', 'GDP', 'NADH', 'NADPH', 'FADH2', 'FADH₂']);

// For a regulator: energy molecules get "↑" prefix (means "when it rises"), others get +/-
function formatRegulator(name, kind /* 'act' | 'inh' */) {
  const core = name.split(/[\s(]/)[0].replace(/[,]/g, '');
  if (ENERGY_MOLECULES.has(core)) return `↑${core}`;
  return kind === 'act' ? `+${name}` : `−${name}`;
}

// Scan cofactors of a step for the exam-relevant energy products/expenditures
// Returns a list of {label, color} chips for the "Energy" field.
// Convention: emphasize ATP/NADH/FADH₂ PRODUCTION and CONSUMPTION (ignore ADP/AMP/NAD⁺ counterparts).
function energyYield(step) {
  const out = [];
  const cofactors = step.cofactors || [];
  const high = new Set(['ATP', 'GTP', 'NADH', 'NADPH', 'FADH2', 'FADH₂']);
  cofactors.forEach(c => {
    // Strip any leading number+space from the cofactor name so we can identify its core identity.
    const nameClean = c.name.replace(/^\d+\s+/, '');
    const core = nameClean.split(/[\s(]/)[0];
    if (!high.has(core)) return;
    // Use stoich field (authoritative), never duplicate from name
    const n = c.stoich && c.stoich > 1 ? `${c.stoich} ` : '';
    if (c.role === 'produced') {
      out.push({ label: `+${n}${core}`, kind: 'produced' });
    } else if (c.role === 'consumed') {
      out.push({ label: `−${n}${core}`, kind: 'consumed' });
    }
  });
  return out;
}

// Map character names/ids to a hue for consistent coloring
// If a cycle defines character.color (hex), use that directly.
// Otherwise derive hue from step number.
function stepAccents(cycle, stepId) {
  const chars = cycle.storyFrame?.en?.characters || [];
  const char = chars[stepId - 1];
  // Try to extract hue from hex color or fallback to a preset
  const presetHues = [35, 15, 210, 275, 155, 50, 100, 190, 260, 320, 20, 230];
  const hue = char?.hue ?? presetHues[(stepId - 1) % presetHues.length];
  return {
    hue,
    accent: `oklch(55% 0.16 ${hue})`,
    accentSoft: `oklch(96% 0.04 ${hue})`,
    char
  };
}

// ---------- Top bar ----------
function TopBar({ cycle, onStartCinema, onToggleRail, onToggleSide, chapterNum }) {
  const abbr = cycle.title?.en?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'Bx';
  return (
    <header className="topbar">
      <div className="topbar__left">
        <button className="logo-btn" onClick={onToggleRail} aria-label="Open menu">
          <div className="logo__mark">{abbr}</div>
          <div>
            <div className="logo__title">Mnemonica</div>
            <div className="logo__sub">Biochemistry{chapterNum ? ` · Ch. ${chapterNum}` : ''}</div>
          </div>
        </button>
      </div>
      <div className="topbar__center">
        <h1>{cycle.title?.en || ''}</h1>
        <div className="subtitle">
          {cycle.subtitle?.en || ''}
          {cycle.steps ? ` · ${cycle.steps.length} steps` : ''}
        </div>
      </div>
      <div className="topbar__right">
        <button className="btn btn--sm btn--ghost mobile-menu-btn" onClick={onToggleSide} aria-label="Step detail">
          <ChevronRight className="w-4 h-4" />
        </button>
        <button className="btn btn--primary" onClick={onStartCinema}>
          <span className="btn__icon">▶</span> Cinema
        </button>
      </div>
    </header>
  );
}

// ---------- Left rail — layers + cycle chooser ----------
function LeftRail({ layers, toggleLayer, cycle, activeCycleId, onSelectCycle }) {
  const entries = [
    { k: 'stoich',      label: 'Stoichiometry', sub: 'ATP counts on arrows',        glyph: '2×', hue: 40 },
    { k: 'cofactors',   label: 'Cofactors',     sub: 'ATP · NADH clusters',          glyph: '⚡', hue: 60 },
    { k: 'regulation',  label: 'Regulation',    sub: '+ activators / − inhibitors', glyph: '±',  hue: 150 },
    { k: 'integration', label: 'Integration',   sub: 'Exits to other pathways',      glyph: '↗', hue: 280 },
    { k: 'tissue',      label: 'Tissue state',  sub: 'Compartments + hormonal',      glyph: '◉', hue: 25 },
  ];
  const onCount = Object.values(layers).filter(Boolean).length;
  const grouped = getCyclesByChapter();

  return (
    <aside className="rail">
      <div className="rail__hdr">
        <div className="rail__title">Layers</div>
        <div className="rail__count">{onCount}/{entries.length} on</div>
      </div>
      <div className="rail__hint">Reveal complexity as you need it.</div>
      <div className="rail__items">
        {entries.map((e) => {
          const on = layers[e.k];
          const accent = `oklch(55% 0.14 ${e.hue})`;
          const soft = `oklch(96% 0.04 ${e.hue})`;
          return (
            <button
              key={e.k}
              className={`layer ${on ? 'layer--on' : ''}`}
              style={on ? { borderColor: accent, background: soft } : {}}
              onClick={() => toggleLayer(e.k)}
            >
              <div className="layer__glyph" style={{ background: on ? accent : 'oklch(94% 0.01 70)', color: on ? '#fff' : 'oklch(45% 0.03 70)' }}>
                {e.glyph}
              </div>
              <div>
                <div className="layer__label">{e.label}</div>
                <div className="layer__sub">{e.sub}</div>
              </div>
              <div className={`switch ${on ? 'switch--on' : ''}`} style={on ? { background: accent } : {}}>
                <div className="switch__dot" />
              </div>
            </button>
          );
        })}
      </div>

      <div className="rail__section" style={{ marginTop: 14 }}>Cycles</div>
      {grouped.map(group => {
        if (group.cycles.length === 0) return null;
        return (
          <div key={group.chapter.id}>
            <div className="chap">{group.chapter.en}</div>
            {group.cycles.map(c => {
              const cards = loadCycle(c.id);
              const mastery = computeMastery(c, cards);
              const isActive = c.id === activeCycleId;
              return (
                <button
                  key={c.id}
                  onClick={() => onSelectCycle(c.id)}
                  className={`cyc ${isActive ? 'cyc--active' : ''}`}
                >
                  <span style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c.title.en}</span>
                  {mastery.reviewed > 0 && (
                    <span className="cyc__mastery">{mastery.pct}%</span>
                  )}
                </button>
              );
            })}
          </div>
        );
      })}
    </aside>
  );
}

// ---------- Right side — step detail card or empty-state cast list ----------
function StepCardAdapter({ step, cycle, onClose }) {
  if (!step) return null;
  const { accent, accentSoft, char } = stepAccents(cycle, step.id);
  const compLabel = cycle.compartments?.[step.compartment]?.en || step.compartment;

  // Helpers
  const substrates = step.substrates || [];
  const products = step.products || [];
  const cofactors = step.cofactors || [];
  const activators = step.regulation?.activators || [];
  const inhibitors = step.regulation?.inhibitors || [];

  return (
    <div className="step-card" style={{ borderColor: accent }}>
      <div className="step-card__hdr" style={{ background: accentSoft }}>
        <div className="step-card__avatar" style={{ background: char?.color || accent }}>
          <span>{char?.icon || '●'}</span>
        </div>
        <div>
          <div className="step-card__eyebrow">Step {step.id} · {compLabel}</div>
          <div className="step-card__name">{step.enzyme.abbr}</div>
          <div className="step-card__role" style={{ color: accent }}>{char?.role || step.enzyme.name}</div>
        </div>
        <button className="step-card__close" onClick={onClose} aria-label="Close">×</button>
      </div>

      <div className="step-card__body">
        <div className="field">
          <div className="field__k">Full name</div>
          <div className="field__v">{step.enzyme.name}</div>
          <div className="field__sub">{step.enzyme.ec ? `EC ${step.enzyme.ec} · ` : ''}{step.enzyme.class || ''}</div>
        </div>

        <div className="rxn">
          <div className="rxn__side">
            {substrates.map((s, i) => (
              <div key={i} className={`chip ${s.isSource ? 'chip--source' : ''} ${s.isCarrier ? 'chip--carrier' : ''}`}>
                <span className="chip__name">{s.name}</span>
                {s.label && <span className="chip__sub">{typeof s.label === 'object' ? s.label.en : s.label}</span>}
              </div>
            ))}
          </div>
          <div className="rxn__arrow">
            <span style={{ color: accent }}>→</span>
            {cofactors.length > 0 && (
              <div className="rxn__cof">
                {cofactors.map((c, i) => {
                  // Strip leading number from name so we don't double-display stoich
                  const cleanName = c.name.replace(/^\d+\s+/, '');
                  const stoichPrefix = c.stoich > 1 ? `${c.stoich} ` : '';
                  return (
                    <span key={i} className={`tag tag--${c.role || 'consumed'}`}>
                      {c.role === 'produced' ? '↑' : '↓'} {stoichPrefix}{cleanName}
                    </span>
                  );
                })}
              </div>
            )}
          </div>
          <div className="rxn__side">
            {products.map((p, i) => (
              <div key={i} className={`chip chip--product ${p.isMain ? 'chip--main' : ''} ${p.isFinal ? 'chip--final' : ''}`}>
                <span className="chip__name">{p.name}</span>
                {p.label && <span className="chip__sub">{typeof p.label === 'object' ? p.label.en : p.label}</span>}
              </div>
            ))}
          </div>
        </div>

        <div className="two">
          <div className="field">
            <div className="field__k">ΔG</div>
            <div className="field__v">{step.deltaG || '—'}</div>
          </div>
          <div className="field">
            <div className="field__k">Reversible</div>
            <div className="field__v">{step.reversible ? 'Yes' : 'No'}</div>
          </div>
        </div>

        {/* Energy yield — exam-critical: shows ATP/NADH/FADH₂ gained or spent */}
        {(() => {
          const yields = energyYield(step);
          if (yields.length === 0) return null;
          return (
            <div className="field">
              <div className="field__k">Energy Yield</div>
              <div className="reg" style={{ marginTop: 4 }}>
                {yields.map((y, i) => (
                  <span
                    key={i}
                    className={`tag ${y.kind === 'produced' ? 'tag--yield-plus' : 'tag--yield-minus'}`}
                  >
                    {y.label}
                  </span>
                ))}
              </div>
            </div>
          );
        })()}

        {(activators.length > 0 || inhibitors.length > 0) && (
          <div className="field">
            <div className="field__k">Regulation</div>
            <div className="reg">
              {activators.map((a, i) => (
                <span key={`a${i}`} className="tag tag--act">
                  {formatRegulator(a.name, 'act')}{a.critical ? ' ★' : ''}
                </span>
              ))}
              {inhibitors.map((a, i) => (
                <span key={`i${i}`} className="tag tag--inh">{formatRegulator(a.name, 'inh')}{a.critical ? ' ★' : ''}</span>
              ))}
            </div>
            {step.regulation?.summary && (
              <div className="field__sub" style={{ marginTop: 6 }}>
                {typeof step.regulation.summary === 'object' ? step.regulation.summary.en : step.regulation.summary}
              </div>
            )}
          </div>
        )}

        {step.story && (
          <div className="story">
            <div className="story__hdr">
              <span className="story__icon">{char?.icon || '📖'}</span>
              <span className="story__title">Memory story</span>
            </div>
            <div className="story__body">
              {typeof step.story === 'object' ? (step.story.en || Object.values(step.story)[0]) : step.story}
            </div>
          </div>
        )}

        {step.clinical && (
          <div className="clinical">
            <div className="clinical__hdr">
              <span className="clinical__dot" />
              <span className="clinical__title">Clinical · {step.clinical.disorder}</span>
            </div>
            {step.clinical.inheritance && (
              <div className="field__sub"><b>Inheritance:</b> {step.clinical.inheritance}</div>
            )}
            {step.clinical.findings && (
              <div className="field__sub" style={{ marginTop: 4 }}>
                <b>Findings:</b> {typeof step.clinical.findings === 'object' ? step.clinical.findings.en : step.clinical.findings}
              </div>
            )}
            {step.clinical.treatment && (
              <div className="field__sub" style={{ marginTop: 4 }}>
                <b>Rx:</b> {typeof step.clinical.treatment === 'object' ? step.clinical.treatment.en : step.clinical.treatment}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ---------- Hint card for network cycles (e.g. AA biosynthesis) ----------
function NetworkHintCard({ node, cycle, onClose }) {
  const accent = node.hub?.color || node.end?.color || '#475569';
  const { kind, hub, enz, end } = node;

  // Header content depends on what was clicked
  const titleMain =
    kind === 'enzyme' ? enz.label :
    kind === 'end'    ? end.label :
                        hub.label;
  const titleSub =
    kind === 'enzyme' ? enz.fullName :
    kind === 'end'    ? end.sublabel :
                        hub.sublabel;
  const eyebrow =
    kind === 'enzyme' ? `Enzyme · ${hub?.label || ''}` :
    kind === 'end'    ? (end.essential ? 'Essential amino acid' : 'Nonessential amino acid') :
                        'Precursor';

  return (
    <div className="step-card" style={{ borderColor: accent }}>
      <div className="step-card__hdr" style={{ background: `${accent}15` }}>
        <div className="step-card__avatar" style={{ background: accent }}>
          <span style={{ fontFamily: "'Fraunces', serif", fontSize: 22 }}>
            {kind === 'end' ? end.label.charAt(0) : kind === 'hub' ? '◎' : '⇌'}
          </span>
        </div>
        <div>
          <div className="step-card__eyebrow">{eyebrow}</div>
          <div className="step-card__name">{titleMain}</div>
          {titleSub && (
            <div className="step-card__role" style={{ color: accent }}>{titleSub}</div>
          )}
        </div>
        <button className="step-card__close" onClick={onClose} aria-label="Close">×</button>
      </div>
      <div className="step-card__body">
        {/* Reaction summary */}
        {kind === 'enzyme' && (
          <div className="rxn">
            <div className="rxn__side">
              <div className="chip chip--source">
                <span className="chip__name">{hub?.label || '—'}</span>
                <span className="chip__sub">precursor</span>
              </div>
            </div>
            <div className="rxn__arrow">
              <span style={{ color: accent }}>→</span>
              <div className="rxn__cof">
                <span className="tag tag--produced">{enz.label}</span>
              </div>
            </div>
            <div className="rxn__side">
              <div className="chip chip--main">
                <span className="chip__name">{end?.label || '—'}</span>
                {end?.sublabel && <span className="chip__sub">{end.sublabel}</span>}
              </div>
            </div>
          </div>
        )}

        {/* Hint card — the pedagogical explanation */}
        {kind === 'enzyme' && enz.hint && (
          <div className="hint-card">
            <div className="hint-card__hdr">
              <span className="hint-card__icon">💡</span>
              <span className="hint-card__title">Why it matters</span>
            </div>
            <div className="hint-card__body">
              {typeof enz.hint === 'object' ? (enz.hint.en || Object.values(enz.hint)[0]) : enz.hint}
            </div>
          </div>
        )}

        {/* End / hub sub-info */}
        {kind === 'end' && end.essential && (
          <div className="clinical">
            <div className="clinical__hdr">
              <span className="clinical__dot" />
              <span className="clinical__title">Essential — must come from diet</span>
            </div>
            <div className="field__sub">Humans cannot build the carbon skeleton for this amino acid. It must be supplied by food. Deficiency causes failure to thrive.</div>
          </div>
        )}
        {kind === 'end' && !end.essential && enz?.hint && (
          <div className="hint-card">
            <div className="hint-card__hdr">
              <span className="hint-card__icon">💡</span>
              <span className="hint-card__title">How it&apos;s made</span>
            </div>
            <div className="hint-card__body">
              {typeof enz.hint === 'object' ? (enz.hint.en || Object.values(enz.hint)[0]) : enz.hint}
            </div>
          </div>
        )}
        {kind === 'hub' && (
          <div className="field">
            <div className="field__k">Role</div>
            <div className="field__v">Central precursor — the carbon skeleton that branches into a family of amino acids.</div>
            <div className="field__sub" style={{ marginTop: 6 }}>
              Comes from {hub.sublabel || 'central metabolism'}.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState({ cycle, onPickStep }) {
  // Network layout — show hubs + enzymes as the cast
  if (cycle.layout === 'network' && cycle.network) {
    const net = cycle.network;
    return (
      <div className="empty">
        <div className="empty__glyph">🌳</div>
        <div className="empty__title">Tap a node</div>
        <div className="empty__sub">
          This is a branching pathway — central precursors flow into amino acid families.
          Tap any enzyme or amino acid to see how it&apos;s built and why it matters.
        </div>
        <div className="empty__cast">
          {net.hubs.map(hub => (
            <button key={hub.id} className="cast" onClick={() => onPickStep(hub.id)}>
              <span className="cast__icon" style={{ background: `${hub.color}20`, borderColor: hub.color, fontSize: 14, fontWeight: 800 }}>
                ◎
              </span>
              <div>
                <div className="cast__name">{hub.label}</div>
                <div className="cast__role" style={{ color: hub.color }}>Precursor — {hub.sublabel}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const chars = cycle.storyFrame?.en?.characters || [];
  return (
    <div className="empty">
      <div className="empty__glyph">👆</div>
      <div className="empty__title">Tap a character</div>
      <div className="empty__sub">
        Each enzyme has its own story — substrates, cofactors, regulation, and the inherited disorder that shows up when it fails.
      </div>
      <div className="empty__cast">
        {cycle.steps.map((step, i) => {
          const { accent, accentSoft, char } = stepAccents(cycle, step.id);
          return (
            <button key={step.id} className="cast" onClick={() => onPickStep(step.id)}>
              <span className="cast__icon" style={{ background: accentSoft, borderColor: accent }}>
                {char?.icon || '●'}
              </span>
              <div>
                <div className="cast__name">{step.enzyme.abbr}</div>
                <div className="cast__role" style={{ color: accent }}>{char?.role || step.enzyme.name}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---------- Cinema bar ----------
function CinemaBar({ cycle, stepIndex, beatIndex, setStepIndex, setBeatIndex, playing, setPlaying, onClose }) {
  const steps = cycle.steps;
  const step = steps[stepIndex];
  const beatsRaw = step?.beats;
  // Beats may be array or { en: [], he: [] }
  const beats = Array.isArray(beatsRaw) ? beatsRaw : (beatsRaw?.en || []);
  const beat = beats[beatIndex];
  const beatText = typeof beat === 'string' ? beat : beat?.text || '';
  const { accent, char } = stepAccents(cycle, step?.id || 1);

  useEffect(() => {
    if (!playing) return;
    const t = setTimeout(() => {
      if (beatIndex + 1 < beats.length) setBeatIndex(beatIndex + 1);
      else if (stepIndex + 1 < steps.length) { setStepIndex(stepIndex + 1); setBeatIndex(0); }
      else setPlaying(false);
    }, 2600);
    return () => clearTimeout(t);
  }, [stepIndex, beatIndex, playing, beats.length, steps.length]);

  const totalBeats = steps.reduce((s, st) => {
    const b = Array.isArray(st.beats) ? st.beats : (st.beats?.en || []);
    return s + b.length;
  }, 0);
  const currentGlobal = steps.slice(0, stepIndex).reduce((s, st) => {
    const b = Array.isArray(st.beats) ? st.beats : (st.beats?.en || []);
    return s + b.length;
  }, 0) + beatIndex + 1;
  const progress = totalBeats > 0 ? (currentGlobal / totalBeats) * 100 : 0;

  const prev = () => {
    if (beatIndex > 0) setBeatIndex(beatIndex - 1);
    else if (stepIndex > 0) {
      setStepIndex(stepIndex - 1);
      const prevBeats = steps[stepIndex - 1].beats;
      const pb = Array.isArray(prevBeats) ? prevBeats : (prevBeats?.en || []);
      setBeatIndex(Math.max(0, pb.length - 1));
    }
  };
  const next = () => {
    if (beatIndex + 1 < beats.length) setBeatIndex(beatIndex + 1);
    else if (stepIndex + 1 < steps.length) { setStepIndex(stepIndex + 1); setBeatIndex(0); }
  };

  return (
    <div className="cinema">
      <div className="cinema__progress">
        <div className="cinema__progress-fill" style={{ width: `${progress}%`, background: accent }} />
      </div>
      <div className="cinema__inner">
        <div className="cinema__avatar" style={{ background: char?.color || accent }}>
          <span key={stepIndex} style={{ animation: 'pop 0.4s ease' }}>{char?.icon || '●'}</span>
        </div>
        <div>
          <div className="cinema__eyebrow">
            STEP {stepIndex + 1}/{steps.length} · {step?.enzyme?.abbr} — <span style={{ color: accent }}>{char?.role || ''}</span>
          </div>
          <div key={`${stepIndex}-${beatIndex}`} className="cinema__beat">
            {beatText}
          </div>
        </div>
        <div className="cinema__ctrls">
          <button onClick={prev} aria-label="Previous">‹</button>
          <button className="cinema__play" onClick={() => setPlaying(!playing)} aria-label="Play/pause">
            {playing ? '❚❚' : '▶'}
          </button>
          <button onClick={next} aria-label="Next">›</button>
          <button className="cinema__close" onClick={onClose} aria-label="Close">✕</button>
        </div>
      </div>
    </div>
  );
}

// ---------- Main app ----------
export default function App() {
  const [activeCycleId, setActiveCycleId] = useState(ALL_CYCLES[0].id);
  const [view, setView] = useState('explore');
  const [activeStep, setActiveStep] = useState(null);
  const [hideMode] = useState('none');
  const [masteryTrigger, setMasteryTrigger] = useState(0);

  // Diagram overlay layers
  const [layers, setLayers] = useState({
    stoich: false,
    cofactors: false,
    regulation: false,
    integration: false,
    tissue: true,
  });

  // Cinema state
  const [cinemaOn, setCinemaOn] = useState(false);
  const [cinemaStep, setCinemaStep] = useState(0);
  const [cinemaBeat, setCinemaBeat] = useState(0);
  const [cinemaPlaying, setCinemaPlaying] = useState(true);

  // Mobile drawers
  const [mobileRail, setMobileRail] = useState(false);
  const [mobileSide, setMobileSide] = useState(false);

  // Label font scale + drag reset key (incrementing triggers a reset inside CycleDiagram)
  const [fontScale, setFontScale] = useState(1);
  const [resetKey, setResetKey] = useState(0);
  const [spreadOn, setSpreadOn] = useState(false);
  const [storyView, setStoryView] = useState(false);

  const cycle = ALL_CYCLES.find(c => c.id === activeCycleId) || ALL_CYCLES[0];

  useEffect(() => {
    setActiveStep(null);
    setView('explore');
    setCinemaOn(false);
  }, [activeCycleId]);

  // When a step is selected on mobile, auto-open the side drawer
  useEffect(() => {
    if (activeStep && window.innerWidth <= 900) {
      setMobileSide(true);
    }
  }, [activeStep]);

  // Sync cinema step index with activeStep for highlighting on diagram
  useEffect(() => {
    if (cinemaOn && cycle.steps[cinemaStep]) {
      setActiveStep(cycle.steps[cinemaStep].id);
    }
  }, [cinemaOn, cinemaStep, cycle.steps]);

  const toggleLayer = (k) => setLayers(prev => ({ ...prev, [k]: !prev[k] }));

  const startCinema = () => {
    setCinemaOn(true);
    setCinemaStep(0);
    setCinemaBeat(0);
    setCinemaPlaying(true);
    setActiveStep(cycle.steps[0].id);
  };

  // Resolve the active step. For circular/linear cycles we look in cycle.steps.
  // For network cycles, we also resolve to the network enzyme/end definitions.
  let activeStepObj = activeStep ? cycle.steps.find(s => s.id === activeStep) : null;
  let activeNetworkNode = null;
  if (activeStep && !activeStepObj && cycle.network) {
    const enz = cycle.network.enzymes.find(e => e.id === activeStep);
    if (enz) {
      const hub = cycle.network.hubs.find(h => h.id === enz.fromHubId);
      const end = cycle.network.ends.find(e => e.fromEnzymeId === enz.id);
      activeNetworkNode = { kind: 'enzyme', enz, hub, end };
    } else {
      const end = cycle.network.ends.find(e => e.id === activeStep);
      if (end) {
        const enzyme = cycle.network.enzymes.find(e => e.id === end.fromEnzymeId);
        const hub = cycle.network.hubs.find(h => h.id === enzyme?.fromHubId);
        activeNetworkNode = { kind: 'end', end, enz: enzyme, hub };
      } else {
        const hub = cycle.network.hubs.find(h => h.id === activeStep);
        if (hub) activeNetworkNode = { kind: 'hub', hub };
      }
    }
  }
  const chapterNum = cycle.chapterOrder;
  const lang = 'en';  // English-only UI now

  const mnemonic = cycle.mnemonic?.en?.phrase || cycle.mnemonic?.en || cycle.mnemonic?.phrase || (typeof cycle.mnemonic === 'string' ? cycle.mnemonic : '');
  const overall = cycle.bigPicture?.en?.find?.(b => /overall/i.test(b.k))?.v || cycle.overallEquation;

  return (
    <div className="app-shell">
      <TopBar
        cycle={cycle}
        chapterNum={chapterNum}
        onStartCinema={startCinema}
        onToggleRail={() => setMobileRail(r => !r)}
        onToggleSide={() => setMobileSide(s => !s)}
      />

      <div className={`main-grid ${mobileRail ? 'mobile-rail-open' : ''} ${mobileSide ? 'mobile-side-open' : ''}`}>
        {/* Backdrop for mobile drawers */}
        <div className="mobile-backdrop" onClick={() => { setMobileRail(false); setMobileSide(false); }} />

        <LeftRail
          layers={layers}
          toggleLayer={toggleLayer}
          cycle={cycle}
          activeCycleId={activeCycleId}
          onSelectCycle={(id) => { setActiveCycleId(id); setMobileRail(false); }}
        />

        <section className="stage">
          {/* View tabs */}
          <div className="tabs">
            {[
              { id: 'explore', icon: Brain, label: 'Explore' },
              { id: 'integration', icon: GitBranch, label: 'Integration' },
              { id: 'quiz', icon: Target, label: 'Test' },
              { id: 'recall', icon: Brain, label: 'Recall' },
              { id: 'big', icon: Zap, label: 'Big Picture' },
              ...(cycle.pedagogy ? [{ id: 'pedagogy', icon: Zap, label: 'Deep Dive' }] : [])
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setView(t.id)}
                className={`tab ${view === t.id ? 'tab--active' : ''}`}
              >
                <t.icon style={{ width: 12, height: 12 }} /> {t.label}
              </button>
            ))}
          </div>

          {view === 'explore' && (
            <>
              {layers.tissue && cycle.context && (
                <div className="tissue-card">
                  <div className="tissue-card__k">Tissue</div>
                  <div className="tissue-card__v">{cycle.context.tissue?.en || cycle.context.tissue}</div>
                  <div className="tissue-card__sub">{cycle.context.state?.en || cycle.context.state}</div>
                </div>
              )}

              <div className="stage__frame">
                <span className="stage__hint">Drag any label to reposition</span>
                <div className="stage__font">
                  <button onClick={() => setFontScale(s => Math.max(0.75, +(s - 0.1).toFixed(2)))} aria-label="Smaller">A−</button>
                  <span>{Math.round(fontScale * 100)}%</span>
                  <button onClick={() => setFontScale(s => Math.min(1.6, +(s + 0.1).toFixed(2)))} aria-label="Larger">A+</button>
                </div>
                <button
                  className={`stage__spread ${spreadOn ? 'stage__spread--on' : ''}`}
                  onClick={() => setSpreadOn(v => !v)}
                  title={spreadOn ? 'Freeze current positions and allow manual dragging' : 'Keep labels spread apart (repulsion always on)'}
                >
                  ⚛ {spreadOn ? 'Freeze' : 'Spread'}
                </button>
                <button
                  className={`stage__story ${storyView ? 'stage__story--on' : ''}`}
                  onClick={() => setStoryView(v => !v)}
                  title={storyView ? 'Show enzyme abbreviations' : 'Show character emojis (story view)'}
                >
                  {storyView ? '🅰 Abbr' : '😊 Story'}
                </button>
                <button className="stage__reset" onClick={() => { setResetKey(k => k + 1); setFontScale(1); }} title="Reset label positions">
                  ↺ Reset
                </button>
                <div style={{
                  width: '100%', height: '100%',
                  display: 'flex', justifyContent: 'center', alignItems: 'center',
                  overflow: fontScale > 1 ? 'auto' : 'hidden'
                }}>
                  <div style={{
                    transform: `scale(${fontScale})`,
                    transformOrigin: 'center center',
                    width: '100%', height: '100%',
                    display: 'flex', justifyContent: 'center', alignItems: 'center'
                  }}>
                    <CycleDiagram
                      cycle={cycle}
                      lang={lang}
                      selectedStep={activeStep}
                      onSelectStep={setActiveStep}
                      hideMode={hideMode}
                      cinemaMode={cinemaOn}
                      storyView={storyView}
                      layers={layers}
                      resetKey={resetKey}
                      spreadOn={spreadOn}
                    />
                  </div>
                </div>
              </div>

              {mnemonic && (
                <div className="mnemonic">
                  <span className="mnemonic__k">Mnemonic</span>
                  <span className="mnemonic__v">“{mnemonic}”</span>
                </div>
              )}
              {overall && (
                <div className="equation">
                  <span className="equation__k">Overall</span>
                  <span className="equation__v">{overall}</span>
                </div>
              )}
            </>
          )}

          {view === 'integration' && (
            <div style={{ flex: 1, overflowY: 'auto' }}>
              <IntegrationView cycle={cycle} lang={lang} />
            </div>
          )}

          {view === 'quiz' && (
            <div style={{ flex: 1, overflowY: 'auto' }}>
              <Quiz
                cycle={cycle}
                lang={lang}
                onExit={() => { setMasteryTrigger(t => t + 1); setView('explore'); }}
              />
            </div>
          )}

          {view === 'recall' && (
            <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <ActiveRecall
                cycle={cycle}
                lang={lang}
                onExit={() => setView('explore')}
              />
            </div>
          )}

          {view === 'big' && (
            <div style={{ flex: 1, overflowY: 'auto', padding: '8px 16px' }}>
              <BigPicture cycle={cycle} />
            </div>
          )}

          {view === 'pedagogy' && (
            <div style={{ flex: 1, overflowY: 'auto', padding: '8px 16px' }}>
              <PedagogyView cycle={cycle} />
            </div>
          )}
        </section>

        <aside className="side">
          <AnimatePresence mode="wait">
            {activeStepObj ? (
              <motion.div
                key={`step-${activeStepObj.id}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
              >
                <StepCardAdapter
                  step={activeStepObj}
                  cycle={cycle}
                  onClose={() => setActiveStep(null)}
                />
              </motion.div>
            ) : activeNetworkNode ? (
              <motion.div
                key={`net-${activeStep}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
              >
                <NetworkHintCard
                  node={activeNetworkNode}
                  cycle={cycle}
                  onClose={() => setActiveStep(null)}
                />
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <EmptyState cycle={cycle} onPickStep={setActiveStep} />
              </motion.div>
            )}
          </AnimatePresence>
        </aside>
      </div>

      {cinemaOn && (
        <CinemaBar
          cycle={cycle}
          stepIndex={cinemaStep} beatIndex={cinemaBeat}
          setStepIndex={setCinemaStep} setBeatIndex={setCinemaBeat}
          playing={cinemaPlaying} setPlaying={setCinemaPlaying}
          onClose={() => { setCinemaOn(false); }}
        />
      )}
    </div>
  );
}

function BigPicture({ cycle }) {
  const bp = cycle.bigPicture?.en || [];
  return (
    <div className="tissue-card" style={{ maxWidth: 760, margin: '0 auto' }}>
      <div style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 600, marginBottom: 12 }}>
        Big Picture
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {bp.map((item, i) => (
          <div key={i} className="field" style={{ borderBottom: '1px solid var(--line-soft)', paddingBottom: 6 }}>
            <div className="field__k">{item.k}</div>
            <div className="field__v" style={{ fontWeight: 500, fontSize: 13 }}>{item.v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PedagogyView({ cycle }) {
  const cards = cycle.pedagogy || [];
  if (!cards.length) {
    return (
      <div style={{ maxWidth: 760, margin: '40px auto', textAlign: 'center', color: '#64748b' }}>
        No deep-dive pedagogy added yet for this cycle.
      </div>
    );
  }
  // Render text with **bold** markdown
  const renderRich = (text) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((p, i) =>
      p.startsWith('**') && p.endsWith('**')
        ? <strong key={i}>{p.slice(2, -2)}</strong>
        : <span key={i}>{p}</span>
    );
  };
  return (
    <div style={{ maxWidth: 760, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 600, marginBottom: 4 }}>
        Deep Dive
      </div>
      <div style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 8 }}>
        High-yield concepts explained as if a tutor were walking you through them.
      </div>
      {cards.map((card, i) => (
        <div key={i} className="pedagogy-card">
          <div className="pedagogy-card__hdr">
            <span className="pedagogy-card__icon">{card.icon || '💡'}</span>
            <span className="pedagogy-card__title">{card.title}</span>
          </div>
          <div className="pedagogy-card__body">
            {card.body.split('\n\n').map((para, j) => (
              <p key={j} style={{ margin: '0 0 10px 0', whiteSpace: 'pre-wrap' }}>{renderRich(para)}</p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
