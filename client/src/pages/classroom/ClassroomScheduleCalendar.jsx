import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

const ClassroomScheduleCalendar = ({ onJoinClass }) => {
    const [selectedDay, setSelectedDay] = useState('Wednesday');

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const timetable = {
        Monday: [
            { id: 101, title: 'Computer Networks', code: 'CS-501', time: '10:00 AM - 11:00 AM', teacher: 'Prof. Ramesh Sharma', room: 'CN-101', status: 'completed' },
            { id: 102, title: 'Database Management Systems', code: 'CS-502', time: '11:30 AM - 12:30 PM', teacher: 'Dr. Swati Mehra', room: 'DB-204', status: 'completed' }
        ],
        Tuesday: [
            { id: 201, title: 'Operating Systems & Scheduling', code: 'CS-503', time: '10:00 AM - 11:00 AM', teacher: 'Prof. Arvind Yadav', room: 'OS-302', status: 'completed' },
            { id: 202, title: 'Theory of Computation', code: 'CS-504', time: '02:00 PM - 03:00 PM', teacher: 'Dr. Swati Mehra', room: 'TOC-105', status: 'completed' }
        ],
        Wednesday: [
            { id: 301, title: 'Computer Networks (Live Routing Lab)', code: 'CS-501', time: '10:00 AM - 11:00 AM', teacher: 'Prof. Ramesh Sharma', room: 'CN-101', status: 'live' },
            { id: 302, title: 'Software Engineering & Agile', code: 'CS-505', time: '12:00 PM - 01:00 PM', teacher: 'Prof. Neha Gupta', room: 'SE-401', status: 'upcoming' },
            { id: 303, title: 'AI & Machine Learning Foundations', code: 'CS-506', time: '03:00 PM - 04:00 PM', teacher: 'Dr. Manish Regar', room: 'AI-Lab', status: 'upcoming' }
        ],
        Thursday: [
            { id: 401, title: 'Web Development & Fullstack', code: 'CS-507', time: '10:00 AM - 11:00 AM', teacher: 'Er. Kunal Saukhiya', room: 'WEB-301', status: 'upcoming' },
            { id: 402, title: 'Compiler Design', code: 'CS-508', time: '01:30 PM - 02:30 PM', teacher: 'Prof. Arvind Yadav', room: 'CD-202', status: 'upcoming' }
        ],
        Friday: [
            { id: 501, title: 'Cyber Security & Network Defense', code: 'CS-509', time: '11:00 AM - 12:00 PM', teacher: 'Prof. Ramesh Sharma', room: 'CY-501', status: 'upcoming' },
            { id: 502, title: 'Project Work & Review (Group 39)', code: 'PRJ-39', time: '02:00 PM - 04:00 PM', teacher: 'Mentor Swati', room: 'PRJ-RM', status: 'upcoming' }
        ],
        Saturday: [
            { id: 601, title: 'Rural Student Remedial & Doubt Session', code: 'REM-01', time: '10:30 AM - 12:00 PM', teacher: 'Faculty Panel', room: 'REM-VLG', status: 'upcoming' }
        ]
    };

    const handleSendSMSAlert = (classItem) => {
        toast.success(`SMS Reminder scheduled for ${classItem.title} via rural gateway!`);
    };

    const currentClasses = timetable[selectedDay] || [];

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-5 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                    <h3 className="text-base font-bold flex items-center gap-2">
                        <span>📅</span>
                        <span>Weekly Live Class Timetable & Schedule</span>
                    </h3>
                    <p className="text-xs text-gray-400">Classroom Schedule for CSE Section C — SKIT Jaipur</p>
                </div>
                <div className="flex items-center gap-2 text-xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-emerald-300 font-semibold">Active Term: Odd Sem 2026</span>
                </div>
            </div>

            {/* Days Tabs */}
            <div className="flex overflow-x-auto border-b border-gray-200 bg-gray-50 text-xs font-semibold">
                {days.map((day) => (
                    <button
                        key={day}
                        onClick={() => setSelectedDay(day)}
                        className={`flex-1 min-w-[90px] py-3 text-center border-b-2 transition ${
                            selectedDay === day
                                ? 'border-teal-600 text-teal-700 bg-white font-bold'
                                : 'border-transparent text-gray-500 hover:text-gray-800'
                        }`}
                    >
                        {day}
                    </button>
                ))}
            </div>

            {/* Timetable Cards */}
            <div className="p-5 space-y-3">
                {currentClasses.map((item) => (
                    <div
                        key={item.id}
                        className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                            item.status === 'live'
                                ? 'border-teal-500 bg-teal-50/40 shadow-sm ring-1 ring-teal-200'
                                : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                    >
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                {item.status === 'live' && (
                                    <span className="text-[10px] bg-red-600 text-white font-bold px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                                        ● LIVE NOW
                                    </span>
                                )}
                                <span className="text-xs font-bold text-gray-500 uppercase">{item.code}</span>
                                <h4 className="text-sm font-bold text-gray-900">{item.title}</h4>
                            </div>
                            <div className="text-xs text-gray-500 flex flex-wrap items-center gap-3">
                                <span>🕒 {item.time}</span>
                                <span>•</span>
                                <span>👨‍🏫 {item.teacher}</span>
                                <span>•</span>
                                <span>🚪 Room: {item.room}</span>
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handleSendSMSAlert(item)}
                                className="text-xs text-gray-600 hover:text-teal-700 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg font-medium transition"
                                title="Get SMS reminder on feature phones"
                            >
                                📲 SMS Alert
                            </button>

                            {item.status === 'live' ? (
                                <button
                                    onClick={() => onJoinClass && onJoinClass(item.room)}
                                    className="text-xs bg-teal-600 hover:bg-teal-700 text-white font-bold px-4 py-2 rounded-lg shadow-md transition flex items-center gap-1.5"
                                >
                                    <span>🎥</span>
                                    <span>Join Class</span>
                                </button>
                            ) : (
                                <span className="text-xs text-gray-400 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 font-medium capitalize">
                                    {item.status}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ClassroomScheduleCalendar;
