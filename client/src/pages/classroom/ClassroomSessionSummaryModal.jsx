import React from 'react';
import { toast } from 'react-hot-toast';

const ClassroomSessionSummaryModal = ({ isOpen, onClose, onExitSession, classTitle, durationMinutes = 55 }) => {
    const handleDownloadAllBundle = () => {
        toast.success('Downloading compressed session bundle (Notes, Chat & Whiteboard snapshot)...');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-60 flex items-center justify-center p-4">
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100 flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-teal-700 to-emerald-700 text-white px-6 py-5 flex items-center justify-between">
                    <div>
                        <span className="text-xs uppercase font-bold tracking-wider text-teal-200">Session Completed</span>
                        <h2 className="text-lg font-bold">{classTitle || 'Computer Networks Lecture'}</h2>
                    </div>
                    <span className="text-3xl">🎓</span>
                </div>

                <div className="p-6 space-y-4">
                    {/* Summary Highlights Card */}
                    <div className="grid grid-cols-3 gap-2 bg-gray-50 p-3 rounded-xl border border-gray-200 text-center">
                        <div>
                            <span className="text-xs text-gray-500 block">Duration</span>
                            <span className="text-sm font-bold text-gray-800">{durationMinutes} mins</span>
                        </div>
                        <div>
                            <span className="text-xs text-gray-500 block">Attendance</span>
                            <span className="text-sm font-bold text-emerald-600">✓ Marked Present</span>
                        </div>
                        <div>
                            <span className="text-xs text-gray-500 block">Data Used</span>
                            <span className="text-sm font-bold text-teal-700">~42 MB</span>
                        </div>
                    </div>

                    {/* Resources Generated */}
                    <div className="space-y-2">
                        <h4 className="text-xs font-bold text-gray-700 uppercase">Session Artifacts Ready for Offline Study</h4>
                        <div className="border border-gray-200 rounded-xl divide-y text-xs">
                            <div className="p-2.5 flex items-center justify-between hover:bg-gray-50">
                                <span className="text-gray-700">📄 Lecture Whiteboard Drawings (PNG)</span>
                                <span className="text-teal-600 font-semibold cursor-pointer" onClick={() => toast.success('Saving Whiteboard PNG...')}>Save</span>
                            </div>
                            <div className="p-2.5 flex items-center justify-between hover:bg-gray-50">
                                <span className="text-gray-700">💬 Chat Q&A Transcript (TXT)</span>
                                <span className="text-teal-600 font-semibold cursor-pointer" onClick={() => toast.success('Saving Chat Log...')}>Save</span>
                            </div>
                            <div className="p-2.5 flex items-center justify-between hover:bg-gray-50">
                                <span className="text-gray-700">📚 Unit-3 Slide Notes Handout (PDF)</span>
                                <span className="text-teal-600 font-semibold cursor-pointer" onClick={() => toast.success('Saving Handout PDF...')}>Save</span>
                            </div>
                        </div>
                    </div>

                    {/* 1-Click Offline Bundle Download */}
                    <button
                        onClick={handleDownloadAllBundle}
                        className="w-full bg-teal-50 border border-teal-300 hover:bg-teal-100 text-teal-800 text-xs font-semibold py-2.5 rounded-xl transition flex items-center justify-center gap-2"
                    >
                        <span>📦</span>
                        <span>Download Complete Offline Revision Packet (ZIP ~1.8 MB)</span>
                    </button>

                    {/* Next Class Notice */}
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs flex items-center justify-between">
                        <div>
                            <span className="text-gray-500 block">Next Live Session:</span>
                            <span className="font-bold text-gray-800">Tomorrow at 10:00 AM — DBMS Lab</span>
                        </div>
                        <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded font-semibold">CS-502</span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2 border-t">
                        <button
                            onClick={onExitSession || onClose}
                            className="flex-1 bg-gray-800 hover:bg-gray-900 text-white text-xs font-semibold py-2.5 rounded-xl transition shadow"
                        >
                            Leave Classroom & Go to Dashboard
                        </button>
                        <button
                            onClick={onClose}
                            className="px-4 py-2.5 border border-gray-300 text-xs font-semibold rounded-xl text-gray-700 hover:bg-gray-50"
                        >
                            Stay in Room
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClassroomSessionSummaryModal;
