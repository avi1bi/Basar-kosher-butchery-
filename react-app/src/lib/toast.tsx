import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";

interface ToastData {
  message: string;
  link?: { to: string; label: string };
}

const ToastContext = createContext<(t: ToastData) => void>(() => {});

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastData | null>(null);
  const [visible, setVisible] = useState(false);
  const timer = useRef<number>();

  const show = useCallback((t: ToastData) => {
    setToast(t);
    setVisible(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setVisible(false), 3800);
  }, []);

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div className={`toast${visible ? " show" : ""}`} role="status">
        {toast && (
          <>
            <span>{toast.message}</span>
            {toast.link && <Link to={toast.link.to}>{toast.link.label}</Link>}
          </>
        )}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
