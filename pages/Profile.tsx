import React from 'react';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full min-h-screen bg-background-light pb-24">
       <header className="sticky top-0 z-30 bg-background-light/90 backdrop-blur-md">
          <div className="flex items-center p-4">
             <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-primary">
                <span className="material-symbols-outlined">arrow_back_ios_new</span>
                <span className="font-medium">返回</span>
             </button>
          </div>
          <h1 className="px-4 pb-2 text-3xl font-bold text-slate-900">系统设置</h1>
       </header>

       <main className="flex flex-col gap-6 mt-4">
          <section className="mx-4 bg-white rounded-xl shadow-sm overflow-hidden">
             <div className="flex items-center justify-between p-4 active:bg-slate-50 cursor-pointer" onClick={() => navigate('/onboarding')}>
                <div className="flex items-center gap-4">
                   <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined font-variation-FILL-1 text-[20px]">person</span>
                   </div>
                   <p className="font-medium text-slate-900">个人信息修改</p>
                </div>
                <span className="material-symbols-outlined text-slate-400">chevron_right</span>
             </div>
          </section>

          <section className="mx-4 bg-white rounded-xl shadow-sm overflow-hidden flex flex-col">
             <div className="flex items-center justify-between p-4 border-b border-slate-100">
                <div className="flex items-center gap-4">
                   <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined font-variation-FILL-1 text-[20px]">favorite</span>
                   </div>
                   <p className="font-medium text-slate-900">同步 Apple Health</p>
                </div>
                <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-200 cursor-pointer">
                   <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition shadow-sm"></span>
                </div>
             </div>
             <div className="flex items-center justify-between p-4 active:bg-slate-50 cursor-pointer">
                <div className="flex items-center gap-4">
                   <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined font-variation-FILL-1 text-[20px]">notifications</span>
                   </div>
                   <p className="font-medium text-slate-900">通知权限</p>
                </div>
                <div className="flex items-center gap-1 text-slate-400">
                   <span className="text-sm">已开启</span>
                   <span className="material-symbols-outlined">chevron_right</span>
                </div>
             </div>
          </section>

          <section className="mx-4 bg-white rounded-xl shadow-sm overflow-hidden">
             <div className="flex items-center justify-between p-4 active:bg-slate-50 cursor-pointer">
                <div className="flex items-center gap-4">
                   <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-[20px]">cleaning_services</span>
                   </div>
                   <p className="font-medium text-slate-900">清除缓存</p>
                </div>
                <div className="flex items-center gap-1 text-slate-400">
                   <span className="text-sm">24.5 MB</span>
                   <span className="material-symbols-outlined">chevron_right</span>
                </div>
             </div>
          </section>

          <footer className="mt-8 flex flex-col items-center">
             <div className="size-16 rounded-2xl bg-gradient-to-br from-blue-400 to-primary flex items-center justify-center shadow-lg mb-2">
                <span className="material-symbols-outlined text-white text-3xl">local_dining</span>
             </div>
             <h3 className="font-bold text-slate-900">AI Smart-Diet Lens</h3>
             <p className="text-xs text-slate-400">版本 v1.0.4</p>
          </footer>
       </main>
    </div>
  );
};

export default Profile;