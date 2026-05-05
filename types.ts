
export enum BoatStatus {
  AVAILABLE = 'Disponível',
  SOLD = 'Vendido',
  RESERVED = 'Reservado'
}

export interface Boat {
  id: string;
  name: string;
  brand: string;
  year: number;
  size: number;
  price: number | string;
  type: string;
  status: BoatStatus | string;
  images?: string[];
  specs: Record<string, any>;
  featured?: boolean;
  description?: string;
  location?: string;
  marina?: string;
  ownerId?: string;
  listingBrokerId?: string;
  openToPartnerships?: boolean;
  defaultCommission?: number;
  viewCount?: number;
  createdAt?: string;
  updatedAt?: string;
  owner?: {
    id: string;
    name: string;
    avatar?: string;
  };
  listingBroker?: {
    id: string;
    name: string;
    avatar?: string;
  };
  media?: Array<{
    id: string;
    url: string;
    order: number;
  }>;
}

export interface BrandPartner {
  id: string;
  name: string;
  logo: string;
  description: string;
  category: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  message?: string;
  boatId?: string;
  type?: 'INTEREST' | 'SELL' | 'INSPECTION' | 'SHIPYARD' | 'LISTING_BROKER' | 'ORGANIC';
  status?: string;
  assignedBrokerId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export enum Role {
  OWNER = 'OWNER',
  BROKER = 'BROKER',
  BUYER = 'BUYER',
  ADMIN = 'ADMIN',
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  token: string;
  refreshToken: string;
  expiresIn: number;
}
