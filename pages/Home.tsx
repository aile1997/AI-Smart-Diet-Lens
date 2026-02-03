import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full min-h-screen pb-24 overflow-y-auto no-scrollbar">
      {/* Header */}
      <header className="flex items-center justify-between px-6 pt-12 pb-4 bg-background-light/90 sticky top-0 z-30 backdrop-blur-md">
        <div className="flex flex-col">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">周一, 11月 24日</p>
          <h2 className="text-2xl font-bold text-slate-900 leading-tight">早安, Alex</h2>
        </div>
        <div className="relative group cursor-pointer" onClick={() => navigate('/profile')}>
          <div className="w-10 h-10 rounded-full bg-cover bg-center border-2 border-white shadow-sm" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA4ARIueyn7oeLTPKejOMX_pPCmp0S85Xj29ku1HwdDtPDdRoJLpgvSEU23aY8xES40OHagpkPIqfDk5h8PItc2_ZuNCkUoO83GnslRZ4Gx9UhngYaK5meHb23uRdd1Ue7r6Bjz93OPt83tMVKCviO5oMtJvKgZOPTe5t_pOF9YKnKnqVpqMMP0f3XfNWt1iZ5Kc46ID7smBu2WqYsT__xkslaaSj5fpZsEypEKjwo_BMUp4cmuwKUxEHETmtlH3YOqCR9fNO3K127-")'}}></div>
          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-primary border-2 border-white rounded-full"></div>
        </div>
      </header>

      <main className="flex-1 px-6 space-y-8">
        {/* Calorie Ring */}
        <section className="flex flex-col items-center pt-4" onClick={() => navigate('/diary')}>
          <div className="relative w-64 h-64 flex items-center justify-center cursor-pointer">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full opacity-30 animate-pulse-slow"></div>
            <svg className="w-full h-full transform -rotate-90 drop-shadow-lg" viewBox="0 0 256 256">
              <circle className="text-sage-100" cx="128" cy="128" fill="transparent" r="110" stroke="currentColor" strokeWidth="18"></circle>
              <circle className="text-primary transition-all duration-1000 ease-out" cx="128" cy="128" fill="transparent" r="110" stroke="currentColor" strokeDasharray="691" strokeDashoffset="200" strokeLinecap="round" strokeWidth="18"></circle>
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center inset-0 z-10">
              <span className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">剩余</span>
              <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight font-display">1,450</h1>
              <p className="text-slate-500 text-xs font-medium mt-1">Kcal 预算</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-12 mt-[-10px] z-10">
            <div className="flex flex-col items-center">
              <div className="w-2 h-2 rounded-full bg-primary mb-2"></div>
              <p className="text-xl font-bold text-slate-900 leading-none">530</p>
              <span className="text-xs font-medium text-slate-500 mt-1">已摄入</span>
            </div>
            <div className="w-px h-8 bg-slate-200"></div>
            <div className="flex flex-col items-center">
              <div className="w-2 h-2 rounded-full bg-slate-300 mb-2"></div>
              <p className="text-xl font-bold text-slate-900 leading-none">2,200</p>
              <span className="text-xs font-medium text-slate-500 mt-1">目标</span>
            </div>
          </div>
        </section>

        {/* Metric Grid */}
        <section className="grid grid-cols-2 gap-4">
          <div className="p-5 bg-white rounded-3xl border border-sage-100 shadow-card flex flex-col justify-between h-40 relative overflow-hidden group hover:border-primary/50 transition-colors" onClick={() => navigate('/achievements')}>
             <div className="absolute top-2 right-2 p-2 opacity-10">
                <span className="material-symbols-outlined text-6xl">footprint</span>
             </div>
             <div className="flex items-center gap-2 mb-2">
               <span className="material-symbols-outlined text-primary text-xl">footprint</span>
               <h3 className="text-sm font-bold text-slate-700">步数</h3>
             </div>
             <div>
               <p className="text-2xl font-bold text-slate-900">4,200</p>
               <p className="text-xs text-slate-500 mb-3">/ 10,000</p>
               <div className="h-1.5 w-full bg-sage-50 rounded-full overflow-hidden">
                 <div className="h-full bg-primary rounded-full" style={{width: '42%'}}></div>
               </div>
             </div>
          </div>

          <div className="p-5 bg-[#ebf7fd] rounded-3xl border border-transparent shadow-card flex flex-col justify-between h-40 relative overflow-hidden">
             <div className="absolute top-2 right-2 p-2 opacity-10">
                <span className="material-symbols-outlined text-6xl text-sky-500">water_drop</span>
             </div>
             <div className="flex items-center gap-2 mb-2">
               <span className="material-symbols-outlined text-sky-500 text-xl">water_drop</span>
               <h3 className="text-sm font-bold text-slate-700">水分</h3>
             </div>
             <div className="flex items-end justify-between">
               <div>
                 <p className="text-2xl font-bold text-slate-900">4</p>
                 <p className="text-xs text-slate-500">/ 8 杯</p>
               </div>
               <button className="bg-white text-sky-500 rounded-full w-8 h-8 flex items-center justify-center shadow-sm hover:scale-110 transition-transform">
                 <span className="material-symbols-outlined text-lg font-bold">add</span>
               </button>
             </div>
          </div>
          
           <div className="p-5 bg-[#f0f0fa] rounded-3xl border border-transparent shadow-card flex flex-col justify-between h-40 relative overflow-hidden">
             <div className="absolute top-2 right-2 p-2 opacity-10">
                <span className="material-symbols-outlined text-6xl text-indigo-500">bedtime</span>
             </div>
             <div className="flex items-center gap-2 mb-2">
               <span className="material-symbols-outlined text-indigo-500 text-xl">bedtime</span>
               <h3 className="text-sm font-bold text-slate-700">睡眠</h3>
             </div>
             <div>
               <p className="text-2xl font-bold text-slate-900">7<span className="text-base text-slate-500 font-medium">h</span> 20<span className="text-base text-slate-500 font-medium">m</span></p>
               <p className="text-xs text-indigo-500 font-bold mt-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[10px]">trending_up</span> 恢复佳
               </p>
             </div>
          </div>

          <div className="p-5 bg-[#fff8e6] rounded-3xl border border-transparent shadow-card flex flex-col justify-between h-40 relative overflow-hidden">
             <div className="absolute top-2 right-2 p-2 opacity-10">
                <span className="material-symbols-outlined text-6xl text-amber-500">sentiment_satisfied</span>
             </div>
             <div className="flex items-center gap-2 mb-2">
               <span className="material-symbols-outlined text-amber-500 text-xl">sentiment_satisfied</span>
               <h3 className="text-sm font-bold text-slate-700">心情</h3>
             </div>
             <div>
               <p className="text-xl font-bold text-slate-900">精力充沛</p>
               <p className="text-xs text-slate-500 mt-1">10:30 AM</p>
             </div>
          </div>
        </section>

        {/* Meal Log Empty State */}
        <section className="pb-8">
          <div className="flex items-center justify-between mb-4 px-1">
             <h2 className="text-lg font-bold text-slate-900">今日餐食</h2>
             <button className="text-primary text-sm font-bold hover:text-primary-dark" onClick={() => navigate('/diary')}>查看全部</button>
          </div>
          
          {/* Quick Access to Recipe */}
          <div onClick={() => navigate('/recipe')} className="w-full rounded-3xl bg-white border border-sage-100 p-4 flex gap-4 items-center shadow-card active:scale-[0.98] transition-transform cursor-pointer">
             <div className="w-20 h-20 bg-cover bg-center rounded-2xl" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCjzSEoi6HdN7_oDhZ1YSC_cxw8HLvaz15PmOoZBhJsWUfsRtTFhRh0iWcGq1oJQXIxGnh7carV5qEUHOSau3MVSUpBLpVF--Fogwn__vECHTzsWfbZlYMQJIlKW7lgGNreZra2Ga9iwmn7Azn2t2Ecn9kcjULEF6NLAIeMe5RViTl-EbsQHB4hjYpTN6tY3Y6TLXHfKSit9IHrF3U0nPTpNsq1K2fYBboezJt3N7KntyVDDB64o-U2V05l46-OFzFTwW9dpUxYEQuq")'}}></div>
             <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                   <span className="px-2 py-0.5 bg-orange-100 text-orange-600 rounded text-[10px] font-bold">推荐食谱</span>
                   <span className="text-[10px] text-slate-400">450 kcal</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 leading-tight mb-1">香煎三文鱼配芦笋</h3>
                <p className="text-xs text-slate-500">15分钟快手菜 · 优质蛋白</p>
             </div>
             <div className="size-8 rounded-full bg-slate-100 flex items-center justify-center">
                <span className="material-symbols-outlined text-slate-400">chevron_right</span>
             </div>
          </div>

          <div className="w-full mt-4 rounded-3xl bg-white border-2 border-dashed border-sage-200 p-8 flex flex-col items-center text-center">
             <div className="w-20 h-20 bg-sage-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
               <span className="material-symbols-outlined text-4xl">restaurant_menu</span>
             </div>
             <h3 className="text-base font-bold text-slate-900 mb-1">您的日记还没满</h3>
             <p className="text-sm text-slate-500 max-w-[200px] leading-relaxed mb-5">
               记录您的第一餐以解锁个性化建议。
             </p>
             <button onClick={() => navigate('/scan')} className="px-6 py-2.5 rounded-full bg-sage-100 text-slate-700 text-sm font-bold hover:bg-sage-200 inline-flex items-center gap-2">
               <span className="material-symbols-outlined text-lg">add</span>
               记录早餐
             </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;