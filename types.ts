export type User = {
  name: string;
  grade: string;
  email: string;
};

export type Role = 'student' | 'teacher';

export type ActiveModule = 'studyBuddy' | 'assignments' | 'blog' | 'awards';

export type ChatMessage = {
  role: 'user' | 'model';
  parts: { text: string }[];
};

export type Lesson = {
  id: string;
  grade: number;
  subject: string;
  title: string;
  description: string;
};

export type AssignmentQuestion = {
  question: string;
  type: 'mcq' | 'open';
  options?: string[];
  correctAnswer: string;
};

export type Assignment = {
  id: string;
  lessonId: string;
  questions: AssignmentQuestion[];
};

export type AwardData = {
  cups: number;
  // Use string for icon, e.g., an emoji, to avoid complex types in services
  badges: { name: string; icon: string; description: string }[];
  hasMonthlyCertificate: boolean;
};

export type BlogCategory = 'Toán học' | 'Khoa học' | 'Văn học' | 'Chung';

export type BlogPost = {
  id: number;
  author: string;
  avatar: string;
  createdAt: string;
  category: BlogCategory;
  title: string;
  content: string;
  file?: { name: string; url: string };
  status: 'approved' | 'pending';
};
