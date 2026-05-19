import React, { useState } from 'react';
import { CaptionResult } from '../types';
import { Copy, Check, RefreshCw, Bookmark, BookmarkCheck, Trash2 } from 'lucide-react';

interface CaptionCardProps {
  caption: CaptionResult;
  index: number;
  onRegenerate: (id: string) => void;
  onSave: (id: string) => void;
  onDelete: (id: string) => void;
  isRegenerating?: boolean;
}

const CaptionCard: React.FC<CaptionCardProps> = ({
  caption,
  index,
  onRegenerate,
  onSave,
  onDelete,
  isRegenerating,
}) => {
  const [copied, setCopied] = useState(false);
  const [editedText, setEditedText] = useState(caption.text);
  const [isEditing, setIsEditing] = useState(false);
  const hasUnsavedEdits = editedText !== caption.text;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(editedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    onSave(caption.id);
  };

  return (
    <div className="relative group bg-[#111] rounded-xl border border-[#1a1a1a] overflow-hidden shadow-lg hover:border-[#333] transition-all">
      <div className="absolute top-2 left-2 z-10 bg-black/60 px-2 py-0.5 rounded text-[10px] text-[#666] backdrop-blur-sm">
        #{index + 1}
      </div>

      <div className="p-4 pt-8">
        {isEditing ? (
          <textarea
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            className="w-full bg-[#0a0a0a] border border-[#222] rounded-lg p-2 text-sm text-[#ccc] focus:outline-none focus:border-blue-500 resize-none custom-scrollbar"
            rows={4}
            autoFocus
          />
        ) : (
          <p
            className="text-sm text-[#ccc] leading-relaxed cursor-pointer hover:text-white transition-colors"
            onClick={() => setIsEditing(true)}
            title="Click to edit"
          >
            {caption.text}
          </p>
        )}

        <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#1a1a1a]">
          <div className="flex items-center gap-1">
            <span className="text-[10px] bg-[#1a1a1a] text-[#666] px-1.5 py-0.5 rounded">
              {caption.platform}
            </span>
            <span className="text-[10px] bg-[#1a1a1a] text-[#666] px-1.5 py-0.5 rounded">
              {caption.tone}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {hasUnsavedEdits && (
              <button
                onClick={() => { setIsEditing(false); setEditedText(caption.text); }}
                className="text-[10px] text-[#888] hover:text-white px-1 py-0.5 rounded hover:bg-[#1a1a1a] transition-all"
              >
                Reset
              </button>
            )}

            {isEditing && (
              <button
                onClick={() => setIsEditing(false)}
                className="text-[10px] text-blue-400 hover:text-blue-300 px-1 py-0.5 rounded hover:bg-blue-900/20 transition-all"
              >
                Done
              </button>
            )}

            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg text-[#888] hover:text-white hover:bg-[#1a1a1a] transition-all"
              title="Copy to clipboard"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={() => onRegenerate(caption.id)}
              disabled={isRegenerating}
              className="p-1.5 rounded-lg text-[#888] hover:text-white hover:bg-[#1a1a1a] transition-all disabled:opacity-50"
              title="Regenerate this caption"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={handleSave}
              className={`p-1.5 rounded-lg transition-all ${
                caption.isSaved
                  ? 'text-emerald-400 hover:bg-emerald-900/20'
                  : 'text-[#888] hover:text-white hover:bg-[#1a1a1a]'
              }`}
              title={caption.isSaved ? 'Saved' : 'Save caption'}
            >
              {caption.isSaved ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={() => onDelete(caption.id)}
              className="p-1.5 rounded-lg text-[#888] hover:text-red-400 hover:bg-red-900/20 transition-all"
              title="Delete"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaptionCard;
