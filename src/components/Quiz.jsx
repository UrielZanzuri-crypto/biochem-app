import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Flame, Trophy, RefreshCw } from 'lucide-react';
import { grade, loadCycle, saveCycle, shuffle } from '../srs.js';

export default function Quiz({ cycle, lang, onExit }) {
  const [cards, setCards] = useState({});
  const [order, setOrder] = useState([]);
  const [idx, setIdx] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [score, setScore] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState([]);
  const [shuffledOptions, setShuffledOptions] = useState([]);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    startQuiz();
  }, [cycle.id]);

  function startQuiz() {
    const loaded = loadCycle(cycle.id);
    setCards(loaded);
    const now = Date.now();
    const due = cycle.questions.filter(q => (loaded[q.id]?.due ?? 0) <= now);
    const selected = shuffle(due.length ? due : cycle.questions).slice(0, 10);
    setOrder(selected);
    setIdx(0);
    setStreak(0);
    setBestStreak(0);
    setScore(0);
    setWrongAnswers([]);
    setFinished(false);
    setFeedback(null);
  }

  const q = order[idx];
  useEffect(() => {
    if (q) setShuffledOptions(shuffle(q.options));
  }, [q?.id]);

  const answer = (choice) => {
    if (feedback) return;
    const correct = choice === q.correct;
    setFeedback({ correct, right: q.correct, picked: choice });
    const quality = correct ? (streak > 2 ? 5 : 4) : 0;
    const next = { ...cards, [q.id]: grade(cards[q.id] || {}, quality) };
    setCards(next);
    saveCycle(cycle.id, next);
    const newStreak = correct ? streak + 1 : 0;
    setStreak(newStreak);
    if (newStreak > bestStreak) setBestStreak(newStreak);
    if (correct) setScore(s => s + 1);
    else setWrongAnswers(w => [...w, { prompt: q.prompt[lang] || q.prompt.en, correctAnswer: q.correct, picked: choice }]);
    setTimeout(() => {
      setFeedback(null);
      if (idx + 1 < order.length) setIdx(idx + 1);
      else setFinished(true);
    }, 1400);
  };

  // Finished — show score screen
  if (finished) {
    const total = order.length;
    const pct = Math.round((score / total) * 100);
    const grade = pct >= 90 ? 'A' : pct >= 80 ? 'B' : pct >= 70 ? 'C' : pct >= 60 ? 'D' : 'F';
    const gradeColor = pct >= 80 ? 'text-emerald-600' : pct >= 60 ? 'text-amber-600' : 'text-rose-600';
    const emoji = pct >= 90 ? '🎉' : pct >= 80 ? '👏' : pct >= 70 ? '👍' : pct >= 60 ? '💪' : '📚';

    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl border border-stone-200 p-8">
          <div className="text-center mb-6">
            <div className="text-6xl mb-3">{emoji}</div>
            <div className="text-sm text-slate-500 uppercase tracking-wider font-bold mb-2">Quiz Complete</div>
            <div className={`text-7xl font-bold ${gradeColor} mb-2`} style={{ fontFamily: "'Fraunces', serif" }}>
              {score}<span className="text-4xl text-slate-400">/{total}</span>
            </div>
            <div className={`text-4xl font-black ${gradeColor} mb-1`}>{pct}%</div>
            <div className="text-sm text-slate-500">Grade: <span className={`font-bold ${gradeColor}`}>{grade}</span></div>
          </div>

          {bestStreak >= 3 && (
            <div className="flex items-center justify-center gap-2 mb-6 p-3 bg-amber-50 border border-amber-200 rounded-xl">
              <Flame className="w-5 h-5 text-amber-600" />
              <span className="font-semibold text-amber-700">Best streak: {bestStreak} in a row</span>
            </div>
          )}

          {wrongAnswers.length > 0 && (
            <div className="mb-6">
              <div className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">
                {lang === 'en' ? 'Review these' : 'חזור על אלה'}
              </div>
              <div className="space-y-3">
                {wrongAnswers.map((w, i) => (
                  <div key={i} className="p-3 bg-rose-50 border border-rose-200 rounded-lg">
                    <div className="font-semibold text-slate-800 mb-1">{w.prompt}</div>
                    <div className="text-sm text-rose-700">
                      <X className="w-3.5 h-3.5 inline mb-0.5" /> Your answer: <span className="font-medium">{w.picked}</span>
                    </div>
                    <div className="text-sm text-emerald-700">
                      <Check className="w-3.5 h-3.5 inline mb-0.5" /> Correct: <span className="font-medium">{w.correctAnswer}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={startQuiz}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition"
            >
              <RefreshCw className="w-4 h-4" /> {lang === 'en' ? 'Retake' : 'נסה שוב'}
            </button>
            <button
              onClick={onExit}
              className="flex-1 py-3 rounded-xl border-2 border-slate-200 font-semibold hover:border-slate-400 transition"
            >
              {lang === 'en' ? 'Done' : 'סיום'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!q) return null;
  const progress = (idx / order.length) * 100;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl border border-stone-200 p-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="font-mono">{idx + 1} / {order.length}</span>
            <span className="font-mono text-emerald-600">✓ {score}</span>
            {streak > 1 && (
              <motion.span
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-0.5 text-amber-600 font-semibold"
              >
                <Flame className="w-3.5 h-3.5" /> {streak}
              </motion.span>
            )}
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${
              q.difficulty === 'easy' ? 'bg-emerald-100 text-emerald-700' :
              q.difficulty === 'hard' ? 'bg-rose-100 text-rose-700' :
              'bg-amber-100 text-amber-700'
            }`}>
              {q.difficulty}
            </span>
          </div>
          <button onClick={onExit} className="text-xs text-slate-500 hover:text-slate-900 transition">
            {lang === 'en' ? 'Exit' : 'יציאה'}
          </button>
        </div>

        <div className="h-1.5 bg-stone-100 rounded-full mb-7 overflow-hidden">
          <motion.div className="h-full bg-slate-900" animate={{ width: `${progress}%` }} />
        </div>

        <h3 className="text-xl lg:text-2xl font-semibold leading-snug mb-6"
          style={{ fontFamily: lang === 'he' ? "'Frank Ruhl Libre', serif" : "'Fraunces', serif" }}>
          {q.prompt[lang] || q.prompt.en}
        </h3>

        <div className="space-y-2">
          {shuffledOptions.map(opt => {
            const isRight = feedback && opt === feedback.right;
            const isPicked = feedback && opt === feedback.picked;
            const isWrong = isPicked && !feedback.correct;
            return (
              <button
                key={opt}
                onClick={() => answer(opt)}
                disabled={!!feedback}
                className={`w-full text-start p-4 rounded-xl border-2 transition ${
                  feedback
                    ? isRight ? 'bg-emerald-50 border-emerald-400'
                    : isWrong ? 'bg-rose-50 border-rose-400'
                    : 'bg-stone-50 border-stone-200 opacity-50'
                    : 'border-stone-200 hover:border-slate-900 hover:bg-stone-50'
                }`}
              >
                <span className="flex items-center justify-between">
                  <span className="font-medium">{opt}</span>
                  {isRight && <Check className="w-5 h-5 text-emerald-600" />}
                  {isWrong && <X className="w-5 h-5 text-rose-600" />}
                </span>
              </button>
            );
          })}
        </div>

        {feedback && !feedback.correct && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-sm text-rose-700 bg-rose-50 rounded-lg p-3"
          >
            {lang === 'en' ? 'Correct answer: ' : 'התשובה הנכונה: '}<strong>{feedback.right}</strong>
          </motion.div>
        )}
      </div>
    </div>
  );
}
