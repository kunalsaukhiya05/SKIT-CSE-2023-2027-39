import React from 'react';

const ScreenShareOverlay = ({ isSharing, sharerName, onStopSharing, isCurrentUser }) => {
    if (!isSharing) return null;

    return (
        <div className="absolute top-14 left-0 right-0 z-30">
            <div className={mx-4 rounded-lg px-4 py-2.5 flex items-center justify-between shadow-lg  + String(isCurrentUser ? 'bg-teal-600 text-white' : 'bg-blue-600 text-white')}>
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse" />
                    <div>
                        <p className="text-sm font-semibold">
                            {isCurrentUser ? 'You are sharing your screen' : ${sharerName || 'Someone'} is sharing their screen}
                        </p>
                        <p className="text-xs opacity-80">
                            {isCurrentUser ? 'Everyone in the class can see your screen' : 'Viewing shared screen'}
                        </p>
                    </div>
                </div>
                {isCurrentUser && (
                    <button onClick={onStopSharing} className="px-4 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" /></svg>
                        Stop Sharing
                    </button>
                )}
            </div>
        </div>
    );
};

export default ScreenShareOverlay;
