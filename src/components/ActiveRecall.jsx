import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, RefreshCw, Brain } from 'lucide-react';
import { shuffle } from '../srs.js';

// ============================================================
// SRS error log — keyed per cycle in localStorage
// ============================================================
const ERR_KEY = (cycleId) => `recall_errors_${cycleId}`;

function loadErrors(cycleId) {
  try {
    return JSON.parse(localStorage.getItem(ERR_KEY(cycleId)) || '{}');
  } catch { return {}; }
}
function saveErrors(cycleId, errors) {
  try { localStorage.setItem(ERR_KEY(cycleId), JSON.stringify(errors)); } catch {}
}

// ============================================================
// Slot extraction — derive all "placeable" items from the cycle.
// Each slot has a stable id, position (x, y), label, optional emoji.
// ============================================================
function buildSlots(cycle) {
  const layout = cycle.layout || 'circular';
  const characters = cycle.storyFrame?.en?.characters || [];
  const slots = [];

  // ----- NETWORK layout (e.g. AA biosynthesis) -----
  if (layout === 'network' && cycle.network) {
    const net = cycle.network;
    // Each enzyme node sits midway between its hub and end
    net.enzymes.forEach(enz => {
      const hub = net.hubs.find(h => h.id === enz.fromHubId);
      const end = net.ends.find(e => e.fromEnzymeId === enz.id);
      if (!hub || !end) return;
      slots.push({
        id: enz.id,
        kind: 'enzyme',
        x: (hub.x + end.x) / 2,
        y: (hub.y + end.y) / 2,
        radius: 30,
        label: enz.label,
        accent: hub.color
      });
    });
    // Each end (amino acid) is a slot — using larger hit radius matching the rounded rect (~110×44)
    net.ends.forEach(end => {
      slots.push({
        id: end.id,
        kind: 'end',
        x: end.x,
        y: end.y,
        radius: 36,
        label: end.label,
        sublabel: end.sublabel,
        accent: end.color
      });
    });
    return { slots, layout, network: net };
  }

  // ----- Enzymes -----
  if (layout === 'circular') {
    const cx = 380, cy = 380, r = 200;
    cycle.steps.forEach((s, i) => {
      const rad = (s.angle * Math.PI) / 180;
      const char = characters[i];
      slots.push({
        id: `enz-${s.id}`,
        kind: 'enzyme',
        x: cx + r * Math.cos(rad),
        y: cy + r * Math.sin(rad),
        radius: 38,
        label: s.enzyme.abbr,
        emoji: char?.icon,
        accent: char?.color || (s.compartment === 'mito' ? '#f59e0b' : '#3b82f6')
      });
    });
  } else {
    // linear
    const n = cycle.steps.length;
    const useTwoRows = n > 6;
    const perRow = useTwoRows ? Math.ceil(n / 2) : n;
    const svgW = 960, svgH = useTwoRows ? 600 : 360;
    const marginX = 120;
    const xStep = (svgW - marginX * 2) / (perRow - 1);
    const topY = useTwoRows ? 180 : svgH / 2;
    const bottomY = useTwoRows ? 450 : svgH / 2;
    cycle.steps.forEach((s, i) => {
      const onTop = i < perRow;
      const col = onTop ? i : (n - 1 - i);
      const char = characters[i];
      slots.push({
        id: `enz-${s.id}`,
        kind: 'enzyme',
        x: marginX + col * xStep,
        y: onTop ? topY : bottomY,
        radius: 34,
        label: s.enzyme.abbr,
        emoji: char?.icon,
        accent: char?.color || (s.phase === 'investment' ? '#f97316' : s.phase === 'payoff' ? '#10b981' : '#3b82f6')
      });
    });
  }

  // ----- Intermediates -----
  if (layout === 'circular') {
    const cx = 380, cy = 380, r = 200;
    const enzymePositions = cycle.steps.map(s => {
      const rad = (s.angle * Math.PI) / 180;
      return { id: s.id, x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad), rad };
    });
    (cycle.intermediates || []).forEach((inter, idx) => {
      const fromStep = enzymePositions.find(e => e.id === inter.afterStep);
      const toStep = enzymePositions.find(e => e.id === inter.beforeStep);
      if (!fromStep || !toStep) return;
      let a1 = fromStep.rad, a2 = toStep.rad;
      if (a2 < a1) a2 += 2 * Math.PI;
      const midRad = (a1 + a2) / 2;
      const midR = r - 70;
      slots.push({
        id: `int-${inter.id || idx}`,
        kind: 'intermediate',
        x: cx + midR * Math.cos(midRad),
        y: cy + midR * Math.sin(midRad),
        radius: 28,
        label: inter.name,
        accent: '#64748b'
      });
    });
  } else {
    // linear intermediates sit between consecutive steps
    const enzSlots = slots.filter(s => s.kind === 'enzyme');
    (cycle.intermediates || []).forEach((inter, idx) => {
      const fromStep = enzSlots.find(s => s.id === `enz-${inter.afterStep}`);
      const toStep = enzSlots.find(s => s.id === `enz-${inter.beforeStep}`);
      if (!fromStep || !toStep) return;
      slots.push({
        id: `int-${inter.id || idx}`,
        kind: 'intermediate',
        x: (fromStep.x + toStep.x) / 2,
        y: (fromStep.y + toStep.y) / 2 - 18,
        radius: 22,
        label: inter.name,
        accent: '#64748b'
      });
    });
  }

  return { slots, layout };
}

