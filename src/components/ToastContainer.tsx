/**
 * MathLover CCC - Toast Notification System
 * Displays feedback toasts for profile updates, study group reservations,
 * peer connections, and question postings.
 */

import React from 'react';
import { useMath } from '../context/MathContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useMath();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        let Icon = Info;
        let borderColor = 'border-blue-200 bg-blue-50 text-blue-900';
        let iconColor = 'text-blue-600';

        if (toast.type === 'success') {
          Icon = CheckCircle2;
          borderColor = 'border-emerald-200 bg-white text-emerald-950 shadow-emerald-500/10';
          iconColor = 'text-emerald-600';
        } else if (toast.type === 'warning') {
          Icon = AlertCircle;
          borderColor = 'border-amber-200 bg-white text-amber-950 shadow-amber-500/10';
          iconColor = 'text-amber-600';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-md transition-all animate-in slide-in-from-bottom-3 duration-200 ${borderColor}`}
          >
            <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconColor}`} />
            <div className="flex-1 min-w-0">
              <h5 className="text-sm font-semibold text-slate-900 leading-snug">{toast.title}</h5>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{toast.description}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
