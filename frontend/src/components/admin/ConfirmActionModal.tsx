import { ShieldCheck, AlertTriangle } from "lucide-react";

interface ConfirmActionState {
  type: "promote" | "deleteUser";
  target: string;
}

interface ConfirmActionModalProps {
  confirmAction: ConfirmActionState;
  onClose: () => void;
  onPromote: (target: string) => void;
  onDelete: (target: string) => void;
}

export default function ConfirmActionModal({
  confirmAction,
  onClose,
  onPromote,
  onDelete,
}: ConfirmActionModalProps) {
  return (
    <div
      className="fixed inset-0 bg-black/40 dark:bg-black/60 z-[60] flex items-center justify-center px-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 rounded-[1.5rem] shadow-2xl w-full max-w-sm overflow-hidden border border-transparent dark:border-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-8 text-center">
          <div
            className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 ${
              confirmAction.type === "promote"
                ? "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400"
                : "bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400"
            }`}
          >
            {confirmAction.type === "promote" ? (
              <ShieldCheck className="w-7 h-7" strokeWidth={2.5} />
            ) : (
              <AlertTriangle className="w-7 h-7" strokeWidth={2.5} />
            )}
          </div>

          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            {confirmAction.type === "promote" && "Promovare la Admin"}
            {confirmAction.type === "deleteUser" && "Ștergere utilizator"}
          </h3>
          <p className="text-[13px] leading-relaxed text-slate-500 dark:text-slate-400 mb-6 px-2 font-medium">
            {confirmAction.type === "promote" && (
              <>
                Ești sigur că vrei să promovezi <strong>{confirmAction.target}</strong> la rol de Administrator?
              </>
            )}
            {confirmAction.type === "deleteUser" && (
              <>
                Acțiunea este ireversibilă. Toate datele utilizatorului <strong>{confirmAction.target}</strong> vor fi șterse permanent!
              </>
            )}
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
            >
              Anulează
            </button>
            <button
              onClick={() => {
                if (confirmAction.type === "promote") onPromote(confirmAction.target);
                if (confirmAction.type === "deleteUser") onDelete(confirmAction.target);
              }}
              className={`flex-1 px-4 py-2.5 text-sm font-bold text-white rounded-xl transition-colors shadow-sm ${
                confirmAction.type === "promote" ? "bg-blue-600 hover:bg-blue-700" : "bg-red-600 hover:bg-red-700"
              }`}
            >
              Confirmă
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
