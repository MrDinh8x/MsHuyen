import React, { useState } from 'react';
import type { User, Role, Lesson } from './types';

import Welcome from './screens/Welcome';
import ClassMenu from './screens/ClassMenu';
import LessonView from './screens/LessonView';
import Dashboard from './Dashboard';
import Fireworks from './components/Fireworks';

export default function App(): React.ReactElement {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role>('student');
  const [currentView, setCurrentView] = useState<'welcome' | 'class_menu' | 'lesson_view' | 'dashboard'>('welcome');
  
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  
  const [showFireworks, setShowFireworks] = useState(false);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setCurrentView('class_menu');
  };

  const handleSelectGrade = (grade: number) => {
    setSelectedGrade(grade);
    setCurrentView('lesson_view');
  };

  const handleSelectLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
  };
  
  const handleStartAssignment = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setCurrentView('dashboard');
  }

  const triggerFireworks = () => {
    setShowFireworks(true);
    setTimeout(() => setShowFireworks(false), 5000); // Fireworks last for 5 seconds
  };
  
  const renderContent = () => {
    switch (currentView) {
      case 'welcome':
        return <Welcome onLogin={handleLogin} />;
      case 'class_menu':
        return <ClassMenu onSelectGrade={handleSelectGrade} />;
      case 'lesson_view':
        if (!selectedGrade) return <ClassMenu onSelectGrade={handleSelectGrade} />;
        return (
          <LessonView
            grade={selectedGrade}
            selectedLesson={selectedLesson}
            onSelectLesson={handleSelectLesson}
            onStartAssignment={handleStartAssignment}
          />
        );
      case 'dashboard':
        if (!user || !selectedLesson) return <Welcome onLogin={handleLogin} />;
        return (
          <Dashboard 
            user={user} 
            role={role} 
            setRole={setRole} 
            initialLesson={selectedLesson}
            triggerFireworks={triggerFireworks}
          />
        );
      default:
        return <Welcome onLogin={handleLogin} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 font-sans text-slate-200 flex flex-col items-center justify-center p-4">
      {showFireworks && <Fireworks />}
      <div className="w-full max-w-7xl h-[95vh]">
         {renderContent()}
      </div>
    </div>
  );
}
