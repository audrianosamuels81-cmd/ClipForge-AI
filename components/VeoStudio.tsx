import React, { useState, useEffect } from 'react';
import { CapturedFrame, AppState, GeneratedVideo } from '../types';
import { generateVideoFromImage } from '../services/geminiService';
import { Clapperboard, Video as VideoIcon, Download, AlertCircle, PlayCircle, Lock, Ratio, ArrowRight, X, ExternalLink, ShieldOff } from 'lucide-react';
import { moderatePrompt, logModerationEvent } from '../services/moderationService';
import RightsConfirmation from './RightsConfirmation';
import { useI18n } from '../services/i18nContext';

interface VeoStudioProps {
  selectedFrame: CapturedFrame | null;
  apiKey?: string;
}

const VEO_RATIOS = [
  { label: 'Landscape 16:9', value: '16:9' },
  { label: 'Portrait 9:16', value: '9:16' },
];

const VeoStudio: React.FC<VeoStudioProps> = ({ selectedFrame, apiKey }) => {
  const { t } = useI18n();
  const [prompt, setPrompt] = useState('');
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [error, setError] = useState<string | null>(null);
  const [generatedVideo, setGeneratedVideo] = useState<GeneratedVideo | null>(null);
  const [aspectRatio, setAspectRatio] = useState<string>('16:9');
  const [startFrame, setStartFrame] = useState<CapturedFrame | null>(null);
  const [endFrame, setEndFrame] = useState<CapturedFrame | null>(null);
  const [activeSlot, setActiveSlot] = useState<'start' | 'end'>('start');
  const [moderationError, setModerationError] = useState<string | null>(null);
  const [showRightsConfirm, setShowRightsConfirm] = useState(false);

  useEffect(() => {
    if (selectedFrame) {
      if (activeSlot === 'start') {
        setStartFrame(selectedFrame);
      } else {
        setEndFrame(selectedFrame);
      }
    }
  }, [selectedFrame, activeSlot]);

  useEffect(() => {
    if (!startFrame && selectedFrame) {
      setStartFrame(selectedFrame);
    }
  }, []);

  const hasAiStudio = typeof window !== 'undefined' && (window as any).aistudio;

  const handleGenerateVideo = async () => {
    if (!startFrame) {
        setError(t('selectAtLeastOneFrame'));
        return;
    }
    setModerationError(null);
    if (prompt.trim()) {
      const moderation = moderatePrompt(prompt);
      if (!moderation.passed) {
        setModerationError(moderation.message);
        logModerationEvent('video_prompt_blocked', { prompt, category: moderation.category, message: moderation.message });
        setError(moderation.message);
        setAppState(AppState.ERROR);
        return;
      }
    }
    setShowRightsConfirm(true);
  };
  
  const handleGenerateVideoConfirmed = async () => {
    setShowRightsConfirm(false);
    if (!startFrame) {
        setError(t('selectAtLeastOneFrame'));
        return;
    }
    if (hasAiStudio) {
      try {
        const hasKey = await (window as any).aistudio.hasSelectedApiKey();
        if (!hasKey) {
           await (window as any).aistudio.openSelectKey();
        }
      } catch (e) {
        console.error("Error checking API key status:", e);
      }
    }
    setAppState(AppState.GENERATING);
    setError(null);
    setGeneratedVideo(null);
    try {
      const endImage = endFrame ? endFrame.dataUrl : undefined;
      const videoUrl = await generateVideoFromImage(startFrame.dataUrl, prompt, aspectRatio, apiKey, endImage);
      setGeneratedVideo({
        videoUrl,
        promptUsed: prompt,
        createdAt: Date.now()
      });
      logModerationEvent('video_generated', { prompt });
      setAppState(AppState.IDLE);
    } catch (err: any) {
      console.error(err);
      let errMsg = err.message || "Video generation failed.";
      if (errMsg.includes("403") || errMsg.includes("Permission Denied")) {
          errMsg = "Permission Denied (403): Veo requires a PAID Google Cloud API Key with billing enabled.";
          if (hasAiStudio) {
             try { await (window as any).aistudio.openSelectKey(); } catch {}
          }
      }
      setError(errMsg);
      setAppState(AppState.ERROR);
    }
  };

  const clearEndFrame = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEndFrame(null);
    setActiveSlot('end');
  };

  return (
    <div className="flex flex-col h-full overflow-hidden p-4 space-y-4">
      <div className="bg-[#111] rounded-xl border border-[#1a1a1a] p-4 space-y-4 shadow-lg shrink-0">
        <div className="flex gap-4 items-center">
            <div 
                onClick={() => setActiveSlot('start')}
                className={`relative w-32 h-24 rounded-lg border-2 overflow-hidden cursor-pointer transition-all group ${
                    activeSlot === 'start' ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-[#222] hover:border-[#333]'
                }`}
            >
                {startFrame ? (
                    <img src={startFrame.dataUrl} className="w-full h-full object-cover" alt="Start" />
                ) : (
                    <div className="w-full h-full bg-[#0a0a0a] flex flex-col items-center justify-center text-[#666]">
                        <Clapperboard className="w-6 h-6 mb-1" />
                        <span className="text-[10px]">{t('startFrame')}</span>
                    </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[9px] px-1 py-0.5 text-center">
                    Start Frame
                </div>
            </div>

            <ArrowRight className="w-5 h-5 text-[#666]" />

            <div 
                onClick={() => setActiveSlot('end')}
                className={`relative w-32 h-24 rounded-lg border-2 overflow-hidden cursor-pointer transition-all group ${
                    activeSlot === 'end' ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-[#222] hover:border-[#333]'
                }`}
            >
                {endFrame ? (
                    <>
                        <img src={endFrame.dataUrl} className="w-full h-full object-cover" alt="End" />
                        <button 
                            onClick={clearEndFrame}
                            className="absolute top-1 right-1 bg-black/50 hover:bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </>
                ) : (
                    <div className="w-full h-full bg-[#0a0a0a] flex flex-col items-center justify-center text-[#666] border-dashed border-[#222]">
                        <div className="border border-dashed border-[#333] rounded p-1 mb-1">
                            <Clapperboard className="w-4 h-4 opacity-50" />
                        </div>
                        <span className="text-[10px] text-center px-2">{t('endFrameOptional')}</span>
                    </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[9px] px-1 py-0.5 text-center">
                    End Frame
                </div>
            </div>

            <div className="flex-1 min-w-0 flex flex-col h-24">
                 <textarea 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={t('promptHint')}
                    className="flex-1 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-2 text-sm text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none mb-2 placeholder-[#666]"
                />
            </div>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-[#1a1a1a]/50">
           <div className="flex items-center gap-2">
             <span className="text-xs text-[#888] flex items-center gap-1"><Ratio className="w-3 h-3"/> {t('aspectRatioVeo')}</span>
             <div className="flex bg-[#0a0a0a] rounded-lg p-1 border border-[#1a1a1a]">
               {VEO_RATIOS.map(r => (
                 <button
                   key={r.value}
                   onClick={() => setAspectRatio(r.value)}
                   className={`px-3 py-1 text-[10px] rounded transition-all ${aspectRatio === r.value ? 'bg-[#1a1a1a] text-white shadow' : 'text-[#888] hover:text-white'}`}
                 >
                   {r.label}
                 </button>
               ))}
             </div>
           </div>

           <button
             onClick={handleGenerateVideo}
             disabled={appState === AppState.GENERATING || !startFrame}
             className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-6 py-2 rounded-lg text-sm font-bold shadow-lg shadow-emerald-900/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
           >
             {appState === AppState.GENERATING ? (
               <>
                 <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                 {t('generatingVideo')}
               </>
             ) : (
               <>
                 <PlayCircle className="w-4 h-4" /> {t('generateVideo')}
               </>
             )}
           </button>
        </div>
        
        <div className="flex items-start gap-2 text-[10px] text-[#888] bg-[#0a0a0a]/50 p-2 rounded">
           <Lock className="w-3 h-3 mt-0.5" />
           <p>{t('videoTip')} <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="text-blue-500 hover:underline">View billing</a></p>
        </div>

        <div className="pt-2 border-t border-[#1a1a1a] flex flex-col sm:flex-row items-start sm:items-center gap-2 text-[10px]">
           <span className="text-[#888] font-medium whitespace-nowrap">{t('thirdPartyTools')}</span>
           <div className="flex items-center gap-3 text-[#888]">
              <a href="https://app.klingai.com/cn/" target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-blue-400 hover:underline transition-colors group">
                KlingAI <ExternalLink className="w-2.5 h-2.5 opacity-60 group-hover:opacity-100" />
              </a>
              <span className="text-[#333]">|</span>
              <a href="https://jimeng.jianying.com/" target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-blue-400 hover:underline transition-colors group">
                JimengAI <ExternalLink className="w-2.5 h-2.5 opacity-60 group-hover:opacity-100" />
              </a>
              <span className="text-[#333]">|</span>
              <a href="https://wuli.art/" target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-blue-400 hover:underline transition-colors group">
                WuliAI <ExternalLink className="w-2.5 h-2.5 opacity-60 group-hover:opacity-100" />
              </a>
           </div>
        </div>
      </div>

      {moderationError && (
        <div className="bg-amber-900/20 border border-amber-700/30 text-amber-200 p-3 rounded-lg text-xs flex items-start gap-2 animate-in fade-in shrink-0">
          <ShieldOff className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-400" />
          <div className="space-y-1">
            <p className="font-bold text-amber-300">⚠️ Content Policy Notice</p>
            <p>{moderationError}</p>
            <p className="text-amber-400/70 mt-1">Please provide your own original content or content you have permission to use.</p>
          </div>
        </div>
      )}

      {error && !moderationError && (
        <div className="bg-red-900/20 border border-red-900/50 text-red-300 p-3 rounded-lg text-xs flex gap-2 items-center animate-pulse shrink-0">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="font-bold">{error}</span>
        </div>
      )}

      <div className="flex-1 min-h-0 bg-black rounded-xl border border-[#1a1a1a] overflow-hidden relative group flex items-center justify-center">
        {generatedVideo ? (
          <div className="relative w-full h-full flex items-center justify-center">
             <video 
               src={generatedVideo.videoUrl} 
               controls 
               loop 
               autoPlay 
               className="max-h-full max-w-full"
             />
             <a 
               href={generatedVideo.videoUrl} 
               download={`veo-video-${Date.now()}.mp4`}
               className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full backdrop-blur-md transition-all opacity-0 group-hover:opacity-100"
               title="Download video"
             >
               <Download className="w-5 h-5" />
             </a>
          </div>
        ) : (
          <div className="text-center text-[#666]">
             <VideoIcon className="w-16 h-16 mx-auto mb-4 opacity-20" />
             <p className="text-sm">{t('preview')}</p>
             <p className="text-xs text-[#555] mt-2">{t('selectStartAndEndFrames')}</p>
          </div>
        )}
      </div>

      {showRightsConfirm && (
        <RightsConfirmation
          context="video"
          onConfirm={handleGenerateVideoConfirmed}
          onCancel={() => {
            setShowRightsConfirm(false);
            setAppState(AppState.IDLE);
          }}
        />
      )}
    </div>
  );
};

export default VeoStudio;
