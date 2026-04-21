"use client";

import { useState, useMemo } from "react";
import { Check, Calculator } from "lucide-react";
import RangeSlider from "@/components/RangeSlider";

interface CustomCheckboxProps {
  label: string;
  checked: boolean;
  onChange: (val: boolean) => void;
  renderWeights?: React.ReactNode;
}

function CustomCheckbox({
  label,
  checked,
  onChange,
  renderWeights,
}: CustomCheckboxProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between py-1 gap-2">
      <div
        className="flex items-start gap-3 cursor-pointer group"
        onClick={() => onChange(!checked)}
      >
        <div
          className={`shrink-0 mt-0.5 w-6 h-6 rounded-md flex items-center justify-center transition-colors border-2 ${checked
            ? "bg-[#0066ff] border-[#0066ff]"
            : "bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600"
            }`}
        >
          {checked && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
        </div>
        <span className="font-bold text-slate-900 dark:text-slate-100 text-[16px] leading-tight pt-0.5 max-w-[260px]">
          {label}
        </span>
      </div>
      {renderWeights && (
        <div className="ml-9 sm:ml-0 flex items-center gap-2">
          {renderWeights}
        </div>
      )}
    </div>
  );
}

function WeightSelect({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (val: string) => void;
  label?: string;
}) {
  return (
    <div className="flex flex-col gap-1 items-center">
      {label && (
        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold leading-none uppercase tracking-wide">
          {label}
        </span>
      )}
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md px-2 py-1 outline-none focus:border-blue-400 focus:bg-white dark:focus:bg-slate-600 appearance-none cursor-pointer pr-6 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors shadow-sm"
          style={{
            backgroundImage: `url('data:image/svg+xml;charset=US-ASCII,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="%2364748b" viewBox="0 0 16 16"><path d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06z"/></svg>')`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 2px center",
            backgroundSize: "14px 14px",
          }}
        >
          <option value="0.5">Scăzută (½ șanse)</option>
          <option value="1.0">Standard (1x)</option>
          <option value="2.0">Crescută (2x șanse)</option>
        </select>
      </div>
    </div>
  );
}

const MATH_CHAPTERS = [
  { key: "algebra", label: "Algebră", color: "blue" },
  { key: "analiza", label: "Analiză Matematică", color: "orange" },
  { key: "geometrie", label: "Geometrie", color: "green" },
  { key: "trigonometrie", label: "Trigonometrie", color: "purple" },
  { key: "admitere", label: "Probleme din subiecte de admitere", color: "rose" },
];

const COLOR_MAP: Record<string, { bg: string; border: string; text: string; dot: string; heading: string; badge: string }> = {
  blue: { bg: "bg-blue-50/60 dark:bg-blue-950/30", border: "border-blue-100 dark:border-blue-900", text: "text-blue-600 dark:text-blue-400", dot: "bg-blue-500", heading: "text-blue-700 dark:text-blue-300", badge: "text-blue-400" },
  orange: { bg: "bg-orange-50/60 dark:bg-orange-950/30", border: "border-orange-100 dark:border-orange-900", text: "text-orange-600 dark:text-orange-400", dot: "bg-orange-500", heading: "text-orange-700 dark:text-orange-300", badge: "text-orange-400" },
  green: { bg: "bg-green-50/60 dark:bg-green-950/30", border: "border-green-100 dark:border-green-900", text: "text-green-600 dark:text-green-400", dot: "bg-green-500", heading: "text-green-700 dark:text-green-300", badge: "text-green-400" },
  purple: { bg: "bg-purple-50/60 dark:bg-purple-950/30", border: "border-purple-100 dark:border-purple-900", text: "text-purple-600 dark:text-purple-400", dot: "bg-purple-500", heading: "text-purple-700 dark:text-purple-300", badge: "text-purple-400" },
  rose: { bg: "bg-rose-50/60 dark:bg-rose-950/30", border: "border-rose-100 dark:border-rose-900", text: "text-rose-600 dark:text-rose-400", dot: "bg-rose-500", heading: "text-rose-700 dark:text-rose-300", badge: "text-rose-400" },
};

