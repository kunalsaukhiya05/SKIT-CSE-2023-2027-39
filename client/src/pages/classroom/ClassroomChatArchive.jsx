import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

const ClassroomChatArchive = ({ isOpen, onClose, classTitle }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [speakerFilter, setSpeakerFilter] = useState('all');

    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: 'Prof. Ramesh Sharma',
            role: 'teacher',
            text: 'Welcome everyone! Today we are covering Dijkstra algorithm and routing tables.',
            timestamp: '10:02 AM',
            reactions: { '👍': 8, '👏': 3 },
            isPinned: true
        },
        {
            id: 2,
            sender: 'Aarav Sharma',
            role: 'student',
            text: 'Sir, will the recording be uploaded today? Electricity is fluctuating in our village.',
            timestamp: '10:05 AM',
            reactions: { '👍': 4 }
        },
        {
            id: 3,
            sender: 'Prof. Ramesh Sharma',
            role: 'teacher',
            text: 'Yes Aarav, the low-bandwidth audio + notes bundle will be available right after class.',
            timestamp: '10:06 AM',
            reactions: { '❤️': 6, '💡': 2 }
        },
        {
            id: 4,
            sender: 'Divya Soni',
            role: 'student',
            text: 'In slide 14, is the graph directed or undirected?',
            timestamp: '10:19 AM',
            reactions: { '❓': 2 }
        },
        {
            id: 5,
            sender: 'Prof. Ramesh Sharma',
            role: 'teacher',
            text: 'Undirected for now. We will address directed acyclic graphs in Unit 4.',
            timestamp: '10:21 AM',
            reactions: { '👍': 5 }
        },
        {
            id: 6,
            sender: 'Hemant Choudhary',
            role: 'student',
            text: 'Understood sir, thanks!',
            timestamp: '10:22 AM',
            reactions: { '👍': 1 }
        }
    ]);

    const handleReaction = (msgId, emoji) => {
        setMessages(prev => prev.map(m => {
            if (m.id !== msgId) return m;
            const currentCount = m.reactions[emoji] || 0;
            return {
                ...m,
                reactions: {
                    ...m.reactions,
                    [emoji]: currentCount + 1
                }
            };
        }));
    };

    const handleExportTranscript = () => {
        const header = `=== Chat Transcript for ${classTitle || 'Live Classroom'} ===\nDate: 2026-10-16\n\n`;
        const body = messages.map(m => `[${m.timestamp}] ${m.sender} (${m.role}): ${m.text}`).join('\n');
        const blob = new Blob([header + body], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `chat-transcript-${Date.now()}.txt`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Chat transcript exported successfully!');
    };

    const filtered = messages.filter(m => {
        const matchSearch = !searchQuery ||
            m.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.sender.toLowerCase().includes(searchQuery.toLowerCase());
        const matchRole = speakerFilter === 'all' || m.role === speakerFilter;
        return matchSearch && matchRole;
    });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black bg-opacity-50 flex justify-end">
            <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col">
                {/* Header */}
                <div className="bg-gray-800 text-white p-4 flex items-center justify-between border-b border-gray-700">
                    <div className="flex items-center gap-2">
                        <span className="text-xl">💬</span>
                        <div>
                            <h3 className="text-sm font-bold">Classroom Chat Archive</h3>
                            <p className="text-xs text-gray-400">{classTitle || 'Live Session Log'}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleExportTranscript}
                            className="text-xs bg-teal-600 hover:bg-teal-700 text-white px-2.5 py-1 rounded-md font-medium flex items-center gap-1"
                        >
                            ⬇ Export
                        </button>
                        <button onClick={onClose} className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-white">
                            ✕
                        </button>
                    </div>
                </div>

                {/* Search & Filters */}
                <div className="p-3 border-b bg-gray-50 flex flex-col gap-2">
                    <input
                        type="text"
                        placeholder="Search conversation..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full text-xs border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    />
                    <div className="flex gap-2">
                        {['all', 'teacher', 'student'].map(role => (
                            <button
                                key={role}
                                onClick={() => setSpeakerFilter(role)}
                                className={`text-xs px-3 py-1 rounded-full font-medium capitalize transition ${
                                    speakerFilter === role ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                {role}s
                            </button>
                        ))}
                    </div>
                </div>

                {/* Messages List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {filtered.length === 0 ? (
                        <div className="text-center py-10 text-gray-400">
                            <span className="text-3xl block mb-2">🔍</span>
                            <p className="text-xs">No matching messages found</p>
                        </div>
                    ) : (
                        filtered.map(msg => (
                            <div
                                key={msg.id}
                                className={`p-3 rounded-xl border transition-all ${
                                    msg.isPinned
                                        ? 'bg-amber-50/60 border-amber-300'
                                        : msg.role === 'teacher'
                                        ? 'bg-teal-50/40 border-teal-200'
                                        : 'bg-white border-gray-200'
                                }`}
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-1.5">
                                        {msg.isPinned && <span className="text-xs" title="Pinned Announcement">📌</span>}
                                        <span className="font-semibold text-xs text-gray-800">{msg.sender}</span>
                                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold uppercase ${
                                            msg.role === 'teacher' ? 'bg-teal-100 text-teal-800' : 'bg-gray-100 text-gray-600'
                                        }`}>
                                            {msg.role}
                                        </span>
                                    </div>
                                    <span className="text-[10px] text-gray-400">{msg.timestamp}</span>
                                </div>

                                <p className="text-xs text-gray-800 leading-relaxed">{msg.text}</p>

                                {/* Reactions */}
                                <div className="flex items-center gap-1.5 mt-2 pt-1 border-t border-gray-100">
                                    {Object.entries(msg.reactions || {}).map(([emoji, count]) => (
                                        <button
                                            key={emoji}
                                            onClick={() => handleReaction(msg.id, emoji)}
                                            className="text-[11px] bg-gray-100 hover:bg-teal-50 border border-gray-200 px-1.5 py-0.5 rounded-full flex items-center gap-1 text-gray-700"
                                        >
                                            <span>{emoji}</span>
                                            <span className="font-semibold">{count}</span>
                                        </button>
                                    ))}
                                    <div className="flex items-center gap-1 ml-auto text-xs text-gray-400">
                                        <button onClick={() => handleReaction(msg.id, '👍')} className="hover:scale-125 transition">👍</button>
                                        <button onClick={() => handleReaction(msg.id, '❤️')} className="hover:scale-125 transition">❤️</button>
                                        <button onClick={() => handleReaction(msg.id, '💡')} className="hover:scale-125 transition">💡</button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClassroomChatArchive;
