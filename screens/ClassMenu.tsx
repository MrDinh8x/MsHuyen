import React from 'react';

interface ClassMenuProps {
  onSelectGrade: (grade: number) => void;
}

const GradeButton: React.FC<{ grade: number, onClick: () => void }> = ({ grade, onClick }) => (
    <button 
        onClick={onClick}
        className="bg-slate-800/70 hover:bg-sky-600 text-white font-bold py-6 px-4 rounded-xl text-2xl transition-all duration-200 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-sky-500/30"
    >
        Lớp {grade}
    </button>
);

export default function ClassMenu({ onSelectGrade }: ClassMenuProps): React.ReactElement {
  const grades = [6, 7, 8, 9, 10, 11, 12];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 rounded-2xl p-8">
      <h2 className="text-3xl font-bold mb-2">Chọn Lớp Của Bạn</h2>
      <p className="text-slate-400 mb-8">Hãy chọn lớp để xem các bài học tương ứng nhé.</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 w-full max-w-4xl">
        {grades.map(grade => (
            <GradeButton key={grade} grade={grade} onClick={() => onSelectGrade(grade)} />
        ))}
      </div>
    </div>
  );
}
