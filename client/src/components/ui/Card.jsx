import React from 'react';

export const Card = ({ children, className = '' }) => {
    return (
        <div className={g-white shadow-sm rounded-lg border border-gray-200 overflow-hidden \}>
            {children}
        </div>
    );
};

export const CardHeader = ({ title, subtitle, className = '' }) => {
    return (
        <div className={px-6 py-4 border-b border-gray-200 \}>
            {title && <h3 className="text-lg font-medium text-gray-900">{title}</h3>}
            {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
        </div>
    );
};

export const CardBody = ({ children, className = '' }) => {
    return (
        <div className={px-6 py-4 \}>
            {children}
        </div>
    );
};

export const CardFooter = ({ children, className = '' }) => {
    return (
        <div className={px-6 py-4 bg-gray-50 border-t border-gray-200 \}>
            {children}
        </div>
    );
};
