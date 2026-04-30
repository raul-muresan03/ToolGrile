import { X, FileText, CheckSquare, BarChart3, ShieldCheck, Trash2 } from "lucide-react";

interface UserData {
  name: string;
  simulari: number;
  grile: number;
  media: string;
}

interface ConfirmActionState {
  type: "promote" | "deleteUser";
  target: string;
}

interface UserEditModalProps {
  editingUser: UserData;
  onClose: () => void;
  setConfirmAction: (action: ConfirmActionState) => void;
}

export default function UserEditModal({
  editingUser,
  onClose,
  setConfirmAction,
}: UserEditModalProps) {
  return (
    <div
      className="fixed inset-0 bg-black/40 dark:bg-black/60 z-50 flex items-center justify-center px-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 rounded-[1.5rem] shadow-2xl w-full max-w-sm overflow-hidden border border-transparent dark:border-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-blue-50/50 dark:bg-blue-950/50 px-6 py-5 border-b border-blue-100/50 dark:border-blue-800/50 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-0.5">
              Editare utilizator
            </p>
            <p className="text-xl font-bold text-slate-900 dark:text-white">
              {editingUser.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-blue-50 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-[13px] font-bold text-slate-700 dark:text-slate-300">
                Simulări generate
              </span>
            </div>
            <span className="font-extrabold text-slate-900 dark:text-white text-[15px]">
              {editingUser.simulari}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-green-50 dark:bg-green-900/50 rounded-lg flex items-center justify-center">
                <CheckSquare className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-[13px] font-bold text-slate-700 dark:text-slate-300">
                Grile rezolvate
              </span>
            </div>
            <span className="font-extrabold text-slate-900 dark:text-white text-[15px]">
              {editingUser.grile}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-purple-50 dark:bg-purple-900/50 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="text-[13px] font-bold text-slate-700 dark:text-slate-300">
                Media simulărilor
              </span>
            </div>
            <span className="font-extrabold text-purple-600 dark:text-purple-400 text-[15px]">
              {editingUser.media}
            </span>
          </div>
        </div>
        <div className="px-6 py-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 space-y-3">
          <button
            onClick={() =>
              setConfirmAction({
                type: "promote",
                target: editingUser.name,
              })
            }
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-xl transition-colors"
          >
            <ShieldCheck className="w-4 h-4" />
            Promovează la Admin
          </button>
          <button
            onClick={() =>
              setConfirmAction({
                type: "deleteUser",
                target: editingUser.name,
              })
            }
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-xl transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Șterge Contul
          </button>
        </div>
      </div>
    </div>
  );
}
