import dotenv from 'dotenv';
dotenv.config();

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import path from 'path';

export const VALID_SLOTS = ['polaroid', 'special-memory'] as const;
export type SlotType = (typeof VALID_SLOTS)[number];

export const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/heic',
  'image/heif',
  'image/svg+xml',
];

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function normalizeSlot(slot: unknown): SlotType | null {
  if (!slot || typeof slot !== 'string') return null;
  const s = slot.trim().toLowerCase();
  if (s === 'polaroid' || s === 'slot1' || s === '1' || s === 'photo1') return 'polaroid';
  if (s === 'special-memory' || s === 'special_memory' || s === 'slot2' || s === '2' || s === 'photo2') {
    return 'special-memory';
  }
  return null;
}

export function getSupabaseConfig() {
  const supabaseUrl = process.env.SUPABASE_URL?.trim() || '';
  const supabaseKey = (
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    ''
  ).trim();
  const bucketName = (process.env.SUPABASE_BUCKET || 'birthday-photos').trim();

  return { supabaseUrl, supabaseKey, bucketName };
}

let supabaseClient: SupabaseClient | null = null;

export function isSupabaseConfigured(): boolean {
  const { supabaseUrl, supabaseKey } = getSupabaseConfig();
  return Boolean(supabaseUrl && supabaseKey);
}

export function getSupabase(): SupabaseClient | null {
  const { supabaseUrl, supabaseKey } = getSupabaseConfig();
  if (!supabaseUrl || !supabaseKey) return null;

  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }
  return supabaseClient;
}

let bucketEnsured = false;
export async function ensureBucket(): Promise<void> {
  const client = getSupabase();
  const { bucketName } = getSupabaseConfig();
  if (!client || bucketEnsured) return;

  try {
    const { data: buckets, error } = await client.storage.listBuckets();
    if (!error && buckets) {
      const exists = buckets.some((b) => b.name === bucketName);
      if (!exists) {
        console.log(`[Supabase] Bucket "${bucketName}" not found. Creating public bucket...`);
        const { error: createErr } = await client.storage.createBucket(bucketName, {
          public: true,
          fileSizeLimit: MAX_FILE_SIZE,
        });
        if (createErr) {
          console.warn(`[Supabase] Auto-creating bucket notice: ${createErr.message}`);
        } else {
          console.log(`[Supabase] Bucket "${bucketName}" created successfully.`);
        }
      }
    }
    bucketEnsured = true;
  } catch (err) {
    console.warn('[Supabase] Warning during bucket check:', err);
    bucketEnsured = true;
  }
}

export interface SlotPhotosResponse {
  polaroid: string | null;
  'special-memory': string | null;
}

/**
 * Retrieves the currently active photo URLs for each slot.
 */
export async function getSlotPhotos(): Promise<SlotPhotosResponse> {
  const result: SlotPhotosResponse = {
    polaroid: null,
    'special-memory': null,
  };

  const client = getSupabase();
  const { bucketName } = getSupabaseConfig();
  if (!client) {
    return result;
  }

  await ensureBucket();

  try {
    const { data: files, error } = await client.storage
      .from(bucketName)
      .list('slots', {
        sortBy: { column: 'name', order: 'desc' },
      });

    if (!error && files && files.length > 0) {
      for (const slot of VALID_SLOTS) {
        const matching = files
          .filter((f) => f.name.startsWith(`${slot}-`))
          .sort((a, b) => b.name.localeCompare(a.name));

        if (matching.length > 0) {
          const newest = matching[0];
          const { data: urlData } = client.storage
            .from(bucketName)
            .getPublicUrl(`slots/${newest.name}`);

          if (urlData?.publicUrl) {
            result[slot] = urlData.publicUrl;
          }
        }
      }
    }
  } catch (err) {
    console.error('[Supabase] Error listing files from bucket:', err);
  }

  // Optional: Check photo_slots table if it exists
  try {
    const { data: dbRows, error: dbErr } = await client
      .from('photo_slots')
      .select('slot, image_url')
      .in('slot', ['polaroid', 'special-memory']);

    if (!dbErr && dbRows && dbRows.length > 0) {
      for (const row of dbRows) {
        if (row.slot === 'polaroid' && row.image_url) {
          result.polaroid = row.image_url;
        } else if (row.slot === 'special-memory' && row.image_url) {
          result['special-memory'] = row.image_url;
        }
      }
    }
  } catch {
    // Optional table
  }

  return result;
}

/**
 * Uploads an image to Supabase Storage for the specified slot,
 * cleans up any previously uploaded images for that slot, and returns the new public URL.
 */
export async function uploadSlotPhoto(
  slot: SlotType,
  fileBuffer: Buffer,
  mimeType: string,
  originalName?: string
): Promise<{ url: string }> {
  const client = getSupabase();
  const { bucketName, supabaseUrl } = getSupabaseConfig();

  if (!client) {
    throw new Error(
      'Supabase credentials are not configured. Please ensure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are defined in your .env file.'
    );
  }

  await ensureBucket();

  let ext = '';
  if (originalName) {
    ext = path.extname(originalName).toLowerCase();
  }
  if (!ext) {
    if (mimeType === 'image/jpeg') ext = '.jpg';
    else if (mimeType === 'image/png') ext = '.png';
    else if (mimeType === 'image/webp') ext = '.webp';
    else if (mimeType === 'image/gif') ext = '.gif';
    else ext = '.png';
  }

  // 1. Collect old files for this slot to delete after upload
  let oldFilesToRemove: string[] = [];
  try {
    const { data: existingFiles } = await client.storage.from(bucketName).list('slots');
    if (existingFiles && existingFiles.length > 0) {
      oldFilesToRemove = existingFiles
        .filter((f) => f.name.startsWith(`${slot}-`))
        .map((f) => `slots/${f.name}`);
    }
  } catch (err) {
    console.warn('[Supabase] Could not list existing files for cleanup:', err);
  }

  // 2. Upload new file with unique timestamp
  const newFileName = `slots/${slot}-${Date.now()}${ext}`;
  const { error: uploadError } = await client.storage
    .from(bucketName)
    .upload(newFileName, fileBuffer, {
      contentType: mimeType,
      upsert: true,
    });

  if (uploadError) {
    throw new Error(`Failed to upload to Supabase Storage: ${uploadError.message}`);
  }

  // 3. Obtain public URL
  const { data: urlData } = client.storage.from(bucketName).getPublicUrl(newFileName);
  const finalUrl = urlData.publicUrl;

  // 4. Remove previous images for this slot
  if (oldFilesToRemove.length > 0) {
    try {
      await client.storage.from(bucketName).remove(oldFilesToRemove);
    } catch (cleanupErr) {
      console.warn('[Supabase] Warning while cleaning up older slot images:', cleanupErr);
    }
  }

  // 5. Optionally record in photo_slots table if it exists
  try {
    await client.from('photo_slots').upsert(
      {
        slot,
        image_url: finalUrl,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'slot' }
    );
  } catch {
    // Optional table
  }

  return { url: finalUrl };
}
