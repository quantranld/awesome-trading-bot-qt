import { SupabaseProvider } from './supabase';
import { DatabaseProvider } from './types';

// Create a singleton instance of the database provider
const databaseProvider: DatabaseProvider = new SupabaseProvider();

// Initialize the database connection when the module is imported
databaseProvider.initialize().catch(error => {
  console.error('Failed to initialize database connection:', error);
});

// Export the database provider instance
export default databaseProvider;
