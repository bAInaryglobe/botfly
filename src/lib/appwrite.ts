import { Client, Account, Databases, ID } from 'appwrite';

const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;

if (!projectId || !endpoint) {
  throw new Error('Appwrite environment variables are not set.');
}

const client = new Client();
client.setEndpoint(endpoint).setProject(projectId);

export const account = new Account(client);
export const databases = new Databases(client);
export { ID };

// --- Account (Auth) Wrappers ---
export async function register(email: string, password: string, name?: string) {
  return account.create(ID.unique(), email, password, name);
}

export async function login(email: string, password: string) {
  return account.createEmailPasswordSession(email, password);
}

export async function logout() {
  return account.deleteSession('current');
}

export async function getCurrentUser() {
  return account.get();
}

// --- Database Wrappers ---
export async function createDocument<T>(
  databaseId: string,
  collectionId: string,
  data: T,
  permissions?: string[]
) {
  return databases.createDocument(databaseId, collectionId, ID.unique(), data, permissions);
}

export async function getDocument<T>(
  databaseId: string,
  collectionId: string,
  documentId: string
) {
  return databases.getDocument<T>(databaseId, collectionId, documentId);
}

export async function updateDocument<T>(
  databaseId: string,
  collectionId: string,
  documentId: string,
  data: Partial<T>,
  permissions?: string[]
) {
  return databases.updateDocument(databaseId, collectionId, documentId, data, permissions);
}

export async function deleteDocument(
  databaseId: string,
  collectionId: string,
  documentId: string
) {
  return databases.deleteDocument(databaseId, collectionId, documentId);
}

export async function listDocuments<T>(
  databaseId: string,
  collectionId: string,
  queries?: string[],
  limit?: number,
  offset?: number
) {
  return databases.listDocuments<T>(databaseId, collectionId, queries, limit, offset);
}