export default function StudentDashboard() {
  const [numQuizzes, setNumQuizzes] = useState(30);

  const [selectedChapters, setSelectedChapters] = useState<Record<string, boolean>>(
    MATH_CHAPTERS.reduce((acc, ch) => ({ ...acc, [ch.key]: false }), {}),
  );

  const [chapterWeights, setChapterWeights] = useState<Record<string, string>>(
    MATH_CHAPTERS.reduce((acc, ch) => ({ ...acc, [ch.key]: "1.0" }), {}),
  );

  const estimations = useMemo(() => {
    const results: { key: string; label: string; color: string; count: number }[] = [];

    const selected = MATH_CHAPTERS.filter((ch) => selectedChapters[ch.key]);
    if (selected.length === 0) return results;

    const totalWeight = selected.reduce(
      (s, ch) => s + parseFloat(chapterWeights[ch.key] || "1"),
      0,
    );

    if (totalWeight > 0) {
      selected.forEach((ch) => {
        const w = parseFloat(chapterWeights[ch.key] || "1");
        results.push({
          key: ch.key,
          label: ch.label,
          color: ch.color,
          count: Math.round((w / totalWeight) * numQuizzes),
        });
      });
    }

    return results;
  }, [selectedChapters, chapterWeights, numQuizzes]);

  const totalEstimated = estimations.reduce((s, e) => s + e.count, 0);

  return (
    <div className="flex-1 w-full bg-gray-200 dark:bg-slate-950 min-h-full transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-[34px] font-extrabold text-[#0066ff] dark:text-blue-400 tracking-tight mb-1">
            Configurează simularea
          </h1>
          <p className="text-[17px] text-gray-500 dark:text-slate-400">
            Alege capitolele și ponderile pentru a genera un test unic de matematică.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 p-6 sm:p-8 mb-8 transition-colors duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
                Selectează capitolele și ponderile
              </h2>
              <div className="space-y-4">
                {MATH_CHAPTERS.map((ch) => (
                  <CustomCheckbox
                    key={ch.key}
                    label={ch.label}
                    checked={selectedChapters[ch.key] || false}
                    onChange={(val) =>
                      setSelectedChapters({ ...selectedChapters, [ch.key]: val })
                    }
                    renderWeights={
                      selectedChapters[ch.key] && (
                        <WeightSelect
                          label="Pondere"
                          value={chapterWeights[ch.key]}
                          onChange={(val) =>
                            setChapterWeights({ ...chapterWeights, [ch.key]: val })
                          }
                        />
                      )
                    }
                  />
                ))}
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800 p-5 rounded-xl border border-slate-100 dark:border-slate-700">
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-4 text-center lg:text-left">
                Număr Total Grile
              </h3>
              <div className="space-y-4">
                <RangeSlider
                  label="Matematică"
                  min={5}
                  max={100}
                  step={5}
                  value={numQuizzes}
                  onChange={(val) => setNumQuizzes(val)}
                  unit="grile"
                />
              </div>
            </div>
          </div>
        </div>

        {estimations.length > 0 && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 p-6 sm:p-8 mb-12 transition-colors duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 bg-blue-50 dark:bg-blue-900/50 rounded-xl flex items-center justify-center">
                <Calculator className="w-5 h-5 text-[#0066ff] dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Estimare distribuție grile
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Total estimat:{" "}
                  <span className="font-extrabold text-[#0066ff] dark:text-blue-400">
                    {totalEstimated} grile
                  </span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {estimations.map((est) => {
                const c = COLOR_MAP[est.color];
                return (
                  <div
                    key={est.key}
                    className={`flex items-center justify-between rounded-xl px-4 py-3 border ${c.bg} ${c.border}`}
                  >
                    <p className="text-[13px] font-bold text-slate-800 dark:text-slate-200 truncate mr-3">
                      {est.label}
                    </p>
                    <span className={`text-lg font-extrabold shrink-0 ${c.text}`}>
                      ~{est.count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex justify-center pb-10">
          <button className="bg-[#0066ff] hover:bg-blue-700 text-white font-bold text-[16px] px-12 py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
            Generează simularea
          </button>
        </div>
      </div>
    </div>
  );
}
