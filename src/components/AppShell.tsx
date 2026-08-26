"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { AuthGuard } from "@/components/AuthGuard";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
import { Menu, X, Building2 } from "lucide-react";
import {
  subscribeToContacts,
  subscribeToGroups,
  subscribeToStages,
  subscribeToInteractions,
  initializeBusinessInFirestore,
  syncBatchContacts,
  syncStages
} from "@/lib/firestore-sync";
import { 
  saveContacts, 
  saveContactGroups, 
  savePipelineStages, 
  saveAllInteractions,
  DEFAULT_PIPELINE_STAGES,
  getStoredContacts
} from "@/lib/contacts-store";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, business } = useAuth();

  const businessName = business?.name || user?.businessName || "My Business";
  const businessId = user?.uid;

  // Real-time Cloud Firestore synchronization
  useEffect(() => {
    if (!businessId || businessId === "biz_demo_1") return;

    // Seed initial business and default stages in Firestore if needed
    if (business) {
      initializeBusinessInFirestore(businessId, business, DEFAULT_PIPELINE_STAGES);
    }

    // Subscribe to real-time updates from Firestore
    const unsubContacts = subscribeToContacts(businessId, (contacts) => {
      if (contacts && contacts.length > 0) {
        saveContacts(contacts);
      } else {
        // If Firestore is empty but user had locally imported contacts, sync them up
        const local = getStoredContacts();
        if (local && local.length > 0) {
          syncBatchContacts(businessId, local);
        }
      }
    });

    const unsubGroups = subscribeToGroups(businessId, (groups) => {
      if (groups) {
        saveContactGroups(groups);
      }
    });

    const unsubStages = subscribeToStages(businessId, (stages) => {
      if (stages && stages.length > 0) {
        savePipelineStages(stages);
      } else {
        syncStages(businessId, DEFAULT_PIPELINE_STAGES);
      }
    });

    const unsubInteractions = subscribeToInteractions(businessId, (interactions) => {
      if (interactions) {
        saveAllInteractions(interactions);
      }
    });

    return () => {
      unsubContacts();
      unsubGroups();
      unsubStages();
      unsubInteractions();
    };
  }, [businessId, business]);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#F8FAF8] flex">
        
        {/* Desktop Fixed Left Sidebar */}
        <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 md:z-30">
          <Sidebar />
        </div>

        {/* Mobile Slide-Over Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden animate-in fade-in duration-200">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" 
              onClick={() => setMobileMenuOpen(false)}
            />
            {/* Drawer */}
            <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-white border-r-2 border-slate-300 z-50 flex flex-col animate-in slide-in-from-left duration-200">
              <div className="absolute right-3 top-4">
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-slate-500 hover:text-black hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <Sidebar onNavigate={() => setMobileMenuOpen(false)} />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 md:pl-64 flex flex-col min-w-0">
          
          {/* Mobile Top Bar */}
          <header className="sticky top-0 z-20 md:hidden flex items-center justify-between px-4 py-3 bg-white/95 backdrop-blur border-b border-slate-200">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="p-1.5 text-slate-700 hover:bg-slate-100 transition-colors -ml-1.5"
                aria-label="Open navigation menu"
              >
                <Menu className="w-5 h-5" />
              </button>
              <Link href="/dashboard" className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center bg-[#0A1D13] font-black text-[#BEF264] text-xs border border-[#0A1D13]">
                  S
                </div>
                <span className="font-black text-slate-900 text-sm truncate max-w-[140px]">
                  {businessName}
                </span>
              </Link>
            </div>

            <Link
              href="/settings"
              className="flex h-8 w-8 items-center justify-center bg-[#0A1D13] text-[#BEF264] font-black text-xs border border-[#0A1D13]"
            >
              {businessName.charAt(0).toUpperCase()}
            </Link>
          </header>

          {/* Main Body */}
          <main className="flex-1 px-4 py-6 sm:px-8 max-w-7xl w-full mx-auto">
            {children}
          </main>

        </div>

      </div>
    </AuthGuard>
  );
}
