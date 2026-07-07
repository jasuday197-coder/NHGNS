/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { DEMO_WORDS } from '../data';
import { DialectWord } from '../types';
import { Search, Volume2, BookOpen, Heart, AlertCircle, Quote, Sparkles } from 'lucide-react';

export function DictionarySection() {
  const [filterRegion, setFilterRegion] = React.useState<string>('Tất cả');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedWord, setSelectedWord] = React.useState<DialectWord>(DEMO_WORDS[0]);
  const [loading, setLoading] = React.useState(false);
  const [aiExplanation, setAiExplanation] = React.useState<any | null>(null);

  const regions = ['Tất cả', 'Huế', 'Nam Bộ', 'Bắc Bộ', 'Quảng Nam', 'Nghệ Tĩnh'];

  const filteredWords = DEMO_WORDS.filter((word) => {
    const matchesRegion = filterRegion === 'Tất cả' || word.region.toLowerCase() === filterRegion.toLowerCase();
    const matchesSearch = word.word.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          word.meaning.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRegion && matchesSearch;
  });

  const selectWordItem = async (word: DialectWord) => {
    setSelectedWord(word);
    setAiExplanation(null);
    setLoading(true);

    // Call server API for additional dynamic model detail explanation
    try {
      const response = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word: word.word, region: word.region })
      });
      const data = await response.json();
      setAiExplanation(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSpeech = (tx: string) => {
    alert(`Đang phát thử phát âm từ địa phương: "${tx}"`);
  };

  return (
    <div className="bg-white rounded-3xl border border-[#0F766E]/10 shadow-md p-6">
      
      {/* Title block */}
      <div className="pb-5 border-b border-gray-100">
        <h2 className="text-xl font-bold text-[#0F172A] flex items-center gap-2">
          <BookOpen className="w-5.5 h-5.5 text-[#0F766E]" />
          Từ điển Phương ngữ Số cứu viện
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          Tra cứu nghĩa thâm sâu của từ địa phương bản sắc cổ xưa, tìm tòi văn hóa thô thổ dồi dào.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-6">
        
        {/* Left Side listing panel (Md 5 columns) */}
        <div className="md:col-span-5 space-y-4">
          
          {/* Search bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Nhập từ cần tra (răng, mô, bển...)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-250 bg-[#FFF7ED]/30 focus:outline-[#0F766E]"
            />
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          </div>

          {/* District regions filter flow */}
          <div className="flex gap-1 overflow-x-auto scrollbar-none py-1 border-b border-gray-50">
            {regions.map((reg) => (
              <button
                key={reg}
                onClick={() => setFilterRegion(reg)}
                className={`px-3 py-1.5 rounded-full text-[10px] font-black shrink-0 transition ${
                  filterRegion === reg
                    ? 'bg-[#0F766E] text-white shadow-3xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-150'
                }`}
              >
                {reg}
              </button>
            ))}
          </div>

          {/* List display */}
          <div className="space-y-2 max-h-[360px] overflow-y-auto pr-2 scrollbar-thin">
            {filteredWords.map((word) => {
              const selectedStyle = selectedWord.id === word.id;
              return (
                <div
                  key={word.id}
                  onClick={() => selectWordItem(word)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer flex justify-between items-center ${
                    selectedStyle
                      ? 'border-[#0F766E] bg-[#0F766E]/5 text-[#0F766E] shadow-3xs'
                      : 'border-slate-100 hover:bg-slate-50 text-[#0F172A]'
                  }`}
                >
                  <div>
                    <span className="text-xs bg-slate-100 text-slate-800 border border-slate-150 rounded-md px-1.5 py-0.5 font-bold mr-2 text-[10px]">
                      {word.region}
                    </span>
                    <strong className="text-sm font-bold">{word.word}</strong>
                    <span className="text-[10px] text-gray-400 block mt-1.5 truncate">Nghĩa: {word.meaning}</span>
                  </div>

                  <span className="text-[10px] font-mono text-gray-300">🔥 {word.popularityScore}</span>
                </div>
              );
            })}

            {filteredWords.length === 0 && (
              <div className="text-center py-8 text-xs text-gray-400">
                Không tìm thấy từ vựng ứng biến tương ứng.
              </div>
            )}
          </div>

        </div>

        {/* Right Side detailed dictionary sheet (Md 7 columns) */}
        <div className="md:col-span-7 bg-[#FFF7ED]/30 rounded-2xl border border-[#F59E0B]/10 p-5 md:p-6 flex flex-col justify-between">
          
          <div className="space-y-6">
            
            {/* Header info card */}
            <div className="flex justify-between items-start pb-4 border-b border-[#F59E0B]/10">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-rose-500/10 text-rose-700 font-extrabold text-[10px] border border-rose-500/20 rounded">
                    PHƯƠNG ÂM CHỦ VỤNG: {selectedWord.region}
                  </span>
                </div>
                <h3 className="text-3xl font-black text-[#0F172A] mt-2 flex items-center gap-2">
                  {selectedWord.word}
                  
                  {/* Speech playback trigger button */}
                  <button 
                    onClick={() => handleSpeech(selectedWord.word)}
                    className="p-1.5 bg-[#0F766E]/10 text-[#0F766E] hover:bg-[#0F766E] hover:text-white rounded-full transition cursor-pointer"
                    title="Nghe mẫu phát âm"
                  >
                    <Volume2 className="w-4 h-4 fill-current" />
                  </button>
                </h3>
                <p className="text-sm text-[#0F766E] font-black mt-1">
                  Nghĩa chung: {selectedWord.meaning}
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-black text-gray-450 uppercase block">Chỉ số tra cứu</span>
                <span className="text-xl font-bold font-mono text-[#D97706]">{selectedWord.popularityScore + 120}</span>
              </div>
            </div>

            {/* Example sentence of spelling usage */}
            <div>
              <span className="text-xs uppercase tracking-wider font-extrabold text-gray-400 block mb-2">Ví dụ câu thực tế</span>
              <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-3xs relative">
                <Quote className="absolute right-3 top-3 w-8 h-8 text-[#D97706]/10" />
                <p className="text-sm font-black italic text-slate-800">
                  "{selectedWord.exampleSentence}"
                </p>
                <p className="text-[11px] text-[#0F766E] font-semibold mt-1.5">
                  ➝ Việt ngữ Phổ thông: "{selectedWord.standardTranslation}"
                </p>
              </div>
            </div>

            {/* Deep Dynamic Research AI Explanation panel */}
            <div>
              <span className="text-xs uppercase tracking-wider font-extrabold text-[#0F766E] mb-2 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Tổng khảo lịch văn hóa địa phương (AI Insights)
              </span>

              {loading ? (
                <div className="p-6 bg-white/50 border border-slate-100 rounded-xl space-y-2">
                  <div className="h-4 bg-slate-200 rounded animate-pulse w-3/4"></div>
                  <div className="h-3 bg-slate-150 rounded animate-pulse w-full"></div>
                  <div className="h-3 bg-slate-150 rounded animate-pulse w-5/6"></div>
                </div>
              ) : (
                <div className="bg-white/80 rounded-xl p-4 border border-slate-100 text-xs text-gray-700 leading-relaxed shadow-3xs">
                  {aiExplanation ? aiExplanation.culturalNote : selectedWord.culturalNote}
                </div>
              )}
            </div>

          </div>

          <div className="mt-8 pt-4 border-t border-gray-100/60 text-[10px] text-gray-400 flex items-center gap-1.5 font-sans">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>Nguồn dịch gốc đã được Ban biên soạn Ngân Hàng Giọng Nói vinh dự bảo chứng học thuật.</span>
          </div>

        </div>

      </div>
    </div>
  );
}
