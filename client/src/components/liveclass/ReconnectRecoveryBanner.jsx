import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const ReconnectRecoveryBanner = ({
    connectionState = 'connected', // connected, degraded, reconnecting, offline
    queuedMessagesCount = 0,
    onRetryNow,
    onSwitchAudioOnly
}) => {
    const [retryCountdown, setRetryCountdown] = useState(5);
    const [attemptNumber, setAttemptNumber] = useState(1);

    useEffect(() => {
        if (connectionState !== 'reconnecting' && connectionState !== 'offline') {
            setRetryCountdown(5);
            return;
        }

        const timer = setInterval(() => {
            setRetryCountdown((prev) => {
                if (prev <= 1) {
                    setAttemptNumber((a) => a + 1);
                    onRetryNow?.();
                    return 5;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [connectionState, onRetryNow]);

    if (connectionState === 'connected') return null;

    const isCritical = connectionState === 'offline' || connectionState === 'reconnecting';

    return (
        <div
            className={`px-4 py-2.5 border-b flex flex-wrap items-center justify-between gap-2 text-xs z-30 ${
                isCritical
                    ? 'bg-red-900/90 border-red-700 text-white'
                    : 'bg-amber-900/90 border-amber-700 text-amber-100'
            }`}
        >
            <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-300 animate-ping shrink-0"></span>
                <div>
                    <span className="font-bold block sm:inline">
                        {isCritical
                            ? `Connection Interrupted (Retry #${attemptNumber} in ${retryCountdown}s)`
                            : 'Weak Rural Cellular Signal Detected (>350ms RTT)'}
                    </span>
                    <span className="text-[11px] opacity-90 sm:ml-2 block sm:inline">
                        {queuedMessagesCount > 0
                            ? `${queuedMessagesCount} offline chat/attendance updates safely queued.`
                            : 'Your attendance session remains preserved locally.'}
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => {
                        onSwitchAudioOnly?.();
                        toast.success('Switched to ultra-low bandwidth Audio Mode');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition"
                >
                    Switch to Audio-Only
                </button>
                <button
                    type="button"
                    onClick={() => {
                        setRetryCountdown(5);
                        onRetryNow?.();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white font-semibold transition"
                >
                    Retry Now
                </button>
            </div>
        </div>
    );
};

export default ReconnectRecoveryBanner;