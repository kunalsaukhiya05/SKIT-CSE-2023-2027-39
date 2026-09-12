import React, { forwardRef } from 'react';

export const Input = forwardRef(({ label, error, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    
    return (
        <div className={lex flex-col w-full \}>
            {label && (
                <label htmlFor={inputId} className="mb-1 text-sm font-medium text-gray-700">
                    {label}
                </label>
            )}
            <input
                id={inputId}
                ref={ref}
                className={order rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:border-transparent transition-shadow
                    \
                }
                {...props}
            />
            {error && (
                <span className="mt-1 text-sm text-red-500">
                    {error}
                </span>
            )}
        </div>
    );
});

Input.displayName = 'Input';
