import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const ClassroomHandRaiseQueue = ({ isOpen, onClose, role, userName }) => {
    const isTeacher = role === 'teacher';

    const [queue, setQueue] = useState([
        { id: 1, name: 'Divya Soni', roll: '23CS021', topic: 'Slide 18 Routing Loop query', waitMins: 4, isSpeaking: false },
        { id: 2, name: 'Hemant Choudhary', roll: '23CS042', topic: 'Time complexity doubt', waitMins: 2, isSpeaking: false },
        { id: 3, name: 'Kavita Rawat', roll: '23CS053', topic: 'Clarification on assignment due date', waitMins: 1, isSpeaking: false }
    ]);

    const [hasRaisedHand, setHasRaisedHand] = useState(false);
    const [topicInput, setTopicInput] = useState('');
    const [activeSpeakerTimer, setActiveSpeakerTimer] = useState(0);

    // Timer for currently called student
    useEffect(() => {
        const speaking = queue.find(q => q.isSpeaking);
        if (!speaking) {
            setActiveSpeakerTimer(0);
            return;
        }
        const timer = setInterval(() => {
            setActiveSpeakerTimer(prev => prev + 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [queue]);

    const handleToggleHand = () => {
        if (hasRaisedHand) {
            setQueue(prev => prev.filter(q => q.name !== (userName || 'You')));
            setHasRaisedHand(false);
            toast('Hand lowered', { icon: '✋' });
        } else {
            const entry = {
                id: Date.now(),
                name: userName || 'You',
                roll: 'B230960',
                topic: topicInput.trim() || 'General Doubt',
                waitMins: 0,
                isSpeaking: false
            };
            setQueue([...queue, entry]);
            setHasRaisedHand(true);
            setTopicInput('');
            toast.success('Your hand is raised! Waiting in queue.');
        }
    };

    const handleCallStudent = (id) => {
        setQueue(prev => prev.map(q => ({
            ...q,
            isSpeaking: q.id === id
        })));
        const target = queue.find(q => q.id === id);
        toast.success(`Unmuted ${target?.name || 'student'} to speak.`);
    };

    const handleResolve = (id) => {
        setQueue(prev => prev.filter(q => q.id !== id));
        toast.success('Doubt resolved.');
    };

    const formatTimer = (secs) => {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black bg-opacity-50 flex justify-end">
            <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col">
                {/* Header */}
                <div className="bg-gray-800 text-white p-4 flex items-center justify-between border-b border-gray-700">
                    <div className="flex items-center gap-2">
                        <span className="text-xl">✋</span>
                        <div>
                            <h3 className="text-sm font-bold">Hand Raise Queue</h3>
                            <p className="text-xs text-gray-400">{queue.length} student(s) waiting</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-white">✕</button>
                </div>

                {/* Student Raise Hand Action Box */}
                {!isTeacher && (
                    <div className="p-4 bg-teal-50 border-b border-teal-200">
                        <input
                            type="text"
                            placeholder="Brief doubt topic (optional)..."
                            value={topicInput}
                            onChange={(e) => setTopicInput(e.target.value)}
                            disabled={hasRaisedHand}
                            className="w-full text-xs border border-gray-300 rounded-lg p-2 mb-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                        />
                        <button
                            onClick={handleToggleHand}
                            className={`w-full py-2.5 rounded-xl font-semibold text-xs transition shadow-sm ${
                                hasRaisedHand
                                    ? 'bg-amber-500 hover:bg-amber-600 text-white'
                                    : 'bg-teal-600 hover:bg-teal-700 text-white'
                            }`}
                        >
                            {hasRaisedHand ? '✋ Lower My Hand' : '✋ Raise Hand to Ask Doubt'}
                        </button>
                    </div>
                )}

                {/* Queue List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {queue.length === 0 ? (
                        <div className="text-center py-12 text-gray-400">
                            <span className="text-4xl block mb-2">🎉</span>
                            <p className="text-xs">No hands currently raised in this class</p>
                        </div>
                    ) : (
                        queue.map((student, index) => (
                            <div
                                key={student.id}
                                className={`p-3.5 rounded-xl border transition-all ${
                                    student.isSpeaking
                                        ? 'bg-teal-50 border-teal-400 ring-2 ring-teal-200 shadow'
                                        : 'bg-white border-gray-200'
                                }`}
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold text-teal-600 w-4">#{index + 1}</span>
                                            <h4 className="text-xs font-bold text-gray-800">{student.name}</h4>
                                            <span className="text-[10px] text-gray-400 font-mono">({student.roll})</span>
                                        </div>
                                        <p className="text-xs text-gray-600 mt-1 italic">"{student.topic}"</p>
                                        <span className="text-[10px] text-gray-400 block mt-1">Waiting: ~{student.waitMins}m</span>
                                    </div>

                                    {student.isSpeaking && (
                                        <div className="text-right">
                                            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full block animate-pulse">
                                                Speaking
                                            </span>
                                            <span className="text-xs font-mono font-bold text-teal-800 block mt-1">
                                                {formatTimer(activeSpeakerTimer)}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Teacher Controls */}
                                {isTeacher && (
                                    <div className="flex items-center gap-2 mt-3 pt-2 border-t border-gray-100">
                                        {!student.isSpeaking ? (
                                            <button
                                                onClick={() => handleCallStudent(student.id)}
                                                className="text-xs bg-teal-600 hover:bg-teal-700 text-white font-semibold px-3 py-1 rounded-lg transition"
                                            >
                                                Call on Student
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleResolve(student.id)}
                                                className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-3 py-1 rounded-lg transition"
                                            >
                                                Mark Done
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleResolve(student.id)}
                                            className="text-xs text-gray-500 hover:text-red-600 font-medium ml-auto"
                                        >
                                            Dismiss
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClassroomHandRaiseQueue;
