'use client';

import { useEffect, useState } from 'react';
import { generateVariantSKU } from '@/utils/skuGenerator';
import Head from 'next/head';
import DeleteModal from '@/components/ui/DeleteModal';
import Toast from '@/components/ui/Toast';
import { useToast } from '@/hooks/useToast';

interface AdminProductForm {
  name: string;
  description?: string;
  price: number;
  category: string;
  image?: string;
  stockQty?: number;
  inStock?: boolean;
   status?: 'active' | 'draft';
  trackInventory?: boolean;
  sizes?: string[];
  colors?: string[];
  packs?: string[];
  variantPricing?: Array<{
    size?: string;
    color?: string;
    pack?: string;
    quality?: string; // For elastic category
    quantity?: string; // For elastic category (in rolls)
    price: number;
    stockQty?: number;
    inStock?: boolean;
    sku?: string;
    image?: string;
  }>;
}

interface AdminProductRow {
  _id: string;
  name: string;
  category: string;
  price: number;
  description?: string;
  image?: string;
  inStock?: boolean;
  status?: 'active' | 'draft';
  stockQty?: number;
  sizes?: string[];
  colors?: string[];
  packs?: string[];
  variantPricing?: Array<{
    size?: string;
    color?: string;
    pack?: string;
    quality?: string; // For elastic category
    quantity?: string; // For elastic category (in rolls)
    price: number;
    stockQty?: number;
    inStock?: boolean;
    sku?: string;
    image?: string;
  }>;
  createdAt?: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<AdminProductForm>({ 
    name: '', 
    price: 0, 
    category: 'buttons', 
    description: '', 
    image: '', 
    stockQty: 0,
    inStock: true,
    status: 'active',
    trackInventory: true,
    sizes: [], 
    colors: [], 
    packs: [] 
  });
  const [editingProduct, setEditingProduct] = useState<AdminProductRow | null>(null);
  const [editForm, setEditForm] = useState<AdminProductForm>({ 
    name: '', 
    price: 0, 
    category: 'buttons', 
    description: '', 
    image: '', 
    stockQty: 0,
    inStock: true,
    status: 'active',
    trackInventory: true,
    sizes: [], 
    colors: [], 
    packs: [] 
  });
  const [variantPricing, setVariantPricing] = useState<Array<{
    size?: string;
    color?: string;
    pack?: string;
    quality?: string;
    quantity?: string;
    price: number;
    stockQty?: number;
    inStock?: boolean;
    sku?: string;
    image?: string;
  }>>([]);
  
  // Stock management states
  const [showStockManagement, setShowStockManagement] = useState(false);
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'out'>('all');
  const [bulkStockUpdate, setBulkStockUpdate] = useState<Record<string, number>>({});
  
  // Delete modal states
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    productId: string | null;
    productName: string | null;
    isBulk: boolean;
    count: number;
  }>({
    isOpen: false,
    productId: null,
    productName: null,
    isBulk: false,
    count: 0
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingVariantImage, setIsUploadingVariantImage] = useState(false);
  const [showVariantSection, setShowVariantSection] = useState(false);
  
  // Single product variant fields (for simple products without multiple variants)
  const [singleProductVariant, setSingleProductVariant] = useState({
    size: '',
    color: '',
    pack: '',
    quality: '', // For elastic category
    quantity: '', // For elastic category (in rolls)
  });
  
  // New variant dropdown states (for variant management section)
  const [newVariant, setNewVariant] = useState({
    size: '',
    color: '',
    pack: '',
    quality: '', // For elastic category
    quantity: '', // For elastic category (in rolls)
    price: 0,
    stockQty: 0,
    sku: '',
    image: ''
  });
  const { toast, hideToast, showError, showSuccess, showWarning, showInfo } = useToast();

  // Helper function to calculate inStock status based on actual stock
  const calculateInStock = (product: AdminProductRow): boolean => {
    // If product has variants, check if any variant has stock
    if (product.variantPricing && product.variantPricing.length > 0) {
      return product.variantPricing.some(v => (v.stockQty ?? 0) > 0 || v.inStock === true);
    }
    // Otherwise, check product-level stock
    return (product.stockQty ?? 0) > 0;
  };

  const load = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/products');
    const data = await res.json();
    // Recalculate inStock for all products based on actual stock
    const productsWithCorrectStock = (data.products || []).map((product: AdminProductRow) => ({
      ...product,
      inStock: calculateInStock(product),
      status: (product.status as 'active' | 'draft') || 'active',
    }));
    setProducts(productsWithCorrectStock);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const createProduct = async () => {
    // Basic validation before sending to API
    const basePrice =
      variantPricing.length > 0 ? Number(variantPricing[0].price || 0) : Number(form.price);

    if (!form.name.trim()) {
      showWarning('Please enter a product name');
      return;
    }
    if (!form.category) {
      showWarning('Please select a category');
      return;
    }
    if (basePrice <= 0) {
      showWarning('Please enter a valid price (or at least one variant with price)');
      return;
    }

    // If no variants added, create a single variant from singleProductVariant
    let finalVariantPricing = variantPricing;
    if (variantPricing.length === 0) {
      // Create a single variant from singleProductVariant fields
      if (form.category === 'elastic') {
        if (singleProductVariant.size || singleProductVariant.quality || singleProductVariant.color || singleProductVariant.quantity) {
          finalVariantPricing = [{
            size: singleProductVariant.size || undefined,
            quality: singleProductVariant.quality || undefined,
            color: singleProductVariant.color || undefined,
            quantity: singleProductVariant.quantity || undefined,
            price: basePrice,
            stockQty: Number(form.stockQty || 0),
            inStock: Number(form.stockQty || 0) > 0,
            sku: generateVariantSKU('new', singleProductVariant.size || '', singleProductVariant.quality || '', singleProductVariant.quantity || ''),
          }];
        }
      } else if (form.category === 'zipper') {
        if (singleProductVariant.size || singleProductVariant.quantity) {
          finalVariantPricing = [{
            size: singleProductVariant.size || undefined,
            color: singleProductVariant.color || undefined,
            quantity: singleProductVariant.quantity || undefined,
            price: basePrice,
            stockQty: Number(form.stockQty || 0),
            inStock: Number(form.stockQty || 0) > 0,
            sku: generateVariantSKU('new', singleProductVariant.size || '', singleProductVariant.color || '', singleProductVariant.quantity || ''),
          }];
        }
      } else {
        if (singleProductVariant.size || singleProductVariant.pack) {
          finalVariantPricing = [{
            size: singleProductVariant.size || undefined,
            color: singleProductVariant.color || undefined,
            pack: singleProductVariant.pack || undefined,
            price: basePrice,
            stockQty: Number(form.stockQty || 0),
            inStock: Number(form.stockQty || 0) > 0,
            sku: generateVariantSKU('new', singleProductVariant.size || '', singleProductVariant.color || '', singleProductVariant.pack || ''),
          }];
        }
      }
    }

    const payload = {
      name: form.name.trim(),
      description: form.description?.trim() || '',
      // If variants exist, ignore default/base price field and use first variant price
      price: basePrice,
      category: form.category,
      image: form.image?.trim() || '',
      stockQty: Number(form.stockQty || 0),
      variantPricing: finalVariantPricing.length > 0 ? finalVariantPricing : undefined,
      status: form.status || 'active',
      inStock: form.inStock,
      trackInventory: form.trackInventory ?? true,
    };

    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let message = 'Failed to create product';
        try {
          const data = await res.json();
          if (data?.error) message = data.error;
        } catch {
          // ignore JSON parse errors
        }
        showError(message);
        return;
      }

      // Success
      showSuccess('Product created successfully');
      setForm({
        name: '',
        price: 0,
        category: 'buttons',
        description: '',
        image: '',
        stockQty: 0,
        inStock: true,
        status: 'active',
        trackInventory: true,
        sizes: [],
        colors: [],
        packs: [],
      });
      setVariantPricing([]);
      setNewVariant({
        size: '',
        color: '',
        pack: '',
        quality: '',
        quantity: '',
        price: 0,
        stockQty: 0,
        sku: '',
        image: '',
      });
      setSingleProductVariant({
        size: '',
        color: '',
        pack: '',
        quality: '',
        quantity: '',
      });
      setShowVariantSection(false);
      load();
    } catch (error) {
      console.error('Create product error:', error);
      showError('Something went wrong while creating the product');
    }
  };

  const handleDeleteClick = (id: string, name: string) => {
    setDeleteModal({
      isOpen: true,
      productId: id,
      productName: name,
      isBulk: false,
      count: 1
    });
  };

  const handleBulkDeleteClick = () => {
    if (selectedProducts.length === 0) return;
    setDeleteModal({
      isOpen: true,
      productId: null,
      productName: null,
      isBulk: true,
      count: selectedProducts.length
    });
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      if (deleteModal.isBulk && selectedProducts.length > 0) {
        const res = await fetch('/api/admin/products/bulk-delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids: selectedProducts })
        });
        if (res.ok) {
          setSelectedProducts([]);
          load();
        }
      } else if (deleteModal.productId) {
        const res = await fetch(`/api/admin/products/${deleteModal.productId}`, { method: 'DELETE' });
        if (res.ok) load();
      }
      setDeleteModal({ isOpen: false, productId: null, productName: null, isBulk: false, count: 0 });
    } catch (error) {
      console.error('Delete error:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSelectProduct = (productId: string, checked: boolean) => {
    if (checked) {
      setSelectedProducts([...selectedProducts, productId]);
    } else {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(products.map(p => p._id));
    } else {
      setSelectedProducts([]);
    }
  };

  const startEdit = (product: AdminProductRow) => {
    setEditingProduct(product);
    setEditForm({
      name: product.name,
      description: product.description || '',
      price: product.price,
      category: product.category,
      image: product.image || '',
      stockQty: product.stockQty || 0,
      inStock: product.inStock,
      status: (product.status as 'active' | 'draft') || 'active',
      sizes: product.sizes || [],
      colors: product.colors || [],
      packs: product.packs || []
    });
    setVariantPricing(product.variantPricing || []);
    setNewVariant({ size: '', color: '', pack: '', quality: '', quantity: '', price: 0, stockQty: 0, sku: '', image: '' });
  };

  const updateProduct = async () => {
    if (!editingProduct) return;
    
    const basePrice =
      variantPricing.length > 0 ? Number(variantPricing[0].price || 0) : Number(editForm.price);

    const payload = {
      name: editForm.name,
      description: editForm.description,
      // If variants exist, ignore default/base price field and use first variant price
      price: basePrice,
      category: editForm.category,
      image: editForm.image?.trim() || '',
       stockQty: Number(editForm.stockQty || 0),
      variantPricing: variantPricing.length > 0 ? variantPricing : undefined,
      status: editForm.status || 'active',
      inStock: editForm.inStock,
    };
    
    const res = await fetch(`/api/admin/products/${editingProduct._id}`, { 
      method: 'PUT', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify(payload) 
    });
    
    if (res.ok) {
      setEditingProduct(null);
      setEditForm({ 
        name: '', 
        price: 0, 
        category: 'buttons', 
        description: '', 
        image: '', 
        stockQty: 0,
        inStock: true,
        status: 'active',
        sizes: [], 
        colors: [], 
        packs: [] 
      });
      setVariantPricing([]);
      setNewVariant({ size: '', color: '', pack: '', quality: '', quantity: '', price: 0, stockQty: 0, sku: '', image: '' });
      load(); // This will recalculate inStock for all products
    }
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    setEditForm({ 
      name: '', 
      price: 0, 
      category: 'buttons', 
      description: '', 
      image: '', 
      stockQty: 0,
      sizes: [], 
      colors: [], 
      packs: [] 
    });
    setVariantPricing([]);
    setNewVariant({ size: '', color: '', pack: '', quality: '', quantity: '', price: 0, stockQty: 0, sku: '', image: '' });
  };
  const handleImageRemove = () => {
    setForm({ ...form, image: '' });
  };

  // New variant dropdown functions
  const addVariantCombination = () => {
    const activeCategory = editingProduct ? editForm.category : form.category;
    const basePrice = editingProduct ? editForm.price : form.price;
    const isElastic = activeCategory === 'elastic';
    const isZipper = activeCategory === 'zipper';
    const priceToUse = newVariant.price > 0 ? newVariant.price : Number(basePrice || 0);
    
    if (isElastic) {
      // For elastic: size, quality, color, quantity (meter roll)
      if (!newVariant.size || !newVariant.quality || !newVariant.color || !newVariant.quantity) {
        showWarning('Please fill size, quality, color, and quantity (meter roll)');
        return;
      }
      if (priceToUse <= 0) {
        showWarning('Please set a valid price');
        return;
      }
      
      const combination = {
        size: newVariant.size,
        quality: newVariant.quality,
        color: newVariant.color,
        quantity: newVariant.quantity,
        price: priceToUse,
        stockQty: Number(newVariant.stockQty || 0),
        inStock: Number(newVariant.stockQty || 0) > 0,
        sku: generateVariantSKU(editingProduct?._id || 'new', newVariant.size, newVariant.quality || '', newVariant.quantity || ''),
        image: newVariant.image?.trim() || undefined
      };
      
      setVariantPricing([...variantPricing, combination]);
      // Reset to empty values (no prefill)
      setNewVariant({ 
        size: '', 
        color: '', 
        pack: '', 
        quality: '', 
        quantity: '', 
        price: 0, 
        stockQty: 0, 
        sku: '', 
        image: '' 
      });
      return;
    }
    
    if (isZipper) {
      // For zipper: size, color, quantity
      if (!newVariant.size || !newVariant.quantity) {
        showWarning('Please fill size and quantity');
        return;
      }
      if (priceToUse <= 0) {
        showWarning('Please set a valid price');
        return;
      }
      
      const combination = {
        size: newVariant.size,
        color: newVariant.color || undefined,
        quantity: newVariant.quantity,
        price: priceToUse,
        stockQty: Number(newVariant.stockQty || 0),
        inStock: Number(newVariant.stockQty || 0) > 0,
        sku: generateVariantSKU(editingProduct?._id || 'new', newVariant.size, newVariant.color || '', newVariant.quantity || ''),
        image: newVariant.image?.trim() || undefined
      };
      
      // Check if combination already exists
      const exists = variantPricing.some(v => 
        v.size === combination.size && 
        (v.color || '') === (combination.color || '') && 
        (v as any).quantity === combination.quantity
      );

      if (exists) {
        showInfo('This combination already exists');
        return;
      }
      
      setVariantPricing([...variantPricing, combination]);
      setNewVariant({ size: '', color: '', pack: '', quality: '', quantity: '', price: 0, stockQty: 0, sku: '', image: '' });
      showSuccess('Variant added successfully');
      return;
    }
    
    // For other categories: size, color, pack
    if (!newVariant.size || !newVariant.pack) {
      showWarning('Please fill option and value');
      return;
    }
    if (priceToUse <= 0) {
      showWarning('Please set a valid price');
      return;
    }

    const combination = {
      size: newVariant.size,
      color: newVariant.color || undefined,
      pack: newVariant.pack,
      price: priceToUse,
      stockQty: Number(newVariant.stockQty || 0),
      inStock: Number(newVariant.stockQty || 0) > 0,
      sku: generateVariantSKU(editingProduct?._id || 'new', newVariant.size, newVariant.color || '', newVariant.pack),
      image: newVariant.image?.trim() || undefined
    };

    const exists = variantPricing.some(v => 
      v.size === combination.size && 
      (v.color || '') === (combination.color || '') && 
      v.pack === combination.pack
    );

    if (exists) {
      showInfo('This combination already exists');
      return;
    }

    setVariantPricing([...variantPricing, combination]);
    showSuccess('Variant added successfully');
    setNewVariant({ size: '', color: '', pack: '', quality: '', quantity: '', price: 0, stockQty: 0, sku: '', image: '' });
  };

  const removeVariantCombination = (index: number) => {
    setVariantPricing(variantPricing.filter((_, i) => i !== index));
  };

  // Stock management functions
  const updateProductStock = async (productId: string, newStock: number) => {
    try {
      const product = products.find(p => p._id === productId);
      // Recalculate inStock based on variants or simple stock
      const hasVariants = product?.variantPricing && product.variantPricing.length > 0;
      const calculatedInStock = hasVariants && product?.variantPricing
        ? product.variantPricing.some(v => (v.stockQty ?? 0) > 0 || v.inStock === true)
        : newStock > 0;

      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stockQty: newStock, inStock: calculatedInStock })
      });
      
      if (response.ok) {
        const updatedProducts = products.map(p => {
          if (p._id === productId) {
            const updated = { ...p, stockQty: newStock };
            // Recalculate inStock for the updated product
            updated.inStock = calculateInStock(updated);
            return updated;
          }
          return p;
        });
        setProducts(updatedProducts);
        showSuccess('Stock updated successfully');
      } else {
        showError('Failed to update stock');
      }
    } catch (error) {
      console.error('Error updating stock:', error);
      showError('Error updating stock');
    }
  };

  // Function to fix all products' stock status
  const fixAllProductStockStatus = async () => {
    try {
      const response = await fetch('/api/admin/products/fix-stock-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        showSuccess('All product stock statuses have been fixed');
        load(); // Reload products
      } else {
        showError('Failed to fix stock statuses');
      }
    } catch (error) {
      console.error('Error fixing stock statuses:', error);
      showError('Error fixing stock statuses');
    }
  };

  const handleBulkStockUpdate = async () => {
    try {
      const updates = Object.entries(bulkStockUpdate).map(([productId, stock]) => ({
        productId,
        stockQty: stock,
        inStock: stock > 0
      }));

      const response = await fetch('/api/admin/products/bulk-stock', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates })
      });

      if (response.ok) {
        showSuccess('Bulk stock update completed');
        setBulkStockUpdate({});
        load();
      } else {
        showError('Failed to update stock');
      }
    } catch (error) {
      console.error('Error updating stock:', error);
      showError('Error updating stock');
    }
  };

  const filteredProducts = products.filter(product => {
    switch (stockFilter) {
      case 'low':
        return (product.stockQty || 0) < 10 && (product.stockQty || 0) > 0;
      case 'out':
        return (product.stockQty || 0) === 0;
      default:
        return true;
    }
  });

  const migrateStockFields = async () => {
    if (!confirm('This will add default stock values to all products without stock fields. Continue?')) return;
    
    try {
      const res = await fetch('/api/admin/migrate-stock', { method: 'POST' });
      const data = await res.json();
      
      if (data.success) {
        showSuccess(data.message || 'Stock migration completed');
        load(); // Refresh the product list
      } else {
        showError(`Migration failed: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Migration error:', error);
      showError('Migration failed');
    }
  };

  return (
    <>
      <Head>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="googlebot" content="noindex, nofollow" />
        <title>Product Management - Admin Panel</title>
      </Head>
      <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Products</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowStockManagement(!showStockManagement)}
            className={`px-4 py-2 rounded text-sm ${
              showStockManagement 
                ? 'bg-primary-500 text-white' 
                : 'bg-gray-600 text-white hover:bg-gray-700'
            }`}
          >
            {showStockManagement ? 'Hide Stock Management' : 'Stock Management'}
          </button>
          <button
            onClick={migrateStockFields}
            className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 text-sm"
          >
            Migrate Stock Fields
          </button>
        </div>
      </div>

      {/* Shopify-style Create Product Form */}
      <div className="bg-white border rounded-lg mb-8">
        <div className="border-b px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Add product</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
          {/* Left Column - Main Content (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Short sleeve t-shirt"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={6}
                placeholder="Enter product description..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              />
            </div>

            {/* Media Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Media</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 space-y-4">
                {form.image ? (
                  <div className="space-y-4">
                    <div className="relative inline-block">
                      <img
                        src={form.image}
                        alt="Product preview"
                        className="w-32 h-32 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={handleImageRemove}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-gray-500">No image selected</p>
                )}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Upload image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setIsUploadingImage(true);
                      try {
                        const formData = new FormData();
                        formData.append('image', file);
                        const res = await fetch('/api/admin/upload-image', {
                          method: 'POST',
                          body: formData,
                        });
                        const data = await res.json();
                        if (res.ok && data?.imageUrl) {
                          setForm((prev) => ({ ...prev, image: data.imageUrl }));
                          showSuccess('Image uploaded successfully');
                        } else {
                          showError(data?.error || 'Failed to upload image');
                        }
                      } catch (error) {
                        console.error('Image upload error:', error);
                        showError('Something went wrong while uploading the image');
                      } finally {
                        setIsUploadingImage(false);
                        // reset file input so the same file can be re-selected if needed
                        e.target.value = '';
                      }
                    }}
                    className="w-full text-sm text-gray-700"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Max 5MB. JPG, PNG, or WEBP recommended.
                  </p>
                  {isUploadingImage && (
                    <p className="text-xs text-primary-600 mt-1">Uploading image...</p>
                  )}
                </div>
              </div>
            </div>
            {/* Single Product Variant Fields - Always Visible */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Product Details</h3>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                {form.category === 'elastic' ? (
                  /* Elastic Category: Size / Quality / Color / Quantity (meter rolls) */
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
                      <input
                        type="text"
                        value={singleProductVariant.size}
                        onChange={(e) => setSingleProductVariant({ ...singleProductVariant, size: e.target.value })}
                        placeholder="e.g., 10mm (16L), 12mm (20L)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Quality</label>
                      <select
                        value={singleProductVariant.quality}
                        onChange={(e) => setSingleProductVariant({ ...singleProductVariant, quality: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Quality</option>
                        <option value="Woven">Woven</option>
                        <option value="Knitted">Knitted</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                      <select
                        value={singleProductVariant.color}
                        onChange={(e) => setSingleProductVariant({ ...singleProductVariant, color: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Color</option>
                        <option value="Black">Black</option>
                        <option value="White">White</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Quantity (meter roll)</label>
                      <select
                        value={singleProductVariant.quantity}
                        onChange={(e) => setSingleProductVariant({ ...singleProductVariant, quantity: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Roll Size</option>
                        <option value="25 mtr roll">25 mtr roll</option>
                        <option value="30 mtr roll">30 mtr roll</option>
                      </select>
                    </div>
                  </div>
                ) : form.category === 'zipper' ? (
                  /* Zipper Category: Size / Color / Quantity */
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
                      <input
                        type="text"
                        value={singleProductVariant.size}
                        onChange={(e) => setSingleProductVariant({ ...singleProductVariant, size: e.target.value })}
                        placeholder="e.g., 5 inch, 7 inch, 9 inch"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                      <input
                        type="text"
                        value={singleProductVariant.color}
                        onChange={(e) => setSingleProductVariant({ ...singleProductVariant, color: e.target.value })}
                        placeholder="Enter color"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                      <input
                        type="text"
                        value={singleProductVariant.quantity}
                        onChange={(e) => setSingleProductVariant({ ...singleProductVariant, quantity: e.target.value })}
                        placeholder="e.g., 1, 5, 10"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                ) : (
                  /* Other Categories: Option / Value */
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Option</label>
                      <input
                        type="text"
                        value={singleProductVariant.size}
                        onChange={(e) => setSingleProductVariant({ ...singleProductVariant, size: e.target.value })}
                        placeholder="e.g., 16L, 18L"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                      <input
                        type="text"
                        value={singleProductVariant.pack}
                        onChange={(e) => setSingleProductVariant({ ...singleProductVariant, pack: e.target.value })}
                        placeholder="e.g., 72, 144"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">Add one value (like Shopify)</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Variant Management Section - Collapsible */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-900">Variants</h3>
                <button
                  type="button"
                  onClick={() => setShowVariantSection(!showVariantSection)}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  {showVariantSection ? 'Hide Variant Options' : 'Add Multiple Variants'}
                </button>
              </div>
          
          {showVariantSection && (
          <>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-800 mb-4">Add Variant Combination</h4>
            <div className="space-y-4">
              {/* Conditional Fields Based on Category */}
              {form.category === 'elastic' ? (
                /* Elastic Category: Size / Quality / Color / Quantity (meter rolls) */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Size <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={newVariant.size}
                      onChange={(e) => setNewVariant({ ...newVariant, size: e.target.value })}
                      placeholder="e.g., 10mm (16L), 12mm (20L)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Enter custom size</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quality <span className="text-red-500">*</span></label>
                    <select
                      value={newVariant.quality}
                      onChange={(e) => setNewVariant({ ...newVariant, quality: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Quality</option>
                      <option value="Woven">Woven</option>
                      <option value="Knitted">Knitted</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Color <span className="text-red-500">*</span></label>
                    <select
                      value={newVariant.color}
                      onChange={(e) => setNewVariant({ ...newVariant, color: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Color</option>
                      <option value="Black">Black</option>
                      <option value="White">White</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity (meter roll) <span className="text-red-500">*</span></label>
                    <select
                      value={newVariant.quantity}
                      onChange={(e) => setNewVariant({ ...newVariant, quantity: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Roll Size</option>
                      <option value="25 mtr roll">25 mtr roll</option>
                      <option value="30 mtr roll">30 mtr roll</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Select meter roll size</p>
                  </div>
                </div>
              ) : form.category === 'zipper' ? (
                /* Zipper Category: Size / Color / Quantity */
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Size <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={newVariant.size}
                      onChange={(e) => setNewVariant({ ...newVariant, size: e.target.value })}
                      placeholder="e.g., 5 inch, 7 inch, 9 inch"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Enter zipper size</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Color <span className="text-gray-400 text-xs">(Optional)</span></label>
                    <input
                      type="text"
                      value={newVariant.color}
                      onChange={(e) => setNewVariant({ ...newVariant, color: e.target.value })}
                      placeholder="Enter color"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={newVariant.quantity}
                      onChange={(e) => setNewVariant({ ...newVariant, quantity: e.target.value })}
                      placeholder="e.g., 1, 5, 10"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Enter quantity</p>
                  </div>
                </div>
              ) : (
                /* Other Categories: Option / Value */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Option</label>
                    <input
                      type="text"
                      value={newVariant.size}
                      onChange={(e) => setNewVariant({ ...newVariant, size: e.target.value })}
                      placeholder="e.g., 16L, 18L"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Value <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={newVariant.pack}
                      onChange={(e) => setNewVariant({ ...newVariant, pack: e.target.value })}
                      placeholder="e.g., 72, 144"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Add one value (like Shopify)</p>
                  </div>
                </div>
              )}

              {/* Row 2: Price / Stock / Add button */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    value={newVariant.price}
                    onChange={(e) => setNewVariant({ ...newVariant, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                    min="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                  <input
                    type="number"
                    value={newVariant.stockQty}
                    onChange={(e) => setNewVariant({ ...newVariant, stockQty: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                    min="0"
                  />
                </div>
                
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={addVariantCombination}
                    className="w-full bg-primary-500 text-white px-4 py-2 rounded-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
                  >
                    Add Variant
                  </button>
                </div>
              </div>

              {/* Variant Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Variant Image <span className="text-gray-400 text-xs">(Optional)</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setIsUploadingVariantImage(true);
                    try {
                      const formData = new FormData();
                      formData.append('image', file);
                      const res = await fetch('/api/admin/upload-image', {
                        method: 'POST',
                        body: formData,
                      });
                      const data = await res.json();
                      if (res.ok && data?.imageUrl) {
                        setNewVariant((prev) => ({ ...prev, image: data.imageUrl }));
                        showSuccess('Variant image uploaded');
                      } else {
                        showError(data?.error || 'Failed to upload variant image');
                      }
                    } catch (error) {
                      console.error('Variant image upload error:', error);
                      showError('Something went wrong while uploading the variant image');
                    } finally {
                      setIsUploadingVariantImage(false);
                      e.target.value = '';
                    }
                  }}
                  className="w-full text-sm text-gray-700"
                />
                <p className="text-xs text-gray-500 mt-1">Leave empty to use product image</p>
                {isUploadingVariantImage && (
                  <p className="text-xs text-primary-600 mt-1">Uploading variant image...</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4 mt-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                {variantPricing.length}
              </span>
              Variant{variantPricing.length !== 1 ? 's' : ''}
            </h4>
            {variantPricing.length > 0 ? (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {variantPricing.map((variant, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-md border border-gray-200 hover:bg-gray-100 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 flex items-start space-x-4 flex-wrap gap-2">
                        {/* Variant Image Preview */}
                        {variant.image && (
                          <div className="relative">
                            <img
                              src={variant.image}
                              alt={`${variant.size} ${variant.color || ''} ${variant.pack}`}
                              className="w-16 h-16 object-cover rounded border"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                        
                        <div className="flex flex-col space-y-2 flex-1">
                          <div className="flex items-center space-x-2 flex-wrap gap-2">
                            <span className="text-sm font-semibold text-gray-800">{variant.size}</span>
                            {form.category === 'elastic' ? (
                              <>
                                {variant.quality && (
                                  <span className="text-sm text-gray-600 bg-white px-2 py-1 rounded border">
                                    Quality: {variant.quality}
                                  </span>
                                )}
                                {variant.color && (
                                  <span className="text-sm text-gray-600 bg-white px-2 py-1 rounded border">
                                    Color: {variant.color}
                                  </span>
                                )}
                                {variant.quantity && (
                                  <span className="text-sm text-gray-600 bg-white px-2 py-1 rounded border">
                                    {variant.quantity}
                                  </span>
                                )}
                              </>
                            ) : form.category === 'zipper' ? (
                              <>
                                {variant.color && (
                                  <span className="text-sm text-gray-600 bg-white px-2 py-1 rounded border">
                                    {variant.color}
                                  </span>
                                )}
                                {(variant as any).quantity && (
                                  <span className="text-sm text-gray-600 bg-white px-2 py-1 rounded border">
                                    Qty: {(variant as any).quantity}
                                  </span>
                                )}
                              </>
                            ) : (
                              <>
                                {variant.size && (
                                  <span className="text-sm text-gray-600 bg-white px-2 py-1 rounded border">
                                    Option: {variant.size}
                                  </span>
                                )}
                                {variant.pack && (
                                  <span className="text-sm text-gray-600 bg-white px-2 py-1 rounded border">
                                    Value: {variant.pack}
                                  </span>
                                )}
                              </>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-4 flex-wrap gap-2">
                            <div className="flex items-center space-x-2">
                              <label className="text-xs text-gray-500 font-medium">Price:</label>
                              <div className="flex items-center">
                                <span className="text-xs text-gray-500 mr-1">₹</span>
                                <input
                                  type="number"
                                  value={variant.price || 0}
                                  onChange={(e) => {
                                    const newVariants = [...variantPricing];
                                    newVariants[index] = { ...variant, price: Number(e.target.value) };
                                    setVariantPricing(newVariants);
                                  }}
                                  className="w-20 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                  min="0"
                                  step="0.01"
                                />
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <label className="text-xs text-gray-500 font-medium">Stock:</label>
                              <input
                                type="number"
                                value={variant.stockQty || 0}
                                onChange={(e) => {
                                  const newVariants = [...variantPricing];
                                  newVariants[index] = { ...variant, stockQty: Number(e.target.value), inStock: Number(e.target.value) > 0 };
                                  setVariantPricing(newVariants);
                                }}
                                className="w-16 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                min="0"
                              />
                              <span className={`text-xs px-2 py-1 rounded-full font-medium ${variant.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {variant.inStock ? 'In Stock' : 'Out of Stock'}
                              </span>
                            </div>
                          </div>
                          
                          {/* Variant Image Upload */}
                          <div className="flex items-center space-x-2">
                            <label className="text-xs text-gray-500 font-medium whitespace-nowrap">Variant Image:</label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                setIsUploadingVariantImage(true);
                                try {
                                  const formData = new FormData();
                                  formData.append('image', file);
                                  const res = await fetch('/api/admin/upload-image', {
                                    method: 'POST',
                                    body: formData,
                                  });
                                  const data = await res.json();
                                  if (res.ok && data?.imageUrl) {
                                    const newVariants = [...variantPricing];
                                    newVariants[index] = { ...variant, image: data.imageUrl };
                                    setVariantPricing(newVariants);
                                    showSuccess('Variant image uploaded');
                                  } else {
                                    showError(data?.error || 'Failed to upload variant image');
                                  }
                                } catch (error) {
                                  console.error('Variant image upload error:', error);
                                  showError('Something went wrong while uploading the variant image');
                                } finally {
                                  setIsUploadingVariantImage(false);
                                  e.target.value = '';
                                }
                              }}
                              className="flex-1 text-xs text-gray-700"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => removeVariantCombination(index)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium px-3 py-1 hover:bg-red-50 rounded transition-colors whitespace-nowrap"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-400 text-sm">
                <p>No variants added yet. Add your first variant above.</p>
              </div>
            )}
            </div>
          </>
          )}
          </div>
          </div>

          {/* Right Column - Sidebar (1/3 width) */}
          <div className="lg:col-span-1 space-y-4">
            {/* Category Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="buttons">Buttons</option>
                <option value="zippers">Zippers</option>
                <option value="elastic">Elastic</option>
                <option value="cords">Cords</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">Determines product category and organization</p>
            </div>

            {/* Price Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">₹</span>
                <input
                  type="number"
                  value={form.price || ''}
                  onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  disabled={variantPricing.length > 0}
                  className={`w-full pl-8 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    variantPricing.length > 0
                      ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
              </div>
              {variantPricing.length > 0 && (
                <p className="mt-2 text-xs text-gray-500">
                  Product has variants. Base price is taken from the first variant and this field is ignored.
                </p>
              )}
            </div>

            {/* Inventory Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">Inventory</label>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, trackInventory: !(form.trackInventory ?? true) })}
                  className="relative inline-flex items-center cursor-pointer"
                >
                  <span
                    className={`w-11 h-6 rounded-full transition-colors ${form.trackInventory ?? true ? 'bg-purple-600' : 'bg-gray-300'}`}
                  >
                    <span
                      className={`absolute top-[2px] left-[2px] h-5 w-5 rounded-full bg-white border border-gray-300 transition-transform ${
                        form.trackInventory ?? true ? 'translate-x-5' : ''
                      }`}
                    />
                  </span>
                  <span className="ml-3 text-sm text-gray-700">Inventory tracked</span>
                </button>
              </div>
              
              {variantPricing.length === 0 ? (
                <div className="mt-3">
                  <label className="block text-xs text-gray-600 mb-1">Quantity</label>
                  <input
                    type="number"
                    value={form.stockQty || 0}
                    onChange={(e) => setForm({ ...form, stockQty: Number(e.target.value) })}
                    disabled={!(form.trackInventory ?? true)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                      form.trackInventory ?? true
                        ? 'border-gray-300 focus:ring-blue-500'
                        : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                    min="0"
                  />
                </div>
              ) : (
                <p className="text-xs text-gray-500 mt-2">
                  Inventory is tracked per variant. Manage stock in the Variants section.
                </p>
              )}
            </div>

            {/* Action Button */}
            <div className="pt-4">
              <button
                onClick={createProduct}
                className="w-full bg-primary-500 text-white px-4 py-2 rounded-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium transition-all duration-200"
              >
                Create Product
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stock Management Section */}
      {showStockManagement && (
        <div className="border rounded p-6 mb-8 bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">Stock Management</h2>
          
          {/* Stock Filters */}
          <div className="mb-4">
            <div className="flex space-x-4 mb-4">
              <button
                onClick={() => setStockFilter('all')}
                className={`px-4 py-2 rounded ${
                  stockFilter === 'all' ? 'bg-primary-500 text-white' : 'bg-white border'
                }`}
              >
                All Products
              </button>
              <button
                onClick={() => setStockFilter('low')}
                className={`px-4 py-2 rounded ${
                  stockFilter === 'low' ? 'bg-yellow-600 text-white' : 'bg-white border'
                }`}
              >
                Low Stock (&lt;10)
              </button>
              <button
                onClick={() => setStockFilter('out')}
                className={`px-4 py-2 rounded ${
                  stockFilter === 'out' ? 'bg-red-600 text-white' : 'bg-white border'
                }`}
              >
                Out of Stock
              </button>
            </div>
            <div className="mb-4">
              <button
                onClick={fixAllProductStockStatus}
                className="px-4 py-2 bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Fix All Stock Statuses
              </button>
              <p className="text-xs text-gray-500 mt-2">
                This will recalculate and fix the &quot;In Stock&quot; status for all products based on their actual stock quantities (including variants).
              </p>
            </div>
          </div>

          {/* Bulk Stock Update */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Bulk Stock Update</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map(product => (
                <div key={product._id} className="bg-white p-3 rounded border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium truncate">{product.name}</span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      (product.stockQty || 0) > 10 ? 'bg-green-100 text-green-800' :
                      (product.stockQty || 0) > 0 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {product.stockQty || 0} in stock
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min="0"
                      value={bulkStockUpdate[product._id] || product.stockQty || 0}
                      onChange={(e) => setBulkStockUpdate({
                        ...bulkStockUpdate,
                        [product._id]: Number(e.target.value)
                      })}
                      className="flex-1 px-2 py-1 text-sm border rounded"
                      placeholder="Stock Qty"
                    />
                    <button
                      onClick={() => updateProductStock(product._id, bulkStockUpdate[product._id] || product.stockQty || 0)}
                      className="px-2 py-1 bg-primary-500 text-white text-xs rounded hover:bg-primary-600 transition-all duration-200"
                    >
                      Update
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {Object.keys(bulkStockUpdate).length > 0 && (
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleBulkStockUpdate}
                  className="px-4 py-2 bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Update All Selected ({Object.keys(bulkStockUpdate).length} products)
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Loading products...</span>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">No products found</div>
          <div className="text-sm text-gray-600 mb-4">
            You can either create a new product above or seed the database with static products.
          </div>
          <a 
            href="/admin/seed-products" 
            className="inline-block bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Seed Products
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedProducts.length === products.length && products.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <h2 className="text-lg font-semibold">All Products ({products.length})</h2>
              </div>
              {selectedProducts.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    {selectedProducts.length} selected
                  </span>
                  <button
                    onClick={handleBulkDeleteClick}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                  >
                    Delete Selected
                  </button>
                </div>
              )}
            </div>
            <button 
              onClick={load}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
            >
              Refresh
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map(product => (
              <div
                key={product._id}
                className="bg-white border rounded-lg p-4 shadow-sm relative"
              >
                {/* Checkbox for selection */}
                <div className="absolute top-2 left-2 z-10">
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product._id)}
                    onChange={(e) => handleSelectProduct(product._id, e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-start space-x-4 mb-3">
                  {/* Product Image */}
                  {product.image && (
                    <div className="flex-shrink-0">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-lg border"
                      />
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 line-clamp-2">{product.name}</h3>
                        <p className="text-sm text-gray-600 capitalize">{product.category}</p>
                      </div>
                      <div className="text-right space-y-1">
                        <div className="text-lg font-bold text-green-600">₹{product.price}</div>
                        <div
                          className={`inline-block text-xs px-2 py-1 rounded-full ${
                            product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {product.inStock ? 'In Stock' : 'Out of Stock'}
                        </div>
                        <div
                          className={`inline-block text-[11px] px-2 py-0.5 rounded-full font-medium border ${
                            product.status === 'draft'
                              ? 'bg-gray-100 text-gray-700 border-gray-300'
                              : 'bg-accent-50 text-accent-700 border-accent-200'
                          }`}
                        >
                          {product.status === 'draft' ? 'Draft' : 'Active'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {product.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                )}
                
                <div className="space-y-2 mb-3">
                         {product.variantPricing && product.variantPricing.length > 0 && (
                    <div className="text-xs">
                      <span className="font-medium text-gray-700">Variants:</span>
                             <span className="ml-1 text-gray-600">{product.variantPricing.length} combinations</span>
                    </div>
                  )}
                  {product.variantPricing && product.variantPricing.length > 0 && (
                    <div className="text-xs max-h-20 overflow-y-auto">
                             {product.variantPricing.slice(0, 3).map((variant, index) => (
                        <div key={index} className="text-xs text-gray-500">
                                 {variant.size}{variant.color ? ` - ${variant.color}` : ''} - {variant.pack}: ₹{variant.price} {typeof variant.stockQty === 'number' ? `(Stock: ${variant.stockQty})` : ''}
                        </div>
                      ))}
                      {product.variantPricing.length > 3 && (
                        <div className="text-xs text-gray-400">+{product.variantPricing.length - 3} more...</div>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Quick Stock Update */}
                <div className="mb-3 p-2 bg-gray-50 rounded">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-700">Quick Stock Update:</span>
                    <span className="text-xs text-gray-500">Current: {product.stockQty || 0}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min="0"
                      defaultValue={product.stockQty || 0}
                      className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Stock Qty"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          const newStock = Number((e.target as HTMLInputElement).value);
                          updateProductStock(product._id, newStock);
                        }
                      }}
                    />
                    <button
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                        const newStock = Number(input.value);
                        updateProductStock(product._id, newStock);
                      }}
                      className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                    >
                      Update
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-xs text-gray-500">
                    ID: {product._id.slice(-8)}
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => startEdit(product)}
                      className="px-2 py-1 text-xs bg-primary-100 text-primary-600 rounded hover:bg-primary-200"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteClick(product._id, product.name)}
                      className="px-2 py-1 text-xs bg-red-100 text-red-600 rounded hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-16 mx-auto p-6 border w-11/12 md:w-4/5 lg:w-3/4 xl:w-2/3 shadow-lg rounded-lg bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Edit Product</h3>
                <button
                  onClick={cancelEdit}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter product name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                    <input
                      type="number"
                      value={editForm.price}
                      onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter price"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={editForm.category}
                      onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="buttons">Buttons</option>
                      <option value="zippers">Zippers</option>
                      <option value="elastic">Elastic</option>
                      <option value="cords">Cords</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                    <input
                      type="number"
                      min="0"
                      value={editForm.stockQty || 0}
                      onChange={(e) => setEditForm({ ...editForm, stockQty: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter stock quantity"
                    />
                  </div>
                </div>

                {/* Status for Edit */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={editForm.status || 'active'}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        status: e.target.value as 'active' | 'draft',
                        inStock: e.target.value === 'active' ? editForm.inStock : false,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock Status</label>
                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-2 rounded-md text-sm font-medium ${
                        (editForm.stockQty || 0) > 0 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {(editForm.stockQty || 0) > 0 ? 'In Stock' : 'Out of Stock'}
                      </span>
                      <span className="text-sm text-gray-600">
                        Current: {editForm.stockQty || 0} units
                      </span>
                    </div>
                  </div>
                </div>

                {/* Image Upload Section for Edit */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
                  <div className="space-y-4 border border-gray-200 rounded-lg p-4">
                    {/* Image Preview */}
                    {editForm.image ? (
                      <div className="relative inline-block">
                        <img
                          src={editForm.image}
                          alt="Product preview"
                          className="w-32 h-32 object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={() => setEditForm({ ...editForm, image: '' })}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500">No image selected</p>
                    )}

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Upload new image
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          setIsUploadingImage(true);
                          try {
                            const formData = new FormData();
                            formData.append('image', file);
                            const res = await fetch('/api/admin/upload-image', {
                              method: 'POST',
                              body: formData,
                            });
                            const data = await res.json();
                            if (res.ok && data?.imageUrl) {
                              setEditForm((prev) => ({ ...prev, image: data.imageUrl }));
                              showSuccess('Image uploaded successfully');
                            } else {
                              showError(data?.error || 'Failed to upload image');
                            }
                          } catch (error) {
                            console.error('Image upload error:', error);
                            showError('Something went wrong while uploading the image');
                          } finally {
                            setIsUploadingImage(false);
                            if (e.target) {
                              e.target.value = '';
                            }
                          }
                        }}
                        className="w-full text-sm text-gray-700"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Max 5MB. JPG, PNG, or WEBP recommended.
                      </p>
                      {isUploadingImage && (
                        <p className="text-xs text-primary-600 mt-1">Uploading image...</p>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter product description"
                  />
                </div>

                {/* Variant Pricing System for Edit */}
                <div className="mt-4 space-y-4">
                  <h4 className="font-semibold text-gray-700">Product Variants with Pricing</h4>
                  
                  {/* Add New Variant Combination */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h5 className="font-medium text-gray-800 mb-3">Add Variant Combination</h5>
                    <div className="space-y-3">
                      {editForm.category === 'elastic' ? (
                        /* Elastic Category: Size / Quality / Color / Quantity (meter rolls) */
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Size <span className="text-red-500">*</span></label>
                            <input
                              type="text"
                              value={newVariant.size}
                              onChange={(e) => setNewVariant({ ...newVariant, size: e.target.value })}
                              placeholder="e.g., 10mm (16L), 12mm (20L)"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <p className="text-xs text-gray-500 mt-1">Enter custom size</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Quality <span className="text-red-500">*</span></label>
                            <select
                              value={newVariant.quality}
                              onChange={(e) => setNewVariant({ ...newVariant, quality: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="">Select Quality</option>
                              <option value="Woven">Woven</option>
                              <option value="Knitted">Knitted</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Color <span className="text-red-500">*</span></label>
                            <select
                              value={newVariant.color}
                              onChange={(e) => setNewVariant({ ...newVariant, color: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="">Select Color</option>
                              <option value="Black">Black</option>
                              <option value="White">White</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity (meter roll) <span className="text-red-500">*</span></label>
                            <select
                              value={newVariant.quantity}
                              onChange={(e) => setNewVariant({ ...newVariant, quantity: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="">Select Roll Size</option>
                              <option value="25 mtr roll">25 mtr roll</option>
                              <option value="30 mtr roll">30 mtr roll</option>
                            </select>
                          </div>
                        </div>
                      ) : (
                        /* Other Categories: Size / Color / Pack */
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Option</label>
                            <input
                              type="text"
                              value={newVariant.size}
                              onChange={(e) => setNewVariant({ ...newVariant, size: e.target.value })}
                              placeholder="e.g., 16L, 18L"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Value <span className="text-red-500">*</span></label>
                            <input
                              type="text"
                              value={newVariant.pack}
                              onChange={(e) => setNewVariant({ ...newVariant, pack: e.target.value })}
                              placeholder="e.g., 72, 144"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <p className="text-xs text-gray-500 mt-1">Add one value (like Shopify)</p>
                          </div>
                        </div>
                      )}

                      {/* Row 2: Price / Stock / Add button */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                          <input
                            type="number"
                            value={newVariant.price}
                            onChange={(e) => setNewVariant({ ...newVariant, price: Number(e.target.value) })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="0"
                            min="0"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                          <input
                            type="number"
                            value={newVariant.stockQty}
                            onChange={(e) => setNewVariant({ ...newVariant, stockQty: Number(e.target.value) })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="0"
                            min="0"
                          />
                        </div>
                        
                        <div className="flex items-end">
                          <button
                            type="button"
                            onClick={addVariantCombination}
                            className="w-full bg-primary-500 text-white px-4 py-2 rounded-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
                          >
                            Add Variant
                          </button>
                        </div>
                      </div>
                      
                      {/* Variant Image Upload */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Variant Image <span className="text-gray-400 text-xs">(Optional)</span>
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            setIsUploadingVariantImage(true);
                            try {
                              const formData = new FormData();
                              formData.append('image', file);
                              const res = await fetch('/api/admin/upload-image', {
                                method: 'POST',
                                body: formData,
                              });
                              const data = await res.json();
                              if (res.ok && data?.imageUrl) {
                                setNewVariant((prev) => ({ ...prev, image: data.imageUrl }));
                                showSuccess('Variant image uploaded');
                              } else {
                                showError(data?.error || 'Failed to upload variant image');
                              }
                            } catch (error) {
                              console.error('Variant image upload error:', error);
                              showError('Something went wrong while uploading the variant image');
                            } finally {
                              setIsUploadingVariantImage(false);
                              e.target.value = '';
                            }
                          }}
                          className="w-full text-sm text-gray-700"
                        />
                        <p className="text-xs text-gray-500 mt-1">Leave empty to use product image</p>
                        {isUploadingVariantImage && (
                          <p className="text-xs text-primary-600 mt-1">Uploading variant image...</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Display Added Variants - Always Visible */}
                  <div className="bg-white border-2 border-blue-200 rounded-lg p-4 mt-4">
                    <h5 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-bold">
                        {variantPricing.length}
                      </span>
                      Added Variant{variantPricing.length !== 1 ? 's' : ''}
                    </h5>
                    {variantPricing.length > 0 ? (
                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        {variantPricing.map((variant, index) => (
                          <div key={index} className="bg-gray-50 p-3 rounded-md border border-gray-200 hover:bg-gray-100 transition-colors">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 flex items-start space-x-4 flex-wrap gap-2">
                                {/* Variant Image Preview */}
                                {variant.image && (
                                  <div className="relative">
                                    <img
                                      src={variant.image}
                                      alt={`${variant.size} ${variant.color || ''} ${variant.pack}`}
                                      className="w-16 h-16 object-cover rounded border"
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                      }}
                                    />
                                  </div>
                                )}
                                
                                <div className="flex flex-col space-y-2 flex-1">
                                  {/* Editable Variant Fields */}
                                  {editForm.category === 'elastic' ? (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                      <div>
                                        <label className="text-xs text-gray-500 font-medium">Size</label>
                                        <input
                                          type="text"
                                          value={variant.size || ''}
                                          onChange={(e) => {
                                            const newVariants = [...variantPricing];
                                            newVariants[index] = { ...variant, size: e.target.value };
                                            setVariantPricing(newVariants);
                                          }}
                                          className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                          placeholder="Size"
                                        />
                                      </div>
                                      <div>
                                        <label className="text-xs text-gray-500 font-medium">Quality</label>
                                        <select
                                          value={variant.quality || ''}
                                          onChange={(e) => {
                                            const newVariants = [...variantPricing];
                                            newVariants[index] = { ...variant, quality: e.target.value };
                                            setVariantPricing(newVariants);
                                          }}
                                          className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        >
                                          <option value="">Select</option>
                                          <option value="Woven">Woven</option>
                                          <option value="Knitted">Knitted</option>
                                        </select>
                                      </div>
                                      <div>
                                        <label className="text-xs text-gray-500 font-medium">Color</label>
                                        <select
                                          value={variant.color || ''}
                                          onChange={(e) => {
                                            const newVariants = [...variantPricing];
                                            newVariants[index] = { ...variant, color: e.target.value };
                                            setVariantPricing(newVariants);
                                          }}
                                          className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        >
                                          <option value="">Select</option>
                                          <option value="Black">Black</option>
                                          <option value="White">White</option>
                                        </select>
                                      </div>
                                      <div>
                                        <label className="text-xs text-gray-500 font-medium">Roll</label>
                                        <select
                                          value={variant.quantity || ''}
                                          onChange={(e) => {
                                            const newVariants = [...variantPricing];
                                            newVariants[index] = { ...variant, quantity: e.target.value };
                                            setVariantPricing(newVariants);
                                          }}
                                          className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        >
                                          <option value="">Select</option>
                                          <option value="25 mtr roll">25 mtr roll</option>
                                          <option value="30 mtr roll">30 mtr roll</option>
                                        </select>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="grid grid-cols-3 gap-2">
                                      <div>
                                        <label className="text-xs text-gray-500 font-medium">Size</label>
                                        <input
                                          type="text"
                                          value={variant.size || ''}
                                          onChange={(e) => {
                                            const newVariants = [...variantPricing];
                                            newVariants[index] = { ...variant, size: e.target.value };
                                            setVariantPricing(newVariants);
                                          }}
                                          className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                          placeholder="Size"
                                        />
                                      </div>
                                      <div>
                                        <label className="text-xs text-gray-500 font-medium">Color</label>
                                        <input
                                          type="text"
                                          value={variant.color || ''}
                                          onChange={(e) => {
                                            const newVariants = [...variantPricing];
                                            newVariants[index] = { ...variant, color: e.target.value };
                                            setVariantPricing(newVariants);
                                          }}
                                          className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                          placeholder="Color"
                                        />
                                      </div>
                                      <div>
                                        <label className="text-xs text-gray-500 font-medium">Pack</label>
                                        <input
                                          type="text"
                                          value={variant.pack || ''}
                                          onChange={(e) => {
                                            const newVariants = [...variantPricing];
                                            newVariants[index] = { ...variant, pack: e.target.value };
                                            setVariantPricing(newVariants);
                                          }}
                                          className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                          placeholder="Pack"
                                        />
                                      </div>
                                    </div>
                                  )}
                                  
                                  <div className="flex items-center space-x-4 flex-wrap gap-2">
                                    <div className="flex items-center space-x-2">
                                      <label className="text-xs text-gray-500 font-medium">Price:</label>
                                      <div className="flex items-center">
                                        <span className="text-xs text-gray-500 mr-1">₹</span>
                                        <input
                                          type="number"
                                          value={variant.price || 0}
                                          onChange={(e) => {
                                            const newVariants = [...variantPricing];
                                            newVariants[index] = { ...variant, price: Number(e.target.value) };
                                            setVariantPricing(newVariants);
                                          }}
                                          className="w-20 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                          min="0"
                                          step="0.01"
                                        />
                                      </div>
                                    </div>
                                    
                                    <div className="flex items-center space-x-2">
                                      <label className="text-xs text-gray-500 font-medium">Stock:</label>
                                      <input
                                        type="number"
                                        value={variant.stockQty || 0}
                                        onChange={(e) => {
                                          const newVariants = [...variantPricing];
                                          newVariants[index] = { ...variant, stockQty: Number(e.target.value), inStock: Number(e.target.value) > 0 };
                                          setVariantPricing(newVariants);
                                        }}
                                        className="w-16 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        min="0"
                                      />
                                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${variant.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {variant.inStock ? 'In Stock' : 'Out of Stock'}
                                      </span>
                                    </div>
                                  </div>
                                  
                                  {/* Variant Image Upload */}
                                  <div className="flex items-center space-x-2">
                                    <label className="text-xs text-gray-500 font-medium whitespace-nowrap">Variant Image:</label>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;
                                        setIsUploadingVariantImage(true);
                                        try {
                                          const formData = new FormData();
                                          formData.append('image', file);
                                          const res = await fetch('/api/admin/upload-image', {
                                            method: 'POST',
                                            body: formData,
                                          });
                                          const data = await res.json();
                                          if (res.ok && data?.imageUrl) {
                                            const newVariants = [...variantPricing];
                                            newVariants[index] = { ...variant, image: data.imageUrl };
                                            setVariantPricing(newVariants);
                                            showSuccess('Variant image uploaded');
                                          } else {
                                            showError(data?.error || 'Failed to upload variant image');
                                          }
                                        } catch (error) {
                                          console.error('Variant image upload error:', error);
                                          showError('Something went wrong while uploading the variant image');
                                        } finally {
                                          setIsUploadingVariantImage(false);
                                          e.target.value = '';
                                        }
                                      }}
                                      className="flex-1 text-xs text-gray-700"
                                    />
                                  </div>
                                </div>
                              </div>
                              
                              <button
                                type="button"
                                onClick={() => removeVariantCombination(index)}
                                className="text-red-600 hover:text-red-800 text-sm font-medium px-3 py-1 hover:bg-red-50 rounded transition-colors whitespace-nowrap"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-gray-400 text-sm">
                        <p>No variants added yet. Add your first variant above.</p>
                      </div>
                    )}
                  </div>
                </div>

              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={cancelEdit}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={updateProduct}
                  className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Update Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => !isDeleting && setDeleteModal({ isOpen: false, productId: null, productName: null, isBulk: false, count: 0 })}
        onConfirm={handleDeleteConfirm}
        title={deleteModal.isBulk ? "Delete Multiple Products" : "Delete Product"}
        message={deleteModal.isBulk 
          ? "Are you sure you want to delete the selected products?"
          : "Are you sure you want to delete this product?"
        }
        itemName={deleteModal.productName || undefined}
        isDeleting={isDeleting}
        isBulk={deleteModal.isBulk}
        count={deleteModal.count}
      />
      <Toast
        message={toast.message}
        isVisible={toast.isVisible}
        onClose={hideToast}
        type={toast.type}
      />
      </div>
    </>
  );
}


