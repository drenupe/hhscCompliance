export type RemediationRoute = {
  routeCommands: string[];
  queryParams?: Record<string, string | number | boolean | null>;
};