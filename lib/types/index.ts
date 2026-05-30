
export type Category = {
  id: number
  slug: 'chicken' | 'feeds' | 'medicine' | 'supplies'
  label: string
}

export type Seller = {
  id: string
  name: string
  contactNum: string
  facebookUrl?: string
  city: string
  isVerified: boolean
  isSubscribed: boolean
}

export type Listing = {
  id: string
  sellerId: string
  seller?: Seller
  categoryId: number
  category?: Category
  title: string
  description?: string
  price: number
  unit: 'kilo' | 'bag' | 'tray' | 'pc'
  quantity: number
  images: string[]
  isActive: boolean
  isFeatured: boolean
  createdAt: string
}

export type Buyer = {
  id: string
  name: string
  email?: string
  contactNum: string
  city: string
  isVerified: boolean
}

export type ApiResponse<T> = {
  data: T | null
  error: string | null
}

export type PaginatedResponse<T> = {
  data: T[]
  total: number
  page: number
  limit: number
}

export type SignupPayload = {
  name: string
  contactNum: string
  city: string
  email?: string
}

export type OtpVerifyPayload = {
  contactNum: string
  code: string
}

export type AuthTokens = {
  accessToken: string
  buyer: Buyer
}

export type ListingFilters = {
  categorySlug?: string
  city?: string
  sortBy?: 'newest' | 'price_asc' | 'price_desc'
  page?: number
  limit?: number
}