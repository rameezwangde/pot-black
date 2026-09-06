import { BlogPost, blogPosts as initialBlogPosts } from '../data/blogData';

const STORAGE_KEY = 'pot_black_cms_blogs';

export const getStoredBlogs = (): BlogPost[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialBlogPosts));
      return initialBlogPosts;
    }
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : initialBlogPosts;
  } catch {
    return initialBlogPosts;
  }
};

export const saveBlogs = (blogs: BlogPost[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(blogs));
    // Dispatch custom event so live blog pages sync across tabs/components
    window.dispatchEvent(new Event('pot_black_blogs_updated'));
  } catch (e) {
    console.error('Failed to save blogs to storage', e);
  }
};

export const addBlogPost = (post: Omit<BlogPost, 'id' | 'slug'>): BlogPost => {
  const blogs = getStoredBlogs();
  const slug = post.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
  
  const newPost: BlogPost = {
    ...post,
    id: Date.now().toString(),
    slug: slug || `blog-${Date.now()}`
  };

  const updated = [newPost, ...blogs];
  saveBlogs(updated);
  return newPost;
};

export const updateBlogPost = (id: string, updatedFields: Partial<BlogPost>): BlogPost | null => {
  const blogs = getStoredBlogs();
  const index = blogs.findIndex(b => b.id === id);
  if (index === -1) return null;

  const updatedPost = { ...blogs[index], ...updatedFields };
  blogs[index] = updatedPost;
  saveBlogs(blogs);
  return updatedPost;
};

export const deleteBlogPost = (id: string): boolean => {
  const blogs = getStoredBlogs();
  const filtered = blogs.filter(b => b.id !== id);
  if (filtered.length === blogs.length) return false;
  saveBlogs(filtered);
  return true;
};

export const resetBlogsToDefault = (): BlogPost[] => {
  saveBlogs(initialBlogPosts);
  return initialBlogPosts;
};
