import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

const MeetingFeedbackModal = ({ isOpen, onClose, classTitle }) => {
    const [audioRating, setAudioRating] = useState(4);
    const [videoRating, setVideoRating] = useState(4);
    const [networkRating, setNetworkRating] = useState(3);
    const [connectionType, setConnectionType] = useState('4G Mobile Hotspot');
    const [issues, setIssues] = useState([]);
    const [comment, setComment] = useState('');

    const issueOptions = [
        'Audio cutting in and out',
        'Video froze multiple times',
        'Screen share text was blurry',
        'Reconnected frequently',
        'High latency / audio delay'
    ];

    const toggleIssue = (issue) => {
        setIssues(prev =>
            prev.includes(issue) ? prev.filter(i => i !== issue) : [...prev, issue]
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        toast.success('Thank you! Your feedback helps optimize rural class quality.');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-60 flex items-center justify-center p-4">
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100">
                {/* Header */}
                <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white px-6 py-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-base font-bold">Class Experience & Quality Review</h2>
                        <p className="text-xs text-gray-400">{classTitle || 'Remote Session Quality Rating'}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-lg">✕</button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Star Ratings Grid */}
                    <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
                        {/* Audio Rating */}
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-gray-700">Audio Clarity</span>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <button
                                        type="button"
                                        key={star}
                                        onClick={() => setAudioRating(star)}
                                        className={`text-lg transition ${star <= audioRating ? 'text-amber-400' : 'text-gray-300'}`}
                                    >
                                        ★
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Video Rating */}
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-gray-700">Video Smoothness</span>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <button
                                        type="button"
                                        key={star}
                                        onClick={() => setVideoRating(star)}
                                        className={`text-lg transition ${star <= videoRating ? 'text-amber-400' : 'text-gray-300'}`}
                                    >
                                        ★
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Network Rating */}
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-gray-700">Network Stability</span>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <button
                                        type="button"
                                        key={star}
                                        onClick={() => setNetworkRating(star)}
                                        className={`text-lg transition ${star <= networkRating ? 'text-amber-400' : 'text-gray-300'}`}
                                    >
                                        ★
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Network Type Selector */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Your Internet Connection Type</label>
                        <select
                            value={connectionType}
                            onChange={(e) => setConnectionType(e.target.value)}
                            className="w-full text-xs border border-gray-300 rounded-lg p-2.5 bg-white"
                        >
                            <option value="2G / 3G Cellular">2G / 3G Cellular (Rural Area)</option>
                            <option value="4G Mobile Hotspot">4G Mobile Hotspot</option>
                            <option value="Broadband / WiFi">College / Home Broadband WiFi</option>
                            <option value="Jio / Airtel Dongle">USB Dongle Modem</option>
                        </select>
                    </div>

                    {/* Issues Checklist */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Experienced Issues (Optional)</label>
                        <div className="space-y-1.5">
                            {issueOptions.map((issue) => (
                                <label key={issue} className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={issues.includes(issue)}
                                        onChange={() => toggleIssue(issue)}
                                        className="rounded text-teal-600 focus:ring-teal-500"
                                    />
                                    <span>{issue}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Comments */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Additional Feedback</label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Tell us if lecture speed was good or if low-bandwidth mode helped..."
                            rows={2}
                            className="w-full text-xs border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2 border-t">
                        <button
                            type="submit"
                            className="flex-1 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold py-2.5 rounded-xl transition shadow"
                        >
                            Submit Feedback
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2.5 border border-gray-300 text-xs font-semibold rounded-xl text-gray-700 hover:bg-gray-50"
                        >
                            Skip
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MeetingFeedbackModal;
