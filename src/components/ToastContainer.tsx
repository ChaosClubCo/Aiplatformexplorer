import { ToastMessage } from '../types';

interface ToastContainerProps {
  toasts: ToastMessage[];
}

export default function ToastContainer({ toasts }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  const typeClasses: Record<ToastMessage['type'], string> = {
    info: 'bg-[#262626] text-white',
    success: 'bg-[#059669] text-white',
    error: 'bg-[#DC2626] text-white',
    warning: 'bg-[#D97706] text-white'
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[800] flex flex-col gap-3">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 px-5 py-3 rounded-xl shadow-xl text-sm animate-[toastIn_0.3s_ease] ${
            typeClasses[toast.type]
          }`}
        >
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
