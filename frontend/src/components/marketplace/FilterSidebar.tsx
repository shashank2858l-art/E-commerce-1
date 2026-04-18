'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface FilterState {
  category: string;
  distance: number;
  priceRange: [number, number];
  rating: number;
  availability: boolean;
  sortBy: string;
}

interface FilterSidebarProps {
  filters: FilterState;
  setFilters: (val: FilterState | ((prev: FilterState) => FilterState)) => void;
  isOpen: boolean;
  onClose: () => void;
}

// These values match EXACTLY what's stored in the database category column
const CATEGORIES = [
  { value: 'all', label: 'All Categories' },
  { value: 'Apparel & Fashion', label: 'Apparel & Fashion' },
  { value: 'Electronics', label: 'Electronics' },
  { value: 'Furniture', label: 'Furniture' },
  { value: 'Tools & Hardware', label: 'Tools & Hardware' },
  { value: 'Rescued Food', label: 'Rescued Food' },
  { value: 'Raw Materials (Upcycle)', label: 'Raw Materials' },
  { value: 'Textile Waste', label: 'Textile Waste' },
  { value: 'Electronic Waste', label: 'E-Waste' },
  { value: 'food', label: 'Food Rescue' },
  { value: 'materials', label: 'Upcycle Materials' },
];

export default function FilterSidebar({ filters, setFilters, isOpen, onClose }: FilterSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const updateFilter = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      category: 'all',
      distance: 50,
      priceRange: [0, 500],
      rating: 0,
      availability: false,
      sortBy: 'newest'
    });
  };

  const SidebarContent = () => (
    <div className="flex flex-col space-y-5 w-full p-5 sm:p-4">

      {/* Category */}
      <div>
        <h4 className="font-heading font-semibold text-[11px] tracking-widest uppercase mb-3 text-neon-green">Category</h4>
        <div className="flex flex-col gap-1.5">
          {CATEGORIES.map(cat => (
            <button
              key={cat.value}
              onClick={() => updateFilter('category', cat.value)}
              className={`text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                filters.category === cat.value
                  ? 'bg-neon-green/15 text-neon-green border border-neon-green/30'
                  : 'text-muted hover:bg-white/5 hover:text-white border border-transparent'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Distance */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-heading font-semibold text-[11px] tracking-widest uppercase text-neon-green">Distance</h4>
          <span className="text-xs text-muted font-bold">{filters.distance} miles</span>
        </div>
        <input
          type="range"
          min="1" max="50"
          value={filters.distance}
          onChange={(e) => updateFilter('distance', parseInt(e.target.value))}
          className="w-full accent-neon-green cursor-pointer"
        />
      </div>

      {/* Price Range */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-heading font-semibold text-[11px] tracking-widest uppercase text-neon-green">Max Price</h4>
          <span className="text-xs text-muted font-bold">₹{filters.priceRange[1]}</span>
        </div>
        <input
          type="range"
          min="0" max="5000" step="50"
          value={filters.priceRange[1]}
          onChange={(e) => updateFilter('priceRange', [0, parseInt(e.target.value)])}
          className="w-full accent-neon-green cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-muted-dim mt-1 font-bold">
          <span>Free</span>
          <span>₹{filters.priceRange[1]}</span>
        </div>
      </div>

      {/* Availability */}
      <button
        onClick={() => updateFilter('availability', !filters.availability)}
        className="flex items-center gap-3 cursor-pointer group w-full text-left"
      >
        <div className={`w-10 h-5 rounded-full relative transition-colors duration-300 flex-shrink-0 ${filters.availability ? 'bg-neon-green' : 'bg-surface-high border border-white/10'}`}>
          <div
            className={`w-4 h-4 bg-black rounded-full absolute top-0.5 transition-all duration-300`}
            style={{ left: filters.availability ? '22px' : '2px' }}
          />
        </div>
        <span className="font-heading font-semibold text-xs text-white group-hover:text-neon-green transition-colors">Show Available Only</span>
      </button>

      {/* Sort By */}
      <div>
        <h4 className="font-heading font-semibold text-[11px] tracking-widest uppercase mb-3 text-neon-green">Sort By</h4>
        <div className="flex flex-col gap-1.5">
          {[
            { id: 'nearest', label: '📍 Nearest' },
            { id: 'cheapest', label: '💰 Cheapest' },
            { id: 'highest-rated', label: '⭐ Highest Rated' },
            { id: 'newest', label: '✨ Newest' },
          ].map(opt => (
            <button
              key={opt.id}
              onClick={() => updateFilter('sortBy', opt.id)}
              className={`text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                filters.sortBy === opt.id
                  ? 'bg-neon-green/15 text-neon-green border border-neon-green/30'
                  : 'text-muted hover:bg-white/5 hover:text-white border border-transparent'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Reset button */}
      <button
        onClick={resetFilters}
        className="mt-2 w-full px-4 py-2.5 text-[10px] font-heading font-bold tracking-widest uppercase text-muted-dim border border-white/10 rounded-xl hover:bg-white/5 hover:text-white transition-all"
      >
        ↻ Reset All Filters
      </button>
    </div>
  );

  return (
    <>
      {/* Desktop View */}
      <div className={`hidden lg:block sticky top-28 h-max glass border border-white/5 rounded-2xl overflow-hidden self-start transition-all duration-300 ${isCollapsed ? 'w-12' : 'w-64'}`}>
        {/* Collapse/Expand Header */}
        <div className="p-3 border-b border-white/5 flex items-center justify-between">
          {!isCollapsed && <h3 className="font-heading text-sm font-bold tracking-widest uppercase pl-2">Filters</h3>}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 text-muted hover:text-neon-green hover:bg-white/5 rounded-lg transition-all ml-auto"
            title={isCollapsed ? 'Expand Filters' : 'Collapse Filters'}
          >
            {isCollapsed ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
            )}
          </button>
        </div>

        {!isCollapsed && <SidebarContent />}

        {/* Collapsed Icons */}
        {isCollapsed && (
          <div className="flex flex-col items-center gap-3 py-4">
            <button onClick={() => setIsCollapsed(false)} title="Category" className="text-muted hover:text-neon-green transition-colors">🏷️</button>
            <button onClick={() => setIsCollapsed(false)} title="Distance" className="text-muted hover:text-neon-green transition-colors">📍</button>
            <button onClick={() => setIsCollapsed(false)} title="Price" className="text-muted hover:text-neon-green transition-colors">💰</button>
            <button onClick={() => setIsCollapsed(false)} title="Sort" className="text-muted hover:text-neon-green transition-colors">🔃</button>
          </div>
        )}
      </div>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[85vw] max-w-sm bg-surface-low border-r border-white/10 z-[60] lg:hidden overflow-y-auto shadow-2xl"
            >
              <div className="sticky top-0 bg-surface-low/95 backdrop-blur-md p-5 border-b border-white/5 flex items-center justify-between z-10">
                <h3 className="font-heading text-lg font-bold">Filters</h3>
                <button onClick={onClose} className="p-2 text-muted hover:text-white bg-white/5 rounded-full">
                  ✕
                </button>
              </div>
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
