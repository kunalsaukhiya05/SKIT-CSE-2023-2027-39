import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const BreakoutRoomsModal = ({ isOpen, onClose }) => {
    const [numRooms, setNumRooms] = useState(3);
    const [durationMinutes, setDurationMinutes] = useState(10);
    const [isBreakoutActive, setIsBreakoutActive] = useState(false);
    const [timeLeftSeconds, setTimeLeftSeconds] = useState(600);
    const [broadcastMessage, setBroadcastMessage] = useState('');

    const [rooms, setRooms] = useState([
        {
            id: 1,
            name: 'Group 1 - Network Layer Routing',
            members: ['Aarav Sharma', 'Divya Soni', 'Hemant Choudhary']
        },
        {
            id: 2,
            name: 'Group 2 - Congestion Control & TCP',
            members: ['Bhavna Meena', 'Chetan Verma', 'Govind Jat']
        },
        {
            id: 3,
            name: 'Group 3 - Subnetting & IP Addressing',
            members: ['Kavita Rawat', 'Mohit Saini', 'Neha Sharma']
        }
    ]);

    useEffect(() => {
        if (!isBreakoutActive || timeLeftSeconds <= 0) return;
        const interval = setInterval(() => {
            setTimeLeftSeconds(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    setIsBreakoutActive(false);
                    toast.success('Breakout time expired. Students recalled to main room!');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [isBreakoutActive, timeLeftSeconds]);

    const handleStartBreakout = () => {
        setIsBreakoutActive(true);
        setTimeLeftSeconds(durationMinutes * 60);
        toast.success(`Launched ${rooms.length} breakout rooms for ${durationMinutes} minutes!`);
    };

    const handleRecallAll = () => {
        setIsBreakoutActive(false);
        setTimeLeftSeconds(0);
        toast('All participants recalled to main classroom session.', { icon: '📣' });
    };

    const handleBroadcast = (e) => {
        e.preventDefault();
        if (!broadcastMessage.trim()) return;
        toast.success(`Broadcasted to all rooms: "${broadcastMessage}"`);
        setBroadcastMessage('');
    };

    const formatTime = (secs) => {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-60 flex items-center justify-center p-4">
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-100 flex flex-col">
                {/* Header */}
                <div className="bg-gray-800 text-white px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-xl">🔀</span>
                        <div>
                            <h2 className="text-base font-bold">Classroom Breakout Rooms</h2>
                            <p className="text-xs text-gray-400">Peer group discussions & problem solving</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-lg">✕</button>
                </div>

                <div className="p-6 space-y-5">
                    {/* Active Timer Banner */}
                    {isBreakoutActive ? (
                        <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 flex items-center justify-between">
                            <div>
                                <span className="text-xs font-bold text-teal-800 uppercase tracking-wide">Breakout Active</span>
                                <p className="text-xs text-teal-600">Students are in peer rooms</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-2xl font-mono font-bold text-teal-900">{formatTime(timeLeftSeconds)}</span>
                                <button
                                    onClick={handleRecallAll}
                                    className="text-xs bg-red-600 hover:bg-red-700 text-white font-semibold px-3 py-1.5 rounded-lg transition"
                                >
                                    End & Recall All
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* Setup Controls */
                        <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Number of Rooms</label>
                                <select
                                    value={numRooms}
                                    onChange={(e) => setNumRooms(Number(e.target.value))}
                                    className="w-full text-xs border border-gray-300 rounded-lg p-2 bg-white"
                                >
                                    <option value={2}>2 Rooms</option>
                                    <option value={3}>3 Rooms</option>
                                    <option value={4}>4 Rooms</option>
                                    <option value={5}>5 Rooms</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Duration</label>
                                <select
                                    value={durationMinutes}
                                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                                    className="w-full text-xs border border-gray-300 rounded-lg p-2 bg-white"
                                >
                                    <option value={5}>5 Minutes</option>
                                    <option value={10}>10 Minutes</option>
                                    <option value={15}>15 Minutes</option>
                                    <option value={20}>20 Minutes</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {/* Rooms List */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold text-gray-700 uppercase">Assigned Groups</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {rooms.slice(0, numRooms).map((room) => (
                                <div key={room.id} className="border border-gray-200 rounded-xl p-3 bg-gray-50/50">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-bold text-gray-800">{room.name}</span>
                                        <span className="text-[10px] bg-teal-100 text-teal-800 px-1.5 py-0.5 rounded-full font-semibold">
                                            {room.members.length}
                                        </span>
                                    </div>
                                    <ul className="space-y-1">
                                        {room.members.map((m, i) => (
                                            <li key={i} className="text-[11px] text-gray-600 flex items-center gap-1">
                                                <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                                                {m}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Teacher Broadcast Input */}
                    {isBreakoutActive && (
                        <form onSubmit={handleBroadcast} className="flex gap-2 pt-2 border-t">
                            <input
                                type="text"
                                placeholder="Broadcast message to all breakout rooms..."
                                value={broadcastMessage}
                                onChange={(e) => setBroadcastMessage(e.target.value)}
                                className="flex-1 text-xs border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                            />
                            <button
                                type="submit"
                                className="text-xs bg-gray-800 hover:bg-gray-900 text-white font-semibold px-3 py-2 rounded-lg"
                            >
                                Send Broadcast
                            </button>
                        </form>
                    )}

                    {/* Footer Actions */}
                    <div className="flex justify-between items-center pt-3 border-t">
                        <button onClick={onClose} className="px-4 py-2 text-xs border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                            Close
                        </button>
                        {!isBreakoutActive && (
                            <button
                                onClick={handleStartBreakout}
                                className="text-xs bg-teal-600 hover:bg-teal-700 text-white font-semibold px-5 py-2 rounded-lg shadow-sm transition"
                            >
                                Start Breakout Sessions
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BreakoutRoomsModal;
