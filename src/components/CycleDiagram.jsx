import { motion } from 'framer-motion';
import { useState, useRef, useEffect, useCallback } from 'react';

// ============================================================
// REGULATOR LABEL HELPER
// Converts a regulator name + direction into standard medical-textbook notation.
// Energy molecules (ATP/ADP/AMP/GTP/GDP) are ambiguous when prefixed with ±
// because the reader can't tell if it means "this rises" or "is consumed".
// Convention:
//   +X   : X activates this step  (green)
//   −X   : X inhibits this step   (red)
//   ↑ATP : when ATP is high       (energy — context clearer)
//   ↑AMP : when AMP is high
// We add an arrow prefix for energy molecules to disambiguate.
// ============================================================
const ENERGY_REGULATORS = new Set(['ATP', 'ADP', 'AMP', 'GTP', 'GDP', 'NADH', 'NADPH', 'FADH2', 'FADH₂']);

function formatRegulatorLabel(name, kind /* 'act' | 'inh' */) {
  // Strip parentheticals and commas for compactness
  const core = name.split(/[\s(]/)[0].replace(/[,]/g, '');
  if (ENERGY_REGULATORS.has(core)) {
    // Energy molecule — use "↑" arrow to show "when this rises, it activates/inhibits"
    // Color still reflects the net effect (green = activator, red = inhibitor)
    return `↑${core}`;
  }
  return kind === 'act' ? `+${core}` : `−${core}`;
}

// ============================================================
// DRAG SUPPORT + AUTO-SPREAD
// Each text label registers its anchor (default position) + current offset.
// Physics simulation treats each label as a charged particle attached by
// a spring to its anchor, with Coulomb-style repulsion between all labels.
// ============================================================
function useLabelOffsets(resetKey) {
  const [offsets, setOffsets] = useState({});
  // Mirror offsets in a ref so the spread loop always reads the latest values
  // without needing to depend on `offsets` (which would cause the loop to reinstall)
  const offsetsRef = useRef({});
  useEffect(() => { offsetsRef.current = offsets; }, [offsets]);

  const anchors = useRef({});

  useEffect(() => {
    setOffsets({});
    offsetsRef.current = {};
  }, [resetKey]);

  const getOffset = useCallback((id) => offsets[id] || { dx: 0, dy: 0 }, [offsets]);
  const setOffset = useCallback((id, dx, dy) => {
    setOffsets(prev => ({ ...prev, [id]: { dx, dy } }));
  }, []);
  const registerAnchor = useCallback((id, anchor) => {
    anchors.current[id] = anchor;
  }, []);
  const unregisterAnchor = useCallback((id) => {
    delete anchors.current[id];
  }, []);

  // Physics-based spread. Runs a given number of iterations (default 120).
  const spread = useCallback((viewBox, steps = 120) => {
    const keys = Object.keys(anchors.current);
    if (keys.length < 2) return;
    const p = keys.map(id => {
      const a = anchors.current[id];
      const curOff = offsetsRef.current[id] || { dx: 0, dy: 0 };
      return {
        id,
        ax: a.x, ay: a.y,
        px: a.x + curOff.dx, py: a.y + curOff.dy,
        hw: (a.w || 40) / 2 + 4,
        hh: (a.h || 18) / 2 + 3,
        vx: 0, vy: 0
      };
    });
    const [vbx, vby, vbw, vbh] = viewBox;
    const REPEL = 1200;
    const SPRING = 0.08;
    const DAMP = 0.72;
    const MIN_DIST = 8;
    for (let it = 0; it < steps; it++) {
      const fx = new Array(p.length).fill(0);
      const fy = new Array(p.length).fill(0);
      for (let i = 0; i < p.length; i++) {
        for (let j = i + 1; j < p.length; j++) {
          const a = p[i], b = p[j];
          const dx = a.px - b.px;
          const dy = a.py - b.py;
          const minDx = a.hw + b.hw;
          const minDy = a.hh + b.hh;
          const r = Math.max(MIN_DIST, Math.hypot(dx, dy));
          const overlap = Math.max(0, minDx + minDy - r);
          const strength = REPEL / (r * r) + overlap * 0.15;
          const ux = dx / r, uy = dy / r;
          fx[i] += ux * strength; fy[i] += uy * strength;
          fx[j] -= ux * strength; fy[j] -= uy * strength;
        }
      }
      for (let i = 0; i < p.length; i++) {
        const pt = p[i];
        fx[i] += (pt.ax - pt.px) * SPRING;
        fy[i] += (pt.ay - pt.py) * SPRING;
        pt.vx = (pt.vx + fx[i]) * DAMP;
        pt.vy = (pt.vy + fy[i]) * DAMP;
        pt.px += pt.vx;
        pt.py += pt.vy;
        pt.px = Math.max(vbx + 4 + pt.hw, Math.min(vbx + vbw - 4 - pt.hw, pt.px));
        pt.py = Math.max(vby + 4 + pt.hh, Math.min(vby + vbh - 4 - pt.hh, pt.py));
      }
    }
    const next = {};
    p.forEach(pt => {
      next[pt.id] = { dx: pt.px - pt.ax, dy: pt.py - pt.ay };
    });
    // Merge with existing offsets (preserve any label that's dragging / not in sim)
    setOffsets(prev => ({ ...prev, ...next }));
  }, []);

  return { getOffset, setOffset, registerAnchor, unregisterAnchor, spread };
}

// Wrapper that renders children as a <g> translated by (dx, dy) and makes it
// draggable via pointer events. Optional `linkTo` draws a dashed line from
// label to its source element so the user can see which step it belongs to.
function Draggable({
  id, x, y, w = 80, h = 22, getOffset, setOffset, registerAnchor, unregisterAnchor, viewBox,
  linkTo = null, showLink = false,
  children
}) {
  const ref = useRef(null);
  const dragState = useRef({ active: false, startX: 0, startY: 0, startDx: 0, startDy: 0 });
  const { dx, dy } = getOffset(id);

  useEffect(() => {
    if (registerAnchor) registerAnchor(id, { x, y, w, h });
    return () => { if (unregisterAnchor) unregisterAnchor(id); };
  }, [id, x, y, w, h, registerAnchor, unregisterAnchor]);

  const toSvg = useCallback((clientX, clientY) => {
    const svg = ref.current?.ownerSVGElement;
    if (!svg) return { x: 0, y: 0 };
    const pt = svg.createSVGPoint();
    pt.x = clientX; pt.y = clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return { x: 0, y: 0 };
    const local = pt.matrixTransform(ctm.inverse());
    return { x: local.x, y: local.y };
  }, []);

  const onPointerDown = (e) => {
    e.stopPropagation();
    const { x: sx, y: sy } = toSvg(e.clientX, e.clientY);
    dragState.current = { active: true, startX: sx, startY: sy, startDx: dx, startDy: dy };
    try { e.target.setPointerCapture(e.pointerId); } catch {}
  };
  const onPointerMove = (e) => {
    if (!dragState.current.active) return;
    e.stopPropagation();
    const { x: sx, y: sy } = toSvg(e.clientX, e.clientY);
    const ndx = dragState.current.startDx + (sx - dragState.current.startX);
    const ndy = dragState.current.startDy + (sy - dragState.current.startY);
    const margin = 4;
    const [vbx, vby, vbw, vbh] = viewBox;
    const clampedX = Math.max(vbx + margin - x, Math.min(vbx + vbw - margin - x, ndx));
    const clampedY = Math.max(vby + margin - y, Math.min(vby + vbh - margin - y, ndy));
    setOffset(id, clampedX, clampedY);
  };
  const onPointerUp = (e) => {
    if (!dragState.current.active) return;
    e.stopPropagation();
    dragState.current.active = false;
    try { e.target.releasePointerCapture(e.pointerId); } catch {}
  };

  // Show a dashed connector only when the label has actually moved OR when explicitly requested
  const labelMoved = Math.hypot(dx, dy) > 3;
  const renderLink = showLink && linkTo && labelMoved;
  // Current label center in SVG coords (accounting for drag offset)
  const curX = x + dx;
  const curY = y + dy;

  return (
    <>
      {renderLink && (
        <line
          x1={linkTo.x} y1={linkTo.y}
          x2={curX} y2={curY}
          stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3"
          opacity="0.55"
          style={{ pointerEvents: 'none' }}
        />
      )}
      <g
        ref={ref}
        className="diagram-draggable"
        transform={`translate(${dx} ${dy})`}
        style={{ touchAction: 'none' }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {children}
      </g>
    </>
  );
}

// Diagram that renders 'circular', 'linear', or 'network' layouts
import NetworkDiagram from './NetworkDiagram.jsx';

export default function CycleDiagram({
  cycle, lang, selectedStep, onSelectStep,
  hideMode = 'none', cinemaMode = false, storyView = false,
  layers = { stoich: false, cofactors: false, regulation: false, integration: false, tissue: false },
  fontScale = 1,
  resetKey = 0,
  spreadOn = false
}) {
  const layout = cycle.layout || 'circular';
  const dragApi = useLabelOffsets(resetKey);

  useEffect(() => {
    if (!spreadOn) return;
    const vb = layout === 'linear' ? [0, 0, 960, cycle.steps.length > 6 ? 600 : 360] : [-30, -30, 820, 820];
    const initial = setTimeout(() => dragApi.spread(vb, 120), 50);
    const loop = setInterval(() => dragApi.spread(vb, 8), 160);
    return () => { clearTimeout(initial); clearInterval(loop); };
  }, [spreadOn, layout, cycle.steps?.length, cycle.id, cycle.steps, dragApi]);

  if (layout === 'network') {
    return <NetworkDiagram
      cycle={cycle} lang={lang}
      selectedNodeId={selectedStep}
      onSelectNode={(id) => onSelectStep && onSelectStep(id)}
    />;
  }

  if (layout === 'linear') {
    return <LinearDiagram
      cycle={cycle} lang={lang}
      selectedStep={selectedStep} onSelectStep={onSelectStep}
      hideMode={hideMode} cinemaMode={cinemaMode} storyView={storyView} layers={layers}
      fontScale={fontScale} dragApi={dragApi}
    />;
  }

  return <CircularDiagram
    cycle={cycle} lang={lang}
    selectedStep={selectedStep} onSelectStep={onSelectStep}
    hideMode={hideMode} cinemaMode={cinemaMode} storyView={storyView} layers={layers}
    fontScale={fontScale} dragApi={dragApi}
  />;
}

// ============================================================
// CIRCULAR (urea, TCA)
// ============================================================
function CircularDiagram({ cycle, lang, selectedStep, onSelectStep, hideMode, cinemaMode, storyView, layers, fontScale, dragApi }) {
  const cx = 380, cy = 380, r = 200;
  const steps = cycle.steps;
  const n = steps.length;
  const hasMultiCompartment = Object.keys(cycle.compartments).length > 1;
  const viewBox = [-30, -30, 820, 820];

  const enzymePositions = steps.map(s => {
    const rad = (s.angle * Math.PI) / 180;
    return { ...s, x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad), rad };
  });

  const intermediatePositions = cycle.intermediates.map(inter => {
    const fromStep = enzymePositions.find(e => e.id === inter.afterStep);
    const toStep = enzymePositions.find(e => e.id === inter.beforeStep);
    if (!fromStep || !toStep) return null;
    let a1 = fromStep.rad, a2 = toStep.rad;
    if (a2 < a1) a2 += 2 * Math.PI;
    const midRad = (a1 + a2) / 2;
    const midR = r - 70;
    return { ...inter, x: cx + midR * Math.cos(midRad), y: cy + midR * Math.sin(midRad), midRad };
  }).filter(Boolean);

  const characters = cycle.storyFrame?.[lang]?.characters || [];

  const arrowPaths = enzymePositions.map((s, i) => {
    const next = enzymePositions[(i + 1) % n];
    let a1 = s.rad, a2 = next.rad;
    if (a2 < a1) a2 += 2 * Math.PI;
    const midRad = (a1 + a2) / 2;
    const midR = r + 30;
    const mx = cx + midR * Math.cos(midRad);
    const my = cy + midR * Math.sin(midRad);
    // Start/end of arrow should sit ON the enzyme circle edge, not the center.
    // The enzyme radius is 38, so pull the path endpoints inward from center
    // by 38 along the direction from center toward the arrow's control point.
    const enzR = 38;
    const dx1 = mx - s.x, dy1 = my - s.y;
    const len1 = Math.hypot(dx1, dy1) || 1;
    const startX = s.x + (dx1 / len1) * enzR;
    const startY = s.y + (dy1 / len1) * enzR;
    const dx2 = mx - next.x, dy2 = my - next.y;
    const len2 = Math.hypot(dx2, dy2) || 1;
    const endX = next.x + (dx2 / len2) * enzR;
    const endY = next.y + (dy2 / len2) * enzR;
    return { d: `M ${startX} ${startY} Q ${mx} ${my} ${endX} ${endY}`, from: s.id, to: next.id, mx, my };
  });

  return (
    <svg viewBox="-30 -30 820 820" className="w-full h-full">
      <Defs />

      {hasMultiCompartment && (
        <>
          <path d={`M ${cx - 340} ${cy} A 340 340 0 0 1 ${cx + 340} ${cy} Z`} fill="url(#mitoGrad)" opacity="0.6" />
          <path d={`M ${cx + 340} ${cy} A 340 340 0 0 1 ${cx - 340} ${cy} Z`} fill="url(#cytoGrad)" opacity="0.6" />
          <MembraneWave cx={cx} cy={cy} width={680} />
          <text x={cx} y={32} textAnchor="middle" style={{ fontSize: 14, fontWeight: 800, letterSpacing: 3 }} className="fill-amber-900">
            {cycle.compartments.mito?.[lang]?.toUpperCase() || ''}
          </text>
          <text x={cx} y={745} textAnchor="middle" style={{ fontSize: 14, fontWeight: 800, letterSpacing: 3 }} className="fill-blue-900">
            {cycle.compartments.cyto?.[lang]?.toUpperCase() || ''}
          </text>
        </>
      )}

      {!hasMultiCompartment && (
        <rect x="40" y="40" width="680" height="680" rx="30" fill="url(#cytoGrad)" opacity="0.4" />
      )}

      {layers.integration && cycle.integrations && cycle.integrations.map((integ, i) => {
        if (!integ.fromStep) return null;
        const from = enzymePositions.find(e => e.id === integ.fromStep);
        if (!from) return null;
        const edgeR = r + 40;
        const outR = r + 135;
        const sx = cx + edgeR * Math.cos(from.rad);
        const sy = cy + edgeR * Math.sin(from.rad);
        const ex = cx + outR * Math.cos(from.rad);
        const ey = cy + outR * Math.sin(from.rad);
        const id = `int-${integ.fromStep}-${i}`;
        const { dx, dy } = dragApi.getOffset(id);
        const labelX = ex + dx;
        const labelY = ey + dy;
        const txt = `→ ${integ.toCycle}`;
        const boxW = Math.max(80, txt.length * 6.4 + 20);
        return (
          <g key={id}>
            <path d={`M ${sx} ${sy} L ${labelX} ${labelY}`} stroke="#64748b" strokeWidth="1.5" strokeDasharray="4 3" fill="none" markerEnd="url(#arrowIntegration)" />
            <Draggable id={id} x={ex} y={ey} w={boxW} h={22} getOffset={dragApi.getOffset} setOffset={dragApi.setOffset} registerAnchor={dragApi.registerAnchor} unregisterAnchor={dragApi.unregisterAnchor} viewBox={viewBox} fontScale={fontScale}>
              <rect x={ex - boxW / 2} y={ey - 11} width={boxW} height="22" rx="11" fill="white" stroke="#94a3b8" />
              <text x={ex} y={ey + 4} textAnchor="middle" style={{ fontSize: 11, fontWeight: 600 }} className="fill-slate-700">
                {txt}
              </text>
            </Draggable>
          </g>
        );
      })}

      {arrowPaths.map((ap, i) => {
        const isActive = selectedStep === ap.from;
        const step = steps.find(s => s.id === ap.from);
        return (
          <g key={i}>
            <path d={ap.d} fill="none" stroke={isActive ? '#0f172a' : '#94a3b8'} strokeWidth={isActive ? '2.5' : '1.5'}
                  markerEnd={isActive ? 'url(#arrowHeadActive)' : 'url(#arrowHead)'} opacity={isActive ? 1 : 0.6} />
            {cinemaMode && isActive && (
              <motion.circle r="7" fill="#0f172a"
                initial={{ offsetDistance: '0%' }} animate={{ offsetDistance: '100%' }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
                style={{ offsetPath: `path('${ap.d}')` }} />
            )}
            {layers.stoich && step && (
              <Draggable id={`stoich-${step.id}`} x={ap.mx} y={ap.my}
                getOffset={dragApi.getOffset} setOffset={dragApi.setOffset} registerAnchor={dragApi.registerAnchor} unregisterAnchor={dragApi.unregisterAnchor}
                viewBox={viewBox} fontScale={fontScale}>
                <StoichLabel step={step} x={ap.mx} y={ap.my} />
              </Draggable>
            )}
          </g>
        );
      })}

      {layers.cofactors && steps.map(step => {
        const pos = enzymePositions.find(e => e.id === step.id);
        if (!pos) return null;
        const dist = Math.hypot(pos.x - cx, pos.y - cy) || 1;
        const outDx = (pos.x - cx) / dist;
        const outDy = (pos.y - cy) / dist;
        const perpX = -outDy;
        const perpY = outDx;
        const pushOut = 90;
        const cofX = pos.x + outDx * pushOut;
        const cofY = pos.y + outDy * pushOut;
        const cofactors = step.cofactors || [];
        return cofactors.map((cf, i) => {
          const offset = (i - (cofactors.length - 1) / 2) * 42;
          const px = cofX + perpX * offset;
          const py = cofY + perpY * offset;
          const color = cf.role === 'consumed' ? '#fbbf24' : '#94a3b8';
          const cleanCofName = cf.name.replace(/^\d+\s+/, ""); const label = cf.stoich > 1 ? `${cf.stoich} ${cleanCofName}` : cleanCofName;
          const w = Math.max(28, label.length * 6.5 + 14);
          const id = `cof-${step.id}-${i}`;
          return (
            <Draggable key={id} id={id} x={px} y={py} w={w} h={22}
              getOffset={dragApi.getOffset} setOffset={dragApi.setOffset}
              registerAnchor={dragApi.registerAnchor} unregisterAnchor={dragApi.unregisterAnchor}
              viewBox={viewBox} fontScale={fontScale}
              linkTo={{ x: pos.x, y: pos.y }} showLink>
              <rect x={px - w / 2} y={py - 11} width={w} height="22" rx="11"
                    fill={color} fillOpacity="0.22" stroke={color} strokeWidth="1" />
              <text x={px} y={py + 4} textAnchor="middle" style={{ fontSize: 11, fontWeight: 700 }} className="fill-slate-700">
                {label}
              </text>
            </Draggable>
          );
        });
      })}

      {layers.regulation && steps.map(step => {
        const pos = enzymePositions.find(e => e.id === step.id);
        if (!pos) return null;
        const dist = Math.hypot(pos.x - cx, pos.y - cy) || 1;
        const outDx = (pos.x - cx) / dist;
        const outDy = (pos.y - cy) / dist;
        const perpX = -outDy;
        const perpY = outDx;
        const acts = (step.regulation?.activators || []).slice(0, 3);
        const inhs = (step.regulation?.inhibitors || []).slice(0, 3);
        if (acts.length === 0 && inhs.length === 0) return null;
        // Each label gets its own default position — then it's its own physics particle
        const radialPush = 90;
        const tangentialSep = 32;
        const lineHeight = 14;
        const baseX = pos.x + outDx * radialPush;
        const baseY = pos.y + outDy * radialPush;
        const renderLabel = (item, i, side, kind) => {
          const lx = baseX + side * perpX * tangentialSep + outDx * i * lineHeight;
          const ly = baseY + side * perpY * tangentialSep + outDy * i * lineHeight;
          const txt = formatRegulatorLabel(item.name, kind);
          const boxW = Math.max(28, txt.length * 6.4 + 10);
          const id = `reg-${step.id}-${kind}-${i}`;
          const colorClass = kind === 'act' ? 'fill-emerald-700' : 'fill-rose-700';
          return (
            <Draggable key={id} id={id} x={lx} y={ly}
              w={boxW} h={14}
              getOffset={dragApi.getOffset} setOffset={dragApi.setOffset}
              registerAnchor={dragApi.registerAnchor} unregisterAnchor={dragApi.unregisterAnchor}
              viewBox={viewBox} fontScale={fontScale}
              linkTo={{ x: pos.x, y: pos.y }} showLink>
              <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle"
                    style={{ fontSize: 11, fontWeight: 700 }} className={colorClass}>
                {txt}
              </text>
            </Draggable>
          );
        };
        return (
          <g key={`reg-group-${step.id}`}>
            {acts.map((a, i) => renderLabel(a, i, +1, 'act'))}
            {inhs.map((a, i) => renderLabel(a, i, -1, 'inh'))}
          </g>
        );
      })}

      {intermediatePositions.map((m, i) => {
        const label = lang === 'he' ? m.he : m.name;
        const isHidden = hideMode === 'intermediates' || hideMode === 'all';
        const txt = isHidden ? '?' : label;
        // Estimate width: ~6.2px per char at fontSize 11, plus padding
        const boxW = Math.max(60, txt.length * 6.4 + 24);
        return (
          <Draggable key={`int-${i}`} id={`int-${m.id || i}`} x={m.x} y={m.y}
            w={boxW} h={26}
            getOffset={dragApi.getOffset} setOffset={dragApi.setOffset} registerAnchor={dragApi.registerAnchor} unregisterAnchor={dragApi.unregisterAnchor}
            viewBox={viewBox} fontScale={fontScale}>
            <rect x={m.x - boxW / 2} y={m.y - 13} width={boxW} height="26" rx="13" fill="white"
                  stroke={m.carrier ? '#10b981' : '#cbd5e1'} strokeWidth={m.carrier ? '1.5' : '1'}
                  strokeDasharray={m.carrier ? '3 2' : 'none'} />
            <text x={m.x} y={m.y + 4} textAnchor="middle" style={{ fontSize: 11, fontWeight: 600 }} className="fill-slate-700">
              {txt}
            </text>
            {m.crossesMembrane && (
              <text x={m.x} y={m.y + 20} textAnchor="middle" style={{ fontSize: 9 }} className="fill-emerald-600">
                ⇅ {lang === 'en' ? 'transporter' : 'מוביל'}
              </text>
            )}
          </Draggable>
        );
      })}

      {enzymePositions.map((s, i) => (
        <EnzymeNode key={s.id} s={s} i={i}
          isSelected={selectedStep === s.id}
          onSelect={() => onSelectStep(s.id)}
          characters={characters} cinemaMode={cinemaMode} storyView={storyView} hideMode={hideMode} radius={38} />
      ))}

      <g>
        <circle cx={cx} cy={cy} r="54" fill="white" stroke="#e2e8f0" strokeWidth="1.5" />
        <text x={cx} y={cy - 4} textAnchor="middle" style={{ fontSize: 11, fontWeight: 800 }} className="fill-slate-600">
          {cycle.title[lang]}
        </text>
        <text x={cx} y={cy + 12} textAnchor="middle" style={{ fontSize: 9 }} className="fill-slate-400">
          {cycle.steps.length} {lang === 'en' ? 'steps' : 'שלבים'}
        </text>
      </g>
    </svg>
  );
}

// ============================================================
// LINEAR (glycolysis, β-oxidation, etc.)
// ============================================================
function LinearDiagram({ cycle, lang, selectedStep, onSelectStep, hideMode, cinemaMode, storyView, layers, fontScale, dragApi }) {
  const steps = cycle.steps;
  const n = steps.length;

  // 2-row layout for 10-step glycolysis: top row 5 steps, bottom row 5 steps
  const useTwoRows = n > 6;
  const perRow = useTwoRows ? Math.ceil(n / 2) : n;
  const svgW = 960, svgH = useTwoRows ? 600 : 360;
  const viewBox = [0, 0, svgW, svgH];
  const marginX = 120;
  const xStep = (svgW - marginX * 2) / (perRow - 1);
  const topY = useTwoRows ? 180 : svgH / 2;
  const bottomY = useTwoRows ? 450 : svgH / 2;

  const getPos = (i) => {
    if (!useTwoRows) return { x: marginX + i * xStep, y: topY };
    if (i < perRow) return { x: marginX + i * xStep, y: topY };
    const bottomI = i - perRow;
    const bottomCount = n - perRow;
    const bottomX = svgW - marginX - bottomI * ((svgW - marginX * 2) / (bottomCount - 1 || 1));
    return { x: bottomX, y: bottomY };
  };

  const enzymePositions = steps.map((s, i) => ({ ...s, ...getPos(i) }));
  const characters = cycle.storyFrame?.[lang]?.characters || [];

  // Phase banner — investment (steps with phase='investment') vs payoff
  const hasPhases = steps.some(s => s.phase);
  const investmentSteps = steps.filter(s => s.phase === 'investment');
  const payoffSteps = steps.filter(s => s.phase === 'payoff');

  return (
    <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-full">
      <Defs />

      {/* Single-compartment background */}
      <rect x="20" y="20" width={svgW - 40} height={svgH - 40} rx="20" fill="url(#cytoGrad)" opacity="0.35" />
      <text x={svgW / 2} y={22} textAnchor="middle" style={{ fontSize: 13, fontWeight: 800, letterSpacing: 3 }} className="fill-blue-900">
        {Object.values(cycle.compartments)[0][lang].toUpperCase()}
      </text>

      {/* Phase banners */}
      {hasPhases && (
        <>
          <rect x={30} y={40} width={(svgW - 60) / 2 - 10} height={28} rx={14} fill="#fff7ed" stroke="#fb923c" strokeWidth="1" />
          <text x={30 + ((svgW - 60) / 2 - 10) / 2} y={59} textAnchor="middle" style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1 }} className="fill-orange-800">
            {lang === 'en' ? `INVESTMENT PHASE — ${investmentSteps.length} steps, spend 2 ATP` : `שלב השקעה — ${investmentSteps.length} שלבים, −2 ATP`}
          </text>
          <rect x={svgW / 2 + 10} y={40} width={(svgW - 60) / 2 - 10} height={28} rx={14} fill="#ecfdf5" stroke="#10b981" strokeWidth="1" />
          <text x={svgW / 2 + 10 + ((svgW - 60) / 2 - 10) / 2} y={59} textAnchor="middle" style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1 }} className="fill-emerald-800">
            {lang === 'en' ? `PAYOFF PHASE — ${payoffSteps.length} steps, make 4 ATP + 2 NADH (×2)` : `שלב רווח — ${payoffSteps.length} שלבים, +4 ATP + 2 NADH`}
          </text>
        </>
      )}

      {layers.tissue && cycle.context && null /* Tissue banner rendered outside SVG in App.jsx */}

      {/* Arrows between steps */}
      {enzymePositions.map((s, i) => {
        if (i === n - 1) return null;
        const next = enzymePositions[i + 1];
        const isActive = selectedStep === s.id;
        const step = s;

        // Horizontal for same row, curve for row transition
        const sameRow = s.y === next.y;
        let d;
        if (sameRow) {
          const dx = next.x > s.x ? 40 : -40;
          d = `M ${s.x + Math.sign(next.x - s.x) * 40} ${s.y} L ${next.x - Math.sign(next.x - s.x) * 40} ${next.y}`;
        } else {
          // U-turn on right edge
          d = `M ${s.x + 40} ${s.y} L ${svgW - 30} ${s.y} Q ${svgW - 10} ${(s.y + next.y) / 2} ${svgW - 30} ${next.y} L ${next.x + 40} ${next.y}`;
        }

        return (
          <g key={i}>
            <path d={d} fill="none" stroke={isActive ? '#0f172a' : '#94a3b8'} strokeWidth={isActive ? '2.5' : '1.5'}
                  markerEnd={isActive ? 'url(#arrowHeadActive)' : 'url(#arrowHead)'} opacity={isActive ? 1 : 0.55} />
            {cinemaMode && isActive && (
              <motion.circle r="6" fill="#0f172a"
                initial={{ offsetDistance: '0%' }} animate={{ offsetDistance: '100%' }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                style={{ offsetPath: `path('${d}')` }} />
            )}
            {/* Intermediate label on the arrow */}
            {(() => {
              const inter = cycle.intermediates?.find(m => m.afterStep === s.id && m.beforeStep === next.id);
              if (!inter) return null;
              const midX = sameRow ? (s.x + next.x) / 2 : svgW - 30;
              const midY = sameRow ? s.y - 18 : (s.y + next.y) / 2;
              const isHidden = hideMode === 'intermediates' || hideMode === 'all';
              const txt = isHidden ? '?' : (lang === 'he' ? inter.he : inter.name);
              const boxW = Math.max(50, txt.length * 6.4 + 18);
              return (
                <Draggable id={`lin-int-${s.id}-${next.id}`} x={midX} y={midY}
                  w={boxW} h={20}
                  getOffset={dragApi.getOffset} setOffset={dragApi.setOffset} registerAnchor={dragApi.registerAnchor} unregisterAnchor={dragApi.unregisterAnchor}
                  viewBox={viewBox} fontScale={fontScale}>
                  <rect x={midX - boxW / 2} y={midY - 10} width={boxW} height="20" rx="10" fill="white" stroke="#cbd5e1" />
                  <text x={midX} y={midY + 4} textAnchor="middle" style={{ fontSize: 11, fontWeight: 600 }} className="fill-slate-700">
                    {txt}
                  </text>
                </Draggable>
              );
            })()}
            {/* Stoichiometry label */}
            {layers.stoich && step && sameRow && (() => {
              const energyIn = step.cofactors?.filter(c => c.role === 'consumed') || [];
              const energyOut = step.cofactors?.filter(c => c.role === 'produced') || [];
              if (energyIn.length === 0 && energyOut.length === 0) return null;
              const midX = (s.x + next.x) / 2;
              const txt = `${energyIn.map(c => c.name).join('+')}${energyIn.length > 0 && energyOut.length > 0 ? '→' : ''}${energyOut.map(c => c.name).join('+')}`;
              const boxW = Math.max(60, txt.length * 6.2 + 14);
              return (
                <Draggable id={`lin-stoich-${s.id}`} x={midX} y={s.y + 20}
                  w={boxW} h={20}
                  getOffset={dragApi.getOffset} setOffset={dragApi.setOffset} registerAnchor={dragApi.registerAnchor} unregisterAnchor={dragApi.unregisterAnchor}
                  viewBox={viewBox} fontScale={fontScale}>
                  <rect x={midX - boxW / 2} y={s.y + 10} width={boxW} height="20" rx="10" fill="#fffbeb" stroke="#fbbf24" strokeWidth="1" />
                  <text x={midX} y={s.y + 24} textAnchor="middle" style={{ fontSize: 10, fontWeight: 600 }} className="fill-amber-800">
                    {txt}
                  </text>
                </Draggable>
              );
            })()}
          </g>
        );
      })}

      {/* Enzyme nodes */}
      {enzymePositions.map((s, i) => {
        const isSelected = selectedStep === s.id;
        const char = characters[i];
        const showEmoji = (cinemaMode || storyView) && char;
        const phaseColor = s.phase === 'investment' ? '#f97316' : s.phase === 'payoff' ? '#10b981' : '#3b82f6';
        // Pastel fill for storyView (non-cinema), saturated for cinema
        const fill = showEmoji
          ? (cinemaMode ? char.color : `${char.color}30`)
          : phaseColor;
        const strokeColor = showEmoji && !cinemaMode ? char.color : 'white';
        const strokeWidth = isSelected ? 3 : (showEmoji && !cinemaMode ? 2.5 : 2);
        const isHidden = hideMode === 'enzymes' || hideMode === 'all';

        return (
          <motion.g
            key={s.id}
            onClick={() => onSelectStep(s.id)}
            style={{ cursor: 'pointer' }}
            whileHover={{ scale: 1.1 }}
            animate={{ scale: isSelected ? 1.15 : 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <circle cx={s.x} cy={s.y} r="34" fill={fill} opacity={isSelected ? 1 : 0.95}
                    stroke={isSelected ? '#0f172a' : strokeColor} strokeWidth={strokeWidth}
                    filter={isSelected && cinemaMode ? 'url(#glow)' : undefined} />
            {showEmoji ? (
              <>
                {/* Big centered emoji */}
                <text x={s.x} y={s.y + 2} textAnchor="middle" dominantBaseline="central"
                      style={{ fontSize: 30, pointerEvents: 'none' }}>{char.icon}</text>
                {/* Enzyme abbr below circle */}
                <text x={s.x} y={s.y + 50} textAnchor="middle"
                      style={{ fontSize: 12, fontWeight: 800 }} className="fill-slate-700">
                  {isHidden ? '?' : s.enzyme.abbr}
                </text>
              </>
            ) : (
              <>
                {s.enzyme.abbr.length <= 5 ? (
                  <>
                    <text x={s.x} y={s.y - 1} textAnchor="middle" fill="white" style={{ fontSize: 11, fontWeight: 800 }}>
                      {isHidden ? '?' : s.enzyme.abbr}
                    </text>
                    <text x={s.x} y={s.y + 13} textAnchor="middle" fill="white" style={{ fontSize: 11, opacity: 0.9 }}>
                      {s.id}
                    </text>
                  </>
                ) : (
                  <>
                    <text x={s.x} y={s.y + 5} textAnchor="middle" fill="white" style={{ fontSize: 14, fontWeight: 800 }}>
                      {isHidden ? '?' : s.id}
                    </text>
                    <text x={s.x} y={s.y + 50} textAnchor="middle" style={{ fontSize: 11, fontWeight: 700 }} className="fill-slate-700">
                      {isHidden ? '?' : s.enzyme.abbr}
                    </text>
                  </>
                )}
              </>
            )}
          </motion.g>
        );
      })}

      {/* Regulation overlay — each label is its own physics particle */}
      {layers.regulation && enzymePositions.map(s => {
        if (!s.regulation) return null;
        const acts = (s.regulation.activators || []).slice(0, 2);
        const inhs = (s.regulation.inhibitors || []).slice(0, 2);
        if (acts.length === 0 && inhs.length === 0) return null;
        const labelY = s.y - 50;
        const items = [];
        acts.forEach((a, i) => {
          const txt = formatRegulatorLabel(a.name, 'act');
          const boxW = Math.max(30, txt.length * 6.2 + 8);
          const lx = s.x - 18 - boxW / 2;
          const ly = labelY - i * 14;
          items.push(
            <Draggable key={`lin-reg-${s.id}-act-${i}`} id={`lin-reg-${s.id}-act-${i}`}
              x={lx} y={ly} w={boxW} h={14}
              getOffset={dragApi.getOffset} setOffset={dragApi.setOffset}
              registerAnchor={dragApi.registerAnchor} unregisterAnchor={dragApi.unregisterAnchor}
              viewBox={viewBox} fontScale={fontScale}
              linkTo={{ x: s.x, y: s.y }} showLink>
              <text x={lx + boxW / 2} y={ly} textAnchor="middle" dominantBaseline="middle"
                    style={{ fontSize: 11, fontWeight: 700 }} className="fill-emerald-700">
                {txt}
              </text>
            </Draggable>
          );
        });
        inhs.forEach((inh, i) => {
          const txt = formatRegulatorLabel(inh.name, 'inh');
          const boxW = Math.max(30, txt.length * 6.2 + 8);
          const lx = s.x + 18 + boxW / 2;
          const ly = labelY - i * 14;
          items.push(
            <Draggable key={`lin-reg-${s.id}-inh-${i}`} id={`lin-reg-${s.id}-inh-${i}`}
              x={lx} y={ly} w={boxW} h={14}
              getOffset={dragApi.getOffset} setOffset={dragApi.setOffset}
              registerAnchor={dragApi.registerAnchor} unregisterAnchor={dragApi.unregisterAnchor}
              viewBox={viewBox} fontScale={fontScale}
              linkTo={{ x: s.x, y: s.y }} showLink>
              <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle"
                    style={{ fontSize: 11, fontWeight: 700 }} className="fill-rose-700">
                {txt}
              </text>
            </Draggable>
          );
        });
        return <g key={`lin-reg-g-${s.id}`}>{items}</g>;
      })}

      {/* Input/Output labels positioned clear of enzyme circles */}
      <g>
        <rect x={20} y={topY - 18} width={70} height={36} rx={8} fill="#fecaca" stroke="#ef4444" strokeWidth="1.5" />
        <text x={55} y={topY - 2} textAnchor="middle" style={{ fontSize: 11, fontWeight: 700 }} className="fill-rose-800">
          {lang === 'en' ? 'Glucose' : 'גלוקוז'}
        </text>
        <text x={55} y={topY + 12} textAnchor="middle" style={{ fontSize: 9 }} className="fill-rose-700">IN</text>
      </g>

      <g>
        <rect x={svgW - 90} y={(useTwoRows ? bottomY : topY) - 18} width={70} height={36} rx={8} fill="#d1fae5" stroke="#10b981" strokeWidth="1.5" />
        <text x={svgW - 55} y={(useTwoRows ? bottomY : topY) - 2} textAnchor="middle" style={{ fontSize: 11, fontWeight: 700 }} className="fill-emerald-800">
          {lang === 'en' ? 'Pyruvate' : 'פירובט'}
        </text>
        <text x={svgW - 55} y={(useTwoRows ? bottomY : topY) + 12} textAnchor="middle" style={{ fontSize: 9 }} className="fill-emerald-700">OUT</text>
      </g>
    </svg>
  );
}

// ============================================================
// SHARED SUB-COMPONENTS
// ============================================================
function Defs() {
  return (
    <defs>
      <radialGradient id="mitoGrad" cx="50%" cy="30%">
        <stop offset="0%" stopColor="#fef3c7" />
        <stop offset="100%" stopColor="#fcd34d" stopOpacity="0.5" />
      </radialGradient>
      <radialGradient id="cytoGrad" cx="50%" cy="70%">
        <stop offset="0%" stopColor="#dbeafe" />
        <stop offset="100%" stopColor="#93c5fd" stopOpacity="0.5" />
      </radialGradient>
      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="5" result="blur"/>
        <feMerge>
          <feMergeNode in="blur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      <marker id="arrowHead" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="#475569" />
      </marker>
      <marker id="arrowHeadActive" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="#0f172a" />
      </marker>
      <marker id="arrowActivator" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
      </marker>
      <marker id="arrowIntegration" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
      </marker>
    </defs>
  );
}

function MembraneWave({ cx, cy, width }) {
  const bumps = 14;
  const bumpW = width / bumps;
  const bumpH = 12;
  let path = `M ${cx - width / 2} ${cy}`;
  for (let i = 0; i < bumps; i++) {
    const x1 = cx - width / 2 + i * bumpW + bumpW / 2;
    const x2 = cx - width / 2 + (i + 1) * bumpW;
    path += ` Q ${x1} ${cy - bumpH} ${x2} ${cy}`;
  }
  let reversePath = `L ${cx + width / 2} ${cy + 8}`;
  for (let i = bumps - 1; i >= 0; i--) {
    const x1 = cx - width / 2 + i * bumpW + bumpW / 2;
    const x2 = cx - width / 2 + i * bumpW;
    reversePath += ` Q ${x1} ${cy + 8 + bumpH} ${x2} ${cy + 8}`;
  }
  reversePath += ' Z';
  return (
    <g>
      <path d={path + reversePath} fill="#cbd5e1" opacity="0.7" />
      <path d={path} fill="none" stroke="#64748b" strokeWidth="1" />
    </g>
  );
}

function TissueBanner({ cycle, lang, x, y }) {
  return (
    <foreignObject x={x} y={y} width={360} height={200} style={{ overflow: 'visible' }}>
      <div xmlns="http://www.w3.org/1999/xhtml" style={{
        background: 'white',
        border: '1px solid #e2e8f0',
        borderRadius: '10px',
        padding: '8px 12px',
        fontFamily: 'inherit',
        display: 'inline-block',
        minWidth: 0
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1.5px', color: '#94a3b8' }}>TISSUE</div>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#1e293b', lineHeight: 1.25, marginTop: 2 }}>
          {cycle.context.tissue[lang]}
        </div>
        <div style={{ fontSize: 11, color: '#64748b', lineHeight: 1.3, marginTop: 2 }}>
          {cycle.context.state[lang]}
        </div>
      </div>
    </foreignObject>
  );
}

function EnzymeNode({ s, i, isSelected, onSelect, characters, cinemaMode, storyView, hideMode, radius = 38 }) {
  const char = characters[i];
  const showEmoji = (cinemaMode || storyView) && char;
  const compColor = s.compartment === 'mito' ? '#f59e0b' : '#3b82f6';
  // In emoji/story mode, use a pastel / translucent fill so the emoji stands out.
  // The saturated character color becomes the stroke color.
  const fillColor = showEmoji && char ? (cinemaMode ? char.color : `${char.color}30`) : compColor;
  const strokeColor = showEmoji && char && !cinemaMode ? char.color : 'white';
  const strokeWidth = isSelected ? 3 : (showEmoji && !cinemaMode ? 2.5 : 2);
  const isHidden = hideMode === 'enzymes' || hideMode === 'all';
  return (
    <motion.g onClick={onSelect} style={{ cursor: 'pointer' }} whileHover={{ scale: 1.1 }}
              animate={{ scale: isSelected ? 1.15 : 1 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
      <circle cx={s.x} cy={s.y} r={radius} fill={fillColor} opacity={isSelected ? 1 : 0.95}
              stroke={isSelected ? '#0f172a' : strokeColor} strokeWidth={strokeWidth}
              filter={isSelected && cinemaMode ? 'url(#glow)' : undefined} />
      {showEmoji ? (
        <>
          {/* Big centered emoji */}
          <text x={s.x} y={s.y + 2} textAnchor="middle" dominantBaseline="central"
                style={{ fontSize: 34, pointerEvents: 'none' }}>{char.icon}</text>
          {/* Enzyme label below the circle (outside), so emoji isn't cramped */}
          <text x={s.x} y={s.y + radius + 14} textAnchor="middle"
                fill={cinemaMode ? 'white' : '#334155'}
                style={{ fontSize: 12, fontWeight: 800 }}>
            {isHidden ? '?' : s.enzyme.abbr}
          </text>
        </>
      ) : (
        <>
          <text x={s.x} y={s.y - 1} textAnchor="middle" fill="white" style={{ fontSize: 12, fontWeight: 800 }}>
            {isHidden ? '?' : s.enzyme.abbr}
          </text>
          <text x={s.x} y={s.y + 14} textAnchor="middle" fill="white" style={{ fontSize: 11, opacity: 0.9 }}>
            {s.id}
          </text>
        </>
      )}
    </motion.g>
  );
}

function StoichLabel({ step, x, y }) {
  const energyIn = step.cofactors?.filter(c => c.role === 'consumed') || [];
  const energyOut = step.cofactors?.filter(c => c.role === 'produced') || [];
  if (energyIn.length === 0 && energyOut.length === 0) return null;
  const inLabel = energyIn.map(c => c.name).join(' + ');
  const outLabel = energyOut.map(c => c.name).join(' + ');
  const label = inLabel && outLabel ? `${inLabel} → ${outLabel}` : (inLabel || outLabel);
  const boxW = Math.max(60, label.length * 6.4 + 16);
  return (
    <g>
      <rect x={x - boxW / 2} y={y - 10} width={boxW} height="20" rx="10" fill="#fffbeb" stroke="#fbbf24" strokeWidth="1" />
      <text x={x} y={y + 4} textAnchor="middle" style={{ fontSize: 11, fontWeight: 600 }} className="fill-amber-800">
        {label}
      </text>
    </g>
  );
}

function CofactorCluster({ step, x, y, cx, cy }) {
  // Normalize direction vector AWAY from cycle center
  const dist = Math.hypot(x - cx, y - cy) || 1;
  const outDx = (x - cx) / dist;
  const outDy = (y - cy) / dist;
  const pushOut = 90;
  const cofX = x + outDx * pushOut;
  const cofY = y + outDy * pushOut;
  const cofactors = step.cofactors || [];
  if (cofactors.length === 0) return null;
  return (
    <g>
      {cofactors.map((cf, i) => {
        const perpX = -outDy;
        const perpY = outDx;
        const offset = (i - (cofactors.length - 1) / 2) * 42;  // wider spacing for pill chips
        const px = cofX + perpX * offset;
        const py = cofY + perpY * offset;
        const color = cf.role === 'consumed' ? '#fbbf24' : '#94a3b8';
        const cleanCofName = cf.name.replace(/^\d+\s+/, ""); const label = cf.stoich > 1 ? `${cf.stoich} ${cleanCofName}` : cleanCofName;
        // Width fits text — estimate 6.5 px per char at fontSize 11, min 28 for short names
        const w = Math.max(28, label.length * 6.5 + 14);
        return (
          <g key={i}>
            <rect x={px - w / 2} y={py - 11} width={w} height="22" rx="11"
                  fill={color} fillOpacity="0.22" stroke={color} strokeWidth="1" />
            <text x={px} y={py + 4} textAnchor="middle" style={{ fontSize: 11, fontWeight: 700 }} className="fill-slate-700">
              {label}
            </text>
          </g>
        );
      })}
    </g>
  );
}

function RegulationArrow({ step, x, y, cx, cy }) {
  const { activators = [], inhibitors = [] } = step.regulation || {};
  if (activators.length === 0 && inhibitors.length === 0) return null;
  const dist = Math.hypot(x - cx, y - cy) || 1;
  const outDx = (x - cx) / dist;
  const outDy = (y - cy) / dist;
  // Tangent unit vector (perpendicular to radial, rotated 90°)
  const perpX = -outDy;
  const perpY = outDx;
  // Push the base FAR enough outward that tangential offset stays clear of circle
  const radialPush = 90;  // (enzyme r=38) + (clearance 52) = all labels outside circle
  const tangentialSep = 32;  // separation between activator column and inhibitor column
  const lineHeight = 14;
  // Base anchor point — directly outward from enzyme, past its edge
  const baseX = x + outDx * radialPush;
  const baseY = y + outDy * radialPush;
  // Activators: shifted along +perp. Inhibitors: shifted along -perp.
  // Each label within a column is shifted further outward radially.
  return (
    <g>
      {activators.slice(0, 3).map((act, i) => {
        const lx = baseX + perpX * tangentialSep + outDx * i * lineHeight;
        const ly = baseY + perpY * tangentialSep + outDy * i * lineHeight;
        return (
          <text key={`act-${i}`} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: 11, fontWeight: 700 }} className="fill-emerald-700">
            +{act.name.split(/[\s(]/)[0].replace(/[,]/g, '')}
          </text>
        );
      })}
      {inhibitors.slice(0, 3).map((inh, i) => {
        const lx = baseX - perpX * tangentialSep + outDx * i * lineHeight;
        const ly = baseY - perpY * tangentialSep + outDy * i * lineHeight;
        return (
          <text key={`inh-${i}`} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: 11, fontWeight: 700 }} className="fill-rose-700">
            −{inh.name.split(/[\s(]/)[0].replace(/[,]/g, '')}
          </text>
        );
      })}
    </g>
  );
}
