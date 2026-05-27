'use client'

import { MarketplaceFilters, ProductCategory } from '../../lib/types'
import { CATEGORIES, CITIES, SORT_OPTIONS } from '../../lib/types/mock-data'

interface FiltersProps {
  filters: MarketplaceFilters
  onChange: (filters: MarketplaceFilters) => void
  totalResults: number
}

export function MarketplaceFiltersPanel({ filters, onChange, totalResults }: FiltersProps) {
  const toggleCategory = (cat: ProductCategory) => {
    const cats = filters.categories.includes(cat)
      ? filters.categories.filter(c => c !== cat)
      : [...filters.categories, cat]
    onChange({ ...filters, categories: cats })
  }

  const toggleCity = (city: string) => {
    const cities = filters.cities.includes(city)
      ? filters.cities.filter(c => c !== city)
      : [...filters.cities, city]
    onChange({ ...filters, cities })
  }

  return (
    <aside className="w-64 flex-shrink-0">
      <div className="bg-white border border-gray-100 rounded-2xl p-5 sticky top-6">
        {/* Results count */}
        <p className="text-xs text-gray-400 mb-4">
          <span className="font-semibold text-gray-700">{totalResults} sellers</span> nakita
        </p>

        {/* Sort */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Sort:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {SORT_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => onChange({ ...filters, sortBy: opt.value as MarketplaceFilters['sortBy'] })}
                className={`text-xs rounded-full px-3 py-1.5 font-medium transition-colors ${
                  filters.sortBy === opt.value
                    ? 'bg-amber-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Type of the Product
          </p>
          <div className="space-y-2">
            {CATEGORIES.map(cat => (
              <label key={cat.value} className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.categories.includes(cat.value as ProductCategory)}
                  onChange={() => toggleCategory(cat.value as ProductCategory)}
                  className="w-4 h-4 rounded accent-amber-500"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">
                  {cat.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Location */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Location
          </p>
          <div className="space-y-2">
            {CITIES.map(city => (
              <label key={city} className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.cities.includes(city)}
                  onChange={() => toggleCity(city)}
                  className="w-4 h-4 rounded accent-amber-500"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">{city}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Price (₱)
          </p>
          <div className="flex gap-2 items-center">
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice ?? ''}
              onChange={e => onChange({ ...filters, minPrice: e.target.value ? Number(e.target.value) : undefined })}
              className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-amber-400"
            />
            <span className="text-gray-400 text-xs">–</span>
            <input
              type="number"
              placeholder="Max"
              value={filters.maxPrice ?? ''}
              onChange={e => onChange({ ...filters, maxPrice: e.target.value ? Number(e.target.value) : undefined })}
              className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-amber-400"
            />
          </div>
          <button
            onClick={() => onChange({ ...filters })}
            className="w-full mt-2 text-xs bg-gray-900 text-white rounded-xl py-2.5 font-medium hover:bg-gray-800 transition-colors"
          >
            I-apply
          </button>
        </div>

        {/* Rating */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Rating ng Seller
          </p>
          <div className="space-y-2">
            {[5, 4, 3].map(rating => (
              <label key={rating} className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="radio"
                  name="rating"
                  checked={filters.minRating === rating}
                  onChange={() => onChange({ ...filters, minRating: rating })}
                  className="w-4 h-4 accent-amber-500"
                />
                <span className="text-sm text-gray-700 flex items-center gap-1">
                  {'fas fa-star'.repeat(rating)}
                  <span className="text-gray-400 text-xs">
                    {rating === 5 ? '5 bitoon' : rating === 4 ? '4 pataas' : '3 pataas'}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Verified Only */}
        <div className="mt-5 pt-5 border-t border-gray-100">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.verifiedOnly}
              onChange={e => onChange({ ...filters, verifiedOnly: e.target.checked })}
              className="w-4 h-4 rounded accent-amber-500"
            />
            <span className="text-sm font-medium text-gray-700">Verified Sellers Only</span>
          </label>
        </div>
      </div>
    </aside>
  )
}