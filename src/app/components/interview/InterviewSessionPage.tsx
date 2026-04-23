import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useStore } from '../../../store/useStore';
import { Button } from '../ui/button';
import {
  Mic, MicOff, Phone, PhoneOff, Video, VideoOff,
  Volume2, VolumeX, Shield, CheckCircle, AlertCircle,
  Camera, User, Bot, Clock, Signal, Wifi, Battery,
  Sparkles, Loader2, Headphones, ArrowLeft,
  Activity, Circle, Zap, Minimize2, Maximize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import * as Retell from "retell-client-js-sdk";
import logo from '../../../images/logo.svg';

export function InterviewSessionPage() {
  const { jobId, candidateId } = useParams();
  const navigate = useNavigate();

  const startInterview = useStore((s) => s.startInterview);
  const endInterviewStore = useStore((s) => s.endInterview);
  const setIsSpeaking = useStore((s) => s.setIsSpeaking);

  const [callActive, setCallActive] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [aiConfidence, setAiConfidence] = useState(0);
  const [connectionQuality, setConnectionQuality] = useState<'excellent' | 'good' | 'poor'>('excellent');
  const [showTips, setShowTips] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState("Tell me about yourself");
  const [transcription, setTranscription] = useState<string[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const clientRef = useRef<any>(null);
  const intervalRef = useRef<any>(null);
  const audioContextRef = useRef<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Timer
  useEffect(() => {
    if (callActive) {
      intervalRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [callActive]);

  // Simulate audio levels
  useEffect(() => {
    if (callActive) {
      const audioInterval = setInterval(() => {
        setAudioLevel(Math.random() * 100);
        setAiConfidence(Math.random() * 30 + 70);
      }, 200);
      return () => clearInterval(audioInterval);
    }
  }, [callActive]);

  // Video setup
  useEffect(() => {
    if (isVideoOn && callActive) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(console.error);
    }
  }, [isVideoOn, callActive]);

  const initClient = async () => {
    clientRef.current = new Retell.RetellWebClient();

    clientRef.current.on("agent_start_talking", () => {
      setIsSpeaking(true, "AI");
      setIsThinking(false);
    });

    clientRef.current.on("agent_stop_talking", () => {
      setIsSpeaking(false, null);
    });

    clientRef.current.on("user_start_talking", () => {
      setIsSpeaking(true, "Candidate");
    });

    clientRef.current.on("user_stop_talking", () => {
      setIsSpeaking(false, null);
    });

    clientRef.current.on("transcription", (text: string) => {
      setTranscription(prev => [...prev.slice(-5), text]);
    });
  };

  const createRetellCall = useStore((s) => s.createRetellCall);
  const endRetellCall = useStore((s) => s.endRetellCall);

  const startCall = async () => {
    try {
      await initClient();

      // 🔥 1. Get from URL params
      let cid = candidateId;

      // 🔥 2. Fallback to localStorage
      if (!cid) {
        cid = localStorage.getItem("c_id");
      }

      // 🔥 3. Save for reuse
      if (cid) {
        localStorage.setItem("c_id", cid);
      }

      // ❌ No ID → stop
      if (!cid) {
        console.error("Candidate ID not found");
        alert("/invalid-link");
        return;
      }

      setShowTips(false);
      setIsThinking(true);

      const token = await createRetellCall(cid, jobId);
      if (!token) return;

      await clientRef.current.startCall({ accessToken: token });

      setCallActive(true);
    } catch (err) {
      console.error(err);
    }
  };

  const endCall = async () => {
    try {
      await clientRef.current?.stopCall();
    } catch (e) { }
    setCallActive(false);
    endInterviewStore();
    await endRetellCall();
    navigate('/dashboard/pipeline');
  };

  const toggleMic = () => {
    if (!clientRef.current) return;
    if (isMicOn) {
      clientRef.current.mute();
    } else {
      clientRef.current.unmute();
    }
    setIsMicOn(!isMicOn);
  };

  const toggleVideo = async () => {
    if (!isVideoOn) {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } else {
      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());
      if (videoRef.current) videoRef.current.srcObject = null;
    }
    setIsVideoOn(!isVideoOn);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getConnectionIcon = () => {
    switch (connectionQuality) {
      case 'excellent': return <Signal className="w-4 h-4 text-green-600" />;
      case 'good': return <Wifi className="w-4 h-4 text-yellow-600" />;
      case 'poor': return <Battery className="w-4 h-4 text-red-500 animate-pulse" />;
    }
  };

  return (
    <div ref={containerRef} className="fixed inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900 flex flex-col overflow-hidden">

      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #6366f1 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
        }} />
      </div>

      {/* Header */}
      <div className="relative z-10 flex justify-between items-center px-8 py-4 border-b border-gray-200 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">

            <img
              src={logo}
              alt="Intervo AI"
              className="mx-auto h-10 w-auto object-contain transition-all duration-300"
            />
          </div>
          <div className="h-6 w-px bg-gray-300" />
          <div>
            {/**
         *       <p className="text-sm font-semibold text-gray-900">Frontend Engineer</p>
            <p className="text-xs text-gray-500">Senior Level • $120k-150k</p>
       
         */}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100">
            {getConnectionIcon()}
            <Clock className="w-4 h-4 text-gray-600" />
            <span className="font-mono text-lg font-bold tracking-wider text-gray-900">
              {formatTime(elapsedTime)}
            </span>
          </div>
          <button
            onClick={toggleFullscreen}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
            <Shield className="w-3 h-3 text-green-600" />
            <span>Encrypted</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-8">

        {/* Video Feed */}
        <AnimatePresence>
          {isVideoOn && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 100 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: 100 }}
              className="absolute bottom-6 right-6 w-64 h-48 rounded-xl overflow-hidden shadow-2xl border-2 border-white ring-1 ring-gray-200"
            >
              <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
              <div className="absolute bottom-2 left-2 text-xs bg-white/90 backdrop-blur-sm text-gray-900 px-2 py-0.5 rounded-lg shadow-sm">
                You
              </div>
              <div className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI Avatar Card */}
        <motion.div
          animate={{
            scale: callActive ? [1, 1.02, 1] : 1,
          }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="relative"
        >
          <div className="relative">
            {/* Outer Ring */}
            <motion.div
              animate={{
                scale: callActive ? [1, 1.1, 1] : 1,
                opacity: callActive ? [0.3, 0.1, 0.3] : 0
              }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute -inset-4 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 opacity-30 blur-xl"
            />

            {/* Avatar Circle */}
            <div className="relative w-48 h-48 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl">
              <div className="absolute inset-1 rounded-full bg-white flex items-center justify-center">
                <Bot className="w-20 h-20 text-indigo-600" />
              </div>

              {/* Thinking Animation */}
              {isThinking && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  className="absolute -inset-1 rounded-full border-2 border-indigo-400 border-t-transparent"
                />
              )}

              {/* Speaking Indicator */}
              {callActive && (
                <motion.div
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="absolute -bottom-2 -right-2 w-5 h-5 bg-green-500 rounded-full border-3 border-white"
                />
              )}
            </div>
          </div>

          {/* Audio Waveform */}
          {callActive && (
            <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 flex gap-1">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    height: [4, Math.max(4, audioLevel * 0.4), 4],
                    backgroundColor: ['#6366f1', '#8b5cf6', '#6366f1']
                  }}
                  transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.05 }}
                  className="w-1 bg-indigo-500 rounded-full"
                  style={{ height: 4 }}
                />
              ))}
            </div>
          )}
        </motion.div>

        {/* AI Status */}
        <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 text-center space-y-3">
          <div className="flex items-center gap-2 justify-center">
            {callActive ? (
              <>
                <Activity className="w-4 h-4 text-indigo-500 animate-pulse" />
                <p className="text-sm font-medium text-gray-700">AI is analyzing your responses</p>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-indigo-500" />
                <p className="text-sm font-medium text-gray-700">Ready to begin your interview</p>
              </>
            )}
          </div>

          {/* Confidence Meter */}
          {callActive && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 text-xs"
            >
              <span className="text-gray-600">Interview Confidence Score</span>
              <div className="w-32 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  animate={{ width: `${aiConfidence}%` }}
                  transition={{ duration: 0.3 }}
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                />
              </div>
              <span className="font-semibold text-indigo-600">{Math.round(aiConfidence)}%</span>
            </motion.div>
          )}
        </div>

        {/* Current Question */}
        {callActive && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-white rounded-2xl px-6 py-3 shadow-lg border border-gray-200"
          >
            <p className="text-xs text-gray-500 mb-1">Current Question</p>
            <p className="text-sm font-medium text-gray-900">{currentQuestion}</p>
          </motion.div>
        )}

        {/* Interview Tips Panel */}
        <AnimatePresence>
          {showTips && !callActive && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute top-20 right-8 w-80 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2">
                <p className="text-sm font-semibold text-white">Interview Tips</p>
              </div>
              <div className="p-4">
                <ul className="space-y-2">
                  {[
                    "Ensure stable internet connection",
                    "Find a quiet, well-lit environment",
                    "Speak clearly and at moderate pace",
                    "Test your microphone before starting",
                    "Have your resume ready for reference"
                  ].map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Live Transcription Panel */}
        {callActive && transcription.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute bottom-32 left-8 w-80 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
          >
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
              <p className="text-xs font-semibold text-gray-600">LIVE TRANSCRIPTION</p>
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-700">"{transcription[transcription.length - 1]}"</p>
              {transcription.length > 1 && (
                <p className="text-xs text-gray-400 mt-2">Previous: "{transcription[transcription.length - 2]}"</p>
              )}
            </div>
          </motion.div>
        )}

        {/* AI Processing Indicator */}
        {isThinking && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute bottom-40 left-1/2 transform -translate-x-1/2 bg-white rounded-full px-4 py-2 shadow-lg border border-gray-200 flex items-center gap-2"
          >
            <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" />
            <span className="text-sm text-gray-700">AI is processing your answer...</span>
          </motion.div>
        )}
      </div>

      {/* Controls Panel */}
      <div className="relative z-10 pb-10">
        <div className="flex justify-center items-center gap-3">
          {/* Mic Control */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={toggleMic}
              className={`h-14 w-14 rounded-full transition-all duration-300 shadow-lg ${isMicOn
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-indigo-500/30'
                  : 'bg-red-500 text-white hover:bg-red-600'
                }`}
            >
              {isMicOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
            </Button>
          </motion.div>

          {/* Video Control */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={toggleVideo}
              className={`h-14 w-14 rounded-full transition-all duration-300 shadow-lg ${isVideoOn
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
            >
              {isVideoOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
            </Button>
          </motion.div>

          {/* Audio Control */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => setIsMuted(!isMuted)}
              className={`h-14 w-14 rounded-full transition-all duration-300 shadow-lg ${!isMuted
                  ? 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  : 'bg-red-500 text-white hover:bg-red-600'
                }`}
            >
              {!isMuted ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
            </Button>
          </motion.div>

          {/* Call Button */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            {!callActive ? (
              <Button
                onClick={startCall}
                className="h-16 w-16 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg hover:shadow-green-500/30 transition-all duration-300"
              >
                <Phone className="w-7 h-7" />
              </Button>
            ) : (
              <Button
                onClick={endCall}
                className="h-16 w-16 rounded-full bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg hover:shadow-red-500/30 transition-all duration-300"
              >
                <PhoneOff className="w-7 h-7" />
              </Button>
            )}
          </motion.div>
        </div>

        {/* Audio Level Meter */}
        {callActive && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mt-6"
          >
            <div className="flex gap-0.5 h-12 items-end">
              {[...Array(40)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    height: audioLevel > i * 2.5 ? 20 + Math.random() * 20 : 4,
                    backgroundColor: audioLevel > i * 2.5 ? '#6366f1' : '#e5e7eb'
                  }}
                  className="w-1 rounded-full transition-all duration-100"
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Status Bar */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-3 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm border border-gray-200">
        <div className={`w-2 h-2 rounded-full ${callActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
        <span className="text-xs text-gray-600">
          {callActive ? 'Live Interview Session' : 'Ready to Connect'}
        </span>
        {callActive && (
          <>
            <div className="w-px h-3 bg-gray-300" />
            <div className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-yellow-500" />
              <span className="text-xs text-gray-600">HD Audio</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}