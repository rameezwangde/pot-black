import { Product, products as initialProducts } from '../data/products';

const STORAGE_KEY = 'pot_black_cms_products';

export const getStoredProducts = (): Product[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialProducts));
      return initialProducts;
    }
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : initialProducts;
  } catch {
    return initialProducts;
  }
};

export const saveProducts = (products: Product[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    window.dispatchEvent(new Event('pot_black_products_updated'));
  } catch (e) {
    console.error('Failed to save products to storage', e);
  }
};

export const addProduct = (item: Omit<Product, 'id'>): Product => {
  const current = getStoredProducts();
  const newProduct: Product = {
    ...item,
    id: `p-${Date.now()}`
  };
  const updated = [newProduct, ...current];
  saveProducts(updated);
  return newProduct;
};

export const updateProduct = (id: string, updatedFields: Partial<Product>): Product | null => {
  const current = getStoredProducts();
  const index = current.findIndex(p => p.id === id);
  if (index === -1) return null;

  const updatedProduct = { ...current[index], ...updatedFields };
  current[index] = updatedProduct;
  saveProducts(current);
  return updatedProduct;
};

export const deleteProduct = (id: string): boolean => {
  const current = getStoredProducts();
  const filtered = current.filter(p => p.id !== id);
  if (filtered.length === current.length) return false;
  saveProducts(filtered);
  return true;
};

export const resetProductsToDefault = (): Product[] => {
  saveProducts(initialProducts);
  return initialProducts;
};
