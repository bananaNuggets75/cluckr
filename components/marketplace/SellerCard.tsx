'use client'

import { Seller, Listing } from '../../lib/types'

interface SellerCardProps {
  seller: Seller
  listings: Listing[]
}

const categoryEmoji: Record<string, string> = {
  live_chicken: 'fas fa-chicken',
  feeds: 'fas fa-seedling',
  egg: 'fas fa-egg',
  medicine: 'fas fa-pills',
  supplies: 'fas fa-box',
}

export function SellerCard({ seller, listings }: SellerCardProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-shadow duration-200">
      {/* Seller Header */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-semibold text-lg flex-shrink-0">
            {seller.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-gray-900 text-sm leading-tight">
                  {seller.shopName}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                  <span><i className="fas fa-map-marker-alt"></i></span>
                  {seller.location}
                </p>
              </div>
              {/* Tier Badge */}
              {seller.tier === 'premium' ? (
                <span className="flex-shrink-0 text-xs bg-amber-50 text-amber-700 border border-amber-200 rounded-full px-2.5 py-0.5 font-medium">
                  <i className="fas fa-crown"></i> Premium
                </span>
              ) : (
                <span className="flex-shrink-0 text-xs bg-gray-50 text-gray-600 border border-gray-200 rounded-full px-2.5 py-0.5 font-medium">
                  Standard
                </span>
              )}
            </div>

            {/* Verified + Stats */}
            <div className="flex items-center gap-3 mt-2">
              {seller.isVerified && (
                <span className="flex items-center gap-1 text-xs text-emerald-700 font-medium">
                  <span className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center text-[10px]">✓</span>
                  Verified
                </span>
              )}
              <div className="flex items-center gap-0.5 text-xs text-gray-600">
                <span className="text-amber-400">★</span>
                <span className="font-medium">{seller.rating.toFixed(1)}</span>
                <span className="text-gray-400 ml-0.5">({seller.reviewCount})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Row */}
        <div className="flex gap-4 mt-4 pt-4 border-t border-gray-50">
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-900">{seller.listingCount}</p>
            <p className="text-xs text-gray-400">Listings</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-900">{seller.memberSinceYears}yr</p>
            <p className="text-xs text-gray-400">Member</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-900">{seller.reviewCount}</p>
            <p className="text-xs text-gray-400">Reviews</p>
          </div>
        </div>
      </div>

      {/* Listings Preview */}
      <div className="p-4">
        <div className="grid grid-cols-3 gap-2">
          {listings.slice(0, 3).map((listing) => (
            <div key={listing.id} className="group cursor-pointer">
              {/* Listing Image Placeholder */}
              <div className="aspect-square rounded-xl bg-amber-50 flex items-center justify-center text-2xl mb-1.5 group-hover:bg-amber-100 transition-colors relative overflow-hidden">
                {categoryEmoji[listing.category] ?? 'fas fa-box'}
                {listing.isFeatured && (
                  <span className="absolute top-1 left-1 text-[9px] bg-amber-400 text-white rounded px-1 py-0.5 font-medium">
                    Featured
                  </span>
                )}
              </div>
              <p className="text-[11px] font-medium text-gray-700 leading-tight truncate">
                {listing.title}
              </p>
              <p className="text-[11px] text-amber-700 font-semibold">
                ₱{listing.price.toLocaleString()}/{listing.priceUnit}
              </p>
              <p className="text-[10px] text-gray-400">
                {listing.stock.toLocaleString()} {listing.stockUnit}
              </p>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4">
          <button className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium bg-amber-500 hover:bg-amber-600 text-white rounded-xl py-2.5 transition-colors">
            <i className="fas fa-phone"></i> Call
          </button>
          <button className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl py-2.5 transition-colors">
            <i className="fas fa-comment"></i> Message
          </button>
        </div>
      </div>
    </div>
  )
}