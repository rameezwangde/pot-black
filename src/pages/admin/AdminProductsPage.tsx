import { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  RotateCcw, 
  ShoppingBag, 
  Tag, 
  DollarSign, 
  Image as ImageIcon,
  Check, 
  X,
  Layers,
  Sparkles
} from 'lucide-react';
import { Product } from '../../data/products';
import { 
  getStoredProducts, 
  addProduct, 
  updateProduct, 
  deleteProduct, 
  resetProductsToDefault 
} from '../../services/productStorageService';
import { useAdminToast } from '../../context/AdminToastContext';

const DEFAULT_CATEGORIES = [
  'Accessories',
  'Bags & Cases',
  'Billiards Cues',
  'Billiards Cue Tips'
];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { showToast } = useAdminToast();

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Accessories',
    price: 50,
    salePrice: '',
    quantityInStock: 10,
    stockStatus: 'In Stock' as 'In Stock' | 'Out of Stock' | 'Low Stock',
    status: 'Active' as 'Active' | 'Inactive',
    description: '',
    image: '',
    additionalImages: ''
  });

  const loadProducts = () => {
    setProducts(getStoredProducts());
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: 'Accessories',
      price: 50,
      salePrice: '',
      quantityInStock: 10,
      stockStatus: 'In Stock',
      status: 'Active',
      description: '',
      image: '/images/products/3-in-1-tip-shaper/01.jpg',
      additionalImages: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      category: p.category,
      price: p.price,
      salePrice: p.salePrice ? p.salePrice.toString() : '',
      quantityInStock: p.quantityInStock,
      stockStatus: p.stockStatus,
      status: p.status,
      description: p.description,
      image: p.image,
      additionalImages: p.images ? p.images.join(', ') : ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove "${name}" from store?`)) {
      deleteProduct(id);
      loadProducts();
      showToast?.({ title: 'Product Deleted', description: `"${name}" was deleted.`, variant: 'info' });
    }
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all store items to original default product list?')) {
      resetProductsToDefault();
      loadProducts();
      showToast?.({ title: 'Products Restored', description: 'Catalog reset to original mock gear.', variant: 'success' });
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const additionalImgs = formData.additionalImages
      .split(',')
      .map(img => img.trim())
      .filter(Boolean);

    const allImages = [formData.image, ...additionalImgs.filter(img => img !== formData.image)];

    const payload: Omit<Product, 'id'> = {
      name: formData.name,
      category: formData.category,
      price: Number(formData.price),
      salePrice: formData.salePrice ? Number(formData.salePrice) : undefined,
      quantityInStock: Number(formData.quantityInStock),
      stockStatus: formData.stockStatus,
      status: formData.status,
      description: formData.description,
      image: formData.image,
      images: allImages
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, payload);
      showToast?.({ title: 'Product Updated', description: `Changes to "${formData.name}" saved.`, variant: 'success' });
    } else {
      addProduct(payload);
      showToast?.({ title: 'Product Added', description: `"${formData.name}" is now available in store.`, variant: 'success' });
    }

    setIsModalOpen(false);
    loadProducts();
  };

  const categories = ['All', ...Array.from(new Set([...DEFAULT_CATEGORIES, ...products.map(p => p.category)]))];

  const filteredProducts = products.filter(p => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 text-[#D4AF37] text-[10px] font-bold uppercase tracking-[0.2em] mb-1">
            <ShoppingBag className="w-4 h-4" />
            <span>Store & Inventory CMS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#E2D2A4]">
            Products & Equipment Manager
          </h2>
          <p className="text-xs text-gray-400 font-light mt-1">
            Create, update prices, manage stock, assign categories, and edit product photo galleries.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleResetDefaults}
            className="px-4 py-2.5 bg-black/40 border border-white/10 text-gray-400 hover:text-white text-xs font-medium uppercase tracking-[0.1em] rounded-sm transition-colors flex items-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="px-5 py-2.5 bg-gradient-to-r from-[#CBA469] to-[#D4AF37] hover:scale-105 text-black text-xs font-bold uppercase tracking-[0.15em] rounded-sm transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.25)]"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Controls & Filter */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs font-medium uppercase tracking-[0.15em] transition-all rounded-full border ${
                selectedCategory === cat
                  ? 'bg-[#D4AF37] text-black border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                  : 'bg-black/40 text-gray-400 border-white/10 hover:border-[#D4AF37]/40 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#140a0b] border border-white/10 focus:border-[#D4AF37] text-white text-xs rounded-sm focus:outline-none placeholder-gray-500"
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-[#140a0b] border border-white/10 rounded-sm overflow-hidden flex flex-col justify-between hover:border-[#D4AF37]/50 transition-all group"
          >
            <div>
              {/* Product Thumbnail */}
              <div className="h-48 w-full bg-[#0a0505] relative overflow-hidden flex items-center justify-center">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 left-2 bg-black/80 border border-white/10 text-[#D4AF37] text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-[2px]">
                  {product.category}
                </div>
                {product.salePrice && (
                  <div className="absolute top-2 right-2 bg-red-600 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-[2px]">
                    Sale
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[9px] font-semibold uppercase px-2 py-0.5 rounded-[2px] ${
                    product.stockStatus === 'In Stock' 
                      ? 'text-green-400 bg-green-950/40 border border-green-800/30' 
                      : 'text-amber-400 bg-amber-950/40 border border-amber-800/30'
                  }`}>
                    {product.stockStatus} ({product.quantityInStock})
                  </span>
                  <span className="text-[10px] text-gray-500">
                    Status: <strong className={product.status === 'Active' ? 'text-green-400' : 'text-gray-500'}>{product.status}</strong>
                  </span>
                </div>

                <h3 className="text-sm font-semibold text-[#E2D2A4] group-hover:text-white transition-colors mb-1 line-clamp-1">
                  {product.name}
                </h3>

                <p className="text-xs text-gray-400 font-light line-clamp-2 mb-3 leading-relaxed">
                  {product.description}
                </p>

                {/* Price Display */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#D4AF37]">
                    AED {product.salePrice || product.price}
                  </span>
                  {product.salePrice && (
                    <span className="text-xs text-gray-500 line-through">
                      AED {product.price}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="px-4 py-3 border-t border-white/5 bg-black/30 flex items-center justify-between">
              <span className="text-[10px] text-gray-500">
                {product.images?.length || 1} image(s)
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(product)}
                  className="p-1.5 text-gray-400 hover:text-[#D4AF37] hover:bg-white/5 rounded-sm transition-colors"
                  title="Edit Product"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(product.id, product.name)}
                  className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-sm transition-colors"
                  title="Delete Product"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Product Modal */}
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
              {editingProduct ? 'Edit Store Product' : 'Add New Product'}
            </h3>
            <p className="text-xs text-gray-400 mb-6 font-light">
              This product will be instantly purchasable on the live store with the Add to Cart system.
            </p>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              {/* Product Name */}
              <div>
                <label className="block text-[#E2D2A4] uppercase tracking-wider mb-1 font-medium">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Predator BK Rush Break Cue"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-black/60 border border-white/15 focus:border-[#D4AF37] text-white rounded-sm focus:outline-none"
                />
              </div>

              {/* Category & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#E2D2A4] uppercase tracking-wider mb-1 font-medium">
                    Category *
                  </label>
                  <input
                    type="text"
                    required
                    list="category-options"
                    placeholder="Accessories, Billiards Cues..."
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-black/60 border border-white/15 focus:border-[#D4AF37] text-white rounded-sm focus:outline-none"
                  />
                  <datalist id="category-options">
                    {DEFAULT_CATEGORIES.map(c => <option key={c} value={c} />)}
                  </datalist>
                </div>

                <div>
                  <label className="block text-[#E2D2A4] uppercase tracking-wider mb-1 font-medium">
                    Store Visibility Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-[#1b0d0e] border border-white/15 focus:border-[#D4AF37] text-white rounded-sm focus:outline-none"
                  >
                    <option value="Active">Active (Visible in Store)</option>
                    <option value="Inactive">Inactive (Hidden)</option>
                  </select>
                </div>
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#E2D2A4] uppercase tracking-wider mb-1 font-medium">
                    Regular Price (AED) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="120"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-black/60 border border-white/15 focus:border-[#D4AF37] text-white rounded-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#E2D2A4] uppercase tracking-wider mb-1 font-medium">
                    Discount / Sale Price (AED Optional)
                  </label>
                  <input
                    type="number"
                    placeholder="Leave blank for regular price"
                    value={formData.salePrice}
                    onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-black/60 border border-white/15 focus:border-[#D4AF37] text-white rounded-sm focus:outline-none"
                  />
                </div>
              </div>

              {/* Stock Management */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#E2D2A4] uppercase tracking-wider mb-1 font-medium">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.quantityInStock}
                    onChange={(e) => setFormData({ ...formData, quantityInStock: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-black/60 border border-white/15 focus:border-[#D4AF37] text-white rounded-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#E2D2A4] uppercase tracking-wider mb-1 font-medium">
                    Stock Status Badge
                  </label>
                  <select
                    value={formData.stockStatus}
                    onChange={(e) => setFormData({ ...formData, stockStatus: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-[#1b0d0e] border border-white/15 focus:border-[#D4AF37] text-white rounded-sm focus:outline-none"
                  >
                    <option value="In Stock">In Stock</option>
                    <option value="Low Stock">Low Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>
              </div>

              {/* Image Inputs */}
              <div>
                <label className="block text-[#E2D2A4] uppercase tracking-wider mb-1 font-medium">
                  Primary Cover Image (URL or /images path) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="/images/products/3-in-1-tip-shaper/01.jpg"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-black/60 border border-white/15 focus:border-[#D4AF37] text-white rounded-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#E2D2A4] uppercase tracking-wider mb-1 font-medium">
                  Additional Gallery Images (Comma separated URLs)
                </label>
                <input
                  type="text"
                  placeholder="/images/products/3-in-1-tip-shaper/02.jpg, /images/products/3-in-1-tip-shaper/03.jpg"
                  value={formData.additionalImages}
                  onChange={(e) => setFormData({ ...formData, additionalImages: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-black/60 border border-white/15 focus:border-[#D4AF37] text-white rounded-sm focus:outline-none"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-[#E2D2A4] uppercase tracking-wider mb-1 font-medium">
                  Product Description *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detailed product specifications, materials, and usage details..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-black/60 border border-white/15 focus:border-[#D4AF37] text-white rounded-sm focus:outline-none resize-none"
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
                  {editingProduct ? 'Save Product' : 'Add to Catalog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
