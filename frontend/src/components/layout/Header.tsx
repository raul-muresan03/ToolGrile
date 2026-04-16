import React from 'react';
import { Bell, Search } from 'lucide-react';

export function Header() {
  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-zinc-200 flex items-center justify-between px-10 sticky top-0 z-20 shadow-sm transition-all duration-300">
      <div className="flex items-center flex-1">
        <div className="relative w-96 group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-zinc-400 group-focus-within:text-blue-500 transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-4 py-3 border border-zinc-200 rounded-2xl leading-5 bg-zinc-50/50 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:bg-zinc-50 transition-all sm:text-sm shadow-inner"
            placeholder="Search for chapters, quizzes, or topics..."
          />
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <button className="relative p-2 text-zinc-400 hover:text-blue-600 transition-colors hover:bg-blue-50 rounded-full group">
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full animate-pulse"></span>
          <Bell className="w-6 h-6 group-hover:scale-110 transition-transform" />
        </button>

        <div className="h-8 w-px bg-zinc-200"></div>

        <div className="flex flex-col items-end mr-4">
          <span className="text-sm font-semibold text-zinc-800">Exam Prep 2026</span>
          <span className="text-xs text-green-600 font-medium">Synced today</span>
        </div>
      </div>
    </header>
  );
}
