import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useClassroom } from '../../hooks/useClassroom';

const ClassroomDashboard = () => {
    const navigate = useNavigate();
    const student = useSelector((state) => state?.student?.student);
    const teacher = useSelector((state) => state?.teacher?.teacher);
    const isStudent = Boolean(student?._id);
    const isTeacher = Boolean(teacher?._id);
    const userName = student?.fullName || teacher?.fullName || 'User';

    const { classes, loading } = useClassroom();
    const [viewMode, setViewMode] = useState('grid');

    const enrolledClasses = classes.filter((cls) => {
        if (isStudent && cls.students) {
            return cls.students.some((s) => s === student?._id || s._id === student?._id);
        }
        if (isTeacher && cls.teacherId) {
            return cls.teacherId === teacher?._id;
        }
        return false;
    });

    const upcomingClasses = enrolledClasses
        .filter((cls) => cls.date && new Date(cls.date) >= new Date())
        .sort((a, b) => new Date(a.date) - new Date(b.date));

    const totalStudents = enrolledClasses.reduce((sum, cls) => sum + (cls.students?.length || 0), 0);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500 mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading your classrooms...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Banner */}
                <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-2xl p-6 md:p-8 mb-8 text-white shadow-lg">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <p className="text-teal-200 text-sm font-medium">{getGreeting()},</p>
                            <h1 className="text-2xl md:text-3xl font-bold mt-1">{userName}</h1>
                            <p className="text-teal-100 text-sm mt-2">
                                You have {upcomingClasses.length} upcoming class{upcomingClasses.length !== 1 ? 'es' : ''} scheduled
                            </p>
                        </div>
                        <div className="flex gap-3">
                            {isTeacher && (
                                <button onClick={() => navigate('/create-class')} className="inline-flex items-center gap-2 bg-white text-teal-700 px-5 py-2.5 rounded-xl font-semibold hover:bg-teal-50 transition-colors shadow-md">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" /></svg>
                                    New Class
                                </button>
                            )}
                            {isStudent && (
                                <button onClick={() => navigate('/classrooms')} className="inline-flex items-center gap-2 bg-white text-teal-700 px-5 py-2.5 rounded-xl font-semibold hover:bg-teal-50 transition-colors shadow-md">
                                    Browse Classes
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <StatCard icon="📚" label="My Classes" value={enrolledClasses.length} color="blue" />
                    <StatCard icon="📅" label="Upcoming" value={upcomingClasses.length} color="teal" />
                    <StatCard icon="👥" label="Total Students" value={totalStudents} color="purple" />
                    <StatCard icon="🎯" label="This Week" value={upcomingClasses.filter(c => { const d = new Date(c.date); const now = new Date(); const weekEnd = new Date(now); weekEnd.setDate(weekEnd.getDate() + 7); return d <= weekEnd; }).length} color="orange" />
                </div>

                {/* View Toggle + Section Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">My Classrooms</h2>
                    <div className="flex bg-gray-200 rounded-lg p-0.5">
                        <button onClick={() => setViewMode('grid')} className={px-3 py-1.5 rounded-md text-sm font-medium transition-colors  + String(viewMode === 'grid' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600')}>Grid</button>
                        <button onClick={() => setViewMode('list')} className={px-3 py-1.5 rounded-md text-sm font-medium transition-colors  + String(viewMode === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600')}>List</button>
                    </div>
                </div>

                {/* Classes Display */}
                {enrolledClasses.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                        <div className="text-6xl mb-4">🏫</div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">{isTeacher ? 'No Classes Created Yet' : 'No Enrolled Classes'}</h3>
                        <p className="text-gray-500 mb-6 max-w-md mx-auto">{isTeacher ? 'Create your first class to start teaching students remotely.' : 'Browse available classes and join one to start learning.'}</p>
                        <button onClick={() => navigate(isTeacher ? '/create-class' : '/classrooms')} className="bg-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-teal-700 transition-colors">{isTeacher ? 'Create First Class' : 'Browse Classes'}</button>
                    </div>
                ) : viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {enrolledClasses.map((cls) => (
                            <DashboardClassCard key={cls._id} cls={cls} onEnter={(roomId) => navigate('/classroom/' + roomId)} isTeacher={isTeacher} />
                        ))}
                    </div>
                ) : (
                    <div className="space-y-3">
                        {enrolledClasses.map((cls) => (
                            <DashboardClassRow key={cls._id} cls={cls} onEnter={(roomId) => navigate('/classroom/' + roomId)} isTeacher={isTeacher} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const StatCard = ({ icon, label, value, color }) => {
    const colorMap = {
        blue: 'bg-blue-50 text-blue-700',
        teal: 'bg-teal-50 text-teal-700',
        purple: 'bg-purple-50 text-purple-700',
        orange: 'bg-orange-50 text-orange-700'
    };
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center gap-3">
                <div className={w-10 h-10 rounded-lg flex items-center justify-center text-lg  + String(colorMap[color] || colorMap.blue)}>{icon}</div>
                <div>
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                    <p className="text-xs text-gray-500">{label}</p>
                </div>
            </div>
        </div>
    );
};

const DashboardClassCard = ({ cls, onEnter, isTeacher }) => {
    const classDate = cls.date ? new Date(cls.date) : null;
    const isLive = classDate && (new Date() - classDate) >= 0 && (new Date() - classDate) <= 7200000;
    const isPast = classDate && classDate < new Date() && !isLive;
    const formattedDate = classDate ? classDate.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : 'No date set';

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all overflow-hidden group">
            <div className={h-2  + String(isLive ? 'bg-green-500' : isPast ? 'bg-gray-300' : 'bg-teal-500')} />
            <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                    <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-gray-900 truncate">{cls.title || 'Untitled'}</h3>
                        <p className="text-sm text-gray-500 mt-0.5">{cls.subject || 'General'}</p>
                    </div>
                    {isLive && <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full animate-pulse flex-shrink-0">LIVE</span>}
                </div>
                <div className="space-y-1.5 mb-4 text-sm text-gray-500">
                    <div className="flex items-center gap-2"><span>📅</span><span>{formattedDate}</span></div>
                    <div className="flex items-center gap-2"><span>👥</span><span>{cls.students?.length || 0} students</span></div>
                    {cls.teacherName && <div className="flex items-center gap-2"><span>👨‍🏫</span><span>{cls.teacherName}</span></div>}
                </div>
                {cls.roomId && (
                    <button onClick={() => onEnter(cls.roomId)} className={w-full py-2.5 rounded-lg font-medium text-sm transition-colors  + String(isLive ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-teal-600 hover:bg-teal-700 text-white')}>
                        {isLive ? 'Join Live Class' : 'Enter Classroom'}
                    </button>
                )}
            </div>
        </div>
    );
};

const DashboardClassRow = ({ cls, onEnter, isTeacher }) => {
    const classDate = cls.date ? new Date(cls.date) : null;
    const isLive = classDate && (new Date() - classDate) >= 0 && (new Date() - classDate) <= 7200000;
    const formattedDate = classDate ? classDate.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : 'TBD';

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center gap-4 hover:shadow-md transition-all">
            <div className={w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0  + String(isLive ? 'bg-green-500' : 'bg-teal-500')}>
                {cls.title?.charAt(0)?.toUpperCase() || '?'}
            </div>
            <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{cls.title || 'Untitled'}</h3>
                <p className="text-sm text-gray-500">{cls.subject} | {formattedDate} | {cls.students?.length || 0} students</p>
            </div>
            {isLive && <span className="px-2.5 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full animate-pulse">LIVE</span>}
            {cls.roomId && (
                <button onClick={() => onEnter(cls.roomId)} className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors flex-shrink-0">Enter</button>
            )}
        </div>
    );
};

export default ClassroomDashboard;
