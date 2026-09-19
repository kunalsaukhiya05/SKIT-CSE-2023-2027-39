import React from 'react';

export const Avatar = ({ src, alt, size = 'md', className = '' }) => {
    const sizes = {
        sm: 'w-8 h-8',
        md: 'w-12 h-12',
        lg: 'w-16 h-16',
        xl: 'w-24 h-24'
    };

    const initials = alt ? alt.charAt(0).toUpperCase() : '?';

    return (
        <div className={elative rounded-full overflow-hidden bg-teal-100 flex items-center justify-center border-2 border-white shadow-sm \ \}>
            {src ? (
                <img src={src} alt={alt} className="w-full h-full object-cover" />
            ) : (
                <span className="text-teal-700 font-semibold text-lg">{initials}</span>
            )}
        </div>
    );
};
