'use client';

import { useEffect, useState } from 'react';

interface AdminProductForm {
  name: string;
  description?: string;
  price: number;
  category: string;
  image?: string;
  sizes?: string;
  colors?: string;
  packs?: string;
}

interface AdminProductRow {
  _id: string;
  name: string;
  category: string;
  price: number;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<AdminProductForm>({ name: '', price: 0, category: 'buttons', description: '', image: '', sizes: '', colors: '', packs: '' });

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
      sizes: form.sizes ? form.sizes.split(',').map(s => s.trim()) : [],
      colors: form.colors ? form.colors.split(',').map(s => s.trim()) : [],
      packs: form.packs ? form.packs.split(',').map(s => s.trim()) : [],
    };
    const res = await fetch('/api/admin/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (res.ok) {
      setForm({ name: '', price: 0, category: 'buttons', description: '', image: '', sizes: '', colors: '', packs: '' });
      load();
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
    if (res.ok) load();
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
          <input className="border rounded px-3 py-2" placeholder="Sizes (comma separated)" value={form.sizes} onChange={(e) => setForm({ ...form, sizes: e.target.value })} />
          <input className="border rounded px-3 py-2" placeholder="Colors (comma separated)" value={form.colors} onChange={(e) => setForm({ ...form, colors: e.target.value })} />
          <input className="border rounded px-3 py-2" placeholder="Packs (comma separated)" value={form.packs} onChange={(e) => setForm({ ...form, packs: e.target.value })} />
        </div>
        <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded" onClick={createProduct}>Create</button>
      </div>

      {loading ? <p>Loading...</p> : (
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Category</th>
                <th className="p-2 border">Price</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p._id}>
                  <td className="p-2 border">{p.name}</td>
                  <td className="p-2 border">{p.category}</td>
                  <td className="p-2 border">₹{p.price}</td>
                  <td className="p-2 border">
                    <button className="px-2 py-1 border rounded text-sm text-red-600" onClick={() => remove(p._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}


