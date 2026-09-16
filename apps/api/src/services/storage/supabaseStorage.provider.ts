import { StorageProvider, StorageProviderType, UploadOptions } from './storage.interface';
import { supabaseAdmin } from '../../lib/supabase';

export class SupabaseStorageProvider implements StorageProvider {
  public name: StorageProviderType = 'SUPABASE';
  private bucketName: string;

  constructor(bucketName: string = 'academy-assets') {
    this.bucketName = bucketName;
  }

  public async upload(options: UploadOptions): Promise<{ path: string; publicUrl?: string; providerAssetId?: string }> {
    if (!supabaseAdmin) {
      // Local development simulation fallback
      return {
        path: options.path,
        publicUrl: `https://local-simulation.dpskilltech.internal/storage/${options.path}`,
        providerAssetId: `sim_${Date.now()}`
      };
    }

    const { data, error } = await supabaseAdmin.storage
      .from(this.bucketName)
      .upload(options.path, options.fileBuffer, {
        contentType: options.mimeType,
        upsert: true
      });

    if (error) {
      throw new Error(`Supabase storage upload failed: ${error.message}`);
    }

    const { data: publicUrlData } = supabaseAdmin.storage
      .from(this.bucketName)
      .getPublicUrl(data.path);

    return {
      path: data.path,
      publicUrl: publicUrlData.publicUrl,
      providerAssetId: data.id || data.path
    };
  }

  public async download(path: string): Promise<Buffer> {
    if (!supabaseAdmin) {
      return Buffer.from('simulated file content');
    }

    const { data, error } = await supabaseAdmin.storage
      .from(this.bucketName)
      .download(path);

    if (error || !data) {
      throw new Error(`Supabase storage download failed: ${error?.message || 'No data'}`);
    }

    const arrayBuffer = await data.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

  public async delete(path: string): Promise<void> {
    if (!supabaseAdmin) return;

    const { error } = await supabaseAdmin.storage
      .from(this.bucketName)
      .remove([path]);

    if (error) {
      throw new Error(`Supabase storage delete failed: ${error.message}`);
    }
  }

  public async getSignedUrl(path: string, expiresInSeconds: number): Promise<string> {
    if (!supabaseAdmin) {
      return `https://local-simulation.dpskilltech.internal/signed/${path}?expires=${Date.now() + expiresInSeconds * 1000}`;
    }

    const { data, error } = await supabaseAdmin.storage
      .from(this.bucketName)
      .createSignedUrl(path, expiresInSeconds);

    if (error || !data) {
      throw new Error(`Failed to generate signed URL: ${error?.message || 'Unknown error'}`);
    }

    return data.signedUrl;
  }

  public async getMetadata(path: string): Promise<{ size: number; mimeType: string; lastModified: Date }> {
    return {
      size: 0,
      mimeType: 'application/octet-stream',
      lastModified: new Date()
    };
  }
}
