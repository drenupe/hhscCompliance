// libs/shared-models/src/lib/provider.model.ts
export type ProviderStatus = 'ACTIVE' | 'INACTIVE';

export interface ProviderDto {
  id: string;
  name: string;

  // Hardened identifiers
  contractNumber: string | null; // 9 digits (HHSC/contract/provider number)
  componentCode: string | null;  // 3 digits
  npi: string | null;            // 10 digits
  ein: string | null;            // 9 digits

  // Location
  address: string | null;
  city: string | null;
  state: string | null; // DB default 'TX'
  zip: string | null;

  status: ProviderStatus;

  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpsertProviderInput {
  name: string;

  // Optional on PATCH/POST (server can default/normalize)
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
