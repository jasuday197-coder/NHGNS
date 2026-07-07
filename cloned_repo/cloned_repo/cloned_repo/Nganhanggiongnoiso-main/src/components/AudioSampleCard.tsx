/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AudioSample } from '../types';
import React from 'react';
import { Play, Pause, Heart, Share2, Eye, Download, Info, CheckCircle2, Award } from 'lucide-react';

interface AudioSampleCardProps {
  key?: React.Key | string | number;
  sample: AudioSample;
  onSelect: (sample: AudioSample) => void;
  onPlayToggle: (sample: AudioSample) => void;
  isPlaying: boolean;
  currentPlayTime?: string;
}

export function AudioSampleCard({
  sample,
  onSelect,
  onPlayToggle,
  isPlaying,
  currentPlayTime = '00:00'
}: AudioSampleCardProps) {
  const [liked, setLiked] = React.useState(false);
  const [likesCount, setLikesCount] = React.useState(sample.likes);
  const [showShareTooltip, setShowShareTooltip] = React.useState(false);

  // Simulated visual waveform nodes
  const waveNodes = [20, 45, 60, 30, 75, 40, 85, 90, 50, 30, 65, 80, 55, 40, 20, 60, 75, 40, 85, 90, 45, 20];

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (liked) {
      setLikesCount(likesCount - 1);
    } else {
      setLikesCount(likesCount + 1);
    }
    setLiked(!liked);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowShareTooltip(true);
    navigator.clipboard.writeText(`${window.location.origin}/sample/${sample.id}`);
    setTimeout(() => setShowShareTooltip(false), 2000);
  };

  const mapRegionColor = (reg: string) => {
    switch (reg) {
      case 'Huế':
        return 'bg-pink-100 text-pink-700 border-pink-200';
      case 'Nam Bộ':
        return 'bg-[#14B8A6]/10 text-[#0F766E] border-[#14B8A6]/20';
      case 'Bắc Bộ':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Quảng Nam':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Nghệ Tĩnh':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div
      onClick={() => onSelect(sample)}
      className={`relative bg-white rounded-2xl border transition-all duration-300 p-5 cursor-pointer shadow-xs hover:shadow-md hover:border-[#0F766E]/20 hover:-translate-y-0.5 flex flex-col justify-between ${
        isPlaying ? 'border-[#14B8A6] ring-1 ring-[#14B8A6]/30' : 'border-gray-100/80'
      }`}
    >
      <div>
        
        {/* Header Tags */}
        <div className="flex items-center justify-between gap-1.5 mb-3">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className={`px-2 py-0.5 text-[10px] font-black tracking-wider rounded-md border ${mapRegionColor(sample.region)} truncate`}>
              {sample.region}
            </span>
            <span className="text-[10px] text-gray-400 font-medium truncate">
              {sample.province}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Eye className="w-3 h-3 text-gray-300" />
            <span className="text-[10px] font-mono text-gray-400">{sample.plays + (isPlaying ? 1 : 0)}</span>
          </div>
        </div>

        {/* Title */}
        <h4 className="font-bold text-[#0F172A] text-sm group-hover:text-[#0F766E] line-clamp-1 mb-1">
          {sample.title}
        </h4>

        {/* Local phrase text */}
        <p className="text-sm font-black text-slate-700 italic border-l-2 border-[#D97706] pl-2 py-0.5 my-2.5">
          "{sample.transcriptVerified}"
        </p>

        {/* Waveform Visualization inside track */}
        <div className="flex items-center justify-between gap-1.5 py-3 h-12 bg-slate-50/50 rounded-xl px-3 my-2.5 border border-slate-100 select-none">
          
          {/* Play/Pause round icon */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPlayToggle(sample);
            }}
            className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition shadow-xs hover:scale-105 shrink-0 ${
              isPlaying ? 'bg-amber-500 text-white' : 'bg-[#0F766E] text-white'
            }`}
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-current text-white" /> : <Play className="w-4 h-4 fill-current ml-0.5 text-white" />}
          </button>

          {/* Visualizing micro waves */}
          <div className="flex-1 flex gap-0.5 items-end justify-center h-full px-2">
            {waveNodes.map((val, idx) => {
              const activeNode = isPlaying && (idx / waveNodes.length) < 0.6; // Simulating sound flow
              return (
                <div
                  key={idx}
                  style={{ height: `${val}%` }}
                  className={`w-1 rounded-t-sm transition-all duration-300 ${
                    activeNode ? 'bg-[#14B8A6] h-full' : 'bg-[#14B8A6]/20'
                  }`}
                />
              );
            })}
          </div>

          {/* Duration info */}
          <span className="text-[10px] font-mono text-gray-400 shrink-0">
            {isPlaying ? currentPlayTime : sample.duration}
          </span>
        </div>

        {/* Extra snippet specs */}
        <div className="flex items-center justify-between text-[11px] text-gray-500 pb-2 border-b border-gray-50 mb-3 font-medium">
          <span>Người lớn tuổi: {sample.speakerAgeGroup} ({sample.speakerGender})</span>
          <span className="text-[10px] text-gray-400 bg-slate-100 rounded px-1">{sample.topic}</span>
        </div>

      </div>

      {/* Footer operations (Like, share, download) */}
      <div className="flex items-center justify-between relative mt-auto pt-1.5">
        
        {/* Detail launch button */}
        <button
          onClick={() => onSelect(sample)}
          className="text-xs font-semibold text-[#0F766E] flex items-center gap-1 hover:underline"
        >
          <Info className="w-3.5 h-3.5" />
          Chi tiết dịch nghĩa
        </button>

        {/* Operations array */}
        <div className="flex items-center gap-3">
          
          {/* Share Indicator */}
          <button
            onClick={handleShare}
            className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition relative"
            title="Sao chép link chia sẻ"
          >
            <Share2 className="w-3.5 h-3.5" />
            {showShareTooltip && (
              <span className="absolute bottom-full right-0 mb-2 whitespace-nowrap bg-gray-900 text-white text-[9px] px-1.5 py-0.5 rounded shadow-xs z-30">
                Đã sao chép link!
              </span>
            )}
          </button>
          
          {/* Like Indicator */}
          <button
            onClick={handleLike}
            className={`p-1.5 hover:bg-rose-50 rounded-lg transition duration-200 flex items-center gap-1 cursor-pointer ${
              liked ? 'text-rose-500' : 'text-gray-400 hover:text-rose-500'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-current' : ''}`} />
            <span className="text-xs font-mono font-bold">{likesCount}</span>
          </button>
          
        </div>

      </div>
    </div>
  );
}
