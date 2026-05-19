'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import {
  Upload,
  FileVideo,
  X,
  CheckCircle2,
  Loader2,
  Film,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function UploadPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/mp4': ['.mp4'],
      'video/quicktime': ['.mov'],
      'video/x-msvideo': ['.avi'],
      'video/x-matroska': ['.mkv'],
    },
    maxSize: 5 * 1024 * 1024 * 1024,
    maxFiles: 10,
  });

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    setUploading(true);
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((r) => setTimeout(r, 200));
      setUploadProgress(i);
    }
    await new Promise((r) => setTimeout(r, 1000));
    setUploading(false);
    setFiles([]);
    setUploadProgress(0);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-semibold text-white">Create Video</h1>
        <p className="text-sm text-[#888] mt-1">Upload your long-form video and let AI detect viral moments</p>
      </motion.div>

      {/* Upload Zone */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        {...getRootProps()}
        className={cn(
          'relative p-10 rounded-xl border-2 border-dashed transition-all cursor-pointer text-center',
          isDragActive
            ? 'border-blue-500 bg-blue-500/5'
            : 'border-[#222] bg-[#111] hover:border-[#333]'
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-4">
          <div
            className={cn(
              'w-14 h-14 rounded-xl flex items-center justify-center transition-all',
              isDragActive ? 'bg-blue-500 scale-110' : 'bg-[#1a1a1a]'
            )}
          >
            <Upload className={cn('w-6 h-6', isDragActive ? 'text-white' : 'text-[#888]')} />
          </div>
          <div>
            <p className="text-base font-medium text-white">
              {isDragActive ? 'Drop your video here' : 'Drag & drop your video'}
            </p>
            <p className="text-sm text-[#666] mt-1">MP4, MOV, AVI, or MKV — up to 5GB</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#666]">
            <Film className="w-3 h-3" />
            <span>Max 6 hours per video</span>
          </div>
        </div>
      </motion.div>

      {/* Files List */}
      {files.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
          <h2 className="text-sm font-medium text-white">{files.length} file{files.length > 1 ? 's' : ''} selected</h2>
          {files.map((file, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-[#111] border border-[#1a1a1a]">
              <div className="flex items-center gap-3">
                <FileVideo className="w-8 h-8 text-blue-400" />
                <div>
                  <p className="text-sm text-white">{file.name}</p>
                  <p className="text-xs text-[#666]">{formatFileSize(file.size)}</p>
                </div>
              </div>
              {!uploading && (
                <button onClick={() => removeFile(i)} className="p-1 text-[#666] hover:text-red-400 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              )}
              {uploading && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            </div>
          ))}

          {uploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#888]">Uploading...</span>
                <span className="text-white font-medium">{uploadProgress}%</span>
              </div>
              <div className="h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Upload Button */}
      {files.length > 0 && !uploading && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={handleUpload}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl hover:opacity-90 transition-all"
        >
          <Upload className="w-4 h-4" />
          Upload & Start AI Analysis
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      )}

      {/* Uploading State */}
      {uploading && (
        <div className="flex items-center justify-center gap-3 p-4 rounded-xl bg-[#111] border border-[#1a1a1a]">
          <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
          <span className="text-sm text-[#888]">Processing your video. This may take a few minutes...</span>
        </div>
      )}

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="p-4 rounded-xl bg-[#111] border border-[#1a1a1a]"
      >
        <h3 className="text-sm font-medium text-blue-400 mb-2">Pro Tips</h3>
        <ul className="space-y-2 text-sm text-[#888]">
          <li className="flex items-start gap-2">
            <span className="text-blue-400 mt-0.5">•</span>
            <span>For best results, upload videos with clear speech and minimal background noise</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-400 mt-0.5">•</span>
            <span>Videos between 15-60 minutes yield the most viral clip suggestions</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-400 mt-0.5">•</span>
            <span>You can upload up to 10 videos at once with the Pro plan</span>
          </li>
        </ul>
      </motion.div>
    </div>
  );
}
