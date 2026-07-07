/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AudioSample } from '../types';
import { DEMO_SAMPLES } from '../data';
import { ShieldCheck, FileCheck, Play, Check, X, Edit2, CheckCircle, BarChart3, Clock } from 'lucide-react';

export function AdminSection() {
  const [samplesQueue, setSamplesQueue] = React.useState<AudioSample[]>(DEMO_SAMPLES);
  const [selectedItem, setSelectedItem] = React.useState<AudioSample | null>(DEMO_SAMPLES.find(s => s.status === 'pending') || DEMO_SAMPLES[0]);

  // Edits drafting state
  const [editTranscript, setEditTranscript] = React.useState(selectedItem?.transcriptVerified || '');
  const [editTranslation, setEditTranslation] = React.useState(selectedItem?.standardVietnameseTranslation || '');

  React.useEffect(() => {
    if (selectedItem) {
      setEditTranscript(selectedItem.transcriptVerified);
      setEditTranslation(selectedItem.standardVietnameseTranslation);
    }
  }, [selectedItem]);

  const handleApprove = (id: string) => {
    setSamplesQueue((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            status: 'approved',
            transcriptVerified: editTranscript,
            standardVietnameseTranslation: editTranslation
          };
        }
        return item;
      })
    );
    alert('Đã phê duyệt thành công mẫu phương âm đóng góp vào Ngân Hàng Giọng Nói Số!');
  };

  const handleReject = (id: string) => {
    setSamplesQueue((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'rejected' } : item))
    );
    alert('Đã khước từ phê duyệt mẫu đóng góp.');
  };

  const pendingCount = samplesQueue.filter(s => s.status === 'pending').length;
  const approvedCount = samplesQueue.filter(s => s.status === 'approved').length;

  return (
    <div className="bg-white rounded-3xl border border-[#0F766E]/10 shadow-md p-6">
      
      {/* Title */}
      <div className="pb-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#0F172A] flex items-center gap-2">
            <ShieldCheck className="w-5.5 h-5.5 text-rose-600 animate-pulse" />
            Cổng Kiểm Duyệt Tài Nguyên Học Thuật (Admin)
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Xét cấp giấy chứng nhận đóng góp giọng nói, nắn chỉnh phụ đề tự động (ASR) và chuẩn hóa Việt ngữ.
          </p>
        </div>

        {/* Dynamic statistics */}
        <div className="flex gap-2">
          <div className="bg-[#FFF7ED] border border-[#F59E0B]/20 text-[#D97706] rounded-xl px-3 py-1.5 text-center shadow-3xs">
            <span className="text-[9px] uppercase font-bold block text-[#D97706]/70">Chờ duyệt</span>
            <span className="text-xs font-mono font-bold leading-none">{pendingCount} files</span>
          </div>

          <div className="bg-[#0F766E]/10 border border-[#0F766E]/20 text-[#0F766E] rounded-xl px-3 py-1.5 text-center shadow-3xs">
            <span className="text-[9px] uppercase font-bold block text-[#0F766E]/70">Đã duyệt</span>
            <span className="text-xs font-mono font-bold leading-none">{approvedCount} files</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
        
        {/* Left list of items awaiting moderation (Lg 5 columns) */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="font-bold text-gray-800 text-xs uppercase tracking-wider mb-2">Hàng đợi kiểm duyệt</h3>
          
          <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-2 scrollbar-thin">
            {samplesQueue.map((item) => {
              const worksStyle = selectedItem?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer flex flex-col justify-between ${
                    worksStyle
                      ? 'border-[#0F766E] bg-[#0F766E]/5'
                      : 'border-slate-100 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[10px] font-black text-[#0F766E] bg-[#14B8A6]/10 px-1.5 py-0.5 rounded">
                      {item.region}
                    </span>
                    
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      item.status === 'pending'
                        ? 'bg-amber-100 text-amber-800'
                        : item.status === 'approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {item.status === 'pending' ? 'Bản thảo' : item.status === 'approved' ? 'Chào sàn' : 'Khước từ'}
                    </span>
                  </div>

                  <strong className="text-xs text-gray-800 font-bold block truncate">{item.title}</strong>
                  <span className="text-[10px] text-gray-400 mt-2 block font-medium">Bởi: {item.speakerName} · {item.duration}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right review worksheet (Lg 7 columns) */}
        {selectedItem ? (
          <div className="lg:col-span-7 bg-[#FFF7ED]/30 rounded-2xl border border-[#F59E0B]/10 p-5 space-y-4">
            
            <div className="pb-3 border-b border-gray-100 flex justify-between items-start">
              <div>
                <span className="text-[10px] font-black text-gray-400 block uppercase">ĐANG KIỂM DUYỆT CHI TIẾT</span>
                <h4 className="text-lg font-black text-[#0F172A] mt-1">{selectedItem.title}</h4>
                <p className="text-xs text-slate-550 mt-1">
                  Độ tuổi: {selectedItem.speakerAgeGroup} · Địa bàn: {selectedItem.province}
                </p>
              </div>

              <button 
                onClick={() => alert('Phát mẫu thử audio thu âm trực tiếp')}
                className="p-3 bg-rose-600 text-white rounded-full flex items-center justify-center shadow-xs cursor-pointer hover:bg-rose-700 transition"
                title="Nghe audio nguyên chất"
              >
                <Play className="w-4 h-4 fill-current ml-0.5 text-white" />
              </button>
            </div>

            {/* Quality Analysis Checklist */}
            <div className="bg-white p-3 border border-slate-100 rounded-xl grid grid-cols-3 gap-3 text-center">
              <div>
                <span className="text-[9px] text-gray-400 block uppercase font-bold">Chất lượng âm thanh</span>
                <span className="text-xs text-emerald-600 font-extrabold">{selectedItem.audioQuality?.volume || 'Tốt'}</span>
              </div>
              <div>
                <span className="text-[9px] text-gray-400 block uppercase font-bold">Nhiễu sàn nền</span>
                <span className="text-xs text-emerald-600 font-extrabold">{selectedItem.audioQuality?.noise || 'Thấp'}</span>
              </div>
              <div>
                <span className="text-[9px] text-gray-400 block uppercase font-bold">Điểm số AI đánh giá</span>
                <span className="text-xs text-[#0F766E] font-black">{selectedItem.audioQuality?.score || '92'}%</span>
              </div>
            </div>

            {/* Editing Box */}
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-black text-gray-500 mb-1 flex items-center gap-1">
                  <Edit2 className="w-3 h-3 text-[#0F766E]" />
                  Hiệu chỉnh Biên âm (AI Transcript Verified)
                </label>
                <input
                  type="text"
                  value={editTranscript}
                  onChange={(e) => setEditTranscript(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-[#0F766E]"
                />
                <span className="text-[9px] text-gray-400 block mt-1">Bản bộc lọc thô từ AI: "{selectedItem.transcriptAi}"</span>
              </div>

              <div>
                <label className="block text-[11px] font-black text-gray-500 mb-1 flex items-center gap-1">
                  <FileCheck className="w-3 h-3 text-[#0F766E]" />
                  Dịch thuật Việt ngôn phổ thông
                </label>
                <input
                  type="text"
                  value={editTranslation}
                  onChange={(e) => setEditTranslation(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-[#0F766E]"
                />
              </div>
            </div>

            {/* Call Action array and decisions */}
            <div className="pt-4 border-t border-gray-100/60 flex gap-2">
              <button
                onClick={() => handleReject(selectedItem.id)}
                className="flex-1 py-2.5 bg-rose-50 text-rose-700 hover:bg-rose-100 font-black rounded-xl text-xs flex items-center justify-center gap-1.5 transition border border-rose-150 cursor-pointer"
              >
                <X className="w-4 h-4" />
                Không Duyệt (Từ chối)
              </button>

              <button
                onClick={() => handleApprove(selectedItem.id)}
                className="flex-1 py-2.5 bg-[#0F766E] hover:bg-[#0F766E]/90 text-white font-black rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow-xs cursor-pointer"
              >
                <Check className="w-4 h-4 text-white" />
                Duyệt & Công Khai
              </button>
            </div>

          </div>
        ) : (
          <div className="lg:col-span-12 py-16 text-center border-2 border-dashed border-slate-200 rounded-3xl text-xs text-gray-400">
            Hàng đợi kiểm duyệt hiện thời đã thanh tẩy sạch sẽ.
          </div>
        )}

      </div>
    </div>
  );
}
