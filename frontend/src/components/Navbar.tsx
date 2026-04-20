"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  LogIn,
  User,
  Trash2,
  AlertTriangle,
  FileText,
  BarChart3,
  CheckSquare,
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
        setTimeout(() => setIsDeleteConfirmOpen(false), 200);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const isLoggedIn = pathname === "/student" || pathname === "/admin";

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center gap-2">
              <span className="font-bold text-xl text-blue-600">ToolGrile</span>
            </Link>
          </div>
          <div className="hidden sm:flex sm:items-center">
            {isLoggedIn ? (
              <div className="relative" ref={menuRef}>
                <div
                  className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => {
                    setIsUserMenuOpen(!isUserMenuOpen);
                    setIsDeleteConfirmOpen(false);
                  }}
                >
                  <span className="font-bold text-slate-900 text-lg select-none">
                    {pathname === "/admin" ? "Admin" : "User"}
                  </span>
                  <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center text-blue-900 shadow-sm">
                    <User className="w-6 h-6" />
                  </div>
                </div>
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-3 w-72 bg-white rounded-[1.25rem] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden z-50">
                    {!isDeleteConfirmOpen ? (
                      <div>
                        <div className="bg-blue-50/50 px-5 py-4 border-b border-blue-100/50">
                          <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-0.5">
                            Autentificat ca
                          </p>
                          <p className="text-lg font-bold text-slate-900">
                            {pathname === "/admin"
                              ? "Administrator"
                              : "Student ToolGrile"}
                          </p>
                        </div>
                        {pathname !== "/admin" && (
                          <div className="px-5 py-4 space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center">
                                  <FileText className="w-4 h-4 text-blue-600" />
                                </div>
                                <span className="text-[13px] font-bold text-slate-700">
                                  Simulări generate
                                </span>
                              </div>
                              <span className="font-extrabold text-slate-900 text-[15px]">
                                15
                              </span>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 bg-green-50 rounded-lg flex items-center justify-center">
                                  <CheckSquare className="w-4 h-4 text-green-600" />
                                </div>
                                <span className="text-[13px] font-bold text-slate-700">
                                  Grile rezolvate
                                </span>
                              </div>
                              <span className="font-extrabold text-slate-900 text-[15px]">
                                450
                              </span>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 bg-purple-50 rounded-lg flex items-center justify-center">
                                  <BarChart3 className="w-4 h-4 text-purple-600" />
                                </div>
                                <span className="text-[13px] font-bold text-slate-700">
                                  Media simulărilor
                                </span>
                              </div>
                              <span className="font-extrabold text-purple-600 text-[15px]">
                                85%
                              </span>
                            </div>
                          </div>
                        )}
                        <div className="px-5 py-4 border-t border-slate-100 bg-slate-50/50">
                          <button
                            onClick={() => setIsDeleteConfirmOpen(true)}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                            Șterge Contul
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="px-5 py-6 text-center">
                        <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                          <AlertTriangle
                            className="w-7 h-7"
                            strokeWidth={2.5}
                          />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">
                          Ești sigur?
                        </h3>
                        <p className="text-[13px] leading-relaxed text-slate-500 mb-6 px-2 font-medium">
                          Acțiunea este ireversibilă. Toate datele tale și
                          istoricul simulărilor vor fi șterse permanent!
                        </p>
                        <div className="flex gap-3">
                          <button
                            onClick={() => setIsDeleteConfirmOpen(false)}
                            className="flex-1 px-4 py-2.5 text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                          >
                            Anulează
                          </button>
                          <button
                            onClick={() => {
                              alert("Cerere de ștergere trimisă!");
                              setIsUserMenuOpen(false);
                              setIsDeleteConfirmOpen(false);
                            }}
                            className="flex-1 px-4 py-2.5 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors shadow-sm"
                          >
                            Confirmă
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-2 border border-transparent text-sm font-semibold rounded-full text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors shadow-sm cursor-pointer"
              >
                Autentificare
              </Link>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Deschide meniul principal</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>
      <div className={cn("sm:hidden", isOpen ? "block" : "hidden")}>
        <div className="pt-2 pb-3 space-y-1">
          <Link
            href="/login"
            className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-blue-600 hover:bg-gray-50 hover:border-gray-300"
            onClick={() => setIsOpen(false)}
          >
            <div className="flex items-center gap-2">
              <LogIn className="h-5 w-5" />
              Autentificare
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
}
