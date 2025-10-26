import type { User, Lesson, Assignment, AwardData, BlogPost } from '../types';

// Mock database
let mockStudent: User | null = null;
let mockUnderstandingScore: number | null = null;
let mockAwards: AwardData = {
  cups: 5,
  badges: [
    { name: 'Chăm chỉ', icon: '💪', description: 'Hoàn thành 10 bài tập' },
    { name: 'Tò mò', icon: '🧐', description: 'Hỏi 20 câu hỏi với Study Buddy' },
    { name: 'Ngôi sao tháng', icon: '⭐', description: 'Đạt điểm cao nhất lớp' },
  ],
  hasMonthlyCertificate: false,
};
let mockBlogPosts: BlogPost[] = [
  {
    id: 1,
    author: 'Nguyễn Văn An',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    createdAt: '2 ngày trước',
    category: 'Toán học',
    title: 'Cách giải phương trình bậc hai',
    content: 'Hôm nay mình học được cách giải phương trình bậc hai rất hay, mình muốn chia sẻ với mọi người...',
    status: 'approved',
  },
  {
    id: 2,
    author: 'Trần Thị Bích',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704e',
    createdAt: '1 giờ trước',
    category: 'Văn học',
    title: 'Phân tích nhân vật Chí Phèo',
    content: 'Chí Phèo là một nhân vật phức tạp, đại diện cho tầng lớp nông dân bị tha hóa...',
    status: 'pending',
  },
];
let nextPostId = 3;

// --- MOCK SERVICE FUNCTIONS ---

export const saveStudentData = async (user: User): Promise<void> => {
  console.log('Saving student data:', user);
  mockStudent = user;
  await new Promise(res => setTimeout(res, 500));
};

export const getLessonsForGrade = async (grade: number): Promise<Lesson[]> => {
  console.log(`Fetching lessons for grade ${grade}`);
  await new Promise(res => setTimeout(res, 500));
  // Dummy data
  return [
    { id: `g${grade}_math_1`, grade, subject: 'Toán học', title: 'Chương 1: Số hữu tỉ', description: 'Ôn tập về số hữu tỉ và các phép toán.' },
    { id: `g${grade}_lit_1`, grade, subject: 'Văn học', title: 'Bài 1: Truyện ngắn', description: 'Phân tích các tác phẩm truyện ngắn nổi tiếng.' },
    { id: `g${grade}_sci_1`, grade, subject: 'Khoa học', title: 'Unit 1: The Cell', description: 'Learn about the basic unit of life.' },
  ];
};

export const getAssignmentForLesson = async (lessonId: string): Promise<Assignment> => {
    console.log(`Fetching assignment for lesson ${lessonId}`);
    await new Promise(res => setTimeout(res, 1000));
    // Dummy data
    return {
        id: `asg_${lessonId}`,
        lessonId,
        questions: [
            {
                question: 'Số hữu tỉ là gì?',
                type: 'mcq',
                options: ['Là số viết được dưới dạng a/b với a, b là số nguyên, b khác 0', 'Là số nguyên', 'Là số thập phân'],
                correctAnswer: 'Là số viết được dưới dạng a/b với a, b là số nguyên, b khác 0',
            },
            {
                question: 'So sánh hai số hữu tỉ -1/2 và -2/3.',
                type: 'open',
                correctAnswer: 'Ta có -1/2 = -3/6 và -2/3 = -4/6. Vì -3 > -4 nên -3/6 > -4/6, hay -1/2 > -2/3.',
            }
        ]
    };
};

export const saveUnderstandingScore = async (score: number): Promise<void> => {
  console.log('Saving understanding score:', score);
  mockUnderstandingScore = score;
  await new Promise(res => setTimeout(res, 500));
};

export const getUserAwards = async (): Promise<AwardData> => {
  console.log('Fetching user awards');
  await new Promise(res => setTimeout(res, 800));
  return mockAwards;
};

export const awardCup = async (): Promise<void> => {
  console.log('Awarding a cup!');
  mockAwards.cups += 1;
  await new Promise(res => setTimeout(res, 300));
};

export const getBlogPosts = async (): Promise<BlogPost[]> => {
    console.log('Fetching blog posts');
    await new Promise(res => setTimeout(res, 700));
    return [...mockBlogPosts].reverse(); // Newest first
};

export const saveBlogPost = async (postData: Omit<BlogPost, 'id' | 'createdAt' | 'avatar' | 'status'>, user: User): Promise<void> => {
    console.log('Saving blog post:', postData);
    const newPost: BlogPost = {
        ...postData,
        id: nextPostId++,
        createdAt: 'Vừa xong',
        avatar: 'https://i.pravatar.cc/150?u=currentuser', // generic avatar for current user
        status: 'pending', // All new posts are pending
    };
    mockBlogPosts.push(newPost);
    await new Promise(res => setTimeout(res, 600));
};

export const approveBlogPost = async (postId: number): Promise<void> => {
    console.log('Approving blog post:', postId);
    const post = mockBlogPosts.find(p => p.id === postId);
    if (post) {
        post.status = 'approved';
    }
    await new Promise(res => setTimeout(res, 400));
};
