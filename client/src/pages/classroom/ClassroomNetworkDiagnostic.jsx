import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

const ClassroomNetworkDiagnostic = ({ isOpen, onClose }) => {
    const [isRunning, setIsRunning] = useState(false);
    const [results, setResults] = useState({
        pingMs: 84,
        jitterMs: 14,
        packetLossPct: 0.8,
        estimatedBandwidthKbps: 750,
        status: 'good', // good, moderate, poor
        recommendation: '360p Standard Video + Audio is recommended for smooth playback.'
    });

    const runDiagnosticTest = () => {
        setIsRunning(true);
        toast('Testing network latency and packet stability...', { icon: '📡' });

        setTimeout(() => {
            const simulatedPing = Math.floor(Math.random() * 80) + 70;
            const simulatedJitter = Math.floor(Math.random() * 20) + 8;
            const simulatedLoss = (Math.random() * 2).toFixed(1);
            const isPoor = simulatedPing > 120 || simulatedLoss > 3.0;

            setResults({
                pingMs: simulatedPing,
                jitterMs: simulatedJitter,
                packetLossPct: simulatedLoss,
                estimatedBandwidthKbps: isPoor ? 240 : 820,
                status: isPoor ? 'moderate' : 'good',
                recommendation: isPoor
                    ? 'Switch to Low-Bandwidth Audio Mode to avoid voice stuttering.'
                    : 'Network is stable for live video and whiteboard streaming.'
            });

            setIsRunning(false);
            toast.success('Diagnostic complete!');
        }, 1200);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-60 flex items-center justify-center p-4">
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100 flex flex-col">
                {/* Header */}
                <div className="bg-gray-800 text-white px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-xl">📡</span>
                        <div>
                            <h2 className="text-base font-bold">Rural Network Diagnostic</h2>
                            <p className="text-xs text-gray-400">WebRTC connection health and streaming recommendation</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-lg">✕</button>
                </div>

                <div className="p-6 space-y-4">
                    {/* Status Badge Card */}
                    <div className={`p-4 rounded-xl border flex items-center justify-between ${
                        results.status === 'good' ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'
                    }`}>
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Connection Health</span>
                            <h3 className={`text-base font-bold capitalize ${
                                results.status === 'good' ? 'text-emerald-800' : 'text-amber-800'
                            }`}>
                                {results.status} Connection
                            </h3>
                        </div>
                        <span className="text-3xl">{results.status === 'good' ? '🟢' : '🟡'}</span>
                    </div>

                    {/* Telemetry Metrics */}
                    <div className="grid grid-cols-2 gap-3 text-center">
                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                            <span className="text-xs text-gray-500 block">Round Trip Time (RTT)</span>
                            <span className="text-lg font-mono font-bold text-gray-800">{results.pingMs} ms</span>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                            <span className="text-xs text-gray-500 block">Jitter Variance</span>
                            <span className="text-lg font-mono font-bold text-gray-800">{results.jitterMs} ms</span>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                            <span className="text-xs text-gray-500 block">Packet Loss</span>
                            <span className="text-lg font-mono font-bold text-gray-800">{results.packetLossPct}%</span>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                            <span className="text-xs text-gray-500 block">Available Bitrate</span>
                            <span className="text-lg font-mono font-bold text-teal-700">~{results.estimatedBandwidthKbps} kbps</span>
                        </div>
                    </div>

                    {/* Recommendation Box */}
                    <div className="bg-teal-50 border border-teal-200 p-3.5 rounded-xl">
                        <span className="text-xs font-bold text-teal-800 block mb-1">💡 Smart Streaming Recommendation</span>
                        <p className="text-xs text-teal-900 leading-relaxed">{results.recommendation}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2 border-t">
                        <button
                            onClick={runDiagnosticTest}
                            disabled={isRunning}
                            className="flex-1 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold py-2.5 rounded-xl transition shadow disabled:opacity-50"
                        >
                            {isRunning ? 'Analyzing Connection...' : 'Run Diagnostics Again'}
                        </button>
                        <button
                            onClick={onClose}
                            className="px-4 py-2.5 border border-gray-300 text-xs font-semibold rounded-xl text-gray-700 hover:bg-gray-50"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClassroomNetworkDiagnostic;
