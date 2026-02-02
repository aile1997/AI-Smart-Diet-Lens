import React from 'react';
import { useNavigate } from 'react-router-dom';

const Splash: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-screen flex flex-col">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/30 z-10"></div>
        <img 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKpU8-BmuUcwnIowcHLeddG0QjxzcRqAUC3sJZg_5r00tXCYQtQCo5ihFBetiL6I8g_FQaSftFCFomjXxPemPbJTmU_jqpNaY3Yf6z2MhUSY1PBqhMyrIvXJc8KBQP_HQTvmhggTs0L_RM75hmHJ775Dw89LgjWwW4yn1AGTQ9J6OjASbbqVeyG6cMvppqKwU1VD2jriqkdnXIaEnmDvE9srD6_pXfqHSwm1Shb1PHut6BllPBBQCatWzlYIyF-GBvV651dwo4hwk2" 
          alt="Healthy Food" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-20"></div>
      </div>

      {/* Content */}
      <div className="relative z-30 flex-1 flex flex-col justify-between px-6 py-12">
        <div className="pt-8 flex justify-center">
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full">
            <span className="material-symbols-outlined text-primary text-sm">qr_code_scanner</span>
            <span className="text-white text-xs font-bold tracking-widest uppercase">AI Smart-Diet Lens</span>
          </div>
        </div>

        <div className="flex flex-col gap-8 mb-8">
          <div>
            <h1 className="text-white text-[42px] font-extrabold leading-[1.1] tracking-tight mb-4 drop-shadow-md font-display">
              吃得更聪明<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-200">而非更少</span>
            </h1>
            <p className="text-gray-200 text-lg font-medium leading-relaxed drop-shadow-sm">
              通过 AI 驱动的营养追踪，释放您的代谢潜能，遇见更好的自己。
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <button 
              onClick={() => navigate('/onboarding')}
              className="relative w-full h-14 rounded-2xl overflow-hidden group active:scale-[0.98] transition-transform"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-emerald-400"></div>
              <div className="relative h-full flex items-center justify-center gap-2 text-[#0e1a13] font-bold text-lg">
                <span>开始体验</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </div>
            </button>
            <button 
              onClick={() => navigate('/home')}
              className="w-full h-14 rounded-2xl bg-white/10 backdrop-blur-sm text-white font-semibold hover:bg-white/20 transition-colors"
            >
              直接登录
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Splash;