import { motion } from 'framer-motion';
import { ArrowRight, GitBranch, ArrowUpRight } from 'lucide-react';

export default function IntegrationView({ cycle, lang }) {
  const integrations = cycle.integrations || [];

  return (
    <div className="max-w-3xl space-y-6">
      <div className="bg-white rounded-2xl border border-stone-200 p-6 lg:p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-rose-500 flex items-center justify-center">
            <GitBranch className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight" style={{ fontFamily: "'Fraunces', serif" }}>
              {lang === 'en' ? 'Pathway Integration' : 'שילוב מסלולים'}
            </h2>
            <p className="text-sm text-slate-500">
              {lang === 'en'
                ? 'How this cycle connects to the rest of metabolism'
                : 'כיצד המעגל הזה מתחבר לשאר המטבוליזם'}
            </p>
          </div>
        </div>

        {/* Tissue context */}
        {cycle.context && (
          <div className="bg-gradient-to-br from-blue-50 to-emerald-50 rounded-xl p-5 border border-blue-100 mb-6">
            <div className="text-[10px] uppercase tracking-widest font-semibold text-blue-700 mb-2">
              {lang === 'en' ? 'Where & When' : 'איפה ומתי'}
            </div>
            <div className="space-y-1.5 text-sm">
              <div><b className="text-slate-700">{lang === 'en' ? 'Primary tissue: ' : 'רקמה עיקרית: '}</b>{cycle.context.tissue[lang]}</div>
              {cycle.context.otherTissues && (
                <div><b className="text-slate-700">{lang === 'en' ? 'Minor sites: ' : 'אתרים נוספים: '}</b>{cycle.context.otherTissues[lang]}</div>
              )}
              <div><b className="text-slate-700">{lang === 'en' ? 'Active state: ' : 'מצב פעיל: '}</b>{cycle.context.state[lang]}</div>
              {cycle.context.stateHormonal && (
                <div><b className="text-slate-700">{lang === 'en' ? 'Hormonal: ' : 'הורמונלי: '}</b>{cycle.context.stateHormonal[lang]}</div>
              )}
              {cycle.context.turnover && (
                <div><b className="text-slate-700">{lang === 'en' ? 'Adaptation: ' : 'הסתגלות: '}</b>{cycle.context.turnover[lang]}</div>
              )}
            </div>
          </div>
        )}

        {/* Transporters */}
        {cycle.transporters && cycle.transporters.length > 0 && (
          <div className="mb-6">
            <h3 className="text-[10px] uppercase tracking-widest font-semibold text-slate-500 mb-3">
              {lang === 'en' ? 'Membrane Transporters' : 'מובילים ממברנליים'}
            </h3>
            <div className="space-y-3">
              {cycle.transporters.map((t, i) => (
                <div key={i} className="bg-white rounded-xl border border-stone-200 p-4">
                  <div className="font-semibold">{lang === 'he' && t.he ? t.he : t.name}</div>
                  <div className="text-xs text-slate-500 mt-1 flex items-center gap-2 flex-wrap">
                    <span className="font-mono">{t.imports}</span>
                    <span>⇄</span>
                    <span className="font-mono">{t.exports}</span>
                  </div>
                  {t.note && (
                    <p className="text-xs text-slate-600 mt-2">{t.note[lang] || t.note.en}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Integrations list */}
        <h3 className="text-[10px] uppercase tracking-widest font-semibold text-slate-500 mb-3">
          {lang === 'en' ? 'Connected Pathways' : 'מסלולים מחוברים'}
        </h3>
        <div className="space-y-4">
          {integrations.map((integ, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-white rounded-xl border border-stone-200 p-5"
            >
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <ArrowUpRight className="w-4 h-4 text-purple-600 shrink-0" />
                <span className="font-semibold">{lang === 'he' && integ.he ? integ.he : integ.name}</span>
                {integ.toCycle && (
                  <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-semibold">
                    → {integ.toCycle}
                  </span>
                )}
                {integ.fromCycle && (
                  <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-semibold">
                    ← {integ.fromCycle}
                  </span>
                )}
              </div>
              {integ.path && (
                <p className="text-sm font-mono text-slate-700 mb-2 bg-stone-50 rounded-md p-2">
                  {integ.path[lang] || integ.path.en}
                </p>
              )}
              {integ.note && (
                <p className="text-xs text-slate-600 leading-relaxed">
                  {integ.note[lang] || integ.note.en}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
