export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="mb-6 flex gap-4">
        <a href="/admin" className="text-blue-600 hover:underline">Dashboard</a>
        <a href="/admin/orders" className="text-blue-600 hover:underline">Orders</a>
        <a href="/admin/products" className="text-blue-600 hover:underline">Products</a>
        <form action="/api/admin/logout" method="post" className="ml-auto">
          <button className="text-red-600">Logout</button>
        </form>
      </nav>
      {children}
    </div>
  );
}