// ============================================================
// Pick which slots to occlude based on error log
// (items missed before are 2x more likely to be picked)
// ============================================================
function pickOcclusions(slots, errors, count) {
  // Score each slot by error count + small random factor
  const weighted = slots.map(s => ({
    slot: s,
    weight: 1 + (errors[s.id] || 0) * 2 + Math.random() * 0.5
  }));
  weighted.sort((a, b) => b.weight - a.weight);
  return weighted.slice(0, Math.min(count, slots.length)).map(w => w.slot);
}

// ============================================================
// Build distractors — labels from other slots not currently hidden
// ============================================================
function buildDistractors(allSlots, hiddenSlots, count) {
  const hiddenIds = new Set(hiddenSlots.map(s => s.id));
  const others = allSlots.filter(s => !hiddenIds.has(s.id));
  return shuffle(others).slice(0, count);
}

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function ActiveRecall({ cycle, lang, onExit }) {
  const layout = cycle.layout || 'circular';
  const network = cycle.network;
  const viewBox = layout === 'network' && network?.viewBox
    ? `${network.viewBox.join(' ')}`
    : layout === 'circular'
    ? '-30 -30 820 820'
    : `0 0 960 ${cycle.steps.length > 6 ? 600 : 360}`;

  const allSlots = useMemo(() => buildSlots(cycle).slots, [cycle.id]);

  // Round state
  const [errorLog, setErrorLog] = useState(() => loadErrors(cycle.id));
  const [hiddenSlots, setHiddenSlots] = useState([]);   // [slot]
  const [heap, setHeap] = useState([]);                 // [{id, label, emoji, accent, sourceSlot}]
  const [revealed, setRevealed] = useState({});         // { slotId: true } — correctly placed
  const [shakeId, setShakeId] = useState(null);
  const [score, setScore] = useState({ correct: 0, wrong: 0 });
  const [finished, setFinished] = useState(false);

  // Drag state
  const [dragging, setDragging] = useState(null);   // {id, label, emoji, accent, x, y}
  const [hoverSlotId, setHoverSlotId] = useState(null);
  const stageRef = useRef(null);

  // ---------- Round generation ----------
  function newRound() {
    const N = 3 + Math.floor(Math.random() * 4); // 3-6 occlusions
    const hidden = pickOcclusions(allSlots, errorLog, N);
    setHiddenSlots(hidden);
    const distractors = buildDistractors(allSlots, hidden, Math.min(3, allSlots.length - hidden.length));
    const heapItems = shuffle([
      ...hidden.map(s => ({ ...s, isCorrect: true })),
      ...distractors.map(s => ({ ...s, isCorrect: false }))
    ]).map((s, i) => ({ ...s, heapIdx: i }));
    setHeap(heapItems);
    setRevealed({});
    setScore({ correct: 0, wrong: 0 });
    setFinished(false);
    setDragging(null);
    setHoverSlotId(null);
  }

  useEffect(() => { newRound(); }, [cycle.id]);

  // ---------- SVG → DOM coordinate helpers ----------
  // Convert SVG coords (x, y in viewBox) to pixels relative to stageRef
  const svgToPx = useCallback((sx, sy) => {
    const stage = stageRef.current;
    if (!stage) return { x: 0, y: 0 };
    const svg = stage.querySelector('svg.recall-map');
    if (!svg) return { x: 0, y: 0 };
    const pt = svg.createSVGPoint();
    pt.x = sx; pt.y = sy;
    const ctm = svg.getScreenCTM();
    if (!ctm) return { x: 0, y: 0 };
    const screen = pt.matrixTransform(ctm);
    const stageRect = stage.getBoundingClientRect();
    return { x: screen.x - stageRect.left, y: screen.y - stageRect.top };
  }, []);

  // Map a clientX/clientY from a pointer event to SVG coords
  const clientToSvg = useCallback((clientX, clientY) => {
    const stage = stageRef.current;
    if (!stage) return null;
    const svg = stage.querySelector('svg.recall-map');
    if (!svg) return null;
    const pt = svg.createSVGPoint();
    pt.x = clientX; pt.y = clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return null;
    return pt.matrixTransform(ctm.inverse());
  }, []);

  // ---------- Drag handlers ----------
  const onHeapPointerDown = (e, item) => {
    e.preventDefault();
    if (!item || revealed[item.id]) return;
    const stage = stageRef.current;
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    setDragging({
      ...item,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    try { e.target.setPointerCapture(e.pointerId); } catch {}
  };

  const onPointerMove = (e) => {
    if (!dragging) return;
    const stage = stageRef.current;
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    setDragging(d => ({ ...d, x: px, y: py }));

    // Hit-test occluded slots
    const svgPt = clientToSvg(e.clientX, e.clientY);
    if (!svgPt) return;
    let nearest = null;
    let nearestDist = Infinity;
    hiddenSlots.forEach(s => {
      if (revealed[s.id]) return;
      const d = Math.hypot(svgPt.x - s.x, svgPt.y - s.y);
      if (d < (s.radius + 12) && d < nearestDist) {
        nearestDist = d;
        nearest = s.id;
      }
    });
    setHoverSlotId(nearest);
  };

  const onPointerUp = (e) => {
    if (!dragging) return;
    const targetSlotId = hoverSlotId;
    const itemId = dragging.id;
    setHoverSlotId(null);
    setDragging(null);

    if (!targetSlotId) return;  // dropped on nothing

    // Resolve outcome
    if (targetSlotId === itemId) {
      // Correct!
      setRevealed(prev => {
        const next = { ...prev, [targetSlotId]: true };
        // Check completion — count hidden slots that are now revealed
        const totalHidden = hiddenSlots.length;
        const newlyRevealedCount = Object.keys(next).filter(k => hiddenSlots.some(s => s.id === k)).length;
        if (newlyRevealedCount === totalHidden) {
          setTimeout(() => setFinished(true), 700);
        }
        return next;
      });
      setScore(s => ({ ...s, correct: s.correct + 1 }));
      setHeap(h => h.filter(x => x.id !== itemId));
    } else {
      // Wrong — log error against the chip the user struggled with
      // (so it's prioritized for occlusion in future rounds)
      const newErrors = { ...errorLog };
      newErrors[itemId] = (newErrors[itemId] || 0) + 1;
      setErrorLog(newErrors);
      saveErrors(cycle.id, newErrors);
      setScore(s => ({ ...s, wrong: s.wrong + 1 }));
      // Shake the wrong target
      setShakeId(targetSlotId);
      setTimeout(() => setShakeId(null), 500);
      // Item returns to heap automatically (we never removed it)
    }
  };

  // Track if everything was correctly placed
  const allDone = hiddenSlots.length > 0 && hiddenSlots.every(s => revealed[s.id]);

  // ---------- Render ----------
  if (finished) {
    const total = hiddenSlots.length;
    const accuracy = score.correct + score.wrong > 0
      ? Math.round((score.correct / (score.correct + score.wrong)) * 100)
      : 100;
    const grade = accuracy >= 95 ? 'A+' : accuracy >= 85 ? 'A' : accuracy >= 75 ? 'B' : accuracy >= 65 ? 'C' : accuracy >= 50 ? 'D' : 'F';
    const gradeColor = accuracy >= 80 ? 'text-emerald-600' : accuracy >= 60 ? 'text-amber-600' : 'text-rose-600';
    const emoji = accuracy >= 95 ? '🧠' : accuracy >= 85 ? '🎯' : accuracy >= 75 ? '👏' : accuracy >= 65 ? '👍' : '📚';

    return (
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-2xl border border-stone-200 p-8">
          <div className="text-center mb-6">
            <div className="text-6xl mb-3">{emoji}</div>
            <div className="text-sm text-slate-500 uppercase tracking-wider font-bold mb-2">Round Complete</div>
            <div className={`text-7xl font-bold ${gradeColor} mb-2`} style={{ fontFamily: "'Fraunces', serif" }}>
              {accuracy}<span className="text-4xl text-slate-400">%</span>
            </div>
            <div className={`text-3xl font-black ${gradeColor} mb-1`}>{grade}</div>
            <div className="text-sm text-slate-500">
              {score.correct} correct · {score.wrong} wrong attempt{score.wrong === 1 ? '' : 's'}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={newRound}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition"
            >
              <RefreshCw className="w-4 h-4" /> Next Round
            </button>
            <button
              onClick={onExit}
              className="flex-1 py-3 rounded-xl border-2 border-slate-200 font-semibold hover:border-slate-400 transition"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Get the cycle's enzymes & intermediate positions for the static map
  // We render the cycle ourselves here so we can occlude items inline.
  return (
    <div className="recall-stage" ref={stageRef}
         onPointerMove={onPointerMove}
         onPointerUp={onPointerUp}
         onPointerCancel={onPointerUp}
    >
      {/* Header */}
      <div className="recall-hdr">
        <div className="recall-hdr__left">
          <div className="recall-hdr__title">
            <Brain className="w-4 h-4" />
            Active Recall
          </div>
          <div className="recall-hdr__sub">
            {hiddenSlots.length - Object.keys(revealed).length} remaining
          </div>
        </div>
        <div className="recall-hdr__score">
          <span className="recall-score recall-score--good"><Check className="w-3.5 h-3.5" /> {score.correct}</span>
          <span className="recall-score recall-score--bad"><X className="w-3.5 h-3.5" /> {score.wrong}</span>
        </div>
        <div className="recall-hdr__right">
          <button className="recall-btn recall-btn--primary" onClick={newRound} title="Start a new round prioritising weak items">
            <RefreshCw className="w-3.5 h-3.5" /> Consolidate &amp; Refresh
          </button>
          <button className="recall-btn" onClick={onExit}>Exit</button>
        </div>
      </div>

      {/* Map */}
      <div className="recall-map-wrap">
        <RecallMap
          cycle={cycle}
          allSlots={allSlots}
          hiddenSlots={hiddenSlots}
          revealed={revealed}
          hoverSlotId={hoverSlotId}
          shakeId={shakeId}
          viewBox={viewBox}
          layout={layout}
          lang={lang}
        />
      </div>

      {/* Source heap */}
      <div className="recall-heap">
        <div className="recall-heap__title">Drag the right component to its <span className="recall-q">?</span> on the map</div>
        <div className="recall-heap__items">
          {heap.length === 0 && (
            <div className="recall-heap__empty">All placed! 🎉</div>
          )}
          {heap.map(item => {
            const isBeingDragged = dragging?.heapIdx === item.heapIdx;
            return (
              <button
                key={item.heapIdx}
                className={`recall-chip ${isBeingDragged ? 'recall-chip--dragging' : ''}`}
                style={{ borderColor: item.accent }}
                onPointerDown={(e) => onHeapPointerDown(e, item)}
                onContextMenu={(e) => e.preventDefault()}
              >
                {item.emoji && (
                  <span className="recall-chip__emoji" style={{ background: `${item.accent}20`, borderColor: item.accent }}>
                    {item.emoji}
                  </span>
                )}
                <span className="recall-chip__label">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Floating drag preview */}
      <AnimatePresence>
        {dragging && (
          <motion.div
            className="recall-ghost"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ duration: 0.12 }}
            style={{
              left: dragging.x,
              top: dragging.y,
              borderColor: dragging.accent
            }}
          >
            {dragging.emoji && (
              <span className="recall-ghost__emoji" style={{ background: `${dragging.accent}30`, borderColor: dragging.accent }}>
                {dragging.emoji}
              </span>
            )}
            <span>{dragging.label}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================
// RecallMap — renders the populated cycle, with occluded slots shown as ?
// Uses the same geometry as the Explore diagram.
// ============================================================
function RecallMap({ cycle, allSlots, hiddenSlots, revealed, hoverSlotId, shakeId, viewBox, layout, lang }) {
  // ----- NETWORK layout shortcut -----
  if (layout === 'network' && cycle.network) {
    return <NetworkRecallMap
      cycle={cycle}
      allSlots={allSlots}
      hiddenSlots={hiddenSlots}
      revealed={revealed}
      hoverSlotId={hoverSlotId}
      shakeId={shakeId}
      viewBox={viewBox}
    />;
  }

  const characters = cycle.storyFrame?.[lang]?.characters || cycle.storyFrame?.en?.characters || [];
  const hasMultiCompartment = layout === 'circular' && Object.keys(cycle.compartments || {}).length > 1;
  const cx = 380, cy = 380, r = 200;

  const enzSlots = allSlots.filter(s => s.kind === 'enzyme');
  const intSlots = allSlots.filter(s => s.kind === 'intermediate');

  const isOccluded = (id) => hiddenSlots.some(s => s.id === id) && !revealed[id];

  // ----- Connecting arrows -----
  let arrows = [];
  if (layout === 'circular') {
    arrows = enzSlots.map((s, i) => {
      const next = enzSlots[(i + 1) % enzSlots.length];
      // shorten to circle edge
      const enzR = s.radius;
      const a1 = Math.atan2(s.y - cy, s.x - cx);
      const a2 = Math.atan2(next.y - cy, next.x - cx);
      let aA = a1, aB = a2;
      if (aB < aA) aB += 2 * Math.PI;
      const midRad = (aA + aB) / 2;
      const midR = r + 30;
      const mx = cx + midR * Math.cos(midRad);
      const my = cy + midR * Math.sin(midRad);
      const dx1 = mx - s.x, dy1 = my - s.y;
      const len1 = Math.hypot(dx1, dy1) || 1;
      const sx = s.x + (dx1 / len1) * enzR;
      const sy = s.y + (dy1 / len1) * enzR;
      const dx2 = mx - next.x, dy2 = my - next.y;
      const len2 = Math.hypot(dx2, dy2) || 1;
      const ex = next.x + (dx2 / len2) * next.radius;
      const ey = next.y + (dy2 / len2) * next.radius;
      return { d: `M ${sx} ${sy} Q ${mx} ${my} ${ex} ${ey}`, key: i };
    });
  } else {
    // linear — straight lines or row-wrap
    const n = enzSlots.length;
    const useTwoRows = n > 6;
    const perRow = useTwoRows ? Math.ceil(n / 2) : n;
    const svgW = 960;
    arrows = enzSlots.slice(0, -1).map((s, i) => {
      const next = enzSlots[i + 1];
      const sameRow = (i < perRow - 1 && i + 1 < perRow) || (i >= perRow);
      let path;
      if (sameRow) {
        path = `M ${s.x + s.radius} ${s.y} L ${next.x - s.radius} ${next.y}`;
      } else {
        // row transition
        path = `M ${s.x + s.radius} ${s.y} L ${svgW - 30} ${s.y} L ${svgW - 30} ${next.y} L ${next.x + s.radius} ${next.y}`;
      }
      return { d: path, key: i };
    });
  }

  return (
    <svg viewBox={viewBox} className="recall-map" preserveAspectRatio="xMidYMid meet">
      <defs>
        <marker id="rcArrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
        </marker>
        <linearGradient id="rcMito" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="100%" stopColor="#fde68a" />
        </linearGradient>
        <linearGradient id="rcCyto" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#dbeafe" />
          <stop offset="100%" stopColor="#bfdbfe" />
        </linearGradient>
        <filter id="rcShake">
          <feTurbulence baseFrequency="0.02" numOctaves="2" seed="2" />
        </filter>
      </defs>

      {/* compartments */}
      {hasMultiCompartment && (
        <>
          <path d={`M ${cx - 340} ${cy} A 340 340 0 0 1 ${cx + 340} ${cy} Z`} fill="url(#rcMito)" opacity="0.55" />
          <path d={`M ${cx + 340} ${cy} A 340 340 0 0 1 ${cx - 340} ${cy} Z`} fill="url(#rcCyto)" opacity="0.55" />
        </>
      )}
      {layout === 'circular' && !hasMultiCompartment && (
        <rect x="40" y="40" width="680" height="680" rx="30" fill="url(#rcCyto)" opacity="0.35" />
      )}

      {/* arrows */}
      {arrows.map(a => (
        <path key={a.key} d={a.d} stroke="#cbd5e1" strokeWidth="1.5" fill="none" markerEnd="url(#rcArrow)" />
      ))}

      {/* intermediates (text pills) */}
      {intSlots.map(s => {
        const occluded = isOccluded(s.id);
        const isHover = hoverSlotId === s.id;
        const isShaking = shakeId === s.id;
        const reveal = revealed[s.id];
        const txt = occluded ? '?' : s.label;
        const boxW = Math.max(60, txt.length * 6.4 + 24);
        return (
          <motion.g
            key={s.id}
            animate={isShaking ? { x: [0, -6, 6, -4, 4, 0] } : { x: 0 }}
            transition={isShaking ? { duration: 0.4 } : {}}
          >
            <rect
              x={s.x - boxW / 2} y={s.y - 13} width={boxW} height="26" rx="13"
              fill={occluded ? (isHover ? '#dcfce7' : '#fef3c7') : 'white'}
              stroke={occluded ? (isHover ? '#10b981' : '#f59e0b') : '#cbd5e1'}
              strokeWidth={occluded ? 2 : 1}
              strokeDasharray={occluded && !isHover ? '4 3' : 'none'}
            />
            <text x={s.x} y={s.y + 4} textAnchor="middle"
                  style={{
                    fontSize: occluded ? 16 : 11,
                    fontWeight: occluded ? 800 : 600,
                    fill: occluded ? (isHover ? '#059669' : '#b45309') : '#334155'
                  }}>
              {reveal ? (
                <tspan>
                  <tspan>{s.label}</tspan>
                </tspan>
              ) : txt}
            </text>
            {reveal && (
              <motion.circle
                cx={s.x + boxW / 2 - 8} cy={s.y - 13 + 8} r="6"
                fill="#10b981"
                initial={{ scale: 0 }} animate={{ scale: 1 }}
              />
            )}
          </motion.g>
        );
      })}

      {/* enzymes (circles with abbr or emoji) */}
      {enzSlots.map((s, i) => {
        const occluded = isOccluded(s.id);
        const reveal = revealed[s.id];
        const isHover = hoverSlotId === s.id;
        const isShaking = shakeId === s.id;
        const fillColor = occluded
          ? (isHover ? '#dcfce7' : '#fef3c7')
          : (reveal ? '#bbf7d0' : `${s.accent}30`);
        const strokeColor = occluded
          ? (isHover ? '#10b981' : '#f59e0b')
          : s.accent;
        return (
          <motion.g
            key={s.id}
            animate={isShaking ? { x: [0, -8, 8, -6, 6, 0] } : { x: 0 }}
            transition={isShaking ? { duration: 0.45 } : {}}
          >
            <circle
              cx={s.x} cy={s.y} r={s.radius}
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={occluded ? 3 : 2}
              strokeDasharray={occluded && !isHover ? '5 4' : 'none'}
            />
            {occluded ? (
              <text x={s.x} y={s.y + 8} textAnchor="middle"
                    style={{ fontSize: 28, fontWeight: 800,
                             fill: isHover ? '#059669' : '#b45309' }}>?</text>
            ) : s.emoji ? (
              <>
                <text x={s.x} y={s.y + 4} textAnchor="middle" dominantBaseline="central"
                      style={{ fontSize: 28, pointerEvents: 'none' }}>{s.emoji}</text>
                <text x={s.x} y={s.y + s.radius + 14} textAnchor="middle"
                      style={{ fontSize: 11, fontWeight: 800, fill: '#334155' }}>
                  {s.label}
                </text>
              </>
            ) : (
              <text x={s.x} y={s.y + 4} textAnchor="middle"
                    style={{ fontSize: 12, fontWeight: 800, fill: '#334155' }}>
                {s.label}
              </text>
            )}
            {reveal && (
              <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }}>
                <circle cx={s.x + s.radius - 4} cy={s.y - s.radius + 4} r="9" fill="#10b981" />
                <text x={s.x + s.radius - 4} y={s.y - s.radius + 8} textAnchor="middle"
                      style={{ fontSize: 11, fontWeight: 800, fill: 'white' }}>✓</text>
              </motion.g>
            )}
          </motion.g>
        );
      })}
    </svg>
  );
}

// ============================================================
// NetworkRecallMap — branching pathway diagram with occlusion support
// (used for AA biosynthesis and other tree-shaped pathways)
// ============================================================
// ============================================================
// NetworkRecallMap — delegates to NetworkDiagram with occlusion props.
// All container/label sizing logic lives in NetworkDiagram so the
// recall map stays visually identical to Explore mode.
// ============================================================
import NetworkDiagram from './NetworkDiagram.jsx';

function NetworkRecallMap({ cycle, allSlots, hiddenSlots, revealed, hoverSlotId, shakeId, viewBox }) {
  const hiddenIds = new Set(hiddenSlots.map(s => s.id));
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <NetworkDiagram
        cycle={cycle}
        hiddenIds={hiddenIds}
        revealedIds={revealed}
        hoverId={hoverSlotId}
        shakeId={shakeId}
      />
    </div>
  );
}
