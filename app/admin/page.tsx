'use client'

import Image from 'next/image'
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react'
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
  const [products, setProducts] = useState<Product[]>([])
  const [form, setForm] = useState<ProductForm>(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [fileInputKey, setFileInputKey] = useState(0)

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

  useEffect(() => {
    loadProducts()
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

  return (
    <main className="min-h-screen bg-gray-100 text-gray-950">
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-premium-gold">
            Alternate Enterprises
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-premium-dark">Product Admin</h1>
              <p className="mt-1 text-sm text-gray-600">
                Manage Firestore products and Firebase Storage images.
              </p>
            </div>
            <button
              type="button"
              onClick={resetForm}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50"
            >
              New Product
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[420px_1fr] lg:px-8">
        <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-bold text-premium-dark">
            {editingId ? 'Edit Product' : 'Create Product'}
          </h2>

          {message && (
            <div className="mt-4 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm font-medium text-green-800">
              {message}
            </div>
          )}
          {error && (
            <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-800">
              {error}
            </div>
          )}

          <form className="mt-5 space-y-4" onSubmit={saveProduct}>
            <label className="block">
              <span className="text-sm font-semibold text-gray-700">Name</span>
              <input
                value={form.name}
                onChange={(event) => updateField('name', event.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-premium-gold"
                required
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-gray-700">Category</span>
              <input
                value={form.category}
                onChange={(event) => updateField('category', event.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-premium-gold"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-gray-700">Description</span>
              <textarea
                value={form.description}
                onChange={(event) => updateField('description', event.target.value)}
                rows={4}
                className="mt-1 w-full resize-y rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-premium-gold"
              />
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="text-sm font-semibold text-gray-700">Nicotine</span>
                <input
                  value={form.nicotine}
                  onChange={(event) => updateField('nicotine', event.target.value)}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-premium-gold"
                />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-gray-700">Sugar</span>
                <input
                  value={form.sugar}
                  onChange={(event) => updateField('sugar', event.target.value)}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-premium-gold"
                />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-gray-700">Color</span>
                <input
                  value={form.color}
                  onChange={(event) => updateField('color', event.target.value)}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-premium-gold"
                />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-gray-700">Body</span>
                <input
                  value={form.body}
                  onChange={(event) => updateField('body', event.target.value)}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-premium-gold"
                />
              </label>
            </div>

            <label className="block">
              <span className="text-sm font-semibold text-gray-700">Grade</span>
              <input
                value={form.grade}
                onChange={(event) => updateField('grade', event.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-premium-gold"
              />
            </label>

            <label className="flex items-center gap-3 rounded-md border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(event) => updateField('featured', event.target.checked)}
                className="h-4 w-4 accent-premium-gold"
              />
              Featured product
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-gray-700">Images</span>
              <input
                key={fileInputKey}
                type="file"
                multiple
                accept="image/*"
                onChange={onFilesChange}
                className="mt-1 w-full rounded-md border border-dashed border-gray-300 px-3 py-3 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-premium-dark file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white"
              />
              {selectedFiles.length > 0 && (
                <p className="mt-2 text-xs text-gray-500">
                  {selectedFiles.length} image{selectedFiles.length === 1 ? '' : 's'} selected
                </p>
              )}
            </label>

            {form.imageUrls.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {form.imageUrls.map((url) => (
                  <div key={url} className="relative overflow-hidden rounded-md border border-gray-200">
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
                      className="absolute right-1 top-1 rounded bg-white/90 px-2 py-1 text-xs font-bold text-red-700 shadow"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 rounded-md bg-premium-gold px-4 py-2 text-sm font-bold text-premium-dark hover:bg-yellow-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? 'Saving...' : editingId ? 'Update Product' : 'Create Product'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="min-w-0">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-premium-dark">Products</h2>
            <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-gray-700 shadow-sm">
              {products.length} total
            </span>
          </div>

          {loading ? (
            <div className="rounded-lg border border-gray-200 bg-white p-6 text-sm text-gray-600">
              Loading products...
            </div>
          ) : (
            <div className="grid gap-4">
              {sortedProducts.map((product) => {
                const images = product.imageUrls ?? (product.imageUrl ? [product.imageUrl] : [])
                const primaryImage = images[0]
                return (
                  <article
                    key={product.productId}
                    className="grid gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:grid-cols-[128px_1fr]"
                  >
                    <div className="relative h-32 overflow-hidden rounded-md bg-gray-200">
                      {primaryImage ? (
                        <Image
                          src={primaryImage}
                          alt={product.name}
                          fill
                          sizes="128px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs font-semibold text-gray-500">
                          No image
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <p className="text-xs font-semibold uppercase tracking-wide text-premium-gold">
                            {product.category || 'Uncategorized'}
                          </p>
                          <h3 className="mt-1 truncate text-lg font-bold text-gray-950">
                            {product.name}
                          </h3>
                          <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                            {product.description}
                          </p>
                        </div>
                        <div className="flex shrink-0 gap-2">
                          <button
                            type="button"
                            onClick={() => editProduct(product)}
                            className="rounded-md border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => removeProduct(product)}
                            className="rounded-md border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-gray-600 md:grid-cols-5">
                        <span>Nicotine: {product.nicotine || '-'}</span>
                        <span>Sugar: {product.sugar || '-'}</span>
                        <span>Color: {product.color || '-'}</span>
                        <span>Body: {product.body || '-'}</span>
                        <span>Images: {images.length}</span>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
