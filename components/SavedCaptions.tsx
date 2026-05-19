import React from 'react';
import { CaptionResult } from '../types';
import { Copy, Check, Trash2, Download, BookmarkCheck, X } from 'lucide-react';

interface SavedCaptionsProps {
  savedCaptions: CaptionResult[];
  onRemoveSaved: (id: string) => void;
  onClose: () => void;
}

const SavedCaptions: React.FC<SavedCaptionsProps> = ({ savedCaptions, onRemoveSaved, onClose }) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const handleCopy = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyAll = async () => {
    const allText = savedCaptions.map((c) => c.text).join('\n\n---\n\n');
    await navigator.clipboard.writeText(allText);
  };

  const handleExportTxt = () => {
    const text = savedCaptions.map((c) => c.text).join('\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clipforge-captions-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCsv = () => {
    const header = 'ID,Text,Type,Tone,Platform,Created\n';
    const rows = savedCaptions
      .map((c) => `"${c.id}","${c.text.replace(/"/g, '""')}","${c.type}","${c.tone}","${c.platform}","${new Date(c.createdAt).toISOString()}"`)
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clipforge-captions-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (savedCaptions.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 bg-[#0d0d0d] rounded-xl border border-[#1a1a1a] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#1a1a1a]">
        <div className="flex items-center gap-2">
          <BookmarkCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-sm font-bold text-[#ccc]">
            Saved Captions
          </span>
          <span className="bg-[#1a1a1a] text-[#888] px-1.5 py-0.5 rounded text-[10px]">
            {savedCaptions.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyAll}
            className="text-[10px] text-[#888] hover:text-white px-2 py-1 rounded hover:bg-[#1a1a1a] transition-all flex items-center gap-1"
          >
            <Copy className="w-3 h-3" /> Copy All
          </button>
          <button
            onClick={handleExportTxt}
            className="text-[10px] text-[#888] hover:text-white px-2 py-1 rounded hover:bg-[#1a1a1a] transition-all flex items-center gap-1"
          >
            <Download className="w-3 h-3" /> .txt
          </button>
          <button
            onClick={handleExportCsv}
            className="text-[10px] text-[#888] hover:text-white px-2 py-1 rounded hover:bg-[#1a1a1a] transition-all flex items-center gap-1"
          >
            <Download className="w-3 h-3" /> .csv
          </button>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#888] hover:text-white hover:bg-[#1a1a1a] transition-all"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="divide-y divide-[#1a1a1a] max-h-64 overflow-y-auto custom-scrollbar">
        {savedCaptions.map((caption) => (
          <div key={caption.id} className="px-4 py-2.5 flex items-start gap-3 hover:bg-[#111] transition-colors group">
            <p className="flex-1 text-xs text-[#aaa] leading-relaxed line-clamp-2">
              {caption.text}
            </p>
            <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => handleCopy(caption.text, caption.id)}
                className="p-1 rounded text-[#888] hover:text-white hover:bg-[#1a1a1a] transition-all"
                title="Copy"
              >
                {copiedId === caption.id ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
              </button>
              <button
                onClick={() => onRemoveSaved(caption.id)}
                className="p-1 rounded text-[#888] hover:text-red-400 hover:bg-red-900/20 transition-all"
                title="Remove"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedCaptions;
