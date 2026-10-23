import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

const ClassroomFeedbackAnalytics = ({ isOpen, onClose, classTitle }) => {
    const [selectedMetric, setSelectedMetric] = useState('overview');

    const analyticsData = {
        totalStudents: 42,
        attendanceRate: 90.5,
        avgRating: 4.6,
        avgLatencyMs: 135,
        packetLossPct: 1.8,
        dataSavedTotalMB: 4850,
        ratings: { 5: 22, 4: 12, 3: 3, 2: 1, 1: 0 },
        networkTypes: [
            { type: '3G Cellular (Rural)', count: 18, pct: 43 },
            { type: '4G Mobile Hotspot', count: 16, pct: 38 },
            { type: 'College / Home WiFi', count: 8, pct: 19 }
        ],
        topQuestions: [
            { text: 'Dijkstra vs Bellman-Ford complexity differences', count: 7, resolved: true },
            { text: 'Subnet mask calculation for class B network', count: 5, resolved: true },
            { text: 'Sliding window buffer overflow handling', count: 3, resolved: false }
        ]
    };

    const handleExportCSV = () => {
        const header = "Metric,Value\n";
        const rows = [
            `Class Title,"${classTitle || 'Computer Networks'}"`,
            `Total Enrolled,${analyticsData.totalStudents}`,
            `Attendance Rate,${analyticsData.attendanceRate}%`,
            `Average Quality Rating,${analyticsData.avgRating}/5`,
            `Average Network Latency,${analyticsData.avgLatencyMs} ms`,
            `Estimated Data Saved,${analyticsData.dataSavedTotalMB} MB`
        ].join('\n');

        const blob = new Blob([header + rows], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `session-analytics-${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Session analytics report exported!');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-60 flex items-center justify-center p-4">
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white px-6 py-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-base font-bold flex items-center gap-2">
                            <span>📈</span>
                            <span>Session Feedback & Rural Network Analytics</span>
                        </h2>
                        <p className="text-xs text-gray-400">{classTitle || 'Live Lecture Performance Report'}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-lg">✕</button>
                </div>

                <div className="p-6 space-y-5 overflow-y-auto">
                    {/* Top Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                        <div className="bg-gray-50 border border-gray-200 p-3 rounded-xl">
                            <span className="text-xs text-gray-500 block">Attendance</span>
                            <span className="text-lg font-bold text-teal-700">{analyticsData.attendanceRate}%</span>
                            <span className="text-[10px] text-gray-400 block">38 / 42 Students</span>
                        </div>
                        <div className="bg-gray-50 border border-gray-200 p-3 rounded-xl">
                            <span className="text-xs text-gray-500 block">Quality Rating</span>
                            <span className="text-lg font-bold text-amber-500">★ {analyticsData.avgRating}</span>
                            <span className="text-[10px] text-gray-400 block">38 Reviews</span>
                        </div>
                        <div className="bg-gray-50 border border-gray-200 p-3 rounded-xl">
                            <span className="text-xs text-gray-500 block">Avg RTT Latency</span>
                            <span className="text-lg font-bold text-emerald-600">{analyticsData.avgLatencyMs} ms</span>
                            <span className="text-[10px] text-gray-400 block">Stable 2G/3G nodes</span>
                        </div>
                        <div className="bg-gray-50 border border-gray-200 p-3 rounded-xl">
                            <span className="text-xs text-gray-500 block">Bandwidth Saved</span>
                            <span className="text-lg font-bold text-teal-800">4.8 GB</span>
                            <span className="text-[10px] text-gray-400 block">Rural audio-first mode</span>
                        </div>
                    </div>

                    {/* Network Distribution */}
                    <div className="bg-white border border-gray-200 rounded-xl p-4">
                        <h4 className="text-xs font-bold text-gray-700 uppercase mb-3">Student Connectivity Distribution</h4>
                        <div className="space-y-2">
                            {analyticsData.networkTypes.map((net) => (
                                <div key={net.type} className="space-y-1">
                                    <div className="flex justify-between text-xs text-gray-600">
                                        <span>{net.type}</span>
                                        <span className="font-semibold">{net.count} students ({net.pct}%)</span>
                                    </div>
                                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                        <div
                                            className="bg-teal-600 h-full rounded-full transition-all duration-500"
                                            style={{ width: `${net.pct}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Question Doubts Summary */}
                    <div className="bg-white border border-gray-200 rounded-xl p-4">
                        <h4 className="text-xs font-bold text-gray-700 uppercase mb-2">Most Upvoted In-Class Doubts</h4>
                        <div className="space-y-2">
                            {analyticsData.topQuestions.map((q, idx) => (
                                <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-lg bg-gray-50 border border-gray-100">
                                    <span className="text-gray-800 truncate max-w-[380px]">{q.text}</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-500 font-semibold">{q.count} upvotes</span>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                                            q.resolved ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                                        }`}>
                                            {q.resolved ? 'Resolved' : 'Pending'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-3 border-t">
                        <button
                            onClick={handleExportCSV}
                            className="text-xs bg-teal-600 hover:bg-teal-700 text-white font-semibold px-4 py-2 rounded-lg transition flex items-center gap-1.5"
                        >
                            <span>📊</span>
                            <span>Export Full Report (CSV)</span>
                        </button>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-xs border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClassroomFeedbackAnalytics;
