'use client';

import { useCallback, useEffect, useState } from 'react';
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
  const [editingVariantIndex, setEditingVariantIndex] = useState<number | null>(null);
  const [editingVariantDraft, setEditingVariantDraft] = useState<{
    size?: string;
    color?: string;
    pack?: string;
    quality?: string;
    quantity?: string;
  } | null>(null);
  const [variantGroupBy, setVariantGroupBy] = useState<'size' | 'color' | 'pack' | 'quality' | 'quantity'>('size');
  const [expandedVariantGroups, setExpandedVariantGroups] = useState<Record<string, boolean>>({});
  const [uploadingVariantImageIndex, setUploadingVariantImageIndex] = useState<number | null>(null);
  
  // Edit mode variant selection and filtering
  const [selectedVariantIndex, setSelectedVariantIndex] = useState<number | null>(null);
  const [variantSearchQuery, setVariantSearchQuery] = useState('');
  const [variantOptionFilters, setVariantOptionFilters] = useState<Record<string, string>>({});
  
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
    values: [''] as string[],
    price: 0,
    stockQty: 0,
    sku: '',
    image: ''
  });

  type ShopifyOption = { key: 'size' | 'pack' | 'color' | 'quality' | 'quantity'; name: string; values: string[] };
  const [shopifyOptions, setShopifyOptions] = useState<ShopifyOption[]>([
    { key: 'size', name: 'Size', values: [''] },
  ]);
  // Separate shopifyOptions for edit mode
  const [editShopifyOptions, setEditShopifyOptions] = useState<ShopifyOption[]>([]);
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

  // Initialize shopifyOptions - always start with just one option (Size) for all categories
  useEffect(() => {
    setShopifyOptions([
      { key: 'size', name: 'Size', values: [''] },
    ]);
  }, [form.category]);

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
    if (form.category === 'buttons' && variantPricing.length === 0) {
      showWarning('Please add at least one variant in the Variants section (Shopify style)');
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
        values: [''],
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
    setNewVariant({ size: '', color: '', pack: '', quality: '', quantity: '', values: [''], price: 0, stockQty: 0, sku: '', image: '' });
    setShopifyOptions([{ key: 'size', name: 'Size', values: [''] }]);
    
    // Initialize edit mode Shopify options - always start with just one option (Size) for all categories
    setEditShopifyOptions([
      { key: 'size', name: 'Size', values: [''] },
    ]);
    
    // Reset variant selection and filters
    setSelectedVariantIndex(product.variantPricing && product.variantPricing.length > 0 ? 0 : null);
    setVariantSearchQuery('');
    setVariantOptionFilters({});
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
      setNewVariant({ size: '', color: '', pack: '', quality: '', quantity: '', values: [''], price: 0, stockQty: 0, sku: '', image: '' });
      setEditShopifyOptions([]);
      setSelectedVariantIndex(null);
      setVariantSearchQuery('');
      setVariantOptionFilters({});
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
    setSelectedVariantIndex(null);
    setVariantSearchQuery('');
    setVariantOptionFilters({});
    setNewVariant({ size: '', color: '', pack: '', quality: '', quantity: '', values: [''], price: 0, stockQty: 0, sku: '', image: '' });
    setEditShopifyOptions([]);
  };
  const handleImageRemove = () => {
    setForm({ ...form, image: '' });
  };

  // New variant dropdown functions
  const addVariantCombination = () => {
    const activeCategory = editingProduct ? editForm.category : form.category;
    const basePrice = editingProduct ? editForm.price : form.price;
    const priceToUse = newVariant.price > 0 ? newVariant.price : Number(basePrice || 0);
    
    // Shopify-style approach for edit mode - works for all categories
    if (editingProduct) {
      // Get all option values (filter out empty values)
      const optionValuesMap: Record<string, string[]> = {};
      editShopifyOptions.forEach(opt => {
        const values = opt.values.map(v => v.trim()).filter(Boolean);
        if (values.length > 0) {
          optionValuesMap[opt.key] = values;
        }
      });
      
      if (Object.keys(optionValuesMap).length === 0) {
        showWarning('Please add at least one option value');
        return;
      }
      
      if (newVariant.price <= 0) {
        showWarning('Please set a valid price');
        return;
      }
      
      // Generate cartesian product of all option values
      const optionKeys = Object.keys(optionValuesMap);
      const valueArrays = optionKeys.map(key => optionValuesMap[key]);
      
      // Helper function to generate cartesian product
      const cartesian = (arrays: string[][], keys: string[]): Record<string, string>[] => {
        if (arrays.length === 0) return [{}];
        if (arrays.length === 1) {
          return arrays[0].map(v => ({ [keys[0]]: v }));
        }
        const result: Record<string, string>[] = [];
        const first = arrays[0];
        const rest = cartesian(arrays.slice(1), keys.slice(1));
        for (const f of first) {
          for (const r of rest) {
            result.push({ [keys[0]]: f, ...r });
          }
        }
        return result;
      };
      
      const combinations = cartesian(valueArrays, optionKeys);
      
      // Build variants from combinations
      const newVariants: typeof variantPricing = [];
      for (const combo of combinations) {
        const variant: any = {
          price: newVariant.price,
          stockQty: Number(newVariant.stockQty || 0),
          inStock: Number(newVariant.stockQty || 0) > 0,
          sku: generateVariantSKU(editingProduct?._id || 'new', combo.size || '', combo.color || '', combo.pack || ''),
          image: newVariant.image?.trim() || undefined
        };
        
        // Add all option fields
        optionKeys.forEach(key => {
          variant[key] = combo[key];
        });
        
        // Check if combination already exists
        const exists = variantPricing.some(v => {
          return optionKeys.every(key => {
            const variantValue = (v as any)[key] || '';
            const newValue = variant[key] || '';
            return String(variantValue).trim() === String(newValue).trim();
          });
        });
        
        if (!exists) {
          newVariants.push(variant);
        }
      }
      
      if (newVariants.length === 0) {
        showInfo('All variant combinations already exist');
        return;
      }
      
      const updatedVariants = [...variantPricing, ...newVariants];
      setVariantPricing(updatedVariants);
      setNewVariant({ size: '', color: '', pack: '', quality: '', quantity: '', values: [''], price: 0, stockQty: 0, sku: '', image: '' });
      // Reset option values but keep option names
      setEditShopifyOptions(editShopifyOptions.map(opt => ({ ...opt, values: [''] })));
      // Select the first newly added variant
      setSelectedVariantIndex(variantPricing.length);
      showSuccess(`Added ${newVariants.length} variant(s)`);
      return;
    }
    
    // Shopify-style for ALL categories in create mode
    // Get all option values (filter out empty values)
    const optionValuesMap: Record<string, string[]> = {};
    shopifyOptions.forEach(opt => {
      const values = opt.values.map(v => v.trim()).filter(Boolean);
      if (values.length > 0) {
        optionValuesMap[opt.key] = values;
      }
    });
    
    if (Object.keys(optionValuesMap).length === 0) {
      showWarning('Please add at least one option value');
      return;
    }
    
    if (priceToUse <= 0) {
      showWarning('Please set a valid price');
      return;
    }
    
    // Generate cartesian product of all option values
    const optionKeys = Object.keys(optionValuesMap);
    const valueArrays = optionKeys.map(key => optionValuesMap[key]);
    
    // Helper function to generate cartesian product
    const cartesian = (arrays: string[][], keys: string[]): Record<string, string>[] => {
      if (arrays.length === 0) return [{}];
      if (arrays.length === 1) {
        return arrays[0].map(v => ({ [keys[0]]: v }));
      }
      const result: Record<string, string>[] = [];
      const first = arrays[0];
      const rest = cartesian(arrays.slice(1), keys.slice(1));
      for (const f of first) {
        for (const r of rest) {
          result.push({ [keys[0]]: f, ...r });
        }
      }
      return result;
    };
    
    const combinations = cartesian(valueArrays, optionKeys);
    
    // Build variants from combinations
    const newVariants: typeof variantPricing = [];
    for (const combo of combinations) {
      const variant: any = {
        price: priceToUse,
        stockQty: Number(newVariant.stockQty || 0),
        inStock: Number(newVariant.stockQty || 0) > 0,
        sku: generateVariantSKU('new', combo.size || '', combo.color || '', combo.pack || ''),
        image: newVariant.image?.trim() || undefined
      };
      
      // Add all option fields
      optionKeys.forEach(key => {
        variant[key] = combo[key];
      });
      
      // Check if combination already exists
      const exists = variantPricing.some(v => {
        return optionKeys.every(key => {
          const variantValue = (v as any)[key] || '';
          const newValue = variant[key] || '';
          return String(variantValue).trim() === String(newValue).trim();
        });
      });
      
      if (!exists) {
        newVariants.push(variant);
      }
    }
    
    if (newVariants.length === 0) {
      showInfo('All variant combinations already exist');
      return;
    }
    
    setVariantPricing([...variantPricing, ...newVariants]);
    showSuccess(`Added ${newVariants.length} variant(s)`);
    setNewVariant({ size: '', color: '', pack: '', quality: '', quantity: '', values: [''], price: 0, stockQty: 0, sku: '', image: '' });
    // Reset option values but keep option names
    setShopifyOptions(shopifyOptions.map(opt => ({ ...opt, values: [''] })));
  };

  const removeVariantCombination = (index: number) => {
    setVariantPricing(variantPricing.filter((_, i) => i !== index));
  };

  const getVariantOptionDefs = useCallback(() => {
    const activeCategory = editingProduct ? editForm.category : form.category;

    // Shopify-style names for buttons
    const sizeName =
      shopifyOptions.find((o) => o.key === 'size')?.name?.trim() || 'Option';
    const packName =
      shopifyOptions.find((o) => o.key === 'pack')?.name?.trim() || 'Value';

    if (activeCategory === 'elastic') {
      const hasQuality = variantPricing.some((v) => Boolean(v.quality));
      const hasQuantity = variantPricing.some((v) => Boolean(v.quantity));
      return [
        { key: 'size' as const, label: 'size' },
        { key: 'color' as const, label: 'color' },
        ...(hasQuality ? [{ key: 'quality' as const, label: 'quality' }] : []),
        ...(hasQuantity ? [{ key: 'quantity' as const, label: 'quantity' }] : []),
      ];
    }

    if (activeCategory === 'zipper') {
      const hasQuantity = variantPricing.some((v) => Boolean((v as any).quantity));
      return [
        { key: 'size' as const, label: 'size' },
        { key: 'color' as const, label: 'color' },
        ...(hasQuantity ? [{ key: 'quantity' as const, label: 'quantity' }] : []),
      ];
    }

    // buttons + other categories
    const hasPack = variantPricing.some((v) => Boolean(v.pack));
    return [
      { key: 'size' as const, label: sizeName },
      ...(hasPack ? [{ key: 'pack' as const, label: packName }] : []),
    ];
  }, [editForm.category, editingProduct, form.category, shopifyOptions, variantPricing]);

  const getDistinctOptionValues = useCallback(
    (key: 'size' | 'color' | 'pack' | 'quality' | 'quantity') => {
      const vals = new Set<string>();
      for (const v of variantPricing) {
        const raw = (v as any)[key];
        const s = typeof raw === 'string' ? raw.trim() : '';
        if (s) vals.add(s);
      }
      return Array.from(vals).sort((a, b) => a.localeCompare(b));
    },
    [variantPricing]
  );

  const getVariantCompactLabel = useCallback(
    (
      variant: {
        size?: string;
        color?: string;
        pack?: string;
        quality?: string;
        quantity?: string;
      },
      excludeKey?: 'size' | 'color' | 'pack' | 'quality' | 'quantity'
    ) => {
      const parts: string[] = [];
      const push = (k: typeof excludeKey, v?: string) => {
        if (excludeKey === k) return;
        const s = (v || '').trim();
        if (s) parts.push(s);
      };
      push('size', variant.size);
      push('color', variant.color);
      push('quality', variant.quality);
      push('quantity', (variant as any).quantity);
      push('pack', variant.pack);
      return parts.join(' • ') || '—';
    },
    []
  );

  const startEditVariant = (index: number) => {
    const v = variantPricing[index];
    setEditingVariantIndex(index);
    setEditingVariantDraft({
      size: v.size,
      color: v.color,
      pack: v.pack,
      quality: v.quality,
      quantity: (v as any).quantity,
    });
  };

  const cancelEditVariant = () => {
    setEditingVariantIndex(null);
    setEditingVariantDraft(null);
  };

  const uploadVariantImageForIndex = async (index: number, file: File) => {
    setUploadingVariantImageIndex(index);
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
        newVariants[index] = { ...newVariants[index], image: data.imageUrl };
        setVariantPricing(newVariants);
        showSuccess('Variant image uploaded');
      } else {
        showError(data?.error || 'Failed to upload variant image');
      }
    } catch (error) {
      console.error('Variant image upload error:', error);
      showError('Something went wrong while uploading the variant image');
    } finally {
      setUploadingVariantImageIndex(null);
    }
  };

  const saveEditVariant = () => {
    if (editingVariantIndex === null || !editingVariantDraft) return;

    const idx = editingVariantIndex;
    const current = variantPricing[idx];
    const activeCategory = editingProduct ? editForm.category : form.category;

    const next = {
      ...current,
      size: editingVariantDraft.size || undefined,
      color: editingVariantDraft.color || undefined,
      pack: editingVariantDraft.pack || undefined,
      quality: editingVariantDraft.quality || undefined,
      quantity: editingVariantDraft.quantity || undefined,
    } as any;

    // regenerate SKU when key option fields change
    if (activeCategory === 'elastic') {
      next.sku = generateVariantSKU(
        editingProduct?._id || 'new',
        next.size || '',
        next.quality || '',
        next.quantity || ''
      );
    } else if (activeCategory === 'zipper') {
      next.sku = generateVariantSKU(
        editingProduct?._id || 'new',
        next.size || '',
        next.color || '',
        next.quantity || ''
      );
    } else {
      next.sku = generateVariantSKU(
        editingProduct?._id || 'new',
        next.size || '',
        '',
        next.pack || ''
      );
    }

    const newVariants = [...variantPricing];
    newVariants[idx] = next;
    setVariantPricing(newVariants);
    showSuccess('Variant updated');
    cancelEditVariant();
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
              {/* Shopify-style Options for ALL categories */}
              <div className="space-y-6">
                {shopifyOptions.map((opt, optIdx) => (
                  <div key={opt.key} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Option name</label>
                        <input
                          type="text"
                          value={opt.name}
                          onChange={(e) => {
                            const next = [...shopifyOptions];
                            next[optIdx] = { ...opt, name: e.target.value };
                            setShopifyOptions(next);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., Size"
                        />
                      </div>
                      {optIdx > 0 && (
                        <button
                          type="button"
                          onClick={() => setShopifyOptions(shopifyOptions.filter((_, i) => i !== optIdx))}
                          className="text-sm text-red-600 hover:text-red-700"
                        >
                          Delete
                        </button>
                      )}
                    </div>

                    <label className="block text-sm font-medium text-gray-700 mb-2">Option values</label>
                    <div className="space-y-2">
                      {opt.values.map((value, valIdx) => (
                        <div key={valIdx} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={value}
                            onChange={(e) => {
                              const next = [...shopifyOptions];
                              const values = [...opt.values];
                              values[valIdx] = e.target.value;
                              const trimmed = values.map((v) => v.trim());
                              if (trimmed[trimmed.length - 1] !== '') values.push('');
                              next[optIdx] = { ...opt, values };
                              setShopifyOptions(next);
                            }}
                            placeholder={valIdx === 0 ? 'e.g., 10mm' : 'Add another value'}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          {(opt.values.length > 1 || value.trim() !== '') && (
                            <button
                              type="button"
                              onClick={() => {
                                const next = [...shopifyOptions];
                                const values = [...opt.values];
                                values.splice(valIdx, 1);
                                if (values.length === 0) values.push('');
                                const trimmed = values.map((v) => v.trim());
                                if (trimmed[trimmed.length - 1] !== '') values.push('');
                                next[optIdx] = { ...opt, values };
                                setShopifyOptions(next);
                              }}
                              className="px-2 py-2 text-gray-500 hover:text-gray-700"
                              aria-label="Remove value"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {shopifyOptions.length < 5 && (
                  <button
                    type="button"
                    onClick={() => {
                      // Find next available key
                      const usedKeys = shopifyOptions.map(o => o.key);
                      const availableKeys: Array<'size' | 'pack' | 'color' | 'quality' | 'quantity'> = ['size', 'pack', 'color', 'quality', 'quantity'];
                      const nextKey = availableKeys.find(k => !usedKeys.includes(k));
                      if (nextKey) {
                        setShopifyOptions([...shopifyOptions, { key: nextKey, name: nextKey.charAt(0).toUpperCase() + nextKey.slice(1), values: [''] }]);
                      }
                    }}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    + Add another option
                  </button>
                )}
              </div>

              {form.category === 'elastic' || form.category === 'zipper' ? (
                <>
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
                </>
              ) : (
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={addVariantCombination}
                    className="bg-primary-500 text-white px-6 py-2 rounded-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
                  >
                    Add Variant
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4 mt-4">
            <div className="flex items-center justify-between gap-3 mb-3">
              <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                  {variantPricing.length}
                </span>
                Variants
              </h4>
              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-500 font-medium">Group by</label>
                <select
                  value={variantGroupBy}
                  onChange={(e) => setVariantGroupBy(e.target.value as any)}
                  className="text-xs px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                >
                  {getVariantOptionDefs().map((d) => (
                    <option key={d.key} value={d.key}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Shopify-like options box */}
            <div className="border border-gray-200 rounded-lg p-3 mb-4 bg-white">
              <div className="space-y-3">
                {getVariantOptionDefs().map((d) => {
                  const values = getDistinctOptionValues(d.key);
                  if (values.length === 0) return null;
                  return (
                    <div key={d.key} className="flex items-start gap-3">
                      <div className="w-28 text-sm font-medium text-gray-800 capitalize">{d.label}</div>
                      <div className="flex flex-wrap gap-2">
                        {values.map((v) => (
                          <span key={v} className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded border border-gray-200">
                            {v}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
                <button
                  type="button"
                  className="text-xs text-gray-400 cursor-not-allowed flex items-center gap-2"
                  disabled
                  title="Add option will come next (UI only for now)"
                >
                  <span className="text-base leading-none">+</span> Add another option
                </button>
              </div>
            </div>

            {variantPricing.length > 0 ? (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Table header */}
                <div className="grid grid-cols-12 gap-2 px-3 py-2 bg-gray-50 text-xs font-medium text-gray-600">
                  <div className="col-span-5">Variant</div>
                  <div className="col-span-3">Price</div>
                  <div className="col-span-2">Available</div>
                  <div className="col-span-2 text-right">Actions</div>
                </div>

                {(() => {
                  const groups = new Map<
                    string,
                    { label: string; items: Array<{ variant: any; index: number }> }
                  >();
                  variantPricing.forEach((variant, index) => {
                    const raw = (variant as any)[variantGroupBy];
                    const label = (typeof raw === 'string' ? raw.trim() : '') || '—';
                    const key = `${variantGroupBy}:${label}`;
                    const g = groups.get(key) || { label, items: [] as any[] };
                    g.items.push({ variant, index });
                    groups.set(key, g);
                  });

                  const sorted = Array.from(groups.values()).sort((a, b) => a.label.localeCompare(b.label));

                  return (
                    <div className="divide-y divide-gray-200">
                      {sorted.map((g) => {
                        const groupKey = `${variantGroupBy}:${g.label}`;
                        const isExpanded = expandedVariantGroups[groupKey] ?? true;
                        return (
                          <div key={groupKey}>
                            {/* Group row */}
                            <button
                              type="button"
                              onClick={() =>
                                setExpandedVariantGroups((p) => ({ ...p, [groupKey]: !(p[groupKey] ?? true) }))
                              }
                              className="w-full grid grid-cols-12 gap-2 px-3 py-2 bg-white hover:bg-gray-50 text-left"
                            >
                              <div className="col-span-5 flex items-center gap-2">
                                <span className="text-gray-500">{isExpanded ? '▾' : '▸'}</span>
                                <span className="text-sm font-medium text-gray-900">{g.label}</span>
                                <span className="text-xs text-gray-500">{g.items.length} variants</span>
                              </div>
                              <div className="col-span-3" />
                              <div className="col-span-2" />
                              <div className="col-span-2" />
                            </button>

                            {/* Children */}
                            {isExpanded && (
                              <div className="divide-y divide-gray-100">
                                {g.items.map(({ variant, index }) => (
                                  <div key={`${groupKey}:${index}`} className="grid grid-cols-12 gap-2 px-3 py-2 bg-white">
                                    <div className="col-span-5 flex items-center gap-3">
                                      {variant.image ? (
                                        <img
                                          src={variant.image}
                                          alt={getVariantCompactLabel(variant)}
                                          className="w-8 h-8 rounded border object-cover"
                                          onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = 'none';
                                          }}
                                        />
                                      ) : (
                                        <div className="w-8 h-8 rounded border bg-gray-50" />
                                      )}
                                      <div className="min-w-0">
                                        <div className="text-sm text-gray-900 truncate">
                                          {getVariantCompactLabel(variant, variantGroupBy)}
                                        </div>

                                        {editingVariantIndex === index && editingVariantDraft && (
                                          <div className="mt-2 bg-white border border-gray-200 rounded-md p-3">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                              {form.category === 'elastic' ? (
                                                <>
                                                  <div>
                                                    <label className="block text-xs font-medium text-gray-700 mb-1">Size</label>
                                                    <input
                                                      type="text"
                                                      value={editingVariantDraft.size || ''}
                                                      onChange={(e) => setEditingVariantDraft((p) => ({ ...(p || {}), size: e.target.value }))}
                                                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                    />
                                                  </div>
                                                  <div>
                                                    <label className="block text-xs font-medium text-gray-700 mb-1">Quality</label>
                                                    <input
                                                      type="text"
                                                      value={editingVariantDraft.quality || ''}
                                                      onChange={(e) => setEditingVariantDraft((p) => ({ ...(p || {}), quality: e.target.value }))}
                                                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                    />
                                                  </div>
                                                  <div>
                                                    <label className="block text-xs font-medium text-gray-700 mb-1">Color</label>
                                                    <input
                                                      type="text"
                                                      value={editingVariantDraft.color || ''}
                                                      onChange={(e) => setEditingVariantDraft((p) => ({ ...(p || {}), color: e.target.value }))}
                                                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                    />
                                                  </div>
                                                  <div className="md:col-span-3">
                                                    <label className="block text-xs font-medium text-gray-700 mb-1">Quantity</label>
                                                    <input
                                                      type="text"
                                                      value={editingVariantDraft.quantity || ''}
                                                      onChange={(e) => setEditingVariantDraft((p) => ({ ...(p || {}), quantity: e.target.value }))}
                                                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                    />
                                                  </div>
                                                </>
                                              ) : form.category === 'zipper' ? (
                                                <>
                                                  <div>
                                                    <label className="block text-xs font-medium text-gray-700 mb-1">Size</label>
                                                    <input
                                                      type="text"
                                                      value={editingVariantDraft.size || ''}
                                                      onChange={(e) => setEditingVariantDraft((p) => ({ ...(p || {}), size: e.target.value }))}
                                                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                    />
                                                  </div>
                                                  <div>
                                                    <label className="block text-xs font-medium text-gray-700 mb-1">Color</label>
                                                    <input
                                                      type="text"
                                                      value={editingVariantDraft.color || ''}
                                                      onChange={(e) => setEditingVariantDraft((p) => ({ ...(p || {}), color: e.target.value }))}
                                                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                    />
                                                  </div>
                                                  <div>
                                                    <label className="block text-xs font-medium text-gray-700 mb-1">Quantity</label>
                                                    <input
                                                      type="text"
                                                      value={editingVariantDraft.quantity || ''}
                                                      onChange={(e) => setEditingVariantDraft((p) => ({ ...(p || {}), quantity: e.target.value }))}
                                                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                    />
                                                  </div>
                                                </>
                                              ) : (
                                                <>
                                                  <div>
                                                    <label className="block text-xs font-medium text-gray-700 mb-1">Option</label>
                                                    <input
                                                      type="text"
                                                      value={editingVariantDraft.size || ''}
                                                      onChange={(e) => setEditingVariantDraft((p) => ({ ...(p || {}), size: e.target.value }))}
                                                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                    />
                                                  </div>
                                                  <div>
                                                    <label className="block text-xs font-medium text-gray-700 mb-1">Value</label>
                                                    <input
                                                      type="text"
                                                      value={editingVariantDraft.pack || ''}
                                                      onChange={(e) => setEditingVariantDraft((p) => ({ ...(p || {}), pack: e.target.value }))}
                                                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                    />
                                                  </div>
                                                </>
                                              )}
                                            </div>

                                            <div className="flex items-center gap-2 mt-3">
                                              <button
                                                type="button"
                                                onClick={saveEditVariant}
                                                className="text-xs font-medium px-3 py-1 rounded bg-primary-600 text-white hover:bg-primary-700"
                                              >
                                                Save
                                              </button>
                                              <button
                                                type="button"
                                                onClick={cancelEditVariant}
                                                className="text-xs font-medium px-3 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
                                              >
                                                Cancel
                                              </button>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </div>

                                    <div className="col-span-3">
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
                                          className="w-full max-w-[140px] px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                          min="0"
                                          step="0.01"
                                        />
                                      </div>
                                    </div>

                                    <div className="col-span-2">
                                      <input
                                        type="number"
                                        value={variant.stockQty || 0}
                                        onChange={(e) => {
                                          const newVariants = [...variantPricing];
                                          newVariants[index] = {
                                            ...variant,
                                            stockQty: Number(e.target.value),
                                            inStock: Number(e.target.value) > 0,
                                          };
                                          setVariantPricing(newVariants);
                                        }}
                                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        min="0"
                                      />
                                    </div>

                                    <div className="col-span-2 flex items-center justify-end">
                                      <div className="flex items-center gap-4 text-xs font-medium">
                                        <label className="text-gray-700 hover:text-gray-900 cursor-pointer">
                                          {uploadingVariantImageIndex === index ? 'Uploading…' : 'Image'}
                                          <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            disabled={uploadingVariantImageIndex === index}
                                            onChange={async (e) => {
                                              const file = e.target.files?.[0];
                                              if (!file) return;
                                              await uploadVariantImageForIndex(index, file);
                                              e.target.value = '';
                                            }}
                                          />
                                        </label>

                                        {editingVariantIndex !== index ? (
                                          <button
                                            type="button"
                                            onClick={() => startEditVariant(index)}
                                            className="text-primary-600 hover:text-primary-800"
                                          >
                                            Edit
                                          </button>
                                        ) : (
                                          <button
                                            type="button"
                                            onClick={cancelEditVariant}
                                            className="text-primary-600 hover:text-primary-800"
                                          >
                                            Close
                                          </button>
                                        )}

                                        <button
                                          type="button"
                                          onClick={() => removeVariantCombination(index)}
                                          className="text-red-600 hover:text-red-800"
                                        >
                                          Remove
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
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

                {/* Variant Pricing System for Edit - Shopify-like Split Layout */}
                <div className="mt-4">
                  <h4 className="font-semibold text-gray-700 mb-4">Product Variants</h4>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Sidebar - Variant List */}
                    <div className="lg:col-span-1 border border-gray-200 rounded-lg bg-white">
                      {/* Product Header */}
                      <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center gap-3 mb-2">
                          {editForm.image && (
                            <img
                              src={editForm.image}
                              alt={editForm.name}
                              className="w-10 h-10 rounded object-cover"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <h5 className="text-sm font-medium text-gray-900 truncate">{editForm.name}</h5>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                editForm.status === 'active' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {editForm.status === 'active' ? 'Active' : 'Draft'}
                              </span>
                              <span className="text-xs text-gray-500">{variantPricing.length} variant{variantPricing.length !== 1 ? 's' : ''}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Search */}
                      <div className="p-4 border-b border-gray-200">
                        <div className="relative">
                          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                          <input
                            type="text"
                            value={variantSearchQuery}
                            onChange={(e) => setVariantSearchQuery(e.target.value)}
                            placeholder="Search variants"
                            className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      {/* Option Filters */}
                      {getVariantOptionDefs().length > 0 && (
                        <div className="p-4 border-b border-gray-200 space-y-3">
                          {getVariantOptionDefs().map((opt) => {
                            const values = getDistinctOptionValues(opt.key);
                            if (values.length === 0) return null;
                            return (
                              <div key={opt.key}>
                                <label className="block text-xs font-medium text-gray-700 mb-1 capitalize">{opt.label}</label>
                                <select
                                  value={variantOptionFilters[opt.key] || ''}
                                  onChange={(e) => setVariantOptionFilters({ ...variantOptionFilters, [opt.key]: e.target.value })}
                                  className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                                >
                                  <option value="">All {opt.label}</option>
                                  {values.map((v) => (
                                    <option key={v} value={v}>{v}</option>
                                  ))}
                                </select>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Variant List */}
                      <div className="p-2">
                        <div className="text-xs font-medium text-gray-700 px-2 py-1 mb-2">
                          {variantPricing.length} variant{variantPricing.length !== 1 ? 's' : ''}
                        </div>
                        <div className="space-y-1 max-h-96 overflow-y-auto">
                          {(() => {
                            // Filter variants based on search and option filters
                            let filtered = variantPricing;
                            
                            // Apply search filter
                            if (variantSearchQuery.trim()) {
                              const query = variantSearchQuery.toLowerCase();
                              filtered = filtered.filter((v) => {
                                const label = getVariantCompactLabel(v).toLowerCase();
                                return label.includes(query);
                              });
                            }
                            
                            // Apply option filters
                            Object.entries(variantOptionFilters).forEach(([key, value]) => {
                              if (value) {
                                filtered = filtered.filter((v) => {
                                  const variantValue = (v as any)[key];
                                  return typeof variantValue === 'string' && variantValue.trim() === value;
                                });
                              }
                            });
                            
                            return filtered.map((variant, index) => {
                              const actualIndex = variantPricing.indexOf(variant);
                              const isSelected = selectedVariantIndex === actualIndex;
                              return (
                                <button
                                  key={actualIndex}
                                  type="button"
                                  onClick={() => setSelectedVariantIndex(actualIndex)}
                                  className={`w-full flex items-center gap-2 px-2 py-2 rounded-md text-left transition-colors ${
                                    isSelected 
                                      ? 'bg-gray-100 border border-gray-300' 
                                      : 'hover:bg-gray-50 border border-transparent'
                                  }`}
                                >
                                  {variant.image ? (
                                    <img
                                      src={variant.image}
                                      alt={getVariantCompactLabel(variant)}
                                      className="w-8 h-8 rounded object-cover"
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                      }}
                                    />
                                  ) : (
                                    <div className="w-8 h-8 rounded bg-gray-100 border border-gray-200 flex items-center justify-center">
                                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                      </svg>
                                    </div>
                                  )}
                                  <span className="text-sm text-gray-900 flex-1 truncate">
                                    {getVariantCompactLabel(variant)}
                                  </span>
                                </button>
                              );
                            });
                          })()}
                        </div>
                      </div>
                    </div>

                    {/* Right Panel - Variant Detail Editor */}
                    <div className="lg:col-span-2 border border-gray-200 rounded-lg bg-white p-6">
                      {selectedVariantIndex !== null && variantPricing[selectedVariantIndex] ? (
                        (() => {
                          const variant = variantPricing[selectedVariantIndex];
                          const index = selectedVariantIndex;
                          return (
                            <>
                              {/* Variant Image Upload */}
                              <div className="mb-6">
                                <div className="flex items-start gap-4">
                                  <div className="relative">
                                    {variant.image ? (
                                      <img
                                        src={variant.image}
                                        alt={getVariantCompactLabel(variant)}
                                        className="w-32 h-32 rounded-lg border-2 border-gray-200 object-cover"
                                      />
                                    ) : (
                                      <div className="w-32 h-32 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                      </div>
                                    )}
                                    <label className="absolute inset-0 cursor-pointer">
                                      <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={async (e) => {
                                          const file = e.target.files?.[0];
                                          if (!file) return;
                                          setUploadingVariantImageIndex(index);
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
                                            setUploadingVariantImageIndex(null);
                                            e.target.value = '';
                                          }
                                        }}
                                      />
                                    </label>
                                    {uploadingVariantImageIndex === index && (
                                      <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                                        <div className="text-white text-xs">Uploading...</div>
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <h5 className="text-lg font-medium text-gray-900 mb-1">
                                      {getVariantCompactLabel(variant)}
                                    </h5>
                                    <p className="text-sm text-gray-500">Click image to upload or change</p>
                                  </div>
                                </div>
                              </div>

                              {/* Variant Option Fields */}
                              <div className="space-y-4 mb-6">
                                {getVariantOptionDefs().map((opt) => {
                                  const value = (variant as any)[opt.key] || '';
                                  return (
                                    <div key={opt.key}>
                                      <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{opt.label}</label>
                                      <input
                                        type="text"
                                        value={value}
                                        onChange={(e) => {
                                          const newVariants = [...variantPricing];
                                          newVariants[index] = { ...variant, [opt.key]: e.target.value };
                                          setVariantPricing(newVariants);
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder={`Enter ${opt.label.toLowerCase()}`}
                                      />
                                    </div>
                                  );
                                })}
                              </div>

                              {/* Price */}
                              <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                                <div className="relative">
                                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                                  <input
                                    type="number"
                                    value={variant.price || 0}
                                    onChange={(e) => {
                                      const newVariants = [...variantPricing];
                                      newVariants[index] = { ...variant, price: Number(e.target.value) };
                                      setVariantPricing(newVariants);
                                    }}
                                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="0.00"
                                    min="0"
                                    step="0.01"
                                  />
                                </div>
                              </div>

                              {/* Stock */}
                              <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                                <input
                                  type="number"
                                  value={variant.stockQty || 0}
                                  onChange={(e) => {
                                    const newVariants = [...variantPricing];
                                    newVariants[index] = {
                                      ...variant,
                                      stockQty: Number(e.target.value),
                                      inStock: Number(e.target.value) > 0,
                                    };
                                    setVariantPricing(newVariants);
                                  }}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  placeholder="0"
                                  min="0"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                  Status: <span className={variant.inStock ? 'text-green-600' : 'text-red-600'}>
                                    {variant.inStock ? 'In Stock' : 'Out of Stock'}
                                  </span>
                                </p>
                              </div>

                              {/* Remove Button */}
                              <div className="pt-4 border-t border-gray-200">
                                <button
                                  type="button"
                                  onClick={() => {
                                    removeVariantCombination(index);
                                    if (selectedVariantIndex === index) {
                                      setSelectedVariantIndex(variantPricing.length > 1 ? Math.max(0, index - 1) : null);
                                    } else if (selectedVariantIndex !== null && selectedVariantIndex > index) {
                                      setSelectedVariantIndex(selectedVariantIndex - 1);
                                    }
                                  }}
                                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                                >
                                  Remove variant
                                </button>
                              </div>
                            </>
                          );
                        })()
                      ) : (
                        <div className="text-center py-12">
                          <svg className="mx-auto w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="text-gray-500 text-sm">Select a variant from the list to edit</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Add New Variant Section - Shopify-style for all categories */}
                  <div className="mt-6 border border-gray-200 rounded-lg bg-gray-50 p-4">
                    <h5 className="font-medium text-gray-800 mb-4">Add New Variant</h5>
                    
                    {/* Shopify-style Options */}
                    <div className="space-y-6 mb-6">
                      {editShopifyOptions.map((opt, optIdx) => (
                        <div key={opt.key} className="border border-gray-200 rounded-lg p-4 bg-white">
                          <div className="flex items-center justify-between gap-3 mb-3">
                            <div className="flex-1">
                              <label className="block text-sm font-medium text-gray-700 mb-1">Option name</label>
                              <input
                                type="text"
                                value={opt.name}
                                onChange={(e) => {
                                  const next = [...editShopifyOptions];
                                  next[optIdx] = { ...opt, name: e.target.value };
                                  setEditShopifyOptions(next);
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g., Size"
                              />
                            </div>
                            {optIdx > 0 && (
                              <button
                                type="button"
                                onClick={() => setEditShopifyOptions(editShopifyOptions.filter((_, i) => i !== optIdx))}
                                className="text-sm text-red-600 hover:text-red-700 mt-6"
                              >
                                Delete
                              </button>
                            )}
                          </div>

                          <label className="block text-sm font-medium text-gray-700 mb-2">Option values</label>
                          <div className="space-y-2">
                            {opt.values.map((value, valIdx) => (
                              <div key={valIdx} className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={value}
                                  onChange={(e) => {
                                    const next = [...editShopifyOptions];
                                    const values = [...opt.values];
                                    values[valIdx] = e.target.value;
                                    const trimmed = values.map((v) => v.trim());
                                    if (trimmed[trimmed.length - 1] !== '') values.push('');
                                    next[optIdx] = { ...opt, values };
                                    setEditShopifyOptions(next);
                                  }}
                                  placeholder={valIdx === 0 ? 'e.g., 10mm' : 'Add another value'}
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {(opt.values.length > 1 || value.trim() !== '') && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const next = [...editShopifyOptions];
                                      const values = [...opt.values];
                                      values.splice(valIdx, 1);
                                      if (values.length === 0) values.push('');
                                      const trimmed = values.map((v) => v.trim());
                                      if (trimmed[trimmed.length - 1] !== '') values.push('');
                                      next[optIdx] = { ...opt, values };
                                      setEditShopifyOptions(next);
                                    }}
                                    className="px-2 py-2 text-gray-500 hover:text-gray-700"
                                    aria-label="Remove value"
                                  >
                                    ×
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}

                      {editShopifyOptions.length < 5 && (
                        <button
                          type="button"
                          onClick={() => {
                            // Find next available key
                            const usedKeys = editShopifyOptions.map(o => o.key);
                            const availableKeys: Array<'size' | 'pack' | 'color' | 'quality' | 'quantity'> = ['size', 'pack', 'color', 'quality', 'quantity'];
                            const nextKey = availableKeys.find(k => !usedKeys.includes(k));
                            if (nextKey) {
                              setEditShopifyOptions([...editShopifyOptions, { key: nextKey, name: nextKey.charAt(0).toUpperCase() + nextKey.slice(1), values: [''] }]);
                            }
                          }}
                          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                        >
                          + Add another option
                        </button>
                      )}
                    </div>

                    {/* Price and Stock */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
                    </div>

                    {/* Add Variant Button */}
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={addVariantCombination}
                        className="bg-primary-500 text-white px-4 py-2 rounded-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
                      >
                        Add Variant
                      </button>
                    </div>
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


