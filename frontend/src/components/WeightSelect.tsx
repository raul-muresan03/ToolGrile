interface WeightSelectProps {
  value: string;
  onChange: (val: string) => void;
  label?: string;
}

export default function WeightSelect({
  value,
  onChange,
  label,
}: WeightSelectProps) {
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
