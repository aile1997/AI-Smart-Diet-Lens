import React from 'react';
import { useNavigate } from 'react-router-dom';

const Achievements: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full min-h-screen bg-background-light pb-24 overflow-y-auto no-scrollbar relative">
       {/* Background Blobs */}
       <div className="fixed top-[-20%] left-[-20%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] pointer-events-none opacity-40"></div>
       <div className="fixed bottom-[-20%] right-[-20%] w-[400px] h-[400px] bg-blue-400/20 rounded-full blur-[100px] pointer-events-none opacity-30"></div>

       <header className="sticky top-0 z-30 flex items-center justify-between p-4 bg-background-light/80 backdrop-blur-md">
          <button onClick={() => navigate(-1)} className="size-10 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-900">
             <span className="material-symbols-outlined">arrow_back_ios_new</span>
          </button>
          <h2 className="text-lg font-bold text-slate-900">成就与荣誉</h2>
          <div className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
             <span className="material-symbols-outlined text-amber-500 font-variation-FILL-1 text-base">military_tech</span>
             <span className="text-xs font-bold text-slate-900">Lv. 5</span>
          </div>
       </header>

       <main className="px-4 space-y-8 z-10 pt-4">
          <section>
             <div className="flex justify-between items-end mb-4">
                <h1 className="text-xl font-bold text-slate-900">正在进行的挑战</h1>
                <button className="text-primary text-sm font-semibold">查看全部</button>
             </div>
             <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-primary/10 text-primary-dark px-2 py-1 rounded-bl-xl text-xs font-bold">剩2天</div>
                <div className="flex items-start gap-4 mb-4">
                   <div className="size-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-500">
                      <span className="material-symbols-outlined text-2xl">wb_twilight</span>
                   </div>
                   <div>
                      <h3 className="font-bold text-slate-900 text-lg">早起挑战</h3>
                      <p className="text-slate-500 text-sm">已坚持 5/7 天</p>
                   </div>
                </div>
                <div className="relative">
                   <div className="flex justify-between text-xs font-medium text-slate-500 mb-1.5">
                      <span>进度</span> <span>71%</span>
                   </div>
                   <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-primary to-emerald-400 w-[71%] rounded-full"></div>
                   </div>
                </div>
             </div>
          </section>

          <section>
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-900">荣誉勋章</h2>
                <span className="text-sm font-medium text-slate-400">12/50</span>
             </div>
             
             <div className="grid grid-cols-3 gap-y-8 gap-x-4">
                {[
                   { name: '减脂先锋', sub: '累计减脂5kg', icon: 'fitness_center', color: 'bg-amber-100 text-amber-600', active: true },
                   { name: '营养达人', sub: '连续记录30天', icon: 'restaurant_menu', color: 'bg-slate-100 text-slate-600', active: true },
                   { name: '热量燃烧', sub: '单日500kcal', icon: 'local_fire_department', color: 'bg-orange-100 text-orange-500', active: true },
                   { name: 'AI探索者', sub: '识别100种食物', icon: 'smart_toy', color: 'bg-blue-100 text-blue-500', active: true },
                   { name: '马拉松', sub: '累计跑42km', icon: 'directions_run', locked: true },
                   { name: '深度睡眠', sub: '睡眠分>90', icon: 'nightlight', locked: true },
                ].map((badge, i) => (
                   <div key={i} className={`flex flex-col items-center gap-2 ${badge.locked ? 'opacity-50 grayscale' : ''}`}>
                      <div className={`relative size-20 rounded-full flex items-center justify-center shadow-sm ${badge.locked ? 'bg-slate-100' : 'bg-white'}`}>
                         {badge.locked && <div className="absolute inset-0 bg-slate-200/50 rounded-full flex items-center justify-center z-10"><span className="material-symbols-outlined text-slate-500">lock</span></div>}
                         <div className={`size-16 rounded-full flex items-center justify-center ${badge.color || 'text-slate-400 bg-slate-200'}`}>
                            <span className="material-symbols-outlined text-3xl">{badge.icon}</span>
                         </div>
                      </div>
                      <div className="text-center">
                         <p className="text-sm font-bold text-slate-900">{badge.name}</p>
                         <p className="text-[10px] text-slate-500 mt-0.5">{badge.sub}</p>
                      </div>
                   </div>
                ))}
             </div>
          </section>
       </main>
    </div>
  );
};

export default Achievements;