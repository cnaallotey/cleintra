"use client";

import React from "react";

/**
 * Dashboard / Contact List Skeleton Loader
 */
export function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Workspace Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="space-y-2">
          <div className="h-4 w-24 bg-slate-200"></div>
          <div className="h-8 w-60 bg-slate-200"></div>
          <div className="h-4 w-96 max-w-full bg-slate-100"></div>
        </div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="h-9 w-36 bg-slate-200"></div>
          <div className="h-9 w-24 bg-slate-200"></div>
          <div className="h-9 w-24 bg-slate-200"></div>
        </div>
      </div>

      {/* Group Pills Bar Skeleton */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        <div className="h-8 w-28 bg-slate-200 shrink-0"></div>
        <div className="h-8 w-32 bg-slate-100 shrink-0"></div>
        <div className="h-8 w-36 bg-slate-100 shrink-0"></div>
        <div className="h-8 w-24 bg-slate-100 shrink-0"></div>
      </div>

      {/* Stage Filters Bar Skeleton */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <div className="h-8 w-28 bg-slate-200 shrink-0"></div>
        <div className="h-8 w-28 bg-slate-100 shrink-0"></div>
        <div className="h-8 w-32 bg-slate-100 shrink-0"></div>
        <div className="h-8 w-28 bg-slate-100 shrink-0"></div>
        <div className="h-8 w-24 bg-slate-100 shrink-0"></div>
      </div>

      {/* Search & Actions Bar Skeleton */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 sm:p-4 border border-slate-300">
        <div className="h-10 w-full sm:max-w-md bg-slate-100"></div>
        <div className="h-10 w-full sm:w-48 bg-slate-200"></div>
      </div>

      {/* Contacts Table Skeleton */}
      <div className="border border-slate-300 bg-white overflow-hidden">
        {/* Table Header */}
        <div className="hidden md:grid md:grid-cols-12 md:gap-4 px-6 py-3.5 bg-[#0A1D13] border-b border-[#0A1D13]">
          <div className="col-span-4 h-4 w-32 bg-emerald-950"></div>
          <div className="col-span-3 h-4 w-24 bg-emerald-950"></div>
          <div className="col-span-2 h-4 w-24 bg-emerald-950"></div>
          <div className="col-span-3 h-4 w-28 bg-emerald-950 justify-self-end"></div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-slate-200">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 px-4 sm:px-6 py-4 items-center"
            >
              {/* Name & Source */}
              <div className="col-span-4 flex items-center gap-3">
                <div className="h-9 w-9 bg-slate-200 shrink-0"></div>
                <div className="space-y-1.5 flex-1">
                  <div className="h-4 w-36 bg-slate-200"></div>
                  <div className="h-3 w-20 bg-slate-100"></div>
                </div>
              </div>

              {/* Phone & Email */}
              <div className="col-span-3 space-y-1.5">
                <div className="h-3.5 w-28 bg-slate-200"></div>
                <div className="h-3 w-36 bg-slate-100"></div>
              </div>

              {/* Last Contacted */}
              <div className="col-span-2">
                <div className="h-3.5 w-24 bg-slate-100"></div>
              </div>

              {/* Status Badge Dropdown */}
              <div className="col-span-3 flex md:justify-end items-center gap-2">
                <div className="h-7 w-28 bg-slate-200"></div>
                <div className="h-4 w-8 bg-slate-100 hidden md:block"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Contact Record Detail View Skeleton Loader
 */
export function ContactDetailSkeleton() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-pulse">
      {/* Top Back Nav Skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-5 w-36 bg-slate-200"></div>
      </div>

      {/* Main Profile Card Skeleton */}
      <div className="bg-white p-6 sm:p-8 border border-slate-300 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-200">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 bg-slate-200 shrink-0"></div>
            <div className="space-y-2">
              <div className="h-7 w-48 bg-slate-200"></div>
              <div className="flex items-center gap-2">
                <div className="h-5 w-24 bg-slate-100"></div>
                <div className="h-5 w-28 bg-slate-100"></div>
              </div>
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="h-3 w-20 bg-slate-100"></div>
            <div className="h-9 w-36 bg-slate-200"></div>
          </div>
        </div>

        {/* Quick Actions Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="h-10 bg-slate-200"></div>
          <div className="h-10 bg-slate-200"></div>
          <div className="h-10 bg-slate-200"></div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex items-start gap-3.5 p-3.5 bg-[#F8FAF8] border border-slate-200"
            >
              <div className="h-10 w-10 bg-slate-200 shrink-0"></div>
              <div className="space-y-2 flex-1">
                <div className="h-3 w-20 bg-slate-200"></div>
                <div className="h-4 w-32 bg-slate-200"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Notes Skeleton */}
        <div className="pt-2 border-t border-slate-200 space-y-2">
          <div className="h-3 w-28 bg-slate-200"></div>
          <div className="h-16 bg-[#F8FAF8] border border-slate-200"></div>
        </div>
      </div>

      {/* Activity Timeline Card Skeleton */}
      <div className="bg-white p-6 sm:p-8 border border-slate-300 space-y-5">
        <div className="flex items-center justify-between">
          <div className="h-6 w-48 bg-slate-200"></div>
          <div className="h-8 w-28 bg-slate-200"></div>
        </div>

        <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#0A1D13]">
          {[1, 2, 3].map((i) => (
            <div key={i} className="relative space-y-2">
              <div className="absolute -left-6 top-2 h-4 w-4 bg-[#0A1D13] border-2 border-white"></div>
              <div className="p-4 border border-slate-300 bg-white space-y-2">
                <div className="flex justify-between items-center">
                  <div className="h-5 w-32 bg-slate-200"></div>
                  <div className="h-3.5 w-24 bg-slate-100"></div>
                </div>
                <div className="h-3.5 w-3/4 bg-slate-100"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Contact Groups Management Page Skeleton Loader
 */
export function GroupsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="space-y-2">
          <div className="h-8 w-52 bg-slate-200"></div>
          <div className="h-4 w-96 max-w-full bg-slate-100"></div>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="h-10 w-28 bg-slate-200"></div>
        </div>
      </div>

      {/* Top 3 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-5 bg-white border border-slate-300 flex items-center gap-4">
            <div className="h-12 w-12 bg-slate-200 shrink-0"></div>
            <div className="space-y-2 flex-1">
              <div className="h-3 w-24 bg-slate-100"></div>
              <div className="h-7 w-12 bg-slate-200"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Group Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-5 w-36 bg-slate-200"></div>
          <div className="h-4 w-24 bg-slate-100"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white border border-slate-300 p-5 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 flex-1">
                  <div className="h-10 w-10 bg-slate-200 shrink-0"></div>
                  <div className="space-y-1.5 flex-1">
                    <div className="h-5 w-36 bg-slate-200"></div>
                    <div className="h-3 w-24 bg-slate-100"></div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <div className="h-7 w-7 bg-slate-100"></div>
                  <div className="h-7 w-7 bg-slate-100"></div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                <div className="flex gap-2">
                  <div className="h-7 w-28 bg-slate-100"></div>
                  <div className="h-7 w-24 bg-slate-100"></div>
                </div>
                <div className="h-7 w-24 bg-slate-200"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Settings & Business Profile Skeleton Loader
 */
export function SettingsSkeleton() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-pulse">
      {/* Top Back Link */}
      <div className="h-5 w-36 bg-slate-200"></div>

      {/* Main Settings Card */}
      <div className="bg-white p-6 sm:p-8 border border-slate-300 space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-200">
          <div className="h-16 w-16 bg-slate-200 shrink-0"></div>
          <div className="space-y-2 flex-1">
            <div className="h-7 w-48 bg-slate-200"></div>
            <div className="h-4 w-72 bg-slate-100"></div>
          </div>
        </div>

        {/* 6 Grid Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-3.5 w-32 bg-slate-200"></div>
              <div className="h-10 bg-slate-100 border border-slate-200"></div>
            </div>
          ))}
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4 border-t border-slate-200">
          <div className="h-10 w-44 bg-slate-200"></div>
        </div>
      </div>

      {/* Account Info Summary Card */}
      <div className="bg-white p-6 sm:p-8 border border-slate-300 space-y-4">
        <div className="h-5 w-40 bg-slate-200 pb-2 border-b border-slate-200"></div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-3.5 bg-[#F8FAF8] border border-slate-200 space-y-2">
              <div className="h-3 w-20 bg-slate-200"></div>
              <div className="h-4 w-28 bg-slate-200"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Authentication / Login Skeleton Loader
 */
export function LoginSkeleton() {
  return (
    <div className="flex min-h-[75vh] items-center justify-center py-10 px-4">
      <div className="w-full max-w-md space-y-6 animate-pulse">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="h-12 w-12 bg-slate-200 mx-auto"></div>
          <div className="h-7 w-48 bg-slate-200 mx-auto"></div>
          <div className="h-4 w-64 bg-slate-100 mx-auto"></div>
        </div>

        {/* Tabs */}
        <div className="h-11 bg-slate-100 border border-slate-300"></div>

        {/* Form Container */}
        <div className="border-2 border-slate-300 bg-white p-6 sm:p-8 space-y-4">
          <div className="h-10 bg-slate-100 border border-slate-200"></div>
          <div className="h-4 w-24 bg-slate-200 mx-auto"></div>
          <div className="space-y-3 pt-2">
            <div className="h-10 bg-slate-100"></div>
            <div className="h-10 bg-slate-100"></div>
            <div className="h-11 bg-slate-200"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
