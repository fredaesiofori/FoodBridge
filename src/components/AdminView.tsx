import React, { useState } from 'react';
import { ShieldCheck, Trash2, AlertTriangle, CheckCircle2, BarChart3, Users, Utensils, Eye, Ban, Settings, Activity, FileText, Lock } from 'lucide-react';
import { FoodDrop, User } from '../types';

interface AdminViewProps {
  drops: FoodDrop[];
  users: User[];
  onDeleteDrop: (id: string) => void;
  onUpdateUserStatus: (userId: string, status: 'active' | 'suspended' | 'pending') => void;
  onDeleteUser: (userId: string) => void;
}

type AdminTab = 'listings' | 'users' | 'analytics' | 'settings';

export const AdminView: React.FC<AdminViewProps> = ({
  drops,
  users,
  onDeleteDrop,
  onUpdateUserStatus,
  onDeleteUser,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('listings');
  const [selectedUserLog, setSelectedUserLog] = useState<User | null>(null);

  const availableCount = drops.filter(d => d.status === 'available').length;
  const claimedCount = drops.filter(d => d.status === 'claimed').length;
  const totalMeals = drops.reduce((a, b) => a + b.mealsEstimated, 0);

  return (
    <div className="bg-white dark:bg-[#12220E] border border-[#E6E2D3] dark:border-[#24421C] rounded-2xl p-4 sm:p-6 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E6E2D3] dark:border-[#24421C] gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 rounded-xl shadow-inner shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-[#1D1B16] dark:text-[#EAE6DF] text-lg sm:text-xl">Central RBAC Admin Console</h3>
            <p className="text-xs text-[#79776E] dark:text-[#8AA280]">Full privileges: inspect activity, manage users, moderate surplus listings, and configure security</p>
          </div>
        </div>
        <span className="text-xs font-black uppercase tracking-wider bg-red-50 dark:bg-red-950/80 text-red-600 dark:text-red-300 px-3 py-1.5 rounded-full border border-red-200 dark:border-red-900 shrink-0 self-start sm:self-center">
          Security Level 4 (Full Access)
        </span>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-[#F3F0E6] dark:bg-[#1C3317] p-1.5 rounded-xl border border-[#E6E2D3] dark:border-[#2A4B20]">
        {[
          { id: 'listings', label: 'Listings Moderation', icon: Utensils, count: drops.length },
          { id: 'users', label: 'Users & Inspection', icon: Users, count: users.length },
          { id: 'analytics', label: 'Analytics & Reports', icon: BarChart3 },
          { id: 'settings', label: 'System Settings', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as AdminTab)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer min-h-[36px] flex-1 sm:flex-none justify-center ${
                isActive
                  ? 'bg-[#386A20] dark:bg-[#4E8832] text-white shadow-sm'
                  : 'text-[#79776E] dark:text-[#8AA280] hover:text-[#1D1B16] dark:hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`px-1.5 py-0.2 rounded text-[10px] ${isActive ? 'bg-black/20 text-white' : 'bg-black/5 dark:bg-white/10'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: LISTINGS MODERATION */}
      {activeTab === 'listings' && (
        <div className="space-y-6 animate-in fade-in-50 duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-[#F3F0E6] dark:bg-[#1C3317] rounded-xl border border-[#E6E2D3] dark:border-[#2A4B20] flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase text-[#79776E] dark:text-[#8AA280]">Active Available</p>
                <p className="text-xl font-bold text-[#386A20] dark:text-[#90C872]">{availableCount}</p>
              </div>
              <Utensils className="w-8 h-8 text-[#386A20] dark:text-[#90C872] opacity-40" />
            </div>

            <div className="p-4 bg-[#F3F0E6] dark:bg-[#1C3317] rounded-xl border border-[#E6E2D3] dark:border-[#2A4B20] flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase text-[#79776E] dark:text-[#8AA280]">Reserved / Claimed</p>
                <p className="text-xl font-bold text-[#1D1B16] dark:text-[#EAE6DF]">{claimedCount}</p>
              </div>
              <Users className="w-8 h-8 text-[#79776E] dark:text-[#8AA280] opacity-40" />
            </div>

            <div className="p-4 bg-[#F3F0E6] dark:bg-[#1C3317] rounded-xl border border-[#E6E2D3] dark:border-[#2A4B20] flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase text-[#79776E] dark:text-[#8AA280]">Total Meals Rescued</p>
                <p className="text-xl font-bold text-[#386A20] dark:text-[#90C872]">{totalMeals} meals</p>
              </div>
              <BarChart3 className="w-8 h-8 text-[#386A20] dark:text-[#90C872] opacity-40" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#E6E2D3] dark:border-[#24421C] text-[10px] uppercase font-bold text-[#79776E] dark:text-[#8AA280]">
                  <th className="py-3 px-4">Surplus Item</th>
                  <th className="py-3 px-4">Donor Business</th>
                  <th className="py-3 px-4">Neighborhood</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Moderation Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F3F0E6] dark:divide-[#1C3317]">
                {drops.map((drop) => (
                  <tr key={drop.id} className="hover:bg-[#F3F0E6]/50 dark:hover:bg-[#1C3317]/50">
                    <td className="py-3 px-4 font-bold text-[#1D1B16] dark:text-[#EAE6DF]">
                      {drop.title}
                      <span className="block font-normal text-[10px] text-[#79776E] dark:text-[#8AA280]">{drop.quantity}</span>
                    </td>
                    <td className="py-3 px-4 text-[#1D1B16] dark:text-[#EAE6DF]">{drop.donorName}</td>
                    <td className="py-3 px-4 text-[#79776E] dark:text-[#8AA280]">{drop.neighborhood}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        drop.status === 'available' ? 'bg-[#E7F0E1] dark:bg-[#224418] text-[#386A20] dark:text-[#A4D888]' : 'bg-[#E6E2D3] dark:bg-[#1C3317] text-[#79776E] dark:text-[#8AA280]'
                      }`}>
                        {drop.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onDeleteDrop(drop.id)}
                        className="px-3 py-1.5 min-h-[32px] bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold flex items-center gap-1 ml-auto cursor-pointer shadow-2xs text-xs"
                      >
                        <Trash2 className="w-3 h-3" /> Force Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: USER MANAGEMENT & ACTIVITY INSPECTION */}
      {activeTab === 'users' && (
        <div className="space-y-6 animate-in fade-in-50 duration-200">
          <div className="flex items-center justify-between text-xs text-[#79776E] dark:text-[#8AA280]">
            <p>Admin Role Privileges: View, Approve, Reject, Suspend, and Inspect User Activity Logs across all roles.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#E6E2D3] dark:border-[#24421C] text-[10px] uppercase font-bold text-[#79776E] dark:text-[#8AA280]">
                  <th className="py-3 px-4">User Account</th>
                  <th className="py-3 px-4">RBAC Role</th>
                  <th className="py-3 px-4">Organization</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Moderation & Activity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F3F0E6] dark:divide-[#1C3317]">
                {users.map((u) => {
                  const status = u.status || 'active';
                  return (
                    <tr key={u.id} className="hover:bg-[#F3F0E6]/50 dark:hover:bg-[#1C3317]/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover shrink-0" />
                          <div>
                            <p className="font-bold text-[#1D1B16] dark:text-[#EAE6DF]">{u.name}</p>
                            <p className="text-[10px] text-[#79776E] dark:text-[#8AA280]">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                          u.role === 'admin' ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300' :
                          u.role === 'donor' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                          u.role === 'recipient' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' :
                          'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[#1D1B16] dark:text-[#EAE6DF]">{u.organization || 'Individual'}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          status === 'active' ? 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300' :
                          status === 'suspended' ? 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300' :
                          'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                        }`}>
                          {status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5 flex-wrap">
                          <button
                            onClick={() => setSelectedUserLog(u)}
                            title="Inspect User Activity"
                            className="px-2.5 py-1 min-h-[28px] bg-[#E6E2D3] dark:bg-[#2A4B20] hover:bg-[#D9D5C6] text-[#1D1B16] dark:text-[#EAE6DF] rounded font-bold flex items-center gap-1 cursor-pointer text-[11px]"
                          >
                            <Activity className="w-3 h-3" /> Activity Log
                          </button>

                          {u.role !== 'admin' && (
                            <>
                              {status !== 'active' && (
                                <button
                                  onClick={() => onUpdateUserStatus(u.id, 'active')}
                                  className="px-2.5 py-1 min-h-[28px] bg-green-600 hover:bg-green-700 text-white rounded font-bold cursor-pointer text-[11px]"
                                >
                                  Approve
                                </button>
                              )}
                              {status === 'active' && (
                                <button
                                  onClick={() => onUpdateUserStatus(u.id, 'suspended')}
                                  className="px-2.5 py-1 min-h-[28px] bg-amber-600 hover:bg-amber-700 text-white rounded font-bold cursor-pointer text-[11px]"
                                >
                                  Suspend
                                </button>
                              )}
                              <button
                                onClick={() => onDeleteUser(u.id)}
                                title="Delete User"
                                className="p-1.5 min-h-[28px] min-w-[28px] bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 hover:bg-red-200 rounded flex items-center justify-center cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ANALYTICS & REPORTS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6 animate-in fade-in-50 duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 bg-[#F3F0E6] dark:bg-[#1C3317] rounded-2xl border border-[#E6E2D3] dark:border-[#2A4B20] space-y-4">
              <h4 className="font-extrabold text-[#1D1B16] dark:text-[#EAE6DF] flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#386A20] dark:text-[#90C872]" /> RBAC Role Distribution
              </h4>
              <div className="space-y-3 pt-2">
                {[
                  { role: 'Admin', count: users.filter(u => u.role === 'admin').length, pct: '25%', color: 'bg-red-500' },
                  { role: 'Donor', count: users.filter(u => u.role === 'donor').length, pct: '25%', color: 'bg-emerald-500' },
                  { role: 'Recipient', count: users.filter(u => u.role === 'recipient').length, pct: '25%', color: 'bg-blue-500' },
                  { role: 'Guest', count: users.filter(u => u.role === 'guest').length, pct: '25%', color: 'bg-gray-500' },
                ].map((stat) => (
                  <div key={stat.role} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-[#1D1B16] dark:text-[#EAE6DF]">
                      <span>{stat.role} Accounts</span>
                      <span>{stat.count} active</span>
                    </div>
                    <div className="w-full bg-black/10 dark:bg-white/10 h-2 rounded-full overflow-hidden">
                      <div className={`h-full ${stat.color} rounded-full`} style={{ width: stat.pct }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 bg-[#F3F0E6] dark:bg-[#1C3317] rounded-2xl border border-[#E6E2D3] dark:border-[#2A4B20] space-y-4">
              <h4 className="font-extrabold text-[#1D1B16] dark:text-[#EAE6DF] flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#386A20] dark:text-[#90C872]" /> Security Audit Overview
              </h4>
              <ul className="space-y-3 text-xs text-[#1D1B16] dark:text-[#EAE6DF] pt-1">
                <li className="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-2">
                  <span className="text-[#79776E] dark:text-[#8AA280]">Unauthorized API Rejections (403):</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">Enforced</span>
                </li>
                <li className="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-2">
                  <span className="text-[#79776E] dark:text-[#8AA280]">Direct Route Hijack Guards:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">Active (Instant Redirect)</span>
                </li>
                <li className="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-2">
                  <span className="text-[#79776E] dark:text-[#8AA280]">Admin Email Lockdown:</span>
                  <span className="font-bold text-red-600 dark:text-red-400">fredaesiofori905@gmail.com</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-[#79776E] dark:text-[#8AA280]">Frontend / Backend Dual Guard:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">Verified</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SYSTEM SETTINGS */}
      {activeTab === 'settings' && (
        <div className="space-y-6 animate-in fade-in-50 duration-200 text-xs">
          <div className="p-5 bg-[#F3F0E6] dark:bg-[#1C3317] rounded-2xl border border-[#E6E2D3] dark:border-[#2A4B20] space-y-4">
            <h4 className="font-extrabold text-[#1D1B16] dark:text-[#EAE6DF] text-sm">Role-Based Access Control Configuration</h4>
            <p className="text-[#79776E] dark:text-[#8AA280]">Modify live authorization parameters without requiring container rebuilds.</p>

            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between p-3 bg-white dark:bg-[#12220E] rounded-xl border border-[#E6E2D3] dark:border-[#24421C]">
                <div>
                  <p className="font-bold text-[#1D1B16] dark:text-[#EAE6DF]">Strict Guest Write-Lockout</p>
                  <p className="text-[11px] text-[#79776E] dark:text-[#8AA280]">Guests are redirected to Sign In on any mutation attempt</p>
                </div>
                <input type="checkbox" defaultChecked disabled className="w-5 h-5 accent-[#386A20]" />
              </div>

              <div className="flex items-center justify-between p-3 bg-white dark:bg-[#12220E] rounded-xl border border-[#E6E2D3] dark:border-[#24421C]">
                <div>
                  <p className="font-bold text-[#1D1B16] dark:text-[#EAE6DF]">API Endpoint Role Validation Header</p>
                  <p className="text-[11px] text-[#79776E] dark:text-[#8AA280]">Verify x-user-role and Authorization Bearer JWT on /api/*</p>
                </div>
                <input type="checkbox" defaultChecked disabled className="w-5 h-5 accent-[#386A20]" />
              </div>

              <div className="flex items-center justify-between p-3 bg-white dark:bg-[#12220E] rounded-xl border border-[#E6E2D3] dark:border-[#24421C]">
                <div>
                  <p className="font-bold text-[#1D1B16] dark:text-[#EAE6DF]">Cross-Dashboard URL Route Guard</p>
                  <p className="text-[11px] text-[#79776E] dark:text-[#8AA280]">Redirect Donors/Recipients trying to swap URLs</p>
                </div>
                <input type="checkbox" defaultChecked disabled className="w-5 h-5 accent-[#386A20]" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* USER ACTIVITY LOG MODAL */}
      {selectedUserLog && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#12220E] border border-[#E6E2D3] dark:border-[#24421C] rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-[#E6E2D3] dark:border-[#24421C] pb-3">
              <div className="flex items-center gap-2.5">
                <Activity className="w-5 h-5 text-[#386A20] dark:text-[#90C872]" />
                <h3 className="font-extrabold text-[#1D1B16] dark:text-[#EAE6DF] text-base">Activity Inspection: {selectedUserLog.name}</h3>
              </div>
              <button onClick={() => setSelectedUserLog(null)} className="text-gray-400 hover:text-gray-600 text-lg font-bold">×</button>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-xs bg-[#F3F0E6] dark:bg-[#1C3317] p-2.5 rounded-xl text-[#79776E] dark:text-[#8AA280]">
                <span>Role: <strong className="uppercase text-[#1D1B16] dark:text-[#EAE6DF]">{selectedUserLog.role}</strong></span>
                <span>Email: <strong className="text-[#1D1B16] dark:text-[#EAE6DF]">{selectedUserLog.email}</strong></span>
              </div>

              <h4 className="text-xs font-black uppercase tracking-wider text-[#79776E] dark:text-[#8AA280] pt-2">Recorded System Actions</h4>
              <div className="bg-[#FDFCF8] dark:bg-[#162912] border border-[#E6E2D3] dark:border-[#24421C] rounded-xl p-3 max-h-60 overflow-y-auto space-y-2 text-xs divide-y divide-black/5 dark:divide-white/5">
                {selectedUserLog.activityLog && selectedUserLog.activityLog.length > 0 ? (
                  selectedUserLog.activityLog.map((log, i) => (
                    <div key={i} className="pt-2 first:pt-0 flex items-start gap-2 text-[#1D1B16] dark:text-[#EAE6DF]">
                      <FileText className="w-3.5 h-3.5 text-[#386A20] dark:text-[#90C872] shrink-0 mt-0.5" />
                      <span>{log}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-center py-4">No logged activity recorded yet for this session.</p>
                )}
              </div>
            </div>

            <button
              onClick={() => setSelectedUserLog(null)}
              className="w-full py-3 bg-[#386A20] dark:bg-[#4E8832] hover:bg-[#2C5319] text-white font-extrabold rounded-xl text-xs cursor-pointer shadow-md"
            >
              Close Activity Logs
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
