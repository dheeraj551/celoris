import React from 'react';
import { createPortal } from 'react-dom';

/**
 * A Windows-98-style message box used in place of the browser's native
 * window.alert()/window.confirm(). Those native popups broke the retro
 * "Chat Café OS 2000" illusion (flagged by the user as looking "very odd" —
 * "better make it chat room window"), so every in-room/in-cabinet popup now
 * renders as one of these instead, matching the taskbar's classic
 * Windows-98 chrome (blue titlebar, beveled buttons, #ece9d8 body).
 *
 * Rendered through a portal straight onto document.body — same reasoning
 * as WallOfFameModal: this can be triggered from deep inside the retro
 * arcade cabinet frame, and a portal keeps its `fixed inset-0` pinned to
 * the true viewport regardless of ancestor styling.
 */
export interface RetroDialogBoxProps {
  isOpen: boolean;
  title?: string;
  message: string;
  mode?: 'alert' | 'confirm';
  icon?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

export const RetroDialogBox: React.FC<RetroDialogBoxProps> = ({
  isOpen,
  title = 'Chat Café OS 2000',
  message,
  mode = 'alert',
  icon = '💬',
  confirmLabel = 'OK',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  const close = onCancel || onConfirm;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 animate-in fade-in duration-150">
      <div
        role="alertdialog"
        aria-modal="true"
        className="retro-bevel-out bg-[#ece9d8] text-black font-retro-tahoma shadow-2xl w-full max-w-[340px] flex flex-col"
      >
        {/* Classic blue title bar */}
        <div className="bg-gradient-to-r from-[#000080] via-[#1084d0] to-[#000080] text-white px-2 py-1 flex items-center justify-between text-xs font-bold select-none">
          <span className="flex items-center gap-1.5 truncate">
            <span className="text-sm">🪟</span>
            <span className="truncate">{title}</span>
          </span>
          <button
            onClick={close}
            className="w-4 h-4 bg-[#ece9d8] hover:bg-rose-500 hover:text-white border-t border-l border-white border-r border-b border-[#404040] text-black flex items-center justify-center text-[10px] font-bold active:translate-y-px flex-shrink-0"
            title="Close"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-4 flex items-start gap-3">
          <span className="text-3xl flex-shrink-0 leading-none">{icon}</span>
          <p className="text-xs leading-relaxed whitespace-pre-line pt-1">{message}</p>
        </div>

        {/* Button row */}
        <div className="px-4 pb-4 flex items-center justify-center gap-2.5">
          {mode === 'confirm' && (
            <button
              onClick={close}
              className="px-5 py-1 text-xs bg-[#ece9d8] hover:bg-[#f5f2e3] border-t border-l border-white border-r border-b border-[#404040] active:translate-y-px min-w-[75px]"
            >
              {cancelLabel}
            </button>
          )}
          <button
            onClick={onConfirm}
            autoFocus
            className="px-5 py-1 text-xs font-bold bg-[#ece9d8] hover:bg-[#f5f2e3] border-t border-l border-white border-r border-b border-[#404040] active:translate-y-px min-w-[75px]"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
