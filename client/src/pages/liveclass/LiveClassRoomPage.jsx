import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import {
    LiveClassHeaderBar,
    LiveSpeakerSpotlight,
    ResponsiveParticipantGrid,
    ParticipantRosterScreen,
    LiveClassToolbar,
    LiveReactionsOverlay,
    DeviceSwitchQuickMenu,
    ParticipantProfileCardModal,
    MobileLiveClassDrawer,
    ReconnectRecoveryBanner
} from '../../components/liveclass/index.js';
import ClassroomInviteShareModal from '../classroom/ClassroomInviteShareModal';

const INITIAL_PARTICIPANTS = [
    { id: 't-1', name: 'Prof. Ramesh Sharma', rollNo: 'FAC-CS01', role: 'teacher', isSpeaking: true, isMuted: false, isVideoOn: true, handRaised: false, audioOnly: false, signalStrength: 4, joinedAt: '09:58 AM', handRaiseCount: 0, location: 'SKIT Campus Studio' },
    { id: 's-1', name: 'Aarav Sharma', rollNo: '23CS001', role: 'student', isSpeaking: false, isMuted: true, isVideoOn: true, handRaised: false, audioOnly: false, signalStrength: 4, joinedAt: '10:00 AM', handRaiseCount: 2, location: 'Chomu Rural Node' },
    { id: 's-2', name: 'Bhavna Meena', rollNo: '23CS008', role: 'student', isSpeaking: false, isMuted: true, isVideoOn: false, handRaised: true, audioOnly: true, signalStrength: 2, joinedAt: '10:01 AM', handRaiseCount: 3, location: 'Bassi 2G/3G Tower' },
    { id: 's-3', name: 'Chetan Verma', rollNo: '23CS014', role: 'student', isSpeaking: false, isMuted: true, isVideoOn: false, handRaised: false, audioOnly: false, signalStrength: 3, joinedAt: '10:02 AM', handRaiseCount: 1, location: 'Sanganer Hotspot' },
    { id: 's-4', name: 'Divya Soni', rollNo: '23CS021', role: 'student', isSpeaking: false, isMuted: false, isVideoOn: true, handRaised: true, audioOnly: false, signalStrength: 4, joinedAt: '10:02 AM', handRaiseCount: 2, location: 'Jaipur East' },
    { id: 's-5', name: 'Hemant Choudhary', rollNo: '23CS042', role: 'student', isSpeaking: false, isMuted: true, isVideoOn: false, handRaised: false, audioOnly: true, signalStrength: 2, joinedAt: '10:04 AM', handRaiseCount: 0, location: 'Dausa Rural Node' },
    { id: 's-6', name: 'Kavita Rawat', rollNo: '23CS053', role: 'student', isSpeaking: false, isMuted: true, isVideoOn: true, handRaised: false, audioOnly: false, signalStrength: 3, joinedAt: '10:05 AM', handRaiseCount: 1, location: 'Shahpura Node' }
];

const LiveClassRoomPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const student = useSelector((state) => state?.student?.student);
    const teacher = useSelector((state) => state?.teacher?.teacher);

    const role = teacher ? 'teacher' : 'student';
    const currentUserName = teacher?.fullName || student?.fullName || 'Manish Kumar';

    const [participants, setParticipants] = useState(INITIAL_PARTICIPANTS);
    const [layoutMode, setLayoutMode] = useState('spotlight'); // grid, spotlight
    const [pinnedId, setPinnedId] = useState('t-1');
    const [isMuted, setIsMuted] = useState(role !== 'teacher');
    const [isVideoOn, setIsVideoOn] = useState(role === 'teacher');
    const [isScreenSharing, setIsScreenSharing] = useState(true);
    const [isHandRaised, setIsHandRaised] = useState(false);
    const [isAudioOnly, setIsAudioOnly] = useState(false);
    const [qualityPreset, setQualityPreset] = useState('saver_240p');

    const [showRosterPane, setShowRosterPane] = useState(false);
    const [showMobileDrawer, setShowMobileDrawer] = useState(false);
    const [mobileDrawerTab, setMobileDrawerTab] = useState('chat');
    const [showReactionsTray, setShowReactionsTray] = useState(false);
    const [showDevicesModal, setShowDevicesModal] = useState(false);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [inspectedParticipant, setInspectedParticipant] = useState(null);
    const [connectionState, setConnectionState] = useState(navigator.onLine ? 'connected' : 'offline');

    const [messages, setMessages] = useState([
        { id: 1, sender: 'Prof. Ramesh Sharma', time: '10:03 AM', text: 'Welcome class! Please enable Audio Saver if your village signal fluctuates.' },
        { id: 2, sender: 'Divya Soni', time: '10:06 AM', text: 'Slide diagrams are loading cleanly on 3G mode.' }
    ]);

    useEffect(() => {
        const handleOnline = () => setConnectionState('connected');
        const handleOffline = () => setConnectionState('offline');
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // Keyboard shortcuts for quick live class controls (M=Mute, V=Video, H=Hand)
    useEffect(() => {
        const handleKey = (e) => {
            if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;
            const key = e.key.toLowerCase();
            if (key === 'm') setIsMuted((prev) => !prev);
            if (key === 'v' && !isAudioOnly) setIsVideoOn((prev) => !prev);
            if (key === 'h' && role !== 'teacher') setIsHandRaised((prev) => !prev);
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [isAudioOnly, role]);

    const handleTogglePin = useCallback((targetId) => {
        setPinnedId((prev) => (prev === targetId ? null : targetId));
    }, []);

    const handleToggleParticipantMute = useCallback((targetId) => {
        setParticipants((prev) =>
            prev.map((p) => (p.id === targetId ? { ...p, isMuted: !p.isMuted, isSpeaking: false } : p))
        );
    }, []);

    const handleMuteAll = useCallback(() => {
        setParticipants((prev) =>
            prev.map((p) => (p.role === 'teacher' ? p : { ...p, isMuted: true, isSpeaking: false }))
        );
    }, []);

    const handleDisableStudentCameras = useCallback(() => {
        setParticipants((prev) =>
            prev.map((p) => (p.role === 'teacher' ? p : { ...p, isVideoOn: false, audioOnly: true }))
        );
    }, []);

    const handleRemoveParticipant = useCallback((targetId) => {
        setParticipants((prev) => prev.filter((p) => p.id !== targetId));
        toast.success('Moved participant back to waiting lobby');
    }, []);

    const handleSendMessage = (text) => {
        const entry = {
            id: Date.now(),
            sender: currentUserName,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            text
        };
        setMessages((prev) => [...prev, entry]);
    };

    const handleSelectPreset = (presetId) => {
        setQualityPreset(presetId);
        setIsAudioOnly(presetId === 'audio_only');
        if (presetId === 'audio_only') setIsVideoOn(false);
    };

    const activeSpeaker = participants.find((p) => p.id === pinnedId) || participants[0];

    return (
        <div className="h-screen w-screen bg-slate-950 text-white flex flex-col overflow-hidden">
            {/* Top Responsive Live Header */}
            <LiveClassHeaderBar
                classTitle={`Computer Networks (${id || 'Live Room'})`}
                roomCode={id || 'CS-501'}
                role={role}
                layoutMode={layoutMode}
                isAudioOnly={isAudioOnly}
                networkLatencyMs={isAudioOnly ? 74 : 96}
                onToggleLayout={() => setLayoutMode((m) => (m === 'grid' ? 'spotlight' : 'grid'))}
                onToggleNetworkModal={() =>
                    setConnectionState((prev) => (prev === 'connected' ? 'degraded' : 'connected'))
                }
                onOpenInviteModal={() => setShowInviteModal(true)}
            />

            {/* Network Drop Recovery Overlay */}
            <ReconnectRecoveryBanner
                connectionState={connectionState}
                queuedMessagesCount={messages.length}
                onRetryNow={() => {
                    setConnectionState('connected');
                    toast.success('Connection stabilized!');
                }}
                onSwitchAudioOnly={() => handleSelectPreset('audio_only')}
            />

            {/* Main Live Class Viewport + Optional Right Roster Panel */}
            <div className="flex-1 flex overflow-hidden p-3 sm:p-4 gap-4">
                <main className="flex-1 min-w-0 flex flex-col overflow-hidden">
                    {layoutMode === 'spotlight' ? (
                        <LiveSpeakerSpotlight
                            activeSpeaker={activeSpeaker}
                            participants={participants}
                            isScreenSharing={isScreenSharing}
                            isAudioOnly={isAudioOnly}
                            onPinToggle={handleTogglePin}
                            onInspectParticipant={setInspectedParticipant}
                        />
                    ) : (
                        <ResponsiveParticipantGrid
                            participants={participants}
                            pinnedId={pinnedId}
                            isTeacherView={role === 'teacher'}
                            onPinToggle={handleTogglePin}
                            onMuteToggle={handleToggleParticipantMute}
                            onInspectParticipant={setInspectedParticipant}
                        />
                    )}
                </main>

                {/* Desktop Side Roster Drawer */}
                {showRosterPane && (
                    <aside className="hidden lg:block w-80 xl:w-96 shrink-0 h-full">
                        <ParticipantRosterScreen
                            participants={participants}
                            isTeacher={role === 'teacher'}
                            onMuteOne={handleToggleParticipantMute}
                            onMuteAll={handleMuteAll}
                            onDisableStudentCameras={handleDisableStudentCameras}
                            onPinToggle={handleTogglePin}
                            onInspectParticipant={setInspectedParticipant}
                            onClose={() => setShowRosterPane(false)}
                        />
                    </aside>
                )}
            </div>

            {/* Bottom Responsive Control Bar */}
            <LiveClassToolbar
                isMuted={isMuted}
                isVideoOn={isVideoOn}
                isScreenSharing={isScreenSharing}
                isHandRaised={isHandRaised}
                isAudioOnly={isAudioOnly}
                isTeacher={role === 'teacher'}
                unreadChatCount={messages.length}
                participantCount={participants.length}
                onToggleMute={() => setIsMuted((prev) => !prev)}
                onToggleVideo={() => setIsVideoOn((prev) => !prev)}
                onToggleScreenShare={() => setIsScreenSharing((prev) => !prev)}
                onToggleHandRaise={() => setIsHandRaised((prev) => !prev)}
                onToggleAudioOnly={() => handleSelectPreset(isAudioOnly ? 'saver_240p' : 'audio_only')}
                onOpenParticipants={() => {
                    if (window.innerWidth < 1024) {
                        setMobileDrawerTab('participants');
                        setShowMobileDrawer(true);
                    } else {
                        setShowRosterPane((prev) => !prev);
                    }
                }}
                onOpenChat={() => {
                    setMobileDrawerTab('chat');
                    setShowMobileDrawer(true);
                }}
                onOpenDevices={() => setShowDevicesModal(true)}
                onOpenReactions={() => setShowReactionsTray((prev) => !prev)}
                onLeaveClass={() => navigate(role === 'teacher' ? '/teacher-dashboard' : '/student-dashboard')}
            />

            {/* Floating Reactions & Popover Modals */}
            <LiveReactionsOverlay
                isOpen={showReactionsTray}
                onClose={() => setShowReactionsTray(false)}
                userName={currentUserName}
            />

            <DeviceSwitchQuickMenu
                isOpen={showDevicesModal}
                onClose={() => setShowDevicesModal(false)}
                currentPreset={qualityPreset}
                onSelectPreset={handleSelectPreset}
            />

            <ParticipantProfileCardModal
                participant={inspectedParticipant}
                isOpen={Boolean(inspectedParticipant)}
                onClose={() => setInspectedParticipant(null)}
                isTeacherView={role === 'teacher'}
                isPinned={inspectedParticipant?.id === pinnedId}
                onPinToggle={handleTogglePin}
                onMuteToggle={handleToggleParticipantMute}
                onRemoveParticipant={handleRemoveParticipant}
            />

            <MobileLiveClassDrawer
                isOpen={showMobileDrawer}
                onClose={() => setShowMobileDrawer(false)}
                initialTab={mobileDrawerTab}
                participants={participants}
                messages={messages}
                onSendMessage={handleSendMessage}
                isAudioOnly={isAudioOnly}
                onToggleAudioOnly={() => handleSelectPreset(isAudioOnly ? 'saver_240p' : 'audio_only')}
            />

            <ClassroomInviteShareModal
                isOpen={showInviteModal}
                onClose={() => setShowInviteModal(false)}
                roomId={id || 'CS501-RM39'}
            />
        </div>
    );
};

export default LiveClassRoomPage;