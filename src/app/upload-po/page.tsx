'use client';

import { useState } from 'react';
import { Upload, FileText, Building2, MapPin, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

export default function UploadPOPage() {
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    gstin: '',
    poNumber: '',
    itemDescription: '',
    notes: '',
  });
  
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [uploadMethod, setUploadMethod] = useState<'file' | 'description'>('file');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(selectedFile.type)) {
        setSubmitStatus({ type: 'error', message: 'Please upload a PDF or image file (JPG, PNG, WEBP)' });
        return;
      }
      
      // Validate file size (10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setSubmitStatus({ type: 'error', message: 'File size must be less than 10MB' });
        return;
      }
      
      setFile(selectedFile);
      setSubmitStatus(null);
      
      // Create preview for images
      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreview(e.target?.result as string);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        setPreview(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.companyName || !formData.contactPerson || !formData.email || !formData.phone) {
      setSubmitStatus({ type: 'error', message: 'Please fill in all required fields' });
      return;
    }
    
    // Validate based on upload method
    if (uploadMethod === 'file' && !file) {
      setSubmitStatus({ type: 'error', message: 'Please upload a Purchase Order file or switch to description mode' });
      return;
    }
    
    if (uploadMethod === 'description' && !formData.itemDescription.trim()) {
      setSubmitStatus({ type: 'error', message: 'Please provide item description or upload a file' });
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('companyName', formData.companyName);
      uploadFormData.append('contactPerson', formData.contactPerson);
      uploadFormData.append('email', formData.email);
      uploadFormData.append('phone', formData.phone);
      uploadFormData.append('address', formData.address);
      uploadFormData.append('city', formData.city);
      uploadFormData.append('state', formData.state);
      uploadFormData.append('postalCode', formData.postalCode);
      uploadFormData.append('gstin', formData.gstin);
      uploadFormData.append('poNumber', formData.poNumber);
      uploadFormData.append('itemDescription', formData.itemDescription);
      uploadFormData.append('notes', formData.notes);
      if (file) {
        uploadFormData.append('poFile', file);
      }
      
      const response = await fetch('/api/po/upload', {
        method: 'POST',
        body: uploadFormData,
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSubmitStatus({ 
          type: 'success', 
          message: 'Purchase Order submitted successfully! We will review it and get back to you soon.' 
        });
        // Reset form
        setFormData({
          companyName: '',
          contactPerson: '',
          email: '',
          phone: '',
          address: '',
          city: '',
          state: '',
          postalCode: '',
          gstin: '',
          poNumber: '',
          itemDescription: '',
          notes: '',
        });
        setFile(null);
        setPreview(null);
        const fileInput = document.getElementById('poFile') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      } else {
        setSubmitStatus({ 
          type: 'error', 
          message: data.error || 'Failed to submit Purchase Order. Please try again.' 
        });
      }
    } catch (error) {
      console.error('Submit error:', error);
      setSubmitStatus({ 
        type: 'error', 
        message: 'An error occurred. Please try again later.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 rounded-full p-4">
              <FileText className="h-12 w-12 text-blue-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Purchase Order</h1>
          <p className="text-gray-600">
            Submit your Purchase Order for bulk orders and offline transactions
          </p>
        </div>

        {/* Success/Error Message */}
        {submitStatus && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
            submitStatus.type === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {submitStatus.type === 'success' ? (
              <CheckCircle className="h-5 w-5 flex-shrink-0" />
            ) : (
              <XCircle className="h-5 w-5 flex-shrink-0" />
            )}
            <p>{submitStatus.message}</p>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Company Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Company Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter company name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Person <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Contact person name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="company@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+91 9876543210"
                  />
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Address Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Street address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="City"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="State"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="PIN code"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    GSTIN (Optional)
                  </label>
                  <input
                    type="text"
                    name="gstin"
                    value={formData.gstin}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="GSTIN number"
                  />
                </div>
              </div>
            </div>

            {/* Purchase Order Details */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Purchase Order Details
              </h2>
              
              {/* Upload Method Toggle */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How would you like to submit your PO?
                </label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setUploadMethod('file');
                      setFile(null);
                      setPreview(null);
                    }}
                    className={`flex-1 px-4 py-3 rounded-lg border-2 transition-colors ${
                      uploadMethod === 'file'
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    <Upload className="h-5 w-5 mx-auto mb-1" />
                    <span className="text-sm font-medium">Upload File</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setUploadMethod('description');
                      setFile(null);
                      setPreview(null);
                      const fileInput = document.getElementById('poFile') as HTMLInputElement;
                      if (fileInput) fileInput.value = '';
                    }}
                    className={`flex-1 px-4 py-3 rounded-lg border-2 transition-colors ${
                      uploadMethod === 'description'
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    <FileText className="h-5 w-5 mx-auto mb-1" />
                    <span className="text-sm font-medium">Enter Description</span>
                  </button>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    PO Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="poNumber"
                    value={formData.poNumber}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="PO-2024-001"
                  />
                </div>
                
                {uploadMethod === 'file' ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Upload Purchase Order <span className="text-red-500">*</span>
                    </label>
                  <div className="mt-2">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="h-8 w-8 text-gray-400 mb-2" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PDF, PNG, JPG or WEBP (MAX. 10MB)</p>
                      </div>
                      <input
                        id="poFile"
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg,.webp"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  
                  {file && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="h-5 w-5 text-blue-600" />
                          <span className="text-sm font-medium text-gray-900">{file.name}</span>
                          <span className="text-xs text-gray-500">
                            ({(file.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setFile(null);
                            setPreview(null);
                            const fileInput = document.getElementById('poFile') as HTMLInputElement;
                            if (fileInput) fileInput.value = '';
                          }}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>
                      {preview && (
                        <div className="mt-4">
                          <img
                            src={preview}
                            alt="PO Preview"
                            className="max-w-full h-auto rounded-lg border border-gray-200"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Item Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="itemDescription"
                      value={formData.itemDescription}
                      onChange={handleInputChange}
                      rows={6}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Please describe the items you need, including:
• Product names/types
• Quantities
• Sizes, colors, or specifications
• Any special requirements

Example:
- Metal Buttons 18mm, Black, 5 gross
- Zippers 12 inch, White, 10 pieces
- Elastic Cord, 5mm, 50 meters"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Provide detailed information about the products you want to order
                    </p>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Any special instructions or requirements..."
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-5 w-5" />
                    <span>Submit Purchase Order</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">What happens next?</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>✓ We&apos;ll review your Purchase Order within 24-48 hours</li>
            <li>✓ Our team will contact you to confirm details and pricing</li>
            <li>✓ Once approved, we&apos;ll process your order and provide delivery timeline</li>
            <li>✓ You can track your order status in the admin panel</li>
          </ul>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

