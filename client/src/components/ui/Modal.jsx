import React, { useEffect } from 'react';

export const Modal = ({ isOpen, onClose, title, children, className = '' }) => {
    useEffect(() => {
        if (isOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} aria-hidden="true"></div>
                <div className={elative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg \}>
                    {title && (
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium leading-6 text-gray-900">{title}</h3>
                        </div>
                    )}
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};
