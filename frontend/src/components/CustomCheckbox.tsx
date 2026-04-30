import { Check } from "lucide-react";

interface CustomCheckboxProps {
  label: React.ReactNode;
  checked: boolean;
  onChange: (val: boolean) => void;
  renderWeights?: React.ReactNode;
}

export default function CustomCheckbox({
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
