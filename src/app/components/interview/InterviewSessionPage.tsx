// InterviewSessionPage.tsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useStore } from '../../../store/useStore';
import { Button } from '../ui/button';
import {
  Mic, MicOff, Phone, PhoneOff, Video, VideoOff,
  Volume2, VolumeX, Shield, CheckCircle, AlertCircle,
  Camera, User, Bot, Clock, Signal, Wifi, Battery,
  Sparkles, Loader2, Headphones, ArrowLeft,
  Activity, Circle, Zap, Minimize2, Maximize2,
  Upload, Cloud, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import * as Retell from "retell-client-js-sdk";
import logo from '../../../images/logo.svg';
import { Settings, RefreshCw } from 'lucide-react';
export function InterviewSessionPage() {
  // Instead of default HD (1280x720)
const constraints = {
  video: {
    width: { ideal: 320, max: 480 },    // Was 1280
    height: { ideal: 240, max: 360 },    // Was 720
    frameRate: { ideal: 15, max: 20 },   // Was 30
  },
audio: {
  sampleRate: 16000,
  channelCount: 1,
  echoCancellation: true,
  noiseSuppression: true,
  autoGainControl: true,
}
};
  const { token } = useParams();
  const navigate = useNavigate();

  // Simple upload functions
  const uploadChunkDirectly = useStore((state) => state.uploadChunkDirectly);
  const uploadLoading = useStore((state) => state.uploadLoading);
  const [isStartingCall, setIsStartingCall] = useState(false);
const [isEndingCall, setIsEndingCall] = useState(false);

  // Interview store functions
  const startInterview = useStore((s) => s.startInterview);
  const endInterviewStore = useStore((s) => s.endInterview);
  const setIsSpeaking = useStore((s) => s.setIsSpeaking);
  const createRetellCall = useStore((s) => s.createRetellCall);
  const endRetellCall = useStore((s) => s.endRetellCall);

  // Interview state
  const [callActive, setCallActive] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
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
  
  // Video recording state - simplified
  const [isRecording, setIsRecording] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedChunks, setUploadedChunks] = useState(0);
  const [totalChunksToUpload, setTotalChunksToUpload] = useState(0);

  // Refs for interview
  const clientRef = useRef<any>(null);
  const intervalRef = useRef<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Refs for recording - simplified
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingStreamRef = useRef<MediaStream | null>(null);
  const sessionIdRef = useRef<string>(`session-${Date.now()}`);
  const recordingIdRef = useRef<string>(`recording-${Date.now()}`);
  const chunkIndexRef = useRef<number>(0);
  const totalChunksRef = useRef<number>(0);
// Add this ref next to your other refs (around line 80)
const recordingFormatRef = useRef<string>('video/webm'); // Default format
  // Timer for interview
  useEffect(() => {
    if (callActive) {
      intervalRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
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

  // Video setup for interview
  useEffect(() => {
    let stream: MediaStream | null = null;
    
    if (isVideoOn && callActive) {
      navigator.mediaDevices.getUserMedia({ video: constraints.video, audio: constraints.audio })
        .then(s => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
        })
        .catch(console.error);
    }
    
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isVideoOn, callActive]);

  // Initialize Retell client
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
const [inviteError, setInviteError] = useState<string | null>(null);

  const aiStreamRef = useRef<MediaStream | null>(null);
  // Start voice call
  const startCall = async () => {
      if (isStartingCall) return; // Prevent multiple clicks
  
  setIsStartingCall(true);
  setInviteError(null);
    try {
      await initClient();

  
      setShowTips(false);
      setIsThinking(true);

      const token2 = await createRetellCall(token);
     if (!token2) {
      setIsThinking(false);
      setInviteError("This interview invite has expired or is invalid. Please contact support for a new invitation.");
           setIsStartingCall(false);
      return;
    }
      await clientRef.current.startCall({ accessToken: token2 });
      clientRef.current.mute();
      setCallActive(true);
      const room = clientRef.current.room;
    
      room.on("trackSubscribed", (track, publication, participant) => {
  console.log("🔥 TRACK SUBSCRIBED:", track.kind, participant.identity);

  if (track.kind === "audio") {
    console.log("🎧 AI AUDIO TRACK FOUND");

    aiStreamRef.current = new MediaStream([track.mediaStreamTrack]);

  startVideoRecording();
  setTimeout(() => {
       clientRef.current.unmute();
  }, 3000);
  }
});
      // Auto-start recording when call starts
     
    } catch (err) {
      console.error(err);
      setIsThinking(false);
            setIsStartingCall(false);
    }
    finally{
            setIsStartingCall(false);
    }
  };

  // Auto-start camera on page load
useEffect(() => {
  const startCameraOnLoad = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: constraints.video, 
        audio: false 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access failed:", err);
    }
  };
  
  startCameraOnLoad();
  
  // Cleanup
  return () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  };
}, []); // Empty dependency array - runs only on mount
  // End
  //  voice call
  const endCall = async () => {
      if (isEndingCall) return; // Prevent multiple clicks
  setIsEndingCall(true);

    try {
      // Stop recording if active
      if (isRecording) {
        await stopVideoRecording();
      }
      
      if (clientRef.current) {
        await clientRef.current.stopCall();
      }
    } catch (e) { 
      console.error(e);
    }
    finally{
          setIsEndingCall(false);

    }
    setCallActive(false);
    endInterviewStore();
    await endRetellCall(token);
    navigate('/dashboard/pipeline');
  };

  // Start video recording - SIMPLIFIED: just capture chunks and upload directly
 // Add these refs next to your existing ones
