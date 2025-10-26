import React, { useState, useEffect } from 'react';
import type { User } from '../types';
import { saveStudentData } from '../services/googleSheetService';

interface WelcomeProps {
  onLogin: (user: User) => void;
}

export default function Welcome({ onLogin }: WelcomeProps): React.ReactElement {
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('');
  const [email, setEmail] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    setIsFormValid(name.trim() !== '' && grade.trim() !== '' && email.trim().includes('@'));
  }, [name, grade, email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      const user: User = { name, grade, email };
      await saveStudentData(user);
      onLogin(user);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-center bg-slate-900 rounded-2xl p-8">
      <div className="max-w-md">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Chào mừng đến với AI Learning Mate</h1>
        <p className="text-slate-400 italic text-lg mb-8">
          “Học tập không phải là điểm đến, mà là hành trình.” – <span className="font-semibold">Zig Ziglar</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">1️⃣ Tên học sinh</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ví dụ: Nguyễn Văn An"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 focus:ring-2 focus:ring-sky-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label htmlFor="grade" className="block text-sm font-medium text-slate-300 mb-1">2️⃣ Lớp</label>
            <input
              id="grade"
              type="text"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              placeholder="Ví dụ: 8A1"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 focus:ring-2 focus:ring-sky-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">3️⃣ Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="de.nhan.chung.nhan@email.com"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 focus:ring-2 focus:ring-sky-500 focus:outline-none"
              required
            />
          </div>
          <button
            type="submit"
            disabled={!isFormValid}
            className={`w-full text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2
              ${isFormValid 
                ? 'bg-sky-600 hover:bg-sky-500 shadow-lg shadow-sky-500/30 transform hover:scale-105' 
                : 'bg-slate-700 cursor-not-allowed text-slate-400'
              }`}
          >
            Chúng ta bắt đầu nào 🚀
          </button>
        </form>
      </div>
    </div>
  );
}
