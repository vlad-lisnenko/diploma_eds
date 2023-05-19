export type TokenSummary = {
  expired?: boolean;
  valid: boolean;
  email?: string;
  userAuthorities: string[];
}