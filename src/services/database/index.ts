import { DatabaseProvider } from './types';
import { SupabaseProvider } from './supabase';

// Factory function to create the appropriate database provider
export function createDatabaseProvider(): DatabaseProvider {
  // Currently we're using Supabase, but this could be changed to another provider
  return new SupabaseProvider();
}

// Singleton instance of the database provider
let dbProviderInstance: DatabaseProvider | null = null;

// Get the database provider instance (creates it if it doesn't exist)
export function getDatabaseProvider(): DatabaseProvider {
  if (!dbProviderInstance) {
    dbProviderInstance = createDatabaseProvider();
  }
  return dbProviderInstance;
}

// Helper functions that use the database provider

// Load the default configuration
export async function loadDefaultConfig() {
  const provider = getDatabaseProvider();
  try {
    await provider.initialize();
    return await provider.getDefaultConfig();
  } catch (error) {
    console.error('Failed to load default configuration:', error);
    throw error;
  }
}

// Save the default configuration
export async function saveDefaultConfig(config: any) {
  const provider = getDatabaseProvider();
  try {
    await provider.initialize();
    await provider.saveDefaultConfig(config);
  } catch (error) {
    console.error('Failed to save default configuration:', error);
    throw error;
  }
}

// Load a user's configuration
export async function loadUserConfig(userId: string) {
  const provider = getDatabaseProvider();
  try {
    await provider.initialize();
    return await provider.getUserConfig(userId);
  } catch (error) {
    console.error(`Failed to load configuration for user ${userId}:`, error);
    throw error;
  }
}

// Save a user's configuration
export async function saveUserConfig(userId: string, config: any) {
  const provider = getDatabaseProvider();
  try {
    await provider.initialize();
    await provider.saveUserConfig(userId, config);
  } catch (error) {
    console.error(`Failed to save configuration for user ${userId}:`, error);
    throw error;
  }
}
