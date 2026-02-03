import React from 'react';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-screen w-full bg-background-light overflow-y-auto pb-32 no-scrollbar">
      <header className="sticky top-0 z-30 px-6 pt-14 pb-4 bg-background-light/95 backdrop-blur-md flex justify-between items-center transition-all duration-300 border-b border-transparent">
        <h1 className="text-[28px] font-extrabold text-sage-900 tracking-tight">个人中心</h1>
        <div className="flex items-center gap-3">
          <button className="w-10 h-10 rounded-full bg-white shadow-soft flex items-center justify-center text-sage-600 active:scale-95 transition-transform">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="w-10 h-10 rounded-full bg-white shadow-soft flex items-center justify-center text-sage-600 active:scale-95 transition-transform">
            <span className="material-symbols-outlined">settings</span>
          </button>
        </div>
      </header>

      <section className="px-6 mt-4 mb-8">
        <div className="bg-white rounded-3xl p-5 shadow-card border border-white/50 relative overflow-hidden group">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-sage-100 rounded-full blur-3xl opacity-60 pointer-events-none"></div>
          <div className="flex items-center gap-5 relative z-10">
            <div className="relative">
              <div className="w-[72px] h-[72px] rounded-full bg-sage-200 flex items-center justify-center text-sage-600 shadow-inner overflow-hidden border-[3px] border-white">
                <span className="material-symbols-outlined text-4xl font-variation-FILL-1">person</span>
              </div>
              <div className="absolute -bottom-1 -right-1 bg-sage-500 text-white p-1 rounded-full border-[2px] border-white flex items-center justify-center">
                <span className="material-symbols-outlined text-[12px]">edit</span>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 leading-tight">Alex Chen</h2>
                  <p className="text-xs text-sage-500 font-medium mt-0.5">ID: 883902</p>
                </div>
              </div>
              <button className="mt-2.5 flex items-center gap-1.5 bg-slate-800 px-3 py-1.5 rounded-full shadow-lg shadow-slate-200/50 active:scale-95 transition-all w-fit group/btn">
                <span className="material-symbols-outlined text-[16px] text-yellow-400 font-variation-FILL-1">workspace_premium</span>
                <span className="text-[11px] font-bold tracking-wide text-white uppercase">PRO 会员</span>
                <span className="material-symbols-outlined text-[14px] text-white/60 group-hover/btn:translate-x-0.5 transition-transform">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 mb-8">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white p-3.5 rounded-2xl shadow-card flex flex-col items-center justify-center gap-1">
            <span className="text-[10px] font-bold text-sage-400 uppercase tracking-wider">连续记录</span>
            <div className="flex items-baseline gap-0.5">
              <span className="text-2xl font-extrabold text-sage-600">12</span>
              <span className="text-xs font-medium text-sage-400">天</span>
            </div>
          </div>
          <div className="bg-white p-3.5 rounded-2xl shadow-card flex flex-col items-center justify-center gap-1">
            <span className="text-[10px] font-bold text-sage-400 uppercase tracking-wider">当前体重</span>
            <div className="flex items-baseline gap-0.5">
              <span className="text-2xl font-extrabold text-sage-600">65.4</span>
              <span className="text-xs font-medium text-sage-400">kg</span>
            </div>
          </div>
          <div className="bg-white p-3.5 rounded-2xl shadow-card flex flex-col items-center justify-center gap-1">
            <span className="text-[10px] font-bold text-sage-400 uppercase tracking-wider">今日消耗</span>
            <div className="flex items-baseline gap-0.5">
              <span className="text-2xl font-extrabold text-sage-600">420</span>
              <span className="text-xs font-medium text-sage-400">kcal</span>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 space-y-6">
        <div className="space-y-3">
          <h3 className="px-1 text-xs font-bold text-sage-400 uppercase tracking-widest">目标与策略</h3>
          <div className="bg-white rounded-2xl shadow-card overflow-hidden divide-y divide-gray-50">
            <button onClick={() => navigate('/onboarding')} className="w-full flex items-center justify-between p-4 hover:bg-sage-50 transition-colors group text-left">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-sage-50 flex items-center justify-center text-sage-600 group-hover:bg-sage-100 group-hover:text-sage-700 transition-colors">
                  <span className="material-symbols-outlined">flag</span>
                </div>
                <div>
                  <p className="text-[15px] font-semibold text-slate-900">我的计划</p>
                  <p className="text-xs text-sage-500 mt-0.5">当前: 减脂模式 (Fat Loss)</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-gray-300 group-hover:text-sage-500 transition-colors">chevron_right</span>
            </button>
            <button onClick={() => navigate('/onboarding')} className="w-full flex items-center justify-between p-4 hover:bg-sage-50 transition-colors group text-left">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 group-hover:bg-orange-100 transition-colors">
                  <span className="material-symbols-outlined">accessibility_new</span>
                </div>
                <div>
                  <p className="text-[15px] font-semibold text-slate-900">身体数据</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-gray-300 group-hover:text-sage-500 transition-colors">chevron_right</span>
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="px-1 text-xs font-bold text-sage-400 uppercase tracking-widest">成就</h3>
          <div className="bg-white rounded-2xl shadow-card overflow-hidden divide-y divide-gray-50">
            <button onClick={() => navigate('/achievements')} className="w-full flex items-center justify-between p-4 hover:bg-sage-50 transition-colors group text-left">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500 group-hover:bg-amber-100 transition-colors">
                  <span className="material-symbols-outlined font-variation-FILL-1">military_tech</span>
                </div>
                <div>
                  <p className="text-[15px] font-semibold text-slate-900">成就勋章</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-xs text-sage-500">已解锁 5 枚</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2 mr-1">
                  <div className="w-5 h-5 rounded-full bg-amber-400 border-2 border-white"></div>
                  <div className="w-5 h-5 rounded-full bg-gray-300 border-2 border-white"></div>
                </div>
                <span className="material-symbols-outlined text-gray-300 group-hover:text-sage-500 transition-colors">chevron_right</span>
              </div>
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="px-1 text-xs font-bold text-sage-400 uppercase tracking-widest">应用设置</h3>
          <div className="bg-white rounded-2xl shadow-card overflow-hidden divide-y divide-gray-50">
            <button className="w-full flex items-center justify-between p-4 hover:bg-sage-50 transition-colors group text-left">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 group-hover:bg-blue-100 transition-colors">
                  <span className="material-symbols-outlined">notifications_active</span>
                </div>
                <div>
                  <p className="text-[15px] font-semibold text-slate-900">通知提醒</p>
                </div>
              </div>
              <div className="w-10 h-6 bg-sage-500 rounded-full relative shadow-inner">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
              </div>
            </button>
            <button className="w-full flex items-center justify-between p-4 hover:bg-sage-50 transition-colors group text-left">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-500 group-hover:bg-gray-100 transition-colors">
                  <span className="material-symbols-outlined">translate</span>
                </div>
                <div>
                  <p className="text-[15px] font-semibold text-slate-900">语言</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-400">简体中文</span>
                <span className="material-symbols-outlined text-gray-300 group-hover:text-sage-500 transition-colors">chevron_right</span>
              </div>
            </button>
          </div>
        </div>

        <button onClick={() => navigate('/')} className="w-full py-3.5 rounded-xl text-center text-[15px] font-semibold text-red-500 hover:bg-red-50 transition-colors mb-6">
          退出登录
        </button>
      </section>
    </div>
  );
};

export default Profile;