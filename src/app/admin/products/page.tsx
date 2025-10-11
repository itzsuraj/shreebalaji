'use client';

import { useEffect, useState } from 'react';

interface AdminProductForm {
  name: string;
  description?: string;
  price: number;
  category: string;
  image?: string;
  sizes?: string[];
  colors?: string[];
  packs?: string[];
  variantPricing?: Array<{
    size?: string;
    color?: string;
    pack?: string;
    price: number;
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
  sizes?: string[];
  colors?: string[];
  packs?: string[];
  variantPricing?: Array<{
    size?: string;
    color?: string;
    pack?: string;
    price: number;
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
    sizes: ['10mm (16L)', '11mm (18L)', '12mm (20L)', '15mm (24L)'], 
    colors: ['Brown', 'Black', 'White'], 
    packs: ['24 Pieces', '200 Pieces'] 
  });
  const [editingProduct, setEditingProduct] = useState<AdminProductRow | null>(null);
  const [editForm, setEditForm] = useState<AdminProductForm>({ 
    name: '', 
    price: 0, 
    category: 'buttons', 
    description: '', 
    image: '', 
    sizes: ['10mm (16L)', '11mm (18L)', '12mm (20L)', '15mm (24L)'], 
    colors: ['Brown', 'Black', 'White'], 
    packs: ['24 Pieces', '200 Pieces'] 
  });
  const [showVariantPricing, setShowVariantPricing] = useState(false);
  const [variantPricing, setVariantPricing] = useState<Array<{
    size?: string;
    color?: string;
    pack?: string;
    price: number;
  }>>([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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
      sizes: form.sizes || [],
      colors: form.colors || [],
      packs: form.packs || [],
    };
    const res = await fetch('/api/admin/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (res.ok) {
      setForm({ 
        name: '', 
        price: 0, 
        category: 'buttons', 
        description: '', 
        image: '', 
        sizes: ['10mm (16L)', '11mm (18L)', '12mm (20L)', '15mm (24L)'], 
        colors: ['Brown', 'Black', 'White'], 
        packs: ['24 Pieces', '200 Pieces'] 
      });
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
      sizes: product.sizes || ['10mm (16L)', '11mm (18L)', '12mm (20L)', '15mm (24L)'],
      colors: product.colors || ['Brown', 'Black', 'White'],
      packs: product.packs || ['24 Pieces', '200 Pieces']
    });
    setVariantPricing(product.variantPricing || []);
    setShowVariantPricing((product.variantPricing && product.variantPricing.length > 0) || false);
  };

  const updateProduct = async () => {
    if (!editingProduct) return;
    
    const payload = {
      name: editForm.name,
      description: editForm.description,
      price: Number(editForm.price),
      category: editForm.category,
      image: editForm.image,
      sizes: editForm.sizes || [],
      colors: editForm.colors || [],
      packs: editForm.packs || [],
      variantPricing: showVariantPricing ? variantPricing : undefined,
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
        sizes: ['10mm (16L)', '11mm (18L)', '12mm (20L)', '15mm (24L)'], 
        colors: ['Brown', 'Black', 'White'], 
        packs: ['24 Pieces', '200 Pieces'] 
      });
      setShowVariantPricing(false);
      setVariantPricing([]);
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
      sizes: ['10mm (16L)', '11mm (18L)', '12mm (20L)', '15mm (24L)'], 
      colors: ['Brown', 'Black', 'White'], 
      packs: ['24 Pieces', '200 Pieces'] 
    });
    setShowVariantPricing(false);
    setVariantPricing([]);
  };

  const addVariantPrice = () => {
    setVariantPricing([...variantPricing, { price: 0 }]);
  };

  const removeVariantPrice = (index: number) => {
    setVariantPricing(variantPricing.filter((_, i) => i !== index));
  };

  const updateVariantPrice = (index: number, field: string, value: string | number) => {
    const updated = [...variantPricing];
    updated[index] = { ...updated[index], [field]: value };
    setVariantPricing(updated);
  };

  const generateVariantCombinations = () => {
    const sizes = editForm.sizes || [];
    const colors = editForm.colors || [];
    const packs = editForm.packs || [];

    const combinations: Array<{ size?: string; color?: string; pack?: string; price: number }> = [];
    
    // Generate all possible combinations
    const allSizes = sizes.length > 0 ? sizes : [''];
    const allColors = colors.length > 0 ? colors : [''];
    const allPacks = packs.length > 0 ? packs : [''];

    allSizes.forEach(size => {
      allColors.forEach(color => {
        allPacks.forEach(pack => {
          combinations.push({
            size: size || undefined,
            color: color || undefined,
            pack: pack || undefined,
            price: editForm.price
          });
        });
      });
    });

    setVariantPricing(combinations);
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

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Products</h1>

      <div className="border rounded p-4 mb-8">
        <h2 className="font-semibold mb-3">Create Product</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input className="border rounded px-3 py-2" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className="border rounded px-3 py-2" placeholder="Price" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
          <input className="border rounded px-3 py-2" placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          <input className="border rounded px-3 py-2" placeholder="Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
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
        
        {/* Variant Selection */}
        <div className="mt-4 space-y-4">
          <h3 className="font-semibold text-gray-700">Product Variants</h3>
          
          {/* Sizes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sizes</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {['10mm (16L)', '11mm (18L)', '12mm (20L)', '15mm (24L)'].map(size => (
                <label key={size} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={form.sizes?.includes(size) || false}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setForm({ ...form, sizes: [...(form.sizes || []), size] });
                      } else {
                        setForm({ ...form, sizes: (form.sizes || []).filter(s => s !== size) });
                      }
                    }}
                    className="mr-2"
                  />
                  <span className="text-sm">{size}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Colors</label>
            <div className="grid grid-cols-3 gap-2">
              {['Brown', 'Black', 'White'].map(color => (
                <label key={color} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={form.colors?.includes(color) || false}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setForm({ ...form, colors: [...(form.colors || []), color] });
                      } else {
                        setForm({ ...form, colors: (form.colors || []).filter(c => c !== color) });
                      }
                    }}
                    className="mr-2"
                  />
                  <span className="text-sm">{color}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Packs */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Packs</label>
            <div className="grid grid-cols-2 gap-2">
              {['24 Pieces', '200 Pieces'].map(pack => (
                <label key={pack} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={form.packs?.includes(pack) || false}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setForm({ ...form, packs: [...(form.packs || []), pack] });
                      } else {
                        setForm({ ...form, packs: (form.packs || []).filter(p => p !== pack) });
                      }
                    }}
                    className="mr-2"
                  />
                  <span className="text-sm">{pack}</span>
                </label>
              ))}
            </div>
          </div>
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
                  {product.sizes && product.sizes.length > 0 && (
                    <div className="text-xs">
                      <span className="font-medium text-gray-700">Sizes:</span>
                      <span className="ml-1 text-gray-600">{product.sizes.join(', ')}</span>
                    </div>
                  )}
                  {product.colors && product.colors.length > 0 && (
                    <div className="text-xs">
                      <span className="font-medium text-gray-700">Colors:</span>
                      <span className="ml-1 text-gray-600">{product.colors.join(', ')}</span>
                    </div>
                  )}
                  {product.packs && product.packs.length > 0 && (
                    <div className="text-xs">
                      <span className="font-medium text-gray-700">Packs:</span>
                      <span className="ml-1 text-gray-600">{product.packs.join(', ')}</span>
                    </div>
                  )}
                  {product.variantPricing && product.variantPricing.length > 0 && (
                    <div className="text-xs">
                      <span className="font-medium text-gray-700">Variant Pricing:</span>
                      <span className="ml-1 text-gray-600">{product.variantPricing.length} combinations</span>
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

                {/* Variant Selection for Edit */}
                <div className="mt-4 space-y-4">
                  <h4 className="font-semibold text-gray-700">Product Variants</h4>
                  
                  {/* Sizes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sizes</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {['10mm (16L)', '11mm (18L)', '12mm (20L)', '15mm (24L)'].map(size => (
                        <label key={size} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={editForm.sizes?.includes(size) || false}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setEditForm({ ...editForm, sizes: [...(editForm.sizes || []), size] });
                              } else {
                                setEditForm({ ...editForm, sizes: (editForm.sizes || []).filter(s => s !== size) });
                              }
                            }}
                            className="mr-2"
                          />
                          <span className="text-sm">{size}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Colors */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Colors</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Brown', 'Black', 'White'].map(color => (
                        <label key={color} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={editForm.colors?.includes(color) || false}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setEditForm({ ...editForm, colors: [...(editForm.colors || []), color] });
                              } else {
                                setEditForm({ ...editForm, colors: (editForm.colors || []).filter(c => c !== color) });
                              }
                            }}
                            className="mr-2"
                          />
                          <span className="text-sm">{color}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Packs */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Packs</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['24 Pieces', '200 Pieces'].map(pack => (
                        <label key={pack} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={editForm.packs?.includes(pack) || false}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setEditForm({ ...editForm, packs: [...(editForm.packs || []), pack] });
                              } else {
                                setEditForm({ ...editForm, packs: (editForm.packs || []).filter(p => p !== pack) });
                              }
                            }}
                            className="mr-2"
                          />
                          <span className="text-sm">{pack}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Variant Pricing Section */}
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-medium text-gray-900">Variant Pricing</h4>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => setShowVariantPricing(!showVariantPricing)}
                        className={`px-3 py-1 text-sm rounded-md ${
                          showVariantPricing 
                            ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                        }`}
                      >
                        {showVariantPricing ? 'Disable' : 'Enable'} Variant Pricing
                      </button>
                      {showVariantPricing && (
                        <button
                          type="button"
                          onClick={generateVariantCombinations}
                          className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200"
                        >
                          Auto Generate
                        </button>
                      )}
                    </div>
                  </div>

                  {showVariantPricing && (
                    <div className="space-y-4">
                      <div className="text-sm text-gray-600">
                        Set different prices for different combinations of sizes, colors, and packs.
                      </div>
                      
                      {variantPricing.map((variant, index) => (
                        <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-2">
                            <input
                              type="text"
                              value={variant.size || ''}
                              onChange={(e) => updateVariantPrice(index, 'size', e.target.value)}
                              placeholder="Size"
                              className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            <input
                              type="text"
                              value={variant.color || ''}
                              onChange={(e) => updateVariantPrice(index, 'color', e.target.value)}
                              placeholder="Color"
                              className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            <input
                              type="text"
                              value={variant.pack || ''}
                              onChange={(e) => updateVariantPrice(index, 'pack', e.target.value)}
                              placeholder="Pack"
                              className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            <input
                              type="number"
                              value={variant.price}
                              onChange={(e) => updateVariantPrice(index, 'price', Number(e.target.value))}
                              placeholder="Price"
                              className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeVariantPrice(index)}
                            className="px-2 py-1 text-sm bg-red-100 text-red-600 rounded hover:bg-red-200"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      
                      <button
                        type="button"
                        onClick={addVariantPrice}
                        className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700"
                      >
                        + Add Variant Price
                      </button>
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


