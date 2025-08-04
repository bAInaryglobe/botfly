import { Client, Account, Databases, ID, Models } from 'appwrite';

// --- Environment Variables ---
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'core';

if (!projectId || !endpoint || !databaseId) {
  throw new Error('Appwrite environment variables are not set.');
}

// --- Singleton Client ---
const client = new Client();
client.setEndpoint(endpoint).setProject(projectId);

export const account = new Account(client);
export const databases = new Databases(client);
export { ID };

// --- Collection ID Utilities ---
export const COLLECTION_IDS = {
  users: process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID || 'users',
  projects: process.env.NEXT_PUBLIC_APPWRITE_PROJECTS_COLLECTION_ID || 'projects',
  agents: process.env.NEXT_PUBLIC_APPWRITE_AGENTS_COLLECTION_ID || 'agents',
  messages: process.env.NEXT_PUBLIC_APPWRITE_MESSAGES_COLLECTION_ID || 'messages',
  settings: process.env.NEXT_PUBLIC_APPWRITE_SETTINGS_COLLECTION_ID || 'settings',
  bots: process.env.NEXT_PUBLIC_APPWRITE_BOTS_COLLECTION_ID || 'bots',
};

export { databaseId };

// --- Account (Auth) Wrappers ---
/**
 * Register a new user with email and password.
 */
export async function register(email: string, password: string, name?: string): Promise<Models.User<Models.Preferences> | Error> {
  try {
    return await account.create(ID.unique(), email, password, name);
  } catch (err) {
    return err instanceof Error ? err : new Error(String(err));
  }
}

/**
 * Log in a user with email and password.
 */
export async function login(email: string, password: string): Promise<Models.Session | Error> {
  try {
    return await account.createEmailPasswordSession(email, password);
  } catch (err) {
    return err instanceof Error ? err : new Error(String(err));
  }
}

/**
 * Log out the current user.
 */
export async function logout(): Promise<void | Error> {
  try {
    await account.deleteSession('current');
  } catch (err) {
    return err instanceof Error ? err : new Error(String(err));
  }
}

/**
 * Get the currently logged-in user.
 */
export async function getCurrentUser(): Promise<Models.User<Models.Preferences> | null | Error> {
  try {
    return await account.get();
  } catch (err) {
    // Not logged in returns error
    if (err && typeof err === 'object' && 'code' in err && (err as any).code === 401) return null;
    return err instanceof Error ? err : new Error(String(err));
  }
}

// --- Database Wrappers ---
/**
 * Create a new document in a collection.
 */
export async function createDocument(
  databaseId: string,
  collectionId: string,
  data: Record<string, unknown>,
  permissions?: string[]
): Promise<Models.Document | Error> {
  try {
    return await databases.createDocument(databaseId, collectionId, ID.unique(), data, permissions);
  } catch (err) {
    return err instanceof Error ? err : new Error(String(err));
  }
}

/**
 * Get a document by ID.
 */
export async function getDocument(
  databaseId: string,
  collectionId: string,
  documentId: string
): Promise<Models.Document | Error> {
  try {
    return await databases.getDocument(databaseId, collectionId, documentId);
  } catch (err) {
    return err instanceof Error ? err : new Error(String(err));
  }
}

/**
 * Update a document by ID.
 */
export async function updateDocument(
  databaseId: string,
  collectionId: string,
  documentId: string,
  data: Record<string, unknown>,
  permissions?: string[]
): Promise<Models.Document | Error> {
  try {
    return await databases.updateDocument(databaseId, collectionId, documentId, data, permissions);
  } catch (err) {
    return err instanceof Error ? err : new Error(String(err));
  }
}

/**
 * Delete a document by ID.
 */
export async function deleteDocument(
  databaseId: string,
  collectionId: string,
  documentId: string
): Promise<boolean | Error> {
  try {
    await databases.deleteDocument(databaseId, collectionId, documentId);
    return true;
  } catch (err) {
    return err instanceof Error ? err : new Error(String(err));
  }
}

/**
 * List documents in a collection.
 */
export async function listDocuments(
  databaseId: string,
  collectionId: string,
  queries?: string[]
): Promise<Models.DocumentList<Models.Document> | Error> {
  try {
    return await databases.listDocuments(databaseId, collectionId, queries);
  } catch (err) {
    return err instanceof Error ? err : new Error(String(err));
  }
}
