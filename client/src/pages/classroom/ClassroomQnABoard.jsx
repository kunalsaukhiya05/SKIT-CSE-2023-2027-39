import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

const ClassroomQnABoard = ({ isOpen, onClose, role, userName }) => {
    const isTeacher = role === 'teacher';

    const [questions, setQuestions] = useState([
        {
            id: 1,
            author: 'Ravi Kumar',
            text: 'Can we re-explain why the sliding window protocol uses cumulative acknowledgements?',
            upvotes: 6,
            isAnswered: false,
            timestamp: '10:14 AM',
            isPinned: true,
        },
        {
            id: 2,
            author: 'Priya Sharma',
            text: 'What will be the submission deadline for practical unit 3?',
            upvotes: 4,
            isAnswered: true,
            timestamp: '10:18 AM',
            isPinned: false,
        },
        {
            id: 3,
            author: 'Anonymous Student',
            text: 'Is checksum calculation required in the semester exam question paper?',
            upvotes: 2,
            isAnswered: false,
            timestamp: '10:25 AM',
            isPinned: false,
        },
    ]);

    const [newQuestion, setNewQuestion] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [activeFilter, setActiveFilter] = useState('all');

    const handleAskQuestion = (e) => {
        e.preventDefault();
        if (!newQuestion.trim()) {
            toast.error('Please type your question or doubt');
            return;
        }

        const entry = {
            id: Date.now(),
            author: isAnonymous ? 'Anonymous Student' : userName || 'Student',
            text: newQuestion.trim(),
            upvotes: 1,
            isAnswered: false,
            timestamp: 'Just now',
            isPinned: false,
        };

        setQuestions([entry, ...questions]);
        setNewQuestion('');
        toast.success('Doubt submitted to teacher Q&A queue!');
    };

    const handleUpvote = (id) => {
        setQuestions((prev) =>
            prev.map((q) => (q.id === id ? { ...q, upvotes: q.upvotes + 1 } : q))
        );
    };

    const handleToggleAnswered = (id) => {
        setQuestions((prev) =>
            prev.map((q) => (q.id === id ? { ...q, isAnswered: !q.isAnswered } : q))
        );
        toast.success('Question status updated');
    };

    const handleTogglePin = (id) => {
        setQuestions((prev) =>
            prev.map((q) => (q.id === id ? { ...q, isPinned: !q.isPinned } : q))
        );
    };

    const filtered = questions.filter((q) => {
        if (activeFilter === 'unanswered') return !q.isAnswered;
        if (activeFilter === 'answered') return q.isAnswered;
        return true;
    }).sort((a, b) => {
        if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
        return b.upvotes - a.upvotes;
    });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black bg-opacity-50 flex justify-end">
            <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300">
                {/* Header */}
                <div className="bg-gray-800 text-white p-4 flex items-center justify-between border-b border-gray-700">
                    <div className="flex items-center gap-2">
                        <span className="text-xl">💡</span>
                        <div>
                            <h3 className="text-sm font-bold">Classroom Q&A & Doubts</h3>
                            <p className="text-xs text-gray-400">Upvoted student questions queue</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1.5 hover:bg-gray-700 rounded-lg text-gray-300">
                        ✕
                    </button>
                </div>

                {/* Filters */}
                <div className="flex border-b text-xs font-semibold bg-gray-50">
                    {['all', 'unanswered', 'answered'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setActiveFilter(f)}
                            className={`flex-1 py-2.5 uppercase transition-colors ${
                                activeFilter === f ? 'border-b-2 border-teal-600 text-teal-700 bg-white' : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                {/* Submit Doubt Form */}
                <form onSubmit={handleAskQuestion} className="p-4 border-b bg-gray-50 space-y-2">
                    <textarea
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                        placeholder="Ask a question or raise a doubt for the teacher..."
                        rows={2}
                        className="w-full text-xs border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    />
                    <div className="flex items-center justify-between">
                        <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={isAnonymous}
                                onChange={(e) => setIsAnonymous(e.target.checked)}
                                className="rounded text-teal-600"
                            />
                            Ask Anonymously
                        </label>
                        <button
                            type="submit"
                            className="text-xs bg-teal-600 hover:bg-teal-700 text-white font-semibold px-3.5 py-1.5 rounded-lg shadow-sm"
                        >
                            Submit Doubt
                        </button>
                    </div>
                </form>

                {/* Questions List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {filtered.length === 0 ? (
                        <div className="text-center py-12 text-gray-400">
                            <span className="text-4xl block mb-2">💬</span>
                            <p className="text-sm">No questions in this filter</p>
                        </div>
                    ) : (
                        filtered.map((item) => (
                            <div
                                key={item.id}
                                className={`border rounded-xl p-3.5 transition-all bg-white shadow-sm flex flex-col justify-between ${
                                    item.isPinned ? 'border-teal-400 bg-teal-50/20' : 'border-gray-200'
                                }`}
                            >
                                <div>
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                                            {item.isPinned && <span className="text-teal-600 font-bold">📌 Pinned</span>}
                                            <span className="font-semibold text-gray-800">{item.author}</span>
                                            <span>• {item.timestamp}</span>
                                        </div>
                                        {item.isAnswered ? (
                                            <span className="text-[10px] bg-green-100 text-green-800 font-bold px-2 py-0.5 rounded-full">
                                                Answered
                                            </span>
                                        ) : (
                                            <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                                                Open
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-900 leading-relaxed font-medium">{item.text}</p>
                                </div>

                                <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
                                    <button
                                        onClick={() => handleUpvote(item.id)}
                                        className="text-xs flex items-center gap-1 bg-gray-100 hover:bg-teal-50 hover:text-teal-700 text-gray-700 font-semibold px-2.5 py-1 rounded-lg transition"
                                    >
                                        ▲ Upvote ({item.upvotes})
                                    </button>

                                    {isTeacher && (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleTogglePin(item.id)}
                                                className="text-[11px] text-gray-500 hover:text-teal-700 font-medium"
                                            >
                                                {item.isPinned ? 'Unpin' : 'Pin'}
                                            </button>
                                            <button
                                                onClick={() => handleToggleAnswered(item.id)}
                                                className="text-[11px] text-teal-600 hover:underline font-semibold"
                                            >
                                                {item.isAnswered ? 'Mark Unanswered' : 'Mark Answered'}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClassroomQnABoard;
