/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Upload, Mic, Trash2, CheckCircle, ShieldCheck, Sparkles, Loader } from 'lucide-react';

export function UploadSection() {
  const [isRecording, setIsRecording] = React.useState(false);
  const [recordDuration, setRecordDuration] = React.useState(0);
  
  // Form input fields values
  const [title, setTitle] = React.useState('Ghi âm tiếng Nghệ An mộc mạc');
  const [region, setRegion] = React.useState('Nghệ Tĩnh');
  const [province, setProvince] = React.useState('Nghệ An');
  const [ageGroup, setAgeGroup] = React.useState('18-30');
  const [gender, setGender] = React.useState('Nam');
  const [topic, setTopic] = React.useState('Sinh hoạt hằng ngày');
  const [rawText, setRawText] = React.useState('Nỏ biết mô tê răng rứa mần răng đây rứa mệ');
  const [consent, setConsent] = React.useState(false);

  // States for dynamic post submit AI checks
  const [loading, setLoading] = React.useState(false);
  const [aiReport, setAiReport] = React.useState<any | null>(null);
  const [submittedStatus, setSubmittedStatus] = React.useState<any | null>(null);

  React.useEffect(() => {
    let timer: any;
    if (isRecording) {
      timer = setInterval(() => {
        setRecordDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordDuration(0);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  const handleUploadSimulate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) {
      alert('Vui lòng bấm chấp thuận chính sách sử dụng dữ liệu bảo tồn văn hóa nhé.');
      return;
    }

    setLoading(true);
    setAiReport(null);

    // AI Check simulating
    setTimeout(() => {
      setAiReport({
        volume: 'Tốt (volume: -15 LUFS, phân dải chuẩn)',
        noise: 'Thấp (Môi trường ghi âm sạch sẽ)',
        score: 95,
        predictedRegion: 'Nghệ Tĩnh (mức tin cậy 87.4%)',
        transcriptDraft: 'Tui nỏ biết chi mô. Mần răng rứa? Tui thương xứ Nghệ mình.',
        keywordsFound: ['tui', 'nỏ', 'chi', 'mô', 'mần', 'răng', 'rứa']
      });
      setLoading(false);
    }, 2000);
  };

  const handleSendToQueue = () => {
    setSubmittedStatus({
      id: `cont_id_${Date.now().toString().slice(-6)}`,
      status: 'pending',
      message: 'Hệ thống đã ghi nhận gửi mẫu ghi âm của bạn thành công. File âm thanh cùng biên dịch đang được chuyển đến Ban Cố vấn văn hóa kiểm duyệt trước khi chính thức sáp nhập Ngân Hàng Giọng Nói.'
    });
  };

  return (
    <div className="bg-white rounded-3xl border border-[#0F766E]/10 shadow-md p-6">
      
      {/* Title */}
      <div className="pb-5 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#0F172A] flex items-center gap-2">
            <Mic className="w-5.5 h-5.5 text-[#0F766E]" />
            Đóng góp mẫu giọng nói bảo tồn văn hóa Việt
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Gieo thêm một giọng nói địa phương mộc mạc làm giàu di sản số phương ngữ Việt Nam.
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-400 font-bold bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          Mã hóa ẩn danh bảo mật
        </div>
      </div>

      {!submittedStatus ? (
        <form onSubmit={handleUploadSimulate} className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-6">
          
          {/* Uploader section (Md 5 columns) */}
          <div className="md:col-span-5 space-y-4">
            
            {/* Drag Drop File block */}
            <div className="border-2 border-dashed border-[#0F766E]/20 hover:border-[#14B8A6] rounded-2xl p-6 bg-[#0F766E]/5 text-center cursor-pointer transition flex flex-col items-center justify-center min-h-[190px]">
              <Upload className="w-9 h-9 text-[#0F766E] opacity-70 mb-2" />
              <span className="text-xs font-bold text-gray-700">Kéo thả file ghi âm vào đây</span>
              <span className="text-[10px] text-gray-400 mt-1">Hoặc nhấp chuột để chọn từ máy tính (WAV, MP3)</span>
            </div>

            <div className="text-center text-[10px] uppercase font-black text-gray-400">- Hoặc thu âm khẩn cấp qua mic -</div>

            {/* Micro Live Recorder block with indicator waveforms */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
              <button
                type="button"
                onClick={() => setIsRecording(!isRecording)}
                className={`w-11 h-11 rounded-full flex items-center justify-center shadow-xs transition ${
                  isRecording ? 'bg-rose-600 text-white animate-pulse' : 'bg-[#0F766E] text-white'
                }`}
              >
                <Mic className="w-4.5 h-4.5 fill-current text-white" />
              </button>

              <div className="flex-1 px-4">
                <span className="text-[11px] font-bold text-gray-800 block">
                  {isRecording ? '🎧 Đang thu tiếng trực diện...' : 'Bấm ghi âm trực tiếp'}
                </span>
                <span className="text-[10px] text-gray-450 mt-0.5 block font-mono">
                  {isRecording ? `Chiều dài: 00:0${recordDuration} giây` : 'Chưa bật micro'}
                </span>
              </div>
            </div>

            {/* Instruction bullet */}
            <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 text-[10.5px] text-gray-500 leading-relaxed space-y-2">
              <p className="font-bold text-gray-700 uppercase">Cần dặn đọc câu mẫu trước khi gửi:</p>
              <p className="italic">"Tui nỏ biết chi mô. Mần răng rứa? Tui thương xứ Nghệ mình lắm."</p>
            </div>

          </div>

          {/* Form settings panel (Md 7 columns) */}
          <div className="md:col-span-7 space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 mb-1">Tên lưu gọi mẫu giọng</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-250 bg-slate-50 focus:outline-[#0F766E]"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-500 mb-1">Nhóm tuổi</label>
                <select
                  value={ageGroup}
                  onChange={(e) => setAgeGroup(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-250 bg-slate-50"
                >
                  <option value="Dưới 18">Dưới 18 tuổi</option>
                  <option value="18-30">Phân trẻ (18 - 30)</option>
                  <option value="31-50">Trung niên (31 - 50)</option>
                  <option value="Trên 50">Trưởng bối (Trên 50)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 mb-1">Phương ngữ vùng</label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-250 bg-slate-50"
                >
                  <option value="Bắc Bộ">Đồng bằng Bắc Bộ</option>
                  <option value="Nghệ Tĩnh">Xứ Nghệ (Nghệ Tĩnh)</option>
                  <option value="Huế">Bản sắc Huế</option>
                  <option value="Quảng Nam">Xứ Quảng</option>
                  <option value="Nam Bộ">Nam Bộ Sông nước</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-500 mb-1">Tỉnh thành cụ thể</label>
                <input
                  type="text"
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-250 bg-slate-50 focus:outline-[#0F766E]"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-500 mb-1">Chủ đề mẫu kể</label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-250 bg-slate-50"
                >
                  <option value="Sinh hoạt hằng ngày">Đời sống hằng ngày</option>
                  <option value="Ký ức quê hương">Ký ức tuổi thơ</option>
                  <option value="Ca dao tục ngữ">Ca dao tục ngữ / Ví dợm</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-500 mb-1">Chép đính đoạn nghĩa nói nguyên bản (Không bắt buộc)</label>
              <textarea
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-gray-250 bg-slate-50 focus:outline-[#0F766E]"
                rows={2}
              />
            </div>

            {/* Consent checklist */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 flex items-start gap-3">
              <input
                id="consent-box"
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-1 w-4 h-4 text-[#0F766E] border-slate-300 rounded focus:ring-[#0F766E]"
              />
              <label htmlFor="consent-box" className="text-[10.5px] text-gray-600 leading-normal font-sans">
                Tôi đồng ý hiến tặng mẫu giọng nói này cho 
                <strong className="text-gray-800"> Ngân hàng Giọng nói Số Việt Nam </strong> 
                sử dụng vô điều kiện và hoàn toàn miễn phí vì mục đích giáo dục, nghiên cứu phi lợi nhuận và tôn vinh bảo tồn bản sắc văn hóa các dân tộc.
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-[#0F766E] hover:bg-[#0F766E]/90 text-white font-black text-xs py-3 rounded-xl transition shadow-sm cursor-pointer"
            >
              Phép kiểm Trí Tuệ Nhân Tạo & Phê duyệt sơ khai
            </button>

          </div>

        </form>
      ) : (
        /* Status confirmation success panel */
        <div className="py-12 text-center max-w-xl mx-auto space-y-4">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm border border-emerald-150">
            <CheckCircle className="w-8 h-8 font-bold" />
          </div>

          <h3 className="font-sans text-xl font-bold text-[#0F172A]">Gửi đóng đóng góp thành công!</h3>
          <p className="text-xs text-gray-600 leading-relaxed bg-[#FFF7ED]/30 p-4 rounded-2xl border border-[#F59E0B]/10">
            {submittedStatus.message}
          </p>

          <footer className="footer pt-4 flex gap-3 text-center">
            <button
              onClick={() => setSubmittedStatus(null)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex-1 cursor-pointer"
            >
              Góp thêm mẫu giọng khác
            </button>
          </footer>
        </div>
      )}

      {/* Dynamic post-submit AI Checker report page */}
      {loading && (
        <div className="mt-8 pt-8 border-t border-slate-150/60 text-center space-y-2 py-8 bg-slate-50 rounded-2xl">
          <Loader className="w-8 h-8 text-[#0F766E] animate-spin mx-auto" />
          <p className="text-xs font-bold text-gray-700">Mô hình AI đang kiểm toán tệp tin âm thanh...</p>
          <p className="text-[10px] text-gray-400">Đang kiểm định nhiễu, volume, thời lượng và bóc transcript nháp.</p>
        </div>
      )}

      {aiReport && !submittedStatus && (
        <div className="mt-8 pt-8 border-t border-slate-150/60 space-y-4">
          
          <div className="flex items-center gap-2">
            <Sparkles className="w-4.5 h-4.5 text-amber-500" />
            <span className="text-xs font-black text-slate-800 uppercase tracking-wider">BIÊN BẢN KIỂM TOÁN TỰ ĐỘNG CỦA AI</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            
            <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-xl">
              <span className="text-[9px] uppercase font-bold text-gray-400">Dự báo phương âm (95% score)</span>
              <p className="text-xs font-bold text-[#0F766E] mt-1">{aiReport.predictedRegion}</p>
            </div>

            <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-xl">
              <span className="text-[9px] uppercase font-bold text-gray-400">Âm lượng (LuFS)</span>
              <p className="text-xs font-bold text-[#0F766E] mt-1">{aiReport.volume}</p>
            </div>

            <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-xl">
              <span className="text-[9px] uppercase font-bold text-gray-400">Nhiễu sàn nền (SNR)</span>
              <p className="text-xs font-bold text-[#0F766E] mt-1">{aiReport.noise}</p>
            </div>

          </div>

          <div className="bg-[#FFF7ED] border border-[#F59E0B]/20 rounded-xl p-4">
            <span className="text-[10px] font-black text-[#D97706] block mb-1 uppercase">Bản dịch phụ đề nháp bộc lọc (ASR Draft):</span>
            <p className="text-sm font-black italic text-slate-800">
              "{aiReport.transcriptDraft}"
            </p>

            <div className="mt-3">
              <span className="text-[10px] font-black text-gray-400 block mb-1 uppercase">Từ cổ / từ địa phương trích lục:</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {aiReport.keywordsFound.map((k: string) => (
                  <span key={k} className="bg-white border border-slate-150 rounded px-2 py-0.5 text-[9px] font-mono text-gray-750">
                    #{k}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleSendToQueue}
            className="w-full bg-[#D97706] hover:bg-[#D97706]/90 text-white font-black text-xs py-3 rounded-xl transition shadow-sm cursor-pointer"
          >
            Đồng ý với biên dịch AI & Gửi lên Ban Cố Vấn
          </button>

        </div>
      )}

    </div>
  );
}
