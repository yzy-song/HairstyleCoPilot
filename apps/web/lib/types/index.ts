export interface User {
  sub: number;
  email: string;
  role: 'salon' | 'stylist';
  salonId?: number;
  name?: string;
}

export interface Salon {
  id: number;
  email: string;
  salonName: string | null;
  createdAt: string;
}

export interface Client {
  id: number;
  name: string;
  notes: string | null;
  clientPhotoUrl: string | null;
  salonId: number;
  createdAt: string;
  updatedAt: string;
}

export interface HairstyleTemplate {
  id: number;
  name: string;
  description: string | null;
  imageUrl: string;
  modelKey: string;
  aiParameters: Record<string, unknown>;
  tags: Tag[];
  createdAt: string;
}

export interface Consultation {
  id: number;
  notes: string | null;
  status: 'TEMPORARY' | 'SAVED';
  clientId: number;
  stylistId: number;
  createdAt: string;
  client?: Client;
  stylist?: { id: number; name: string };
  generatedImages?: GeneratedImage[];
  tags?: Tag[];
}

export interface GeneratedImage {
  id: number;
  imageUrl: string;
  sourceImageUrl: string | null;
  notes: string | null;
  consultationId: number;
  hairstyleTemplateId: number | null;
  createdAt: string;
}

export interface Tag {
  id: number;
  name: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    lastPage: number;
  };
}
