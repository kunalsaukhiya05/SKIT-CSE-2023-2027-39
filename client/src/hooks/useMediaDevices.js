import { useState, useEffect, useCallback } from 'react';

export const useMediaDevices = () => {
    const [devices, setDevices] = useState({ cameras: [], microphones: [], speakers: [] });
    const [selectedCamera, setSelectedCamera] = useState('');
    const [selectedMic, setSelectedMic] = useState('');
    const [selectedSpeaker, setSelectedSpeaker] = useState('');
    const [stream, setStream] = useState(null);
    const [audioLevel, setAudioLevel] = useState(0);
    const [error, setError] = useState(null);
    const [permissionGranted, setPermissionGranted] = useState(false);

    const enumerateDevices = useCallback(async () => {
        try {
            const allDevices = await navigator.mediaDevices.enumerateDevices();
            setDevices({
                cameras: allDevices.filter(d => d.kind === 'videoinput'),
                microphones: allDevices.filter(d => d.kind === 'audioinput'),
                speakers: allDevices.filter(d => d.kind === 'audiooutput')
            });
        } catch (err) {
            setError('Failed to enumerate media devices');
        }
    }, []);

    const requestPermissions = useCallback(async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setStream(mediaStream);
            setPermissionGranted(true);
            setError(null);
            await enumerateDevices();

            // Audio level monitoring
            const audioContext = new AudioContext();
            const source = audioContext.createMediaStreamSource(mediaStream);
            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 256;
            source.connect(analyser);

            const dataArray = new Uint8Array(analyser.frequencyBinCount);
            const checkLevel = () => {
                analyser.getByteFrequencyData(dataArray);
                const avg = dataArray.reduce((a, b) => a + b) / dataArray.length;
                setAudioLevel(Math.round((avg / 255) * 100));
                if (mediaStream.active) requestAnimationFrame(checkLevel);
            };
            checkLevel();

            return mediaStream;
        } catch (err) {
            if (err.name === 'NotAllowedError') {
                setError('Camera and microphone access was denied. Please allow permissions in your browser settings.');
            } else if (err.name === 'NotFoundError') {
                setError('No camera or microphone found on this device.');
            } else {
                setError('Failed to access media devices: ' + err.message);
            }
            setPermissionGranted(false);
            return null;
        }
    }, [enumerateDevices]);

    const stopStream = useCallback(() => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
            setAudioLevel(0);
        }
    }, [stream]);

    const switchCamera = useCallback(async (deviceId) => {
        setSelectedCamera(deviceId);
        if (stream) {
            const videoTrack = stream.getVideoTracks()[0];
            if (videoTrack) {
                try {
                    await videoTrack.applyConstraints({ deviceId: { exact: deviceId } });
                } catch (err) { console.error('Failed to switch camera:', err); }
            }
        }
    }, [stream]);

    const switchMicrophone = useCallback(async (deviceId) => {
        setSelectedMic(deviceId);
        if (stream) {
            const audioTrack = stream.getAudioTracks()[0];
            if (audioTrack) {
                try {
                    await audioTrack.applyConstraints({ deviceId: { exact: deviceId } });
                } catch (err) { console.error('Failed to switch microphone:', err); }
            }
        }
    }, [stream]);

    useEffect(() => {
        enumerateDevices();
        navigator.mediaDevices?.addEventListener('devicechange', enumerateDevices);
        return () => {
            navigator.mediaDevices?.removeEventListener('devicechange', enumerateDevices);
            stopStream();
        };
    }, []);

    return {
        devices, selectedCamera, selectedMic, selectedSpeaker,
        setSelectedSpeaker, stream, audioLevel, error, permissionGranted,
        requestPermissions, stopStream, switchCamera, switchMicrophone
    };
};
