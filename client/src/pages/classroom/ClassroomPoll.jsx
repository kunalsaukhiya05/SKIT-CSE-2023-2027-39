import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const ClassroomPoll = ({ isOpen, onClose, role, userName }) => {
    const isTeacher = role === 'teacher';

    // Active poll state
    const [activePoll, setActivePoll] = useState(null);
    const [userVoted, setUserVoted] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [timeLeft, setTimeLeft] = useState(0);

    // Form state for creating poll
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState(['', '']);
    const [duration, setDuration] = useState(60);
    const [isAnonymous, setIsAnonymous] = useState(false);

    // Countdown Timer
    useEffect(() => {
        if (!activePoll || timeLeft <= 0) return;
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    toast('Poll has ended!', { icon: '⏰' });
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [activePoll, timeLeft]);

    const handleAddOption = () => {
        if (options.length >= 5) {
            toast.error('Maximum 5 options allowed');
            return;
        }
        setOptions([...options, '']);
    };

    const handleOptionChange = (index, value) => {
        const next = [...options];
        next[index] = value;
        setOptions(next);
    };

    const handleCreatePoll = (e) => {
        e.preventDefault();
        const validOptions = options.map((o) => o.trim()).filter(Boolean);
        if (!question.trim()) {
            toast.error('Please enter a poll question');
            return;
        }
        if (validOptions.length < 2) {
            toast.error('Provide at least 2 non-empty options');
            return;
        }

        const newPoll = {
            id: Date.now(),
            question: question.trim(),
            options: validOptions.map((opt, i) => ({ id: i, text: opt, votes: 0 })),
            totalVotes: 0,
            createdBy: userName || 'Teacher',
            isAnonymous,
            duration,
        };

        setActivePoll(newPoll);
        setTimeLeft(duration);
        setUserVoted(false);
        setSelectedOption(null);
        toast.success('Live poll broadcasted to class!');
    };

    const handleVote = (optionId) => {
        if (userVoted || timeLeft <= 0) return;

        setActivePoll((prev) => {
            if (!prev) return null;
            const updatedOpts = prev.options.map((opt) =>
                opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
            );
            return { ...prev, options: updatedOpts, totalVotes: prev.totalVotes + 1 };
        });

        setSelectedOption(optionId);
        setUserVoted(true);
        toast.success('Your vote has been recorded!');
    };

    const handleEndPoll = () => {
        setTimeLeft(0);
        toast('Poll manually concluded.', { icon: '🛑' });
    };

    const handleResetPoll = () => {
        setActivePoll(null);
        setQuestion('');
        setOptions(['', '']);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-60 flex items-center justify-center p-4">
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100">
                {/* Header */}
                <div className="bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-4 text-white flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">📊</span>
                        <div>
                            <h2 className="text-lg font-bold">Classroom Live Polls</h2>
                            <p className="text-xs text-teal-100">Real-time instant quiz & concept check</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-teal-200 hover:text-white text-lg font-bold">
                        ✕
                    </button>
                </div>

                <div className="p-6">
                    {/* Active Poll View */}
                    {activePoll ? (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between border-b pb-3">
                                <div>
                                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-teal-100 text-teal-800">
                                        {timeLeft > 0 ? 'LIVE NOW' : 'ENDED'}
                                    </span>
                                    <span className="text-xs text-gray-500 ml-2">By {activePoll.createdBy}</span>
                                </div>
                                <div className="text-sm font-mono font-bold text-gray-700 flex items-center gap-1">
                                    <span>⏱️</span>
                                    <span>{timeLeft}s</span>
                                </div>
                            </div>

                            <h3 className="text-base font-bold text-gray-900 leading-snug">{activePoll.question}</h3>

                            {/* Options with percentages */}
                            <div className="space-y-2.5 pt-2">
                                {activePoll.options.map((opt) => {
                                    const percent = activePoll.totalVotes > 0 ? Math.round((opt.votes / activePoll.totalVotes) * 100) : 0;
                                    const isSelected = selectedOption === opt.id;

                                    return (
                                        <div
                                            key={opt.id}
                                            onClick={() => !userVoted && timeLeft > 0 && handleVote(opt.id)}
                                            className={`relative overflow-hidden rounded-xl border p-3 cursor-pointer transition-all ${
                                                isSelected ? 'border-teal-500 ring-2 ring-teal-200 bg-teal-50' : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                                            }`}
                                        >
                                            {/* Progress Fill */}
                                            <div
                                                className="absolute left-0 top-0 bottom-0 bg-teal-100 opacity-60 transition-all duration-500"
                                                style={{ width: `${percent}%` }}
                                            />

                                            <div className="relative flex items-center justify-between text-sm">
                                                <span className="font-medium text-gray-800">{opt.text}</span>
                                                <div className="text-xs font-semibold text-gray-600 flex items-center gap-2">
                                                    <span>{opt.votes} votes</span>
                                                    <span className="text-teal-700 bg-white px-2 py-0.5 rounded-full shadow-sm">{percent}%</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <p className="text-xs text-gray-500 text-right">
                                Total Submissions: <b>{activePoll.totalVotes}</b> {activePoll.isAnonymous && '(Anonymous)'}
                            </p>

                            {/* Teacher controls */}
                            <div className="flex gap-2 pt-3 border-t">
                                {isTeacher && timeLeft > 0 && (
                                    <button onClick={handleEndPoll} className="flex-1 py-2 text-xs bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold">
                                        End Poll Early
                                    </button>
                                )}
                                {isTeacher && (
                                    <button onClick={handleResetPoll} className="flex-1 py-2 text-xs bg-gray-700 hover:bg-gray-800 text-white rounded-lg font-semibold">
                                        Create Another Poll
                                    </button>
                                )}
                                <button onClick={onClose} className="px-4 py-2 text-xs border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                                    Close Window
                                </button>
                            </div>
                        </div>
                    ) : isTeacher ? (
                        /* Teacher Poll Creator Form */
                        <form onSubmit={handleCreatePoll} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Poll / Quiz Question</label>
                                <textarea
                                    value={question}
                                    onChange={(e) => setQuestion(e.target.value)}
                                    placeholder="e.g. Which layer of the OSI model does TCP operate on?"
                                    rows={2}
                                    className="w-full text-sm border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-xs font-semibold text-gray-700">Answer Choices</label>
                                {options.map((opt, idx) => (
                                    <div key={idx} className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-gray-400 w-4">{String.fromCharCode(65 + idx)}.</span>
                                        <input
                                            type="text"
                                            value={opt}
                                            onChange={(e) => handleOptionChange(idx, e.target.value)}
                                            placeholder={`Option ${idx + 1}`}
                                            className="flex-1 text-sm border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                        />
                                    </div>
                                ))}
                                {options.length < 5 && (
                                    <button type="button" onClick={handleAddOption} className="text-xs text-teal-600 font-semibold hover:underline mt-1">
                                        + Add Choice
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-3 pt-2">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">Time Limit</label>
                                    <select
                                        value={duration}
                                        onChange={(e) => setDuration(Number(e.target.value))}
                                        className="w-full text-xs border border-gray-200 rounded-lg p-2 bg-white"
                                    >
                                        <option value={30}>30 Seconds</option>
                                        <option value={60}>60 Seconds</option>
                                        <option value={120}>2 Minutes</option>
                                    </select>
                                </div>
                                <div className="flex items-center pt-5">
                                    <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={isAnonymous}
                                            onChange={(e) => setIsAnonymous(e.target.checked)}
                                            className="rounded text-teal-600 focus:ring-teal-500"
                                        />
                                        Anonymous Responses
                                    </label>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm py-2.5 rounded-xl transition duration-200 shadow-md"
                            >
                                Launch Poll to Students
                            </button>
                        </form>
                    ) : (
                        /* Student No Poll State */
                        <div className="text-center py-8">
                            <span className="text-4xl block mb-2">⏳</span>
                            <h4 className="text-sm font-semibold text-gray-800">No active poll right now</h4>
                            <p className="text-xs text-gray-500 mt-1">When your teacher launches a poll or quiz, it will appear here instantly.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClassroomPoll;
