import React, { useState } from 'react';
import type { ActiveModule, User, Role, Lesson } from './types';
import Header from './components/Header';
import StudyBuddy from './modules/StudyBuddy';
import Assignments from './modules/Assignments';
import Awards from './modules/Awards';
import Blog from './modules/Blog';

interface DashboardProps {
  user: User;
  role: Role;
  setRole: (role: Role) => void;
  initialLesson: Lesson;
  triggerFireworks: () => void;
}

export default function Dashboard({ user, role, setRole, initialLesson, triggerFireworks }: DashboardProps): React.ReactElement {
  // Start on the assignments module for the selected lesson
  const [activeModule, setActiveModule] = useState<ActiveModule>('assignments');
  const [currentLesson, setCurrentLesson] = useState<Lesson>(initialLesson);

  const renderModule = (): React.ReactElement => {
    switch (activeModule) {
      case 'studyBuddy':
        return <StudyBuddy />;
      case 'assignments':
        return <Assignments lesson={currentLesson} onComplete={triggerFireworks} />;
      case 'awards':
        return <Awards />;
      case 'blog':
        return <Blog user={user} role={role} />;
      default:
        return <Assignments lesson={currentLesson} onComplete={triggerFireworks} />;
    }
  };

  return (
    <div className="w-full h-full flex flex-col md:flex-row gap-4">
      <Header
        user={user}
        role={role}
        setRole={setRole}
        activeModule={activeModule}
        setActiveModule={setActiveModule}
      />
      <main className="flex-1 bg-slate-800/50 rounded-2xl shadow-2xl p-4 sm:p-6 overflow-y-auto">
        {renderModule()}
      </main>
    </div>
  );
}
