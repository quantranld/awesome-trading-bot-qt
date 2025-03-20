import { AppConfig } from '../../types';

export interface DatabaseProvider {
  // Configuration operations
  getDefaultConfig(): Promise<AppConfig | null>;
  saveDefaultConfig(config: AppConfig): Promise<void>;
  
  // User configuration operations
  getUserConfig(userId: string): Promise<AppConfig | null>;
  saveUserConfig(userId: string, config: AppConfig): Promise<void>;
  
  // Connection management
  initialize(): Promise<void>;
  disconnect(): Promise<void>;
}

export interface DatabaseError {
  code: string;
  message: string;
  details?: string;
}
