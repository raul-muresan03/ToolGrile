"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Student");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );

  const handleLogin = (targetRole: "admin" | "student") => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = "Câmpul de email este obligatoriu.";
    } else if (!email.includes("@") || !email.includes(".")) {
      newErrors.email = "Introduceți o adresă de email validă.";
    }

    if (!password.trim()) {
      newErrors.password = "Câmpul de parolă este obligatoriu.";
    } else if (password.length < 6) {
      newErrors.password = "Parola trebuie să aibă minim 6 caractere.";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    if (targetRole === "admin") {
      router.push("/admin");
    } else {
      router.push("/student");
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-[460px] w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 flex flex-col">
        <div className="bg-[#0066ff] px-8 pt-10 pb-8 flex flex-col items-center text-center">
          <h1 className="text-4xl font-bold text-white mb-3">ToolGrile</h1>
          <p className="text-white text-[15px] leading-snug px-2 opacity-95 font-medium">
            Platformă de simulări grile pentru admitere la medicină generală UMF
          </p>
        </div>
        <div className="px-10 py-8">
          <form className="space-y-5">
            <div>
              <label
                className="block text-[13px] font-bold text-slate-800 mb-1.5"
                htmlFor="email"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                className={`w-full px-3 py-2 border rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${errors.email ? "border-red-400 bg-red-50/50" : "border-slate-200"}`}
                required
              />
              {errors.email && (
                <p className="text-red-500 text-xs font-medium mt-1">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label
                className="block text-[13px] font-bold text-slate-800 mb-1.5"
                htmlFor="password"
              >
                Parola
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors((prev) => ({ ...prev, password: undefined }));
                }}
                className={`w-full px-3 py-2 border rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${errors.password ? "border-red-400 bg-red-50/50" : "border-slate-200"}`}
                required
              />
              {errors.password && (
                <p className="text-red-500 text-xs font-medium mt-1">
                  {errors.password}
                </p>
              )}
            </div>
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => handleLogin("student")}
                className="flex-1 flex flex-col items-center justify-center text-center bg-[#0066ff] text-white font-semibold text-[14px] leading-tight rounded-full py-2.5 px-4 hover:bg-blue-700 transition"
              >
                <span>Autentificare ca</span>
                <span>user</span>
              </button>
              <button
                type="button"
                onClick={() => handleLogin("admin")}
                className="flex-1 flex flex-col items-center justify-center text-center bg-[#0066ff] text-white font-semibold text-[14px] leading-tight rounded-full py-2.5 px-4 hover:bg-blue-700 transition"
              >
                <span>Autentificare ca</span>
                <span>admin</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
