import React, { useState, useEffect } from 'react';
import { CapturedFrame, WorkflowStep, GeneratedImage } from './types';
import VideoPlayer from './components/VideoPlayer';
import ScreenshotGallery from './components/ScreenshotGallery';
import CreativeStudio from './components/CreativeStudio';
import VeoStudio from './components/VeoStudio';
import CaptionStudio from './components/CaptionStudio';
import FrameInfoSidebar from './components/FrameInfoSidebar';
import RightsConfirmation from './components/RightsConfirmation';
import AcceptableUsePolicy from './components/AcceptableUsePolicy';
import { secureSetItem, secureGetItem } from './services/secureStorage';
import { I18nProvider, useI18n } from './services/i18nContext';
import { Language } from './services/i18n';
import { Clapperboard, Layers, Video as VideoIcon, Image as ImageIcon, Camera, KeyRound, CheckCircle2, Download, XCircle, AlertCircle, Shield, Globe, MessageSquareText } from 'lucide-react';

const LanguageSwitcher = () => {
  const { language, setLanguage } = useI18n();
  
  return (
    <button
      onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#1a1a1a] text-[#888] hover:text-white hover:border-[#333] transition-all text-xs"
      title="Switch Language"
    >
      <Globe className="w-3.5 h-3.5" />
      <span>{language === 'en' ? 'EN' : '中文'}</span>
    </button>
  );
};

