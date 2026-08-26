"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { getContactGroups } from "@/lib/contacts-store";
import { 
  LayoutDashboard, 
  Folder, 
  Settings, 
  LogOut, 
  Users, 
  Building2,
  ChevronRight,
  Sparkles
} from "lucide-react";

interface SidebarProps {
  onNavigate?: () => void;
}

export function Sidebar({ onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, business, signOut } = useAuth();
  const [groupCount, setGroupCount] = useState<number>(0);

  useEffect(() => {
    try {
      const groups = getContactGroups();
      setGroupCount(groups.length);
    } catch (e) {
      // safe fallback
    }
  }, [pathname]);

  const handleSignOut = async () => {
    if (onNavigate) onNavigate();
    await signOut();
    router.push("/");
  };

  const navItems = [
    {
      label: "Contacts & Pipeline",
      href: "/dashboard",
      icon: LayoutDashboard,
      isActive: pathname === "/dashboard" || pathname.startsWith("/contacts")
    },
    {
      label: "Contact Groups",
      href: "/groups",
      icon: Folder,
      badge: groupCount > 0 ? groupCount : undefined,
      isActive: pathname === "/groups"
    },
    {
      label: "Business Settings",
      href: "/settings",
      icon: Settings,
      isActive: pathname === "/settings"
    }
  ];

  const businessName = business?.name || user?.businessName || "My Business";
  const businessInitial = businessName.charAt(0).toUpperCase();

  return (
    <aside className="flex flex-col h-full bg-white border-r border-slate-200 select-none">
      
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-[#F8FAF8]">
        <Link 
          href="/dashboard" 
          onClick={onNavigate}
          className="flex items-center gap-3 hover:opacity-95 transition-opacity"
        >
          <div className="flex h-9 w-9 items-center justify-center bg-[#0A1D13] text-[#BEF264] font-black text-base border border-[#0A1D13]">
            S
          </div>
          <div>
            <span className="text-sm font-black text-slate-900 tracking-tight leading-tight block">Simple CRM</span>
            <span className="text-[10px] font-mono uppercase text-[#0A1D13] font-bold block">Lead &amp; Sales Tracker</span>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-mono uppercase font-bold text-slate-400 tracking-widest">
          Workspace
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`flex items-center justify-between px-3.5 py-3 text-xs font-bold transition-all group border ${
                item.isActive
                  ? "bg-[#0A1D13] text-[#BEF264] border-[#0A1D13] border-l-4 border-l-[#BEF264]"
                  : "bg-transparent text-slate-700 border-transparent hover:bg-[#F4F9F4] hover:text-[#0A1D13] hover:border-slate-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    item.isActive ? "text-[#BEF264]" : "text-slate-500 group-hover:text-[#0A1D13]"
                  }`}
                />
                <span className="tracking-tight">{item.label}</span>
              </div>

              {item.badge !== undefined && (
                <span
                  className={`px-2 py-0.5 font-mono text-[10px] font-bold border ${
                    item.isActive
                      ? "bg-[#BEF264] text-[#0A1D13] border-[#BEF264]"
                      : "bg-slate-100 text-slate-700 border-slate-200 group-hover:bg-[#E2EFE4] group-hover:border-[#C5DDC9]"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* User / Business Profile Footer */}
      <div className="p-3 border-t border-slate-200 bg-[#F8FAF8] space-y-2">
        <Link
          href="/settings"
          onClick={onNavigate}
          className="flex items-center gap-3 p-2.5 bg-white hover:bg-[#F4F9F4] transition-colors group border border-slate-200 hover:border-slate-300"
        >
          <div className="flex h-9 w-9 items-center justify-center bg-[#0A1D13] text-[#BEF264] font-black text-sm shrink-0 border border-[#0A1D13]">
            {businessInitial}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-extrabold text-slate-900 truncate group-hover:text-[#0A1D13] transition-colors">
              {businessName}
            </p>
            <p className="text-[11px] font-mono text-slate-500 truncate">
              {user?.email || "owner@business.com"}
            </p>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-900 shrink-0" />
        </Link>

        <button
          onClick={handleSignOut}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-rose-700 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

    </aside>
  );
}
