# Product Catalog Seeding Guide

Your product catalog with 39 premium tobacco products has been prepared and is ready to seed into Firestore. Here are your seeding options:

## 📋 What Gets Seeded

- **39 Products** organized into 4 categories:
  - **Flue-Cured Virginia (FCV)** - 12 products
  - **Burley** - 13 products  
  - **Country Blend** - 9 products
  - **Zimbabwe Cured** - 3 products

- **First 6 Products** are automatically marked as **featured**
- Each product includes: name, description, nicotine %, sugar %, color, body, and grade
- Image URLs are initialized as empty (ready for you to add later via Firebase Storage)

---

## 🚀 Option 1: Easy Browser-Based Seeding (Recommended)

### Step 1: Configure Firebase Credentials
Create `.env.local` in your project root with your Firebase credentials:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and fill in your Firebase project details:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

> **Get these values from Firebase Console:**
> 1. Go to [Firebase Console](https://console.firebase.google.com)
> 2. Select your project
> 3. Click "Project Settings" (gear icon)
> 4. Copy values from the "Web API keys" section

### Step 2: Start Development Server
```bash
npm run dev
```

The server will start on `http://localhost:3000`

### Step 3: Trigger Seeding
Open your browser and visit:
```
http://localhost:3000/api/seed
```

**Error Response?** If you see:
```json
{
  "error": "Firebase credentials not configured in .env.local"
}
```

Make sure `.env.local` exists and has all 6 environment variables filled in.

### Step 4: Verify in Firestore
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to **Firestore Database**
4. Check the **products** collection - you should see 39 documents

---

## 📝 Option 2: Command-Line Seeding

If you prefer seeding from the terminal:

### Prerequisites
- Firebase credentials in `.env.local` (same as Option 1)

### Run Seeding Script
```bash
npm run seed
```

This will seed all 39 products using the TypeScript script in `scripts/seed-products.ts`

---

## 🔍 Verify Seeding Success

After seeding (using either method), verify by checking:

1. **Firestore Console:**
   - Open [Firebase Console](https://console.firebase.google.com)
   - Select your project → Firestore Database
   - Expand the **products** collection
   - Should show 39 documents

2. **In Your App:**
   - Navigate to `http://localhost:3000`
   - Scroll to "Featured Collection" section
   - Should see 6 featured products displayed with specs

---

## 🖼️ Adding Product Images

Currently, product images are empty strings. To add images:

### Option A: Upload via Firebase Storage UI
1. Go to Firebase Console → Storage
2. Create a `products/` folder
3. Upload images for each product

### Option B: Programmatically
Use the storage service in `services/storage/storage.ts`:

```typescript
import { uploadProductImage } from '@/services/storage/storage'

// Upload an image for a product
await uploadProductImage(imageFile, 'product-id-01')
```

Then update the product's `imageUrl` in Firestore with the returned download URL.

---

## ⚙️ Configuration Details

### Firestore Security Rules

Add these rules to allow public product reads and contact inquiries:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow public read access to products
    match /products/{document=**} {
      allow read: if true;
    }

    // Allow client writes to contact inquiries
    match /contact_inquiries/{document=**} {
      allow create: if request.resource.data.keys().hasAll(['name', 'email', 'message', 'createdAt']);
      allow read, write: if false; // Admin only
    }
  }
}
```

### Product Document Structure

Each product in Firestore has this structure:

```json
{
  "productId": "01",
  "name": "FCV TRADITIONAL (X10)",
  "category": "Flue-Cured Virginia",
  "description": "A high-nicotine, high-sugar flue-cured Virginia tobacco...",
  "nicotine": "2.8% - 3.5%",
  "sugar": "16% - 22%",
  "color": "Dark lemon to orange / reddish",
  "body": "Medium to heavy",
  "grade": "X-10 (Lower quality / dark / over-ripe)",
  "featured": true,
  "imageUrl": "",
  "createdAt": "2026-05-26T19:54:00Z"
}
```

---

## 🆘 Troubleshooting

### "Cannot seed - credentials not configured"
- **Cause:** `.env.local` missing or incomplete
- **Fix:** Copy `.env.local.example` and fill in all 6 Firebase values

### "Failed to seed products" error
- **Cause:** Firebase credentials are wrong or Firestore not enabled
- **Fix:** 
  1. Verify credentials in Firebase Console
  2. Enable Firestore Database in Firebase Console
  3. Check Firestore security rules allow writes

### "No products showing in UI"
- **Cause:** Products seeded but `featured` flag not set correctly
- **Fix:** 
  1. Check product documents have `featured: true` for first 6 products
  2. Rebuild with `npm run build` then `npm start`

### "Products load but no images"
- **Cause:** `imageUrl` fields are empty
- **Fix:** Add images per "Adding Product Images" section above

---

## 📚 Next Steps

After successful seeding:

1. **Add Product Images** - Upload images to Firebase Storage
2. **Customize Categories** - Modify product categories as needed
3. **Add Product Detail Pages** - Create individual product pages
4. **Set Up Admin Panel** - Create authenticated admin area for managing products
5. **Deploy** - Deploy to production using `npm run build && npm start`

---

## 📞 Support

For issues:
1. Check `.env.local` has all 6 Firebase credentials
2. Verify Firestore is enabled in Firebase Console
3. Check browser console for error messages
4. Verify Firestore security rules allow reads/writes

Happy selling! 🎉
