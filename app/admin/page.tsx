'use client'

import Image from 'next/image'
import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from 'react'
import {
  Product,
  ProductInput,
  addProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from '@/services/firestore/products'
import {
  deleteFileByUrl,
  uploadProductImages,
} from '@/services/storage/storage'
import {
  ProductImage,
  getProductImages,
  deleteProductImage,
  uploadCatalogueImage,
} from '@/services/firestore/productImages'

type Tab = 'products' | 'media'

type ProductForm = {
  name: string
  category: string
  description: string
  nicotine: string
  sugar: string
  color: string
  body: string
  grade: string
  featured: boolean
  imageUrls: string[]
}

const emptyForm: ProductForm = {
  name: '',
  category: '',
  description: '',
  nicotine: '',
  sugar: '',
  color: '',
  body: '',
  grade: '',
  featured: false,
  imageUrls: [],
}

function productToForm(product: Product): ProductForm {
  return {
    name: product.name,
    category: product.category,
    description: product.description,
    nicotine: product.nicotine,
    sugar: product.sugar,
    color: product.color,
    body: product.body,
    grade: product.grade,
    featured: product.featured,
    imageUrls: product.imageUrls ?? (product.imageUrl ? [product.imageUrl] : []),
  }
}

function formToProductInput(form: ProductForm): ProductInput {
  return {
    ...form,
    imageUrl: form.imageUrls[0] ?? '',
  }
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>('products')
  const [products, setProducts] = useState<Product[]>([])
  const [mediaImages, setMediaImages] = useState<ProductImage[]>([])
  const [form, setForm] = useState<ProductForm>(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(true)
  const [mediaLoading, setMediaLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [fileInputKey, setFileInputKey] = useState(0)
  const [showMediaPicker, setShowMediaPicker] = useState(false)
  const [mediaUploading, setMediaUploading] = useState(false)
  const mediaUploadRef = useRef<HTMLInputElement>(null)

  const sortedProducts = useMemo(
    () => [...products].sort((a, b) => a.name.localeCompare(b.name)),
    [products]
  )

  async function loadProducts() {
    setLoading(true)
    setError('')
    try {
      const data = await getProducts()
      setProducts(data)
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  async function loadMediaImages() {
    setMediaLoading(true)
    try {
      const data = await getProductImages()
      setMediaImages(data)
    } catch (err) {
      console.error('Failed to load media:', err)
    } finally {
      setMediaLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
    loadMediaImages()
  }, [])

  function updateField<K extends keyof ProductForm>(key: K, value: ProductForm[K]) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function onFilesChange(event: ChangeEvent<HTMLInputElement>) {
    setSelectedFiles(Array.from(event.target.files ?? []))
  }

  function resetForm() {
    setForm(emptyForm)
    setEditingId(null)
    setSelectedFiles([])
    setFileInputKey((key) => key + 1)
  }

  function editProduct(product: Product) {
    setEditingId(product.productId)
    setForm(productToForm(product))
    setSelectedFiles([])
    setFileInputKey((key) => key + 1)
    setMessage('')
    setError('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function removeImage(imageUrl: string) {
    const nextImages = form.imageUrls.filter((url) => url !== imageUrl)
    setForm((current) => ({ ...current, imageUrls: nextImages }))

    if (editingId) {
      try {
        await updateProduct(editingId, { imageUrls: nextImages, imageUrl: nextImages[0] ?? '' })
        await deleteFileByUrl(imageUrl)
        await loadProducts()
        setMessage('Image removed')
      } catch (removeError) {
        setError(removeError instanceof Error ? removeError.message : 'Failed to remove image')
      }
    }
  }

  function addImageToForm(url: string) {
    if (!form.imageUrls.includes(url)) {
      setForm((current) => ({ ...current, imageUrls: [...current.imageUrls, url] }))
    }
  }

  async function saveProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setError('')
    setMessage('')

    try {
      if (!form.name.trim()) {
        throw new Error('Product name is required')
      }

      if (editingId) {
        const uploadedUrls = selectedFiles.length
          ? await uploadProductImages(selectedFiles, editingId)
          : []
        const imageUrls = [...form.imageUrls, ...uploadedUrls]
        await updateProduct(editingId, formToProductInput({ ...form, imageUrls }))
        setMessage('Product updated')
      } else {
        const newProductId = await addProduct(formToProductInput(form))
        if (selectedFiles.length) {
          const uploadedUrls = await uploadProductImages(selectedFiles, newProductId)
          await updateProduct(newProductId, {
            imageUrls: uploadedUrls,
            imageUrl: uploadedUrls[0] ?? '',
          })
        }
        setMessage('Product created')
      }

      resetForm()
      await loadProducts()
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Failed to save product')
    } finally {
      setSaving(false)
    }
  }

  async function removeProduct(product: Product) {
    const confirmed = window.confirm(`Delete ${product.name}? This cannot be undone.`)
    if (!confirmed) return

    setError('')
    setMessage('')
    try {
      const imageUrls = product.imageUrls ?? (product.imageUrl ? [product.imageUrl] : [])
      await Promise.allSettled(imageUrls.map((url) => deleteFileByUrl(url)))
      await deleteProduct(product.productId)
      if (editingId === product.productId) resetForm()
      await loadProducts()
      setMessage('Product deleted')
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Failed to delete product')
    }
  }

  async function handleDeleteMediaImage(image: ProductImage) {
    const confirmed = window.confirm(`Delete ${image.originalName}? This cannot be undone.`)
    if (!confirmed) return
    try {
      await deleteProductImage(image.id, image.storagePath)
      setMediaImages((prev) => prev.filter((m) => m.id !== image.id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete image')
    }
  }

  async function handleMediaUpload(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? [])
    if (!files.length) return

    setMediaUploading(true)
    try {
      for (const file of files) {
        const uploaded = await uploadCatalogueImage(file)
        setMediaImages((prev) => [uploaded, ...prev])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload')
    } finally {
      setMediaUploading(false)
      if (mediaUploadRef.current) mediaUploadRef.current.value = ''
    }
  }

  return (
    <main className="min-h-screen bg-tobacco-50">
      {/* Header */}
      <div className="border-b border-tobacco-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-premium-gold">
            Alternate Enterprises — Admin Panel
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-premium-dark">Administration</h1>
              <p className="mt-1 text-sm text-tobacco-600">
                Manage products, catalogue images, and inventory.
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="-mb-px flex gap-6">
            <button
              onClick={() => setActiveTab('products')}
              className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === 'products'
                  ? 'border-premium-gold text-premium-dark'
                  : 'border-transparent text-tobacco-500 hover:text-tobacco-700'
              }`}
            >
              Products
            </button>
            <button
              onClick={() => setActiveTab('media')}
              className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === 'media'
                  ? 'border-premium-gold text-premium-dark'
                  : 'border-transparent text-tobacco-500 hover:text-tobacco-700'
              }`}
            >
              Media Library
            </button>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Messages */}
        {message && (
          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-800 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {message}
          </div>
        )}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        {/* === PRODUCTS TAB === */}
        {activeTab === 'products' && (
          <div className="grid gap-8 lg:grid-cols-[440px_1fr]">
            {/* Product Form */}
            <section className="rounded-xl border border-tobacco-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-premium-dark flex items-center gap-2">
                <span className="w-1.5 h-5 bg-premium-gold rounded-full inline-block" />
                {editingId ? 'Edit Product' : 'Create Product'}
              </h2>

              <form className="mt-6 space-y-4" onSubmit={saveProduct}>
                <label className="block">
                  <span className="text-sm font-semibold text-tobacco-800">Name</span>
                  <input
                    value={form.name}
                    onChange={(event) => updateField('name', event.target.value)}
                    className="mt-1 w-full rounded-lg border border-tobacco-200 px-3.5 py-2.5 text-sm outline-none focus:border-premium-gold focus:ring-2 focus:ring-premium-gold/20 transition-all"
                    required
                    placeholder="Product name"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-tobacco-800">Category</span>
                  <select
                    value={form.category}
                    onChange={(event) => updateField('category', event.target.value)}
                    className="mt-1 w-full rounded-lg border border-tobacco-200 px-3.5 py-2.5 text-sm outline-none focus:border-premium-gold focus:ring-2 focus:ring-premium-gold/20 transition-all"
                  >
                    <option value="">Select category</option>
                    <option value="FCV Tobacco">FCV Tobacco</option>
                    <option value="Burley Tobacco">Burley Tobacco</option>
                    <option value="Country Blend">Country Blend</option>
                    <option value="Zimbabwe Cured">Zimbabwe Cured</option>
                  </select>
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-tobacco-800">Description</span>
                  <textarea
                    value={form.description}
                    onChange={(event) => updateField('description', event.target.value)}
                    rows={4}
                    className="mt-1 w-full resize-y rounded-lg border border-tobacco-200 px-3.5 py-2.5 text-sm outline-none focus:border-premium-gold focus:ring-2 focus:ring-premium-gold/20 transition-all"
                    placeholder="Product description"
                  />
                </label>

                <div className="grid grid-cols-2 gap-3">
                  {(['nicotine', 'sugar', 'color', 'body'] as const).map((field) => (
                    <label key={field} className="block">
                      <span className="text-sm font-semibold text-tobacco-800 capitalize">{field}</span>
                      <input
                        value={form[field]}
                        onChange={(event) => updateField(field, event.target.value)}
                        className="mt-1 w-full rounded-lg border border-tobacco-200 px-3.5 py-2.5 text-sm outline-none focus:border-premium-gold focus:ring-2 focus:ring-premium-gold/20 transition-all"
                        placeholder={`e.g. ${field === 'nicotine' ? '2.5%' : field === 'sugar' ? '15%' : field === 'color' ? 'Golden' : 'Medium'}`}
                      />
                    </label>
                  ))}
                </div>

                <label className="block">
                  <span className="text-sm font-semibold text-tobacco-800">Grade</span>
                  <input
                    value={form.grade}
                    onChange={(event) => updateField('grade', event.target.value)}
                    className="mt-1 w-full rounded-lg border border-tobacco-200 px-3.5 py-2.5 text-sm outline-none focus:border-premium-gold focus:ring-2 focus:ring-premium-gold/20 transition-all"
                    placeholder="e.g. Premium A1"
                  />
                </label>

                <label className="flex items-center gap-3 rounded-lg border border-tobacco-200 px-4 py-3 text-sm font-semibold text-tobacco-800 cursor-pointer hover:bg-tobacco-50 transition-all">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(event) => updateField('featured', event.target.checked)}
                    className="h-4 w-4 accent-premium-gold"
                  />
                  <span>Featured product</span>
                </label>

                {/* Images section */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-tobacco-800">Images</span>
                    <button
                      type="button"
                      onClick={() => setShowMediaPicker(true)}
                      className="text-xs font-semibold text-premium-gold hover:text-yellow-600 transition-colors"
                    >
                      Browse Media Library
                    </button>
                  </div>

                  <input
                    key={fileInputKey}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={onFilesChange}
                    className="w-full rounded-lg border border-dashed border-tobacco-200 px-3.5 py-3 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-premium-dark file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white file:cursor-pointer cursor-pointer hover:border-premium-gold/40 transition-all"
                  />
                  {selectedFiles.length > 0 && (
                    <p className="mt-2 text-xs text-tobacco-600">
                      {selectedFiles.length} image{selectedFiles.length === 1 ? '' : 's'} selected
                    </p>
                  )}

                  {form.imageUrls.length > 0 && (
                    <div className="grid grid-cols-3 gap-3 mt-3">
                      {form.imageUrls.map((url) => (
                        <div key={url} className="relative overflow-hidden rounded-lg border border-tobacco-200 group">
                          <Image
                            src={url}
                            alt={form.name || 'Product image'}
                            width={160}
                            height={120}
                            className="h-24 w-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(url)}
                            className="absolute right-1.5 top-1.5 rounded bg-black/70 px-2 py-1 text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 btn-gold text-sm py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? 'Saving...' : editingId ? 'Update Product' : 'Create Product'}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="rounded-lg border border-tobacco-200 px-5 py-2.5 text-sm font-semibold text-tobacco-800 hover:bg-tobacco-50 transition-all"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </section>

            {/* Product List */}
            <section className="min-w-0">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-premium-dark flex items-center gap-2">
                  <span className="w-1.5 h-5 bg-premium-gold rounded-full inline-block" />
                  Products
                </h2>
                <span className="rounded-full bg-white border border-tobacco-200 px-4 py-1.5 text-xs font-semibold text-tobacco-700 shadow-sm">
                  {products.length} total
                </span>
              </div>

              {loading ? (
                <div className="text-center py-16 text-tobacco-500">
                  <div className="inline-block w-6 h-6 border-2 border-premium-gold/30 border-t-premium-gold rounded-full animate-spin mb-3" />
                  <p className="text-sm">Loading products...</p>
                </div>
              ) : sortedProducts.length === 0 ? (
                <div className="rounded-xl border border-dashed border-tobacco-200 bg-white p-12 text-center">
                  <p className="text-tobacco-400 text-lg font-medium mb-1">No products yet</p>
                  <p className="text-tobacco-400 text-sm">Create your first product using the form.</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {sortedProducts.map((product) => {
                    const images = product.imageUrls ?? (product.imageUrl ? [product.imageUrl] : [])
                    const primaryImage = images[0]
                    return (
                      <article
                        key={product.productId}
                        className="grid gap-4 rounded-xl border border-tobacco-200 bg-white p-5 shadow-sm hover:shadow-md transition-all sm:grid-cols-[140px_1fr]"
                      >
                        <div className="relative h-36 overflow-hidden rounded-lg bg-tobacco-100">
                          {primaryImage ? (
                            <Image
                              src={primaryImage}
                              alt={product.name}
                              fill
                              sizes="140px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-xs font-bold text-tobacco-400 tracking-widest">
                              NO IMAGE
                            </div>
                          )}
                          {product.featured && (
                            <div className="absolute top-2 left-2">
                              <span className="tobacco-badge bg-premium-gold text-premium-dark text-[9px]">
                                Featured
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="text-xs font-bold uppercase tracking-wider text-premium-gold">
                                  {product.category || 'Uncategorized'}
                                </p>
                                <span className="tobacco-badge bg-tobacco-100 text-tobacco-700 border border-tobacco-200">
                                  {product.grade}
                                </span>
                              </div>
                              <h3 className="truncate text-lg font-bold text-gray-950">
                                {product.name}
                              </h3>
                              <p className="mt-1.5 line-clamp-2 text-sm text-tobacco-600 leading-relaxed">
                                {product.description}
                              </p>
                            </div>
                            <div className="flex shrink-0 gap-2">
                              <button
                                type="button"
                                onClick={() => editProduct(product)}
                                className="rounded-lg border border-tobacco-200 px-3.5 py-2 text-sm font-semibold text-tobacco-800 hover:bg-tobacco-50 transition-all"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => removeProduct(product)}
                                className="rounded-lg border border-red-200 px-3.5 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 transition-all"
                              >
                                Delete
                              </button>
                            </div>
                          </div>

                          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1.5 text-xs text-tobacco-600">
                            {(['nicotine', 'sugar', 'color', 'body'] as const).map((field) => (
                              <span key={field} className="flex items-center gap-1">
                                <span className="w-1 h-1 rounded-full bg-premium-gold" />
                                {field}: <span className="font-medium text-tobacco-800">{product[field] || '-'}</span>
                              </span>
                            ))}
                            <span className="flex items-center gap-1">
                              <span className="w-1 h-1 rounded-full bg-premium-gold" />
                              Images: <span className="font-medium text-tobacco-800">{images.length}</span>
                            </span>
                          </div>
                        </div>
                      </article>
                    )
                  })}
                </div>
              )}
            </section>
          </div>
        )}

        {/* === MEDIA LIBRARY TAB === */}
        {activeTab === 'media' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-premium-dark flex items-center gap-2">
                  <span className="w-1.5 h-5 bg-premium-gold rounded-full inline-block" />
                  Media Library
                </h2>
                <p className="text-sm text-tobacco-600 mt-1">
                  Browse and manage uploaded catalogue images and PDFs
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-white border border-tobacco-200 px-4 py-1.5 text-xs font-semibold text-tobacco-700 shadow-sm">
                  {mediaImages.length} files
                </span>
                <label className="btn-gold text-sm px-5 py-2 cursor-pointer">
                  {mediaUploading ? 'Uploading...' : '+ Upload'}
                  <input
                    ref={mediaUploadRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleMediaUpload}
                    className="hidden"
                    disabled={mediaUploading}
                  />
                </label>
              </div>
            </div>

            {mediaLoading ? (
              <div className="text-center py-16 text-tobacco-500">
                <div className="inline-block w-6 h-6 border-2 border-premium-gold/30 border-t-premium-gold rounded-full animate-spin mb-3" />
                <p className="text-sm">Loading media library...</p>
              </div>
            ) : mediaImages.length === 0 ? (
              <div className="rounded-xl border border-dashed border-tobacco-200 bg-white p-16 text-center">
                <p className="text-tobacco-400 text-lg font-medium mb-1">No media files</p>
                <p className="text-tobacco-400 text-sm">
                  Upload images using the button above, or run the catalogue upload script.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {mediaImages.map((image) => (
                  <div
                    key={image.id}
                    className="group relative rounded-lg border border-tobacco-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="relative aspect-square bg-tobacco-100">
                      {image.type === 'image' ? (
                        <Image
                          src={image.url}
                          alt={image.originalName}
                          fill
                          sizes="200px"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <span className="text-tobacco-400 text-xs font-bold uppercase tracking-wider">PDF</span>
                        </div>
                      )}
                    </div>
                    <div className="p-2.5">
                      <p className="text-xs text-tobacco-700 truncate font-medium" title={image.originalName}>
                        {image.originalName}
                      </p>
                      <p className="text-[10px] text-tobacco-500 mt-0.5">
                        {(image.size / 1024).toFixed(0)} KB
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteMediaImage(image)}
                      className="absolute top-2 right-2 rounded bg-black/70 px-2 py-1 text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Media Picker Modal */}
      {showMediaPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-tobacco-200">
              <h3 className="text-lg font-bold text-premium-dark">Select Images</h3>
              <button
                type="button"
                onClick={() => setShowMediaPicker(false)}
                className="text-tobacco-500 hover:text-tobacco-800 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              {mediaImages.length === 0 ? (
                <p className="text-center text-tobacco-500 py-8">
                  No images in the media library yet.
                </p>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {mediaImages
                    .filter((m) => m.type === 'image')
                    .map((image) => (
                      <button
                        key={image.id}
                        type="button"
                        onClick={() => {
                          addImageToForm(image.url)
                          setShowMediaPicker(false)
                        }}
                        className={`relative aspect-square rounded-lg border-2 overflow-hidden transition-all hover:border-premium-gold ${
                          form.imageUrls.includes(image.url)
                            ? 'border-premium-gold ring-2 ring-premium-gold/30'
                            : 'border-tobacco-200'
                        }`}
                      >
                        <Image
                          src={image.url}
                          alt={image.originalName}
                          fill
                          sizes="200px"
                          className="object-cover"
                        />
                        {form.imageUrls.includes(image.url) && (
                          <div className="absolute top-1 right-1 w-5 h-5 bg-premium-gold rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-premium-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                          <p className="text-[10px] text-white truncate">{image.originalName}</p>
                        </div>
                      </button>
                    ))}
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-tobacco-200 flex justify-end">
              <button
                type="button"
                onClick={() => setShowMediaPicker(false)}
                className="rounded-lg border border-tobacco-200 px-5 py-2 text-sm font-semibold text-tobacco-800 hover:bg-tobacco-50 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
