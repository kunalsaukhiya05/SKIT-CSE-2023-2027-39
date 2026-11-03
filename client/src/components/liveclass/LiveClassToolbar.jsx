import React, { useState } from 'react';

const LiveClassToolbar = ({
    isMuted = true,
    isVideoOn = false,
    isScreenSharing = false,
    isHandRaised = false,
    isAudioOnly = false,
    isTeacher = false,
    unreadChatCount = 0,
    participantCount = 0,
    onToggleMute,
    onToggleVideo,
    onToggleScreenShare,
    onToggleHandRaise,
    onToggleAudioOnly,
    onOpenChat,
    onOpenParticipants,
    onOpenDevices,
    onOpenReactions,
    onLeaveClass
}) => {
    const [showMoreMenu, setShowMoreMenu] = useState(false);
    const [confirmLeave, setConfirmLeave] = useState(false);

    return (
        <div className="relative bg-slate-900 border-t border-slate-700 px-3 sm:px-6 py-3 flex items-center justify-between gap-2 z-30">
            {/* Left Group: Primary Media Controls */}
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={onToggleMute}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                        isMuted
                            ? 'bg-red-600/90 hover:bg-red-600 text-white'
                            : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-600'
                    }`}
                >
                    <span>{isMuted ? 'Unmute' : 'Mute'}</span>
                </button>

                <button
                    type="button"
                    onClick={onToggleVideo}
                    disabled={isAudioOnly}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition disabled:opacity-40 ${
                        isVideoOn && !isAudioOnly
                            ? 'bg-teal-600 hover:bg-teal-500 text-white'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600'
                    }`}
                >
                    <span>{isVideoOn && !isAudioOnly ? 'Stop Video' : 'Start Video'}</span>
                </button>

                <button
                    type="button"
                    onClick={onToggleAudioOnly}
                    title="Switch to low-bandwidth audio mode (saves up to 85% mobile data)"
                    className={`hidden md:flex px-3 py-2 rounded-xl text-xs font-semibold items-center gap-1.5 transition ${
                        isAudioOnly
                            ? 'bg-amber-500 text-slate-950 font-bold'
                            : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-600'
                    }`}
                >
                    <span>{isAudioOnly ? 'Data Saver ON' : 'Data Saver'}</span>
                </button>
            </div>

            {/* Center Group: Collaborative Controls (Responsive) */}
            <div className="flex items-center gap-2">
                {!isTeacher && (
                    <button
                        type="button"
                        onClick={onToggleHandRaise}
                        className={`px-3 py-2 rounded-xl text-xs font-semibold transition ${
                            isHandRaised
                                ? 'bg-amber-500 text-slate-950'
                                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600'
                        }`}
                    >
                        {isHandRaised ? 'Lower Hand' : 'Raise Hand'}
                    </button>
                )}

                <button
                    type="button"
                    onClick={onToggleScreenShare}
                    className={`hidden sm:inline-flex px-3 py-2 rounded-xl text-xs font-semibold transition ${
                        isScreenSharing
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600'
                    }`}
                >
                    {isScreenSharing ? 'Stop Share' : 'Share Screen'}
                </button>

                <button
                    type="button"
                    onClick={onOpenReactions}
                    className="hidden sm:inline-flex px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 transition"
                >
                    React
                </button>

                <button
                    type="button"
                    onClick={onOpenParticipants}
                    className="hidden lg:inline-flex px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 transition items-center gap-1.5"
                >
                    <span>Participants</span>
                    <span className="bg-slate-700 px-1.5 py-0.5 rounded-full text-[10px]">{participantCount}</span>
                </button>

                <button
                    type="button"
                    onClick={onOpenChat}
                    className="hidden lg:inline-flex px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 transition items-center gap-1.5"
                >
                    <span>Chat</span>
                    {unreadChatCount > 0 && (
                        <span className="bg-teal-500 text-slate-950 font-bold px-1.5 py-0.5 rounded-full text-[10px]">
                            {unreadChatCount}
                        </span>
                    )}
                </button>

                {/* Mobile & Tablet Overflow Drawer Trigger */}
                <button
                    type="button"
                    onClick={() => setShowMoreMenu((prev) => !prev)}
                    className="lg:hidden px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600"
                >
                    More
                </button>
            </div>

            {/* Right Group: Devices & Leave */}
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={onOpenDevices}
                    className="hidden md:inline-flex px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600 transition"
                >
                    Devices
                </button>

                <button
                    type="button"
                    onClick={() => setConfirmLeave(true)}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow transition"
                >
                    {isTeacher ? 'End' : 'Leave'}
                </button>
            </div>

            {/* Overflow Menu Popover on Small Viewports */}
            {showMoreMenu && (
                <div className="absolute right-4 bottom-16 w-56 bg-slate-800 border border-slate-600 rounded-xl shadow-2xl p-2 space-y-1 lg:hidden z-40">
                    <button
                        type="button"
                        onClick={() => {
                            onOpenParticipants?.();
                            setShowMoreMenu(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg text-xs text-slate-200 hover:bg-slate-700 flex justify-between"
                    >
                        <span>Participants</span>
                        <span className="text-teal-400 font-bold">{participantCount}</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            onOpenChat?.();
                            setShowMoreMenu(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg text-xs text-slate-200 hover:bg-slate-700 flex justify-between"
                    >
                        <span>In-Class Chat</span>
                        {unreadChatCount > 0 && <span className="text-teal-400 font-bold">{unreadChatCount}</span>}
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            onToggleAudioOnly?.();
                            setShowMoreMenu(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg text-xs text-amber-300 hover:bg-slate-700"
                    >
                        {isAudioOnly ? 'Disable Data Saver Mode' : 'Enable Audio Data Saver'}
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            onOpenReactions?.();
                            setShowMoreMenu(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg text-xs text-slate-200 hover:bg-slate-700 sm:hidden"
                    >
                        Live Reactions
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            onOpenDevices?.();
                            setShowMoreMenu(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg text-xs text-slate-200 hover:bg-slate-700"
                    >
                        Audio / Video Devices
                    </button>
                </div>
            )}

            {/* Leave / End Confirmation Popover */}
            {confirmLeave && (
                <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
                    <div className="bg-slate-800 border border-slate-600 rounded-2xl p-5 w-full max-w-sm shadow-2xl space-y-4">
                        <h3 className="text-sm font-bold text-white">
                            {isTeacher ? 'End Live Session for Everyone?' : 'Leave Live Classroom?'}
                        </h3>
                        <p className="text-xs text-slate-300">
                            {isTeacher
                                ? 'Ending the session will disconnect all enrolled students and save attendance logs.'
                                : 'Your attendance up to this moment has been recorded. You can rejoin anytime while class is live.'}
                        </p>
                        <div className="flex gap-2 justify-end">
                            <button
                                type="button"
                                onClick={() => setConfirmLeave(false)}
                                className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-700"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setConfirmLeave(false);
                                    onLeaveClass?.();
                                }}
                                className="px-4 py-2 text-xs font-bold rounded-lg bg-red-600 hover:bg-red-700 text-white"
                            >
                                {isTeacher ? 'End Session' : 'Leave Room'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LiveClassToolbar;