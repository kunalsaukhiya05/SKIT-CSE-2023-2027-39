import React, { useState, useEffect } from 'react';

const ParticipantSidebar = ({ participants = [], isOpen, onClose, role, onMuteParticipant, onRemoveParticipant }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('all');

    const filteredParticipants = participants.filter((p) => {
        const matchesSearch = !searchTerm || p.name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTab = activeTab === 'all' ||
            (activeTab === 'teachers' && p.role === 'teacher') ||
            (activeTab === 'students' && p.role === 'student');
        return matchesSearch && matchesTab;
    });

    const teacherCount = participants.filter(p => p.role === 'teacher').length;
    const studentCount = participants.filter(p => p.role === 'student').length;

    if (!isOpen) return null;

    return (
        <div className="fixed right-0 top-0 bottom-0 w-80 bg-white shadow-2xl z-40 flex flex-col border-l border-gray-200">
            {/* Header */}
            <div className="px-4 py-3 bg-gray-800 text-white flex items-center justify-between">
                <div>
                    <h3 className="font-semibold text-sm">Participants</h3>
                    <p className="text-xs text-gray-400">{participants.length} in class</p>
                </div>
                <button onClick={onClose} className="p-1.5 hover:bg-gray-700 rounded-lg transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>

            {/* Search */}
            <div className="px-4 py-2 border-b border-gray-100">
                <div className="relative">
                    <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                    <input type="text" placeholder="Search participants..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-100">
                {[
                    { key: 'all', label: 'All', count: participants.length },
                    { key: 'teachers', label: 'Teachers', count: teacherCount },
                    { key: 'students', label: 'Students', count: studentCount }
                ].map((tab) => (
                    <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={lex-1 py-2.5 text-xs font-medium transition-colors  + String(activeTab === tab.key ? 'text-teal-600 border-b-2 border-teal-600 bg-teal-50' : 'text-gray-500 hover:text-gray-700')}>
                        {tab.label} ({tab.count})
                    </button>
                ))}
            </div>

            {/* Participant List */}
            <div className="flex-1 overflow-y-auto">
                {filteredParticipants.length === 0 ? (
                    <div className="p-8 text-center">
                        <p className="text-gray-400 text-sm">No participants found</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {filteredParticipants.map((participant, index) => (
                            <ParticipantItem
                                key={participant.id || index}
                                participant={participant}
                                isTeacher={role === 'teacher'}
                                onMute={onMuteParticipant}
                                onRemove={onRemoveParticipant}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Footer Stats */}
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                <div className="flex justify-between text-xs text-gray-500">
                    <span>{teacherCount} Teacher{teacherCount !== 1 ? 's' : ''}</span>
                    <span>{studentCount} Student{studentCount !== 1 ? 's' : ''}</span>
                    <span>{participants.length} Total</span>
                </div>
            </div>
        </div>
    );
};

const ParticipantItem = ({ participant, isTeacher, onMute, onRemove }) => {
    const [showActions, setShowActions] = useState(false);
    const initials = participant.name ? participant.name.charAt(0).toUpperCase() : '?';
    const isParticipantTeacher = participant.role === 'teacher';

    return (
        <div className="px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3" onMouseEnter={() => setShowActions(true)} onMouseLeave={() => setShowActions(false)}>
            {/* Avatar */}
            <div className={w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0  + String(isParticipantTeacher ? 'bg-blue-500' : 'bg-teal-500')}>
                {participant.avatar ? (
                    <img src={participant.avatar} alt={participant.name} className="w-full h-full rounded-full object-cover" />
                ) : initials}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                    <p className="text-sm font-medium text-gray-900 truncate">{participant.name || 'Unknown'}</p>
                    {isParticipantTeacher && (
                        <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-semibold rounded">HOST</span>
                    )}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                    {/* Mic Status */}
                    <span className={w-2 h-2 rounded-full  + String(participant.isMicOn ? 'bg-green-500' : 'bg-red-400')} title={participant.isMicOn ? 'Mic On' : 'Mic Off'} />
                    {/* Camera Status */}
                    <span className={w-2 h-2 rounded-full  + String(participant.isCameraOn ? 'bg-green-500' : 'bg-red-400')} title={participant.isCameraOn ? 'Camera On' : 'Camera Off'} />
                    <span className="text-[10px] text-gray-400">{participant.joinedAt || ''}</span>
                </div>
            </div>

            {/* Teacher Actions */}
            {isTeacher && showActions && !isParticipantTeacher && (
                <div className="flex gap-1">
                    <button onClick={() => onMute?.(participant.id)} className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-500" title="Mute">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="1" y1="1" x2="23" y2="23" /><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" /></svg>
                    </button>
                    <button onClick={() => onRemove?.(participant.id)} className="p-1.5 hover:bg-red-100 rounded-lg text-red-500" title="Remove">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                    </button>
                </div>
            )}
        </div>
    );
};

export default ParticipantSidebar;
