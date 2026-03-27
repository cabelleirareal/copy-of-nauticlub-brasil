// src/constants.ts

import { Boat, BrandPartner } from "./types";

/**
 * HERO (IMAGEM PRINCIPAL DO SITE)
 * Substituímos a imagem fake do picsum por imagem real
 */
export const HERO_IMAGE =
  "/images/hero-focker-333.webp";

/**
 * LISTA DE BARCOS
 * (mantive estrutura original, apenas exemplo com imagem atualizada)
 */
export const BOATS: Boat[] = [
  {
    id: "1",
    name: "Focker 333 Gran Turismo",
    type: "Lancha",
    year: 2023,
    size: "33 pés",
    passengers: 12,
    price: 850000,
    status: "available",
    image:
      "/images/hero-focker-333.webp",
    description:
      "Lancha moderna, sofisticada e pronta para navegação de alto padrão.",
  },

  {
    id: "2",
    name: "Intermarine 48",
    type: "Yacht",
    year: 2022,
    size: "48 pés",
    passengers: 14,
    price: 1800000,
    status: "available",
    image:
      "https://picsum.photos/seed/intermarine/600/400",
    description:
      "Elegância e potência para quem busca experiência premium no mar.",
  },
];

/**
 * MARCAS PARCEIRAS
 */
export const BRAND_PARTNERS: BrandPartner[] = [
  {
    id: "1",
    name: "Focker",
    logo: "https://picsum.photos/seed/focker/200/100",
  },
  {
    id: "2",
    name: "Intermarine",
    logo: "https://picsum.photos/seed/intermarine-logo/200/100",
  },
];

/**
 * INFORMAÇÕES DE CONTATO
 */
export const CONTACT_INFO = {
  phone: "+55 47 98903-5173",
  email: "contato@nauticlub.com.br",
  address: "Balneário Camboriú - SC",
};
