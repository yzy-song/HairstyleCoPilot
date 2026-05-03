'use client';

import { useAuth } from '@/lib/auth/auth-context';
import { Avatar } from '@repo/ui/avatar';
import { LogOut, Mail, Shield, ChevronRight, HelpCircle, Settings } from 'lucide-react';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const displayName = user?.role === 'salon' ? 'Salon Owner' : user?.email || 'Stylist';

  return (
    <div>
      <h2 className="text-xl font-bold text-warm-900 mb-6">Profile</h2>

      {/* Avatar card */}
      <div className="bg-white rounded-2xl border border-warm-200/60 p-6 mb-5 flex flex-col items-center shadow-card">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-100 to-accent-100 ring-4 ring-warm-50 flex items-center justify-center mb-3 overflow-hidden">
          <Avatar name={displayName} size="lg" />
        </div>
        <p className="text-base font-semibold text-warm-800">{displayName}</p>
        <p className="text-sm text-warm-400">{user?.email}</p>
        <div className="mt-2 px-3 py-1 bg-warm-50 rounded-full text-xs font-medium text-warm-500 capitalize">
          {user?.role}
        </div>
      </div>

      {/* Account info */}
      <div className="bg-white rounded-2xl border border-warm-200/60 overflow-hidden shadow-card mb-5">
        <div className="px-4 py-3 border-b border-warm-100">
          <p className="text-xs font-semibold text-warm-400 uppercase tracking-wider">
            Account Information
          </p>
        </div>
        <div className="divide-y divide-warm-100">
          <div className="px-4 py-3.5 flex items-center gap-3">
            <Mail className="h-4 w-4 text-warm-300" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-warm-400">Email</p>
              <p className="text-sm font-medium text-warm-700 truncate">{user?.email}</p>
            </div>
          </div>
          <div className="px-4 py-3.5 flex items-center gap-3">
            <Shield className="h-4 w-4 text-warm-300" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-warm-400">Role</p>
              <p className="text-sm font-medium text-warm-700 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Menu items */}
      <div className="bg-white rounded-2xl border border-warm-200/60 overflow-hidden shadow-card mb-5">
        <button className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-warm-50 transition-colors border-b border-warm-100">
          <Settings className="h-4 w-4 text-warm-300" />
          <span className="text-sm font-medium text-warm-700 flex-1">Settings</span>
          <ChevronRight className="h-4 w-4 text-warm-300" />
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-warm-50 transition-colors">
          <HelpCircle className="h-4 w-4 text-warm-300" />
          <span className="text-sm font-medium text-warm-700 flex-1">Help & Support</span>
          <ChevronRight className="h-4 w-4 text-warm-300" />
        </button>
      </div>

      {/* Logout */}
      <button
        onClick={logout}
        className="flex items-center justify-center gap-2 w-full py-4 text-sm font-medium text-red-400 hover:text-red-600 transition-colors"
      >
        <LogOut className="h-4 w-4" />
        Sign out
      </button>
    </div>
  );
}
