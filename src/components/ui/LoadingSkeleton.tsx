export default function LoadingSkeleton() {
  return (
    <div className="min-h-screen">
      {/* Hero Section Skeleton */}
      <section className="relative h-[600px] flex items-center bg-gray-200 animate-pulse">
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="h-16 bg-gray-300 rounded mb-6 mx-auto max-w-4xl"></div>
          <div className="h-8 bg-gray-300 rounded mb-8 mx-auto max-w-3xl"></div>
          <div className="h-12 bg-gray-300 rounded mx-auto w-64"></div>
        </div>
      </section>

      {/* Categories Skeleton */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="h-8 bg-gray-300 rounded mb-12 mx-auto w-80"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white p-6 sm:p-8 rounded-lg shadow-md">
                <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4"></div>
                <div className="h-6 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Skeleton */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="h-8 bg-gray-300 rounded mb-12 mx-auto w-80"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-gray-300"></div>
                <div className="p-4">
                  <div className="h-6 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2 w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
                <div className="px-4 pb-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="h-10 bg-gray-300 rounded"></div>
                    <div className="h-10 bg-gray-300 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
