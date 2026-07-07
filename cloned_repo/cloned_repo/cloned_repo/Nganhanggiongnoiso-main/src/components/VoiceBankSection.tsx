/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AudioSample } from '../types';
import { DEMO_SAMPLES } from '../data';
import { AudioSampleCard } from './AudioSampleCard';
import { Search, SlidersHorizontal, Grid, List, HelpCircle } from 'lucide-react';

interface VoiceBankProps {
  searchQuery: string;
  onSelectSample: (sample: AudioSample) => void;
  onPlayToggle: (sample: AudioSample) => void;
  playingSample: AudioSample | null;
  playingTime: string;
}

export function VoiceBankSection({
  searchQuery,
  onSelectSample,
  onPlayToggle,
  playingSample,
  playingTime
}: VoiceBankProps) {
  const [localSearch, setLocalSearch] = React.useState(searchQuery);
  const [filterRegion, setFilterRegion] = React.useState('Tất cả');
  const [filterTopic, setFilterTopic] = React.useState('Tất cả');
  const [filterAge, setFilterAge] = React.useState('Tất cả');
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');

  React.useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  const regions = ['Tất cả', 'Huế', 'Nam Bộ', 'Bắc Bộ', 'Quảng Nam', 'Nghệ Tĩnh'];
  const topics = ['Tất cả', 'Sinh hoạt hằng ngày', 'Ký ức quê hương', 'Ca dao tục ngữ'];
  const ages = ['Tất cả', 'Dưới 18', '18-30', '31-50', 'Trên 50'];

  const filteredSamples = DEMO_SAMPLES.filter((sample) => {
    const matchesRegion = filterRegion === 'Tất cả' || sample.region.toLowerCase() === filterRegion.toLowerCase();
    const matchesTopic = filterTopic === 'Tất cả' || sample.topic.toLowerCase() === filterTopic.toLowerCase();
    const matchesAge = filterAge === 'Tất cả' || sample.speakerAgeGroup.toLowerCase() === filterAge.toLowerCase();
    
    const term = localSearch.toLowerCase().trim();
    const matchesSearch = 
      sample.title.toLowerCase().includes(term) ||
      sample.transcriptVerified.toLowerCase().includes(term) ||
      sample.province.toLowerCase().includes(term);

    // Only display approved samples for raw voice bank
    return matchesRegion && matchesTopic && matchesAge && matchesSearch && sample.status === 'approved';
  });

  return (
    <div className="bg-[#F8FAFC] rounded-3xl border border-gray-100 p-6 space-y-6">
      
      {/* Search and view toggle layout */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-gray-50 shadow-3xs">
        
        {/* Search input */}
        <div className="relative w-full md:max-w-md">
          <input
            type="text"
            placeholder="Tìm theo tựa câu, từ phương ngữ, vùng miền..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full text-xs pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-[#0F766E]"
          />
          <Search className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
        </div>

        {/* Filters and View mode toggle */}
        <div className="flex items-center gap-4 w-full md:w-auto overflow-x-auto justify-end">
          
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white text-[#0F766E]' : 'text-gray-450 hover:text-gray-600'}`}
              title="Chế độ Lưới"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-white text-[#0F766E]' : 'text-gray-450 hover:text-gray-600'}`}
              title="Chế độ Danh sách"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

      {/* Accordion Filter Parameters panel */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-5 rounded-2xl border border-gray-50 shadow-3xs">
        
        {/* Region filter */}
        <div>
          <label className="block text-[11px] font-black text-gray-400 mb-1.5 uppercase">Tập Trung Vùng Miền</label>
          <select
            value={filterRegion}
            onChange={(e) => setFilterRegion(e.target.value)}
            className="w-full text-xs p-2.5 rounded-lg border border-gray-250 bg-slate-50 focus:outline-[#0F766E]"
          >
            {regions.map((reg) => (
              <option key={reg} value={reg}>{reg}</option>
            ))}
          </select>
        </div>

        {/* Topic filter */}
        <div>
          <label className="block text-[11px] font-black text-gray-400 mb-1.5 uppercase">Chủ đề ghi âm</label>
          <select
            value={filterTopic}
            onChange={(e) => setFilterTopic(e.target.value)}
            className="w-full text-xs p-2.5 rounded-lg border border-gray-250 bg-slate-50 focus:outline-[#0F766E]"
          >
            {topics.map((top) => (
              <option key={top} value={top}>{top}</option>
            ))}
          </select>
        </div>

        {/* Age group filter */}
        <div>
          <label className="block text-[11px] font-black text-gray-400 mb-1.5 uppercase">Độ tuổi người nói</label>
          <select
            value={filterAge}
            onChange={(e) => setFilterAge(e.target.value)}
            className="w-full text-xs p-2.5 rounded-lg border border-gray-250 bg-slate-50 focus:outline-[#0F766E]"
          >
            {ages.map((age) => (
              <option key={age} value={age}>{age}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Records output listing */}
      <div className={viewMode === 'grid' 
        ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' 
        : 'space-y-4'
      }>
        {filteredSamples.map((sample) => (
          <AudioSampleCard
            key={sample.id}
            sample={sample}
            onSelect={onSelectSample}
            onPlayToggle={onPlayToggle}
            isPlaying={playingSample?.id === sample.id}
            currentPlayTime={playingTime}
          />
        ))}

        {filteredSamples.length === 0 && (
          <div className="col-span-full py-16 bg-white rounded-2xl text-center border border-dashed border-gray-200 flex flex-col items-center justify-center">
            <HelpCircle className="w-12 h-12 text-slate-300 mb-2" />
            <p className="text-xs text-gray-500 font-bold">Không khớp tệp dữ liệu âm thanh nào thỏa mãn bộ lọc kiểm trợ.</p>
          </div>
        )}
      </div>

    </div>
  );
}
