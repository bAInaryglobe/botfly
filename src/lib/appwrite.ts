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
export async function createDocument(
  databaseId: string,
  collectionId: string,
  data: Record<string, unknown>,
  permissions?: string[]
) {
  return databases.createDocument(databaseId, collectionId, ID.unique(), data, permissions);
}

export async function getDocument(
  databaseId: string,
  collectionId: string,
  documentId: string
) {
  return databases.getDocument(databaseId, collectionId, documentId);
}

export async function updateDocument(
  databaseId: string,
  collectionId: string,
  documentId: string,
  data: Record<string, unknown>,
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

export async function listDocuments(
  databaseId: string,
  collectionId: string,
  queries?: string[]
) {
  return databases.listDocuments(databaseId, collectionId, queries);
}
