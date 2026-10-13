import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

const LiveAttendanceModal = ({ isOpen, onClose, classTitle }) => {
    const [students, setStudents] = useState([
        { id: 1, name: 'Aarav Sharma', roll: '23CS001', status: 'present', joinTime: '10:02 AM' },
        { id: 2, name: 'Bhavna Meena', roll: '23CS008', status: 'present', joinTime: '10:05 AM' },
        { id: 3, name: 'Chetan Verma', roll: '23CS014', status: 'late', joinTime: '10:22 AM' },
        { id: 4, name: 'Divya Soni', roll: '23CS021', status: 'present', joinTime: '10:01 AM' },
        { id: 5, name: 'Govind Jat', roll: '23CS035', status: 'absent', joinTime: '-' },
        { id: 6, name: 'Hemant Choudhary', roll: '23CS042', status: 'present', joinTime: '10:04 AM' },
        { id: 7, name: 'Kavita Rawat', roll: '23CS053', status: 'absent', joinTime: '-' },
    ]);

    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');

    const setStatus = (id, newStatus) => {
        setStudents((prev) =>
            prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
        );
    };

    const handleMarkAllPresent = () => {
        setStudents((prev) => prev.map((s) => ({ ...s, status: 'present' })));
        toast.success('All students marked as Present');
    };

    const handleExportCSV = () => {
        const header = 'Roll No,Student Name,Status,Join Time\n';
        const rows = students.map((s) => `${s.roll},"${s.name}",${s.status.toUpperCase()},${s.joinTime}`).join('\n');
        const blob = new Blob([header + rows], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `attendance-${classTitle || 'class'}-${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Attendance CSV exported successfully!');
    };

    const presentCount = students.filter((s) => s.status === 'present').length;
    const lateCount = students.filter((s) => s.status === 'late').length;
    const absentCount = students.filter((s) => s.status === 'absent').length;
    const attendancePct = Math.round(((presentCount + lateCount) / students.length) * 100);

    const filtered = students.filter((s) => {
        const matchesFilter = filter === 'all' || s.status === filter;
        const matchesSearch = !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.roll.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-60 flex items-center justify-center p-4">
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[85vh]">
                {/* Header */}
                <div className="bg-gray-800 text-white px-6 py-4 flex items-center justify-between border-b border-gray-700">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">📋</span>
                        <div>
                            <h2 className="text-base font-bold">Live Classroom Attendance</h2>
                            <p className="text-xs text-gray-400">Automated roll-call for {classTitle || 'Remote Session'}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-white">
                        ✕
                    </button>
                </div>

                {/* Stats Bar */}
                <div className="grid grid-cols-4 gap-2 p-4 bg-gray-50 border-b text-center">
                    <div className="bg-white p-2 rounded-lg border shadow-sm">
                        <span className="text-xs text-gray-500 block">Total</span>
                        <span className="text-base font-bold text-gray-800">{students.length}</span>
                    </div>
                    <div className="bg-white p-2 rounded-lg border shadow-sm">
                        <span className="text-xs text-green-600 block">Present</span>
                        <span className="text-base font-bold text-green-700">{presentCount}</span>
                    </div>
                    <div className="bg-white p-2 rounded-lg border shadow-sm">
                        <span className="text-xs text-amber-600 block">Late</span>
                        <span className="text-base font-bold text-amber-700">{lateCount}</span>
                    </div>
                    <div className="bg-white p-2 rounded-lg border shadow-sm">
                        <span className="text-xs text-red-600 block">Absent</span>
                        <span className="text-base font-bold text-red-700">{absentCount}</span>
                    </div>
                </div>

                {/* Filter and Actions Bar */}
                <div className="p-4 border-b flex flex-col sm:flex-row gap-2 justify-between items-center">
                    <input
                        type="text"
                        placeholder="Search student or roll no..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full sm:w-64 text-xs border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    />

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button
                            onClick={handleMarkAllPresent}
                            className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-3 py-1.5 rounded-lg transition"
                        >
                            Mark All Present
                        </button>
                        <button
                            onClick={handleExportCSV}
                            className="text-xs bg-teal-600 hover:bg-teal-700 text-white font-semibold px-3 py-1.5 rounded-lg transition"
                        >
                            Export CSV
                        </button>
                    </div>
                </div>

                {/* Students Table */}
                <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
                    {filtered.map((s) => (
                        <div key={s.id} className="p-3.5 flex items-center justify-between hover:bg-gray-50 text-sm">
                            <div>
                                <span className="font-semibold text-gray-800">{s.name}</span>
                                <span className="text-xs text-gray-400 ml-2">({s.roll})</span>
                                <span className="text-[11px] text-gray-500 block">Joined: {s.joinTime}</span>
                            </div>

                            <div className="flex items-center gap-1.5">
                                <button
                                    onClick={() => setStatus(s.id, 'present')}
                                    className={`px-2.5 py-1 text-xs rounded-md font-semibold transition ${
                                        s.status === 'present' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    P
                                </button>
                                <button
                                    onClick={() => setStatus(s.id, 'late')}
                                    className={`px-2.5 py-1 text-xs rounded-md font-semibold transition ${
                                        s.status === 'late' ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    L
                                </button>
                                <button
                                    onClick={() => setStatus(s.id, 'absent')}
                                    className={`px-2.5 py-1 text-xs rounded-md font-semibold transition ${
                                        s.status === 'absent' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    A
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="p-4 bg-gray-50 border-t flex justify-between items-center text-xs">
                    <span className="font-semibold text-gray-600">Overall Attendance Rate: {attendancePct}%</span>
                    <button onClick={onClose} className="px-4 py-1.5 bg-gray-700 text-white rounded-lg hover:bg-gray-800">
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LiveAttendanceModal;
