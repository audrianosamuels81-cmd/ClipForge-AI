import React, { useState, useRef } from 'react';
import { CapturedFrame, CaptionResult, CaptionType, CaptionTone, CaptionPlatform, HashtagLevel } from '../types';
import { generateCaptions, regenerateSingleCaption } from '../services/captionService';
import CaptionCard from './CaptionCard';
import SavedCaptions from './SavedCaptions';
import { useI18n } from '../services/i18nContext';
import {
  MessageSquareText, Image as ImageIcon, Upload, X, RefreshCw,
  AlertCircle, Sparkles, BookmarkCheck, Type, Hash,
  Monitor, Smile, LayoutList
} from 'lucide-react';

const generateId = () => `cap-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const CAPTION_TYPES: { value: CaptionType; label: string }[] = [
  { value: 'social', label: 'Social Media' },
  { value: 'blog', label: 'Blog / Article' },
  { value: 'product', label: 'Product' },
  { value: 'seo', label: 'SEO' },
  { value: 'creative', label: 'Creative' },
];

const TONES: { value: CaptionTone; label: string }[] = [
  { value: 'professional', label: 'Professional' },
  { value: 'casual', label: 'Casual' },
  { value: 'funny', label: 'Funny' },
  { value: 'inspirational', label: 'Inspirational' },
];

const PLATFORMS: { value: CaptionPlatform; label: string }[] = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'twitter', label: 'Twitter / X' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'general', label: 'General' },
];

const HASHTAG_LEVELS: { value: HashtagLevel; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'few', label: 'Few (3-5)' },
  { value: 'many', label: 'Many (8-12)' },
];

const COUNTS = [3, 5, 10];

interface CaptionStudioProps {
  frames: CapturedFrame[];
  apiKey?: string;
}

const CaptionStudio: React.FC<CaptionStudioProps> = ({ frames, apiKey }) => {
  const { t } = useI18n();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [textInput, setTextInput] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedGalleryFrame, setSelectedGalleryFrame] = useState<string | null>(null);

  const [captionType, setCaptionType] = useState<CaptionType>('social');
  const [tone, setTone] = useState<CaptionTone>('casual');
  const [platform, setPlatform] = useState<CaptionPlatform>('instagram');
  const [hashtags, setHashtags] = useState<HashtagLevel>('few');
  const [count, setCount] = useState(5);

  const [captions, setCaptions] = useState<CaptionResult[]>([]);
  const [savedCaptions, setSavedCaptions] = useState<CaptionResult[]>(() => {
    try {
      const stored = localStorage.getItem('clipforge_saved_captions');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [regeneratingId, setRegeneratingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSaved, setShowSaved] = useState(false);

  const persistSaved = (updated: CaptionResult[]) => {
    setSavedCaptions(updated);
    localStorage.setItem('clipforge_saved_captions', JSON.stringify(updated));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
      setSelectedGalleryFrame(null);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectGalleryFrame = (frame: CapturedFrame) => {
    setImagePreview(frame.dataUrl);
    setSelectedGalleryFrame(frame.id);
    setError(null);
  };

  const handleClearImage = () => {
    setImagePreview(null);
    setSelectedGalleryFrame(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const buildParams = () => ({
    text: textInput || undefined,
    imageBase64: imagePreview || undefined,
    captionType,
    tone,
    platform,
    hashtags,
    count,
  });

  const handleGenerate = async () => {
    if (!textInput && !imagePreview) {
      setError('Enter some text or upload an image to caption.');
      return;
    }
    setIsGenerating(true);
    setError(null);
    setCaptions([]);
    try {
      const texts = await generateCaptions(buildParams(), apiKey);
      const results: CaptionResult[] = texts.map((text) => ({
        id: generateId(),
        text,
        type: captionType,
        tone,
        platform,
        createdAt: Date.now(),
        isSaved: false,
      }));
      setCaptions(results);
    } catch (err: any) {
      setError(err.message || 'Generation failed. Check your API key and try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerate = async (id: string) => {
    setRegeneratingId(id);
    setError(null);
    try {
      const existingTexts = captions.map((c) => c.text);
      const newText = await regenerateSingleCaption(buildParams(), existingTexts, apiKey);
      setCaptions((prev) =>
        prev.map((c) => (c.id === id ? { ...c, text: newText } : c))
      );
    } catch (err: any) {
      setError(err.message || 'Regeneration failed.');
    } finally {
      setRegeneratingId(null);
    }
  };

  const handleToggleSave = (id: string) => {
    setCaptions((prev) => {
      const updated = prev.map((c) => {
        if (c.id !== id) return c;
        const newSaved = !c.isSaved;
        if (newSaved) {
          persistSaved([{ ...c, isSaved: true }, ...savedCaptions]);
        } else {
          persistSaved(savedCaptions.filter((s) => s.id !== c.id));
        }
        return { ...c, isSaved: newSaved };
      });
      return updated;
    });
  };

  const handleDelete = (id: string) => {
    setCaptions((prev) => prev.filter((c) => c.id !== id));
  };

  const handleRemoveSaved = (id: string) => {
    persistSaved(savedCaptions.filter((c) => c.id !== id));
    setCaptions((prev) => prev.map((c) => (c.id === id ? { ...c, isSaved: false } : c)));
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-shrink-0 grid grid-cols-1 lg:grid-cols-2 gap-4 h-[35%] min-h-[220px] max-h-[350px]">
        {/* Left pane: Text or Image input */}
        <div className="bg-[#111] rounded-xl border border-[#1a1a1a] overflow-hidden flex flex-col">
          <div className="flex items-center gap-2 px-3 py-2 border-b border-[#1a1a1a] bg-[#0a0a0a]">
            <Type className="w-3.5 h-3.5 text-[#888]" />
            <span className="text-[10px] text-[#888] font-bold uppercase tracking-wider">
              Text Content
            </span>
          </div>
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Describe what you're posting... e.g., a photo of homemade pizza, a new product launch, a sunset hike..."
            className="flex-1 w-full bg-transparent p-3 text-sm text-[#ccc] placeholder-[#555] focus:outline-none resize-none custom-scrollbar"
          />
        </div>

        {/* Right pane: Image input */}
        <div className="bg-[#111] rounded-xl border border-[#1a1a1a] overflow-hidden flex flex-col">
          <div className="flex items-center gap-2 px-3 py-2 border-b border-[#1a1a1a] bg-[#0a0a0a]">
            <ImageIcon className="w-3.5 h-3.5 text-[#888]" />
            <span className="text-[10px] text-[#888] font-bold uppercase tracking-wider">
              Image (optional)
            </span>
          </div>
          <div className="flex-1 relative">
            {imagePreview ? (
              <div className="absolute inset-0 group">
                <img src={imagePreview} className="w-full h-full object-contain bg-black" alt="Uploaded" />
                <button
                  onClick={handleClearImage}
                  className="absolute top-2 right-2 bg-black/70 text-white p-1.5 rounded-full hover:bg-red-500/80 transition-all opacity-0 group-hover:opacity-100"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-[#666] p-4">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-full border-2 border-dashed border-[#222] rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#444] transition-colors"
                >
                  <Upload className="w-6 h-6 opacity-50" />
                  <p className="text-xs">Upload an image</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                {frames.length > 0 && (
                  <>
                    <div className="w-full flex items-center gap-2 my-2">
                      <div className="flex-1 h-px bg-[#1a1a1a]" />
                      <span className="text-[10px] text-[#555]">or from gallery</span>
                      <div className="flex-1 h-px bg-[#1a1a1a]" />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2 w-full custom-scrollbar">
                      {frames.slice(0, 6).map((f) => (
                        <img
                          key={f.id}
                          src={f.dataUrl}
                          onClick={() => handleSelectGalleryFrame(f)}
                          className={`w-16 h-10 object-cover rounded cursor-pointer border-2 transition-all ${
                            selectedGalleryFrame === f.id
                              ? 'border-blue-500 opacity-100'
                              : 'border-transparent opacity-50 hover:opacity-100'
                          }`}
                          alt="Frame"
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Options bar */}
      <div className="flex-shrink-0 py-3 flex flex-wrap items-center gap-3 border-b border-[#1a1a1a]">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] text-[#888] uppercase font-bold flex items-center gap-1">
            <LayoutList className="w-3 h-3" /> Type
          </span>
          <div className="flex bg-[#111] rounded-lg p-1 border border-[#1a1a1a]">
            {CAPTION_TYPES.map((ct) => (
              <button
                key={ct.value}
                onClick={() => setCaptionType(ct.value)}
                className={`px-2 py-1 text-[10px] rounded transition-all whitespace-nowrap ${
                  captionType === ct.value
                    ? 'bg-[#1a1a1a] text-white shadow'
                    : 'text-[#888] hover:text-white'
                }`}
              >
                {ct.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[10px] text-[#888] uppercase font-bold flex items-center gap-1">
            <Smile className="w-3 h-3" /> Tone
          </span>
          <div className="flex bg-[#111] rounded-lg p-1 border border-[#1a1a1a]">
            {TONES.map((tn) => (
              <button
                key={tn.value}
                onClick={() => setTone(tn.value)}
                className={`px-2 py-1 text-[10px] rounded transition-all whitespace-nowrap ${
                  tone === tn.value
                    ? 'bg-[#1a1a1a] text-white shadow'
                    : 'text-[#888] hover:text-white'
                }`}
              >
                {tn.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[10px] text-[#888] uppercase font-bold flex items-center gap-1">
            <Monitor className="w-3 h-3" /> Platform
          </span>
          <div className="flex bg-[#111] rounded-lg p-1 border border-[#1a1a1a]">
            {PLATFORMS.map((pf) => (
              <button
                key={pf.value}
                onClick={() => setPlatform(pf.value)}
                className={`px-2 py-1 text-[10px] rounded transition-all whitespace-nowrap ${
                  platform === pf.value
                    ? 'bg-[#1a1a1a] text-white shadow'
                    : 'text-[#888] hover:text-white'
                }`}
              >
                {pf.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[10px] text-[#888] uppercase font-bold flex items-center gap-1">
            <Hash className="w-3 h-3" /> Hashtags
          </span>
          <div className="flex bg-[#111] rounded-lg p-1 border border-[#1a1a1a]">
            {HASHTAG_LEVELS.map((hl) => (
              <button
                key={hl.value}
                onClick={() => setHashtags(hl.value)}
                className={`px-2 py-1 text-[10px] rounded transition-all whitespace-nowrap ${
                  hashtags === hl.value
                    ? 'bg-[#1a1a1a] text-white shadow'
                    : 'text-[#888] hover:text-white'
                }`}
              >
                {hl.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[10px] text-[#888] uppercase font-bold">Count</span>
          <div className="flex bg-[#111] rounded-lg p-1 border border-[#1a1a1a]">
            {COUNTS.map((n) => (
              <button
                key={n}
                onClick={() => setCount(n)}
                className={`w-7 py-1 text-[10px] rounded transition-all ${
                  count === n
                    ? 'bg-[#1a1a1a] text-white shadow'
                    : 'text-[#888] hover:text-white'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating || (!textInput && !imagePreview)}
          className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white py-2 px-6 rounded-lg text-sm font-bold transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-pink-900/20 active:scale-[0.98]"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" /> Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" /> Generate Captions
            </>
          )}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-2 bg-red-500/10 border border-red-500/20 text-red-200 p-2 rounded-lg text-xs flex items-center gap-2 flex-shrink-0">
          <AlertCircle className="w-3 h-3 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Results */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pt-4">
        {captions.length === 0 && !isGenerating ? (
          <div className="h-full flex flex-col items-center justify-center text-[#666] border-2 border-dashed border-[#1a1a1a] rounded-xl">
            <MessageSquareText className="w-8 h-8 opacity-20 mb-2" />
            <p className="text-xs">Enter text or upload an image, then generate captions</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {captions.map((caption, i) => (
              <CaptionCard
                key={caption.id}
                caption={caption}
                index={i}
                onRegenerate={handleRegenerate}
                onSave={handleToggleSave}
                onDelete={handleDelete}
                isRegenerating={regeneratingId === caption.id}
              />
            ))}
          </div>
        )}
      </div>

      {/* Saved captions */}
      {savedCaptions.length > 0 && (
        <SavedCaptions
          savedCaptions={savedCaptions}
          onRemoveSaved={handleRemoveSaved}
          onClose={() => setShowSaved(false)}
        />
      )}
    </div>
  );
};

export default CaptionStudio;
