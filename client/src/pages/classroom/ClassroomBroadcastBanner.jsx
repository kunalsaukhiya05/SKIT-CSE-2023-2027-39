import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

const ClassroomBroadcastBanner = ({ role }) => {
    const isTeacher = role === 'teacher';

    const [announcement, setAnnouncement] = useState({
        id: 1,
        type: 'warning', // warning, urgent, info, tip
        message: '⚡ Village Feeder Line 2 power scheduled outage at 11:30 AM — Audio-first fallback will activate automatically.',
        timestamp: '10:45 AM',
        isVisible: true
    });

    const [isComposeOpen, setIsComposeOpen] = useState(false);
    const [newMessage, setNewMessage] = useState('');
    const [newType, setNewType] = useState('warning');

    const handlePublishAnnouncement = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) {
            toast.error('Announcement text cannot be empty');
            return;
        }

        setAnnouncement({
            id: Date.now(),
            type: newType,
            message: newMessage.trim(),
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isVisible: true
        });

        setIsComposeOpen(false);
        setNewMessage('');
        toast.success('Priority alert broadcasted to all enrolled students!');
    };

    if (!announcement.isVisible && !isTeacher) return null;

    const typeStyles = {
        urgent: 'bg-red-600 text-white border-red-700',
        warning: 'bg-amber-500 text-white border-amber-600',
        info: 'bg-blue-600 text-white border-blue-700',
        tip: 'bg-teal-600 text-white border-teal-700'
    };

    return (
        <div className="w-full">
            {announcement.isVisible && (
                <div className={`px-4 py-2 flex items-center justify-between text-xs shadow-md border-b transition-all ${typeStyles[announcement.type]}`}>
                    <div className="flex items-center gap-2 flex-1 overflow-hidden">
                        <span className="font-bold uppercase tracking-wider text-[10px] bg-black/20 px-1.5 py-0.5 rounded">
                            {announcement.type}
                        </span>
                        <span className="font-medium truncate">{announcement.message}</span>
                        <span className="text-[10px] opacity-80 hidden sm:inline">• {announcement.timestamp}</span>
                    </div>

                    <div className="flex items-center gap-2 ml-3">
                        {isTeacher && (
                            <button
                                onClick={() => setIsComposeOpen(true)}
                                className="bg-black/20 hover:bg-black/40 px-2 py-0.5 rounded text-[11px] font-semibold"
                            >
                                Edit Notice
                            </button>
                        )}
                        <button
                            onClick={() => setAnnouncement(prev => ({ ...prev, isVisible: false }))}
                            className="text-white/80 hover:text-white font-bold text-sm leading-none"
                            title="Dismiss for now"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}

            {/* Teacher Compose Modal */}
            {isComposeOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-5 border border-gray-200">
                        <div className="flex items-center justify-between border-b pb-3 mb-3">
                            <h3 className="text-sm font-bold text-gray-800">Broadcast Notice to Classroom</h3>
                            <button onClick={() => setIsComposeOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                        </div>

                        <form onSubmit={handlePublishAnnouncement} className="space-y-3">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Alert Priority / Category</label>
                                <select
                                    value={newType}
                                    onChange={(e) => setNewType(e.target.value)}
                                    className="w-full text-xs border border-gray-300 rounded-lg p-2 bg-white"
                                >
                                    <option value="warning">Warning (Yellow - Power cut, audio lag alert)</option>
                                    <option value="urgent">Urgent (Red - Class rescheduled / Test started)</option>
                                    <option value="info">Information (Blue - Lecture notes link)</option>
                                    <option value="tip">Rural Tip (Green - Bandwidth saving reminder)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Announcement Message</label>
                                <textarea
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type notice message to display on student screens..."
                                    rows={3}
                                    className="w-full text-xs border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                />
                            </div>

                            <div className="flex gap-2 pt-2 border-t">
                                <button
                                    type="submit"
                                    className="flex-1 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold py-2 rounded-lg transition"
                                >
                                    Broadcast to All
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsComposeOpen(false)}
                                    className="px-4 py-2 border border-gray-300 text-xs text-gray-700 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClassroomBroadcastBanner;
