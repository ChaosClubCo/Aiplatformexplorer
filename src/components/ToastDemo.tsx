/**
 * Toast Demo Component
 * 
 * @description Example component showing how to use the toast system
 * @module components/ToastDemo
 */

import React from 'react';
import { useToast } from '../contexts/ToastContext';

/**
 * Demo component for testing toast notifications
 */
export function ToastDemo() {
  const { showToast } = useToast();

  return (
    <div className="fixed bottom-24 right-4 bg-white rounded-lg shadow-lg p-4 space-y-2 z-50">
      <h3 className="text-sm font-semibold mb-2">Toast Demo</h3>
      <button
        onClick={() => showToast('This is an info message', 'info')}
        className="block w-full px-3 py-2 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
      >
        Show Info
      </button>
      <button
        onClick={() => showToast('Success! Operation completed', 'success')}
        className="block w-full px-3 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700"
      >
        Show Success
      </button>
      <button
        onClick={() => showToast('Warning: Please review', 'warning')}
        className="block w-full px-3 py-2 text-sm bg-orange-600 text-white rounded hover:bg-orange-700"
      >
        Show Warning
      </button>
      <button
        onClick={() => showToast('Error: Something went wrong', 'error')}
        className="block w-full px-3 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700"
      >
        Show Error
      </button>
    </div>
  );
}