/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Volume2, Search, Sparkles } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onSearch: (text: string) => void;
}

export function Header({ activeTab, setActiveTab, onSearch }: HeaderProps) {
  const [searchText, setSearchText] = React.useState('');

  const menuItems = [
    { id: 'trang-chu', label: 'Trang chủ' },
    { id: 'ban-do', label: 'Bản đồ phương ngữ' },
    { id: 'ngan-hang', label: 'Ngân hàng giọng nói' },
    { id: 'cong-cu-ai', label: 'Công cụ AI' },
    { id: 'tu-dien', label: 'Từ điển' },
    { id: 'dong-gop', label: 'Đóng góp' },
    { id: 'chatbot', label: 'Chatbot' },
    { id: 'tro-choi', label: 'Khám phá / Game' },
    { id: 'quan-tri', label: 'Quản trị' }
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchText);
    setActiveTab('ngan-hang');
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FFF7ED]/95 backdrop-blur-md border-b-2 border-double border-[#0F766E]/20 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-22">
          
          {/* Logo Section */}
          <div 
            onClick={() => setActiveTab('trang-chu')} 
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-lg bg-[#0F766E] flex items-center justify-center text-[#FFF7ED] shadow-sm group-hover:bg-[#14B8A6] transition-colors duration-300">
              <Volume2 className="w-5.5 h-5.5" />
            </div>
            <div>
              <span className="text-lg font-cinzel font-black text-slate-900 tracking-wider block leading-tight">
                NGÂN HÀNG
              </span>
              <span className="text-[10px] font-sans font-bold text-[#D97706] tracking-widest block uppercase">
                Giọng Nói Số
              </span>
            </div>
          </div>

          {/* Large Screen Search Bar */}
          <form 
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-md mx-8 relative"
          >
            <input
              type="text"
              placeholder="Tìm giọng Huế, từ mệ, câu nói miền Nam..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full pl-10 pr-24 py-2 bg-stone-50 border border-[#0F766E]/20 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0F766E] text-xs transition-all tracking-wide"
            />
            <Search className="absolute left-3 top-2.5 w-4.5 h-4.5 text-[#0F766E]/40" />
            <button 
              type="submit"
              className="absolute right-1.5 top-1 bg-[#0F766E] text-[#FFF7ED] px-3 py-1 font-sans text-[10px] font-bold tracking-widest uppercase hover:bg-[#14B8A6] duration-200"
            >
              Tìm kiếm
            </button>
          </form>

          {/* Flag / AI badge */}
          <div className="hidden lg:flex items-center space-x-2 text-[10px] font-bold tracking-widest uppercase text-[#0F766E] border border-[#0F766E]/20 bg-[#0F766E]/5 px-3.5 py-1.5 font-sans rounded-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
            <span>AI Powered platform</span>
          </div>

        </div>

        {/* Dynamic Navigation Line */}
        <div className="border-t border-[#0F766E]/10 overflow-x-auto scrollbar-none">
          <nav className="flex space-x-1.5 py-2 min-w-max md:justify-center">
            {menuItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3 py-2 text-[10px] tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'border-b-2 border-[#0F766E] text-[#0F766E] font-extrabold'
                      : 'text-slate-650 font-bold hover:text-[#0F766E] hover:border-b-2 hover:border-[#0F766E]/40'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

      </div>
    </header>
  );
}
