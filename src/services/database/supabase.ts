import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { AppConfig } from '../../types';
import { DatabaseProvider, DatabaseError } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://ihdtrwgadryvwvotutev.supabase.co';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY;

export class SupabaseProvider implements DatabaseProvider {
  private client: SupabaseClient;
  private initialized: boolean = false;

  constructor() {
    if (!SUPABASE_KEY) {
      console.error('Supabase API key is missing. Please check your environment variables.');
    }
    this.client = createClient(SUPABASE_URL, SUPABASE_KEY || '');
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;
    
    try {
      // Check connection by making a simple query
      // Instead of checking for a specific table that might not exist yet,
      // just check if we can connect to Supabase at all
      const { data, error } = await this.client.from('_dummy_query').select('*').limit(1);
      
      // This will error with a 404, but that's expected and means the connection works
      if (error && error.code !== '42P01' && error.code !== 'PGRST116') {
        console.error('Unexpected error during initialization:', error);
        throw this.formatError(error);
      }
      
      this.initialized = true;
      console.log('Supabase connection initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Supabase connection:', error);
      throw error;
    }
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

  async saveUserConfig(userId: string, config: AppConfig): Promise<void> {
    try {
      await this.ensureInitialized();
      
      // Ensure the configs table exists
      await this.ensureConfigTableExists();
      
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
        // Insert new user config
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
      console.error(`Error saving config for user ${userId}:`, error);
      throw error;
    }
  }

  // Helper method to ensure the configs table exists
  private async ensureConfigTableExists(): Promise<void> {
    try {
      // Check if the configs table exists by querying it
      const { error } = await this.client.from('configs').select('count', { count: 'exact', head: true });
      
      if (error) {
        if (error.code === '42P01') { // Table doesn't exist
          // Create the configs table
          // Note: This is a simplified approach. In a real app, you'd use migrations
          // or Supabase's SQL editor to create tables properly
          const { error: createError } = await this.client.rpc('create_configs_table');
          
          if (createError) {
            console.error('Failed to create configs table:', createError);
            throw this.formatError(createError);
          }
        } else {
          throw this.formatError(error);
        }
      }
    } catch (error) {
      console.error('Error ensuring configs table exists:', error);
      throw error;
    }
  }

  private async ensureInitialized(): Promise<void> {
    if (!this.initialized) {
      await this.initialize();
    }
  }

  private formatError(error: any): DatabaseError {
    return {
      code: error.code || 'UNKNOWN_ERROR',
      message: error.message || 'An unknown error occurred',
      details: error.details || undefined
    };
  }
}
