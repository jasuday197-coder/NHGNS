/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ChatMessage } from '../types';
import { Send, Sparkles, MessageSquare, Moon, HelpCircle, Volume2, Play } from 'lucide-react';

export function ChatbotSection() {
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    {
      id: 'm_init',
      sender: 'bot',
      text: 'Mến chào bạn nớ! Tôi là **Trợ lý văn hóa Thổ âm Sông núi** – Người bạn chuyên đàm thoại lịch sử, câu hò điệu ví và giải đáp từ vựng địa phương rải rác khắp giang sơn Việt Nam.\n\nBạn có từ phương ngữ nào nghe lạ tai hay muốn tìm câu ví dặm đặc trưng xứ Thừa Thiên, xứ Nghệ hay miền sông nước mênh mông bạt ngàn không rứa?',
      timestamp: '12:00'
    }
  ]);
  const [inputText, setInputText] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement | null>(null);

  const presets = [
    'Răng nghĩa là gì?',
    'Mô, tê, răng, rứa nghĩa là gì?',
    'Người Huế dặn con những từ nào?',
    'So sánh tiếng Nghệ Tĩnh và Nam Bộ',
  ];

  // Auto scroll to bottom
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({
            sender: m.sender,
            text: m.text
          }))
        })
      });

      const data = await response.json();
      const botMsg: ChatMessage = {
        id: `bot_${Date.now()}`,
        sender: 'bot',
        text: data.text,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
      const botErrorMsg: ChatMessage = {
        id: `bot_err_${Date.now()}`,
        sender: 'bot',
        text: 'Có lỗi xảy ra trong tiến trình đàm thoại với cố vấn AI. Hãy kiểm tra kết nối mạng của bạn nhé.',
        timestamp: 'Vừa xong'
      };
      setMessages((prev) => [...prev, botErrorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage(inputText);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-[#0F766E]/10 shadow-md p-6 h-[640px] flex flex-col justify-between overflow-hidden">
      
      {/* Bot Chat Header Info */}
      <div className="flex justify-between items-center pb-4 border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#0F766E] text-white rounded-full flex items-center justify-center shadow-xs">
            <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-sm">Cố vấn Thổ thổ học Việt Nam</h3>
            <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
              Sẵn sàng đàm luận (RAG Gemini)
            </p>
          </div>
        </div>

        {/* Clear presets */}
        <button 
          onClick={() => setMessages([messages[0]])}
          className="text-[10px] font-bold text-[#0F766E] hover:underline"
        >
          Đặt lại lịch sử chat
        </button>
      </div>

      {/* Messages stream roll */}
      <div className="flex-1 overflow-y-auto px-1 py-4 space-y-4 scrollbar-thin">
        {messages.map((m) => {
          const isUser = m.sender === 'user';
          return (
            <div
              key={m.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                  isUser
                    ? 'bg-[#0F766E] text-white rounded-tr-none shadow-3xs'
                    : 'bg-[#FFF7ED] border border-[#F59E0B]/10 text-gray-800 rounded-tl-none whitespace-pre-wrap'
                }`}
              >
                {/* Parse simple custom bold indicators in fallback answers */}
                {m.text.split('\n').map((para, idx) => (
                  <p key={idx} className={idx > 0 ? 'mt-2' : ''}>
                    {para.split('**').map((substring, subIdx) => {
                      if (subIdx % 2 === 1) {
                        return <strong key={subIdx} className="text-[#D97706] font-black">{substring}</strong>;
                      }
                      return substring;
                    })}
                  </p>
                ))}
              </div>
              <span className="text-[9px] text-gray-400 font-mono mt-1 px-1">{m.timestamp}</span>
            </div>
          );
        })}
        
        {/* Loader status */}
        {loading && (
          <div className="flex items-center gap-2 justify-start">
            <div className="w-6.5 h-6.5 bg-slate-100 rounded-full flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-[#0F766E] animate-spin" />
            </div>
            <span className="text-[10px] text-gray-400 font-semibold italic animate-pulse">Cố vấn đang suy nghĩa & trích cứu dữ liệu...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Bottom control & presets */}
      <div className="pt-3 border-t border-gray-100 shrink-0">
        
        {/* Preset suggestions row */}
        {messages.length === 1 && (
          <div className="mb-3.5">
            <span className="text-[10px] font-bold text-gray-400 block mb-1.5 uppercase tracking-wider">Chọn nhanh câu thắc đố:</span>
            <div className="grid grid-cols-2 gap-2">
              {presets.map((preset) => (
                <button
                  key={preset}
                  onClick={() => handleSendMessage(preset)}
                  className="p-2.5 bg-slate-50 hover:bg-[#FFF7ED] text-left border border-slate-100 hover:border-[#F59E0B]/35 rounded-xl text-[10.5px] font-bold text-gray-700 transition"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input box */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Hỏi từ 'mê' hay 'dữ hôn' là chi..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={loading}
            className="flex-1 bg-white border border-gray-200 focus:outline-[#0F766E] rounded-xl px-4 py-3 text-xs"
          />
          <button
            onClick={() => handleSendMessage(inputText)}
            disabled={loading || !inputText.trim()}
            className={`px-4 bg-[#0F766E] text-white rounded-xl shadow-xs flex items-center justify-center cursor-pointer hover:bg-[#0F766E]/90 transition ${
              inputText.trim() ? 'opacity-100' : 'opacity-80'
            }`}
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>

      </div>

    </div>
  );
}
