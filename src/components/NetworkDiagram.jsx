import { motion } from 'framer-motion';

// ============================================================
// NetworkDiagram — branching flowchart for non-cyclic pathways.
//
// DESIGN RULES:
// - All text labels live INSIDE their container. No external floating text.
// - Hubs = wide rounded rects, primary + secondary line stacked inside.
// - Enzymes = compact rounded pills sitting on the connector line.
// - End products = rounded rects sized to fit BOTH the abbr and the full name,
//   with a small ★ badge for essential AAs (no external "ESSENTIAL" text).
// - Connector arrows are drawn between container EDGES so they're never
//   covered by labels.
// ============================================================

// Edge of a rectangle from its center toward a target point.
// Returns the (x, y) where a line from `target` toward the rect center
// would intersect the rect's perimeter.
function rectEdgePoint(cx, cy, hw, hh, fromX, fromY) {
  const dx = fromX - cx;
  const dy = fromY - cy;
  if (dx === 0 && dy === 0) return { x: cx, y: cy };
  const tx = hw / Math.max(1, Math.abs(dx));
  const ty = hh / Math.max(1, Math.abs(dy));
  const t = Math.min(tx, ty);
  return { x: cx + dx * t, y: cy + dy * t };
}

const HUB_W = 150;
const HUB_H = 56;
const ENZ_PAD_X = 12;
const ENZ_H = 28;
const END_W = 110;
const END_H = 44;

// Width estimator (~6.6 px per char at 11px font)
const enzWidth = (label) => Math.max(60, label.length * 6.6 + ENZ_PAD_X * 2);

