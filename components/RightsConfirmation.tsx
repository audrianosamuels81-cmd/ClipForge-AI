import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, ExternalLink } from 'lucide-react';

interface RightsConfirmationProps {
  onConfirm: () => void;
  onCancel: () => void;
  context: 'capture' | 'generate' | 'video';
}

const CONTEXT_MESSAGES: Record<RightsConfirmationProps['context'], {
  title: string;
  description: string;
  detail: string;
}> = {
  capture: {
    title: 'Content Rights Confirmation',
    description: 'Before capturing frames from this video, please confirm you have the rights to use this content.',
    detail: 'By proceeding, you confirm that you own this content, have created it yourself, or have obtained the necessary permissions or licenses to use it.'
  },
  generate: {
    title: 'AI Generation Rights Confirmation',
    description: 'Before generating new content with AI, please confirm you have the rights to the source material.',
    detail: 'By proceeding, you confirm that the source image(s) and any prompts you provide are based on your own original work or content you have permission to transform.'
  },
  video: {
    title: 'Video Generation Rights Confirmation',
    description: 'Before generating a video, please confirm you have rights to the source images and prompts.',
    detail: 'By proceeding, you confirm that the source images and prompts used for video generation are based on your original content or content you have permission to use.'
  }
};

const RightsConfirmation: React.FC<RightsConfirmationProps> = ({
  onConfirm,
  onCancel,
  context
}) => {
  const [confirmed, setConfirmed] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  const messages = CONTEXT_MESSAGES[context];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3 p-5 border-b border-[#1a1a1a]">
          <div className="bg-amber-900/30 p-2 rounded-full">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">{messages.title}</h2>
            <p className="text-xs text-[#888] mt-0.5">
              ClipForge AI — Responsible Use
            </p>
          </div>
        </div>

        <div className="p-5 space-y-4">
          <p className="text-sm text-[#888] leading-relaxed">
            {messages.description}
          </p>

          <label className="flex items-start gap-3 p-3 bg-[#0a0a0a]/50 rounded-lg border border-[#1a1a1a] cursor-pointer hover:bg-[#0a0a0a] transition-colors">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-[#333] bg-[#1a1a1a] text-amber-500 focus:ring-amber-500 focus:ring-offset-0 cursor-pointer accent-amber-500"
            />
            <span className="text-sm text-[#888] leading-relaxed select-none">
              I confirm I own or have the rights to use this content, including any music, images, or other media within it.
            </span>
          </label>

          <button
            onClick={() => setShowDetail(!showDetail)}
            className="flex items-center gap-1.5 text-xs text-[#888] hover:text-white transition-colors"
          >
            <AlertTriangle className="w-3 h-3" />
            {showDetail ? 'Hide details' : 'Why is this required?'}
          </button>

          {showDetail && (
            <div className="text-xs text-[#888] bg-[#0a0a0a]/30 p-3 rounded-lg border border-[#1a1a1a] leading-relaxed">
              <p className="mb-2 font-medium text-white">Legal & Compliance:</p>
              <p>{messages.detail}</p>
              <p className="mt-2 text-[#666]">
                This helps us maintain compliance with copyright laws and platform policies. 
                Your confirmation creates a record of your acknowledgment.
              </p>
            </div>
          )}

          <div className="flex items-start gap-2 p-3 bg-blue-900/20 rounded-lg border border-blue-800/30">
            <ExternalLink className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-blue-300 leading-relaxed">
              ClipForge AI is an AI content transformation platform. It is designed to help you 
              transform, enhance, and repurpose content you own or have permission to use — not 
              to copy or reproduce copyrighted material.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-5 border-t border-[#1a1a1a] bg-[#111]/50">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm text-[#888] hover:text-white hover:bg-[#1a1a1a] rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={!confirmed}
            className={`px-5 py-2 text-sm font-medium rounded-lg transition-all ${
              confirmed
                ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-600/20'
                : 'bg-[#1a1a1a] text-[#666] cursor-not-allowed'
            }`}
          >
            {confirmed ? 'Confirm & Continue' : 'Confirm rights to continue'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RightsConfirmation;
