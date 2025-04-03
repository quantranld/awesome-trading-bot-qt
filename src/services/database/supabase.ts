import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { AppConfig } from '../../types';
import { DatabaseProvider, DatabaseError } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY;

export class SupabaseProvider implements DatabaseProvider {
  private client: SupabaseClient;
  private initialized: boolean = false;

  constructor() {
    if (!SUPABASE_URL || !SUPABASE_KEY) {
      throw new Error('Supabase environment variables are missing. Please check your .env file.');
    }
    this.client = createClient(SUPABASE_URL, SUPABASE_KEY);
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;
    
    try {
      // Check connection by making a simple query
      const { error } = await this.client.from('configs').select('*').limit(1);
      
      if (error) {
        if (error.code === '42P01') {
          // Table doesn't exist, create it
          // await this.ensureConfigTableExists();
        } else {
          throw this.formatError(error);
        }
      }
      
      this.initialized = true;
      console.log('Supabase connection initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Supabase connection:', error);
      throw new Error('Failed to connect to database. Please check your connection settings.');
    }
  }

  private async ensureConfigTableExists(): Promise<void> {
    try {
      // Create the configs table if it doesn't exist
      const { error } = await this.client.rpc('create_configs_table_if_not_exists');
      
      if (error) {
        console.error('Error creating configs table:', error);
        throw new Error('Failed to create required database tables. Please check your database permissions.');
      }
    } catch (error) {
      console.error('Error ensuring configs table exists:', error);
      throw new Error('Database setup failed. Please check your database permissions and connection.');
    }
  }

  async saveUserConfig(userId: string, config: AppConfig): Promise<void> {
    try {
      await this.ensureInitialized();
      
      // Check if user config exists
      const { data: existingConfig, error: fetchError } = await this.client
        .from('configs')
        .select('id')
        .eq('type', 'user')
        .eq('user_id', userId)
        .single();
      
      if (fetchError && fetchError.code !== 'PGRST116') {
        throw this.formatError(fetchError);
      }
      
      if (existingConfig) {
        // Update existing user config
        const { error } = await this.client
          .from('configs')
          .update({ config, updated_at: new Date().toISOString() })
          .eq('id', existingConfig.id);
        
        if (error) throw this.formatError(error);
      } else {
        // Create new user config
        const { error } = await this.client
          .from('configs')
          .insert({
            type: 'user',
            user_id: userId,
            config,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        
        if (error) throw this.formatError(error);
      }
    } catch (error) {
      console.error('Error saving user config:', error);
      throw new Error('Failed to save user configuration. Please try again later.');
    }
  }

  private formatError(error: any): DatabaseError {
    console.error('Database error:', error);
    return {
      code: error.code || 'UNKNOWN_ERROR',
      message: error.message || 'An unexpected database error occurred',
      details: error.details
    };
  }

  async disconnect(): Promise<void> {
    // Supabase client doesn't require explicit disconnection
    this.initialized = false;
  }

  async getDefaultConfig(): Promise<AppConfig | null> {
    try {
      await this.ensureInitialized();
      
      // First, check if the configs table exists
      await this.ensureConfigTableExists();
      
      const { data, error } = await this.client
        .from('configs')
        .select('*')
        .eq('type', 'default')
        .single();
      
      if (error) {
        // If the error is "not found", return null instead of throwing
        if (error.code === 'PGRST116') {
          return null;
        }
        throw this.formatError(error);
      }
      
      return data?.config as AppConfig;
    } catch (error) {
      console.error('Error fetching default config:', error);
      throw error;
    }
  }

  async saveDefaultConfig(config: AppConfig): Promise<void> {
    try {
      await this.ensureInitialized();
      
      // Ensure the configs table exists
      await this.ensureConfigTableExists();
      
      // Check if default config exists
      const { data: existingConfig, error: fetchError } = await this.client
        .from('configs')
        .select('id')
        .eq('type', 'default')
        .single();
      
      if (fetchError && fetchError.code !== 'PGRST116') {
        throw this.formatError(fetchError);
      }
      
      if (existingConfig) {
        // Update existing default config
        const { error } = await this.client
          .from('configs')
          .update({ config, updated_at: new Date().toISOString() })
          .eq('id', existingConfig.id);
        
        if (error) throw this.formatError(error);
      } else {
        // Insert new default config
        const { error } = await this.client
          .from('configs')
          .insert({
            type: 'default',
            config,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        
        if (error) throw this.formatError(error);
      }
    } catch (error) {
      console.error('Error saving default config:', error);
      throw error;
    }
  }

  async getUserConfig(userId: string): Promise<AppConfig | null> {
    try {
      await this.ensureInitialized();
      
      // Ensure the configs table exists
      await this.ensureConfigTableExists();
      
      const { data, error } = await this.client
        .from('configs')
        .select('*')
        .eq('type', 'user')
        .eq('user_id', userId)
        .single();
      
      if (error) {
        // If the error is "not found", return null instead of throwing
        if (error.code === 'PGRST116') {
          return null;
        }
        throw this.formatError(error);
      }
      
      return data?.config as AppConfig;
    } catch (error) {
      console.error(`Error fetching config for user ${userId}:`, error);
      throw error;
    }
  }

  private async ensureInitialized(): Promise<void> {
    if (!this.initialized) {
      await this.initialize();
    }
  }
}
