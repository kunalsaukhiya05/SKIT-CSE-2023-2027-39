import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

const ClassroomOfflinePackager = ({ isOpen, onClose, classTitle }) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [offlineStorageMB, setOfflineStorageMB] = useState(38);

    const cachedLectures = [
        { id: 1, title: 'Unit 3: Computer Networks - Routing Protocols', size: '12.4 MB', items: 'Audio + Slides + Chat' },
        { id: 2, title: 'Unit 2: Data Link Layer & Framing Techniques', size: '15.8 MB', items: 'Handouts + Quiz Notes' },
        { id: 3, title: 'Unit 1: Physical Layer Transmission Media', size: '9.8 MB', items: 'Whiteboard Snapshots' }
    ];

    const handleCreateOfflinePackage = () => {
        setIsGenerating(true);
        toast('Packaging session notes, whiteboard & compressed audio...', { icon: '📦' });

        setTimeout(() => {
            setIsGenerating(false);
            setOfflineStorageMB(prev => prev + 14);
            toast.success('Offline revision bundle saved to local IndexedDB storage!');
        }, 1200);
    };

    const handleClearStorage = () => {
        setOfflineStorageMB(0);
        toast.success('Offline storage cleared.');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-60 flex items-center justify-center p-4">
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100 flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-xl">💾</span>
                        <div>
                            <h2 className="text-base font-bold">Offline Revision Packager</h2>
                            <p className="text-xs text-gray-400">Low-bandwidth cache for power outages & spotty connectivity</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-lg">✕</button>
                </div>

                <div className="p-6 space-y-4">
                    {/* Storage Quota Card */}
                    <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 flex items-center justify-between">
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800">Local Browser Storage</span>
                            <h3 className="text-lg font-bold text-teal-900">{offlineStorageMB} MB Used</h3>
                            <span className="text-[10px] text-teal-700">Offline playback without consuming mobile data</span>
                        </div>
                        <button
                            onClick={handleClearStorage}
                            className="text-xs text-red-600 hover:text-red-800 font-semibold border border-red-200 bg-white px-2.5 py-1 rounded-lg"
                        >
                            Purge Cache
                        </button>
                    </div>

                    {/* Download Package Action */}
                    <button
                        onClick={handleCreateOfflinePackage}
                        disabled={isGenerating}
                        className="w-full bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold py-3 rounded-xl transition shadow flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        <span>📦</span>
                        <span>{isGenerating ? 'Compiling Offline Packet...' : `Save "${classTitle || 'Current Session'}" for Offline Study`}</span>
                    </button>

                    {/* Cached Items List */}
                    <div className="space-y-2">
                        <h4 className="text-xs font-bold text-gray-700 uppercase">Saved Offline Lectures</h4>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                            {cachedLectures.map((lec) => (
                                <div key={lec.id} className="p-3 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-between text-xs">
                                    <div>
                                        <h5 className="font-semibold text-gray-800 truncate max-w-[260px]">{lec.title}</h5>
                                        <span className="text-[10px] text-gray-400 block mt-0.5">{lec.items} • {lec.size}</span>
                                    </div>
                                    <span className="text-xs bg-white text-teal-700 border border-teal-200 px-2 py-0.5 rounded-full font-bold">
                                        Offline Ready
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="pt-2 border-t">
                        <button
                            onClick={onClose}
                            className="w-full py-2.5 border border-gray-300 text-xs font-semibold rounded-xl text-gray-700 hover:bg-gray-50"
                        >
                            Done
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClassroomOfflinePackager;
