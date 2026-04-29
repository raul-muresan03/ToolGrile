"use client";

import { useState, useEffect } from "react";
import { Pencil, X, AlertTriangle, FileText, CheckSquare, BarChart3, ShieldCheck, Trash2, Users, Clock, TrendingUp, BookOpen, Loader2 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, } from "recharts";
import DataTable, { Column } from "@/components/DataTable";

const API_URL = "http://localhost:8000";

const CHAPTER_LABELS: Record<string, string> = {
  algebra: "Algebră",
  analiza: "Analiză Mat.",
  geometrie: "Geometrie",
  trigonometrie: "Trigonometrie",
  admitere: "Admitere",
};

interface UserData {
  name: string;
  simulari: number;
  grile: number;
  media: string;
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [chapterData, setChapterData] = useState<{ capitol: string; grile: number }[]>([]);
  const [totalGrile, setTotalGrile] = useState(0);
  const [stats, setStats] = useState({
    total_users: 0,
    total_simulations: 0,
    total_grids_solved: 0,
    total_grids_generated: 0,
    total_study_hours: 0,
    avg_score: 0,
    avg_elapsed_min: 0,
    activity_chart: [],
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${API_URL}/api/users`);
        if (!res.ok) return;
        const data = await res.json();
        setUsers(data.users);
      } catch (err) {
        console.error(err);
      } finally {
        setUsersLoading(false);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_URL}/api/stats`);
        if (!res.ok) return;
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const res = await fetch(`${API_URL}/api/chapters`);
        if (!res.ok) return;
        const data = await res.json();
        const barData: { capitol: string; grile: number }[] = [];
        let sum = 0;
        Object.entries(data.chapters).forEach(([key, val]: [string, any]) => {
          barData.push({ capitol: CHAPTER_LABELS[key] || key, grile: val.total_grids });
          sum += val.total_grids;
        });
        barData.sort((a, b) => b.grile - a.grile);
        setChapterData(barData);
        setTotalGrile(sum);
      } catch (err) {
        console.error(err);
      }
    };
    fetchChapters();
  }, []);

  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [confirmAction, setConfirmAction] = useState<{
    type: "promote" | "deleteUser";
    target: string;
  } | null>(null);

  const handleDeleteUser = (name: string) => {
    setUsers((prev) => prev.filter((u) => u.name !== name));
    setConfirmAction(null);
    setEditingUser(null);
  };

  const handlePromoteUser = (name: string) => {
    alert(`${name} a fost promovat la rol de Administrator!`);
    setConfirmAction(null);
  };

  return (
    <div className="flex-1 w-full bg-slate-50 dark:bg-slate-950 min-h-full transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8">
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-sm border border-gray-100 dark:border-slate-800 p-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white text-center mb-6">
              Gestionează utilizatorii
            </h2>
            {usersLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
              </div>
            ) : users.length === 0 ? (
              <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-12">
                Niciun utilizator încă. Datele vor apărea după prima simulare finalizată.
              </p>
            ) : (
              <DataTable
                data={users}
                columns={
                  [
                    { key: "name", title: "Nume", sortable: true },
                    { key: "simulari", title: "Simulări", sortable: true },
                    { key: "grile", title: "Grile", sortable: true },
                    { key: "media", title: "Media", sortable: true },
                  ] as Column<UserData>[]
                }
                pageSize={4}
                renderActions={(row: UserData) => (
                  <button
                    onClick={() => setEditingUser(row)}
                    className="bg-[#0066ff] hover:bg-blue-700 transition-colors w-7 h-7 rounded-lg flex items-center justify-center text-white shadow-sm"
                  >
                    <Pencil className="w-3.5 h-3.5" strokeWidth={2.5} />
                  </button>
                )}
              />
            )}
          </div>
        </div>
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
            Statistici Platformă
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 flex items-center gap-4">
              <div className="w-11 h-11 bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">
                  Utilizatori activi
                </p>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{stats.total_users}</p>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 flex items-center gap-4">
              <div className="w-11 h-11 bg-green-50 dark:bg-green-900/50 text-green-600 dark:text-green-400 rounded-xl flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">
                  Simulări generate
                </p>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{stats.total_simulations}</p>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 flex items-center gap-4">
              <div className="w-11 h-11 bg-purple-50 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">
                  Total grile disponibile
                </p>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{totalGrile.toLocaleString()}</p>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 flex items-center gap-4">
              <div className="w-11 h-11 bg-orange-50 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">
                  Total Ore Studiu
                </p>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{stats.total_study_hours}<span className="text-lg font-bold text-slate-400"> h</span></p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                Activitate săptămânală
              </h3>
              <div style={{ width: "100%", height: 288 }}>
                {mounted && (
                  <ResponsiveContainer width="100%" height={288}>
                    <LineChart
                      data={stats.activity_chart}
                      margin={{ top: 5, right: 20, left: -20, bottom: 5 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#334155"
                      />
                      <XAxis
                        dataKey="zi"
                        tick={{ fontSize: 12, fill: "#94a3b8" }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 12, fill: "#94a3b8" }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: "12px",
                          border: "none",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                          backgroundColor: "var(--background)",
                          color: "var(--foreground)",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="simulari"
                        name="Simulări"
                        stroke="#0066ff"
                        strokeWidth={3}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="studenti"
                        name="Studenți"
                        stroke="#10b981"
                        strokeWidth={3}
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                Grile disponibile per capitol
              </h3>
              <div style={{ width: "100%", height: 288 }}>
                {mounted && chapterData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chapterData}
                      margin={{ top: 5, right: 20, left: -20, bottom: 5 }}
                      layout="vertical"
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        horizontal={false}
                        stroke="#334155"
                      />
                      <XAxis
                        type="number"
                        tick={{ fontSize: 11, fill: "#94a3b8" }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        dataKey="capitol"
                        type="category"
                        tick={{ fontSize: 11, fill: "#94a3b8" }}
                        tickLine={false}
                        axisLine={false}
                        width={100}
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: "12px",
                          border: "none",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                          backgroundColor: "var(--background)",
                          color: "var(--foreground)",
                        }}
                      />
                      <Bar
                        dataKey="grile"
                        name="Grile disponibile"
                        fill="#0066ff"
                        radius={[0, 8, 8, 0]}
                        barSize={20}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  Timp mediu / grilă
                </span>
              </div>
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {stats.total_grids_generated > 0 && stats.total_simulations > 0
                  ? Math.round((stats.avg_elapsed_min * 60) / (stats.total_grids_generated / stats.total_simulations))
                  : 0} <span className="text-lg font-bold text-slate-400">sec</span>
              </p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-purple-50 dark:bg-purple-900/50 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  Timp mediu / simulare
                </span>
              </div>
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {stats.avg_elapsed_min} <span className="text-lg font-bold text-slate-400">min</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      {editingUser && !confirmAction && (
        <div
          className="fixed inset-0 bg-black/40 dark:bg-black/60 z-50 flex items-center justify-center px-4"
          onClick={() => setEditingUser(null)}
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
                onClick={() => setEditingUser(null)}
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
      )}
      {confirmAction && (
        <div
          className="fixed inset-0 bg-black/40 dark:bg-black/60 z-[60] flex items-center justify-center px-4"
          onClick={() => setConfirmAction(null)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-[1.5rem] shadow-2xl w-full max-w-sm overflow-hidden border border-transparent dark:border-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-8 text-center">
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 ${confirmAction.type === "promote"
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
                    Ești sigur că vrei să promovezi{" "}
                    <strong>{confirmAction.target}</strong> la rol de
                    Administrator?
                  </>
                )}
                {confirmAction.type === "deleteUser" && (
                  <>
                    Acțiunea este ireversibilă. Toate datele utilizatorului{" "}
                    <strong>{confirmAction.target}</strong> vor fi șterse
                    permanent!
                  </>
                )}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmAction(null)}
                  className="flex-1 px-4 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
                >
                  Anulează
                </button>
                <button
                  onClick={() => {
                    if (confirmAction.type === "promote")
                      handlePromoteUser(confirmAction.target);
                    if (confirmAction.type === "deleteUser")
                      handleDeleteUser(confirmAction.target);
                  }}
                  className={`flex-1 px-4 py-2.5 text-sm font-bold text-white rounded-xl transition-colors shadow-sm ${confirmAction.type === "promote"
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-red-600 hover:bg-red-700"
                    }`}
                >
                  Confirmă
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
