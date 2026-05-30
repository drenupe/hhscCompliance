import { ProviderDto } from "@hhsc-compliance/shared-models";

export const PROVIDERS_FEATURE_KEY = 'providers';

export interface ProvidersState {
  items: ProviderDto[];
  loading: boolean;
  saving: boolean;
  error: string | null;

  selectedProviderId: string | null;
}

export interface ProvidersPartialState {
  readonly [PROVIDERS_FEATURE_KEY]: ProvidersState;
}

export const initialProvidersState: ProvidersState = {
  items: [],
  loading: false,
  saving: false,
  error: null,
  selectedProviderId: null,
};
