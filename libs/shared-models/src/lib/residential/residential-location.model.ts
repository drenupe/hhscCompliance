export type ResidentialType = 'THREE_PERSON' | 'FOUR_PERSON' | 'HOST_HOME';
export type RecordStatus = 'ACTIVE' | 'INACTIVE';


export interface ResidentialLocationDto {
  id: string;
  providerId: string;
  locationCode : string;
  name: string;
  type: ResidentialType;

  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;

  status: RecordStatus;

  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpsertResidentialLocationInput {
  name: string;
  type: ResidentialType;
  locationCode : string;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;

  status?: RecordStatus;
}
