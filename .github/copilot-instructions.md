# Alternate Enterprises - Firebase Simplified Architecture

This is a premium showcase website for Alternate Enterprises featuring:

## 🎯 Firebase Services Only Used
- ✅ Firebase App
- ✅ Firestore Database  
- ✅ Firebase Storage
- ❌ NO Firebase Authentication
- ❌ NO Firebase Analytics
- ❌ NO Firebase Hosting

## 📊 Firestore Collections
- `products` - Tobacco product inventory with fields: productId, name, category, description, nicotine, sugar, color, body, grade, featured, imageUrl, createdAt
- `contact_inquiries` - Contact form submissions with fields: name, company, email, phone, country, inquiryType, message, createdAt

## 🛠️ Services Structure
- `/lib/firebase.ts` - Firebase initialization
- `/services/firestore/` - Firestore operations (queries, products, inquiries)
- `/services/storage/` - Firebase Storage operations (uploads, downloads)
- `/hooks/` - Custom React hooks for data fetching

## 🎨 UI/UX
- Next.js 15 with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- Framer Motion for animations
- Server Components where possible
- Skeleton loaders & error boundaries
- Premium animations & loading states

## 🚀 Deployment
Production-ready with:
- Optimized bundle size
- Image optimization
- Type checking
- ESLint configuration
- Environment variable safety

---
**This is NOT an admin panel.** It's a cinematic luxury tobacco export showcase website with Firebase-powered product and inquiry management.
