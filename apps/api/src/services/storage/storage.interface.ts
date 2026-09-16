/**
 * Storage Abstraction Layer for DP Skill Tech Academy
 * Decouples file & video management from Supabase Storage so Cloudflare R2 /
 * Cloudflare Stream can be swapped in later without modifying application logic.
 */

export type StorageAccessLevel = 'PUBLIC' | 'RESTRICTED' | 'PRIVATE';
export type StorageProviderType = 'SUPABASE' | 'CLOUDFLARE_R2' | 'CLOUDFLARE_STREAM' | 'LOCAL_SIMULATION';
export type AssetCategory = 'DOCUMENT' | 'IMAGE' | 'VIDEO' | 'ARCHIVE';

export interface FileAssetMetadata {
  id?: string;
  provider: StorageProviderType;
  providerAssetId?: string;
  assetType: AssetCategory;
  fileType: string;
  fileSizeBytes: number;
  storagePath: string;
  publicUrl?: string;
  playbackId?: string; // Cloudflare Stream playback ID
  streamUrl?: string;  // HLS/DASH manifest or signed streaming URL
  ownerUserId?: string;
  accessLevel: StorageAccessLevel;
}

export interface UploadOptions {
  path: string;
  fileBuffer: Buffer;
  mimeType: string;
  assetType?: AssetCategory;
  accessLevel?: StorageAccessLevel;
  ownerUserId?: string;
}

export interface StorageProvider {
  name: StorageProviderType;
  upload(options: UploadOptions): Promise<{ path: string; publicUrl?: string; providerAssetId?: string }>;
  download(path: string): Promise<Buffer>;
  delete(path: string): Promise<void>;
  getSignedUrl(path: string, expiresInSeconds: number): Promise<string>;
  getMetadata(path: string): Promise<{ size: number; mimeType: string; lastModified: Date }>;
}

export interface IStorageService {
  uploadFile(options: UploadOptions): Promise<FileAssetMetadata>;
  downloadFile(storagePath: string): Promise<Buffer>;
  deleteFile(storagePath: string): Promise<void>;
  getSignedUrl(storagePath: string, expiresInSeconds?: number): Promise<string>;
  registerVideoAsset(params: {
    title: string;
    playbackId: string;
    streamUrl?: string;
    durationSeconds?: number;
    ownerUserId?: string;
    accessLevel?: StorageAccessLevel;
  }): Promise<FileAssetMetadata>;
}