const AppContent: React.FC = () => {
  const { t, language } = useI18n();
  const [frames, setFrames] = useState<CapturedFrame[]>([]);
  const [selectedFrame, setSelectedFrame] = useState<CapturedFrame | null>(null);
  const [currentStep, setCurrentStep] = useState<WorkflowStep>(WorkflowStep.CAPTURE);
  const [seekTimestamp, setSeekTimestamp] = useState<number | null>(null);
  
  const [apiKey, setApiKey] = useState<string>('');
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [keyError, setKeyError] = useState<string | null>(null);
  
  const [rightsConfirmed, setRightsConfirmed] = useState<boolean>(() => {
    return localStorage.getItem('clipforge_rights_confirmed') === 'true';
  });
  const [showRightsConfirm, setShowRightsConfirm] = useState(false);
  const [pendingCaptureCallback, setPendingCaptureCallback] = useState<(() => void) | null>(null);
  const [showPolicyModal, setShowPolicyModal] = useState(false);

  useEffect(() => {
    const loadKey = async () => {
      const storedKey = await secureGetItem('gemini_api_key');
      if (storedKey) setApiKey(storedKey);
    };
    loadKey();
  }, []);

  const handleSaveApiKey = async () => {
    const trimmedKey = apiKey.trim();
    
    if (!trimmedKey) {
      setKeyError('API Key cannot be empty');
      return;
    }

    if (!trimmedKey.startsWith('AIza')) {
       setKeyError('Invalid Key format (should start with AIza)');
       return;
    }

    await secureSetItem('gemini_api_key', trimmedKey);
    setApiKey(trimmedKey);
    setShowKeyInput(false);
    setKeyError(null);
  };

  const handleCancelKeyInput = async () => {
    setShowKeyInput(false);
    setKeyError(null);
    const storedKey = await secureGetItem('gemini_api_key');
    setApiKey(storedKey || '');
  };

  const handleCapture = (frame: CapturedFrame) => {
    if (!rightsConfirmed) {
      setPendingCaptureCallback(() => {
        setFrames(prev => [...prev, frame]);
        if (!selectedFrame) {
          setSelectedFrame(frame);
        }
      });
      setShowRightsConfirm(true);
      return;
    }
    
    setFrames(prev => [...prev, frame]);
    if (!selectedFrame) {
      setSelectedFrame(frame);
    }
  };
  
  const confirmRights = () => {
    setShowRightsConfirm(false);
    setRightsConfirmed(true);
    localStorage.setItem('clipforge_rights_confirmed', 'true');
    if (pendingCaptureCallback) {
      pendingCaptureCallback();
      setPendingCaptureCallback(null);
    }
  };

  const handleSelectFrame = (frame: CapturedFrame) => {
    setSelectedFrame(frame);
    if (currentStep === WorkflowStep.CAPTURE) {
      setSeekTimestamp(frame.timestamp);
    }
  };

  const handleDeleteFrame = (id: string) => {
    setFrames(prev => prev.filter(f => f.id !== id));
    if (selectedFrame?.id === id) {
      setSelectedFrame(null);
    }
  };

  const handleDownloadFrame = (frame: CapturedFrame) => {
    const link = document.createElement('a');
    link.href = frame.dataUrl;
    link.download = `clipforge-${frame.isGenerated ? 'gen' : 'cap'}-${frame.id}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadFrameEvent = (e: React.MouseEvent, frame: CapturedFrame) => {
    e.stopPropagation();
    handleDownloadFrame(frame);
  };

  const handleImageSaved = (img: GeneratedImage) => {
     const newFrame: CapturedFrame = {
       id: img.id,
       dataUrl: img.dataUrl,
       timestamp: 0,
       createdAt: img.createdAt,
       isGenerated: true
     };
     setFrames(prev => [newFrame, ...prev]);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case WorkflowStep.CAPTURE:
        return (
           <div className="flex h-full overflow-hidden">
             <div className="flex-1 flex flex-col min-w-0 bg-[#0a0a0a] h-full relative">
               <div className="flex-grow relative overflow-hidden bg-black flex flex-col">
                  <div className="absolute inset-0 w-full h-full">
                    <VideoPlayer 
                      onCapture={handleCapture} 
                      seekToTimestamp={seekTimestamp}
                    />
                  </div>
               </div>

               <div className="h-48 bg-[#111] border-t border-[#1a1a1a] flex flex-col flex-shrink-0 z-10">
                  <div className="px-4 py-2 border-b border-[#1a1a1a] flex items-center justify-between bg-[#111] shrink-0">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-[#888] flex items-center gap-2">
                      <Layers className="w-4 h-4 text-blue-500" /> 
                      {t('gallery')}
                      <span className="bg-[#1a1a1a] text-[#888] px-1.5 py-0.5 rounded text-[10px] min-w-[20px] text-center">
                         {frames.length}
                      </span>
                    </h2>
                  </div>
                  <div className="flex-grow overflow-hidden bg-[#0a0a0a]/50 relative">
                    <ScreenshotGallery 
                      frames={frames} 
                      onSelect={handleSelectFrame} 
                      onDelete={handleDeleteFrame}
                      selectedId={selectedFrame?.id || null}
                    />
                  </div>
               </div>
             </div>

             <div className="flex-shrink-0 h-full hidden lg:block">
                <FrameInfoSidebar 
                  frame={selectedFrame} 
                  onDelete={handleDeleteFrame}
                  onDownload={handleDownloadFrame}
                />
             </div>
           </div>
        );
      
      case WorkflowStep.CREATIVE:
        return (
          <div className="flex-1 flex flex-row h-full overflow-hidden">
             <div className="w-64 bg-[#111] border-r border-[#1a1a1a] flex flex-col hidden md:flex">
                <div className="p-3 border-b border-[#1a1a1a] font-bold text-[#888] text-xs">{t('selectFrameToStart')}</div>
                <div className="flex-1 overflow-y-auto p-2">
                   <div className="grid grid-cols-1 gap-2">
                      {frames.map(f => (
                        <div 
                          key={f.id} 
                          onClick={() => handleSelectFrame(f)}
                          className={`aspect-video rounded border overflow-hidden cursor-pointer relative group ${selectedFrame?.id === f.id ? 'border-blue-500 ring-1 ring-blue-500' : 'border-[#222] opacity-60 hover:opacity-100'}`}
                        >
                          <img src={f.dataUrl} className="w-full h-full object-cover" />
                          <div className="absolute top-1 left-1">
                             {f.isGenerated ? (
                               <span className="bg-purple-600 text-white text-[8px] px-1 rounded shadow">AI</span>
                             ) : (
                               <span className="bg-black/60 text-white text-[8px] px-1 rounded shadow">{f.timestamp.toFixed(1)}s</span>
                             )}
                          </div>
                          <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button 
                               onClick={(e) => handleDownloadFrameEvent(e, f)}
                               className="bg-black/70 hover:bg-blue-600 text-white p-1 rounded-full backdrop-blur-sm"
                               title={t('downloadImage')}
                             >
                               <Download className="w-3 h-3" />
                             </button>
                          </div>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
             <div className="flex-1 bg-[#0a0a0a] p-4 overflow-hidden flex flex-col">
                <CreativeStudio 
                  selectedFrame={selectedFrame} 
                  onImageSaved={handleImageSaved} 
                  apiKey={apiKey}
                />
             </div>
          </div>
        );

      case WorkflowStep.VEO:
        return (
          <div className="flex-1 flex flex-row h-full overflow-hidden">
             <div className="w-64 bg-[#111] border-r border-[#1a1a1a] flex flex-col hidden md:flex">
                <div className="p-3 border-b border-[#1a1a1a] font-bold text-[#888] text-xs">Select Material (fills selected slot)</div>
                <div className="flex-1 overflow-y-auto p-2">
                   <div className="grid grid-cols-1 gap-2">
                      {frames.map(f => (
                        <div 
                          key={f.id} 
                          onClick={() => handleSelectFrame(f)}
                          className={`aspect-video rounded border overflow-hidden cursor-pointer relative group ${selectedFrame?.id === f.id ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-[#222] opacity-60 hover:opacity-100'}`}
                        >
                          <img src={f.dataUrl} className="w-full h-full object-cover" />
                          {f.isGenerated && (
                            <span className="absolute top-1 left-1 bg-purple-600 text-white text-[8px] px-1 rounded shadow">AI</span>
                          )}
                           <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={(e) => handleDownloadFrameEvent(e, f)}
                                className="bg-black/70 hover:bg-blue-600 text-white p-1 rounded-full backdrop-blur-sm"
                                title={t('downloadImage')}
                              >
                                <Download className="w-3 h-3" />
                              </button>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
             <div className="flex-1 bg-[#0a0a0a] p-4 overflow-hidden flex flex-col">
                <VeoStudio selectedFrame={selectedFrame} apiKey={apiKey} />
             </div>
          </div>
        );

      case WorkflowStep.CAPTION:
        return (
          <div className="flex-1 bg-[#0a0a0a] p-4 overflow-hidden flex flex-col">
            <CaptionStudio frames={frames} apiKey={apiKey} />
          </div>
        );
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#0a0a0a] text-[#e5e5e5] font-sans overflow-hidden">
      <header className="bg-[#0d0d0d] border-b border-[#1a1a1a] flex-shrink-0 z-20">
        <div className="w-full px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-1.5 rounded-lg shadow-lg shadow-blue-500/20">
              <Clapperboard className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-gray-100 to-gray-400 bg-clip-text text-transparent hidden sm:block">
              ClipForge AI
            </h1>
            
            <div className="flex items-center bg-[#0a0a0a] rounded-lg p-1 border border-[#1a1a1a] ml-4">
               <button 
                 onClick={() => setCurrentStep(WorkflowStep.CAPTURE)}
                 className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm transition-all ${currentStep === WorkflowStep.CAPTURE ? 'bg-[#1a1a1a] text-white font-medium shadow' : 'text-[#888] hover:text-white'}`}
               >
                 <Camera className="w-4 h-4" /> <span className="hidden sm:inline">1. {t('capture')}</span>
               </button>
               <button 
                 onClick={() => setCurrentStep(WorkflowStep.CREATIVE)}
                 className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm transition-all ${currentStep === WorkflowStep.CREATIVE ? 'bg-blue-900/30 text-blue-200 font-medium shadow border border-blue-800/30' : 'text-[#888] hover:text-white'}`}
               >
                 <ImageIcon className="w-4 h-4" /> <span className="hidden sm:inline">2. {t('create')}</span>
               </button>
               <button 
                  onClick={() => setCurrentStep(WorkflowStep.VEO)}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm transition-all ${currentStep === WorkflowStep.VEO ? 'bg-emerald-900/30 text-emerald-200 font-medium shadow border border-emerald-800/30' : 'text-[#888] hover:text-white'}`}
                >
                  <VideoIcon className="w-4 h-4" /> <span className="hidden sm:inline">3. {t('generate')}</span>
                </button>
                <button 
                  onClick={() => setCurrentStep(WorkflowStep.CAPTION)}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm transition-all ${currentStep === WorkflowStep.CAPTION ? 'bg-pink-900/30 text-pink-200 font-medium shadow border border-pink-800/30' : 'text-[#888] hover:text-white'}`}
                >
                  <MessageSquareText className="w-4 h-4" /> <span className="hidden sm:inline">4. {t('caption')}</span>
                </button>
             </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm">
             <div className="relative z-50">
                {showKeyInput ? (
                  <div className="relative">
                    <div className={`flex items-center gap-2 bg-[#1a1a1a] p-1 pr-2 rounded-lg border animate-in fade-in slide-in-from-right-4 duration-200 shadow-xl ${keyError ? 'border-red-500 ring-1 ring-red-500/50' : 'border-[#222]'}`}>
                      <input 
                        type="password" 
                        value={apiKey}
                        onChange={(e) => {
                          setApiKey(e.target.value);
                          if (keyError) setKeyError(null);
                        }}
                        placeholder="Paste Gemini API Key"
                        className="bg-[#0a0a0a] border-none rounded px-2 py-1 text-xs w-48 text-white focus:ring-1 focus:ring-blue-500 outline-none placeholder-[#666]"
                        autoFocus
                      />
                      <button 
                        onClick={handleSaveApiKey} 
                        className="text-green-400 hover:text-green-300 hover:bg-green-900/20 p-1 rounded transition-colors"
                        title="Save and close"
                      >
                        <CheckCircle2 className="w-4 h-4"/>
                      </button>
                      <button 
                        onClick={handleCancelKeyInput} 
                        className="text-[#888] hover:text-white hover:bg-[#222] p-1 rounded transition-colors"
                        title="Cancel"
                      >
                        <XCircle className="w-4 h-4"/>
                      </button>
                    </div>
                    
                    {keyError && (
                      <div className="absolute top-full right-0 mt-2 bg-red-900/90 border border-red-500/30 text-red-200 text-[10px] px-2 py-1 rounded shadow-lg flex items-center gap-1.5 whitespace-nowrap backdrop-blur-md">
                        <AlertCircle className="w-3 h-3" />
                        {keyError}
                      </div>
                    )}
                  </div>
                ) : (
                  <button 
                    onClick={() => setShowKeyInput(true)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all text-xs font-medium ${apiKey ? 'bg-green-900/20 border-green-800 text-green-400 hover:bg-green-900/30' : 'bg-[#1a1a1a] border-[#222] text-[#888] hover:text-white hover:border-[#333]'}`}
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    {apiKey ? t('apiKeyConfigured') : t('setApiKey')}
                  </button>
                )}
             </div>

             <LanguageSwitcher />

             <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-[#1a1a1a] rounded-full border border-[#222]">
               <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
               <span className="text-xs text-[#888] font-medium">{t('geminiVeo')}</span>
             </div>
          </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col overflow-hidden relative">
        {renderStepContent()}
      </main>

      <footer className="bg-[#0d0d0d] border-t border-[#1a1a1a] py-1.5 px-4 flex-shrink-0 z-20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-[10px] text-[#666]">
           <div className="flex items-center gap-2">
             <span className="font-medium text-[#888]">ClipForge AI</span>
             <span>&copy; {new Date().getFullYear()}</span>
             <span className="hidden md:inline text-[#333]">|</span>
             <span className="hidden md:inline">{t('allRightsReserved')}</span>
             <span className="hidden md:inline text-[#333]">|</span>
             <button
               onClick={() => setShowPolicyModal(true)}
               className="text-[#888] hover:text-blue-400 transition-colors flex items-center gap-1"
             >
               <Shield className="w-3 h-3" />
               {t('legalPolicies')}
             </button>
           </div>
           <div className="flex items-center gap-3">
             <span>Powered by <span className="text-blue-400 font-medium">Google Gemini</span> & <span className="text-emerald-400 font-medium">Veo</span></span>
           </div>
        </div>
      </footer>

      <AcceptableUsePolicy isOpen={showPolicyModal} onClose={() => setShowPolicyModal(false)} />

      {showRightsConfirm && (
        <RightsConfirmation
          context="capture"
          onConfirm={confirmRights}
          onCancel={() => {
            setShowRightsConfirm(false);
            setPendingCaptureCallback(null);
          }}
        />
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <I18nProvider>
      <AppContent />
    </I18nProvider>
  );
};

export default App;
