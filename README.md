# Alternate Enterprises - Premium Luxury Tobacco Exports

A premium showcase website for Alternate Enterprises featuring Firebase-powered product and inquiry management.

## 🏗️ Architecture

This is a **lightweight, production-ready** Next.js application using:

- **Next.js 15** with App Router
- **Firebase** (App, Firestore, Storage only)
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Framer Motion** for animations

### Firebase Services Used

✅ **Enabled:**
- Firebase App (initialization)
- Firestore Database (product & inquiry storage)
- Firebase Storage (product images & assets)

❌ **NOT Used:**
- Firebase Authentication
- Firebase Analytics
- Firebase Hosting

## 📁 Project Structure

```
/app              - Next.js App Router pages
/components       - Reusable React components
/hooks            - Custom React hooks
/lib              - Firebase initialization
/services         - Firebase utilities
  ├── firestore/  - Firestore operations
  └── storage/    - Firebase Storage operations
/public           - Static assets
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Firebase

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📊 Firestore Collections

### `products`
- `productId` - Unique product identifier
- `name` - Product name
- `category` - Product category
- `description` - Detailed description
- `nicotine` - Nicotine content
- `sugar` - Sugar content
- `color` - Color description
- `body` - Body strength
- `grade` - Quality grade
- `featured` - Featured status (boolean)
- `imageUrl` - Firebase Storage image URL
- `createdAt` - Timestamp

### `contact_inquiries`
- `name` - Inquirer name
- `company` - Company name
- `email` - Email address
- `phone` - Phone number
- `country` - Country
- `inquiryType` - Type of inquiry
- `message` - Message content
- `createdAt` - Timestamp

## 🛠️ Core Services

### Firestore Services (`/services/firestore/products.ts`)

```typescript
// Get all products
await getProducts()

// Get featured products
await getFeaturedProducts(limit)

// Get products by category
await getProductsByCategory(category)

// Get single product
await getProductById(productId)

// Search products
await searchProducts(searchTerm)

// Add contact inquiry
await addContactInquiry(inquiryData)
```

### Storage Services (`/services/storage/storage.ts`)

```typescript
// Upload product image
await uploadProductImage(file, productId)

// Upload asset (texture, hero, etc.)
await uploadAsset(file, assetType)

// Get download URL
await getDownloadUrl(path)

// Delete file
await deleteFile(path)
```

## 🎨 Components

- **Header** - Site header with branding
- **Footer** - Footer with company info
- **FeaturedProducts** - Animated product grid
- **ContactForm** - Premium contact form with Firestore integration
- **SkeletonLoader** - Loading state component
- **ErrorDisplay** - Error message component
- **SuccessMessage** - Success notification

## 🎯 Hooks

- **useProducts** - Fetch all products
- **useFeaturedProducts** - Fetch featured products
- **useProductsByCategory** - Fetch products by category
- **useContactForm** - Handle contact form submission

## 🚢 Deployment

### Build for Production

```bash
npm run build
npm start
```

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

## 🔒 Security Rules (Firestore)

```javascript
// Allow read access to products
match /products/{document=**} {
  allow read: if request.auth != null;
}

// Allow write to contact_inquiries (client-side submission)
match /contact_inquiries/{document=**} {
  allow create: if request.resource.data.size() > 0;
}
```

## 📝 Environment Variables

All Firebase configuration is stored in environment variables:

```env
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
```

## 🎬 Features

✨ Premium animations with Framer Motion
🎨 Elegant Tailwind CSS styling
📱 Fully responsive design
⚡ Server Components where possible
🔄 Smooth loading states
🎯 Type-safe with TypeScript
🚀 Optimized images with Next.js
📊 Firestore-powered content management

## 📄 License

Proprietary - Alternate Enterprises
