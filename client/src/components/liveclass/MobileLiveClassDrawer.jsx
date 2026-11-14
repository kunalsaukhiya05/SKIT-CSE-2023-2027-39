import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

const MobileLiveClassDrawer = ({
    isOpen,
    onClose,
    initialTab = 'chat', // chat, participants, notes
    participants = [],
    messages = [],
    onSendMessage,
    isAudioOnly = false,
    onToggleAudioOnly
}) => {
    const [activeTab, setActiveTab] = useState(initialTab);
    const [draftMsg, setDraftMsg] = useState('');

    if (!isOpen) return null;

    const handleSend = (e) => {
        e.preventDefault();
        if (!draftMsg.trim()) return;
        onSendMessage?.(draftMsg.trim());
        setDraftMsg('');
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end justify-center lg:items-center">
            <div className="w-full max-w-lg bg-slate-900 text-white rounded-t-3xl lg:rounded-2xl border-t lg:border border-slate-700 shadow-2xl flex flex-col max-h-[82vh] overflow-hidden">
                {/* Touch Drag Handle for Mobile */}
                <div className="w-full flex justify-center pt-2.5 pb-1 lg:hidden">
                    <div className="w-10 h-1.5 rounded-full bg-slate-600"></div>
                </div>

                {/* Drawer Header */}
                <div className="px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex gap-1.5 text-xs font-semibold">
                        {[
                            { id: 'chat', label: `Chat (${messages.length})` },
                            { id: 'participants', label: `Roster (${participants.length})` },
                            { id: 'network', label: 'Data Saver' }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-3 py-1.5 rounded-xl transition ${
                                    activeTab === tab.id
                                        ? 'bg-teal-600 text-white'
                                        : 'bg-slate-800 text-slate-400 hover:text-white'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="text-xs px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
                    >
                        Done
                    </button>
                </div>

                {/* Tab 1: Touch-Friendly Live Chat */}
                {activeTab === 'chat' && (
                    <div className="flex-1 flex flex-col min-h-[280px] overflow-hidden">
                        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
                            {messages.length === 0 ? (
                                <p className="text-center text-xs text-slate-500 py-8">
                                    No chat messages yet. Ask your instructor a question below.
                                </p>
                            ) : (
                                messages.map((m) => (
                                    <div key={m.id} className="bg-slate-800/80 border border-slate-700 rounded-xl p-2.5">
                                        <div className="flex justify-between text-[11px] mb-0.5">
                                            <span className="font-bold text-teal-300">{m.sender}</span>
                                            <span className="text-slate-500">{m.time}</span>
                                        </div>
                                        <p className="text-xs text-slate-100">{m.text}</p>
                                    </div>
                                ))
                            )}
                        </div>

                        <form onSubmit={handleSend} className="p-3 border-t border-slate-800 flex gap-2 bg-slate-950/60">
                            <input
                                type="text"
                                placeholder="Send message in class..."
                                value={draftMsg}
                                onChange={(e) => setDraftMsg(e.target.value)}
                                className="flex-1 text-xs bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                            <button
                                type="submit"
                                className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-xl"
                            >
                                Send
                            </button>
                        </form>
                    </div>
                )}

                {/* Tab 2: Quick Mobile Roster */}
                {activeTab === 'participants' && (
                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                        {participants.map((p) => (
                            <div
                                key={p.id}
                                className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between text-xs"
                            >
                                <div>
                                    <span className="font-semibold text-white block">{p.name}</span>
                                    <span className="text-[11px] text-slate-400">
                                        {p.rollNo || 'Faculty'} â€¢ {p.audioOnly ? 'Audio Saver' : 'Standard'}
                                    </span>
                                </div>
                                <span
                                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                        p.isMuted ? 'bg-red-500/20 text-red-300' : 'bg-emerald-500/20 text-emerald-300'
                                    }`}
                                >
                                    {p.isMuted ? 'Muted' : 'Active'}
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Tab 3: Rural Mobile Data Optimization */}
                {activeTab === 'network' && (
                    <div className="p-5 space-y-4">
                        <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-between gap-3">
                            <div>
                                <h4 className="text-xs font-bold text-white">Audio-Only Saver Mode</h4>
                                <p className="text-[11px] text-slate-400 mt-0.5">
                                    Reduces class data usage from ~180 MB/hr down to ~15 MB/hr on 2G/3G networks.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    onToggleAudioOnly?.();
                                    toast.success(isAudioOnly ? 'Standard mode restored' : 'Audio Saver enabled');
                                }}
                                className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 ${
                                    isAudioOnly ? 'bg-amber-500 text-slate-950' : 'bg-teal-600 text-white'
                                }`}
                            >
                                {isAudioOnly ? 'Turn Off' : 'Enable'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MobileLiveClassDrawer;