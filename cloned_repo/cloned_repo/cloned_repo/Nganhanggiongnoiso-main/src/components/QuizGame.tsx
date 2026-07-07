/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { DEMO_QUIZ, DEMO_LEADERBOARD } from '../data';
import { Award, Volume2, Trophy, ArrowRight, Play, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';

export function QuizGame() {
  const [currentScore, setCurrentScore] = React.useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
  const [selectedOption, setSelectedOption] = React.useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  // Unlocked badges state
  const [badges, setBadges] = React.useState<string[]>([
    'Nhà thám hiểm sơ khảo',
  ]);

  const currentQuestion = DEMO_QUIZ[currentQuestionIndex];

  const handleSelectOption = (option: string) => {
    if (isSubmitted) return;
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    if (!selectedOption || isSubmitted) return;
    setIsSubmitted(true);

    if (selectedOption === currentQuestion.correctAnswer) {
      setCurrentScore((prev) => prev + 100);
      
      // Dynamic badge updates
      if (currentQuestion.region === 'Huế' && !badges.includes('Người hiểu xứ Huế')) {
        setBadges((prev) => [...prev, 'Người hiểu xứ Huế']);
      }
      if (currentQuestion.region === 'Nam Bộ' && !badges.includes('Bạn hiền miền Tây')) {
        setBadges((prev) => [...prev, 'Bạn hiền miền Tây']);
      }
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setIsSubmitted(false);
    if (currentQuestionIndex < DEMO_QUIZ.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Completed, loop back or finish
      alert(`Xin chúc mừng! Bạn đã hoàn tất trò chơi văn hóa phương ngữ với điểm số: ${currentScore}`);
      setCurrentQuestionIndex(0);
      setCurrentScore(0);
    }
  };

  const systemBadges = [
    { title: 'Nhà thám hiểm sơ khảo', description: 'Gia nhập đại hội âm sắc phương học', icon: Trophy, color: 'text-amber-500 bg-amber-50 border-amber-200' },
    { title: 'Người hiểu xứ Huế', description: 'Trả lời đúng các câu hỏi tiếng Cố đô', icon: Award, color: 'text-pink-600 bg-pink-50 border-pink-250' },
    { title: 'Bạn hiền miền Tây', description: 'Thấu cảm phương âm Nam Bộ chân chất', icon: Award, color: 'text-teal-600 bg-teal-50 border-teal-200' },
    { title: 'Người góp giọng văn hóa', description: 'Đóng góp 1 file ghi âm được kiểm duyệt', icon: Award, color: 'text-purple-600 bg-purple-50 border-purple-200' },
  ];

  return (
    <div className="bg-white rounded-3xl border border-[#0F766E]/10 shadow-md p-6">
      
      {/* Title section */}
      <div className="pb-5 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#0F172A] flex items-center gap-2">
            <Trophy className="w-5.5 h-5.5 text-[#D97706]" />
            Trò chơi thách đố Trải nghiệm Phương ngữ
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Đo đoán giọng nói, tra soát câu từ tiếng Việt phổ thông, tích lũy điểm và mở khóa huy chương di sản.
          </p>
        </div>

        <div className="bg-[#0F766E] text-white px-4 py-2 rounded-xl text-center shadow-xs">
          <span className="text-[10px] uppercase font-black block text-[#14B8A6]">Tổng điểm</span>
          <span className="text-lg font-mono font-bold leading-none">{currentScore}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
        
        {/* Play interface (Lg 8 columns) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Question card */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#0F766E] bg-[#14B8A6]/10 px-2.5 py-1 rounded">
                Câu hỏi {currentQuestionIndex + 1} / {DEMO_QUIZ.length}
              </span>
              <span className="text-xs font-semibold text-gray-400">Vùng: {currentQuestion.region}</span>
            </div>

            {/* Simulated audio question player */}
            <div className="bg-white rounded-xl p-4 border border-slate-100 flex items-center gap-3.5 mb-5 shadow-3xs">
              <button 
                onClick={() => alert(`Đang phát thử audio: "${currentQuestion.sentence}"`)}
                className="w-10 h-10 rounded-full bg-[#0F766E] text-white flex items-center justify-center shadow-xs"
              >
                <Play className="w-4 h-4 fill-current ml-0.5 text-white" />
              </button>
              <div>
                <p className="text-xs text-gray-400 font-bold">NGHE GIỌNG PHÙ HỢP</p>
                <p className="text-sm font-black text-[#D97706] italic">"{currentQuestion.sentence}"</p>
              </div>
            </div>

            <p className="text-sm font-bold text-gray-800 mb-4">
              Câu nói phương ngữ trên tương ứng với nghĩa phổ thông nào sau đây?
            </p>

            {/* Answer option stack */}
            <div className="space-y-2.5">
              {currentQuestion.options.map((option, i) => {
                const belongsSelected = selectedOption === option;
                return (
                  <button
                    key={option + i}
                    onClick={() => handleSelectOption(option)}
                    disabled={isSubmitted}
                    className={`w-full text-left p-3.5 rounded-xl border text-xs font-bold transition duration-200 flex items-center justify-between cursor-pointer ${
                      belongsSelected
                        ? 'border-[#0F766E] bg-[#0F766E]/5 text-[#0F766E]'
                        : 'border-gray-200 hover:border-[#14B8A6]/60 hover:bg-slate-50 text-gray-700'
                    }`}
                  >
                    <span>{option}</span>
                    <span className="w-4.5 h-4.5 rounded-full border border-gray-300 flex items-center justify-center text-[10px] text-gray-300">
                      {String.fromCharCode(65 + i)}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Submit / Explainer status block */}
            <div className="mt-5 pt-4 border-t border-slate-200/50 flex flex-col sm:flex-row justify-between items-center gap-3">
              <div>
                {!isSubmitted ? (
                  <p className="text-xs text-gray-400">Chọn một phương án để gửi câu trả lời.</p>
                ) : (
                  <div className="flex items-center gap-2">
                    {selectedOption === currentQuestion.correctAnswer ? (
                      <span className="text-emerald-700 bg-emerald-50 border border-emerald-150 px-2.5 py-1 rounded text-xs font-extrabold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Chính xác! (+100 điểm)
                      </span>
                    ) : (
                      <span className="text-rose-700 bg-rose-50 border border-rose-150 px-2.5 py-1 rounded text-xs font-extrabold flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" />
                        Sai rồi! (Đáp án: {currentQuestion.correctAnswer})
                      </span>
                    )}
                  </div>
                )}
              </div>

              {!isSubmitted ? (
                <button
                  disabled={!selectedOption}
                  onClick={handleSubmit}
                  className={`px-5 py-2 rounded-xl text-xs font-bold transition ${
                    selectedOption 
                      ? 'bg-[#0F766E] hover:bg-[#0F766E]/90 text-white shadow-xs cursor-pointer' 
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Xác nhận câu trả lời
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-5 py-2 bg-[#D97706] hover:bg-[#D97706]/90 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1 cursor-pointer"
                >
                  Tiếp tục
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

          </div>

          {/* Explanation panel with beautiful cultural touch */}
          {isSubmitted && (
            <div className="bg-[#FFF7ED] border border-[#F59E0B]/15 rounded-xl p-4 text-xs text-[#0F172A] leading-relaxed">
              <strong className="text-[#D97706] block mb-1">Góc văn học địa phương giải thích:</strong>
              {currentQuestion.explanation}
            </div>
          )}

        </div>

        {/* Sidebar Badges & Standings Leaderboard (Lg 4 columns) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Badge cabinet */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5">
            <h3 className="font-bold text-gray-800 text-xs uppercase tracking-wider mb-3">Tủ Huy Chương Di Sản</h3>
            <div className="space-y-3">
              {systemBadges.map((badge) => {
                const isUnlocked = badges.includes(badge.title);
                const BadgeIcon = badge.icon;
                return (
                  <div
                    key={badge.title}
                    className={`flex items-center gap-3 p-2.5 rounded-xl border transition ${
                      isUnlocked 
                        ? `${badge.color} scale-100` 
                        : 'bg-white border-gray-100/70 text-gray-300 opacity-60'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 border border-current">
                      <BadgeIcon className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h4 className="text-[11px] font-extrabold">{badge.title}</h4>
                      <p className="text-[9px] text-gray-500 mt-0.5">{badge.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Standings board */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5">
            <h3 className="font-bold text-gray-800 text-xs uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>Bảng Xếp Hạng Cộng Đồng</span>
              <Trophy className="w-4 h-4 text-amber-500" />
            </h3>
            <div className="space-y-2.5">
              {DEMO_LEADERBOARD.map((user, idx) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-gray-100 shadow-3xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-xs font-black text-gray-400 w-4 font-mono">#{idx + 1}</span>
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      referrerPolicy="no-referrer"
                      className="w-7.5 h-7.5 rounded-full object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-800 truncate">{user.name}</p>
                      <p className="text-[9px] text-gray-400 font-medium truncate">{user.badges[0]}</p>
                    </div>
                  </div>

                  <span className="text-xs font-mono font-extrabold text-[#0F766E] shrink-0">
                    {user.score}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
