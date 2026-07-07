/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Header } from './components/Header';
import { VietnamMap } from './components/VietnamMap';
import { VoiceBankSection } from './components/VoiceBankSection';
import { AiToolsHub } from './components/AiToolsHub';
import { DictionarySection } from './components/DictionarySection';
import { UploadSection } from './components/UploadSection';
import { ChatbotSection } from './components/ChatbotSection';
import { QuizGame } from './components/QuizGame';
import { AdminSection } from './components/AdminSection';
import { AudioSample } from './types';
import { DEMO_SAMPLES } from './data';
import { 
  Sparkles, MapPin, Volume2, Search, Play, Heart, Share2, 
  Download, ArrowLeft, Headphones, Users, BookOpen, AlertCircle, Info, ChevronRight 
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = React.useState<string>('trang-chu');
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [selectedSample, setSelectedSample] = React.useState<AudioSample | null>(null);
  
  // Wave playback simulator states
  const [playingSample, setPlayingSample] = React.useState<AudioSample | null>(null);
  const [playingTime, setPlayingTime] = React.useState<string>('00:00');
  const [playIntervalId, setPlayIntervalId] = React.useState<any | null>(null);

  // Home Featured sample
  const featuredSample = DEMO_SAMPLES[0];

  const handlePlayToggle = (sample: AudioSample) => {
    if (playingSample?.id === sample.id) {
      // Pause
      if (playIntervalId) {
        clearInterval(playIntervalId);
        setPlayIntervalId(null);
      }
      setPlayingSample(null);
      setPlayingTime('00:00');
    } else {
      // Play
      if (playIntervalId) clearInterval(playIntervalId);
      setPlayingSample(sample);
      setPlayingTime('00:01');
      
      let durationSeconds = parseInt(sample.duration.split(':')[1]);
      let elapsed = 1;
      const tid = setInterval(() => {
        elapsed += 1;
        if (elapsed > durationSeconds) {
          clearInterval(tid);
          setPlayingSample(null);
          setPlayingTime('00:00');
        } else {
          setPlayingTime(`00:0${elapsed}`);
        }
      }, 1000);
      setPlayIntervalId(tid);
    }
  };

  const handleSearchCommit = (query: string) => {
    setSearchQuery(query);
  };

  const handleSelectDetailedSample = (sample: AudioSample) => {
    setSelectedSample(sample);
    setActiveTab('chi-tiet-giong-noi');
  };

  const mapRegionColor = (reg: string) => {
    switch (reg) {
      case 'Huế': return 'bg-pink-100 text-pink-700 border-pink-200';
      case 'Nam Bộ': return 'bg-teal-100 text-teal-700 border-teal-200';
      case 'Bắc Bộ': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Quảng Nam': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Nghệ Tĩnh': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF7ED]/35 text-[#0F172A] font-sans selection:bg-[#14B8A6]/30">
      
      {/* Header component */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setSelectedSample(null);
        }} 
        onSearch={handleSearchCommit} 
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        
        {/* VIEW 1: Trang chủ (Home) */}
        {activeTab === 'trang-chu' && (
          <div className="space-y-12 pb-16">
            
            {/* Elegant Hero Section matching prompt visuals */}
            <div className="bg-white rounded-3xl border border-[#0F766E]/10 shadow-md p-6 sm:p-10 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center gap-10">
              
              <div className="flex-1 space-y-6 z-10 text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0F766E]/10 border border-[#0F766E]/20 rounded-full text-xs font-black text-[#0F766E]">
                  <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
                  Dự án Quốc gia Số hóa & Bảo tồn Di sản âm thanh
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif-header font-black text-slate-900 leading-tight">
                  Lưu giữ tiếng nói <br />
                  <span className="text-[#0F766E] italic decoration-amber-500 underline decoration-wavy underline-offset-8">mỗi vùng đất Việt</span>
                </h1>

                <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-xl font-sans font-medium">
                  <span className="font-serif-header italic font-black text-[#D97706] text-base">“Mỗi giọng, một câu chuyện. Mỗi vùng, một bản sắc.”</span> <br />
                  Cổng kết nối văn hóa phương học Việt Nam. Ứng dụng trí tuệ nhân tạo nhận diện giọng nói, chuyển tự thổ âm, tra cứu từ điển xưa và san sẻ thắm tình đồng bào xa quê hương.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    onClick={() => setActiveTab('cong-cu-ai')}
                    className="px-6 py-3.5 bg-[#0F766E] hover:bg-[#0F766E]/90 text-white font-black text-xs rounded-xl shadow-md hover:scale-[1.02] transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    Thử AI đoán phương âm của bạn
                    <Sparkles className="w-4 h-4 text-amber-300" />
                  </button>

                  <button
                    onClick={() => setActiveTab('ban-do')}
                    className="px-6 py-3.5 bg-white border border-[#0F766E]/20 text-[#0F766E] font-black text-xs rounded-xl shadow-xs hover:bg-[#14B8A6]/5 transition cursor-pointer flex items-center justify-center gap-2"
                  >
                    Khám phá bản đồ vùng miền
                    <MapPin className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Decorative graphic matching prompt request (Bản đồ + Wave) */}
              <div className="flex-1 w-full max-w-[380px] md:max-w-none relative flex justify-center z-0">
                <div className="absolute w-[280px] h-[280px] rounded-full bg-[#14B8A6]/5 animate-pulse filter blur-xl"></div>
                <div className="border border-[#F59E0B]/20 bg-[#FFF7ED]/60 rounded-3xl p-6 shadow-sm border-dashed relative">
                  <span className="text-[9px] uppercase font-black text-gray-400">Chỉ điểm AI dự báo bản đồ</span>
                  <div className="flex items-center gap-4 mt-2">
                    <img
                      src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150"
                      alt="Youth vector"
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 rounded-full border border-gray-100 object-cover shrink-0"
                    />
                    <div>
                      <p className="text-xs font-black text-slate-800">Cụ bà Vĩ Dạ gõ hời...</p>
                      <span className="text-[10px] bg-pink-100 border border-pink-250 text-pink-700 px-1.5 py-0.5 rounded font-black font-mono">Huế: 72%</span>
                    </div>
                  </div>
                  
                  {/* Fake micro waves line */}
                  <div className="flex gap-1.5 items-end h-8 mt-5 select-none">
                    {[10, 40, 60, 20, 80, 45, 95, 30, 70, 45, 20, 60, 85].map((h, i) => (
                      <div key={i} style={{ height: `${h}%` }} className="w-1.5 bg-[#0F766E]/20 rounded-full" />
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* QUICK FEATURES OVERVIEW CARDS */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { title: 'AI dự đoán giọng', desc: 'Dự đoán vùng miền', tab: 'cong-cu-ai', col: 'bg-teal-500/5 hover:bg-teal-500/10 text-teal-700 border-teal-100' },
                { title: 'Chuyển âm tự thô', desc: 'Bóc nói thành văn', tab: 'cong-cu-ai', col: 'bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-700 border-emerald-100' },
                { title: 'Dịch thuật vùng', desc: 'Sòng phẳng nghĩa từ', tab: 'cong-cu-ai', col: 'bg-sky-500/5 hover:bg-sky-500/10 text-sky-700 border-sky-100' },
                { title: 'Bản đồ phương', desc: 'Sự phân bố di sản', tab: 'ban-do', col: 'bg-rose-500/5 hover:bg-rose-500/10 text-rose-700 border-rose-100' },
                { title: 'Từ điển cứu lục', desc: 'Mô răng rứa mệt', tab: 'tu-dien', col: 'bg-amber-500/5 hover:bg-amber-500/10 text-amber-700 border-amber-100' },
                { title: 'Cố vấn chatbot', desc: 'Đàm thoại di sản', tab: 'chatbot', col: 'bg-purple-500/5 hover:bg-purple-500/10 text-purple-700 border-purple-100' }
              ].map((f, i) => (
                <div
                  key={f.title + i}
                  onClick={() => {
                    setActiveTab(f.tab);
                    setSelectedSample(null);
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer text-center space-y-1.5 shadow-3xs ${f.col}`}
                >
                  <h3 className="font-sans text-xs font-black truncate">{f.title}</h3>
                  <p className="text-[10px] opacity-70 font-medium">{f.desc}</p>
                </div>
              ))}
            </div>

            {/* FEATURED SAYINGS OF THE DAY (CÂU NÓI NỔI BẬT HÔM NAY) */}
            <div className="bg-[#FFF7ED] border border-[#F59E0B]/25 rounded-3xl p-6 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm">
              <div className="flex-1">
                <span className="text-[10px] bg-[#D97706]/10 text-[#D97706] font-black px-2.5 py-1 rounded">
                  ✦ CÂU NÓI VÙNG MIỀN NỔI BẬT HÔM NAY
                </span>
                
                <h3 className="text-2xl sm:text-3xl font-serif-header font-bold text-teal-950 mt-3 italic leading-relaxed">
                  "Mệ đi mô rứa mệ? Mệ đi chợ chừ về răng rứa?"
                </h3>
                
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-xs text-gray-500">
                  <span className="font-bold text-gray-700">Dịch nghĩa phổ thông: "Bà đi đâu vậy bà? Bà đi chợ giờ về sao thế?"</span>
                  <span>·</span>
                  <span className="font-mono text-[11px] bg-pink-100 text-pink-700 px-1.5 py-0.5 rounded">Thừa Thiên Huế</span>
                </div>
              </div>

              {/* Home play click handler */}
              <button
                onClick={() => handlePlayToggle(featuredSample)}
                className="w-14 h-14 bg-[#0F766E] hover:bg-[#0F766E]/90 text-white rounded-full flex items-center justify-center shadow-md transition transform active:scale-95 shrink-0 cursor-pointer"
              >
                {playingSample?.id === featuredSample.id ? (
                  <span className="text-xs font-bold font-mono">STOP</span>
                ) : (
                  <Play className="w-5 h-5 fill-current ml-0.5 text-white" />
                )}
              </button>
            </div>

            {/* SYSTEM STATISTICS DECORATION CARDS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { count: '1,959', label: 'Tập tin giọng nói' },
                { count: '63/63', label: 'Tỉnh thành phủ sóng' },
                { count: '754', label: 'Cốt từ địa phương cổ' },
                { count: '1,230', label: 'Tổng số người hiến giọng' }
              ].map((stat, idx) => (
                <div
                  key={stat.label + idx}
                  className="bg-white rounded-2xl border border-gray-100 p-5 text-center shadow-3xs hover:border-[#14B8A6]/20 transition"
                >
                  <p className="text-2xl text-[#0F766E] font-mono font-black">{stat.count}</p>
                  <p className="text-xs text-gray-400 font-bold mt-1.5">{stat.label}</p>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* VIEW 2: Bản đồ phương ngữ */}
        {activeTab === 'ban-do' && (
          <VietnamMap 
            onSelectRegion={(reg) => {
              setSearchQuery('');
              setActiveTab('ngan-hang');
            }} 
            onPlaySample={handlePlayToggle} 
          />
        )}

        {/* VIEW 3: Ngân hàng giọng nói (Searchable sound bank) */}
        {activeTab === 'ngan-hang' && (
          <VoiceBankSection
            searchQuery={searchQuery}
            onSelectSample={handleSelectDetailedSample}
            onPlayToggle={handlePlayToggle}
            playingSample={playingSample}
            playingTime={playingTime}
          />
        )}

        {/* VIEW 4: Chi tiết một giọng nói (Detailed single sound viewer) */}
        {activeTab === 'chi-tiet-giong-noi' && selectedSample && (
          <div className="space-y-6 pb-16">
            
            {/* Back indicator */}
            <button
              onClick={() => setActiveTab('ngan-hang')}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-2 focus:outline-none transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại kho âm thanh
            </button>

            {/* Layout details structure */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Core media player (Lg 7 columns) */}
              <div className="lg:col-span-7 bg-white rounded-3xl border border-gray-150/40 p-6 space-y-6 shadow-sm">
                
                {/* Speaker metadata card */}
                <div className="flex gap-4 items-center pb-4 border-b border-gray-100">
                  <div className="w-14 h-14 bg-[#FFF7ED] border border-[#F59E0B]/20 rounded-full flex items-center justify-center shrink-0">
                    <Headphones className="w-6 h-6 text-[#D97706] animate-bounce" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#0F172A]">{selectedSample.title}</h3>
                    <p className="text-xs text-gray-400 font-medium">
                      Tuổi: <span className="font-bold text-gray-650">{selectedSample.speakerAgeGroup}</span> · Giới vật: <span className="font-bold text-gray-650">{selectedSample.speakerGender}</span> · Đại lý: <span className="font-bold text-[#0F766E]">{selectedSample.province}</span>
                    </p>
                  </div>
                </div>

                {/* Big phrase container */}
                <div className="bg-[#FFF7ED]/45 border border-[#F59E0B]/10 rounded-2xl p-6 text-center select-none">
                  <span className="text-[9px] uppercase font-black text-gray-400">Câu nói gốc thổ điệu</span>
                  <p className="text-xl font-black text-slate-800 italic mt-2">
                    "{selectedSample.transcriptVerified}"
                  </p>
                </div>

                {/* Player seek slide triggers */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center justify-between gap-4">
                  <button
                    onClick={() => handlePlayToggle(selectedSample)}
                    className="w-12 h-12 rounded-full bg-[#0F766E] text-white flex items-center justify-center shadow-md shrink-0 cursor-pointer hover:scale-105 active:scale-95 transition"
                  >
                    {playingSample?.id === selectedSample.id ? (
                      <span className="text-[10px] font-bold">PAUSE</span>
                    ) : (
                      <Play className="w-4.5 h-4.5 fill-current ml-0.5 text-white" />
                    )}
                  </button>

                  <div className="flex-1 space-y-1">
                    <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                      <div 
                        style={{ width: playingSample?.id === selectedSample.id ? '60%' : '0%' }}
                        className="h-full bg-[#14B8A6] rounded-full transition-all duration-1000"
                      />
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-mono text-gray-400">
                      <span>{playingSample?.id === selectedSample.id ? playingTime : '00:00'}</span>
                      <span>{selectedSample.duration}</span>
                    </div>
                  </div>
                </div>

                {/* Action array */}
                <div className="flex gap-2 text-center pt-3 border-t border-gray-150/40">
                  <button
                    onClick={() => handlePlayToggle(selectedSample)}
                    className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
                  >
                    Thích nước hố ({selectedSample.likes})
                  </button>

                  <button
                    onClick={() => alert('Đang chuẩn bị file tải xuống phương âm chất lượng cao...')}
                    className="flex-1 py-2 bg-slate-100 hover:bg-slate-100 text-slate-800 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
                  >
                    Tải file (.wav)
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>

              {/* Side translation analysis panel (Lg 5 columns) */}
              <div className="lg:col-span-5 bg-[#FFF7ED]/20 border border-[#F59E0B]/15 rounded-3xl p-5 md:p-6 space-y-5">
                <h3 className="font-bold text-gray-800 text-sm flex items-center gap-1.5">
                  <Sparkles className="w-4.5 h-4.5 text-amber-500 animate-spin" />
                  Biên dịch & Khảo soát của AI (System Analysis)
                </h3>

                <div className="space-y-4">
                  
                  {/* AI transcript */}
                  <div>
                    <span className="text-[10px] uppercase font-black text-gray-400 block mb-1">AI Trích nói tự động (Speech-to-Text)</span>
                    <p className="text-xs bg-white rounded-lg p-3 border border-slate-100 shadow-3xs italic text-gray-400">
                      "{selectedSample.transcriptAi}"
                    </p>
                  </div>

                  {/* Standard translating */}
                  <div>
                    <span className="text-[10px] uppercase font-black text-[#0F766E] block mb-1">Dịch nghĩa chuẩn tiếng phổ thông</span>
                    <p className="text-sm font-black text-[#0F766E] bg-teal-500/5 p-3.5 rounded-lg border border-[#14B8A6]/20">
                      "{selectedSample.standardVietnameseTranslation}"
                    </p>
                  </div>

                  {/* Vocabulary breakdown keywords */}
                  <div>
                    <span className="text-[10px] uppercase font-black text-gray-400 block mb-1.5">Từ khóa địa phương nhận diện</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedSample.dialectWords.map((word) => (
                        <span
                          key={word}
                          className="px-2.5 py-0.5 bg-amber-500/10 text-[#D97706] font-extrabold text-[10px] border border-amber-500/20 rounded cursor-help"
                          onClick={() => {
                            setActiveTab('tu-dien');
                            setSelectedSample(null);
                          }}
                          title="Click để tra từ điển"
                        >
                          #{word}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Quality assessment report */}
                  {selectedSample.audioQuality && (
                    <div className="pt-3 border-t border-[#F59E0B]/10">
                      <span className="text-[10px] uppercase font-black text-gray-400 block mb-1">Trạng thái kỹ thuật âm thanh</span>
                      <p className="text-[11px] text-gray-600 font-medium">
                        Điểm chất lượng: <span className="font-bold text-emerald-600">{selectedSample.audioQuality.score}%</span> · Nhiễu nền sàn: <span className="font-bold text-emerald-600">{selectedSample.audioQuality.noise}</span>
                      </p>
                    </div>
                  )}

                </div>

              </div>

            </div>

          </div>
        )}

        {/* VIEW 5: Công cụ AI */}
        {activeTab === 'cong-cu-ai' && <AiToolsHub />}

        {/* VIEW 6: Từ điển */}
        {activeTab === 'tu-dien' && <DictionarySection />}

        {/* VIEW 7: Đóng góp */}
        {activeTab === 'dong-gop' && <UploadSection />}

        {/* VIEW 8: Chatbot */}
        {activeTab === 'chatbot' && <ChatbotSection />}

        {/* VIEW 9: Trò chơi / Khám phá */}
        {activeTab === 'tro-choi' && <QuizGame />}

        {/* VIEW 10: Quản trị */}
        {activeTab === 'quan-tri' && <AdminSection />}

      </main>

      {/* FOOTER CO-FOUNDERS */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-4 border-t border-slate-800 tracking-wide">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-left text-xs">
          
          <div className="space-y-4">
            <h4 className="text-white font-black uppercase text-sm">NGÂN HÀNG GIỌNG NÓI SỐ</h4>
            <p className="opacity-80">
              Cổng di sản thông minh ứng dụng học máy tiên tiến nhằm lưu giữ tiếng nói thổ điệu ấm áp trọn vẹn của 3 miền Bắc – Trung – Nam sông núi nước Việt.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-white font-black uppercase text-sm">LĨNH VỰC KHẢO CỨU</h4>
            <p className="opacity-80">
              Đề tài nghiên cứu khoa học kỹ thuật cấp THPT về Lĩnh vực Khoa học Xã hội & Hành vi. Toàn bộ mã nguồn và dữ liệu đã được bảo lưu quyền sử dụng phi lợi nhuận.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-white font-black uppercase text-sm">LIÊN HỆ & QUYỀN RIÊNG TƯ</h4>
            <p className="opacity-80">
              Email cố vấn: jasuday197@gmail.com <br />
              Văn phòng bảo hộ: Viện Nghiên cứu Ngôn ngữ và Nhân học Phương học Việt Nam.
            </p>
          </div>

        </div>

        <div className="max-w-7xl mx-auto border-t border-slate-800 mt-8 pt-8 text-center text-[10px] text-slate-500">
          © 2026 Ngân Hàng Giọng Nói Số Việt Nam. Built with ❤️ for cultural preservation.
        </div>
      </footer>

    </div>
  );
}
