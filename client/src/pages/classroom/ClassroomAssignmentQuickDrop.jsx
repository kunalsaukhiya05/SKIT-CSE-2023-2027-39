import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

const ClassroomAssignmentQuickDrop = ({ isOpen, onClose, role, classTitle }) => {
    const isTeacher = role === 'teacher';

    const [exercises, setExercises] = useState([
        {
            id: 1,
            title: 'Quick Exercise: Calculate Subnet Range for 192.168.10.0/26',
            dueInMinutes: 15,
            points: 10,
            submittedCount: 28,
            totalStudents: 38,
            isClosed: false
        }
    ]);

    const [selectedFile, setSelectedFile] = useState(null);
    const [compressing, setCompressing] = useState(false);
    const [compressedSize, setCompressedSize] = useState(null);

    // Form for teacher to create quick exercise
    const [newTitle, setNewTitle] = useState('');
    const [newMinutes, setNewMinutes] = useState(15);
    const [newPoints, setNewPoints] = useState(10);
    const [showCreateForm, setShowCreateForm] = useState(false);

    const handleCreateExercise = (e) => {
        e.preventDefault();
        if (!newTitle.trim()) {
            toast.error('Please enter the exercise problem description');
            return;
        }

        const newEx = {
            id: Date.now(),
            title: newTitle.trim(),
            dueInMinutes: newMinutes,
            points: newPoints,
            submittedCount: 0,
            totalStudents: 38,
            isClosed: false
        };

        setExercises([newEx, ...exercises]);
        setNewTitle('');
        setShowCreateForm(false);
        toast.success('Live classroom quick exercise assigned!');
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setSelectedFile(file);
        setCompressing(true);

        // Simulate client-side WebAssembly image compression for rural network
        setTimeout(() => {
            setCompressing(false);
            setCompressedSize('142 KB (Compressed from 3.2 MB)');
            toast.success('Image optimized for 2G network upload!');
        }, 800);
    };

    const handleStudentSubmit = () => {
        if (!selectedFile) {
            toast.error('Please select or photograph your answer sheet');
            return;
        }
        toast.success('Exercise solution submitted successfully!');
        setSelectedFile(null);
        setCompressedSize(null);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black bg-opacity-50 flex justify-end">
            <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col">
                {/* Header */}
                <div className="bg-gray-800 text-white p-4 flex items-center justify-between border-b border-gray-700">
                    <div className="flex items-center gap-2">
                        <span className="text-xl">📝</span>
                        <div>
                            <h3 className="text-sm font-bold">Classroom Quick Exercise Drop</h3>
                            <p className="text-xs text-gray-400">{classTitle || 'Live In-Class Problem Sets'}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-white">✕</button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {/* Teacher Create Button */}
                    {isTeacher && (
                        <div>
                            <button
                                onClick={() => setShowCreateForm(!showCreateForm)}
                                className="w-full bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold py-2.5 rounded-xl transition shadow-sm"
                            >
                                {showCreateForm ? 'Cancel Creation' : '+ Create Live 15-Minute Problem Set'}
                            </button>

                            {showCreateForm && (
                                <form onSubmit={handleCreateExercise} className="mt-3 p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">Exercise Problem</label>
                                        <textarea
                                            value={newTitle}
                                            onChange={(e) => setNewTitle(e.target.value)}
                                            placeholder="Write problem or formula for students to solve on notebook..."
                                            rows={2}
                                            className="w-full text-xs border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-700 mb-1">Time Limit</label>
                                            <select
                                                value={newMinutes}
                                                onChange={(e) => setNewMinutes(Number(e.target.value))}
                                                className="w-full text-xs border border-gray-300 rounded-lg p-2 bg-white"
                                            >
                                                <option value={10}>10 Minutes</option>
                                                <option value={15}>15 Minutes</option>
                                                <option value={20}>20 Minutes</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-700 mb-1">Marks</label>
                                            <input
                                                type="number"
                                                value={newPoints}
                                                onChange={(e) => setNewPoints(Number(e.target.value))}
                                                className="w-full text-xs border border-gray-300 rounded-lg p-2"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full bg-gray-800 hover:bg-gray-900 text-white text-xs font-semibold py-2 rounded-lg"
                                    >
                                        Publish to Class
                                    </button>
                                </form>
                            )}
                        </div>
                    )}

                    {/* Exercises List */}
                    {exercises.map((ex) => (
                        <div key={ex.id} className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm space-y-3">
                            <div className="flex items-start justify-between gap-2">
                                <h4 className="text-xs font-bold text-gray-900 leading-snug">{ex.title}</h4>
                                <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded-full shrink-0">
                                    {ex.points} Marks
                                </span>
                            </div>

                            <div className="flex items-center gap-3 text-xs text-gray-500">
                                <span>⏱️ {ex.dueInMinutes} mins allocated</span>
                                <span>•</span>
                                <span>📥 {ex.submittedCount} / {ex.totalStudents} Submitted</span>
                            </div>

                            {/* Student Submission Card */}
                            {!isTeacher && (
                                <div className="pt-2 border-t border-gray-100 space-y-2">
                                    <label className="block text-xs font-semibold text-gray-700">Submit Photo of Handwritten Solution</label>
                                    <input
                                        type="file"
                                        accept="image/*,.pdf"
                                        onChange={handleFileSelect}
                                        className="text-xs file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 cursor-pointer"
                                    />

                                    {compressing && (
                                        <p className="text-[11px] text-teal-600 animate-pulse">⚙️ Compressing image for rural upload...</p>
                                    )}

                                    {compressedSize && (
                                        <p className="text-[11px] text-emerald-600 font-medium">✓ {compressedSize}</p>
                                    )}

                                    <button
                                        onClick={handleStudentSubmit}
                                        className="w-full bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold py-2 rounded-lg transition"
                                    >
                                        Upload & Submit Solution
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ClassroomAssignmentQuickDrop;
