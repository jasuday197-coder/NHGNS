/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MapRegion, AudioSample } from '../types';
import { DEMO_REGIONS, DEMO_SAMPLES } from '../data';
import React from 'react';
import { MapPin, Info, Music, Play, Plus, BarChart2 } from 'lucide-react';

interface VietnamMapProps {
  onSelectRegion: (regionName: string) => void;
  onPlaySample: (sample: AudioSample) => void;
}

export function VietnamMap({ onSelectRegion, onPlaySample }: VietnamMapProps) {
  const [selectedRegId, setSelectedRegId] = React.useState<string>('reg_hue');
  const [showHeatmap, setShowHeatmap] = React.useState(true);
  const [filterType, setFilterType] = React.useState<'count' | 'words'>('count');

  const selectedRegion = DEMO_REGIONS.find((r) => r.id === selectedRegId) || DEMO_REGIONS[2];
  const regionSamples = DEMO_SAMPLES.filter(
    (s) => s.region.toLowerCase() === selectedRegion.regionName.toLowerCase() && s.status === 'approved'
  );

  return (
    <div className="bg-white rounded-3xl border border-[#0F766E]/10 shadow-md overflow-hidden p-6">
      
      {/* Title & Instructions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#0F172A] flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#D97706]" />
            Bản đồ Phương ngữ Việt Nam
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Chạm vào từng hạt chấm hoặc nhấn bản đồ để khai phóng dữ liệu nghe giọng nói.
          </p>
        </div>
        
        {/* Visualizer Filters */}
        <div className="flex gap-2 mt-4 sm:mt-0">
          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
              showHeatmap
                ? 'bg-[#0F766E]/10 border-[#0F766E] text-[#0F766E]'
                : 'border-gray-200 text-gray-500 hover:bg-gray-50'
            }`}
          >
            {showHeatmap ? '🔥 Đang bật Heatmap' : '❄ Khoanh vùng thường'}
          </button>
          
          <button
            onClick={() => setFilterType(filterType === 'count' ? 'words' : 'count')}
            className="px-3 py-1.5 rounded-full text-xs font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 flex items-center gap-1.5"
          >
            <BarChart2 className="w-3.5 h-3.5" />
            {filterType === 'count' ? 'Xem theo Quy mô' : 'Xem theo từ phổ biến'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Interactive Map Visualizer Panel (Lg 5 columns) */}
        <div className="lg:col-span-5 bg-[#FFF7ED]/50 rounded-2xl p-4 flex flex-col items-center justify-center border border-[#F59E0B]/10 min-h-[480px] relative">
          
          {/* Compass / Legend overlay */}
          <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-xs p-3 rounded-lg border border-gray-100/50 text-[10px] space-y-1 z-10 shadow-xs">
            <p className="font-bold text-gray-700 mb-1">MẬT ĐỘ MẪU GIỌNG</p>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#14B8A6]"></span>
              <span>Cao (&gt; 500 mẫu)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]"></span>
              <span>Trung bình (200 - 500)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-400"></span>
              <span>Sơ khởi (&lt; 200 mẫu)</span>
            </div>
          </div>

          {/* Interactive SVG of Vietnam */}
          <div className="relative w-full max-w-[340px] aspect-[1/2.1]">
            <svg
              className="w-full h-full drop-shadow-sm select-none"
              viewBox="0 0 160 320"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Simplistic representation of the coastline of Vietnam */}
              {/* Backing shadow path */}
              <path
                d="M50 15 
                   C60 12, 70 8, 85 10 
                   C95 12, 92 18, 85 22 
                   C75 25, 78 30, 70 38
                   C65 43, 63 50, 68 58 
                   C73 65, 85 68, 80 80
                   C75 92, 90 98, 92 110
                   C95 125, 98 135, 102 145
                   C105 155, 110 162, 114 175
                   C118 190, 115 200, 105 210
                   C95 220, 85 230, 80 240
                   C75 250, 72 260, 65 270
                   C55 285, 42 295, 30 300
                   C22 302, 15 292, 22 284
                   C28 275, 42 265, 48 250
                   C52 240, 58 230, 65 210
                   C72 190, 75 180, 74 165
                   C73 150, 70 140, 68 128
                   C65 110, 60 95, 58 85
                   C55 75, 52 65, 50 55
                   C48 45, 42 35, 38 28
                   C35 20, 42 18, 50 15 Z"
                fill="#CCFBF1"
                stroke="#14B8A6"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Paracel Islands (Hoàng Sa) */}
              <g className="text-teal-600" stroke="#0F766E" strokeWidth="0.5">
                <circle cx="120" cy="115" r="1.5" fill="#14B8A6" />
                <circle cx="124" cy="112" r="1" fill="#14B8A6" />
                <circle cx="128" cy="116" r="1.2" fill="#14B8A6" />
                <text x="116" y="107" fontSize="5.5" fontStyle="italic" fontWeight="600" fill="#0F766E" stroke="none">Hoàng Sa (VN)</text>
              </g>

              {/* Spratly Islands (Trường Sa) */}
              <g className="text-teal-600" stroke="#0F766E" strokeWidth="0.5">
                <circle cx="118" cy="235" r="1.2" fill="#14B8A6" />
                <circle cx="124" cy="242" r="1.5" fill="#14B8A6" />
                <circle cx="130" cy="238" r="1" fill="#14B8A6" />
                <circle cx="121" cy="246" r="1.3" fill="#14B8A6" />
                <text x="112" y="228" fontSize="5.5" fontStyle="italic" fontWeight="600" fill="#0F766E" stroke="none">Trường Sa (VN)</text>
              </g>

              {/* Graphical Hotspot highlight overlays based on chosen ID */}
              {selectedRegId === 'reg_bac' && (
                <path d="M50 15 C60 12, 70 8, 85 10 C95 12, 92 18, 85 22 C75 25, 78 30, 70 38 C65 43, 63 50, 68 58 Z" fill="#0F766E" fillOpacity="0.25" />
              )}
              {selectedRegId === 'reg_nghe' && (
                <path d="M70 38 C65 43, 65 50, 68 58 C73 65, 80 70, 78 80 C75 90, 85 92, 85 100 Z" fill="#F59E0B" fillOpacity="0.25" fillRule="evenodd" />
              )}
              {selectedRegId === 'reg_hue' && (
                <circle cx="82" cy="118" r="14" fill="#E11D48" fillOpacity="0.2" />
              )}
              {selectedRegId === 'reg_quang' && (
                <circle cx="94" cy="151" r="12" fill="#2563EB" fillOpacity="0.18" />
              )}
              {selectedRegId === 'reg_nam' && (
                <path d="M105 210 C95 220, 85 230, 80 240 C75 250, 72 260, 65 270 C55 285, 42 295, 30 300 C22 302, 15 292, 22 284 C28 275, 42 265, 48 250 C52 240, 58 230, 65 210 Z" fill="#14B8A6" fillOpacity="0.25" />
              )}
            </svg>

            {/* Interactive Pins & Hotspot Buttons using absolute positioning on parent relative ratio container */}
            {DEMO_REGIONS.map((reg) => {
              const belongsSelected = reg.id === selectedRegId;
              const isHeat = showHeatmap;
              
              // Map percentage coords to layout
              return (
                <button
                  key={reg.id}
                  onClick={() => {
                    setSelectedRegId(reg.id);
                    onSelectRegion(reg.regionName);
                  }}
                  style={{ left: `${reg.coordinates.x}%`, top: `${reg.coordinates.y}%` }}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 group z-20 focus:outline-none"
                >
                  <span className="relative flex h-8 w-8 items-center justify-center">
                    {/* Ring ping animation */}
                    {belongsSelected && (
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    )}
                    
                    {/* Core pill indicator */}
                    <span 
                      className={`relative inline-flex rounded-full px-2.5 py-1 text-[11px] font-black shadow-md border items-center justify-center transition-all ${
                        belongsSelected
                          ? 'bg-rose-500 border-white text-white scale-115'
                          : isHeat
                          ? reg.sampleCount > 500
                            ? 'bg-[#0F766E] border-[#0F766E]/20 text-white hover:scale-105'
                            : 'bg-[#F59E0B] border-[#F59E0B]/20 text-white hover:scale-105'
                          : 'bg-white border-gray-200 text-[#0F172A] hover:bg-[#FFF7ED]'
                      }`}
                    >
                      {filterType === 'count' ? reg.sampleCount : reg.commonWords[0]}
                    </span>
                  </span>
                  
                  {/* Small tooltip label */}
                  <span className="absolute left-1/2 -translate-x-1/2 top-9 bg-[#0F172A] text-white text-[9px] px-1.5 py-0.5 rounded-sm opacity-0 group-hover:opacity-100 transition whitespace-nowrap shadow-xs pointer-events-none">
                    {reg.regionName}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-2 text-center text-[10px] text-gray-400">
            * Mật độ thể hiện bằng số ghi âm được chia sẻ trực tiếp.
          </div>
        </div>

        {/* Selected Area Detail Metadata Panel (Lg 7 columns) */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div className="space-y-6">
            
            {/* Base Metadata header */}
            <div className="pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-[#0F766E]/10 rounded-full text-xs font-black text-[#0F766E]">
                  PHƯƠNG NGỮ KHAI PHÁ
                </span>
                <span className="text-xs text-gray-500 font-mono">ID: {selectedRegion.id}</span>
              </div>
              <h3 className="text-2xl font-black text-[#0F172A] mt-2">
                Giọng nói vùng: <span className="text-[#0F766E]">{selectedRegion.regionName}</span>
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Các tỉnh nòng cốt: {selectedRegion.provinces.join(', ')}
              </p>
            </div>

            {/* Demographics / Stats visualization cards inside bento subgrid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-gray-400">Ghi âm mẫu</span>
                <p className="text-xl font-bold text-slate-800 font-mono mt-0.5">
                  {selectedRegion.sampleCount} <span className="text-xs font-normal text-gray-500">files</span>
                </p>
              </div>
              
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-gray-400">Từ vựng đã duyệt</span>
                <p className="text-xl font-bold text-slate-800 font-mono mt-0.5">
                  {selectedRegion.wordCount} <span className="text-xs font-normal text-gray-500">từ</span>
                </p>
              </div>

              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 col-span-2 sm:col-span-1">
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-gray-400">Độ tuổi tiêu biểu</span>
                <p className="text-sm font-black text-[#D97706] mt-1">
                  18 - 30 tuổi ({(selectedRegion.stats.from18to30 / selectedRegion.sampleCount * 100).toFixed(0)}%)
                </p>
              </div>
            </div>

            {/* Common localized vocabulary chips row */}
            <div>
              <h4 className="text-xs uppercase tracking-wider font-extrabold text-gray-400 mb-2">Từ khóa phổ cập</h4>
              <div className="flex flex-wrap gap-2">
                {selectedRegion.commonWords.map((word, i) => (
                  <span
                    key={word + i}
                    className="px-3 py-1.5 bg-[#FFF7ED] border border-[#F59E0B]/30 hover:border-[#D97706] text-[#D97706] rounded-lg text-xs font-bold transition duration-200 cursor-help"
                  >
                    #{word}
                  </span>
                ))}
              </div>
            </div>

            {/* Featured audio player of selected region */}
            <div>
              <h4 className="text-xs uppercase tracking-wider font-extrabold text-[#0F766E] mb-3 flex items-center gap-1.5 font-sans">
                <Music className="w-4 h-4" />
                Nghe thử thổ điệu tiêu biểu của {selectedRegion.regionName}
              </h4>
              
              {regionSamples.length === 0 ? (
                <div className="text-center p-6 bg-gray-50 rounded-xl text-xs text-gray-400">
                  Dữ liệu ghi âm chính chủ đang chờ Hội đồng biên soạn tải lên thêm.
                </div>
              ) : (
                <div className="space-y-2 max-h-[145px] overflow-y-auto pr-2 scrollbar-thin">
                  {regionSamples.slice(0, 2).map((sample) => (
                    <div
                      key={sample.id}
                      className="flex items-center justify-between p-3 bg-[#0F766E]/5 hover:bg-[#0F766E]/10 rounded-xl transition border border-[#0F766E]/10"
                    >
                      <div className="flex-1 min-w-0 pr-4">
                        <p className="text-xs font-bold text-gray-900 truncate">
                          "{sample.transcriptVerified}"
                        </p>
                        <p className="text-[10px] text-gray-500 mt-0.5">
                          {sample.speakerName} · {sample.topic}
                        </p>
                      </div>
                      
                      <button
                        onClick={() => onPlaySample(sample)}
                        className="p-2 bg-[#0F766E] text-white hover:bg-[#0F766E]/90 rounded-full transition shadow-xs cursor-pointer flex items-center justify-center shrink-0"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cultural Tags / Heritage */}
            <div>
              <h4 className="text-xs uppercase tracking-wider font-extrabold text-gray-400 mb-2">Hệ giá trị di sản văn hóa</h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedRegion.culturalTags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-sm"
                  >
                    ✦ {tag}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Actions footer */}
          <div className="flex gap-2.5 mt-6 pt-5 border-t border-gray-100">
            <button
              onClick={() => onSelectRegion(selectedRegion.regionName)}
              className="flex-1 bg-[#0F766E] text-white font-bold text-xs py-3 rounded-xl hover:bg-[#0F766E]/90 transition shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              Xem chi tiết phương ngữ này
              <Info className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
