import { createContext, useCallback, useContext, useState } from "react";
import { Sparkles, Check, Info } from "lucide-react";

const ToastContext = createContext({
  showToast: () => {},
});

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = "success") => {
    setToast({ id: Date.now(), message, type });
    window.clearTimeout(window.__toastTimeout);
    window.__toastTimeout = window.setTimeout(() => {
      setToast(null);
    }, 2400);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 animate-bounce transition-all duration-200"
        >
          <div className="neo-box flex items-center gap-2.5 rounded-2xl bg-neo-yellow px-4 py-3 text-black shadow-brutal dark:bg-neo-yellow dark:text-black dark:border-white">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-black text-white dark:bg-black dark:text-neo-yellow">
              <Check className="h-4 w-4 stroke-[3]" />
            </span>
            <span className="font-display text-xs sm:text-sm font-black uppercase tracking-wider">
              {toast.message}
            </span>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