const segmentTimeoutRef = useRef<NodeJS.Timeout | null>(null);
const isRecordingSegmentRef = useRef<boolean>(false);

const startVideoRecording = async () => {
  if (!token) return;

  try {
    // 🎥 Get user camera + mic
    const userStream = await navigator.mediaDevices.getUserMedia({
      video: constraints.video,
      audio: constraints.audio
    });

    // 🎧 Create audio mixers
    const audioContext = new AudioContext();
    const destination = audioContext.createMediaStreamDestination();

    // 🎤 User mic
    const userAudioSource = audioContext.createMediaStreamSource(userStream);
    userAudioSource.connect(destination);

    // 🤖 AI voice (IMPORTANT)
    if (aiStreamRef.current) {
      console.log("✅ Adding AI voice to recording");

      const aiAudioSource = audioContext.createMediaStreamSource(aiStreamRef.current);
      aiAudioSource.connect(destination);
    } else {
      console.warn("⚠️ AI stream not ready yet");
    }

    // 🎬 Final merged stream
    const finalStream = new MediaStream([
      ...userStream.getVideoTracks(),
      ...destination.stream.getAudioTracks()
    ]);

    // 👇 USE THIS (instead of raw getUserMedia)
    recordingStreamRef.current = finalStream;

    // continue your existing logic
    chunkIndexRef.current = 0;
    totalChunksRef.current = 0;
    setUploadedChunks(0);
    setTotalChunksToUpload(0);
    setUploadProgress(0);
    isRecordingSegmentRef.current = true;

    recordNextSegment();

    setIsRecording(true);

    console.log("🎥 Recording started with merged audio (mic + AI)");

  } catch (err) {
    console.error("Recording failed:", err);
  }
};

let nextRecorder: MediaRecorder | null = null;

const recordNextSegment = () => {
  if (!recordingStreamRef.current || !isRecordingSegmentRef.current) return;

  const chunks: Blob[] = [];
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  const isChrome = /chrome/i.test(navigator.userAgent) && !/edge/i.test(navigator.userAgent);

   let mimeType: string;
  let blobType: string;
  
  if (isSafari) {
    // Safari only supports MP4
    mimeType = 'video/mp4';
    blobType = 'video/mp4';
    console.log('🍎 Safari detected, using MP4 format');
  } else {
    // Chrome, Firefox, Edge support WebM
    mimeType = 'video/webm';
    blobType = 'video/webm';
    console.log('🌐 Chrome/Firefox detected, using WebM format');
  }
  const mediaRecorder = new MediaRecorder(recordingStreamRef.current, {
    mimeType: mimeType,
    videoBitsPerSecond: 300000,
    audioBitsPerSecond: 32000,
  });

    recordingFormatRef.current = mimeType;

  mediaRecorderRef.current = mediaRecorder;

  mediaRecorder.ondataavailable = (event) => {
    if (event.data.size > 0) chunks.push(event.data);
  };

  mediaRecorder.onstop = async () => {
    const blob = new Blob(chunks, { type:blobType });

    const index = chunkIndexRef.current++;
    totalChunksRef.current++;
    setTotalChunksToUpload(totalChunksRef.current);

    await uploadChunkDirectly(
      blob,
    token,
      index,
      sessionIdRef.current,
      recordingIdRef.current,
      recordingFormatRef.current
    );

    setUploadedChunks(prev => prev + 1);
  };

  // 🔥 START current recorder
  mediaRecorder.start();

  // 🔥 PREPARE NEXT recorder BEFORE stopping this one
  setTimeout(() => {
    if (!isRecordingSegmentRef.current) return;

    recordNextSegment(); // start next BEFORE stopping current

    // slight overlap (important)
    setTimeout(() => {
      if (mediaRecorder.state === "recording") {
        mediaRecorder.stop();
      }
    }, 200); // overlap window

  }, 40000);
};

