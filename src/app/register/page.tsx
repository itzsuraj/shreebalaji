// COMMENTED OUT - User registration disabled
// Keeping phone + order ID tracking only

// Simple redirect to track order page
export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Registration Disabled</h2>
          <p className="mt-2 text-gray-600">
            We use phone number + order ID tracking for simplicity.
          </p>
          <div className="mt-6">
            <a
              href="/track-order"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Track Your Order
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}