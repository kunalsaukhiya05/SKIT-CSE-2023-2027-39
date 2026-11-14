import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

const ClassroomInviteShareModal = ({
    isOpen,
    onClose,
    classTitle = 'Computer Networks - Unit 4',
    roomId = 'CS501-RM39',
    passcode = '482910'
}) => {
    const [requirePasscode, setRequirePasscode] = useState(true);
    const [expiryHours, setExpiryHours] = useState(2);
    const [activeTab, setActiveTab] = useState('link'); // link, sms, passcode

    if (!isOpen) return null;

    const joinUrl = `${window.location.origin}/classroom/${roomId}`;
    const smsTemplate = `GyaanSetu Live Class: "${classTitle}". Join at ${joinUrl} | Code: ${roomId}${
        requirePasscode ? ` | PIN: ${passcode}` : ''
    } (Valid ${expiryHours}h)`;

    const handleCopy = async (text, label) => {
        try {
            await navigator.clipboard.writeText(text);
            toast.success(`${label} copied to clipboard!`);
        } catch {
            toast.success(`${label} ready to share!`);
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-gray-200 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white px-6 py-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-base font-bold">Share Classroom Invite</h2>
                        <p className="text-xs text-gray-300 truncate max-w-xs">{classTitle}</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-300 hover:text-white text-sm font-bold px-2 py-1 rounded hover:bg-gray-700"
                    >
                        Close
                    </button>
                </div>

                {/* Format Tabs */}
                <div className="flex border-b bg-gray-50 text-xs font-semibold">
                    {[
                        { id: 'link', label: 'Meeting Link' },
                        { id: 'sms', label: 'Low-Data SMS / WhatsApp' },
                        { id: 'passcode', label: 'Security & PIN' }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 py-2.5 transition border-b-2 ${
                                activeTab === tab.id
                                    ? 'border-teal-600 text-teal-700 bg-white'
                                    : 'border-transparent text-gray-500 hover:text-gray-800'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="p-6 space-y-4">
                    {activeTab === 'link' && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Direct Classroom URL</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        readOnly
                                        value={joinUrl}
                                        className="flex-1 text-xs border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 text-gray-700 font-mono"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleCopy(joinUrl, 'Classroom URL')}
                                        className="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg transition"
                                    >
                                        Copy Link
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">
                                    <span className="text-[11px] text-gray-500 block">Room Code</span>
                                    <div className="flex items-center justify-between mt-1">
                                        <span className="text-sm font-mono font-bold text-gray-900">{roomId}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleCopy(roomId, 'Room code')}
                                            className="text-[11px] text-teal-600 font-semibold hover:underline"
                                        >
                                            Copy
                                        </button>
                                    </div>
                                </div>

                                <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">
                                    <span className="text-[11px] text-gray-500 block">Entry PIN</span>
                                    <div className="flex items-center justify-between mt-1">
                                        <span className="text-sm font-mono font-bold text-gray-900">
                                            {requirePasscode ? passcode : 'Open'}
                                        </span>
                                        {requirePasscode && (
                                            <button
                                                type="button"
                                                onClick={() => handleCopy(passcode, 'Entry PIN')}
                                                className="text-[11px] text-teal-600 font-semibold hover:underline"
                                            >
                                                Copy
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'sms' && (
                        <div className="space-y-3">
                            <p className="text-xs text-gray-600">
                                Compact plain-text invite formatted for rural SMS alerts and WhatsApp broadcast groups:
                            </p>
                            <textarea
                                readOnly
                                rows={4}
                                value={smsTemplate}
                                className="w-full text-xs border border-gray-300 rounded-xl p-3 bg-gray-50 text-gray-800 font-mono leading-relaxed"
                            />
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] text-gray-500">
                                    Length: {smsTemplate.length} chars (1 SMS segment)
                                </span>
                                <button
                                    type="button"
                                    onClick={() => handleCopy(smsTemplate, 'SMS invite template')}
                                    className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg"
                                >
                                    Copy Invite Text
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'passcode' && (
                        <div className="space-y-4">
                            <label className="flex items-center justify-between p-3 rounded-xl border border-gray-200 bg-gray-50 cursor-pointer">
                                <div>
                                    <span className="text-xs font-bold text-gray-800 block">Require 6-Digit Room PIN</span>
                                    <span className="text-[11px] text-gray-500">
                                        Prevents unverified guests from joining live rural classes
                                    </span>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={requirePasscode}
                                    onChange={(e) => setRequirePasscode(e.target.checked)}
                                    className="rounded text-teal-600 focus:ring-teal-500 h-4 w-4"
                                />
                            </label>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Invite Link Validity Window</label>
                                <select
                                    value={expiryHours}
                                    onChange={(e) => setExpiryHours(Number(e.target.value))}
                                    className="w-full text-xs border border-gray-300 rounded-lg p-2.5 bg-white"
                                >
                                    <option value={1}>1 Hour (Single Lecture)</option>
                                    <option value={2}>2 Hours (Lab / Extended Session)</option>
                                    <option value={24}>24 Hours (Full Day Access)</option>
                                </select>
                            </div>
                        </div>
                    )}

                    <div className="pt-3 border-t flex justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-xs font-semibold border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                        >
                            Done
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClassroomInviteShareModal;