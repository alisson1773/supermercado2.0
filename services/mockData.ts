import { Category, Product } from '../types';

export const CATEGORIES: Category[] = [
  { id: '1', name: 'Hortifruti', slug: 'hortifruti', image: 'https://picsum.photos/seed/fruit/200/200' },
  { id: '2', name: 'Carnes', slug: 'carnes', image: 'https://picsum.photos/seed/meat/200/200' },
  { id: '3', name: 'Bebidas', slug: 'bebidas', image: 'https://picsum.photos/seed/drink/200/200' },
  { id: '4', name: 'Padaria', slug: 'padaria', image: 'https://picsum.photos/seed/bread/200/200' },
  { id: '5', name: 'Limpeza', slug: 'limpeza', image: 'https://picsum.photos/seed/clean/200/200' },
];

export const PRODUCTS: Product[] = [
  // Hortifruti
  { id: '101', categoryId: '1', name: 'Maçã Fuji', description: 'Maçã fresca e doce', longDescription: 'Maçãs Fuji selecionadas, perfeitas para lanches saudáveis e sobremesas. Origem controlada.', price: 8.90, unit: 'kg', image: 'https://picsum.photos/seed/apple/300/300' },
  { id: '102', categoryId: '1', name: 'Banana Prata', description: 'Cacho maduro', longDescription: 'Bananas prata ricas em potássio. Ideais para consumo in natura ou vitaminas.', price: 5.50, unit: 'kg', image: 'https://picsum.photos/seed/banana/300/300' },
  { id: '103', categoryId: '1', name: 'Alface Americana', description: 'Fresca e crocante', longDescription: 'Alface hidropônica lavada e pronta para consumo.', price: 3.50, unit: 'un', image: 'https://picsum.photos/seed/lettuce/300/300' },

  // Carnes
  { id: '201', categoryId: '2', name: 'Picanha Bovina', description: 'Peça nobre', longDescription: 'Picanha maturada, capa de gordura uniforme. Ideal para churrasco.', price: 89.90, unit: 'kg', image: 'https://picsum.photos/seed/steak/300/300' },
  { id: '202', categoryId: '2', name: 'Filé de Frango', description: 'Cortes limpos', longDescription: 'Filé de peito de frango sem osso e sem pele, congelado individualmente.', price: 19.90, unit: 'kg', image: 'https://picsum.photos/seed/chicken/300/300' },

  // Bebidas
  { id: '301', categoryId: '3', name: 'Suco de Laranja', description: '100% Natural', longDescription: 'Suco de laranja integral sem adição de açúcares. Garrafa 1L.', price: 12.00, unit: 'un', image: 'https://picsum.photos/seed/juice/300/300' },
  { id: '302', categoryId: '3', name: 'Cerveja Premium', description: 'Long Neck', longDescription: 'Cerveja puro malte, leve e refrescante. Pack com 6 unidades.', price: 29.90, unit: 'pack', image: 'https://picsum.photos/seed/beer/300/300' },

  // Padaria
  { id: '401', categoryId: '4', name: 'Pão Francês', description: 'Assado na hora', longDescription: 'Tradicional pão francês crocante por fora e macio por dentro.', price: 15.90, unit: 'kg', image: 'https://picsum.photos/seed/bread2/300/300' },
  { id: '402', categoryId: '4', name: 'Bolo de Chocolate', description: 'Recheio cremoso', longDescription: 'Bolo caseiro de chocolate com cobertura de ganache.', price: 25.00, unit: 'un', image: 'https://picsum.photos/seed/cake/300/300' },
  
  // Limpeza
  { id: '501', categoryId: '5', name: 'Detergente Líquido', description: 'Neutro', longDescription: 'Detergente concentrado, alto rendimento. 500ml.', price: 2.50, unit: 'un', image: 'https://picsum.photos/seed/soap/300/300' },
];