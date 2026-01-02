
export enum UserRole {
  AUDITOR = 'Auditor',
  MANAGER = 'Manager',
  ADMIN = 'Administrator'
}

export interface FieldDefinition {
  id: string;
  label: string;
  type: 'number' | 'text' | 'select';
  unit?: string;
  options?: string[];
  placeholder?: string;
  weight?: number; // Used for carbon calculation logic
}

export interface Product {
  id: string;
  name: string;
  code: number;
}

export interface Category {
  id: string;
  name: string;
  code: number;
  icon: string;
  description: string;
  roles: string[];
  roleFields: Record<string, FieldDefinition[]>; // Map role name to its specific inputs
  products: Product[];
}

export interface BaseData {
  actorType: string;
  notes?: string;
  batchId: string;
  productCode?: number;
  chainId?: string;
  envScore?: number;
}

export interface StageData extends BaseData {
  [key: string]: any;
}

export interface TrustAnalysis {
  trustScore: number;
  anomalies: string[];
  suggestions: string[];
  isVerified: boolean;
}

export interface Block {
  index: number;
  timestamp: number;
  actor: string;
  category: string;
  batchId: string;
  chainId: string;
  productCode: number;
  data: StageData;
  emissions: number;
  cumulativeEmissions: number;
  previousHash: string;
  hash: string;
  trustAnalysis?: TrustAnalysis;
  isTampered?: boolean;
}

export type MultiChainState = Record<string, Record<string, Block[]>>;
