import React, { useState, useEffect } from 'react';
import type { Assignment, AssignmentQuestion, Lesson } from '../types';
import { getAssignmentForLesson, awardCup } from '../services/googleSheetService';
import { gradeOpenQuestion } from '../services/geminiService';

interface AssignmentsProps {
    lesson: Lesson;
    onComplete: () => void; // Callback to trigger fireworks
}

type Answer = { questionIndex: number, answer: string };
type Result = { score: number, feedback: string };

export default function Assignments({ lesson, onComplete }: AssignmentsProps): React.ReactElement {
    const [assignment, setAssignment] = useState<Assignment | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [answers, setAnswers] = useState<Answer[]>([]);
    const [results, setResults] = useState<(Result | null)[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [finalScore, setFinalScore] = useState<number | null>(null);
    
    useEffect(() => {
        const fetchAssignment = async () => {
            setIsLoading(true);
            setFinalScore(null);
            setAnswers([]);
            const data = await getAssignmentForLesson(lesson.id);
            setAssignment(data);
            setResults(new Array(data?.questions.length || 0).fill(null));
            setIsLoading(false);
        };
        fetchAssignment();
    }, [lesson]);

    const handleAnswerChange = (questionIndex: number, answer: string) => {
        const newAnswers = [...answers];
        const existingAnswerIndex = newAnswers.findIndex(a => a.questionIndex === questionIndex);
        if (existingAnswerIndex > -1) {
            newAnswers[existingAnswerIndex].answer = answer;
        } else {
            newAnswers.push({ questionIndex, answer });
        }
        setAnswers(newAnswers);
    };

    const handleSubmit = async () => {
        if (!assignment) return;
        setIsSubmitting(true);
        
        let totalScore = 0;
        const newResults = [...results];

        for (let i = 0; i < assignment.questions.length; i++) {
            const question = assignment.questions[i];
            const userAnswer = answers.find(a => a.questionIndex === i)?.answer || '';
            
            if(question.type === 'mcq') {
                if (userAnswer === question.correctAnswer) {
                    newResults[i] = { score: 10, feedback: 'Chính xác!' };
                    totalScore += 10;
                } else {
                    newResults[i] = { score: 0, feedback: `Sai rồi! Đáp án đúng là: ${question.correctAnswer}` };
                }
            } else { // open question
                const grading = await gradeOpenQuestion(question.question, question.correctAnswer, userAnswer);
                newResults[i] = grading;
                totalScore += grading.score;
            }
        }
        
        const calculatedScore = Math.round((totalScore / (assignment.questions.length * 10)) * 100);
        setFinalScore(calculatedScore);
        setResults(newResults);

        if (calculatedScore === 100) {
            await awardCup();
            onComplete(); // Trigger fireworks
        }
        setIsSubmitting(false);
    };

    const renderQuestion = (q: AssignmentQuestion, index: number) => {
        const result = results[index];
        const isGraded = finalScore !== null;

        return (
            <div key={index} className={`bg-slate-700/50 p-4 rounded-xl border-l-4 ${
                isGraded ? (result?.score ?? 0) >= 7 ? 'border-green-500' : 'border-red-500' : 'border-slate-600'
            }`}>
                <p className="font-semibold mb-2">{index + 1}. {q.question}</p>
                {q.type === 'mcq' ? (
                    <div className="space-y-2">
                        {q.options?.map(option => (
                            <label key={option} className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-600 cursor-pointer">
                                <input 
                                    type="radio"
                                    name={`q${index}`} 
                                    value={option}
                                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                                    disabled={isGraded}
                                    className="form-radio text-sky-500 bg-slate-800"
                                />
                                <span>{option}</span>
                            </label>
                        ))}
                    </div>
                ) : (
                    <textarea 
                        rows={3}
                        placeholder="Nhập câu trả lời của bạn..."
                        onChange={(e) => handleAnswerChange(index, e.target.value)}
                        disabled={isGraded}
                        className="w-full bg-slate-800 rounded-lg p-2 focus:ring-2 focus:ring-sky-500 focus:outline-none resize-none"
                    ></textarea>
                )}
                {isGraded && result && (
                    <div className={`mt-2 text-sm p-2 rounded-lg ${result.score >= 7 ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                        <strong>Điểm: {result.score}/10.</strong> {result.feedback}
                    </div>
                )}
            </div>
        );
    };

    if (isLoading) return <div className="text-center p-8">Đang tải bài tập...</div>;
    if (!assignment) return <div className="text-center p-8">Không tìm thấy bài tập cho bài học này.</div>;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Bài tập: {lesson.title}</h2>
            
            {finalScore !== null && (
                 <div className="text-center bg-slate-700 p-4 rounded-xl">
                    <h3 className="text-xl font-bold">Kết quả: {finalScore}/100 điểm</h3>
                    {finalScore === 100 && <p className="text-green-400 mt-2">🎉 Chúc mừng, bạn đã nhận được Cup! Hãy tích lũy Cup để trở thành **Siêu nhân số của tháng và nhận quà từ Ms Huyền nhé!** 🎖️</p>}
                 </div>
            )}
           
            <div className="space-y-4">
                {assignment.questions.map(renderQuestion)}
            </div>
            
            {finalScore === null && (
                 <button 
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full bg-sky-600 hover:bg-sky-500 disabled:bg-slate-600 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2"
                 >
                    {isSubmitting ? 'AI đang chấm bài...' : 'Nộp bài'}
                 </button>
            )}
        </div>
    );
}