export default function NetworkDiagram({
  cycle, lang,
  selectedNodeId, onSelectNode,
  hiddenIds = new Set(),
  revealedIds = {},
  hoverId = null,
  shakeId = null
}) {
  const net = cycle.network;
  if (!net) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>
        Network layout not configured for this cycle.
      </div>
    );
  }

  const [vx, vy, vw, vh] = net.viewBox || [0, 0, 1100, 720];

  return (
    <svg viewBox={`${vx} ${vy} ${vw} ${vh}`} className="net-map" preserveAspectRatio="xMidYMid meet">
      <defs>
        <marker id="netArrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
        </marker>
      </defs>

      {/* ---------- Connector arrows: hub edge → enzyme edge → end edge ---------- */}
      {net.enzymes.map(enz => {
        const hub = net.hubs.find(h => h.id === enz.fromHubId);
        const end = net.ends.find(e => e.fromEnzymeId === enz.id);
        if (!hub || !end) return null;

        // Enzyme pill sits at midpoint
        const midX = (hub.x + end.x) / 2;
        const midY = (hub.y + end.y) / 2;
        const eW = enzWidth(enz.label);

        // Hub edge → enzyme left edge
        const hubEdge = rectEdgePoint(hub.x, hub.y, HUB_W / 2, HUB_H / 2, midX, midY);
        const enzLeftEdge = rectEdgePoint(midX, midY, eW / 2, ENZ_H / 2, hub.x, hub.y);
        // Enzyme right edge → end left edge
        const enzRightEdge = rectEdgePoint(midX, midY, eW / 2, ENZ_H / 2, end.x, end.y);
        const endEdge = rectEdgePoint(end.x, end.y, END_W / 2, END_H / 2, midX, midY);

        return (
          <g key={`edge-${enz.id}`}>
            <line x1={hubEdge.x} y1={hubEdge.y} x2={enzLeftEdge.x} y2={enzLeftEdge.y}
                  stroke="#cbd5e1" strokeWidth="1.5" />
            <line x1={enzRightEdge.x} y1={enzRightEdge.y} x2={endEdge.x} y2={endEdge.y}
                  stroke="#cbd5e1" strokeWidth="1.5" markerEnd="url(#netArrow)" />
          </g>
        );
      })}

      {/* ---------- Hubs (rounded rectangle with primary + secondary inside) ---------- */}
      {net.hubs.map(hub => {
        const isSelected = selectedNodeId === hub.id;
        return (
          <motion.g
            key={hub.id}
            onClick={() => onSelectNode?.(hub.id, 'hub')}
            style={{ cursor: 'pointer' }}
            whileHover={{ scale: 1.03 }}
            animate={{ scale: isSelected ? 1.05 : 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <rect
              x={hub.x - HUB_W / 2} y={hub.y - HUB_H / 2}
              width={HUB_W} height={HUB_H} rx={14}
              fill={`${hub.color}1f`}
              stroke={hub.color} strokeWidth="2.5"
            />
            <text x={hub.x} y={hub.y - 5} textAnchor="middle"
                  style={{ fontSize: 13, fontWeight: 800, fill: '#0f172a' }}>
              {hub.label}
            </text>
            {hub.sublabel && (
              <text x={hub.x} y={hub.y + 13} textAnchor="middle"
                    style={{ fontSize: 10, fill: hub.color, fontWeight: 700, letterSpacing: 0.3 }}>
                {hub.sublabel}
              </text>
            )}
          </motion.g>
        );
      })}

      {/* ---------- Enzymes (compact pill on the connector line) ---------- */}
      {net.enzymes.map(enz => {
        const hub = net.hubs.find(h => h.id === enz.fromHubId);
        const end = net.ends.find(e => e.fromEnzymeId === enz.id);
        if (!hub || !end) return null;
        const midX = (hub.x + end.x) / 2;
        const midY = (hub.y + end.y) / 2;
        const isHidden = hiddenIds.has(enz.id);
        const isRevealed = !!revealedIds[enz.id];
        const isHover = hoverId === enz.id;
        const isShake = shakeId === enz.id;
        const isSelected = selectedNodeId === enz.id;
        const txt = isHidden && !isRevealed ? '?' : enz.label;
        const eW = enzWidth(txt);

        return (
          <motion.g
            key={enz.id}
            onClick={() => !isHidden && onSelectNode?.(enz.id, 'enzyme')}
            style={{ cursor: isHidden ? 'default' : 'pointer' }}
            animate={isShake ? { x: [0, -7, 7, -5, 5, 0] } : { x: 0 }}
            whileHover={!isHidden ? { scale: 1.05 } : undefined}
            transition={isShake ? { duration: 0.4 } : { type: 'spring', stiffness: 300, damping: 20 }}
          >
            <rect
              x={midX - eW / 2} y={midY - ENZ_H / 2}
              width={eW} height={ENZ_H} rx={ENZ_H / 2}
              fill={isHidden && !isRevealed
                    ? (isHover ? '#dcfce7' : '#fef3c7')
                    : (isRevealed ? '#bbf7d0' : '#ffffff')}
              stroke={isHidden && !isRevealed
                      ? (isHover ? '#10b981' : '#f59e0b')
                      : (isSelected ? '#0f172a' : '#94a3b8')}
              strokeWidth={isHidden ? 2.5 : (isSelected ? 2 : 1.5)}
              strokeDasharray={isHidden && !isRevealed && !isHover ? '5 4' : 'none'}
            />
            <text x={midX} y={midY + 4} textAnchor="middle"
                  style={{
                    fontSize: isHidden && !isRevealed ? 16 : 11,
                    fontWeight: isHidden && !isRevealed ? 800 : 700,
                    fill: isHidden && !isRevealed
                          ? (isHover ? '#059669' : '#b45309')
                          : '#0f172a'
                  }}>
              {txt}
            </text>
            {isRevealed && (
              <motion.circle initial={{ scale: 0 }} animate={{ scale: 1 }}
                cx={midX + eW / 2 - 6} cy={midY - ENZ_H / 2 + 6} r="6" fill="#10b981" />
            )}
          </motion.g>
        );
      })}

      {/* ---------- End products: rounded rect with abbr + full name INSIDE ---------- */}
      {net.ends.map(end => {
        const isHidden = hiddenIds.has(end.id);
        const isRevealed = !!revealedIds[end.id];
        const isHover = hoverId === end.id;
        const isShake = shakeId === end.id;
        const isSelected = selectedNodeId === end.id;

        return (
          <motion.g
            key={end.id}
            onClick={() => !isHidden && onSelectNode?.(end.id, 'end')}
            style={{ cursor: isHidden ? 'default' : 'pointer' }}
            animate={isShake ? { x: [0, -7, 7, -5, 5, 0] } : { x: 0 }}
            whileHover={!isHidden ? { scale: 1.04 } : undefined}
            transition={isShake ? { duration: 0.4 } : { type: 'spring', stiffness: 300, damping: 20 }}
          >
            <rect
              x={end.x - END_W / 2} y={end.y - END_H / 2}
              width={END_W} height={END_H} rx={12}
              fill={isHidden && !isRevealed
                    ? (isHover ? '#dcfce7' : '#fef3c7')
                    : (isRevealed ? '#bbf7d0' : `${end.color || '#64748b'}1a`)}
              stroke={isHidden && !isRevealed
                      ? (isHover ? '#10b981' : '#f59e0b')
                      : (end.essential ? '#dc2626' : (end.color || '#64748b'))}
              strokeWidth={isHidden ? 2.5 : (end.essential ? 2.5 : 1.75)}
              strokeDasharray={isHidden && !isRevealed && !isHover ? '5 4' : 'none'}
            />
            {isHidden && !isRevealed ? (
              <text x={end.x} y={end.y + 7} textAnchor="middle"
                    style={{
                      fontSize: 22, fontWeight: 800,
                      fill: isHover ? '#059669' : '#b45309'
                    }}>?</text>
            ) : (
              <>
                {/* Abbreviation (large) */}
                <text x={end.x} y={end.y - 4} textAnchor="middle"
                      style={{ fontSize: 14, fontWeight: 800, fill: '#0f172a' }}>
                  {end.label}
                </text>
                {/* Full name below, INSIDE the rect */}
                {end.sublabel && (
                  <text x={end.x} y={end.y + 11} textAnchor="middle"
                        style={{ fontSize: 9.5, fill: '#64748b', fontWeight: 600 }}>
                    {end.sublabel}
                  </text>
                )}
              </>
            )}
            {/* Essential star — top-right CORNER, not floating outside */}
            {!isHidden && end.essential && !isRevealed && (
              <g>
                <circle cx={end.x + END_W / 2 - 8} cy={end.y - END_H / 2 + 8} r="9" fill="#dc2626" />
                <text x={end.x + END_W / 2 - 8} y={end.y - END_H / 2 + 12} textAnchor="middle"
                      style={{ fontSize: 11, fontWeight: 800, fill: 'white' }}>★</text>
              </g>
            )}
            {isRevealed && (
              <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }}>
                <circle cx={end.x + END_W / 2 - 8} cy={end.y - END_H / 2 + 8} r="9" fill="#10b981" />
                <text x={end.x + END_W / 2 - 8} y={end.y - END_H / 2 + 12} textAnchor="middle"
                      style={{ fontSize: 11, fontWeight: 800, fill: 'white' }}>✓</text>
              </motion.g>
            )}
          </motion.g>
        );
      })}
    </svg>
  );
}