const stopVideoRecording = async () => {
  return new Promise<void>((resolve) => {
    isRecordingSegmentRef.current = false;
    
    // Clear all timeouts
    if (segmentTimeoutRef.current) clearTimeout(segmentTimeoutRef.current);
    
    // Stop current recorder if active
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    
    // Wait for final stop/upload to finish
    setTimeout(() => {
      if (recordingStreamRef.current) {
        recordingStreamRef.current.getTracks().forEach(track => track.stop());
        recordingStreamRef.current = null;
      }
      setIsRecording(false);
      console.log(`📊 Recording stopped. Uploaded ${uploadedChunks}/${totalChunksRef.current} segments`);
      resolve();
    }, 2000);
  });
};

  // Toggle recording manually
  const toggleRecording = async () => {
    if (isRecording) {
      await stopVideoRecording();
    } else {
      await startVideoRecording();
    }
  };

  // Toggle mic for interview
  const toggleMic = () => {
    if (!clientRef.current) return;
    if (isMicOn) {
      clientRef.current.mute();
      console.log('Microphone muted');
    } else {
      clientRef.current.unmute();
      console.log('Microphone unmuted');
    }
    setIsMicOn(!isMicOn);
  };

  // Toggle video for interview
  const toggleVideo = async () => {
    if (!isVideoOn) {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } else {
      const stream = videoRef.current?.srcObject as MediaStream;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (videoRef.current) videoRef.current.srcObject = null;
    }
    setIsVideoOn(!isVideoOn);
  };

  // Toggle fullscreen
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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recordingStreamRef.current) {
        recordingStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (clientRef.current) {
        clientRef.current.stopCall();
      }
    };
  }, []);


// Replace the return section with this:

