import { ToastMessage } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { useToast } from '../contexts/ToastContext';

export default function ToastContainer() {
  const { toasts } = useToast();
  
  const typeClasses: Record<ToastMessage['type'], string> = {
    info: 'bg-[#262626] text-white',
    success: 'bg-[#059669] text-white',
    error: 'bg-[#DC2626] text-white',
    warning: 'bg-[#D97706] text-white'
  };

  const typeIcons: Record<ToastMessage['type'], string> = {
    info: 'ℹ️',
    success: '✅',
    error: '❌',
    warning: '⚠️'
  };

  return (
    <div 
      className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-[800] flex flex-col gap-3 w-[calc(100%-2rem)] sm:w-auto max-w-md"
      aria-live="polite"
      aria-atomic="true"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={`flex items-center gap-3 px-4 sm:px-5 py-3 rounded-xl shadow-xl text-sm ${
              typeClasses[toast.type]
            }`}
            role="status"
          >
            <span className="text-lg flex-shrink-0" aria-hidden="true">
              {typeIcons[toast.type]}
            </span>
            <span className="flex-1">{toast.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}