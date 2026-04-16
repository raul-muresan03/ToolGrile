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
          className={`shrink-0 mt-0.5 w-6 h-6 rounded-md flex items-center justify-center transition-colors border-2 ${
            checked
              ? "bg-[#0066ff] border-[#0066ff]"
              : "bg-white border-gray-300"
          }`}
        >
          {checked && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
        </div>
        <span className="font-bold text-slate-900 text-[16px] leading-tight pt-0.5 max-w-[200px]">
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
        <span className="text-[10px] text-slate-500 font-bold leading-none uppercase tracking-wide">
          {label}
        </span>
      )}
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="text-[11px] font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-md px-2 py-1 outline-none focus:border-blue-400 focus:bg-white appearance-none cursor-pointer pr-6 hover:bg-slate-100 transition-colors shadow-sm"
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

const MATERII = {
  ALGEBRA: "Algebră",
  ANALIZA: "Analiză Matematică",
  GEOMETRIE: "Geometrie & Trigonometrie",
  ADMITERE: "Subiecte Admitere / Simulare",
};

export default function Home() {
  const [materii, setMaterii] = useState({
    [MATERII.ALGEBRA]: false,
    [MATERII.ANALIZA]: false,
    [MATERII.GEOMETRIE]: false,
    [MATERII.ADMITERE]: false,
  });

  const [numQuizzes, setNumQuizzes] = useState(30);

  const [weights, setWeights] = useState<Record<string, string>>({
    [MATERII.ALGEBRA]: "1.0",
    [MATERII.ANALIZA]: "1.0",
    [MATERII.GEOMETRIE]: "1.0",
    [MATERII.ADMITERE]: "1.0",
  });

  const estimations = useMemo(() => {
    const results: { chapter: string; count: number; type: string }[] = [];

    const selectedMaterii = Object.entries(materii)
      .filter(([_, isSelected]) => isSelected)
      .map(([name]) => name);

    if (selectedMaterii.length === 0) return results;

    const totalWeight = selectedMaterii.reduce(
      (s, c) => s + parseFloat(weights[c] || "1"),
      0
    );

    if (totalWeight > 0) {
      selectedMaterii.forEach((c) => {
        const w = parseFloat(weights[c] || "1");
        results.push({
          chapter: c,
          count: Math.round((w / totalWeight) * numQuizzes),
          type: "Matematică",
        });
      });
    }

    return results;
  }, [materii, weights, numQuizzes]);

  const totalEstimated = estimations.reduce((s, e) => s + e.count, 0);

  return (
    <div className="flex-1 w-full min-h-full pb-20">
      <div className="mb-8 pl-2">
        <h1 className="text-[34px] font-extrabold text-[#0066ff] tracking-tight mb-1">
          Configurează simularea
        </h1>
        <p className="text-[17px] text-gray-500">
          Alege capitolele și ponderile pentru a genera un test de matematică unic.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-6">
              Selectează capitolele dorite
            </h2>
            <div className="flex flex-col gap-4">
              {Object.values(MATERII).map((capitol) => (
                <CustomCheckbox
                  key={capitol}
                  label={capitol}
                  checked={materii[capitol]}
                  onChange={(val) =>
                    setMaterii({ ...materii, [capitol]: val })
                  }
                  renderWeights={
                    materii[capitol] && (
                      <WeightSelect
                        label="Pondere"
                        value={weights[capitol]}
                        onChange={(val) =>
                          setWeights({ ...weights, [capitol]: val })
                        }
                      />
                    )
                  }
                />
              ))}
            </div>
          </div>

          <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 flex flex-col justify-center">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-6 text-center lg:text-left">
              Număr Grile (Configurație Standard)
            </h3>
            <div className="space-y-4">
              <RangeSlider
                label="Total Grile Simulate"
                min={5}
                max={60}
                step={5}
                value={numQuizzes}
                onChange={setNumQuizzes}
                unit="grile"
              />
            </div>
            <p className="text-xs text-slate-400 mt-6 text-center lg:text-left">
              Bifați capitolele, iar grila va fi formată automat în funcție de cantitatea și ponderea alese mai sus.
            </p>
          </div>
        </div>
      </div>

      {estimations.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center">
              <Calculator className="w-5 h-5 text-[#0066ff]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Estimare distribuție grile
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Total estimat:{" "}
                <span className="font-extrabold text-[#0066ff]">
                  {totalEstimated} grile
                </span>
              </p>
            </div>
          </div>

          <div className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {estimations.map((est, i) => {
                // Determine a nice color based on the chapter type
                const colorTheme = 
                  est.chapter.includes("Algebră") ? { bg: "bg-blue-50/60", border: "border-blue-100", text: "text-blue-600" } :
                  est.chapter.includes("Analiză") ? { bg: "bg-orange-50/60", border: "border-orange-100", text: "text-orange-600" } :
                  est.chapter.includes("Geometrie") ? { bg: "bg-green-50/60", border: "border-green-100", text: "text-green-600" } :
                  { bg: "bg-purple-50/60", border: "border-purple-100", text: "text-purple-600" };

                return (
                  <div
                    key={`mat-${i}`}
                    className={`flex items-center justify-between rounded-xl px-4 py-3 border ${colorTheme.bg} ${colorTheme.border}`}
                  >
                    <p className="text-[14px] font-bold text-slate-800 mr-3">
                      {est.chapter}
                    </p>
                    <span className={`text-xl font-extrabold shrink-0 ${colorTheme.text}`}>
                      ~{est.count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-center pb-10 mt-12">
        <button className="bg-[#0066ff] hover:bg-blue-700 text-white font-bold text-[16px] px-12 py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
          Generează simularea
        </button>
      </div>
    </div>
  );
}
