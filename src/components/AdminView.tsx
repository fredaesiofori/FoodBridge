import React from 'react';
import { ShieldCheck, Trash2, AlertTriangle, CheckCircle2, BarChart3, Users, Utensils } from 'lucide-react';
import { FoodDrop } from '../types';

interface AdminViewProps {
  drops: FoodDrop[];
  onDeleteDrop: (id: string) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({ drops, onDeleteDrop }) => {
  return (
    <div className="bg-white border border-[#E6E2D3] rounded-2xl p-6 shadow-xs space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-[#E6E2D3]">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-red-100 text-red-600 rounded-lg">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-[#1D1B16] text-lg">Central Admin Moderation Console</h3>
            <p className="text-xs text-[#79776E]">Review active listings, enforce food safety standards, and track metrics</p>
          </div>
        </div>
        <span className="text-xs font-bold bg-[#E6E2D3] text-[#1D1B16] px-3 py-1 rounded-full">
          {drops.length} Total Drops Monitored
        </span>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-[#F3F0E6] rounded-xl border border-[#E6E2D3] flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase text-[#79776E]">Active Available</p>
            <p className="text-xl font-bold text-[#386A20]">{drops.filter(d => d.status === 'available').length}</p>
          </div>
          <Utensils className="w-8 h-8 text-[#386A20] opacity-40" />
        </div>

        <div className="p-4 bg-[#F3F0E6] rounded-xl border border-[#E6E2D3] flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase text-[#79776E]">Reserved / Claimed</p>
            <p className="text-xl font-bold text-[#1D1B16]">{drops.filter(d => d.status === 'claimed').length}</p>
          </div>
          <Users className="w-8 h-8 text-[#79776E] opacity-40" />
        </div>

        <div className="p-4 bg-[#F3F0E6] rounded-xl border border-[#E6E2D3] flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase text-[#79776E]">Total Meals Rescued</p>
            <p className="text-xl font-bold text-[#386A20]">{drops.reduce((a, b) => a + b.mealsEstimated, 0)} meals</p>
          </div>
          <BarChart3 className="w-8 h-8 text-[#386A20] opacity-40" />
        </div>
      </div>

      {/* Listings Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#E6E2D3] text-[10px] uppercase font-bold text-[#79776E]">
              <th className="py-3 px-4">Surplus Item</th>
              <th className="py-3 px-4">Donor Business</th>
              <th className="py-3 px-4">Neighborhood</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Moderation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F3F0E6]">
            {drops.map((drop) => (
              <tr key={drop.id} className="hover:bg-[#F3F0E6]/50">
                <td className="py-3 px-4 font-bold text-[#1D1B16]">
                  {drop.title}
                  <span className="block font-normal text-[10px] text-[#79776E]">{drop.quantity}</span>
                </td>
                <td className="py-3 px-4">{drop.donorName}</td>
                <td className="py-3 px-4">{drop.neighborhood}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    drop.status === 'available' ? 'bg-[#E7F0E1] text-[#386A20]' : 'bg-[#E6E2D3] text-[#79776E]'
                  }`}>
                    {drop.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => onDeleteDrop(drop.id)}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold flex items-center gap-1 ml-auto cursor-pointer shadow-2xs"
                  >
                    <Trash2 className="w-3 h-3" /> Remove Listing
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
