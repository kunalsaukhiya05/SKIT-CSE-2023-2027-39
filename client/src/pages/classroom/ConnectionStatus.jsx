import React, { useState, useEffect } from 'react';

const ConnectionStatus = ({ quality }) => {
    const [isVisible, setIsVisible] = useState(true);
    const [networkInfo, setNetworkInfo] = useState({ downlink: null, effectiveType: null, rtt: null });

    useEffect(() => {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        if (connection) {
            const updateInfo = () => {
                setNetworkInfo({
                    downlink: connection.downlink,
                    effectiveType: connection.effectiveType,
                    rtt: connection.rtt
                });
            };
            updateInfo();
            connection.addEventListener('change', updateInfo);
            return () => connection.removeEventListener('change', updateInfo);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (quality === 'good') setIsVisible(false);
        }, 5000);
        return () => clearTimeout(timer);
    }, [quality]);

    const getStatusConfig = () => {
        switch (quality) {
            case 'good':
                return { color: 'bg-green-500', textColor: 'text-green-700', bgColor: 'bg-green-50', label: 'Good Connection', bars: 4 };
            case 'medium':
                return { color: 'bg-yellow-500', textColor: 'text-yellow-700', bgColor: 'bg-yellow-50', label: 'Fair Connection', bars: 3 };
            case 'poor':
                return { color: 'bg-orange-500', textColor: 'text-orange-700', bgColor: 'bg-orange-50', label: 'Poor Connection', bars: 2 };
            case 'critical':
                return { color: 'bg-red-500', textColor: 'text-red-700', bgColor: 'bg-red-50', label: 'Very Weak Connection', bars: 1 };
            default:
                return { color: 'bg-gray-400', textColor: 'text-gray-600', bgColor: 'bg-gray-50', label: 'Checking...', bars: 0 };
        }
    };

    const config = getStatusConfig();

    if (!isVisible && quality === 'good') return null;

    return (
        <div className={inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium  + String(config.bgColor) + ' ' + String(config.textColor)} onClick={() => setIsVisible(true)}>
            {/* Signal Bars */}
            <div className="flex items-end gap-0.5 h-3">
                {[1, 2, 3, 4].map((bar) => (
                    <div key={bar} className={w-1 rounded-sm transition-all  + String(bar <= config.bars ? config.color : 'bg-gray-300')} style={{ height: ${bar * 25}% }} />
                ))}
            </div>
            <span>{config.label}</span>
            {networkInfo.effectiveType && (
                <span className="opacity-70">({networkInfo.effectiveType.toUpperCase()})</span>
            )}
            {quality !== 'good' && networkInfo.rtt && (
                <span className="opacity-60">{networkInfo.rtt}ms</span>
            )}
        </div>
    );
};

export default ConnectionStatus;
