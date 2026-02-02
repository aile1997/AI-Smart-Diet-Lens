import React from 'react';
import { HashRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Splash from './pages/Splash';
import Home from './pages/Home';
import Scan from './pages/Scan';
import FoodResult from './pages/FoodResult';
import Diary from './pages/Diary';
import Wiki from './pages/Wiki';
import ShoppingList from './pages/ShoppingList';
import Profile from './pages/Profile';
import Onboarding from './pages/Onboarding';
import Achievements from './pages/Achievements';

// Bottom Navigation Component
const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { path: '/home', icon: 'home', label: '首页' },
    { path: '/diary', icon: 'menu_book', label: '日记' },
    { path: '/scan', icon: 'photo_camera', label: '', isFab: true }, // Spacer for FAB
    { path: '/wiki', icon: 'nutrition', label: '百科' },
    { path: '/profile', icon: 'person', label: '我的' },
  ];

  if (['/', '/scan', '/result', '/onboarding'].includes(currentPath)) return null;

  return (
    <>
      {/* Floating Action Button - Positioned absolutely */}
      <div className="fixed bottom-[4.5rem] left-1/2 transform -translate-x-1/2 z-50">
        <button 
          onClick={() => navigate('/scan')}
          className="group flex items-center justify-center w-16 h-16 rounded-full bg-primary shadow-fab hover:scale-105 active:scale-95 transition-all duration-300 ring-4 ring-background-light"
        >
          <span className="material-symbols-outlined text-[#0a3f21] text-3xl group-hover:animate-pulse">photo_camera</span>
        </button>
      </div>

      {/* Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto h-20 bg-white/90 backdrop-blur-xl border-t border-slate-100 z-40 flex items-center justify-between px-2 pb-2">
        {navItems.map((item) => {
          if (item.isFab) return <div key="fab-spacer" className="flex-[0.8]"></div>;
          
          const isActive = currentPath === item.path;
          return (
            <div key={item.path} className="flex-1 flex justify-center">
              <button 
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center gap-1 p-2 transition-colors ${isActive ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <span className={`material-symbols-outlined text-[26px] ${isActive ? 'font-variation-FILL-1' : ''}`}>{item.icon}</span>
                <span className={`text-[10px] font-medium ${isActive ? 'font-bold' : ''}`}>{item.label}</span>
              </button>
            </div>
          );
        })}
      </nav>
    </>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="relative w-full max-w-md mx-auto bg-background-light min-h-screen shadow-2xl overflow-hidden">
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/home" element={<Home />} />
          <Route path="/scan" element={<Scan />} />
          <Route path="/result" element={<FoodResult />} />
          <Route path="/diary" element={<Diary />} />
          <Route path="/wiki" element={<Wiki />} />
          <Route path="/list" element={<ShoppingList />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/achievements" element={<Achievements />} />
        </Routes>
        <BottomNav />
      </div>
    </HashRouter>
  );
};

export default App;