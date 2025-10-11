export default function AdminHome() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <ul className="list-disc pl-6 space-y-2">
        <li><a href="/admin/orders" className="text-blue-600 hover:underline">Manage Orders</a></li>
        <li><a href="/admin/products" className="text-blue-600 hover:underline">Manage Products</a></li>
      </ul>
    </div>
  );
}








