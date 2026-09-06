import { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Sparkles, 
  Search, 
  Calendar, 
  Clock, 
  Check, 
  X, 
  BookOpen, 
  RotateCcw,
  Tag,
  Image as ImageIcon
} from 'lucide-react';
import { BlogPost } from '../../data/blogData';
import { 
  getStoredBlogs, 
  addBlogPost, 
  updateBlogPost, 
  deleteBlogPost, 
  resetBlogsToDefault 
} from '../../services/blogStorageService';
import { useAdminToast } from '../../context/AdminToastContext';

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const { showToast } = useAdminToast();

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'Pro Tips & Technique',
    excerpt: '',
    content: '',
    authorName: 'Pot Black Team',
    authorRole: 'Resident Coach',
    readTime: '4 min read',
    image: '/expert_coaching.png',
    featured: false,
    tags: 'Technique, Training'
  });

  const loadBlogs = () => {
    setBlogs(getStoredBlogs());
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  const handleOpenAdd = () => {
    setEditingBlog(null);
    setFormData({
      title: '',
      category: 'Pro Tips & Technique',
      excerpt: '',
      content: '',
      authorName: 'Pot Black Team',
      authorRole: 'Resident Coach',
      readTime: '4 min read',
      image: '/expert_coaching.png',
      featured: false,
      tags: 'Technique, Training'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (blog: BlogPost) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      category: blog.category,
      excerpt: blog.excerpt,
      content: blog.content.join('\n\n'),
      authorName: blog.author.name,
      authorRole: blog.author.role,
      readTime: blog.readTime,
      image: blog.image,
      featured: !!blog.featured,
      tags: blog.tags.join(', ')
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteBlogPost(id);
      loadBlogs();
      showToast?.({ title: 'Blog Deleted', description: `"${title}" was removed.`, variant: 'info' });
    }
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all blogs to original default articles? Any custom posts will be overwritten.')) {
      resetBlogsToDefault();
      loadBlogs();
      showToast?.({ title: 'Reset Successful', description: 'Blogs restored to defaults.', variant: 'success' });
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formattedContent = formData.content
      .split('\n\n')
      .map(p => p.trim())
      .filter(Boolean);

    const formattedTags = formData.tags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const todayDate = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    });

    if (editingBlog) {
      updateBlogPost(editingBlog.id, {
        title: formData.title,
        category: formData.category,
        excerpt: formData.excerpt,
        content: formattedContent,
        author: {
          name: formData.authorName,
          role: formData.authorRole
        },
        readTime: formData.readTime,
        image: formData.image,
        featured: formData.featured,
        tags: formattedTags
      });
      showToast?.({ title: 'Blog Updated', description: 'Changes saved successfully.', variant: 'success' });
    } else {
      addBlogPost({
        title: formData.title,
        category: formData.category,
        excerpt: formData.excerpt,
        content: formattedContent,
        author: {
          name: formData.authorName,
          role: formData.authorRole
        },
        date: todayDate,
        readTime: formData.readTime,
        image: formData.image,
        featured: formData.featured,
        tags: formattedTags
      });
      showToast?.({ title: 'Blog Published', description: 'New article is now live on the website.', variant: 'success' });
    }

    setIsModalOpen(false);
    loadBlogs();
  };

  const filteredBlogs = blogs.filter(b => 
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-8">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 text-[#D4AF37] text-[10px] font-bold uppercase tracking-[0.2em] mb-1">
            <BookOpen className="w-4 h-4" />
            <span>Content Management System</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#E2D2A4]">
            Blog & Journal Articles
          </h2>
          <p className="text-xs text-gray-400 font-light mt-1">
            Create, edit, feature, and delete blog posts published on the Pot Black website.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleResetDefaults}
            className="px-4 py-2.5 bg-black/40 border border-white/10 text-gray-400 hover:text-white hover:border-white/30 text-xs font-medium uppercase tracking-[0.1em] rounded-sm transition-colors flex items-center gap-2"
            title="Reset to default mock posts"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="px-5 py-2.5 bg-gradient-to-r from-[#CBA469] to-[#D4AF37] hover:scale-105 text-black text-xs font-bold uppercase tracking-[0.15em] rounded-sm transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.25)]"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Blog</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search blogs by title, category, or tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#140a0b] border border-white/10 focus:border-[#D4AF37] text-white text-xs rounded-sm focus:outline-none transition-colors placeholder-gray-500"
          />
        </div>
        <span className="text-xs text-gray-400 font-light">
          Total Posts: <strong className="text-[#E2D2A4]">{filteredBlogs.length}</strong>
        </span>
      </div>

      {/* Blogs List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBlogs.map((blog) => (
          <div
            key={blog.id}
            className="bg-[#140a0b] border border-white/10 rounded-sm overflow-hidden flex flex-col justify-between hover:border-[#D4AF37]/50 transition-all duration-300 group"
          >
            <div>
              {/* Card Image */}
              <div className="h-44 w-full relative overflow-hidden bg-black/40">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-black/80 border border-white/10 text-[#D4AF37] text-[10px] font-bold uppercase tracking-[0.15em] px-2.5 py-1 rounded-[2px]">
                  {blog.category}
                </div>
                {blog.featured && (
                  <div className="absolute top-3 right-3 bg-[#D4AF37] text-black text-[9px] font-bold uppercase tracking-[0.15em] px-2.5 py-1 rounded-[2px] flex items-center gap-1 shadow-md">
                    <Sparkles className="w-3 h-3" />
                    <span>Featured</span>
                  </div>
                )}
              </div>

              {/* Body */}
              <div className="p-5">
                <div className="flex items-center gap-3 text-[10px] text-gray-400 mb-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#D4AF37]" /> {blog.date}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#D4AF37]" /> {blog.readTime}
                  </span>
                </div>

                <h3 className="text-base font-serif text-[#E2D2A4] group-hover:text-white transition-colors mb-2 line-clamp-2 leading-snug">
                  {blog.title}
                </h3>

                <p className="text-xs text-gray-400 font-light line-clamp-2 mb-4 leading-relaxed">
                  {blog.excerpt}
                </p>

                <div className="flex flex-wrap gap-1">
                  {blog.tags.map(t => (
                    <span key={t} className="text-[9px] text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded-[2px]">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="px-5 py-3 border-t border-white/5 bg-black/30 flex items-center justify-between">
              <span className="text-[11px] text-gray-400 font-light truncate max-w-[120px]">
                By {blog.author.name}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(blog)}
                  className="p-1.5 text-gray-400 hover:text-[#D4AF37] hover:bg-white/5 rounded-sm transition-colors"
                  title="Edit Blog"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(blog.id, blog.title)}
                  className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-sm transition-colors"
                  title="Delete Blog"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl max-h-[90vh] bg-[#140a0b] border border-[#D4AF37]/40 rounded-sm shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-y-auto p-6 sm:p-8">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-full bg-black/40 border border-white/10"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-xl font-serif text-[#E2D2A4] mb-1">
              {editingBlog ? 'Edit Blog Post' : 'Create New Blog Post'}
            </h3>
            <p className="text-xs text-gray-400 mb-6 font-light">
              All changes are synced live to the public Pot Black journal.
            </p>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              {/* Title */}
              <div>
                <label className="block text-[#E2D2A4] uppercase tracking-wider mb-1 font-medium">
                  Article Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master the 9-Ball Break: Physics and Tip Alignment"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-black/60 border border-white/15 focus:border-[#D4AF37] text-white rounded-sm focus:outline-none"
                />
              </div>

              {/* Category & Featured */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#E2D2A4] uppercase tracking-wider mb-1 font-medium">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#1b0d0e] border border-white/15 focus:border-[#D4AF37] text-white rounded-sm focus:outline-none"
                  >
                    <option value="Pro Tips & Technique">Pro Tips & Technique</option>
                    <option value="Game Guides">Game Guides</option>
                    <option value="Lifestyle & Events">Lifestyle & Events</option>
                    <option value="Behind The Scenes">Behind The Scenes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#E2D2A4] uppercase tracking-wider mb-1 font-medium">
                    Read Time (e.g. 5 min read)
                  </label>
                  <input
                    type="text"
                    value={formData.readTime}
                    onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-black/60 border border-white/15 focus:border-[#D4AF37] text-white rounded-sm focus:outline-none"
                  />
                </div>
              </div>

              {/* Cover Image & Featured Checkbox */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#E2D2A4] uppercase tracking-wider mb-1 font-medium">
                    Cover Image URL or Path
                  </label>
                  <input
                    type="text"
                    placeholder="/expert_coaching.png"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-black/60 border border-white/15 focus:border-[#D4AF37] text-white rounded-sm focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-3 pt-6">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 accent-[#D4AF37] cursor-pointer"
                  />
                  <label htmlFor="featured" className="text-gray-300 font-medium cursor-pointer">
                    Display as Featured Hero Post
                  </label>
                </div>
              </div>

              {/* Author Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#E2D2A4] uppercase tracking-wider mb-1 font-medium">
                    Author Name
                  </label>
                  <input
                    type="text"
                    value={formData.authorName}
                    onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-black/60 border border-white/15 focus:border-[#D4AF37] text-white rounded-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#E2D2A4] uppercase tracking-wider mb-1 font-medium">
                    Author Role / Title
                  </label>
                  <input
                    type="text"
                    value={formData.authorRole}
                    onChange={(e) => setFormData({ ...formData, authorRole: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-black/60 border border-white/15 focus:border-[#D4AF37] text-white rounded-sm focus:outline-none"
                  />
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-[#E2D2A4] uppercase tracking-wider mb-1 font-medium">
                  Summary / Excerpt *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Short 1-2 sentence teaser for preview cards..."
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-black/60 border border-white/15 focus:border-[#D4AF37] text-white rounded-sm focus:outline-none resize-none"
                />
              </div>

              {/* Full Content */}
              <div>
                <label className="block text-[#E2D2A4] uppercase tracking-wider mb-1 font-medium">
                  Full Article Body (Separate paragraphs with double Enter) *
                </label>
                <textarea
                  rows={6}
                  required
                  placeholder="Write the full article text here. Separate distinct paragraphs by pressing Enter twice..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-black/60 border border-white/15 focus:border-[#D4AF37] text-white rounded-sm focus:outline-none"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-[#E2D2A4] uppercase tracking-wider mb-1 font-medium">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="Spin Control, Tournament, Simonis Cloth"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-black/60 border border-white/15 focus:border-[#D4AF37] text-white rounded-sm focus:outline-none"
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-black/40 border border-white/10 text-gray-400 hover:text-white rounded-sm uppercase tracking-wider text-[11px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-[#CBA469] to-[#D4AF37] text-black font-bold uppercase tracking-wider text-[11px] rounded-sm shadow-md hover:scale-105 transition-transform"
                >
                  {editingBlog ? 'Save Changes' : 'Publish Blog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
