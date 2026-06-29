import { OperationsCommandCenterView } from "../types/operations.types";

export const OPERATIONS_FEATURE_KEY = 'operations';

export interface OperationsState {
  commandCenter: OperationsCommandCenterView | null;
  loading: boolean;
  error: string | null;
}

export const initialOperationsState: OperationsState = {
  commandCenter: null,
  loading: false,
  error: null,
};