# Vercel Blob Storage Setup

This project uses Vercel Blob Storage for image uploads to handle the read-only filesystem limitation on Vercel's serverless functions.

## Setup Instructions

### 1. Create Blob Store in Vercel

1. Go to your Vercel Dashboard: https://vercel.com/dashboard
2. Select your project (`balajisphere` or your project name)
3. Navigate to the **Storage** tab
4. Click **Create Database/Store**
5. Select **Blob** as the storage type
6. Give it a name (e.g., `product-images`)
7. Click **Create**

### 2. Get the Access Token

After creating the Blob store, Vercel will automatically generate a `BLOB_READ_WRITE_TOKEN` environment variable.

### 3. Add Environment Variable

1. In your Vercel project, go to **Settings** > **Environment Variables**
2. The `BLOB_READ_WRITE_TOKEN` should already be there automatically
3. If not, you can find it in the Blob store settings
4. Make sure it's available for **Production**, **Preview**, and **Development** environments

### 4. Verify Setup

After deploying, try uploading an image in the admin panel. It should:
- Upload successfully to Vercel Blob Storage
- Return a URL like: `https://[random].public.blob.vercel-storage.com/uploads/[filename]`
- Display correctly in the product detail pages

## How It Works

- **Production (Vercel)**: Images are uploaded to Vercel Blob Storage automatically
- **Local Development**: Falls back to local disk storage (`public/uploads/`) if `BLOB_READ_WRITE_TOKEN` is not set

## Troubleshooting

### Error: "Server storage is read-only"
- Make sure you've created a Blob store in Vercel
- Verify `BLOB_READ_WRITE_TOKEN` is set in Vercel environment variables
- Redeploy your application after adding the environment variable

### Images not displaying
- Check that the Blob URL is in the correct format
- Verify Next.js image configuration allows `*.public.blob.vercel-storage.com` domain
- Check browser console for any CORS or loading errors

## Cost

Vercel Blob Storage pricing:
- Free tier: 1 GB storage, 100 GB bandwidth/month
- Paid plans: See https://vercel.com/pricing for current pricing

## Migration

Existing images in `public/uploads/` will continue to work. New uploads will go to Vercel Blob Storage.
