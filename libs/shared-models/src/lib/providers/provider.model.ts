// libs/shared-models/src/lib/provider.model.ts

export type ProviderStatus = 'ACTIVE' | 'INACTIVE';

export interface ProviderDto {
  id: string;
  name: string;

  contractNumber: string | null;
  componentCode: string | null;
  npi: string | null;
  ein: string | null;

  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;

  status: ProviderStatus;

  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProviderDto {
  name: string;

  contractNumber?: string | null;
  componentCode?: string | null;
  npi?: string | null;
  ein?: string | null;

  address?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;

  status?: ProviderStatus;
}

export interface UpdateProviderDto {
  name?: string;

  contractNumber?: string | null;
  componentCode?: string | null;
  npi?: string | null;
  ein?: string | null;

  address?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;

  status?: ProviderStatus;
}