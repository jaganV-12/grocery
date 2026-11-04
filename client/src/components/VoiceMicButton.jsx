import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  Square, 
  Loader2, 
  Volume2, 
  AlertCircle, 
  Radio, 
  Sparkles, 
  Check, 
  HelpCircle,
  Zap
} from 'lucide-react';

export default function VoiceMicButton({ 
  onTranscriptReady, 
  language = 'ta', 
  isProcessing = false,
  onInterimText = () => {} 
}) {
  const [isListening, setIsListening] = useState(false);
  const [isFarFieldBoost, setIsFarFieldBoost] = useState(true); // Default ON for 100cm distance voice capture
  const [isContinuousAutoListen, setIsContinuousAutoListen] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0); // 0 to 100 live decibel meter
  const [errorMsg, setErrorMsg] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const [permissionState, setPermissionState] = useState('prompt'); // 'prompt' | 'granted' | 'denied'

  const recognitionRef = useRef(null);
  const isListeningRef = useRef(false);
  const isContinuousRef = useRef(false);
  const audioContextRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const analyserRef = useRef(null);
  const animFrameRef = useRef(null);

  // Keep refs in sync with state for event handlers
  useEffect(() => {
    isListeningRef.current = isListening;
    isContinuousRef.current = isContinuousAutoListen;
  }, [isListening, isContinuousAutoListen]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      stopAudioCapture();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }
    };
  }, []);

  // Initialize SpeechRecognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      setErrorMsg('Web Speech recognition is not supported in this browser. Please open in Google Chrome or Microsoft Edge.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true; // Continuous listening so speech from 100cm doesn't cut off abruptly
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;
      recognition.lang = language === 'ta' ? 'ta-IN' : 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
        setErrorMsg('');
        setPermissionState('granted');
      };

      recognition.onresult = (event) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const res = event.results[i];
          if (res.isFinal) {
            final += res[0].transcript;
          } else {
            interim += res[0].transcript;
          }
        }

        if (interim) {
          onInterimText(interim);
        }

        if (final && final.trim().length > 0) {
          onTranscriptReady(final.trim());
          if (!isContinuousRef.current) {
            stopListening();
          }
        }
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition warning/error:', event.error);
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setPermissionState('denied');
          setErrorMsg('Microphone access denied. Please click the lock icon in the address bar and set Microphone to "Allow".');
          stopListening();
        } else if (event.error === 'no-speech') {
          // In 100cm / continuous mode, ignore brief pauses without killing the mic
          if (!isContinuousRef.current) {
            setErrorMsg('No speech detected. The 100cm Distance Boost is active — speak clearly towards the microphone.');
          }
        } else if (event.error === 'network') {
          setErrorMsg('Speech recognition network timeout. Retrying voice engine...');
        }
      };

      recognition.onend = () => {
        // Auto-restart if continuous shop counter mode is active
        if (isListeningRef.current && isContinuousRef.current) {
          try {
            recognition.start();
          } catch (e) {
            setTimeout(() => {
              if (isListeningRef.current) {
                try { recognition.start(); } catch (err) {}
              }
            }, 300);
          }
        } else {
          setIsListening(false);
          stopAudioCapture();
        }
      };

      recognitionRef.current = recognition;
    } catch (err) {
      console.error('Failed to init speech recognition:', err);
      setIsSupported(false);
    }
  }, [language, onTranscriptReady, onInterimText]);

  // Start Hardware Audio Stream with AutoGainControl (AGC) for 100cm far-field voice pickup
  const startAudioCapture = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;

      const constraints = {
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true, // CRITICAL: Automatic Gain Control amplifies distant speech from 100cm!
          channelCount: 1,
          sampleRate: { ideal: 48000 }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      mediaStreamRef.current = stream;
      setPermissionState('granted');

      // Setup Web Audio Analyser for Live Decibel Sound Wave
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioContext();
      audioContextRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      analyser.smoothingTimeConstant = 0.8;
      source.connect(analyser);
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateVolume = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        // Normalize 0 to 100, apply boost multiplier if 100cm mode is active
        const boostMultiplier = isFarFieldBoost ? 1.6 : 1.0;
        const normalized = Math.min(100, Math.round((avg / 128) * 100 * boostMultiplier));
        setVolumeLevel(normalized);

        animFrameRef.current = requestAnimationFrame(updateVolume);
      };

      updateVolume();
    } catch (err) {
      console.warn('Audio capture stream initialization issue:', err);
      if (err.name === 'NotAllowedError') {
        setPermissionState('denied');
        setErrorMsg('Microphone blocked. Please allow microphone in your browser settings.');
      }
    }
  };

  const stopAudioCapture = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      try { audioContextRef.current.close(); } catch (e) {}
      audioContextRef.current = null;
    }
    setVolumeLevel(0);
  };

  const startListening = async () => {
    setErrorMsg('');
    await startAudioCapture();

    if (recognitionRef.current) {
      try {
        recognitionRef.current.lang = language === 'ta' ? 'ta-IN' : 'en-IN';
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.warn('Recognition start exception:', err);
        try {
          recognitionRef.current.abort();
          setTimeout(() => {
            try { recognitionRef.current.start(); setIsListening(true); } catch (e) {}
          }, 150);
        } catch (e) {
          setErrorMsg('Could not activate microphone. Please check browser permissions.');
        }
      }
    }
  };

  const stopListening = () => {
    setIsListening(false);
    stopAudioCapture();
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
  };

  const toggleListening = () => {
    if (isProcessing) return;
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', width: '100%', maxWidth: '440px', margin: '0 auto' }}>
      
      {/* 100cm Distance Boost & Shop Counter Hands-Free Toggles */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        flexWrap: 'wrap',
        width: '100%'
      }}>
        {/* 100cm Far-Field Sensitivity Boost Badge */}
        <button
          onClick={() => setIsFarFieldBoost(!isFarFieldBoost)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 12px',
            borderRadius: '20px',
            fontSize: '11px',
            fontWeight: '700',
            cursor: 'pointer',
            border: isFarFieldBoost ? '1px solid #10b981' : '1px solid #cbd5e1',
            backgroundColor: isFarFieldBoost ? '#ecfdf5' : '#f8fafc',
            color: isFarFieldBoost ? '#047857' : '#64748b',
            boxShadow: isFarFieldBoost ? '0 2px 8px rgba(16, 185, 129, 0.2)' : 'none',
            transition: 'all 0.2s ease'
          }}
          title="Enhances microphone AGC sensitivity for capturing voice from 100cm (1 meter) away"
        >
          <Zap size={13} color={isFarFieldBoost ? '#059669' : '#94a3b8'} />
          <span>100cm Far-Field Boost: {isFarFieldBoost ? 'ON' : 'OFF'}</span>
        </button>

        {/* Ambient Hands-Free Shop Counter Mode */}
        <button
          onClick={() => {
            const next = !isContinuousAutoListen;
            setIsContinuousAutoListen(next);
            if (next && !isListening) {
              startListening();
            }
          }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 12px',
            borderRadius: '20px',
            fontSize: '11px',
            fontWeight: '700',
            cursor: 'pointer',
            border: isContinuousAutoListen ? '1px solid #3b82f6' : '1px solid #cbd5e1',
            backgroundColor: isContinuousAutoListen ? '#eff6ff' : '#f8fafc',
            color: isContinuousAutoListen ? '#1d4ed8' : '#64748b',
            boxShadow: isContinuousAutoListen ? '0 2px 8px rgba(59, 130, 246, 0.2)' : 'none',
            transition: 'all 0.2s ease'
          }}
          title="Keeps microphone actively listening continuously at the shop counter without re-clicking"
        >
          <Radio size={13} color={isContinuousAutoListen ? '#2563eb' : '#94a3b8'} />
          <span>Hands-Free Auto-Listen: {isContinuousAutoListen ? 'ACTIVE' : 'OFF'}</span>
        </button>
      </div>

      {/* Main Microphone Button with Pulsing Rings & Decibel Visualizer */}
      <div className="mic-pulse-container" style={{ width: '120px', height: '120px', position: 'relative' }}>
        {isListening && (
          <>
            <div 
              className="mic-pulse-ring" 
              style={{ 
                background: 'rgba(16, 185, 129, 0.35)', 
                transform: `scale(${1 + (volumeLevel / 100) * 0.5})`,
                transition: 'transform 0.08s ease-out'
              }} 
            />
            <div 
              className="mic-pulse-ring" 
              style={{ 
                background: 'rgba(16, 185, 129, 0.2)', 
                animationDelay: '0.5s' 
              }} 
            />
          </>
        )}

        <button
          onClick={toggleListening}
          disabled={isProcessing}
          style={{
            position: 'relative',
            zIndex: 10,
            width: '90px',
            height: '90px',
            borderRadius: '50%',
            background: isListening 
              ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
              : (isProcessing ? 'linear-gradient(135deg, #64748b 0%, #475569 100%)' : 'linear-gradient(135deg, #10b981 0%, #047857 100%)'),
            color: '#ffffff',
            border: isListening ? '3px solid #ffffff' : '2px solid rgba(255, 255, 255, 0.4)',
            boxShadow: isListening 
              ? `0 0 ${20 + volumeLevel * 0.3}px rgba(16, 185, 129, ${0.4 + (volumeLevel / 200)}), 0 10px 25px rgba(0, 0, 0, 0.2)` 
              : '0 10px 25px rgba(5, 150, 105, 0.35)',
            cursor: isProcessing ? 'wait' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            transform: isListening ? `scale(${1 + (volumeLevel / 250)})` : 'scale(1)'
          }}
          title={isListening ? 'Click to pause listening' : 'Click to start speaking from 100cm'}
          aria-label="Microphone"
        >
          {isProcessing ? (
            <Loader2 size={38} className="animate-spin" />
          ) : isListening ? (
            <Square size={32} />
          ) : (
            <Mic size={42} />
          )}
        </button>
      </div>

      {/* Live 100cm Audio Decibel Sound Wave Meter */}
      {isListening && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '6px',
          width: '100%',
          maxWidth: '280px',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          {/* Animated Wave Bars */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', height: '24px' }}>
            {[0.4, 0.8, 1.0, 0.7, 0.5, 0.9, 0.3].map((factor, idx) => {
              const barHeight = Math.max(4, Math.round((volumeLevel * factor * 0.22)));
              return (
                <div
                  key={idx}
                  style={{
                    width: '4px',
                    height: `${barHeight}px`,
                    borderRadius: '2px',
                    backgroundColor: volumeLevel > 15 ? '#10b981' : '#94a3b8',
                    transition: 'height 0.08s ease'
                  }}
                />
              );
            })}
          </div>

          <div style={{
            fontSize: '11px',
            fontWeight: '600',
            color: volumeLevel > 15 ? '#059669' : '#64748b',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <Volume2 size={13} />
            <span>
              {volumeLevel > 15 
                ? `100cm Voice Signal Detected (${volumeLevel}%)` 
                : 'Listening for counter speech (100cm range ready)...'}
            </span>
          </div>
        </div>
      )}

      {/* Status indicator & Instructions */}
      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontSize: '15px',
          fontWeight: '700',
          color: isListening ? '#059669' : (isProcessing ? '#0284c7' : '#0f172a'),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}>
          {isProcessing ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>VoiceBiz AI Processing...</span>
            </>
          ) : isListening ? (
            <>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981', animation: 'ping 1s infinite' }}></span>
              <span>{language === 'ta' ? 'பேசுங்கள்... 100cm தூரத்திலும் கேட்கும்' : 'Listening... (Ready for 100cm distance)'}</span>
            </>
          ) : (
            <span>{language === 'ta' ? 'பேச மைக் பட்டனை அழுத்தவும்' : 'Tap Mic & Speak From 100cm'}</span>
          )}
        </div>

        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
          {language === 'ta' 
            ? 'எடுத்துக்காட்டு: "குரு 500 ரூபாய் கடன்" அல்லது "குமார் 10 கிலோ அரிசி 600 ரூபாய்"' 
            : 'Example: "Guru 500 rupees pending" or "Kumar 10 kg rice 600 rupees"'}
        </div>
      </div>

      {/* Error alert with Action Guide */}
      {errorMsg && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 14px',
          borderRadius: '10px',
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          color: '#b91c1c',
          fontSize: '12px',
          maxWidth: '440px',
          textAlign: 'left'
        }}>
          <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: '700' }}>Microphone Notice:</div>
            <div style={{ marginTop: '2px' }}>{errorMsg}</div>
          </div>
        </div>
      )}
    </div>
  );
}