return (
  <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-2 sm:p-4">
    {/* Main Card Window - Mobile First */}
    <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg shadow-indigo-100/30 overflow-hidden border border-indigo-50 max-h-[90vh] sm:max-h-[85vh] flex flex-col">
      {/* Error Message - Show if invite is invalid/expired */}
{inviteError && (
  <motion.div 
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    className="mb-4 sm:mb-6"
  >
    <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-xl p-4 sm:p-6 border border-red-200 shadow-sm">
      <div className="flex flex-col items-center text-center gap-3 sm:gap-4">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center">
          <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />
        </div>
        <div className="space-y-2">
          <h3 className="text-base sm:text-lg font-bold text-red-700">Interview Invite Invalid</h3>
          <p className="text-sm sm:text-base text-gray-600 max-w-md">
            {inviteError}
          </p>
        </div>

      </div>
    </div>
  </motion.div>
)}
      {/* Header - Compact for mobile */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-3 sm:px-6 py-3 border-b border-indigo-50 bg-gradient-to-r from-indigo-50/30 to-purple-50/30 flex-shrink-0">
        <div className="flex items-center justify-between sm:justify-start gap-3">
          <img src={logo} alt="Logo" className="h-6 sm:h-7 w-auto" />
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${callActive ? 'bg-emerald-500 animate-pulse' : 'bg-gray-300'}`} />
            <p className="text-[10px] sm:text-xs text-gray-500 font-medium truncate">
              {callActive ? 'Interview in Progress' : 'Ready to Start'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 bg-white rounded-lg shadow-sm border border-indigo-50">
            <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-indigo-500" />
            <span className="font-mono text-[10px] sm:text-xs font-semibold text-gray-700">{formatTime(elapsedTime)}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 bg-white rounded-lg shadow-sm border border-indigo-50">
            {getConnectionIcon()}
            <span className="text-[10px] sm:text-xs text-gray-500 hidden xs:inline capitalize">{connectionQuality}</span>
          </div>
        </div>
      </div>

      {/* Main Content - Mobile responsive layout */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-6">
        {/* Stack vertically on mobile, horizontal on larger screens */}
        <div className="flex flex-col lg:flex-row justify-center gap-4 sm:gap-6 items-center lg:items-start h-full">
          
          {/* Left: AI Interviewer - Responsive sizing */}
          <div className="w-full max-w-xs lg:flex-1 space-y-2">
            <div className="flex items-center justify-center gap-2">
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Bot className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
              </div>
              <span className="text-[11px] sm:text-xs font-semibold text-gray-700">AI Interviewer</span>
              {isThinking && <span className="text-[8px] sm:text-[10px] text-purple-500">Thinking...</span>}
            </div>
            
            <div className="relative aspect-[4/3] sm:aspect-[14/16] bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-xl overflow-hidden shadow-md shadow-purple-100 ring-1 ring-purple-50">
              <div className="absolute inset-0 flex flex-col items-center justify-center p-3 sm:p-4">
                {/* AI Avatar */}
                <motion.div
                  animate={callActive ? { scale: [1, 1.03, 1] } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="relative mb-4 sm:mb-6"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-200">
                    <Bot className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                  </div>
                  {callActive && (
                    <div className="absolute inset-0 rounded-xl border-2 border-purple-400 animate-ping opacity-20" />
                  )}
                </motion.div>

                {/* AI Status - Mobile optimized */}
                {callActive && (
                  <div className="text-center space-y-3 sm:space-y-4 w-full px-2">
                    <div className="inline-flex items-center gap-1.5 px-2 sm:px-3 py-0.5 sm:py-1 bg-white rounded-full shadow-sm">
                      <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                      <span className="text-[10px] sm:text-xs font-medium text-gray-700">
                        {isThinking ? 'Analyzing...' : 'Active'}
                      </span>
                    </div>
                  </div>
                )}

                {!callActive && (
                  <div className="text-center space-y-2 sm:space-y-3">
                    <Bot className="w-12 h-12 sm:w-16 sm:h-16 text-purple-300 mx-auto" />
                    <p className="text-[10px] sm:text-xs text-gray-400">Ready to begin</p>
                  </div>
                )}
                
                {/* AI Confidence - Mobile friendly */}
                {callActive && (
                  <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4">
                    <div className="bg-white/90 backdrop-blur-sm rounded-lg p-1.5 sm:p-2.5">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[8px] sm:text-[10px] text-gray-500 font-medium">Analysis</span>
                        <span className="text-[8px] sm:text-[10px] font-bold text-purple-600">
                          {Math.round(aiConfidence)}%
                        </span>
                      </div>
                      <div className="h-0.5 sm:h-1 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full"
                          animate={{ width: `${aiConfidence}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
   
          {/* Center: Divider - Hidden on mobile, visible on larger screens */}
          <div className="hidden lg:flex flex-col items-center justify-center pt-20 gap-6 flex-shrink-0">
            <div className="w-px h-10 bg-gradient-to-b from-transparent via-indigo-200 to-transparent" />
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-md shadow-indigo-200">
              <Activity className="w-4 h-4 text-white animate-pulse" />
            </div>
            <div className="w-px h-10 bg-gradient-to-b from-transparent via-indigo-200 to-transparent" />
          </div>
      
          {/* Right: Candidate Camera - Mobile responsive */}
          <div className="w-full max-w-xs lg:flex-1 space-y-2">
            <div className="flex items-center justify-center gap-2">
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                <User className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
              </div>
              <span className="text-[11px] sm:text-xs font-semibold text-gray-700">You</span>
              {!isVideoOn && <span className="text-[8px] sm:text-[10px] text-rose-500">(Off)</span>}
            </div>
            
            <div className="relative aspect-[4/3] sm:aspect-[14/16] bg-gradient-to-b from-gray-900 to-gray-800 rounded-xl overflow-hidden shadow-md shadow-indigo-100 ring-1 ring-indigo-50">
              {isVideoOn ? (
                <video 
                  ref={videoRef} 
                  autoPlay 
                  muted 
                  playsInline 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-gray-800 to-gray-900 gap-3 sm:gap-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-700 flex items-center justify-center">
                    <User className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
                  </div>
                  <span className="text-xs sm:text-sm text-gray-400">Camera off</span>
                </div>
              )}
              
              {/* Mic Status - Mobile optimized position */}
              {callActive && (
                <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 bg-black/50 backdrop-blur-md px-2 sm:px-3 py-1 sm:py-1.5 rounded-full flex items-center gap-1">
                  {isMicOn ? (
                    <Mic className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400" />
                  ) : (
                    <MicOff className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-rose-400" />
                  )}
                  <span className="text-[8px] sm:text-[10px] text-white font-medium hidden xs:inline">
                    {isMicOn ? 'Live' : 'Muted'}
                  </span>
                </div>
              )}
              
              {/* Name Tag */}
              <div className="absolute top-2 sm:top-4 left-2 sm:left-3 bg-white/90 backdrop-blur-md px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
                <span className="text-[8px] sm:text-[10px] font-semibold text-gray-700">You</span>
              </div>

              {/* Audio Level */}
              {callActive && isMicOn && (
                <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-3 flex items-center gap-0.5 sm:gap-1">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-0.5 sm:w-1 rounded-full transition-all ${
                        audioLevel > (i + 1) * 33 
                          ? 'bg-emerald-400 h-3 sm:h-4' 
                          : 'bg-gray-600 h-1.5 sm:h-2'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Live Transcription - Mobile responsive */}
        {callActive && transcription.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 sm:mt-6 p-2 sm:p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 max-w-lg mx-auto"
          >
            <div className="flex items-center gap-1.5 mb-1.5 sm:mb-2">
              <Activity className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-purple-500" />
              <p className="text-[8px] sm:text-[10px] font-semibold text-purple-600 uppercase tracking-wider">
                Live Transcription
              </p>
            </div>
            <p className="text-[10px] sm:text-xs text-gray-700 leading-relaxed line-clamp-2">
              "{transcription[transcription.length - 1]}"
            </p>
          </motion.div>
        )}

        {/* Tips Panel - Stacked on mobile */}
        {!callActive && showTips && (
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 sm:mt-6 max-w-lg mx-auto"
          >
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-3 sm:p-4 border border-indigo-100">
              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500" />
                <h3 className="text-[11px] sm:text-xs font-semibold text-gray-700">Quick Tips</h3>
              </div>
              
              {/* Grid becomes column on very small screens */}
              <div className="grid grid-cols-1 xs:grid-cols-2 gap-1.5 sm:gap-2">
                {[
                  { icon: Shield, text: "Stable internet", color: "text-blue-500", shortText: "Internet" },
                  { icon: Zap, text: "Quiet environment", color: "text-amber-500", shortText: "Environment" },
                  { icon: CheckCircle, text: "Speak clearly", color: "text-emerald-500", shortText: "Speak clearly" },
                  { icon: Settings, text: "Test microphone", color: "text-purple-500", shortText: "Test mic" }
                ].map((tip, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-white rounded-lg hover:shadow-sm transition-shadow">
                    <tip.icon className={`w-3 h-3 sm:w-4 sm:h-4 ${tip.color} flex-shrink-0`} />
                    <span className="text-[9px] sm:text-[11px] text-gray-600 truncate">
                      <span className="hidden xs:inline">{tip.text}</span>
                      <span className="xs:hidden">{tip.shortText}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Mic Muted Warning - Mobile responsive */}
        {callActive && !isMicOn && (
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 sm:mt-4 p-2 sm:p-3 bg-amber-50 rounded-xl border border-amber-200 max-w-lg mx-auto"
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 flex-shrink-0" />
              <p className="text-[10px] sm:text-xs text-amber-800">Mic is muted. Click to unmute.</p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Controls Footer - Mobile optimized */}
      <div className="border-t border-indigo-50 bg-gradient-to-r from-white via-indigo-50/20 to-white px-3 sm:px-6 py-2 sm:py-3 flex-shrink-0">
        <div className="flex flex-col items-center justify-center gap-2 max-w-2xl mx-auto">
        <button
  onClick={callActive ? endCall : startCall}
  disabled={isStartingCall || isEndingCall}
  className={`w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all transform hover:scale-105 active:scale-95 shadow-md ${
    !callActive
      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-indigo-200'
      : 'bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:from-rose-600 hover:to-pink-600 shadow-rose-200'
  } ${(isStartingCall || isEndingCall) ? 'opacity-70 cursor-not-allowed hover:scale-100' : ''}`}
>
  <div className="flex items-center justify-center gap-2">
    {(isStartingCall || isEndingCall) ? (
      <>
        <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
        <span>{isStartingCall ? 'Connecting...' : 'Ending...'}</span>
      </>
    ) : (
      <>
        {!callActive ? (
          <>
            <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Start Interview</span>
          </>
        ) : (
          <>
            <PhoneOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>End Interview</span>
          </>
        )}
      </>
    )}
  </div>
</button>
        </div>

        {/* Recording Indicator */}
        {isRecording && (
          <div className="flex justify-center mt-2">
            <div className="flex items-center gap-1 px-2 py-0.5 sm:px-3 sm:py-1 bg-rose-50 rounded-full border border-rose-200">
              <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-rose-500 rounded-full animate-pulse" />
              <span className="text-[8px] sm:text-[10px] font-medium text-rose-600">Recording</span>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);
}