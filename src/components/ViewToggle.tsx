/**
 * View Toggle Component
 * 
 * @description Toggle between card and table views
 */

import React from 'react';

interface ViewToggleProps {
  currentView: 'cards' | 'table';
  onChange: (view: 'cards' | 'table') => void;
}

export default function ViewToggle({ currentView, onChange }: ViewToggleProps) {
  return (
    <div className="inline-flex rounded-lg border border-gray-200 bg-white">
      <button
        onClick={() => onChange('cards')}
        className={`px-4 py-2 text-sm font-medium rounded-l-lg transition-colors ${
          currentView === 'cards'
            ? 'bg-orange-500 text-white'
            : 'text-gray-700 hover:bg-gray-50'
        }`}
        aria-label="Card view"
        aria-pressed={currentView === 'cards'}
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
          />
        </svg>
      </button>
      <button
        onClick={() => onChange('table')}
        className={`px-4 py-2 text-sm font-medium rounded-r-lg transition-colors ${
          currentView === 'table'
            ? 'bg-orange-500 text-white'
            : 'text-gray-700 hover:bg-gray-50'
        }`}
        aria-label="Table view"
        aria-pressed={currentView === 'table'}
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
      </button>
    </div>
  );
}
