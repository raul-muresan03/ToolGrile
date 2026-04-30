"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Pencil, X, AlertTriangle, FileText, CheckSquare, BarChart3, ShieldCheck, Trash2, Users, Clock, TrendingUp, BookOpen, Loader2, Eye } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, } from "recharts";
import DataTable, { Column } from "@/components/DataTable";
import { API_URL, CHAPTER_LABELS, TIMEFRAME_OPTIONS } from "@/lib/constants";

interface UserData {
  name: string;
  simulari: number;
  grile: number;
  media: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [users, setUsers] = useState<UserData[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (!storedUser) {
      router.replace("/");
      return;
    }
    try {
      const parsed = JSON.parse(storedUser);
      if (parsed.role !== "admin") {
        router.replace("/");
      }
    } catch (err) {
      router.replace("/");
    }
  }, [router]);
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
    easiest_chapter: null as string | null,
    easiest_correct_count: 0,
    hardest_chapter: null as string | null,
    hardest_wrong_count: 0,
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

  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [profileTimeframe, setProfileTimeframe] = useState<number | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    if (!selectedUser) return;
    const fetchProfile = async () => {
      setProfileLoading(true);
      try {
        const url = profileTimeframe
          ? `${API_URL}/api/users/${selectedUser}/stats?days=${profileTimeframe}`
          : `${API_URL}/api/users/${selectedUser}/stats`;
        const res = await fetch(url);
        if (!res.ok) return;
        const data = await res.json();
        setUserProfile(data);
      } catch (err) {
        console.error(err);
      } finally {
        setProfileLoading(false);
      }
    };
    fetchProfile();
  }, [selectedUser, profileTimeframe]);

  const handleDeleteUser = async (name: string) => {
    try {
      const res = await fetch(`${API_URL}/api/users/${name}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        alert("Eroare la ștergerea utilizatorului.");
        return;
      }
      setUsers((prev) => prev.filter((u) => u.name !== name));
      setConfirmAction(null);
      setEditingUser(null);
    } catch (err) {
      console.error(err);
      alert("Eroare de rețea la ștergerea utilizatorului.");
    }
  };

  const handlePromoteUser = async (name: string) => {
    try {
      const res = await fetch(`${API_URL}/api/users/${name}/role`, {
        method: "PUT",
      });
      if (!res.ok) {
        alert("Eroare la promovarea utilizatorului.");
        return;
      }
      alert(`${name} a fost promovat la rol de Administrator!`);
      setConfirmAction(null);
      setEditingUser(null);
    } catch (err) {
      console.error(err);
      alert("Eroare de rețea la promovare.");
    }
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
                  <div className="flex justify-end gap-1.5">
                    <button
                      onClick={() => { setSelectedUser(row.name); setProfileTimeframe(null); }}
                      className="bg-[#0066ff] hover:bg-blue-700 transition-colors w-7 h-7 rounded-lg flex items-center justify-center text-white shadow-sm"
                      title="Statistici"
                    >
                      <Eye className="w-3.5 h-3.5" strokeWidth={2.5} />
                    </button>
                    <button
                      onClick={() => setEditingUser(row)}
                      className="bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors w-7 h-7 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-300 shadow-sm"
                      title="Editare"
                    >
                      <Pencil className="w-3.5 h-3.5" strokeWidth={2.5} />
                    </button>
                  </div>
                )}
              />
            )}
          </div>
        </div>
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
            Statistici Platformă
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 flex items-center gap-4">
              <div className="w-11 h-11 bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-bold truncate uppercase tracking-wider">
                  Total utilizatori
                </p>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white truncate">{stats.total_users}</p>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 flex items-center gap-4">
              <div className="w-11 h-11 bg-green-50 dark:bg-green-900/50 text-green-600 dark:text-green-400 rounded-xl flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-bold truncate uppercase tracking-wider">
                  Total simulări
                </p>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white truncate">{stats.total_simulations}</p>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 flex items-center gap-4">
              <div className="w-11 h-11 bg-purple-50 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-bold truncate uppercase tracking-wider">
                  Total grile
                </p>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white truncate">{totalGrile.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 flex items-center gap-4">
              <div className="w-11 h-11 bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-bold truncate uppercase tracking-wider">
                  Timp mediu / simulare
                </p>
                <p className="text-xl font-extrabold text-slate-900 dark:text-white truncate">
                  {stats.avg_elapsed_min}<span className="text-sm font-bold text-slate-400 ml-1">min</span>
                </p>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 flex items-center gap-4">
              <div className="w-11 h-11 bg-amber-50 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-bold truncate uppercase tracking-wider">
                  Timp / Grilă
                </p>
                <p className="text-xl font-extrabold text-slate-900 dark:text-white truncate">
                  {stats.total_grids_generated > 0 && stats.total_simulations > 0
                    ? Math.round((stats.avg_elapsed_min * 60) / (stats.total_grids_generated / stats.total_simulations))
                    : 0}<span className="text-sm font-bold text-slate-400 ml-1">sec</span>
                </p>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 flex items-center gap-4">
              <div className="w-11 h-11 bg-emerald-50 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-bold truncate uppercase tracking-wider">
                  Cel mai ușor
                </p>
                <p className="text-lg font-extrabold text-slate-900 dark:text-white capitalize truncate" title={stats.easiest_chapter || "-"}>
                  {stats.easiest_chapter || "-"}
                </p>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 flex items-center gap-4">
              <div className="w-11 h-11 bg-rose-50 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 rounded-xl flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-bold truncate uppercase tracking-wider">
                  Cel mai greu
                </p>
                <p className="text-lg font-extrabold text-slate-900 dark:text-white capitalize truncate" title={stats.hardest_chapter || "-"}>
                  {stats.hardest_chapter || "-"}
                </p>
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
                        cursor={{ fill: "rgba(255, 255, 255, 0.05)" }}
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
        </div>
      </div>
      {selectedUser && (
        <div
          className="fixed inset-0 bg-black/40 dark:bg-black/60 z-50 flex items-center justify-center px-4"
          onClick={() => { setSelectedUser(null); setUserProfile(null); }}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-[1.5rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-transparent dark:border-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-blue-50/50 dark:bg-blue-950/50 px-6 py-5 border-b border-blue-100/50 dark:border-blue-800/50 flex items-center justify-between sticky top-0 z-10">
              <div>
                <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-0.5">
                  Profil Student
                </p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">
                  {selectedUser}
                </p>
              </div>
              <button
                onClick={() => { setSelectedUser(null); setUserProfile(null); }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex gap-2 flex-wrap">
                {TIMEFRAME_OPTIONS.map((opt) => (
                  <button
                    key={opt.label}
                    onClick={() => setProfileTimeframe(opt.value)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${profileTimeframe === opt.value
                      ? "bg-[#0066ff] text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                      }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {profileLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
              </div>
            ) : userProfile ? (
              <div className="px-6 py-5 space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl text-center">
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Simulări</p>
                    <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{userProfile.total_simulations}</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl text-center">
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Media</p>
                    <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{userProfile.avg_score}<span className="text-sm text-slate-400">/10</span></p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl text-center">
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Grile totale</p>
                    <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{userProfile.total_grids}</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl text-center">
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Corecte</p>
                    <p className="text-2xl font-extrabold text-green-600 dark:text-green-400">{userProfile.total_correct}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userProfile.best_chapter && (
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 p-4 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                        <span className="text-xs font-bold text-green-700 dark:text-green-400 uppercase tracking-wider">Cel mai bun capitol</span>
                      </div>
                      <p className="text-lg font-extrabold text-slate-900 dark:text-white">
                        {CHAPTER_LABELS[userProfile.best_chapter.chapter] || userProfile.best_chapter.chapter}
                      </p>
                      <p className="text-sm text-green-600 dark:text-green-400 font-bold">{userProfile.best_chapter.accuracy}% acuratețe ({userProfile.best_chapter.correct}/{userProfile.best_chapter.total})</p>
                    </div>
                  )}
                  {userProfile.worst_chapter && userProfile.chapter_breakdown.length > 1 && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 p-4 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
                        <span className="text-xs font-bold text-red-700 dark:text-red-400 uppercase tracking-wider">Cel mai slab capitol</span>
                      </div>
                      <p className="text-lg font-extrabold text-slate-900 dark:text-white">
                        {CHAPTER_LABELS[userProfile.worst_chapter.chapter] || userProfile.worst_chapter.chapter}
                      </p>
                      <p className="text-sm text-red-600 dark:text-red-400 font-bold">{userProfile.worst_chapter.accuracy}% acuratețe ({userProfile.worst_chapter.correct}/{userProfile.worst_chapter.total})</p>
                    </div>
                  )}
                </div>

                {userProfile.trend.length > 1 && (
                  <div className="bg-slate-50 dark:bg-slate-800 p-5 rounded-xl">
                    <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4">Evoluția notelor</h4>
                    <div style={{ width: "100%", height: 220 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={userProfile.trend} margin={{ top: 5, right: 15, left: -25, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                          <XAxis dataKey="sim" tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
                          <YAxis domain={[0, 10]} tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
                          <Tooltip
                            contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", backgroundColor: "var(--background)", color: "var(--foreground)" }}
                            formatter={(value: any) => [`${value}/10`, "Notă"]}
                            labelFormatter={(label: any) => {
                              const item = userProfile.trend.find((t: any) => t.sim === label);
                              return item ? `${label} (${item.date})` : label;
                            }}
                          />
                          <Line type="monotone" dataKey="score" stroke="#0066ff" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

                {userProfile.chapter_breakdown.length > 0 && (
                  <div className="bg-slate-50 dark:bg-slate-800 p-5 rounded-xl">
                    <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Acuratețe per capitol</h4>
                    <div className="space-y-3">
                      {userProfile.chapter_breakdown.map((ch: any) => (
                        <div key={ch.chapter}>
                          <div className="flex justify-between text-xs font-bold mb-1">
                            <span className="text-slate-600 dark:text-slate-400">{CHAPTER_LABELS[ch.chapter] || ch.chapter}</span>
                            <span className="text-slate-900 dark:text-white">{ch.accuracy}% ({ch.correct}/{ch.total})</span>
                          </div>
                          <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${ch.accuracy >= 70 ? "bg-green-500" : ch.accuracy >= 40 ? "bg-yellow-500" : "bg-red-500"
                                }`}
                              style={{ width: `${ch.accuracy}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center py-16">
                <p className="text-sm text-slate-400">Nu s-au găsit date.</p>
              </div>
            )}
          </div>
        </div>
      )}
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
