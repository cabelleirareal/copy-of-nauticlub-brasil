
import { Boat, BoatStatus, BrandPartner } from './types';

export const BOATS: Boat[] = [
  {
    id: '1',
    name: 'Azimut 60 Flybridge',
    brand: 'Azimut Yachts',
    year: 2023,
    size: 60,
    price: 'Sob consulta',
    type: 'Yachts',
    status: BoatStatus.AVAILABLE,
    images: ['https://picsum.photos/seed/boat1/800/600'],
    specs: { pax: 12, engine: 'Volvo Penta 900hp' },
    featured: true
  },
  {
    id: '2',
    name: 'Focker 305 GTS',
    brand: 'Fibrafort',
    year: 2021,
    size: 30,
    price: 890000,
    type: 'Cruiser',
    status: BoatStatus.AVAILABLE,
    images: ['https://picsum.photos/seed/boat2/800/600'],
    specs: { pax: 10, engine: 'Mercruiser 300hp' },
    featured: true
  },
  {
    id: '3',
    name: 'Sea Ray 250 SLX',
    brand: 'Sea Ray',
    year: 2024,
    size: 25,
    price: 'Sob consulta',
    type: 'Sport',
    status: BoatStatus.AVAILABLE,
    images: ['https://picsum.photos/seed/boat3/800/600'],
    specs: { pax: 8, engine: 'Mercury 250hp' },
    featured: false
  },
  {
    id: '4',
    name: 'Phantom 400',
    brand: 'Schaefer Yachts',
    year: 2018,
    size: 40,
    price: 1450000,
    type: 'Cruiser',
    status: BoatStatus.AVAILABLE,
    images: ['https://picsum.photos/seed/boat4/800/600'],
    specs: { pax: 14, engine: 'Dual Volvo D6' },
    featured: false
  }
];

export const BRANDS: BrandPartner[] = [
  {
    id: 'starlink',
    name: 'Starlink Maritime',
    logo: 'https://picsum.photos/seed/starlink/200/100',
    description: 'Internet de alta velocidade em qualquer lugar do oceano.',
    category: 'Tecnologia'
  },
  {
    id: 'scooby',
    name: 'Skuld Eletric Boards',
    logo: 'https://picsum.photos/seed/scooby/200/100',
    description: 'Pranchas de performance assinadas pelo campeão Pedro Scooby.',
    category: 'Lazer'
  },
  {
    id: 'raymarine',
    name: 'Raymarine',
    logo: 'https://picsum.photos/seed/raymarine/200/100',
    description: 'Eletrônicos náuticos de última geração para navegação segura.',
    category: 'Navegação'
  }
];
