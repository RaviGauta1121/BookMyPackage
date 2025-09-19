// ==================== src/services/packageService.ts ====================
import { apiService } from './api';
import { TravelPackage, CreatePackageRequest, PackageSearchParams } from '../types/package';

export class PackageService {
  static async getAllPackages(): Promise<TravelPackage[]> {
    const response = await apiService.get<TravelPackage[]>('/api/travelpackages');
    return response.data;
  }

  static async getActivePackages(): Promise<TravelPackage[]> {
    const response = await apiService.get<TravelPackage[]>('/api/travelpackages/active');
    return response.data;
  }

  static async getPackageById(id: number): Promise<TravelPackage> {
    const response = await apiService.get<TravelPackage>(`/api/travelpackages/${id}`);
    return response.data;
  }

  static async createPackage(packageData: CreatePackageRequest): Promise<TravelPackage> {
    const response = await apiService.post<TravelPackage>('/api/travelpackages', packageData);
    return response.data;
  }

  static async updatePackage(id: number, packageData: Partial<CreatePackageRequest>): Promise<TravelPackage> {
    const response = await apiService.put<TravelPackage>(`/api/travelpackages/${id}`, packageData);
    return response.data;
  }

  static async deletePackage(id: number): Promise<void> {
    await apiService.delete(`/api/travelpackages/${id}`);
  }

  static async searchPackages(params: PackageSearchParams): Promise<TravelPackage[]> {
    const searchParams = new URLSearchParams();
    
    if (params.destination) searchParams.append('destination', params.destination);
    if (params.minPrice) searchParams.append('minPrice', params.minPrice.toString());
    if (params.maxPrice) searchParams.append('maxPrice', params.maxPrice.toString());

    const response = await apiService.get<TravelPackage[]>(`/api/travelpackages/search?${searchParams}`);
    return response.data;
  }
}