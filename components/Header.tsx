import React from 'react';
import type { ActiveModule, User, Role } from '../types';
import { StudyBuddyIcon, AwardsIcon, BlogIcon, SparklesIcon } from './icons/Icons';
import RoleSwitcher from './RoleSwitcher';

// Custom icon for Assignments
const AssignmentsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
        <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
    </svg>
);


interface HeaderProps {
  user: User;
  role: Role;
  setRole: (role: Role) => void;
  activeModule: ActiveModule;
  setActiveModule: (module: ActiveModule) => void;
}

const NavButton: React.FC<{
  label: string;
  icon: React.ReactElement;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 p-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
      isActive
        ? 'bg-sky-500 text-white shadow-lg'
        : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

export default function Header({ user, role, setRole, activeModule, setActiveModule }: HeaderProps): React.ReactElement {
  const navItems = [
    { id: 'studyBuddy', label: 'My Study Buddy', icon: <StudyBuddyIcon /> },
    { id: 'assignments', label: 'Bài tập', icon: <AssignmentsIcon /> },
    { id: 'blog', label: 'Blog Học Tập', icon: <BlogIcon /> },
    { id: 'awards', label: 'Cúp & Huy hiệu', icon: <AwardsIcon /> },
  ];

  return (
    <header className="w-full md:w-64 bg-slate-800/50 rounded-2xl p-4 flex flex-col gap-6 shadow-xl">
      <div className="flex items-center gap-2">
        <SparklesIcon />
        <h1 className="text-xl font-bold text-white">AI Learning Mate</h1>
      </div>
      
      <div className="text-center border-y border-slate-700 py-3">
        <p className="font-semibold text-white">{user.name}</p>
        <p className="text-sm text-slate-400">{user.grade}</p>
      </div>

      <nav className="flex flex-row md:flex-col gap-2">
        {navItems.map((item) => (
          <NavButton
            key={item.id}
            label={item.label}
            icon={item.icon}
            isActive={activeModule === item.id}
            onClick={() => setActiveModule(item.id as ActiveModule)}
          />
        ))}
      </nav>
      
      <RoleSwitcher role={role} setRole={setRole} />
      
      <div className="mt-auto hidden md:block text-center text-xs text-slate-500">
        <p>&copy; 2024 AI Learning Mate</p>
        <p>Học tập thông minh, tiến bộ mỗi ngày.</p>
      </div>
    </header>
  );
}
