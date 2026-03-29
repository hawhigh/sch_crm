import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const Modal = ({ isOpen, onClose, title, children, footer }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#303030]/40 backdrop-blur-xl animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Content */}
      <div className="relative bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-500 border border-[#454557]/10">
        {/* Header */}
        <div className="px-10 py-8 border-b border-[#454557]/5 flex items-center justify-between">
          <h3 className="serif text-3xl font-bold text-[#303030]">{title}</h3>
          <button 
            onClick={onClose}
            className="w-12 h-12 rounded-full hover:bg-surface-low flex items-center justify-center text-[#454557]/60 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Body */}
        <div className="px-10 py-10 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {children}
        </div>
        
        {/* Footer */}
        {footer && (
          <div className="px-10 py-8 border-t border-[#454557]/5 bg-surface-low/50 flex items-center justify-end gap-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
