// frontend/src/components/Modal.tsx
'use client';

import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  buttonText?: string;
  onConfirm?: () => void;
  type?: 'info' | 'success' | 'error'; // For different styling
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  buttonText = 'OK',
  onConfirm,
  type = 'info',
}) => {
  if (!isOpen) return null;

  // Modal styling for a light-themed modal (will pop up against your dark background)
  let bgColorClass = 'bg-white';
  let textColorClass = 'text-gray-900';
  let buttonColorClass = 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500';

  if (type === 'success') {
    buttonColorClass = 'bg-green-600 hover:bg-green-700 focus:ring-green-500';
  } else if (type === 'error') {
    buttonColorClass = 'bg-red-600 hover:bg-red-700 focus:ring-red-500';
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-75 backdrop-blur-sm">
      <div className={`${bgColorClass} ${textColorClass} p-8 rounded-lg shadow-2xl max-w-sm w-full border border-gray-200 animate-fade-in-up`}>
        <h2 className="text-2xl font-bold mb-4 text-center">{title}</h2>
        <p className="text-center mb-6 text-gray-700">{message}</p>
        <div className="flex justify-center">
          <button
            onClick={onConfirm || onClose}
            className={`${buttonColorClass} text-white font-semibold py-2 px-6 rounded-md transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white shadow-md`}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;