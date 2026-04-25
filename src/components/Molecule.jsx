import { useEffect, useRef, useState } from 'react';
import SmilesDrawer from 'smiles-drawer';

// Cache rendered SMILES as SVG strings so we don't re-render constantly
const cache = new Map();

export default function Molecule({ smiles, width = 140, height = 90, compact = false, theme = 'light' }) {
  const ref = useRef(null);
  const [failed, setFailed] = useState(false);
  const cacheKey = `${smiles}|${width}|${height}|${theme}`;

  useEffect(() => {
    if (!ref.current || !smiles) return;

    // Use cached SVG if available
    if (cache.has(cacheKey)) {
      ref.current.innerHTML = cache.get(cacheKey);
      return;
    }

    try {
      const drawer = new SmilesDrawer.SvgDrawer({
        width,
        height,
        padding: compact ? 2 : 8,
        bondThickness: 1.1,
        bondLength: compact ? 12 : 16,
        shortBondLength: 0.85,
        atomVisualization: 'default',
        terminalCarbons: false,
        explicitHydrogens: false,
        fontSizeLarge: compact ? 8 : 10,
        fontSizeSmall: compact ? 5 : 6,
        themes: {
          light: {
            C: '#1e293b',
            O: '#dc2626',
            N: '#2563eb',
            F: '#10b981',
            CL: '#10b981',
            BR: '#b45309',
            I: '#7c3aed',
            P: '#ea580c',
            S: '#ca8a04',
            B: '#ec4899',
            SI: '#64748b',
            H: '#94a3b8',
            BACKGROUND: '#ffffff'
          }
        }
      });

      SmilesDrawer.parse(
        smiles,
        (tree) => {
          // Create temp SVG to draw into
          const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          svg.setAttribute('width', width);
          svg.setAttribute('height', height);
          drawer.draw(tree, svg, theme);
          if (ref.current) {
            ref.current.innerHTML = svg.outerHTML;
            cache.set(cacheKey, svg.outerHTML);
          }
        },
        (err) => {
          console.warn('SMILES parse error:', smiles, err);
          setFailed(true);
        }
      );
    } catch (e) {
      console.warn('Molecule render error:', e);
      setFailed(true);
    }
  }, [smiles, width, height, compact, theme, cacheKey]);

  if (failed) {
    return (
      <div
        style={{ width, height }}
        className="flex items-center justify-center text-xs text-slate-400 bg-stone-50 rounded"
      >
        {smiles || '—'}
      </div>
    );
  }

  return <div ref={ref} style={{ width, height, display: 'inline-block' }} />;
}
