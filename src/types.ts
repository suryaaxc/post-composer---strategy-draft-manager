export type Platform = 'Twitter' | 'LinkedIn' | 'Instagram';

export interface Draft {
  id: number;
  platform: Platform;
  content: string;
  createdAt: string;
  updatedAt?: string;
}

export interface PlatformConfig {
  name: Platform;
  limit: number;
  label: string;
  color: string;
  bgLight: string;
  borderColor: string;
  placeholder: string;
  tips: string;
}
