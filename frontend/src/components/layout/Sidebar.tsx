'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Library, PlayCircle, Settings, Calculator } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Start Simulation', href: '/simulate', icon: PlayCircle },
  { name: 'Quiz Library', href: '/library', icon: Library },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 bg-zinc-950 text-zinc-100 flex flex-col h-screen sticky top-0 border-r border-zinc-800 shadow-xl transition-all duration-300">
      <div className="h-20 flex items-center px-8 border-b border-zinc-800/50 bg-zinc-900/50 backdrop-blur-sm">
        <Calculator className="w-8 h-8 text-blue-500 mr-3" />
        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400 tracking-tight">
          ToolGrile
        </span>
      </div>

      <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
        <div className="px-4 mb-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
          Menu
        </div>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-4 py-3.5 rounded-xl transition-all duration-200 group relative overflow-hidden ${
                isActive
                  ? 'bg-blue-600/10 text-blue-400 font-medium'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50'
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r-md shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
              )}
              <item.icon
                className={`w-5 h-5 mr-4 transition-transform duration-200 ${
                  isActive ? 'scale-110' : 'group-hover:scale-110'
                }`}
              />
              <span className="text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-zinc-800/50 bg-zinc-900/30">
        <div className="flex items-center px-4 py-3 w-full rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
            RM
          </div>
          <div className="ml-3 flex flex-col">
            <span className="text-sm font-medium text-white">Student UTCN</span>
            <span className="text-xs text-zinc-500">Premium Plan</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
