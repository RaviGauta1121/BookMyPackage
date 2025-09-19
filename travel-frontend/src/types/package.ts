// ==================== src/types/package.ts ====================
export interface TravelPackage {
  id: number;
  title: string;
  description: string;
  destination: string;
  price: number;
  duration: number;
  startDate: string;
  endDate: string;
  maxCapacity: number;
  availableSlots: number;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
}

export interface CreatePackageRequest {
  title: string;
  description: string;
  destination: string;
  price: number;
  duration: number;
  startDate: string;
  endDate: string;
  maxCapacity: number;
  imageUrl?: string;
}

export interface PackageSearchParams {
  destination?: string;
  minPrice?: number;
  maxPrice?: number;
}