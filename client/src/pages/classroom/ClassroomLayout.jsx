import React, { useState } from 'react';

const ClassroomLayout = ({ children, role, classTitle, subject, onToggleChat, onToggleParticipants, isChatOpen, isParticipantsOpen, participantCount, connectionQuality }) => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    return (
        <div className="h-screen flex flex-col bg-gray-900 text-white overflow-hidden">
            {/* Top Bar */}
            <header className="bg-gray-800 border-b border-gray-700 px-4 py-2 flex items-center justify-between flex-shrink-0 z-20">
                <div className="flex items-center gap-3 min-w-0">
                    <h2 className="text-sm md:text-base font-semibold truncate max-w-[200px]">{classTitle || 'Classroom'}</h2>
                    {subject && <span className="hidden md:inline text-xs text-gray-400 truncate">{subject}</span>}
                    <span className={px-2 py-0.5 rounded text-xs font-medium  + String(role === 'teacher' ? 'bg-blue-600' : 'bg-green-600')}>{role === 'teacher' ? 'Teacher' : 'Student'}</span>
                </div>

                <div className="flex items-center gap-2">
                    {/* Connection Quality */}
                    <div className="hidden sm:flex items-end gap-0.5 h-4 px-2">
                        {[1, 2, 3, 4].map((bar) => {
                            const qualityMap = { good: 4, medium: 3, poor: 2, critical: 1 };
                            const level = qualityMap[connectionQuality] || 0;
                            return <div key={bar} className={w-1 rounded-sm  + String(bar <= level ? 'bg-green-400' : 'bg-gray-600')} style={{ height: ${bar * 25}% }} />;
                        })}
                    </div>

                    {/* Participant Toggle */}
                    <button onClick={onToggleParticipants} className={p-2 rounded-lg transition-colors flex items-center gap-1.5  + String(isParticipantsOpen ? 'bg-teal-600 text-white' : 'hover:bg-gray-700 text-gray-300')}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" /></svg>
                        <span className="text-xs hidden md:inline">{participantCount || 0}</span>
                    </button>

                    {/* Chat Toggle */}
                    <button onClick={onToggleChat} className={p-2 rounded-lg transition-colors  + String(isChatOpen ? 'bg-teal-600 text-white' : 'hover:bg-gray-700 text-gray-300')}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 relative overflow-hidden">
                {children}
            </main>
        </div>
    );
};

export default ClassroomLayout;
