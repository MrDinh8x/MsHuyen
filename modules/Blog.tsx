import React, { useState, useEffect } from 'react';
import type { BlogPost, User, Role, BlogCategory } from '../types';
import { getBlogPosts, saveBlogPost, approveBlogPost } from '../services/googleSheetService';

interface BlogProps {
    user: User;
    role: Role;
}

const CATEGORIES: BlogCategory[] = ['Toán học', 'Khoa học', 'Văn học', 'Chung'];

const PostCard: React.FC<{ post: BlogPost; role: Role; onApprove: (id: number) => void }> = ({ post, role, onApprove }) => (
  <div className={`bg-slate-700/50 rounded-xl p-4 flex flex-col gap-3 transition-all hover:bg-slate-700 ${post.status === 'pending' ? 'border-l-4 border-yellow-500' : ''}`}>
    <div className="flex items-center gap-3">
      <img src={post.avatar} alt={post.author} className="w-10 h-10 rounded-full" />
      <div>
        <p className="font-semibold text-white">{post.author}</p>
        <p className="text-xs text-slate-400">
            {post.createdAt} · <span className="font-semibold">{post.category}</span>
        </p>
      </div>
       {post.status === 'pending' && <span className="ml-auto text-xs bg-yellow-500/80 text-white font-bold px-2 py-1 rounded-full">Chờ duyệt</span>}
    </div>
    <h4 className="font-bold text-sky-400">{post.title}</h4>
    <p className="text-sm text-slate-300 line-clamp-3">{post.content}</p>
    {post.file && (
      <a href={post.file.url} className="text-sm bg-slate-600 hover:bg-slate-500 text-sky-300 rounded-full px-3 py-1 self-start flex items-center gap-2">
        <i className="fas fa-paperclip"></i>
        {post.file.name}
      </a>
    )}
    {role === 'teacher' && post.status === 'pending' && (
        <button onClick={() => onApprove(post.id)} className="mt-2 self-end px-3 py-1 bg-green-600 hover:bg-green-500 text-white rounded-lg text-xs font-semibold">
            Duyệt bài
        </button>
    )}
  </div>
);

const CreatePostForm: React.FC<{ onPost: (post: Omit<BlogPost, 'id' | 'createdAt' | 'avatar' | 'status'>, user: User) => void, onCancel: () => void, user: User }> = ({ onPost, onCancel, user }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState<BlogCategory>('Chung');
    const [file, setFile] = useState<File | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onPost({
            // FIX: Added missing 'author' property to satisfy the type requirement.
            author: user.name,
            title,
            content,
            category,
            file: file ? { name: file.name, url: URL.createObjectURL(file) } : undefined,
        }, user);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-slate-700 p-4 rounded-xl space-y-3 mb-4">
            <input type="text" placeholder="Tiêu đề bài viết..." value={title} onChange={e => setTitle(e.target.value)} required className="w-full bg-slate-800 rounded-lg p-2 focus:ring-2 focus:ring-sky-500 focus:outline-none"/>
            <textarea placeholder="Nội dung thảo luận..." value={content} onChange={e => setContent(e.target.value)} required rows={4} className="w-full bg-slate-800 rounded-lg p-2 focus:ring-2 focus:ring-sky-500 focus:outline-none resize-none"></textarea>
             <div>
              <label htmlFor="category" className="block text-sm font-medium text-slate-400 mb-1">Chủ đề</label>
              <select id="category" value={category} onChange={e => setCategory(e.target.value as BlogCategory)} className="w-full bg-slate-800 rounded-lg p-2 focus:ring-2 focus:ring-sky-500 focus:outline-none">
                {CATEGORIES.map(cat => <option key={cat}>{cat}</option>)}
              </select>
            </div>
            <input type="file" onChange={e => setFile(e.target.files ? e.target.files[0] : null)} className="text-sm text-slate-400 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100" />
            <div className="flex justify-end gap-2">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-600 hover:bg-slate-500 rounded-lg text-sm">Hủy</button>
                <button type="submit" className="px-4 py-2 bg-sky-600 hover:bg-sky-500 rounded-lg text-sm">Đăng bài</button>
            </div>
        </form>
    );
};

const FilterButton: React.FC<{ label: string, onClick: () => void, isActive: boolean }> = ({ label, onClick, isActive }) => (
    <button
        onClick={onClick}
        className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${isActive ? 'bg-sky-500 text-white' : 'bg-slate-600/50 hover:bg-slate-600 text-slate-300'}`}
    >
        {label}
    </button>
);


export default function Blog({ user, role }: BlogProps): React.ReactElement {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filterCategory, setFilterCategory] = useState<'all' | BlogCategory>('all');

  useEffect(() => {
    fetchPosts();
  }, [role]); // Refetch when role changes to show/hide pending posts

  const fetchPosts = async () => {
    setIsLoading(true);
    const data = await getBlogPosts();
    setPosts(data);
    setIsLoading(false);
  };
  
  const handlePost = async (postData: Omit<BlogPost, 'id' | 'createdAt' | 'avatar' | 'status'>, author: User) => {
    await saveBlogPost(postData, author);
    setShowForm(false);
    fetchPosts();
  }
  
  const handleApprove = async (postId: number) => {
      await approveBlogPost(postId);
      fetchPosts();
  }
  
  const filteredPosts = posts
    .filter(p => role === 'teacher' || p.status === 'approved')
    .filter(p => filterCategory === 'all' || p.category === filterCategory);

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">Blog Học Tập</h2>
        {role === 'student' && (
            <button onClick={() => setShowForm(!showForm)} className="bg-sky-600 hover:bg-sky-500 text-white font-bold py-2 px-4 rounded-lg text-sm">
                {showForm ? 'Đóng' : 'Tạo bài viết mới'}
            </button>
        )}
      </div>

      {showForm && <CreatePostForm onPost={handlePost} onCancel={() => setShowForm(false)} user={user} />}

      <div className="flex flex-wrap gap-2 mb-4">
        <FilterButton label="Tất cả" onClick={() => setFilterCategory('all')} isActive={filterCategory === 'all'} />
        {CATEGORIES.map(cat => (
             <FilterButton key={cat} label={cat} onClick={() => setFilterCategory(cat)} isActive={filterCategory === cat} />
        ))}
      </div>

      {isLoading ? (
        <div className="flex-1 flex justify-center items-center">
            <div className="w-12 h-12 border-4 border-t-transparent border-sky-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {filteredPosts.length > 0 ? filteredPosts.map(post => (
                <PostCard key={post.id} post={post} role={role} onApprove={handleApprove}/>
            )) : <p className="text-center text-slate-500 pt-8">Không có bài viết nào trong chủ đề này.</p>}
        </div>
      )}
    </div>
  );
}