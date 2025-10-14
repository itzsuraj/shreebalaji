'use client';

import { useEffect, useState } from 'react';

interface AdminProductForm {
  name: string;
  description?: string;
  price: number;
  category: string;
  image?: string;
  stockQty?: number;
  sizes?: string[];
  colors?: string[];
  packs?: string[];
  variantPricing?: Array<{
    size?: string;
    color?: string;
    pack?: string;
    price: number;
    stockQty?: number;
    inStock?: boolean;
    sku?: string;
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
  stockQty?: number;
  sizes?: string[];
  colors?: string[];
  packs?: string[];
  variantPricing?: Array<{
    size?: string;
    color?: string;
    pack?: string;
    price: number;
    stockQty?: number;
    inStock?: boolean;
    sku?: string;
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
    sizes: [], 
    colors: [], 
    packs: [] 
  });
  const [variantPricing, setVariantPricing] = useState<Array<{
    size?: string;
    color?: string;
    pack?: string;
    price: number;
    stockQty?: number;
    inStock?: boolean;
    sku?: string;
  }>>([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  // New variant dropdown states
  const [newVariant, setNewVariant] = useState({
    size: '',
    color: '',
    pack: '',
    price: 0,
    stockQty: 0,
    sku: ''
  });

  const load = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/products');
    const data = await res.json();
    setProducts(data.products || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const createProduct = async () => {
    const payload = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      category: form.category,
      image: form.image,
      stockQty: Number(form.stockQty || 0),
      variantPricing: variantPricing.length > 0 ? variantPricing : undefined,
    };
    const res = await fetch('/api/admin/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (res.ok) {
      setForm({ 
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
      setNewVariant({ size: '', color: '', pack: '', price: 0, stockQty: 0, sku: '' });
      load();
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
    if (res.ok) load();
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
      sizes: product.sizes || [],
      colors: product.colors || [],
      packs: product.packs || []
    });
    setVariantPricing(product.variantPricing || []);
    setNewVariant({ size: '', color: '', pack: '', price: 0, stockQty: 0, sku: '' });
  };

  const updateProduct = async () => {
    if (!editingProduct) return;
    
    const payload = {
      name: editForm.name,
      description: editForm.description,
      price: Number(editForm.price),
      category: editForm.category,
      image: editForm.image,
       stockQty: Number(editForm.stockQty || 0),
      variantPricing: variantPricing.length > 0 ? variantPricing : undefined,
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
        sizes: [], 
        colors: [], 
        packs: [] 
      });
      setVariantPricing([]);
      setNewVariant({ size: '', color: '', pack: '', price: 0, stockQty: 0, sku: '' });
      load();
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
    setNewVariant({ size: '', color: '', pack: '', price: 0, stockQty: 0, sku: '' });
  };


  const handleImageUpload = async (file: File) => {
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fetch('/api/admin/upload-image', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const data = await response.json();
        setForm({ ...form, image: data.imageUrl });
        setImagePreview(data.imageUrl);
      } else {
        alert('Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleImageRemove = () => {
    setForm({ ...form, image: '' });
    setImagePreview(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      
      handleImageUpload(file);
    }
  };

  // New variant dropdown functions
         const addVariantCombination = () => {
    if (!newVariant.size || !newVariant.color || !newVariant.pack || newVariant.price <= 0) {
      alert('Please fill all fields and set a valid price');
      return;
    }

    const combination = {
      size: newVariant.size,
      color: newVariant.color,
      pack: newVariant.pack,
             price: newVariant.price,
             stockQty: Number(newVariant.stockQty || 0)
    };

    // Check if combination already exists
    const exists = variantPricing.some(v => 
      v.size === combination.size && 
      v.color === combination.color && 
      v.pack === combination.pack
    );

    if (exists) {
      alert('This combination already exists');
      return;
    }

    setVariantPricing([...variantPricing, combination]);
           setNewVariant({ size: '', color: '', pack: '', price: 0, stockQty: 0, sku: '' });
  };

  const removeVariantCombination = (index: number) => {
    setVariantPricing(variantPricing.filter((_, i) => i !== index));
  };

  const migrateStockFields = async () => {
    if (!confirm('This will add default stock values to all products without stock fields. Continue?')) return;
    
    try {
      const res = await fetch('/api/admin/migrate-stock', { method: 'POST' });
      const data = await res.json();
      
      if (data.success) {
        alert(data.message);
        load(); // Refresh the product list
      } else {
        alert('Migration failed: ' + data.error);
      }
    } catch (error) {
      console.error('Migration error:', error);
      alert('Migration failed');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Products</h1>
        <button
          onClick={migrateStockFields}
          className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 text-sm"
        >
          Migrate Stock Fields
        </button>
      </div>

      <div className="border rounded p-4 mb-8">
        <h2 className="font-semibold mb-3">Create Product</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input className="border rounded px-3 py-2" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className="border rounded px-3 py-2" placeholder="Price" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
          <input className="border rounded px-3 py-2" placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          <input className="border rounded px-3 py-2" placeholder="Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
                <input className="border rounded px-3 py-2" placeholder="Stock Quantity" type="number" value={form.stockQty || 0} onChange={(e) => setForm({ ...form, stockQty: Number(e.target.value) })} />
          <input className="border rounded px-3 py-2 md:col-span-2" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>

        {/* Image Upload Section */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
          <div className="space-y-4">
            {/* Image Preview */}
            {(form.image || imagePreview) && (
              <div className="relative inline-block">
                <img
                  src={form.image || imagePreview || ''}
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
            )}

            {/* Upload Options */}
            <div className="flex space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Upload Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={uploadingImage}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {uploadingImage && (
                  <div className="mt-2 text-sm text-blue-600">Uploading...</div>
                )}
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Or Enter URL</label>
                <input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={form.image}
                  onChange={(e) => {
                    setForm({ ...form, image: e.target.value });
                    setImagePreview(e.target.value);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Variant Pricing System */}
        <div className="mt-4 space-y-4">
          <h3 className="font-semibold text-gray-700">Product Variants with Pricing</h3>
          
          {/* Add New Variant Combination */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-800 mb-3">Add Variant Combination</h4>
                   <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
                <select
                  value={newVariant.size}
                  onChange={(e) => setNewVariant({ ...newVariant, size: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Size</option>
                  <option value="10mm (16L)">10mm (16L)</option>
                  <option value="11mm (18L)">11mm (18L)</option>
                  <option value="12mm (20L)">12mm (20L)</option>
                  <option value="15mm (24L)">15mm (24L)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                <select
                  value={newVariant.color}
                  onChange={(e) => setNewVariant({ ...newVariant, color: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Color</option>
                  <option value="Brown">Brown</option>
                  <option value="Black">Black</option>
                  <option value="White">White</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pack</label>
                <select
                  value={newVariant.pack}
                  onChange={(e) => setNewVariant({ ...newVariant, pack: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Pack</option>
                  <option value="24 Pieces">24 Pieces</option>
                  <option value="200 Pieces">200 Pieces</option>
                </select>
              </div>
              
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
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Display Added Variants */}
          {variantPricing.length > 0 && (
            <div className="bg-white border rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-3">Added Variants ({variantPricing.length})</h4>
              <div className="space-y-2">
                {variantPricing.map((variant, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                    <div className="flex items-center space-x-4">
                      <span className="text-sm font-medium">{variant.size}</span>
                      <span className="text-sm text-gray-600">{variant.color}</span>
                      <span className="text-sm text-gray-600">{variant.pack}</span>
                      <span className="text-sm font-bold text-green-600">₹{variant.price}</span>
                      <div className="flex items-center space-x-2">
                        <label className="text-xs text-gray-500">Stock:</label>
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
                        <span className={`text-xs px-2 py-1 rounded-full ${variant.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {variant.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeVariantCombination(index)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded" onClick={createProduct}>Create</button>
      </div>

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
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Seed Products
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">All Products ({products.length})</h2>
            <button 
              onClick={load}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
            >
              Refresh
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map(product => (
              <div key={product._id} className="bg-white border rounded-lg p-4 shadow-sm">
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
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">₹{product.price}</div>
                        <div className={`text-xs px-2 py-1 rounded-full ${
                          product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {product.inStock ? 'In Stock' : 'Out of Stock'}
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
                                 {variant.size} - {variant.color} - {variant.pack}: ₹{variant.price} {typeof variant.stockQty === 'number' ? `(Stock: ${variant.stockQty})` : ''}
                        </div>
                      ))}
                      {product.variantPricing.length > 3 && (
                        <div className="text-xs text-gray-400">+{product.variantPricing.length - 3} more...</div>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-xs text-gray-500">
                    ID: {product._id.slice(-8)}
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => startEdit(product)}
                      className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => remove(product._id)}
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
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                    <input
                      type="url"
                      value={editForm.image}
                      onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter image URL"
                    />
                  </div>
                </div>

                {/* Image Upload Section for Edit */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
                  <div className="space-y-4">
                    {/* Image Preview */}
                    {editForm.image && (
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
                    )}

                    {/* Upload Options */}
                    <div className="flex space-x-4">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Upload New Image</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              if (!file.type.startsWith('image/')) {
                                alert('Please select an image file');
                                return;
                              }
                              if (file.size > 5 * 1024 * 1024) {
                                alert('File size must be less than 5MB');
                                return;
                              }
                              handleImageUpload(file);
                            }
                          }}
                          disabled={uploadingImage}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        {uploadingImage && (
                          <div className="mt-2 text-sm text-blue-600">Uploading...</div>
                        )}
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Or Enter URL</label>
                        <input
                          type="url"
                          placeholder="https://example.com/image.jpg"
                          value={editForm.image}
                          onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
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
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
                        <select
                          value={newVariant.size}
                          onChange={(e) => setNewVariant({ ...newVariant, size: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select Size</option>
                          <option value="10mm (16L)">10mm (16L)</option>
                          <option value="11mm (18L)">11mm (18L)</option>
                          <option value="12mm (20L)">12mm (20L)</option>
                          <option value="15mm (24L)">15mm (24L)</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                        <select
                          value={newVariant.color}
                          onChange={(e) => setNewVariant({ ...newVariant, color: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select Color</option>
                          <option value="Brown">Brown</option>
                          <option value="Black">Black</option>
                          <option value="White">White</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Pack</label>
                        <select
                          value={newVariant.pack}
                          onChange={(e) => setNewVariant({ ...newVariant, pack: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select Pack</option>
                          <option value="24 Pieces">24 Pieces</option>
                          <option value="200 Pieces">200 Pieces</option>
                        </select>
                      </div>
                      
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
                      
                      <div className="flex items-end">
                        <button
                          type="button"
                          onClick={addVariantCombination}
                          className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Display Added Variants */}
                  {variantPricing.length > 0 && (
                    <div className="bg-white border rounded-lg p-4">
                      <h5 className="font-medium text-gray-800 mb-3">Added Variants ({variantPricing.length})</h5>
                      <div className="space-y-2">
                        {variantPricing.map((variant, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                            <div className="flex items-center space-x-4">
                              <span className="text-sm font-medium">{variant.size}</span>
                              <span className="text-sm text-gray-600">{variant.color}</span>
                              <span className="text-sm text-gray-600">{variant.pack}</span>
                              <span className="text-sm font-bold text-green-600">₹{variant.price}</span>
                              <div className="flex items-center space-x-2">
                                <label className="text-xs text-gray-500">Stock:</label>
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
                                <span className={`text-xs px-2 py-1 rounded-full ${variant.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                  {variant.inStock ? 'In Stock' : 'Out of Stock'}
                                </span>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeVariantCombination(index)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
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
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Update Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


