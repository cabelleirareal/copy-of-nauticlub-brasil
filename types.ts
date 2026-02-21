
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
  status: BoatStatus;
  images: string[];
  specs: {
    pax: number;
    engine: string;
    hours?: number;
  };
  featured?: boolean;
}

export interface BrandPartner {
  id: string;
  name: string;
  logo: string;
  description: string;
  category: string;
}

export interface Lead {
  name: string;
  email: string;
  phone: string;
  message: string;
  boatId?: string;
  type: 'INTEREST' | 'SELL' | 'INSPECTION' | 'SHIPYARD';
}
