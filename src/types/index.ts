export type UserRole = 'admin' | 'seller' | 'buyer'

export type ProductCategory =
  | 'live_chicken'
  | 'feeds'
  | 'eggs'
  | 'medicine'
  | 'supplies'

export type SellerTier = 'standard' | 'premium'

export type SortOption =
  | 'popular'
  | 'newest'
  | 'price_asc'
  | 'price_desc'
  | 'rating'

export interface Seller {
  id: string
  name: string
  shopName: string
  avatar?: string

  city: string
  province: string
  location: string

  isVerified: boolean
  tier: SellerTier

  rating: number
  reviewCount: number

  listingCount: number
  memberSinceYears: number

  joinedAt: string
}

export interface Listing {
  id: string

  sellerId: string
  seller: Seller

  title: string
  description: string

  category: ProductCategory

  price: number
  priceUnit: string

  stock: number
  stockUnit: string

  isFeatured: boolean

  images: string[]

  createdAt: string
  updatedAt: string
}

export interface MarketplaceFilters {
  search: string

  categories: ProductCategory[]

  cities: string[]

  minPrice?: number
  maxPrice?: number

  minRating?: number

  sortBy: SortOption

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

  createdAt: string
}