/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  AudioLines, HelpCircle, FileText, Languages, VolumeX, BarChart3, Play, 
  HelpCircle as QuestionIcon, RefreshCw, Upload, CheckCircle2, ChevronRight, Volume2 
} from 'lucide-react';

export function AiToolsHub() {
  const [activeSubTab, setActiveSubTab] = React.useState<'guess' | 's2t' | 'translate' | 'tts' | 'tagging'>('guess');
  const [loading, setLoading] = React.useState(false);

  // File recording state
  const [isRecording, setIsRecording] = React.useState(false);
  const [recordDuration, setRecordDuration] = React.useState(0);
  const [audioUrl, setAudioUrl] = React.useState<string | null>(null);

  // Output response states
  const [guessResult, setGuessResult] = React.useState<any | null>(null);
  const [transcriptResult, setTranscriptResult] = React.useState<any | null>(null);
  
  // Translation values
  const [translateInput, setTranslateInput] = React.useState('Răng bữa ni mi đi học trễ rứa?');
  const [translateResult, setTranslateResult] = React.useState<any | null>(null);
  
  // TTS configuration
  const [ttsInput, setTtsInput] = React.useState('Xin chào các bạn. Hôm nay chúng ta cùng tìm hiểu hồn quê hương nguồn cội của thổ điệu phương ngữ Việt Nam nhé.');
  const [ttsRegion, setTtsRegion] = React.useState('Huế');
  const [ttsVoice, setTtsVoice] = React.useState('Nữ');
  const [ttsResult, setTtsResult] = React.useState<any | null>(null);
  
  // Automated tagging values
  const [taggingResult, setTaggingResult] = React.useState<any | null>(null);

  // Recording timer
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

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      // Create mock audio preview after 3 seconds record
      setAudioUrl('mock_recorded_voice_preview');
    } else {
      setAudioUrl(null);
      setIsRecording(true);
    }
  };

  const handleGuessDialect = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/dialect-predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audioBase64: 'mock_base64_recorded', filename: 'recorded_user_voice.mp3' })
      });
      const data = await response.json();
      setGuessResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSpeechToText = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/speech-to-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audioBase64: 'mock_base64_recorded', regionHint: 'Huế' })
      });
      const data = await response.json();
      setTranscriptResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleTranslate = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sentence: translateInput })
      });
      const data = await response.json();
      setTranslateResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleTts = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: ttsInput, region: ttsRegion, voice: ttsVoice })
      });
      const data = await response.json();
      setTtsResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAutoTagging = async () => {
    setLoading(true);
    // Simulate complex tagging metadata
    setTimeout(() => {
      setTaggingResult({
        dialectRegion: 'Nam Bộ (mức tin cậy 89%)',
        subjectTopic: 'Sinh hoạt hằng ngày / Tình cảm quê hương',
        volumeLevel: 'Tốt (volume: -14.2 LUFS)',
        ambientNoise: 'Thấp (SNR: 35 dB)',
        fileDuration: '00:15 / Chứa tiếng nói người thật',
        dialectKeywords: ['bển', 'mần', 'bữa nay', 'dữ hôn'],
        languageFormat: 'Vietnamese_Southern_Dialect_V2'
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="bg-white rounded-3xl border border-[#0F766E]/10 shadow-md p-6">
      
      {/* Tab Navigation header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-gray-100">
        <div>
          <h2 className="text-xl font-bold text-[#0F172A] flex items-center gap-2">
            <AudioLines className="w-5.5 h-5.5 text-[#0F766E]" />
            Cổng xử lý Trí Tuệ Nhân Tạo (AI Tools)
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Ứng dụng mô hình nền nòng cốt nhằm nhận diện, chuyển đổi thổ âm và tra lục ngôn ngữ tự động.
          </p>
        </div>

        {/* Small badge */}
        <div className="text-xs bg-amber-500/10 border border-amber-500/20 text-[#D97706] rounded-full px-3 py-1 font-semibold flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
          Đang kết nối Server AI
        </div>
      </div>

      {/* Sub tabs selectors */}
      <div className="flex flex-wrap gap-2 py-4">
        {[
          { id: 'guess', label: 'AI đoán giọng bạn', icon: BarChart3 },
          { id: 's2t', label: 'Chuyển giọng ➝ Văn bản (ASR)', icon: FileText },
          { id: 'translate', label: 'Dịch phương ngữ phổ thông', icon: Languages },
          { id: 'tts', label: 'Tạo giọng đọc vùng miền (TTS)', icon: Volume2 },
          { id: 'tagging', label: 'Tự động gắn nhãn JSON', icon: HelpCircle }
        ].map((tab) => {
          const TabIcon = tab.icon;
          const isSelected = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveSubTab(tab.id as any);
                setGuessResult(null);
                setTranscriptResult(null);
                setTranslateResult(null);
                setTtsResult(null);
                setTaggingResult(null);
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition duration-200 cursor-pointer ${
                isSelected
                  ? 'bg-[#0F766E] text-white shadow-sm'
                  : 'bg-slate-50 border border-slate-150 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <TabIcon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="mt-4">
        
        {/* TAB 1: Guess Dialect */}
        {activeSubTab === 'guess' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Input panel */}
            <div className="md:col-span-5 bg-slate-50 border border-slate-100 rounded-2xl p-5 text-center">
              <h3 className="font-bold text-gray-800 text-sm mb-2">Thực hiện Ghi âm trực tiếp</h3>
              <p className="text-xs text-gray-500 mb-6">
                Vui lòng kể lại một mẫu truyện ngắn hoặc đọc câu "Mệ đi mô rứa mệ" bằng giọng thật của bạn trong 5-10 giây để AI phân tích.
              </p>

              {/* Recorder visual wrapper */}
              <div className="flex flex-col items-center justify-center space-y-4 py-4">
                <button
                  onClick={toggleRecording}
                  className={`w-16 h-16 rounded-full flex items-center justify-center cursor-pointer shadow-md transition transform active:scale-95 ${
                    isRecording 
                      ? 'bg-rose-500 text-white animate-pulse' 
                      : 'bg-[#0F766E] text-white hover:bg-[#0F766E]/90'
                  }`}
                >
                  <span className="font-bold text-xs">
                    {isRecording ? `${recordDuration}s` : 'BẢT ĐẦU'}
                  </span>
                </button>
                <p className="text-xs font-semibold text-[#0F172A]">
                  {isRecording ? '🎧 Đang thu âm... Bấm để lưu lại' : 'Nhấn nút để bắt đầu thu âm mẫu'}
                </p>
              </div>

              {/* Actions panel */}
              {audioUrl && (
                <div className="pt-4 border-t border-gray-100 space-y-3">
                  <div className="bg-white rounded-lg p-2.5 flex items-center justify-between border border-emerald-150 text-emerald-800 text-xs">
                    <span>✓ Thu âm thử nghiệm thành công (00:08s)</span>
                  </div>
                  <button
                    onClick={handleGuessDialect}
                    disabled={loading}
                    className="w-full bg-[#D97706] text-white text-xs font-bold py-2.5 rounded-xl block hover:bg-[#D97706]/90 transition"
                  >
                    {loading ? 'đang tính toán...' : '⚙ Chạy Mô hình Dự đoán Phương ngữ'}
                  </button>
                </div>
              )}
            </div>

            {/* Prediction Output Results */}
            <div className="md:col-span-7 space-y-5">
              <h3 className="font-bold text-gray-800 text-sm">Báo cáo Phân tích Âm sắc (Output)</h3>
              
              {!guessResult ? (
                <div className="bg-slate-50 rounded-2xl p-8 border border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
                  <BarChart3 className="w-12 h-12 text-slate-300 mb-2" />
                  <p className="text-xs text-gray-500">Chưa có dữ liệu tính toán. Hãy bật thu âm ở khung bên trái.</p>
                </div>
              ) : (
                <div className="bg-[#FFF7ED] rounded-2xl border border-[#F59E0B]/20 p-5 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-emerald-500/10 text-emerald-700 px-2.5 py-0.5 rounded font-bold">DỰ ĐOÁN XONG</span>
                    <span className="text-xs text-gray-500 font-mono">Model: DialectWav2Vec-VI_v1.0</span>
                  </div>

                  {/* Prediction rows progress indicators */}
                  <div className="space-y-3">
                    {Object.entries(guessResult.prediction).map(([name, probability]: any) => (
                      <div key={name} className="space-y-1">
                        <div className="flex justify-between items-center text-xs font-bold text-gray-700">
                          <span>{name}</span>
                          <span>{(probability * 100).toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-slate-200/55 rounded-full h-2 overflow-hidden">
                          <div
                            style={{ width: `${probability * 100}%` }}
                            className={`h-full rounded-full ${
                              probability > 0.5 
                                ? 'bg-[#0F766E]' 
                                : probability > 0.15 
                                ? 'bg-[#14B8A6]' 
                                : 'bg-slate-300'
                            }`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* AI Evaluation statement */}
                  <div className="bg-white/80 rounded-xl p-3 border border-slate-100 text-xs text-[#0F172A] leading-relaxed">
                    <strong className="text-[#0F766E]">Nhận định của AI:</strong> {guessResult.comment}
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 2: Speech to Text (ASR) */}
        {activeSubTab === 's2t' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Input audio source select panel */}
            <div className="md:col-span-5 bg-slate-50 rounded-2xl border border-slate-100 p-5 text-center space-y-4">
              <h3 className="font-bold text-gray-800 text-xs">Nguồn Âm thanh Ghi âm</h3>
              <div className="border-2 border-dashed border-slate-200 bg-white hover:bg-slate-50/50 rounded-xl p-6 cursor-pointer flex flex-col items-center justify-center transition">
                <Upload className="w-8 h-8 text-slate-300" />
                <span className="text-xs font-bold text-slate-700 mt-2">Tải tệp ghi âm lên</span>
                <span className="text-[10px] text-gray-400 mt-1">Hỗ trợ các định dạng MP3, WAV, M4A tối đa 50MB</span>
              </div>

              <div className="text-xs text-gray-400 font-bold">- HOẶC CHỌN THU THỬ NGHIỆM ĐỒNG BỘ -</div>

              <button
                onClick={handleSpeechToText}
                disabled={loading}
                className="w-full bg-[#0F766E] text-white text-xs font-bold py-2.5 rounded-xl block hover:bg-[#0F766E]/90 transition"
              >
                {loading ? 'đang giải mã...' : '🎙 Bấm thử dịch Speech-to-Text nhanh'}
              </button>
            </div>

            {/* Results Transcript drafting panel */}
            <div className="md:col-span-7 space-y-4">
              <h3 className="font-bold text-gray-800 text-sm">Văn bản giải mã tự động (Text Output)</h3>

              {!transcriptResult ? (
                <div className="bg-slate-50 rounded-2xl p-8 border border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
                  <FileText className="w-12 h-12 text-slate-300 mb-2" />
                  <p className="text-xs text-gray-500">Chưa tải tệp âm thanh nào lên kiểm dịch.</p>
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-150 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs bg-emerald-500/10 text-emerald-800 px-2 py-0.5 rounded font-bold">
                      HOÀN TẤT TRÍCH LỤC
                    </span>
                    <span className="text-[11px] font-mono text-gray-400">Độ tin cậy: {(transcriptResult.confidence * 100).toFixed(0)}%</span>
                  </div>

                  <div className="bg-white rounded-xl p-4 border border-slate-100 min-h-[90px] text-sm font-black italic text-slate-800 shadow-3xs">
                    "{transcriptResult.transcript}"
                  </div>

                  <div>
                    <span className="text-xs font-bold text-gray-500">Từ địa phương trích xuất:</span>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {transcriptResult.wordsDetected.map((w: string, i: number) => (
                        <span key={w + i} className="bg-amber-100 text-amber-800 text-[10px] px-2.5 py-0.7 rounded font-extrabold border border-amber-200">
                          {w}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 3: Dialect Translator */}
        {activeSubTab === 'translate' && (
          <div className="space-y-6">
            <div className="bg-[#FFF7ED]/30 rounded-2xl border border-[#F59E0B]/10 p-5">
              <label className="block text-xs uppercase tracking-wider font-extrabold text-gray-400 mb-2">
                Nhập câu phương ngữ bất kỳ bằng tiếng địa phương
              </label>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={translateInput}
                  onChange={(e) => setTranslateInput(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl border border-[#0F766E]/20 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
                />
                <button
                  onClick={handleTranslate}
                  disabled={loading}
                  className="bg-[#0F766E] text-white font-bold text-xs px-6 py-3 rounded-xl hover:bg-[#0F766E]/90 transition"
                >
                  {loading ? 'Đang dịch thuật...' : 'Dịch sang tiếng phổ thông'}
                </button>
              </div>

              {/* Sample preset suggestions */}
              <div className="flex flex-wrap gap-2 mt-3 items-center">
                <span className="text-[10px] text-gray-400 font-bold">Gợi ý câu mẫu:</span>
                {[
                  'Răng bữa ni mi đi học trễ rứa?',
                  'Mệ đi mô rứa mệ ơi',
                  'Bữa nay trời mát dữ hôn tui mới qua bển mần chuyện'
                ].map((s) => (
                  <button
                    key={s}
                    onClick={() => setTranslateInput(s)}
                    className="text-[10px] bg-slate-50 hover:bg-slate-100 rounded px-2 py-1 text-gray-600 border border-transparent hover:border-slate-200 transition"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Translation Output translation results */}
            {translateResult && (
              <div className="bg-slate-50 border border-slate-150 rounded-2xl p-5 space-y-4">
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Nghĩa tiếng Việt phổ thông chuẩn mực:</span>
                  <p className="text-lg font-black text-[#0F766E] mt-1 italic">
                    "{translateResult.translation}"
                  </p>
                </div>

                {translateResult.wordsBreakdown && translateResult.wordsBreakdown.length > 0 && (
                  <div className="pt-3 border-t border-slate-200/60">
                    <span className="text-xs font-bold text-slate-800 block mb-2.5">Giải mã cấu trúc cốt từ vựng địa phương:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {translateResult.wordsBreakdown.map((item: any, i: number) => (
                        <div key={i} className="bg-white p-3 rounded-xl border border-slate-100 shadow-3xs">
                          <span className="text-xs bg-amber-500/10 border border-amber-500/20 text-[#D97706] font-extrabold px-1.5 py-0.5 rounded">
                            {item.dialectWord}
                          </span>
                          <span className="text-xs text-gray-500 font-bold block mt-1.5">Nghĩa: {item.standardMeaning}</span>
                          <p className="text-[10px] text-gray-400 mt-1">{item.explanation}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: General synthesis (TTS) */}
        {activeSubTab === 'tts' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Controls panel */}
            <div className="md:col-span-5 bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-4">
              <h3 className="font-bold text-gray-800 text-xs uppercase tracking-wider">Cấu hình giọng đọc</h3>
              
              <div>
                <label className="block text-[11px] font-bold text-gray-500 mb-1.5">Văn bản viết muốn đọc</label>
                <textarea
                  value={ttsInput}
                  onChange={(e) => setTtsInput(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#0F766E]"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 mb-1">Phương âm đề xuất</label>
                  <select
                    value={ttsRegion}
                    onChange={(e) => setTtsRegion(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white"
                  >
                    <option value="Bắc Bộ">Bắc Bộ (Hà Nội)</option>
                    <option value="Huế">Bản sắc Huế</option>
                    <option value="Nam Bộ">Nam Bộ (Đồng bằng)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-500 mb-1">Xưng tụng giới tính</label>
                  <select
                    value={ttsVoice}
                    onChange={(e) => setTtsVoice(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white"
                  >
                    <option value="Nữ">Nữ giọng dịu</option>
                    <option value="Nam">Nam giọng trầm</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleTts}
                disabled={loading}
                className="w-full bg-[#0F766E] text-white text-xs font-bold py-2.5 rounded-xl block hover:bg-[#0F766E]/90 transition"
              >
                {loading ? 'Đang xuất tiếng...' : '⚙ Khởi tạo âm thanh đọc thử'}
              </button>
            </div>

            {/* TTS Output results */}
            <div className="md:col-span-7 space-y-4">
              <h3 className="font-bold text-gray-800 text-sm">Tiến trình tổng hợp Thổ âm</h3>

              {!ttsResult ? (
                <div className="bg-slate-50 rounded-2xl p-8 border border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
                  <VolumeX className="w-12 h-12 text-slate-300 mb-2" />
                  <p className="text-xs text-gray-500">Chưa khởi chạy cấu hình tổng hợp giọng phương ngữ.</p>
                </div>
              ) : (
                <div className="bg-emerald-50/70 border border-emerald-150/50 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600" />
                    <span className="text-xs font-bold text-emerald-800">TỔNG HỢP HOÀN TẤT CHÍNH QUYÊN</span>
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed bg-white p-3 rounded-lg border border-slate-100">
                    "{ttsInput}"
                  </p>

                  <div className="bg-white/80 border border-slate-100 rounded-xl p-3.5 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-black text-gray-800">Cầu tivi_synthesis_{ttsRegion.toLowerCase()}_female.mp3</p>
                      <p className="text-[10px] text-gray-400 mt-1">Hội đồng cố vấn kiểm verified · Tốc độ 1.0x</p>
                    </div>

                    <button 
                      onClick={() => alert('Phát thử âm thanh tổng hợp phương âm thành công')}
                      className="p-3 bg-[#0F766E] hover:bg-[#0F766E]/90 text-white rounded-full shadow-xs flex items-center justify-center shrink-0"
                    >
                      <Play className="w-4.5 h-4.5 fill-current text-white" />
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 5: Metadata Auto Tagging */}
        {activeSubTab === 'tagging' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Tag activator */}
            <div className="md:col-span-4 bg-slate-50 border border-slate-100 rounded-2xl p-5 text-center space-y-3">
              <HelpCircle className="w-12 h-12 text-[#0F766E] mx-auto opacity-70" />
              <h3 className="font-bold text-gray-800 text-sm">Gắn nhãn đặc trưng</h3>
              <p className="text-xs text-gray-500">
                Cho phép AI đọc qua file, từ đó tự bóc tách JSON bao gồm volume level, nhiễu nền, từ địa phương trích lục và gợi ý tiêu chuẩn.
              </p>
              
              <button
                onClick={handleAutoTagging}
                disabled={loading}
                className="w-full bg-[#0F766E] text-white text-xs font-bold py-2.5 rounded-xl block hover:bg-[#0F766E]/90 transition"
              >
                {loading ? 'Phân giải tệp tin...' : 'Chạy phân tích siêu nhãn dữ liệu'}
              </button>
            </div>

            {/* Tag output */}
            <div className="md:col-span-8 space-y-4">
              <h3 className="font-bold text-gray-800 text-sm">Bản xuất nhãn siêu dữ liệu (JSON Document)</h3>

              {!taggingResult ? (
                <div className="bg-slate-50 rounded-2xl p-8 border border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
                  <QuestionIcon className="w-12 h-12 text-slate-300 mb-2" />
                  <p className="text-xs text-gray-500">Chưa chạy quy trình gắn nhãn tài liệu metadata.</p>
                </div>
              ) : (
                <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 font-mono text-[11px] leading-relaxed relative overflow-x-auto">
                  <div className="absolute top-2 right-2 text-[9px] font-sans font-bold bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded">
                    JSON Schema
                  </div>
                  <pre className="text-slate-800">
                    {JSON.stringify(taggingResult, null, 2)}
                  </pre>
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
