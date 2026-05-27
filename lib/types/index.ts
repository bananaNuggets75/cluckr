export type UserRole = 'admin' | 'seller' | 'buyer'

export type ProductCategory =
  | 'buhay_na_manok'
  | 'feeds'
  | 'itlog'
  | 'gamot_bitamina'
  | 'supplies'

export type SellerTier = 'standard' | 'premium'

export interface Seller {
  id: string
  name: string
  shopName: string
  avatar?: string
  location: string
  city: string
  province: string
  isVerified: boolean
  tier: SellerTier
  rating: number
  reviewCount: number
  listingCount: number
  memberSinceYears: number
  joinedAt: Date
}

export interface Listing {
  id: string
  sellerId: string
  seller: Seller
  title: string
  category: ProductCategory
  description: string
  price: number
  priceUnit: string
  stock: number
  stockUnit: string
  isFeatured: boolean
  images: string[]
  createdAt: Date
  updatedAt: Date
}

export interface MarketplaceFilters {
  search: string
  categories: ProductCategory[]
  cities: string[]
  minPrice?: number
  maxPrice?: number
  minRating?: number
  sortBy: 'popular' | 'newest' | 'price_asc' | 'price_desc' | 'rating'
  verifiedOnly: boolean
}

export interface BuyerUser {
  id: string
  name: string
  email: string
  phone?: string
  role: UserRole
  avatar?: string
  city?: string
  province?: string
  createdAt: Date
}