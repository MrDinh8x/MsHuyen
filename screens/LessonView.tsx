import React, { useState, useEffect } from 'react';
import type { Lesson } from '../types';
import { getLessonsForGrade } from '../services/googleSheetService';

interface LessonViewProps {
  grade: number;
  selectedLesson: Lesson | null;
  onSelectLesson: (lesson: Lesson) => void;
  onStartAssignment: (lesson: Lesson) => void;
}

const SubjectCard: React.FC<{
    subject: string;
    lessons: Lesson[];
    selectedLesson: Lesson | null;
    onSelectLesson: (lesson: Lesson) => void;
}> = ({ subject, lessons, selectedLesson, onSelectLesson }) => (
    <div className="bg-slate-800/50 rounded-xl p-4">
        <h3 className="text-xl font-bold text-sky-400 mb-3">{subject}</h3>
        <div className="space-y-2">
            {lessons.map(lesson => (
                <button
                    key={lesson.id}
                    onClick={() => onSelectLesson(lesson)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                        selectedLesson?.id === lesson.id
                            ? 'bg-sky-600 text-white'
                            : 'bg-slate-700 hover:bg-slate-600'
                    }`}
                >
                    {lesson.title}
                </button>
            ))}
        </div>
    </div>
);


export default function LessonView({ grade, selectedLesson, onSelectLesson, onStartAssignment }: LessonViewProps): React.ReactElement {
  const [lessonsBySubject, setLessonsBySubject] = useState<Record<string, Lesson[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchLessons = async () => {
      setIsLoading(true);
      const allLessons = await getLessonsForGrade(grade);
      const grouped: Record<string, Lesson[]> = allLessons.reduce((acc, lesson) => {
          (acc[lesson.subject] = acc[lesson.subject] || []).push(lesson);
          return acc;
      }, {} as Record<string, Lesson[]>);
      setLessonsBySubject(grouped);
      // Select the first lesson of the first subject by default
      if (allLessons.length > 0) {
        onSelectLesson(allLessons[0]);
      }
      setIsLoading(false);
    };
    fetchLessons();
  }, [grade, onSelectLesson]);

  if (isLoading) {
    return (
        <div className="w-full h-full flex items-center justify-center">
             <div className="w-12 h-12 border-4 border-t-transparent border-sky-500 rounded-full animate-spin"></div>
        </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col md:flex-row gap-6 p-4 md:p-8 bg-slate-900 rounded-2xl">
      {/* Left side - Lesson List */}
      <div className="w-full md:w-2/5 lg:w-1/3 flex flex-col">
        <h2 className="text-3xl font-bold mb-2">Bài học Lớp {grade}</h2>
        <p className="text-slate-400 mb-6">Chọn một bài học để xem chi tiết và bắt đầu làm bài tập.</p>
        <div className="flex-1 space-y-4 overflow-y-auto pr-2">
            {Object.entries(lessonsBySubject).map(([subject, lessons]) => (
                <SubjectCard 
                    key={subject}
                    subject={subject}
                    lessons={lessons}
                    selectedLesson={selectedLesson}
                    onSelectLesson={onSelectLesson}
                />
            ))}
        </div>
      </div>

      {/* Right side - Lesson Detail */}
      <div className="w-full md:w-3/5 lg:w-2/3 bg-slate-800/50 rounded-2xl p-6 flex flex-col justify-center items-center text-center">
        {selectedLesson ? (
            <>
                <h3 className="text-2xl font-bold text-sky-400">{selectedLesson.title}</h3>
                <p className="text-slate-300 mt-2 mb-6 max-w-md">{selectedLesson.description}</p>
                <button
                    onClick={() => onStartAssignment(selectedLesson)}
                    className="bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105"
                >
                    Bắt đầu làm bài
                </button>
            </>
        ) : (
            <p className="text-slate-500">Hãy chọn một bài học để bắt đầu.</p>
        )}
      </div>
    </div>
  );
}
