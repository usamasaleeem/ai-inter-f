import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  SkipBack,
  SkipForward,
  RotateCcw as Replay,
  Bot,
  Activity,
  MessageSquare,
} from 'lucide-react';
import { motion } from 'motion/react';

interface VideoChunk {
  url: string;
  duration: number;
  index: number;
}

interface TranscriptMessage {
  id: string;
  speaker: string;
  text: string;
  timestamp: string;
}

interface InterviewVideoPlayerProps {
  chunks: VideoChunk[];
  onError?: (error: Error) => void;
  candidateName?: string;
  interviewDate?: string;
  transcript?: TranscriptMessage[];
}

export function InterviewVideoPlayer({ 
  chunks, 
  onError, 
  candidateName = "Candidate",
  interviewDate,
  transcript = []
}: InterviewVideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showTranscript, setShowTranscript] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const nextVideoRef = useRef<HTMLVideoElement>(null);
  const preloadedChunks = useRef<Set<string>>(new Set());

  // Calculate total duration
  useEffect(() => {
    if (!chunks || chunks.length === 0) return;
    const totalDuration = chunks.reduce((sum, chunk) => sum + chunk.duration, 0);
    setDuration(totalDuration);
  }, [chunks]);

  // Preload next chunks
  const preloadNextChunks = useCallback((currentIdx: number) => {
    for (let i = 1; i <= 2; i++) {
      const nextIdx = currentIdx + i;
      if (nextIdx < chunks.length && !preloadedChunks.current.has(chunks[nextIdx].url)) {
        const preloadVideo = document.createElement('video');
        preloadVideo.preload = 'auto';
        preloadVideo.src = chunks[nextIdx].url;
        preloadVideo.load();
        preloadedChunks.current.add(chunks[nextIdx].url);
      }
    }
  }, [chunks]);

  // Initialize first chunk
  useEffect(() => {
    if (!videoRef.current || !chunks.length) return;
    const firstChunk = chunks[0];
    if (firstChunk?.url) {
      videoRef.current.src = firstChunk.url;
      videoRef.current.load();
      setCurrentChunkIndex(0);
      preloadNextChunks(0);
    }
  }, [chunks, preloadNextChunks]);

  // Find chunk index for time
  const findChunkIndex = useCallback((time: number) => {
    let accumulated = 0;
    for (let i = 0; i < chunks.length; i++) {
      if (time < accumulated + chunks[i].duration) return i;
      accumulated += chunks[i].duration;
    }
    return chunks.length - 1;
  }, [chunks]);

  // Time conversions
  const globalToLocalTime = useCallback((globalTime: number, chunkIdx: number) => {
    let accumulated = 0;
    for (let i = 0; i < chunkIdx; i++) accumulated += chunks[i].duration;
    return globalTime - accumulated;
  }, [chunks]);

  const localToGlobalTime = useCallback((localTime: number, chunkIdx: number) => {
    let accumulated = 0;
    for (let i = 0; i < chunkIdx; i++) accumulated += chunks[i].duration;
    return accumulated + localTime;
  }, [chunks]);

  // Switch chunks
  const switchToChunk = useCallback(async (newChunkIndex: number, localTime: number, wasPlaying: boolean) => {
    if (!videoRef.current) return;

    const newVideoUrl = chunks[newChunkIndex].url;
    const isPreloaded = preloadedChunks.current.has(newVideoUrl);
    if (!isPreloaded) setIsLoading(true);

    videoRef.current.src = newVideoUrl;
    videoRef.current.load();
    
    await new Promise((resolve) => {
      const onCanPlay = () => {
        videoRef.current?.removeEventListener('canplaythrough', onCanPlay);
        resolve(null);
      };
      videoRef.current?.addEventListener('canplaythrough', onCanPlay);
      setTimeout(resolve, isPreloaded ? 50 : 1000);
    });

    videoRef.current.currentTime = localTime;
    videoRef.current.playbackRate = playbackSpeed;
    setCurrentChunkIndex(newChunkIndex);
    preloadNextChunks(newChunkIndex);

    if (wasPlaying) {
      await videoRef.current.play().catch(console.error);
      setIsPlaying(true);
    }
    setIsLoading(false);
  }, [chunks, preloadNextChunks, playbackSpeed]);

  // Seek to time
  const seekToTime = useCallback(async (targetTime: number) => {
    if (!videoRef.current || !chunks.length) return;
    const newChunkIndex = findChunkIndex(targetTime);
    const localTime = globalToLocalTime(targetTime, newChunkIndex);

    if (newChunkIndex !== currentChunkIndex) {
      await switchToChunk(newChunkIndex, localTime, isPlaying);
    } else {
      videoRef.current.currentTime = localTime;
    }
    setCurrentTime(targetTime);
  }, [chunks, currentChunkIndex, findChunkIndex, globalToLocalTime, isPlaying, switchToChunk]);

  // Time update
  const handleTimeUpdate = useCallback(() => {
    if (!videoRef.current) return;
    const localTime = videoRef.current.currentTime;
    const globalTime = localToGlobalTime(localTime, currentChunkIndex);
    setCurrentTime(globalTime);
    
    const chunkDuration = chunks[currentChunkIndex]?.duration || 0;
    if (chunkDuration - localTime < 5 && currentChunkIndex < chunks.length - 1) {
      preloadNextChunks(currentChunkIndex);
    }
  }, [currentChunkIndex, localToGlobalTime, chunks, preloadNextChunks]);

  // Handle ended
  const handleEnded = useCallback(() => {
    if (currentChunkIndex < chunks.length - 1) {
      switchToChunk(currentChunkIndex + 1, 0, true);
    } else {
      setIsPlaying(false);
      setCurrentTime(duration);
    }
  }, [currentChunkIndex, chunks.length, switchToChunk, duration]);

  // Play/Pause
  const togglePlay = useCallback(async () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      if (currentTime >= duration - 0.1) await seekToTime(0);
      try {
        await videoRef.current.play();
        setIsPlaying(true);
      } catch (error) {
        console.error('Play failed:', error);
      }
    }
  }, [isPlaying, duration, currentTime, seekToTime]);

  // Controls
  const handleSeek = useCallback((value: number[]) => seekToTime(value[0]), [seekToTime]);
  
  const toggleMute = useCallback(() => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  }, [isMuted]);

  const handleVolumeChange = useCallback((value: number[]) => {
    if (!videoRef.current) return;
    videoRef.current.volume = value[0];
    setVolume(value[0]);
    setIsMuted(value[0] === 0);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  const skipForward = useCallback(() => seekToTime(Math.min(currentTime + 10, duration)), [currentTime, duration, seekToTime]);
  const skipBackward = useCallback(() => seekToTime(Math.max(currentTime - 10, 0)), [currentTime, seekToTime]);
  const restart = useCallback(() => { seekToTime(0); if (!isPlaying) togglePlay(); }, [seekToTime, isPlaying, togglePlay]);

  const cyclePlaybackSpeed = useCallback(() => {
    const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
    const currentIdx = speeds.indexOf(playbackSpeed);
    const newSpeed = speeds[(currentIdx + 1) % speeds.length];
    setPlaybackSpeed(newSpeed);
    if (videoRef.current) videoRef.current.playbackRate = newSpeed;
  }, [playbackSpeed]);

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      switch (e.code) {
        case 'Space': e.preventDefault(); togglePlay(); break;
        case 'ArrowLeft': e.preventDefault(); skipBackward(); break;
        case 'ArrowRight': e.preventDefault(); skipForward(); break;
        case 'KeyF': toggleFullscreen(); break;
        case 'KeyM': toggleMute(); break;
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [togglePlay, skipBackward, skipForward, toggleFullscreen, toggleMute]);

  useEffect(() => {
    return () => { if (videoRef.current) videoRef.current.pause(); };
  }, []);

  if (!chunks || chunks.length === 0) {
    return (
      <div className="flex items-center justify-center p-12 text-gray-400">
        <p>No video chunks available</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-start justify-center p-4">
      <div ref={containerRef} className="w-full max-w-4xl bg-white rounded-2xl shadow-lg shadow-indigo-100/30 overflow-hidden border border-indigo-50 flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-indigo-50 bg-gradient-to-r from-indigo-50/30 to-purple-50/30 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-800">Interview Recording</h3>
              {interviewDate && (
                <p className="text-[10px] text-gray-500">{interviewDate}</p>
              )}
            </div>
          </div>
          
          {/* Transcript Toggle Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowTranscript(!showTranscript)}
            className="gap-2 text-gray-600"
          >
            <MessageSquare className="h-4 w-4" />
            {showTranscript ? 'Hide Transcript' : 'Show Transcript'}
          </Button>
        </div>

        {/* Main Content - Portrait Layout */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex justify-center gap-6 items-start h-full">
            
            {/* Left: AI Interviewer - Portrait */}
            <div className="flex-1 max-w-xs space-y-2">
              <div className="relative aspect-[14/16] bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-xl overflow-hidden shadow-md shadow-purple-100 ring-1 ring-purple-50">
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                  <motion.div
                    animate={isPlaying ? { scale: [1, 1.03, 1] } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="relative mb-6"
                  >
                    <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-200">
                      <Bot className="w-10 h-10 text-white" />
                    </div>
                    {isPlaying && (
                      <div className="absolute inset-0 rounded-xl border-2 border-purple-400 animate-ping opacity-20" />
                    )}
                  </motion.div>

                  <div className="text-center space-y-3">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white rounded-full shadow-sm">
                      <div className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-emerald-500 animate-pulse' : 'bg-gray-300'}`} />
                      <span className="text-xs font-medium text-gray-700">
                        {isPlaying ? 'Speaking' : 'Silent'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
     
            {/* Center: Divider */}
            <div className="flex flex-col items-center justify-center pt-20 gap-6 flex-shrink-0">
              <div className="w-px h-10 bg-gradient-to-b from-transparent via-indigo-200 to-transparent" />
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-md shadow-indigo-200">
                <Activity className="w-4 h-4 text-white" />
              </div>
              <div className="w-px h-10 bg-gradient-to-b from-transparent via-indigo-200 to-transparent" />
            </div>
        
            {/* Right: Candidate Video - Portrait */}
            <div className="flex-1 max-w-xs space-y-2">
              <div className="relative aspect-[14/16] bg-black rounded-xl overflow-hidden shadow-md shadow-indigo-100 ring-1 ring-indigo-50">
                <video ref={nextVideoRef} style={{ display: 'none' }} preload="auto" />

                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  onClick={togglePlay}
                  onTimeUpdate={handleTimeUpdate}
                  onEnded={handleEnded}
                  onLoadStart={() => setIsLoading(true)}
                  onCanPlay={() => setIsLoading(false)}
                  onError={() => {
                    setIsLoading(false);
                    onError?.(new Error('Failed to load video chunk'));
                  }}
                  playsInline
                  preload="auto"
                />

                {/* Loading Overlay */}
                {isLoading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="w-10 h-10 border-3 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                )}

                {/* Play Overlay */}
                {!isPlaying && !isLoading && (
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center cursor-pointer" onClick={togglePlay}>
                    <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                      <Play className="w-7 h-7 text-indigo-600 ml-1" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Player Controls - At Bottom of Card */}
        <div className="border-t border-indigo-50 bg-white px-6 py-4 flex-shrink-0">
          {/* Progress Bar */}
          <div className="mb-3">
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={0.1}
              onValueChange={handleSeek}
              className="cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-500 mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            {/* Left Controls */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={restart}
                className="text-gray-500 hover:text-gray-700 h-9 w-9"
                title="Restart"
              >
                <Replay className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={skipBackward}
                className="text-gray-500 hover:text-gray-700 h-9 w-9"
                title="Back 10s"
              >
                <SkipBack className="h-4 w-4" />
              </Button>
            </div>

            {/* Center - Play/Pause */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={skipBackward}
                className="text-gray-500 hover:text-gray-700"
              >
                <SkipBack className="h-4 w-4" />
              </Button>
              
              <Button
                onClick={togglePlay}
                className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 font-semibold text-sm shadow-md shadow-indigo-200 flex items-center gap-2"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>Play</span>
                  </>
                )}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={skipForward}
                className="text-gray-500 hover:text-gray-700"
              >
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={cyclePlaybackSpeed}
                className="text-xs text-gray-600 hover:text-gray-800 font-medium min-w-[40px]"
                title="Playback Speed"
              >
                {playbackSpeed}x
              </Button>
              
              <div className="flex items-center gap-1 group/vol">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMute}
                  className="text-gray-500 hover:text-gray-700 h-9 w-9"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </Button>
                
                <div className="w-24 hidden group-hover/vol:block">
                  <Slider
                    value={[isMuted ? 0 : volume]}
                    max={1}
                    step={0.01}
                    onValueChange={handleVolumeChange}
                  />
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={toggleFullscreen}
                className="text-gray-500 hover:text-gray-700 h-9 w-9"
                title="Fullscreen"
              >
                <Maximize className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Transcript Panel */}
        {showTranscript && transcript && transcript.length > 0 && (
          <div className="border-t border-indigo-50 bg-gray-50 max-h-64 overflow-y-auto">
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-2 mb-3 sticky top-0 bg-gray-50 pb-2">
                <MessageSquare className="h-4 w-4 text-indigo-600" />
                <h4 className="text-sm font-semibold text-gray-800">Interview Transcript</h4>
                <span className="text-xs text-gray-400 ml-auto">{transcript.length} messages</span>
              </div>
              {transcript.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.speaker === 'AI' ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.speaker === 'AI'
                        ? 'bg-white border border-gray-200'
                        : 'bg-indigo-50 border border-indigo-100'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-gray-600">
                        {message.speaker === 'AI' ? 'AI Interviewer' : candidateName}
                      </span>
                      <span className="text-xs text-gray-400">{message.timestamp}</span>
                    </div>
                    <p className="text-sm text-gray-700">{message.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}