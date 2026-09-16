import {
  IStorageService,
  StorageProvider,
  UploadOptions,
  FileAssetMetadata
} from './storage.interface';
import { SupabaseStorageProvider } from './supabaseStorage.provider';

export class StorageService implements IStorageService {
  private primaryProvider: StorageProvider;

  constructor(provider?: StorageProvider) {
    this.primaryProvider = provider || new SupabaseStorageProvider();
  }

  public async uploadFile(options: UploadOptions): Promise<FileAssetMetadata> {
    const uploadResult = await this.primaryProvider.upload(options);

    const metadata: FileAssetMetadata = {
      provider: this.primaryProvider.name,
      providerAssetId: uploadResult.providerAssetId,
      assetType: options.assetType || 'DOCUMENT',
      fileType: options.mimeType,
      fileSizeBytes: options.fileBuffer.length,
      storagePath: uploadResult.path,
      publicUrl: uploadResult.publicUrl,
      ownerUserId: options.ownerUserId,
      accessLevel: options.accessLevel || 'PRIVATE'
    };

    return metadata;
  }

  public async downloadFile(storagePath: string): Promise<Buffer> {
    return this.primaryProvider.download(storagePath);
  }

  public async deleteFile(storagePath: string): Promise<void> {
    return this.primaryProvider.delete(storagePath);
  }

  public async getSignedUrl(storagePath: string, expiresInSeconds: number = 3600): Promise<string> {
    return this.primaryProvider.getSignedUrl(storagePath, expiresInSeconds);
  }

  public async registerVideoAsset(params: {
    title: string;
    playbackId: string;
    streamUrl?: string;
    durationSeconds?: number;
    ownerUserId?: string;
    accessLevel?: 'PUBLIC' | 'RESTRICTED' | 'PRIVATE';
  }): Promise<FileAssetMetadata> {
    const metadata: FileAssetMetadata = {
      provider: 'CLOUDFLARE_STREAM',
      providerAssetId: params.playbackId,
      assetType: 'VIDEO',
      fileType: 'video/mp4',
      fileSizeBytes: 0,
      storagePath: `videos/${params.playbackId}`,
      playbackId: params.playbackId,
      streamUrl: params.streamUrl || `https://videodelivery.net/${params.playbackId}/manifest/video.m3u8`,
      ownerUserId: params.ownerUserId,
      accessLevel: params.accessLevel || 'RESTRICTED'
    };

    return metadata;
  }
}

export const storageService = new StorageService();
